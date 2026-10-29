# AeroTrade UK: Renewable Forecast & Day-Ahead Power Procurement Platform

[![Docker Ready](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![React 18](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-cyan.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20Python-green.svg)](https://fastapi.tiangolo.com/)
[![Elexon BMRS](https://img.shields.io/badge/Data-Elexon%20BMRS%20(Jan%202026)-orange.svg)](https://bmrs.elexon.co.uk/)

A full-stack, enterprise-grade decision-support platform built for **UK Energy Utilities** trading on the wholesale Day-Ahead electricity market (EPEX SPOT / Nord Pool). 

The platform evaluates the accuracy of renewable wind generation forecasts against actual national generation from **Elexon BMRS**, helping power procurement teams optimize day-ahead thermal power purchasing and quantify hedging buffers to prevent costly Balancing Mechanism cash-out penalties.

---

## Key Features

1. **Latest Day-Ahead Forecast Filtering:** Enforces strict decision gate closure timing (default: D-1 11:00 GMT EPEX auction deadline) with zero lookahead bias.
2. **Quantitative Accuracy Evaluation:** Computes MAE (MW), RMSE (MW), MAPE (%), Mean Directional Bias (MBE), and Standard Deviation ($\sigma$).
3. **P90 Safety Hedging Margins:** Translates forecast variance into actionable MW thermal reserve buffers.
4. **Diurnal Pattern Analysis:** Uncovers 24-hour error trends to pinpoint exposure during the critical 17:00–19:00 evening peak.
5. **Interactive Procurement Simulator:** Allows trading desks to simulate consumer demand profiles and calculate net thermal procurement needs with avoided penalty estimates.
6. **Granular Ledger & CSV Export:** Full audit trail across all 744 hourly settlement periods in January 2026.
7. **Integrated Pitch & Tech Review Modals:** Client commercial pitch deck and internal engineering review accessible directly within the dashboard.

---

## AI Tools Disclosure

> **Mandatory Disclosure:** AI tools (specifically Google DeepMind Antigravity AI coding assistant and Gemini models) were utilized in the ideation, software architecture design, data pipeline construction, frontend component engineering, unit testing, and technical documentation of this application.

---

## Deliverable Documentation

- **[Client Commercial Pitch Deck](CLIENT_PITCH.md):** Tailored for the UK Utility Wholesale Trading & Power Purchase Desk, focusing on commercial ROI and imbalance risk mitigation.
- **[Internal Technical Lead Review](TECHNICAL_LEAD_REVIEW.md):** Comprehensive engineering specification covering system topology, temporal alignment logic, mathematical formulations, and containerization.

---

## Tech Stack

- **Frontend:** React 18, Vite, Recharts, Lucide Icons, Modern Vanilla CSS.
- **Backend:** Python 3.11+, FastAPI, Uvicorn, Requests, Pydantic, Pytest.
- **Data Source:** Elexon BMRS Live APIs:
  - Actuals: `FUELHH/stream` (`fuelType="WIND"`)
  - Forecasts: `WINDFOR/stream` (`publishTime` vs `startTime`)
- **Containerization:** Multi-stage `Dockerfile`, `docker-compose.yml`.

---

## Quickstart (Local Development)

### 1. Prerequisites
- Python 3.11+
- Node.js 18+ and npm
- Docker (optional, for containerized run)

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment and install dependencies
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run backend test suite
PYTHONPATH=. pytest tests/test_api.py -v

# Start FastAPI backend server
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### 3. Frontend Setup
In a new terminal:
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies and start Vite dev server
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser. The Vite dev server automatically proxies `/api/*` calls to the FastAPI backend on port 8000.

---

## Running with Docker

You can run the entire unified full-stack application with a single command:

```bash
docker-compose up --build
```

Then visit [http://localhost:8000](http://localhost:8000). The multi-stage container builds the React frontend, packages the Python backend and cached Elexon data, and serves the entire platform seamlessly.

---

## Deployment Guide

### Deploying to Heroku
The project includes a `Procfile` and dynamic `$PORT` handling:

```bash
# Log in to Heroku CLI
heroku login

# Create Heroku app
heroku create aerotrade-uk

# Deploy using container stack
heroku stack:set container
git push heroku main

# Open deployed app
heroku open
```

### Deploying Frontend to Vercel
The repository includes a `vercel.json` configuration file:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```
Configure your Vercel project environment variable `VITE_API_URL` to point to your deployed Python backend on Heroku/Render.

---

## January 2026 Elexon Ground Truth Insights

| Metric | January 2026 Outturn |
| :--- | :--- |
| **Total Actual Wind Outturn** | 8,616.07 GWh |
| **Total Forecasted Wind** | 9,985.25 GWh |
| **Net Imbalance Volume** | +1,369.18 GWh |
| **Mean Absolute Error (MAE)** | 2,122.8 MW (nMAE: 11.96%) |
| **Root Mean Squared Error (RMSE)** | 2,616.7 MW |
| **Mean Directional Bias** | +1,840.3 MW |
| **Over-Forecast Frequency** | **84.4% of all hours** |
| **P90 Hedging Margin** | **+4,313.0 MW** |
| **Peak Actual Generation** | 17,755.5 MW |

**Key Commercial Takeaway:** Day-ahead wind forecasts chronically over-predicted wind generation in January 2026 (84.4% of the time). Without AeroTrade's quantified P90 buffer (+4,313 MW), trading desks are exposed to severe cash-out penalties in the UK Balancing Mechanism.
