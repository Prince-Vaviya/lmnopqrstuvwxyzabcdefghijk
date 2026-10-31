# AeroTrade UK

A lightweight, clean analytics dashboard that compares **UK Wind Power Forecasts** against **Actual Power Generation** from Elexon BMRS (January 2026 data).

---

## ⚡ What Does This Project Do?

1. **Loads Power Data**: Pulls actual national wind generation and day-ahead forecast data.
2. **Aligns Time Periods**: Aligns hourly forecasts with actual generation based on day-ahead auction cutoff times (e.g. 11:00 GMT).
3. **Calculates Forecast Error**: Computes key accuracy metrics:
   - **MAE** (Mean Absolute Error)
   - **RMSE** (Root Mean Squared Error)
   - **Bias** (Over-forecasting vs under-forecasting tendency)
4. **Displays Interactive Visuals**: Visualizes the forecast vs. actual curve and difference in a responsive React dashboard.

---

## 🚀 Quickstart

### Option 1: Docker (Fastest)

```bash
docker compose up --build
```
Open [http://localhost:8000](http://localhost:8000) in your browser.

---

### Option 2: Run Backend & Frontend Separately

**1. Backend (FastAPI):**
```bash
cd backend
source venv/bin/activate    # or: python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Backend API will run at [http://localhost:8000/api/health](http://localhost:8000/api/health).

**2. Frontend (React + Vite):**
```bash
cd frontend
npm install
npm run dev
```
Frontend will run at [http://localhost:5173](http://localhost:5173).

---

## 📁 Project Structure

```text
├── backend/
│   ├── app/
│   │   ├── main.py             # FastAPI entry point & API endpoints
│   │   ├── elexon_client.py    # Loads Elexon wind actuals & forecasts (with cached JSON)
│   │   ├── data_processor.py   # Aligns forecasts & actuals by cutoff time
│   │   └── analytics.py        # Error calculation (MAE, RMSE, MAPE, Bias)
│   ├── data/                   # Cached January 2026 BMRS datasets
│   └── tests/                  # Pytest unit tests
├── frontend/
│   ├── src/
│   │   ├── App.jsx             # Main dashboard view
│   │   └── components/         # Control bar, KPI cards, TimeSeries chart, Data table
│   └── package.json
└── docs/                       # In-depth technical specifications & commercial briefs
    ├── TECHNICAL_LEAD_REVIEW.md
    └── CLIENT_PITCH.md
```

---

## 📖 In-Depth Documentation

- **[Technical Lead Review & Architecture Specification](docs/TECHNICAL_LEAD_REVIEW.md):** System topology, alignment algorithms, zero-lookahead cutoff formulations, and endpoint specs.
- **[Commercial Client Pitch Deck](docs/CLIENT_PITCH.md):** Wholesale power procurement rationale, Balancing Mechanism exposure analysis, and ROI.

---

## 🧪 Running Tests

```bash
cd backend
PYTHONPATH=. venv/bin/pytest tests/test_api.py
```
