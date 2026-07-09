import os
import sys
import shutil
import random
from tqdm import tqdm

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from configs.config import Config

def split_dataset():
    random.seed(Config.RANDOM_SEED)
    raw_path = Config.RAW_DATASET_PATH
    processed_path = Config.PROCESSED_DATASET_PATH
    
    if not os.path.exists(raw_path):
        print(f"Error: Dataset path '{raw_path}' does not exist.")
        return
        
    splits = {"train": 0.7, "val": 0.15, "test": 0.15}
    
    for split_name in splits.keys():
        os.makedirs(os.path.join(processed_path, split_name), exist_ok=True)
        
    class_folders = [d for d in os.listdir(raw_path) if os.path.isdir(os.path.join(raw_path, d))]
    
    for class_name in class_folders:
        class_path = os.path.join(raw_path, class_name)
        images = [f for f in os.listdir(class_path) if os.path.isfile(os.path.join(class_path, f))]
        
        # Filter non-image files if any
        images = [img for img in images if img.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp'))]
        random.shuffle(images)
        
        total_images = len(images)
        train_end = int(total_images * splits["train"])
        val_end = train_end + int(total_images * splits["val"])
        
        train_imgs = images[:train_end]
        val_imgs = images[train_end:val_end]
        test_imgs = images[val_end:]
        
        split_dict = {
            "train": train_imgs,
            "val": val_imgs,
            "test": test_imgs
        }
        
        print(f"Splitting class: {class_name} ({total_images} images)")
        for split_name, imgs in split_dict.items():
            split_class_dir = os.path.join(processed_path, split_name, class_name)
            os.makedirs(split_class_dir, exist_ok=True)
            for img in tqdm(imgs, leave=False, desc=split_name):
                src = os.path.join(class_path, img)
                dst = os.path.join(split_class_dir, img)
                if not os.path.exists(dst):
                    shutil.copy2(src, dst)
                    
    print("Dataset split successfully completed.")

if __name__ == "__main__":
    split_dataset()
