import os
import cv2
import numpy as np
from torch.utils.data import Dataset, DataLoader
from torchvision.datasets.folder import make_dataset, find_classes
from utils.augmentations import get_transforms

class DiseaseDataset(Dataset):
    def __init__(self, root_dir, phase, image_size):
        self.root_dir = root_dir
        self.phase = phase
        self.image_size = image_size
        self.transforms = get_transforms(image_size, phase)
        
        self.classes, self.class_to_idx = find_classes(self.root_dir)
        self.samples = make_dataset(self.root_dir, self.class_to_idx, extensions=('.png', '.jpg', '.jpeg', '.bmp'))

    def __len__(self):
        return len(self.samples)
        
    def __getitem__(self, idx):
        path, label = self.samples[idx]
        image = cv2.imread(path)
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        if self.transforms:
            augmented = self.transforms(image=image)
            image = augmented['image']
            
        return image, label

def get_dataloader(root_dir, phase, config):
    dataset = DiseaseDataset(root_dir=root_dir, phase=phase, image_size=config.IMAGE_SIZE)
    
    loader = DataLoader(
        dataset,
        batch_size=config.BATCH_SIZE,
        shuffle=(phase == "train"),
        num_workers=config.WORKERS,
        pin_memory=True
    )
    
    return loader, dataset.classes
