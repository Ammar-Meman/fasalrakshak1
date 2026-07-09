import os
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping

# Configuration
DATASETS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'datasets'))
MODELS_SAVE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'ai_models', 'vision'))

IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 10
LEARNING_RATE = 0.001

def is_valid_image_dataset(dataset_path):
    """Check if the directory contains subdirectories (classes) with images."""
    if not os.path.isdir(dataset_path):
        return False
    subdirs = [os.path.join(dataset_path, d) for d in os.listdir(dataset_path) if os.path.isdir(os.path.join(dataset_path, d))]
    # A valid image dataset for flow_from_directory should have at least 2 class subdirectories
    return len(subdirs) >= 2

from tensorflow.keras.models import load_model

def get_or_build_model(num_classes, model_save_path):
    if os.path.exists(model_save_path):
        print(f"🔄 Found existing model at {model_save_path}. Resuming training...")
        return load_model(model_save_path)
        
    print("✨ Building fresh model...")
    base_model = MobileNetV2(
        weights='imagenet', 
        include_top=False, 
        input_shape=(IMG_SIZE[0], IMG_SIZE[1], 3)
    )
    base_model.trainable = False
    
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(512, activation='relu')(x)
    x = Dropout(0.5)(x)
    predictions = Dense(num_classes, activation='softmax')(x)
    
    model = Model(inputs=base_model.input, outputs=predictions)
    model.compile(
        optimizer=Adam(learning_rate=LEARNING_RATE),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    return model

def train_dataset(dataset_name, dataset_path):
    print(f"\n{'='*50}")
    print(f"🌾 Starting Training for Dataset: {dataset_name} 🌾")
    print(f"Path: {dataset_path}")
    print(f"{'='*50}")
    
    datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        validation_split=0.2
    )

    train_generator = datagen.flow_from_directory(
        dataset_path,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='training'
    )

    validation_generator = datagen.flow_from_directory(
        dataset_path,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='validation'
    )

    num_classes = train_generator.num_classes
    if num_classes < 2:
        print(f"Skipping {dataset_name} - Not enough classes found ({num_classes}).")
        return

    print(f"Classes found: {list(train_generator.class_indices.keys())}")

    os.makedirs(MODELS_SAVE_DIR, exist_ok=True)
    model_save_path = os.path.join(MODELS_SAVE_DIR, f"{dataset_name}_model.keras")

    model = get_or_build_model(num_classes, model_save_path)

    checkpoint = ModelCheckpoint(
        model_save_path, 
        monitor='val_accuracy', 
        save_best_only=True, 
        mode='max', 
        verbose=1
    )
    
    early_stopping = EarlyStopping(
        monitor='val_loss', 
        patience=3, 
        restore_best_weights=True
    )

    try:
        model.fit(
            train_generator,
            epochs=EPOCHS,
            validation_data=validation_generator,
            callbacks=[checkpoint, early_stopping]
        )
        print(f"✅ Successfully trained {dataset_name}. Model saved to: {model_save_path}")
    except Exception as e:
        print(f"❌ Error training {dataset_name}: {e}")

def main():
    if not os.path.exists(DATASETS_DIR):
        print(f"Error: Datasets directory not found at {DATASETS_DIR}")
        return

    # List all possible datasets
    candidates = os.listdir(DATASETS_DIR)
    
    # Filter datasets that have the expected image classification folder structure
    image_datasets = []
    for d in candidates:
        full_path = os.path.join(DATASETS_DIR, d)
        if is_valid_image_dataset(full_path):
            image_datasets.append((d, full_path))

    print(f"Found {len(image_datasets)} potential image datasets: {[d[0] for d in image_datasets]}")
    
    for name, path in image_datasets:
        # Some folders in Mozilla CV might have subfolders but aren't image classifications,
        # but image datagen will just fail gracefully if no images are found, or we can handle it.
        train_dataset(name, path)

if __name__ == "__main__":
    main()
