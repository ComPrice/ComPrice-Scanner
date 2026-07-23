from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)

# ✅ CORS: Allow your GitHub Pages frontend
CORS(app, origins=["https://comprice.github.io"])

# Load your ML model here
# model = load_model('crop_model.keras')

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "online", "service": "ComPrice API"})

@app.route('/api/identify', methods=['POST'])
def identify_crop():
    # Your crop identification logic
    # For now, return mock data to test connectivity
    return jsonify({
        "crop": "Potato",
        "scientific_name": "Solanum tuberosum",
        "confidence": 94.2,
        "prices": {
            "current": 65,
            "unit": "PHP/kg",
            "trend": "stable"
        }
    })

@app.route('/api/prices', methods=['GET'])
def get_prices():
    return jsonify({
        "potato": 65,
        "carrot": 85,
        "cassava": 38,
        "ginger": 120,
        "onion": 95,
        "peanut": 110,
        "sweet_potato": 55,
        "taro": 72,
        "turmeric": 180,
        "ube": 95
    })

if __name__ == '__main__':
    # ✅ Render provides PORT env var
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
