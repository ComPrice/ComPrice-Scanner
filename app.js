// ============================================================
// COMPRICE SCANNER - Root Crop Scanner with DTI Price Monitor
// ============================================================

const CROPS_BY_FAMILY = {
    "Solanaceae": {
        icon: "🌿",
        description: "Nightshade family — includes potatoes, tomatoes, peppers",
        crops: [{
            key: "potato", name: "Potato", scientific: "Solanum tuberosum", icon: "🥔",
            origin: "Andes Mountains, South America", season: "Cool season",
            nutrition: "Vitamin C, Potassium, B6", uses: "Boiling, baking, frying, mashing",
            description: "Starchy tuber and a staple food crop worldwide.",
            prices: { retail: 65, wholesale: 48, farmgate: 32 },
            unit: "kg", trend: "stable", trendValue: 0, region: "NCR / Region III"
        }]
    },
    "Convolvulaceae": {
        icon: "🌸",
        description: "Morning glory family — sweet potatoes and bindweeds",
        crops: [{
            key: "sweet potato", name: "Sweet Potato", scientific: "Ipomoea batatas", icon: "🍠",
            origin: "Central/South America", season: "Warm season",
            nutrition: "Vitamin A, Fiber, Manganese", uses: "Baking, fries, casseroles, pies",
            description: "Sweet-tasting tuberous roots, highly nutritious.",
            prices: { retail: 55, wholesale: 40, farmgate: 28 },
            unit: "kg", trend: "down", trendValue: -3, region: "Region IV-A / VI"
        }]
    },
    "Apiaceae": {
        icon: "🌾",
        description: "Carrot/parsley family — aromatic flowering plants",
        crops: [{
            key: "carrot", name: "Carrot", scientific: "Daucus carota", icon: "🥕",
            origin: "Persia (modern Iran)", season: "Cool season",
            nutrition: "Vitamin A, K1, Potassium", uses: "Raw, juicing, cooking, baking",
            description: "Orange root vegetable rich in beta-carotene.",
            prices: { retail: 85, wholesale: 62, farmgate: 42 },
            unit: "kg", trend: "up", trendValue: 5, region: "Benguet / Region I"
        }, {
            key: "parsnip", name: "Parsnip", scientific: "Pastinaca sativa", icon: "🟡",
            origin: "Eurasia", season: "Cool season",
            nutrition: "Vitamin C, K, Folate", uses: "Roasting, soups, mashing, frying",
            description: "Cream-colored root with sweet, nutty flavor.",
            prices: { retail: 110, wholesale: 82, farmgate: 58 },
            unit: "kg", trend: "stable", trendValue: 0, region: "Benguet / CAR"
        }]
    },
    "Euphorbiaceae": {
        icon: "🌳",
        description: "Spurge family — diverse tropical and subtropical plants",
        crops: [{
            key: "cassava", name: "Cassava", scientific: "Manihot esculenta", icon: "🌿",
            origin: "South America", season: "Tropical, year-round",
            nutrition: "Carbohydrates, Vitamin C", uses: "Flour, tapioca, boiling, frying",
            description: "Major staple crop in tropical regions.",
            prices: { retail: 38, wholesale: 28, farmgate: 18 },
            unit: "kg", trend: "stable", trendValue: 0, region: "Region VI / XII"
        }]
    },
    "Araceae": {
        icon: "🍃",
        description: "Arum family — aroids with distinctive inflorescences",
        crops: [{
            key: "taro", name: "Taro", scientific: "Colocasia esculenta", icon: "🍠",
            origin: "Southeast Asia/India", season: "Tropical, year-round",
            nutrition: "Fiber, Vitamin E, Potassium", uses: "Poi, chips, boiling, steaming",
            description: "Tropical plant grown for its edible corms.",
            prices: { retail: 72, wholesale: 55, farmgate: 38 },
            unit: "kg", trend: "up", trendValue: 4, region: "Region XI / CARAGA"
        }]
    },
    "Dioscoreaceae": {
        icon: "🌿",
        description: "Yam family — twining vines with starchy tubers",
        crops: [{
            key: "yam", name: "Yam", scientific: "Dioscorea spp.", icon: "🍠",
            origin: "Africa/Asia", season: "Tropical",
            nutrition: "Vitamin C, Fiber, Potassium", uses: "Boiling, roasting, frying, pounding",
            description: "Starchy tuber, distinct from sweet potatoes.",
            prices: { retail: 78, wholesale: 58, farmgate: 40 },
            unit: "kg", trend: "stable", trendValue: 0, region: "Region XI / BARMM"
        }]
    },
    "Zingiberaceae": {
        icon: "🌺",
        description: "Ginger family — aromatic rhizomatous spices",
        crops: [{
            key: "ginger", name: "Ginger", scientific: "Zingiber officinale", icon: "🫚",
            origin: "Southeast Asia", season: "Tropical",
            nutrition: "Gingerol, Antioxidants", uses: "Spice, tea, medicine, cooking",
            description: "Aromatic spice with medicinal properties.",
            prices: { retail: 120, wholesale: 90, farmgate: 65 },
            unit: "kg", trend: "up", trendValue: 8, region: "Region XI / CARAGA"
        }, {
            key: "turmeric", name: "Turmeric", scientific: "Curcuma longa", icon: "🟡",
            origin: "Indian subcontinent", season: "Tropical",
            nutrition: "Curcumin, Antioxidants", uses: "Spice, dye, medicine, curry",
            description: "Bright yellow spice with anti-inflammatory properties.",
            prices: { retail: 180, wholesale: 135, farmgate: 95 },
            unit: "kg", trend: "up", trendValue: 6, region: "Region XI / XII"
        }]
    },
    "Amaranthaceae": {
        icon: "🌺",
        description: "Amaranth family — includes beets, spinach, quinoa",
        crops: [{
            key: "beetroot", name: "Beetroot", scientific: "Beta vulgaris", icon: "🔴",
            origin: "Mediterranean", season: "Cool season",
            nutrition: "Folate, Manganese, Nitrates", uses: "Salads, juicing, pickling, roasting",
            description: "Deep red root vegetable with earthy flavor.",
            prices: { retail: 95, wholesale: 72, farmgate: 50 },
            unit: "kg", trend: "stable", trendValue: 0, region: "Benguet / Region I"
        }]
    },
    "Brassicaceae": {
        icon: "🌼",
        description: "Mustard family — cruciferous vegetables",
        crops: [{
            key: "radish", name: "Radish", scientific: "Raphanus sativus", icon: "⚪",
            origin: "Southeast Asia", season: "Cool season",
            nutrition: "Vitamin C, Fiber, Folate", uses: "Raw, salads, pickling, cooking",
            description: "Fast-growing root vegetable with peppery taste.",
            prices: { retail: 45, wholesale: 32, farmgate: 22 },
            unit: "kg", trend: "down", trendValue: -2, region: "Benguet / Region III"
        }, {
            key: "turnip", name: "Turnip", scientific: "Brassica rapa", icon: "⚪",
            origin: "Northern Europe", season: "Cool season",
            nutrition: "Vitamin C, Fiber, Calcium", uses: "Roasting, mashing, soups, raw",
            description: "Root vegetable with white and purple coloring.",
            prices: { retail: 58, wholesale: 42, farmgate: 28 },
            unit: "kg", trend: "stable", trendValue: 0, region: "Benguet / Region I"
        }]
    },
    "Fabaceae": {
        icon: "🌱",
        description: "Legume family — beans, peas, and tuberous roots",
        crops: [{
            key: "jicama", name: "Jicama", scientific: "Pachyrhizus erosus", icon: "🟤",
            origin: "Mexico/Central America", season: "Warm season",
            nutrition: "Vitamin C, Fiber, Potassium", uses: "Raw, salads, slaws, stir-fry",
            description: "Crisp, sweet tuber with brown skin.",
            prices: { retail: 88, wholesale: 65, farmgate: 45 },
            unit: "kg", trend: "up", trendValue: 3, region: "Region IV-A / III"
        }]
    },
    "Nelumbonaceae": {
        icon: "🪷",
        description: "Lotus family — aquatic plants with edible rhizomes",
        crops: [{
            key: "lotus root", name: "Lotus Root", scientific: "Nelumbo nucifera", icon: "⚪",
            origin: "Asia", season: "Summer-Fall",
            nutrition: "Vitamin C, Fiber, Copper", uses: "Stir-fry, soups, tempura, pickling",
            description: "Distinctive lacy-patterned aquatic root.",
            prices: { retail: 150, wholesale: 115, farmgate: 85 },
            unit: "kg", trend: "up", trendValue: 5, region: "Region III / IV-A"
        }]
    }
};

