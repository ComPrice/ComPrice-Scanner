from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import numpy as np
from PIL import Image
import io
import tensorflow as tf
from tensorflow.keras.preprocessing import image as keras_image
import time

app = Flask(__name__)
CORS(app)

MODEL_PATH = os.environ.get('MODEL_PATH', 'crop_model.keras')
CONFIDENCE_THRESHOLD = float(os.environ.get('CONFIDENCE_THRESHOLD', '0.6'))
IMG_SIZE = (300, 300)

model = None
class_indices = {}
idx_to_class = {}

def load_model():
    global model, class_indices, idx_to_class
    metadata_path = MODEL_PATH.replace('.keras', '_metadata.json')
    with open(metadata_path, 'r') as f:
        metadata = json.load(f)
    class_indices = metadata['class_indices']
    idx_to_class = {int(k): v for k, v in metadata['idx_to_class'].items()}
    model = tf.keras.models.load_model(MODEL_PATH)
    print(f"Model loaded: {MODEL_PATH}")
    print(f"Classes: {list(class_indices.keys())}")

def preprocess_image(img_data):
    img = Image.open(io.BytesIO(img_data))
    if img.mode != 'RGB':
        img = img.convert('RGB')
    img = img.resize(IMG_SIZE)
    img_array = keras_image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array / 255.0
    return img_array

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'classes': list(class_indices.keys()) if class_indices else [],
        'threshold': CONFIDENCE_THRESHOLD
    })

@app.route('/classes', methods=['GET'])
def get_classes():
    return jsonify({'classes': list(class_indices.keys()), 'count': len(class_indices)})

@app.route('/predict', methods=['POST'])
def predict():
    start_time = time.time()
    try:
        if 'image' in request.files:
            file = request.files['image']
            img_data = file.read()
        elif request.is_json and 'image' in request.json:
            base64_data = request.json['image']
            if base64_data.startswith('data:image'):
                base64_data = base64_data.split(',')[1]
            img_data = base64.b64decode(base64_data)
        else:
            return jsonify({'success': False, 'error': 'No image provided'}), 400

        img_array = preprocess_image(img_data)
        predictions = model.predict(img_array, verbose=0)[0]
        top_k = request.args.get('top_k', 3, type=int)
        top_indices = np.argsort(predictions)[::-1][:top_k]

        prediction_results = []
        for idx in top_indices:
            crop_name = idx_to_class[idx]
            confidence = float(predictions[idx])
            prediction_results.append({
                'crop': crop_name,
                'confidence': round(confidence, 4),
                'is_valid': confidence >= CONFIDENCE_THRESHOLD
            })

        return jsonify({
            'success': True,
            'predictions': prediction_results,
            'top_prediction': prediction_results[0],
            'inference_time_ms': round((time.time() - start_time) * 1000, 2)
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    load_model()
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
