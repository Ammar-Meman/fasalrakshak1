import os
import sys
import argparse
import json
import torch
import torch.nn.functional as F
import cv2

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from configs.config import Config
from models.model import DiseaseModel
from utils.augmentations import get_transforms

def predict(image_path):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    
    classes_path = os.path.join(Config.MODEL_SAVE_PATH, "classes.json")
    if not os.path.exists(classes_path):
        print("Classes file not found. Train the model first.")
        return
        
    with open(classes_path, "r") as f:
        classes = json.load(f)
        
    num_classes = len(classes)
    model = DiseaseModel(num_classes=num_classes).to(device)
    model_path = os.path.join(Config.MODEL_SAVE_PATH, "best_model.pth")
    
    if not os.path.exists(model_path):
        print(f"Model file not found at {model_path}. Train the model first.")
        return
        
    model.load_state_dict(torch.load(model_path, map_location=device))
    model.eval()
    
    image = cv2.imread(image_path)
    if image is None:
        print(f"Error loading image {image_path}")
        return
        
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    
    transforms = get_transforms(Config.IMAGE_SIZE, phase="predict")
    image_tensor = transforms(image=image)['image'].unsqueeze(0).to(device)
    
    with torch.no_grad():
        outputs = model(image_tensor)
        probabilities = F.softmax(outputs, dim=1)[0]
        
    top5_prob, top5_idx = torch.topk(probabilities, k=min(5, num_classes))
    
    print("\n--- Prediction Results ---")
    top_class = classes[top5_idx[0].item()]
    top_conf = top5_prob[0].item()
    print(f"Prediction: {top_class} (Confidence: {top_conf:.2%})")
    print("\nTop 5 Predictions:")
    
    top5_results = []
    for i in range(len(top5_prob)):
        cls_name = classes[top5_idx[i].item()]
        conf = top5_prob[i].item()
        top5_results.append({"disease": cls_name, "confidence": conf})
        print(f"{i+1}. {cls_name}: {conf:.2%}")
        
    return top5_results

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Predict disease from a leaf image")
    parser.add_argument("image", type=str, help="Path to the image file")
    args = parser.parse_args()
    
    predict(args.image)
