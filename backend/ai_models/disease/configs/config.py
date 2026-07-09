import os
from dataclasses import dataclass

@dataclass
class Config:
    # Dataset
    RAW_DATASET_PATH: str = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../datasets"))
    PROCESSED_DATASET_PATH: str = os.path.abspath(os.path.join(os.path.dirname(__file__), "../dataset"))
    
    # Training
    LEARNING_RATE: float = 1e-3
    BATCH_SIZE: int = 32
    EPOCHS: int = 50
    WORKERS: int = 4
    IMAGE_SIZE: int = 224
    RANDOM_SEED: int = 42
    
    # Paths
    MODEL_SAVE_PATH: str = os.path.abspath(os.path.join(os.path.dirname(__file__), "../models"))
    LOGS_PATH: str = os.path.abspath(os.path.join(os.path.dirname(__file__), "../logs"))
    EXPORTS_PATH: str = os.path.abspath(os.path.join(os.path.dirname(__file__), "../exports"))
    EVALUATION_PATH: str = os.path.abspath(os.path.join(os.path.dirname(__file__), "../evaluation"))
    
    # Setup directories
    @classmethod
    def setup_dirs(cls):
        os.makedirs(cls.PROCESSED_DATASET_PATH, exist_ok=True)
        os.makedirs(cls.MODEL_SAVE_PATH, exist_ok=True)
        os.makedirs(cls.LOGS_PATH, exist_ok=True)
        os.makedirs(cls.EXPORTS_PATH, exist_ok=True)
        os.makedirs(cls.EVALUATION_PATH, exist_ok=True)

Config.setup_dirs()
