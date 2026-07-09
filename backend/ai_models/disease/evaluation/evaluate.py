import os
import sys
import json
import torch
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, confusion_matrix
from tqdm import tqdm

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from configs.config import Config
from utils.dataloader import get_dataloader
from models.model import DiseaseModel

def evaluate():
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")
    
    test_dir = os.path.join(Config.PROCESSED_DATASET_PATH, "test")
    if not os.path.exists(test_dir):
        print(f"Test dataset not found at {test_dir}. Run split_dataset.py first.")
        return
        
    test_loader, classes = get_dataloader(test_dir, "test", Config)
    
    num_classes = len(classes)
    model = DiseaseModel(num_classes=num_classes).to(device)
    model_path = os.path.join(Config.MODEL_SAVE_PATH, "best_model.pth")
    
    if not os.path.exists(model_path):
        print(f"Error: Model weights not found at {model_path}")
        return
        
    model.load_state_dict(torch.load(model_path, map_location=device))
    model.eval()
    
    all_preds = []
    all_labels = []
    
    with torch.no_grad():
        for images, labels in tqdm(test_loader, desc="Evaluating"):
            images, labels = images.to(device), labels.to(device)
            outputs = model(images)
            _, predicted = outputs.max(1)
            all_preds.extend(predicted.cpu().numpy())
            all_labels.extend(labels.cpu().numpy())
            
    # Calculate metrics
    accuracy = accuracy_score(all_labels, all_preds)
    precision, recall, f1, _ = precision_recall_fscore_support(all_labels, all_preds, average='weighted', zero_division=0)
    
    cm = confusion_matrix(all_labels, all_preds)
    with np.errstate(divide='ignore', invalid='ignore'):
        per_class_accuracy = np.nan_to_num(cm.diagonal() / cm.sum(axis=1))
    
    metrics = {
        "accuracy": accuracy,
        "precision": precision,
        "recall": recall,
        "f1_score": f1,
        "per_class_accuracy": {classes[i]: per_class_accuracy[i] for i in range(num_classes)}
    }
    
    print(f"\nAccuracy: {accuracy:.4f}")
    print(f"Precision: {precision:.4f}")
    print(f"Recall: {recall:.4f}")
    print(f"F1 Score: {f1:.4f}")
    
    metrics_path = os.path.join(Config.EVALUATION_PATH, "metrics.json")
    with open(metrics_path, "w") as f:
        json.dump(metrics, f, indent=4)
        
    # Plot Confusion Matrix
    plt.figure(figsize=(12, 10))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=classes, yticklabels=classes)
    plt.xlabel('Predicted')
    plt.ylabel('Actual')
    plt.title('Confusion Matrix')
    plt.xticks(rotation=90)
    plt.yticks(rotation=0)
    plt.tight_layout()
    plt.savefig(os.path.join(Config.EVALUATION_PATH, "confusion_matrix.png"))
    plt.close()
    
    print(f"\nEvaluation metrics saved to {Config.EVALUATION_PATH}")

if __name__ == "__main__":
    evaluate()
