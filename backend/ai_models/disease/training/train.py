import os
import sys
import json
import torch
import torch.nn as nn
import torch.optim as optim
from torch.cuda.amp import autocast, GradScaler
from torch.utils.tensorboard import SummaryWriter
from tqdm import tqdm

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from configs.config import Config
from utils.dataloader import get_dataloader
from models.model import DiseaseModel

class EarlyStopping:
    def __init__(self, patience=5, min_delta=0):
        self.patience = patience
        self.min_delta = min_delta
        self.counter = 0
        self.best_loss = None
        self.early_stop = False

    def __call__(self, val_loss):
        if self.best_loss is None:
            self.best_loss = val_loss
        elif val_loss > self.best_loss - self.min_delta:
            self.counter += 1
            if self.counter >= self.patience:
                self.early_stop = True
        else:
            self.best_loss = val_loss
            self.counter = 0

def train(resume=False):
    torch.manual_seed(Config.RANDOM_SEED)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")
    
    train_dir = os.path.join(Config.PROCESSED_DATASET_PATH, "train")
    val_dir = os.path.join(Config.PROCESSED_DATASET_PATH, "val")
    
    if not os.path.exists(train_dir):
        print(f"Dataset not found at {train_dir}. Please run split_dataset.py first.")
        return
        
    train_loader, classes = get_dataloader(train_dir, "train", Config)
    val_loader, _ = get_dataloader(val_dir, "val", Config)
    
    num_classes = len(classes)
    with open(os.path.join(Config.MODEL_SAVE_PATH, "classes.json"), "w") as f:
        json.dump(classes, f)
        
    model = DiseaseModel(num_classes=num_classes).to(device)
    
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.AdamW(model.parameters(), lr=Config.LEARNING_RATE)
    scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode='min', patience=3)
    scaler = GradScaler()
    early_stopping = EarlyStopping(patience=7)
    
    writer = SummaryWriter(log_dir=Config.LOGS_PATH)
    
    start_epoch = 0
    best_val_acc = 0.0
    history = {"train_loss": [], "val_loss": [], "train_acc": [], "val_acc": []}
    
    checkpoint_path = os.path.join(Config.MODEL_SAVE_PATH, "checkpoint.pth")
    if resume and os.path.exists(checkpoint_path):
        checkpoint = torch.load(checkpoint_path)
        model.load_state_dict(checkpoint['model_state_dict'])
        optimizer.load_state_dict(checkpoint['optimizer_state_dict'])
        scheduler.load_state_dict(checkpoint['scheduler_state_dict'])
        start_epoch = checkpoint['epoch'] + 1
        best_val_acc = checkpoint['best_val_acc']
        print(f"Resuming training from epoch {start_epoch}")
        
    for epoch in range(start_epoch, Config.EPOCHS):
        model.train()
        running_loss = 0.0
        correct = 0
        total = 0
        
        train_pbar = tqdm(train_loader, desc=f"Epoch {epoch+1}/{Config.EPOCHS} [Train]")
        for images, labels in train_pbar:
            images, labels = images.to(device), labels.to(device)
            
            optimizer.zero_grad()
            
            with autocast():
                outputs = model(images)
                loss = criterion(outputs, labels)
                
            scaler.scale(loss).backward()
            scaler.step(optimizer)
            scaler.update()
            
            running_loss += loss.item() * images.size(0)
            _, predicted = outputs.max(1)
            total += labels.size(0)
            correct += predicted.eq(labels).sum().item()
            
            train_pbar.set_postfix(loss=loss.item(), acc=correct/total)
            
        epoch_train_loss = running_loss / total
        epoch_train_acc = correct / total
        
        # Validation
        model.eval()
        val_loss = 0.0
        val_correct = 0
        val_total = 0
        
        with torch.no_grad():
            val_pbar = tqdm(val_loader, desc=f"Epoch {epoch+1}/{Config.EPOCHS} [Val]")
            for images, labels in val_pbar:
                images, labels = images.to(device), labels.to(device)
                
                with autocast():
                    outputs = model(images)
                    loss = criterion(outputs, labels)
                    
                val_loss += loss.item() * images.size(0)
                _, predicted = outputs.max(1)
                val_total += labels.size(0)
                val_correct += predicted.eq(labels).sum().item()
                
                val_pbar.set_postfix(loss=loss.item(), acc=val_correct/val_total)
                
        epoch_val_loss = val_loss / val_total
        epoch_val_acc = val_correct / val_total
        
        scheduler.step(epoch_val_loss)
        
        writer.add_scalar("Loss/train", epoch_train_loss, epoch)
        writer.add_scalar("Loss/val", epoch_val_loss, epoch)
        writer.add_scalar("Accuracy/train", epoch_train_acc, epoch)
        writer.add_scalar("Accuracy/val", epoch_val_acc, epoch)
        
        history["train_loss"].append(epoch_train_loss)
        history["val_loss"].append(epoch_val_loss)
        history["train_acc"].append(epoch_train_acc)
        history["val_acc"].append(epoch_val_acc)
        
        print(f"Epoch {epoch+1} - Train Loss: {epoch_train_loss:.4f}, Train Acc: {epoch_train_acc:.4f} | Val Loss: {epoch_val_loss:.4f}, Val Acc: {epoch_val_acc:.4f}")
        
        # Save checkpoint
        torch.save({
            'epoch': epoch,
            'model_state_dict': model.state_dict(),
            'optimizer_state_dict': optimizer.state_dict(),
            'scheduler_state_dict': scheduler.state_dict(),
            'best_val_acc': best_val_acc,
        }, checkpoint_path)
        
        # Save best model
        if epoch_val_acc > best_val_acc:
            best_val_acc = epoch_val_acc
            torch.save(model.state_dict(), os.path.join(Config.MODEL_SAVE_PATH, "best_model.pth"))
            print("Saved new best model!")
            
        early_stopping(epoch_val_loss)
        if early_stopping.early_stop:
            print("Early stopping triggered")
            break
            
    with open(os.path.join(Config.LOGS_PATH, "history.json"), "w") as f:
        json.dump(history, f)
        
    writer.close()
    print("Training complete.")

if __name__ == "__main__":
    train(resume="--resume" in sys.argv)
