import os
import sys
import json
import torch
import shutil

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from configs.config import Config
from models.model import DiseaseModel

def export_model():
    device = torch.device("cpu") # Export using CPU for broader compatibility
    
    classes_path = os.path.join(Config.MODEL_SAVE_PATH, "classes.json")
    if not os.path.exists(classes_path):
        print("Classes file not found.")
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
    
    # 1. PyTorch native (.pth)
    shutil.copy2(model_path, os.path.join(Config.EXPORTS_PATH, "model.pth"))
    print("Exported PyTorch format to model.pth")
    
    # Dummy input for tracing and export
    dummy_input = torch.randn(1, 3, Config.IMAGE_SIZE, Config.IMAGE_SIZE).to(device)
    
    # 2. TorchScript
    try:
        traced_script_module = torch.jit.trace(model, dummy_input)
        torchscript_path = os.path.join(Config.EXPORTS_PATH, "model.pt")
        traced_script_module.save(torchscript_path)
        print(f"Exported TorchScript to {torchscript_path}")
    except Exception as e:
        print(f"Failed to export TorchScript: {e}")
        
    # 3. ONNX
    try:
        onnx_path = os.path.join(Config.EXPORTS_PATH, "model.onnx")
        torch.onnx.export(
            model,
            dummy_input,
            onnx_path,
            export_params=True,
            opset_version=11,
            do_constant_folding=True,
            input_names=['input'],
            output_names=['output'],
            dynamic_axes={'input': {0: 'batch_size'}, 'output': {0: 'batch_size'}}
        )
        print(f"Exported ONNX to {onnx_path}")
    except Exception as e:
        print(f"Failed to export ONNX: {e}")

if __name__ == "__main__":
    export_model()