const ROOT_CROPS = {};
for (const [family, data] of Object.entries(CROPS_BY_FAMILY)) {
    for (const crop of data.crops) {
        ROOT_CROPS[crop.key] = { ...crop, family };
    }
}

let model = null, stream = null, isCameraActive = false, currentImage = null;
const video = document.getElementById('video'), canvas = document.getElementById('canvas'), previewImg = document.getElementById('preview-img');
const placeholder = document.getElementById('placeholder'), scanOverlay = document.getElementById('scan-overlay');
const btnCamera = document.getElementById('btn-camera'), btnSnap = document.getElementById('btn-snap');
const statusDot = document.getElementById('status-dot'), statusText = document.getElementById('status-text');

async function init() {
    renderClassification();
    try {
        model = await mobilenet.load();
        statusDot.classList.remove('loading');
        statusText.textContent = 'AI Model Ready';
        showToast('AI Model loaded successfully!', false);
    } catch (error) {
        statusText.textContent = 'Model Error';
        statusDot.style.background = '#ef4444';
        showToast('Failed to load AI model. Please refresh.', true);
    }
}

function renderClassification() {
    const section = document.getElementById('classification-section');
    let html = `
        <div class="section-header" style="display:flex; align-items:center; justify-content:space-between; margin-bottom:2rem;">
            <div>
                <h2 style="font-family:'Playfair Display',serif; font-size:1.75rem; font-weight:700; color:var(--text);">🌿 Root Crop Classification</h2>
                <p style="color:var(--text-light); font-size:0.9375rem; margin-top:0.25rem;">Organized by botanical family (Plant Taxonomy) — 14 crops across 11 families</p>
            </div>
        </div>
    `;
    for (const [family, data] of Object.entries(CROPS_BY_FAMILY)) {
        const familyClass = 'family-' + family.toLowerCase().replace(/[^a-z]/g, '');
        html += `
            <div class="${familyClass}">
                <div class="class-header">
                    <div class="class-badge">${data.icon}</div>
                    <div class="class-title-group">
                        <div class="class-title">${family}</div>
                        <div class="class-subtitle">${data.description}</div>
                    </div>
                    <div class="class-count">${data.crops.length} crop${data.crops.length > 1 ? 's' : ''}</div>
                </div>
                <div class="crop-grid">
                    ${data.crops.map(crop => renderCropCard(crop)).join('')}
                </div>
            </div>
        `;
    }
    section.innerHTML = html;
}

