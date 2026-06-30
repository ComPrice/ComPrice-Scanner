# 🥔 ComPrice Scanner — Root Crop Identification & DTI Price Monitor

AI-powered Progressive Web App (PWA) that identifies root crops using your camera and displays DTI-monitored market prices.

## Live Demo
https://comprice.github.io/ComPrice-Scanner/

## Features
- 📷 Real-time camera scanning with TensorFlow.js
- 🤖 MobileNet AI classification (runs in browser)
- 💰 DTI Price Monitor — Palengke Retail, Wholesale, Farmgate
- 🌿 Crops organized by botanical family (Plant Taxonomy)
- 📱 PWA — Installable on mobile, works offline
- 🔒 Privacy-first — Images never leave your device

## File Structure
```
ComPrice-Scanner/
├── index.html      # Main app (HTML + CSS)
├── app.js          # All JavaScript logic
├── manifest.json   # PWA manifest
├── sw.js           # Service Worker (offline support)
├── offline.html    # Offline fallback page
└── README.md       # This file
```

## Supported Crops (14 across 11 Families)
| Family | Crops |
|--------|-------|
| Solanaceae | Potato |
| Convolvulaceae | Sweet Potato |
| Apiaceae | Carrot, Parsnip |
| Euphorbiaceae | Cassava |
| Araceae | Taro |
| Dioscoreaceae | Yam |
| Zingiberaceae | Ginger, Turmeric |
| Amaranthaceae | Beetroot |
| Brassicaceae | Radish, Turnip |
| Fabaceae | Jicama |
| Nelumbonaceae | Lotus Root |

## Tech Stack
- HTML5 / CSS3 / Vanilla JavaScript
- TensorFlow.js + MobileNet
- GitHub Pages (hosting)
- Service Worker (PWA)

## DTI Price Data
Prices are based on DA/DTI market surveillance data for Philippine palengke (wet markets). Three tiers shown:
- **Palengke Retail** — Consumer price at wet market
- **Wholesale** — Bulk trading price
- **Farmgate** — Price at farm level

## How to Use
1. Open the live demo on your phone
2. Allow camera access
3. Point at a root crop and tap "Capture"
4. View AI identification + DTI prices
5. Or tap any crop in the classification section

## Development
To run locally, simply open `index.html` in a browser. No server required.
