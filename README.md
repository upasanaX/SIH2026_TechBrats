# KrishiKavach (कृषिकवच / কৃষিকবচ)
### Panchayat-Level Hyperlocal Agro-Meteorological Grid & Direct Marketplace
**National Digital Agriculture & Disaster Mitigation Platform**

---

## 🌾 Project Overview

**KrishiKavach** is a farmer-first digital platform that converts broad meteorological forecasts (25–50 km grid cells) into localized, village- and Panchayat-accurate predictions (2.5 km micro-grids). 

By integrating high-resolution digital elevation models (DEMs), topographical drainage basins, and real-time soil moisture indices, KrishiKavach protects smallholder farmers against:
1. **Unpredicted Localized Disasters**: Intense convective cloudbursts, waterlogging, hailstorms, high-tide coastal surges, and thermal shocks.
2. **Crop Input Wastage**: Preventing expensive fertilizer and pesticide washouts by issuing 6–12 hour proactive agronomic warnings.
3. **Middleman Exploitation & Distress Selling**: Providing a direct farmer-to-consumer marketplace with transparent pricing and direct payout settlement.
4. **Digital Divide Inequity**: Ensuring tri-channel dissemination across modern smartphone apps, basic ₹1,000 keypad feature phones (cellular SMS), and automated regional IVR voice calls in English, Hindi, and Bengali.

---

## 🏛️ Government-Grade Visual System & Branding

- **Dual-Script Identity**: Displays **KrishiKavach**, Devanagari (**कृषिकवच**), and Bengali (**কৃষিকবচ**) with official national agro-tech branding.
- **Strict Color Semantics**: 
  - Deep Forest Green (`#14532d`) and Emerald (`#059669`) for primary agro-branding.
  - Slate Navy (`#0f172a`) for data chrome and navigation.
  - Amber / Red strictly reserved for hazard severity:
    - **Critical**: Dark Red (`#991b1b`)
    - **High Risk**: Red-Orange (`#dc2626`)
    - **Moderate Risk**: Amber (`#d97706`)
    - **Advisory / Normal**: Blue (`#2563eb`)
- **Universal Accessibility**:
  - High-Contrast Sunlight Mode (for field visibility under direct sun)
  - 115% Large Typography Mode (for elder farmers without reading glasses)
  - In-browser Web Speech API audio synthesizer (multilingual voice advisories)
  - Low-connectivity failover simulation (demonstrating seamless fallback to 2G SMS/IVR)

---

## 🧭 Information Architecture & Page Structure

The prototype implements 15 structured pages and views:

| # | Route / Tab | Module Name | Key Interactive Capabilities |
|---|-------------|-------------|------------------------------|
| 1 | `landing` | Public Landing Page | Hero, 3 pillars, 6-step workflow, impact metrics, credibility ecosystem. |
| 2 | `farmer` | Farmer Dashboard | Weather cards, 7-day AreaChart, hourly rain accumulation, "What should I do now?" checkboxes, active sirens. |
| 3 | `weather` | Hyperlocal Weather | District (25km) vs KrishiKavach (2.5km) downscaled comparison widget, atmospheric readings. |
| 4 | `alerts` | Disaster Warning Center | Multi-hazard filters, timeline, checklist tracker, simulated SMS & IVR outbound call triggers. |
| 5 | `advisory` | Crop Advisory Engine | Stage-specific agronomic advice (Paddy, Mustard, Potato, Tomato), multilingual switch, voice read-aloud. |
| 6 | `map` | Farm & Panchayat Map | Geospatial radar sweep simulation, hazard polygons, alert pins, FPO hubs, interactive Panchayat drawer. |
| 7 | `marketplace` | Direct Marketplace | Search, category filters, sorting by freshness/price, transparent price margin comparison modal. |
| 8 | `product` | Product Details Page | Farmer story, village origin, harvest date, quantity selector, "Message Grower" modal. |
| 9 | `cart` | Cart & Multi-Step Checkout | 5-step order flow (Cart → Fulfillment → Address → Payment → Confetti confirmation receipt). |
| 10 | `government` | FPO / Govt Dashboard | Oversight KPIs, risk distribution donut chart, channel delivery bar chart, sortable Panchayat table, PDF report generator. |
| 11 | `communication` | Accessibility & IVR Center | Multichannel delivery logs, SMS & IVR phone frame simulator, voice synthesizer, tower failover toggle. |
| 12 | `about` | Solution Overview | Problem statement, 3 pillars, uniqueness, feasibility, and socio-economic viability. |
| 13 | `architecture` | Technical Stack & Pipeline | Ingestion stages, XGBoost downscaling architecture, FastAPI & PostGIS blueprints. |
| 14 | `auth` | Identity & Registration | 1-click evaluator demo logins (Farmer, Consumer, Official) + full Panchayat registration form. |
| 15 | `settings` | Settings & Privacy | Alert thresholds, GPS consent, statutory disclaimers, and data separation notice. |