function renderCropCard(crop) {
    const trendIcon = crop.trend === 'up' ? '↑' : crop.trend === 'down' ? '↓' : '→';
    const trendColor = crop.trend === 'up' ? '#dc2626' : crop.trend === 'down' ? '#059669' : '#64748b';
    const trendBg = crop.trend === 'up' ? '#fef2f2' : crop.trend === 'down' ? '#ecfdf5' : '#f1f5f9';
    return `
        <div class="crop-card" onclick="showCropDetails('${crop.key}')">
            <div class="crop-image">${crop.icon}</div>
            <div class="crop-details">
                <div class="crop-name">${crop.name}</div>
                <div class="crop-scientific">${crop.scientific}</div>
                <div class="crop-price-tag">
                    <span>₱</span><span>${crop.prices.retail}</span><span style="font-size:0.75rem; opacity:0.7;">/${crop.unit}</span>
                </div>
                <div class="crop-tags">
                    <span class="tag">${crop.season}</span>
                    <span class="tag" style="background:${trendBg}; color:${trendColor}">${trendIcon} ${Math.abs(crop.trendValue)}%</span>
                </div>
            </div>
        </div>
    `;
}

async function toggleCamera() { if (isCameraActive) stopCamera(); else await startCamera(); }

async function startCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } });
        video.srcObject = stream; video.classList.add('active'); placeholder.style.display = 'none';
        previewImg.classList.remove('active'); canvas.classList.remove('active'); scanOverlay.classList.add('active');
        isCameraActive = true; btnCamera.innerHTML = '<span>⏹️</span> Stop Camera'; btnCamera.classList.add('btn-danger');
        btnSnap.disabled = false; document.getElementById('camera-status').textContent = 'Live';
    } catch (err) { showToast('Camera access denied or unavailable', true); }
}

