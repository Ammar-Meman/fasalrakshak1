import os
import sys
import json
from PIL import Image
from collections import defaultdict
from tqdm import tqdm

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from configs.config import Config

def inspect_dataset():
    raw_path = Config.RAW_DATASET_PATH
    if not os.path.exists(raw_path):
        print(f"Error: Dataset path '{raw_path}' does not exist.")
        return

    report = {
        "total_images": 0,
        "total_classes": 0,
        "classes": {},
        "corrupted_files": [],
        "unreadable_files": [],
        "empty_folders": [],
        "image_resolutions": defaultdict(int)
    }

    class_folders = [d for d in os.listdir(raw_path) if os.path.isdir(os.path.join(raw_path, d))]
    report["total_classes"] = len(class_folders)

    for class_name in class_folders:
        class_path = os.path.join(raw_path, class_name)
        images = [f for f in os.listdir(class_path) if os.path.isfile(os.path.join(class_path, f))]
        
        if len(images) == 0:
            report["empty_folders"].append(class_name)
            report["classes"][class_name] = 0
            continue
            
        report["classes"][class_name] = len(images)
        report["total_images"] += len(images)

        print(f"Inspecting class: {class_name}")
        for img_name in tqdm(images, leave=False):
            img_path = os.path.join(class_path, img_name)
            try:
                with Image.open(img_path) as img:
                    img.verify() # verify that it is an image
                # To get resolution, need to reopen as verify() doesn't always allow it afterwards
                with Image.open(img_path) as img:
                    res = f"{img.width}x{img.height}"
                    report["image_resolutions"][res] += 1
            except (IOError, SyntaxError):
                report["corrupted_files"].append(img_path)
            except Exception:
                report["unreadable_files"].append(img_path)

    report["image_resolutions"] = dict(report["image_resolutions"])
    
    print("\n--- Inspection Report ---")
    print(f"Total Classes: {report['total_classes']}")
    print(f"Total Images: {report['total_images']}")
    print(f"Corrupted Files: {len(report['corrupted_files'])}")
    print(f"Unreadable Files: {len(report['unreadable_files'])}")
    print(f"Empty Folders: {len(report['empty_folders'])}")
    
    report_path = os.path.join(Config.PROCESSED_DATASET_PATH, "dataset_report.json")
    with open(report_path, "w") as f:
        json.dump(report, f, indent=4)
        
    print(f"Detailed report saved to {report_path}")

if __name__ == "__main__":
    inspect_dataset()
