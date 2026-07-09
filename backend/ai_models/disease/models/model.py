import torch
import torch.nn as nn
from torchvision.models import efficientnet_b0, EfficientNet_B0_Weights
from torchvision.models import resnet50, ResNet50_Weights
from torchvision.models import mobilenet_v3_large, MobileNet_V3_Large_Weights

class DiseaseModel(nn.Module):
    def __init__(self, num_classes, architecture="efficientnet_b0"):
        super(DiseaseModel, self).__init__()
        self.architecture = architecture
        
        if architecture == "efficientnet_b0":
            self.model = efficientnet_b0(weights=EfficientNet_B0_Weights.DEFAULT)
            in_features = self.model.classifier[1].in_features
            self.model.classifier[1] = nn.Linear(in_features, num_classes)
            
        elif architecture == "resnet50":
            self.model = resnet50(weights=ResNet50_Weights.DEFAULT)
            in_features = self.model.fc.in_features
            self.model.fc = nn.Linear(in_features, num_classes)
            
        elif architecture == "mobilenet_v3_large":
            self.model = mobilenet_v3_large(weights=MobileNet_V3_Large_Weights.DEFAULT)
            in_features = self.model.classifier[3].in_features
            self.model.classifier[3] = nn.Linear(in_features, num_classes)
            
        else:
            raise ValueError(f"Unsupported architecture: {architecture}")

    def forward(self, x):
        return self.model(x)
