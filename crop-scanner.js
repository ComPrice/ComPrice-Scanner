/**
 * Crop Identification Module for ComPrice Scanner
 */
class CropIdentifier {
    constructor(apiUrl = 'http://localhost:5000') {
        this.apiUrl = apiUrl;
        this.isReady = false;
        this.supportedCrops = [];
    }

    async init() {
        try {
            const response = await fetch(`${this.apiUrl}/health`);
            const data = await response.json();
            if (data.status === 'healthy') {
                this.isReady = true;
                this.supportedCrops = data.classes;
                console.log('Crop Identifier ready:', this.supportedCrops);
                return true;
            }
        } catch (error) {
            console.error('Init failed:', error);
            return false;
        }
    }

    async identify(imageInput, topK = 3) {
        if (!this.isReady) await this.init();
        let formData = new FormData();
        if (typeof imageInput === 'string') {
            const response = await fetch(`${this.apiUrl}/predict?top_k=${topK}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: imageInput })
            });
            return await response.json();
        } else {
            formData.append('image', imageInput);
            const response = await fetch(`${this.apiUrl}/predict?top_k=${topK}`, {
                method: 'POST',
                body: formData
            });
            return await response.json();
        }
    }

    async identifyFromInput(fileInput) {
        if (!fileInput.files || fileInput.files.length === 0) {
            throw new Error('No file selected');
        }
        return await this.identify(fileInput.files[0]);
    }

    renderResults(result) {
        if (!result.success) {
            return `<div class="crop-error">Error: ${result.error}</div>`;
        }
        const predictions = result.predictions;
        let html = '<div class="crop-results"><h3>Identification Results</h3>';
        predictions.forEach((pred, index) => {
            const confidence = (pred.confidence * 100).toFixed(1);
            const isValid = pred.is_valid ? 'valid' : 'low-confidence';
            const rank = index === 0 ? 'top' : '';
            html += `
                <div class="crop-prediction ${isValid} ${rank}">
                    <div class="crop-name">${pred.crop.charAt(0).toUpperCase() + pred.crop.slice(1)}</div>
                    <div class="crop-confidence">
                        <div class="confidence-bar" style="width: ${confidence}%"></div>
                        <span>${confidence}%</span>
                    </div>
                </div>`;
        });
        html += `<div class="inference-time">${result.inference_time_ms}ms</div></div>`;
        return html;
    }
}

class CropScannerWidget {
    constructor(containerId, apiUrl = 'http://localhost:5000') {
        this.container = document.getElementById(containerId);
        this.identifier = new CropIdentifier(apiUrl);
        this.initUI();
    }

    async initUI() {
        this.container.innerHTML = `
            <div class="crop-scanner">
                <div class="upload-area" id="upload-area">
                    <input type="file" id="crop-image-input" accept="image/*" hidden>
                    <div class="upload-placeholder">
                        <span class="upload-icon">📷</span>
                        <p>Click to upload or drag & drop</p>
                        <small>Supports JPG, PNG, WEBP</small>
                    </div>
                    <img id="preview-image" class="preview-image" hidden>
                </div>
                <div class="scanner-actions">
                    <button id="identify-btn" class="btn-primary" disabled>Identify Crop</button>
                    <button id="clear-btn" class="btn-secondary" hidden>Clear</button>
                </div>
                <div id="results-container"></div>
                <div id="loading-overlay" class="loading-overlay" hidden>
                    <div class="spinner"></div><p>Analyzing...</p>
                </div>
            </div>`;
        this.addStyles();
        this.bindEvents();
        await this.identifier.init();
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .crop-scanner { max-width: 500px; margin: 0 auto; padding: 20px; font-family: sans-serif; }
            .upload-area { border: 2px dashed #bdc3c7; border-radius: 12px; padding: 40px 20px; text-align: center; cursor: pointer; transition: all 0.3s; position: relative; }
            .upload-area:hover, .upload-area.dragover { border-color: #3498db; background: #f8f9fa; }
            .upload-icon { font-size: 48px; display: block; margin-bottom: 10px; }
            .preview-image { max-width: 100%; max-height: 300px; border-radius: 8px; }
            .scanner-actions { display: flex; gap: 10px; margin-top: 20px; }
            .btn-primary, .btn-secondary { flex: 1; padding: 12px; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; }
            .btn-primary { background: #27ae60; color: white; }
            .btn-primary:disabled { background: #bdc3c7; cursor: not-allowed; }
            .btn-secondary { background: #ecf0f1; color: #2c3e50; }
            .crop-results h3 { margin: 20px 0 15px; color: #2c3e50; }
            .crop-prediction { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; margin-bottom: 8px; border-radius: 8px; background: #f8f9fa; border-left: 4px solid #bdc3c7; }
            .crop-prediction.valid { border-left-color: #27ae60; background: #e8f8f0; }
            .crop-prediction.top { border-left-width: 6px; }
            .crop-name { font-weight: 600; text-transform: capitalize; }
            .crop-confidence { display: flex; align-items: center; gap: 10px; }
            .confidence-bar { height: 8px; background: #27ae60; border-radius: 4px; min-width: 20px; }
            .crop-confidence span { font-size: 14px; color: #7f8c8d; min-width: 50px; text-align: right; }
            .inference-time { text-align: center; color: #95a5a6; font-size: 12px; margin-top: 10px; }
            .loading-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255,255,255,0.9); display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 16px; }
            .spinner { width: 40px; height: 40px; border: 4px solid #ecf0f1; border-top-color: #27ae60; border-radius: 50%; animation: spin 1s linear infinite; }
            @keyframes spin { to { transform: rotate(360deg); } }
        `;
        document.head.appendChild(style);
    }

    bindEvents() {
        const uploadArea = this.container.querySelector('#upload-area');
        const fileInput = this.container.querySelector('#crop-image-input');
        const previewImg = this.container.querySelector('#preview-image');
        const identifyBtn = this.container.querySelector('#identify-btn');
        const clearBtn = this.container.querySelector('#clear-btn');
        const resultsContainer = this.container.querySelector('#results-container');
        const loadingOverlay = this.container.querySelector('#loading-overlay');

        uploadArea.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    previewImg.src = ev.target.result;
                    previewImg.hidden = false;
                    this.container.querySelector('.upload-placeholder').hidden = true;
                    identifyBtn.disabled = false;
                    clearBtn.hidden = false;
                };
                reader.readAsDataURL(e.target.files[0]);
            }
        });
        uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('dragover'); });
        uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            if (e.dataTransfer.files.length > 0) {
                fileInput.files = e.dataTransfer.files;
                fileInput.dispatchEvent(new Event('change'));
            }
        });
        identifyBtn.addEventListener('click', async () => {
            loadingOverlay.hidden = false;
            try {
                const result = await this.identifier.identifyFromInput(fileInput);
                resultsContainer.innerHTML = this.identifier.renderResults(result);
            } catch (error) {
                resultsContainer.innerHTML = `<div class="crop-error">Error: ${error.message}</div>`;
            } finally {
                loadingOverlay.hidden = true;
            }
        });
        clearBtn.addEventListener('click', () => {
            fileInput.value = '';
            previewImg.hidden = true;
            previewImg.src = '';
            this.container.querySelector('.upload-placeholder').hidden = false;
            identifyBtn.disabled = true;
            clearBtn.hidden = true;
            resultsContainer.innerHTML = '';
        });
    }
}