---

## 🛠️ Technology Stack

- **Frontend Core**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4 with custom theme tokens and high-contrast accessibility layers
- **Icons**: Lucide React
- **Data Visualization**: Recharts (AreaChart, BarChart, PieChart)
- **Geospatial Visualization**: Interactive SVG/Canvas Vector Map with animated radar sweeps, layer toggles, and polygon overlays
- **Accessibility & Speech**: Web Speech API for multilingual voice synthesis
- **State Management**: React Context with typed local persistence

---

## 🔌 API Readiness: Where to Connect Production Backends

The frontend is structured with modular data services in `src/data/` and `src/context/AppContext.tsx`. Connecting real backend APIs requires updating only the service endpoints:

```typescript
// 1. Weather Downscaling Service (src/data/weatherData.ts)
// Replace static mock with FastAPI endpoint:
// GET /api/v1/weather/downscaled?lat={lat}&lng={lng}&panchayat_id={id}
// Connects to: IMD AWS API, NASA POWER, and XGBoost spatial regression model.

// 2. Localized Disaster Alerts (src/data/alerts.ts)
// Replace with WebSocket or Polling:
// GET /api/v1/alerts/active?panchayat_id={id}
// Dispatches to: Twilio / Exotel / Kisan Call Center telecom gateway for SMS and automated IVR voice calls.

// 3. Direct Marketplace & Orders (src/data/products.ts & CartContext)
// Replace with REST endpoints:
// GET /api/v1/marketplace/products?category={cat}&district={district}
// POST /api/v1/marketplace/orders
// Connects to: PostgreSQL/PostGIS database with UPI QR settlement.

// 4. Multi-Language Voice Synthesis (src/context/AppContext.tsx)
// Currently uses the browser's native window.speechSynthesis (Web Speech API).
// In production, connect to Bhashini (National Language Translation Mission) for 22 Indian languages.
```

---

## 🚀 Local Setup & Execution

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### Run Development Server
```bash
# Clone or navigate to the project directory
git clone https://github.com/upasanaX/SIH2026_TechBrats.git
cd SIH2026_TechBrats

# Install dependencies
npm install --legacy-peer-deps

# Start Vite development server
npm run dev
```
Open `http://localhost:5173/` in any modern web browser.

### Build Production Bundle
```bash
npm run build
```
Generates clean, minified production assets into the `dist/` directory.

---

## 👥 Demonstration Tour Guide

1. **Role Switcher**: Click the **"Farmer Mode"** dropdown in the header to switch between:
   - *Farmer Dashboard* (Crop defense, weather trends, action checklist)
   - *Consumer Marketplace* (Direct farm-fresh produce purchase)
   - *Govt / FPO Monitoring* (District-level KPIs, sortable Panchayat comparison table, print report)
2. **Panchayat Switcher**: Click the location button in the header (`Bhangar-I`) to switch to other Panchayats like `Canning-II` (Coastal Inundation) or `Singur` (Potato Belt).
3. **SMS & IVR Simulator**: Click the **"SMS / IVR Test"** button in the header or on any alert card to test feature-phone SMS formatting and live synthetic voice phone call audio.
4. **Crop Advisory**: Navigate to **Crop Advisory**, switch languages to *বাংলা* or *हिंदी*, and click **"Read Aloud"** to hear spoken agronomic recommendations.
5. **Direct Checkout**: In **Direct Marketplace**, click **"Price Breakdown"** on any crop to see middleman savings, add items, and complete the 5-step simulated checkout with confetti confirmation.
