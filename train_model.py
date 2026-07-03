import tensorflow as tf
from tensorflow.keras import layers, Model, applications
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint, ReduceLROnPlateau
import json
import os

# Config
IMG_SIZE = (300, 300)
BATCH_SIZE = 32
EPOCHS = 30
FINE_TUNE_EPOCHS = 20

# Data generators
train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=40,
    width_shift_range=0.3,
    height_shift_range=0.3,
    shear_range=0.2,
    zoom_range=0.3,
    horizontal_flip=True,
    vertical_flip=True,
    brightness_range=[0.7, 1.3],
    fill_mode='nearest'
)

val_datagen = ImageDataGenerator(rescale=1./255)

train_gen = train_datagen.flow_from_directory(
    'dataset/train',
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='categorical'
)

val_gen = val_datagen.flow_from_directory(
    'dataset/val',
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    shuffle=False
)

# Build model
base_model = applications.EfficientNetB3(
    weights='imagenet',
    include_top=False,
    input_shape=(*IMG_SIZE, 3)
)
base_model.trainable = False

inputs = layers.Input(shape=(*IMG_SIZE, 3))
x = base_model(inputs, training=False)
x = layers.GlobalAveragePooling2D()(x)
x = layers.BatchNormalization()(x)
x = layers.Dense(512, activation='relu')(x)
x = layers.Dropout(0.5)(x)
x = layers.Dense(256, activation='relu')(x)
x = layers.Dropout(0.4)(x)
outputs = layers.Dense(len(train_gen.class_indices), activation='softmax')(x)

model = Model(inputs, outputs)
model.compile(
    optimizer=Adam(1e-4),
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

# Train
callbacks = [
    EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True),
    ModelCheckpoint('crop_model.keras', monitor='val_accuracy', save_best_only=True),
    ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=5, min_lr=1e-7)
]

print("Phase 1: Training classification head...")
model.fit(train_gen, epochs=EPOCHS, validation_data=val_gen, callbacks=callbacks)

# Fine-tune
print("Phase 2: Fine-tuning...")
base_model.trainable = True
model.compile(optimizer=Adam(1e-5), loss='categorical_crossentropy', metrics=['accuracy'])
model.fit(train_gen, epochs=FINE_TUNE_EPOCHS, validation_data=val_gen, callbacks=callbacks)

# Save model and metadata
model.save('crop_model.keras')

metadata = {
    'img_size': IMG_SIZE,
    'num_classes': len(train_gen.class_indices),
    'backbone': 'efficientnetb3',
    'class_indices': train_gen.class_indices,
    'idx_to_class': {str(v): k for k, v in train_gen.class_indices.items()}
}

with open('crop_model_metadata.json', 'w') as f:
    json.dump(metadata, f, indent=2)

print("Training complete!")
print(f"Classes: {list(train_gen.class_indices.keys())}")