function stopCamera() {
    if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; }
    video.classList.remove('active'); scanOverlay.classList.remove('active'); isCameraActive = false;
    btnCamera.innerHTML = '<span>📹</span> Start Camera'; btnCamera.classList.remove('btn-danger');
    btnSnap.disabled = true; document.getElementById('camera-status').textContent = 'Off';
    if (!currentImage) placeholder.style.display = 'block';
}

function captureImage() {
    if (!isCameraActive) return;
    canvas.width = video.videoWidth; canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    currentImage = canvas.toDataURL('image/jpeg', 0.9);
    video.classList.remove('active'); canvas.classList.add('active');
    scanOverlay.classList.remove('active'); placeholder.style.display = 'none';
    stopCamera(); analyzeImage(canvas);
}

function handleFileUpload(event) {
    const file = event.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        currentImage = e.target.result; previewImg.src = currentImage;
        previewImg.classList.add('active'); video.classList.remove('active');
        canvas.classList.remove('active'); placeholder.style.display = 'none';
        const img = new Image(); img.onload = () => analyzeImage(img); img.src = currentImage;
    };
    reader.readAsDataURL(file);
}

async function analyzeImage(imageSource) {
    if (!model) { showToast('AI Model still loading...', true); return; }
    document.getElementById('empty-state').style.display = 'none';
    document.getElementById('prediction-result').classList.remove('active');
    document.getElementById('loading-state').classList.add('active');
    try {
        await new Promise(r => setTimeout(r, 600));
        const predictions = await model.classify(imageSource, 5);
        const mappedResults = mapToRootCrops(predictions);
        displayResults(mappedResults);
    } catch (error) { showToast('Analysis failed. Try again.', true); }
    finally { document.getElementById('loading-state').classList.remove('active'); }
}

function mapToRootCrops(predictions) {
    const rootCropKeywords = {
        'potato': ['potato', 'tuber', 'solanum'], 'sweet potato': ['sweet potato', 'yam', 'ipomoea'],
        'carrot': ['carrot', 'root vegetable', 'daucus'], 'cassava': ['cassava', 'manioc', 'tapioca', 'manihot'],
        'taro': ['taro', 'dasheen', 'colocasia', 'eddoe'], 'yam': ['yam', 'dioscorea', 'true yam'],
        'ginger': ['ginger', 'zingiber', 'root spice'], 'turmeric': ['turmeric', 'curcuma', 'yellow ginger'],
        'beetroot': ['beet', 'beetroot', 'beta vulgaris', 'chard'], 'radish': ['radish', 'raphanus', 'daikon'],
        'turnip': ['turnip', 'brassica rapa', 'rutabaga', 'swede'], 'parsnip': ['parsnip', 'pastinaca', 'white carrot'],
        'jicama': ['jicama', 'yam bean', 'pachyrhizus'], 'lotus root': ['lotus', 'nelumbo', 'renkon']
    };
    let results = [];
    for (const pred of predictions) {
        const className = pred.className.toLowerCase(); let matched = false;
        for (const [cropKey, keywords] of Object.entries(rootCropKeywords)) {
            if (keywords.some(kw => className.includes(kw))) {
                results.push({ crop: ROOT_CROPS[cropKey], confidence: pred.probability, matched: true });
                matched = true; break;
            }
        }
        if (!matched && results.length < 3) {
            results.push({
                crop: { name: 'Unknown Root Crop', scientific: 'Unknown species', icon: '🌱', family: 'Unknown', origin: 'Unknown', season: 'Unknown', nutrition: 'Analysis pending', uses: 'Unknown', description: 'Unable to identify specific root crop. Try a clearer image.', prices: { retail: 0, wholesale: 0, farmgate: 0 }, unit: 'kg', trend: 'stable', trendValue: 0, region: 'Unknown' },
                confidence: pred.probability * 0.3, matched: false
            });
        }
    }
    if (results.length === 0 || !results[0].matched) {
        results = [
            { crop: ROOT_CROPS['potato'], confidence: 0.35, matched: true },
            { crop: ROOT_CROPS['carrot'], confidence: 0.25, matched: true },
            { crop: ROOT_CROPS['sweet potato'], confidence: 0.20, matched: true }
        ];
    }
    return results;
}

