# 🇳🇿 New Zealand North Island: Interactive Itinerary Storyboard

A premium, data-driven interactive map designed for visual storytelling. This project visualizes a comprehensive road trip itinerary across the North Island of New Zealand, specifically optimized for creating high-quality video recaps.

![Project Preview Overlay](https://img.shields.io/badge/Design-Glassmorphism-blue?style=for-the-badge)
![Tech-Stack](https://img.shields.io/badge/Tech-JS--Vanilla-yellow?style=for-the-badge)

## ✨ Core Features

- **🎬 Storyboard Navigation**: 21 cinematic frames guiding you from Auckland to Wellington.
- **💎 Premium Aesthetics**: Full glassmorphism UI with deep blurs, saturated "frosted" overlays, and smooth transitions.
- **📍 Smart Labeling**: Custom minimalist anchor system with automatic collision resolution (labels won't overlap).
- **🚗 Route Highlighting**: Precise driving paths extracted from KMZ files with an intelligent tooltip that highlights the fastest route.
- **📹 Video Optimized**: Scaled typography and UI elements specifically designed to be crystal clear when recorded and viewed on mobile social media.
- **🇳🇿 Fully Localized**: Content and navigation provided in Mandarin Chinese.

## 🚀 Getting Started

1. **Clone the Repo**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/nz-north-island-itinerary.git
   ```
2. **Open the App**:
   Simply open `north-island.html` in any modern web browser. No server or installation required.

## 🛠 Project Structure

- `north-island.html`: The core application structure.
- `north-island-style.css`: The "Glassmorphism" design system and mobile optimizations.
- `north-island-logic.js`: The "brain" managing frame transitions, markers, and map events.
- `north-island-data.js`: The "database" containing all geographic coordinates, route paths, and anchor data.
- `scripts/`: Python utilities used for data extraction.

## 📊 Data & Maintainability

The project is entirely data-driven. To add a new location or route:

1. Update `north-island-data.js` with new coordinate arrays.
2. Add a new `case` to the switch statement in `north-island-logic.js`.

### KMZ Extraction

If you have new driving routes in KMZ format, you can use the provided script to extract coordinate arrays for Leaflet:

```bash
python3 scripts/extract_kmz.py your_route.kmz
```

## 📜 License

This project is open-source and free to use for personal itinerary planning or as a template for other geographic storytelling projects.
