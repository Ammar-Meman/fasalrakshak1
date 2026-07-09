# FasalRakshak Disease Detection Pipeline

A production-ready PyTorch pipeline for crop disease detection.

## Project Structure

```
backend/ai_models/disease/
├── configs/
│   └── config.py          # Configuration for training and dataset
├── dataset/               # Auto-generated processed datasets (train/val/test)
├── evaluation/            # Evaluation metrics and confusion matrix output
├── exports/               # Exported models (TorchScript, ONNX, PTH)
├── logs/                  # TensorBoard logs and training history
├── models/                # Model definitions and saved weights
│   └── model.py           # EfficientNet/ResNet/MobileNet definitions
├── scripts/
│   ├── inspect_dataset.py # Analyzes raw dataset
│   ├── split_dataset.py   # Splits dataset into train/val/test
│   ├── predict.py         # Runs inference on a single image
│   └── export.py          # Exports best model to ONNX/TorchScript
├── training/
│   └── train.py           # Training loop with early stopping, AMP, etc.
├── utils/
│   ├── augmentations.py   # Albumentations transforms
│   └── dataloader.py      # PyTorch Dataset and DataLoader
├── requirements.txt       # Dependencies
└── README.md              # Documentation
```

## Installation

Ensure you have Python 3.8+ installed. Then install dependencies:

```bash
pip install -r requirements.txt
```

## Dataset Preparation

Place your raw dataset inside `fasalrakshak/datasets` folder. Each subfolder should represent a disease class (e.g., `datasets/Tomato___Early_blight/`).

### 1. Inspect Dataset
Analyzes dataset health, finds corrupted images, and logs class distribution.
```bash
python scripts/inspect_dataset.py
```

### 2. Split Dataset
Splits the dataset into 70% training, 15% validation, and 15% testing, maintaining class balance.
```bash
python scripts/split_dataset.py
```

## Training

Train the model using the configuration set in `configs/config.py`.
```bash
python training/train.py
```

To resume training from the last checkpoint:
```bash
python training/train.py --resume
```

## Evaluation

Evaluate the trained model on the test dataset. This generates `metrics.json` and `confusion_matrix.png` in the `evaluation/` folder.
```bash
python evaluation/evaluate.py
```

## Prediction

Run inference on a single image.
```bash
python scripts/predict.py path/to/your/image.jpg
```

## Export

Export the trained model to standard formats for production deployment (.pth, TorchScript .pt, and ONNX).
```bash
python scripts/export.py
```