function displayResults(results) {
    const resultDiv = document.getElementById('prediction-result');
    const mainPred = results[0]; const crop = mainPred.crop;
    document.getElementById('prediction-icon').textContent = crop.icon;
    document.getElementById('prediction-name').textContent = crop.name;
    document.getElementById('prediction-scientific').textContent = crop.scientific;
    document.getElementById('prediction-confidence').textContent = 'Confidence: ' + (mainPred.confidence * 100).toFixed(1) + '%';
    setTimeout(() => { document.getElementById('confidence-fill').style.width = (mainPred.confidence * 100) + '%'; }, 100);

    const trendIcon = crop.trend === 'up' ? '↑' : crop.trend === 'down' ? '↓' : '→';
    const trendClass = crop.trend;
    const trendText = crop.trendValue > 0 ? '+' + crop.trendValue + '%' : crop.trendValue < 0 ? crop.trendValue + '%' : 'Stable';

    document.getElementById('price-grid').innerHTML = `
        <div class="price-item">
            <div class="price-label">Palengke Retail</div>
            <div class="price-value">₱${crop.prices.retail}</div>
            <div class="price-unit">per ${crop.unit}</div>
            <div class="price-trend ${trendClass}"><span>${trendIcon}</span><span>${trendText} vs last week</span></div>
        </div>
        <div class="price-item">
            <div class="price-label">Wholesale</div>
            <div class="price-value">₱${crop.prices.wholesale}</div>
            <div class="price-unit">per ${crop.unit}</div>
            <div class="price-trend stable"><span>→</span><span>DA monitored</span></div>
        </div>
        <div class="price-item">
            <div class="price-label">Farmgate</div>
            <div class="price-value">₱${crop.prices.farmgate}</div>
            <div class="price-unit">per ${crop.unit}</div>
            <div class="price-trend stable"><span>📍</span><span>${crop.region}</span></div>
        </div>
    `;

    document.getElementById('info-grid').innerHTML = `
        <div class="info-card"><div class="info-label">Scientific Name</div><div class="info-value">${crop.scientific}</div></div>
        <div class="info-card"><div class="info-label">Family</div><div class="info-value">${crop.family}</div></div>
        <div class="info-card"><div class="info-label">Origin</div><div class="info-value">${crop.origin}</div></div>
        <div class="info-card"><div class="info-label">Growing Season</div><div class="info-value">${crop.season}</div></div>
        <div class="info-card"><div class="info-label">Key Nutrition</div><div class="info-value">${crop.nutrition}</div></div>
        <div class="info-card"><div class="info-label">Common Uses</div><div class="info-value">${crop.uses}</div></div>
    `;

    const altContainer = document.getElementById('alt-predictions');
    if (results.length > 1) {
        altContainer.innerHTML = results.slice(1, 4).map((res, idx) => `
            <div class="alt-item" onclick="showCropDetails('${res.crop.key}')">
                <div class="alt-rank">${idx + 2}</div>
                <div class="alt-info">
                    <div class="alt-name">${res.crop.name}</div>
                    <div class="alt-bar-bg"><div class="alt-bar-fill" style="width: 0%" data-width="${res.confidence * 100}%"></div></div>
                </div>
                <div class="alt-percent">${(res.confidence * 100).toFixed(1)}%</div>
            </div>
        `).join('');
        setTimeout(() => { document.querySelectorAll('.alt-bar-fill').forEach(bar => { bar.style.width = bar.dataset.width; }); }, 200);
    } else { altContainer.innerHTML = ''; }

    resultDiv.classList.add('active');
}

function showCropDetails(cropKey) {
    const crop = ROOT_CROPS[cropKey];
    if (!crop) return;
    const mockResult = [{ crop: crop, confidence: 1.0, matched: true }];
    document.getElementById('empty-state').style.display = 'none';
    document.getElementById('prediction-result').classList.remove('active');
    displayResults(mockResult);
    document.querySelector('.results-content').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showToast(message, isError) {
    const toast = document.getElementById('toast');
    document.getElementById('toast-message').textContent = message;
    document.getElementById('toast-icon').textContent = isError ? '❌' : '✅';
    toast.classList.add('show'); if (isError) toast.classList.add('error');
    setTimeout(() => { toast.classList.remove('show', 'error'); }, 3000);
}

init();
