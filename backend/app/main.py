import os
import logging
from typing import Optional, List
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.elexon_client import ElexonClient
from app.data_processor import DataProcessor
from app.analytics import AnalyticsEngine

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("main")

app = FastAPI(
    title="UK Renewable Forecast & Day-Ahead Decision Support API",
    description="Elexon BMRS Wind Generation Actuals vs Day-Ahead Forecast Evaluation Platform",
    version="1.0.0"
)

# Enable CORS for frontend development and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = ElexonClient()
# Preload datasets
try:
    actuals_data = client.get_actual_generation("2026-01-01", "2026-01-31")
    forecasts_data = client.get_wind_forecasts("2025-12-30T00:00:00Z", "2026-02-01T23:59:59Z")
    processor = DataProcessor(actuals_data, forecasts_data)
    logger.info(f"Loaded {len(actuals_data)} actuals and {len(forecasts_data)} forecasts.")
except Exception as e:
    logger.error(f"Error loading initial Elexon data: {e}")
    processor = None

@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "market": "UK Day-Ahead Wholesale",
        "elexonDatasets": ["FUELHH (WIND)", "WINDFOR"],
        "actualsLoaded": len(actuals_data) if actuals_data else 0,
        "forecastsLoaded": len(forecasts_data) if forecasts_data else 0,
        "dateWindow": "January 2026"
    }

@app.get("/api/overview")
def get_overview(
    date_from: str = Query("2026-01-01", description="Start date (YYYY-MM-DD)"),
    date_to: str = Query("2026-01-31", description="End date (YYYY-MM-DD)"),
    cutoff_time: str = Query("11:00", description="D-1 Day-Ahead Cutoff time (HH:MM)"),
    resolution: str = Query("hourly", description="'hourly' or 'half_hourly'")
):
    if not processor:
        raise HTTPException(status_code=500, detail="DataProcessor not initialized")

    aligned = processor.align_data(
        date_from=date_from,
        date_to=date_to,
        cutoff_time=cutoff_time,
        resolution=resolution
    )
    metrics = AnalyticsEngine.calculate_summary_metrics(aligned)
    return {
        "parameters": {
            "dateFrom": date_from,
            "dateTo": date_to,
            "cutoffTime": cutoff_time,
            "resolution": resolution
        },
        "metrics": metrics
    }

@app.get("/api/timeseries")
def get_timeseries(
    date_from: str = Query("2026-01-01"),
    date_to: str = Query("2026-01-31"),
    cutoff_time: str = Query("11:00"),
    resolution: str = Query("hourly")
):
    if not processor:
        raise HTTPException(status_code=500, detail="DataProcessor not initialized")

    aligned = processor.align_data(
        date_from=date_from,
        date_to=date_to,
        cutoff_time=cutoff_time,
        resolution=resolution
    )
    return {
        "count": len(aligned),
        "data": aligned
    }

@app.get("/api/diurnal")
def get_diurnal(
    date_from: str = Query("2026-01-01"),
    date_to: str = Query("2026-01-31"),
    cutoff_time: str = Query("11:00"),
    resolution: str = Query("hourly")
):
    if not processor:
        raise HTTPException(status_code=500, detail="DataProcessor not initialized")

    aligned = processor.align_data(
        date_from=date_from,
        date_to=date_to,
        cutoff_time=cutoff_time,
        resolution=resolution
    )
    profile = AnalyticsEngine.calculate_diurnal_profile(aligned)
    return {
        "count": len(profile),
        "profile": profile
    }

@app.get("/api/distribution")
def get_distribution(
    date_from: str = Query("2026-01-01"),
    date_to: str = Query("2026-01-31"),
    cutoff_time: str = Query("11:00"),
    resolution: str = Query("hourly"),
    bins: int = Query(16, ge=5, le=30)
):
    if not processor:
        raise HTTPException(status_code=500, detail="DataProcessor not initialized")

    aligned = processor.align_data(
        date_from=date_from,
        date_to=date_to,
        cutoff_time=cutoff_time,
        resolution=resolution
    )
    distribution = AnalyticsEngine.calculate_error_distribution(aligned, num_bins=bins)
    return distribution

@app.get("/api/daily")
def get_daily(
    date_from: str = Query("2026-01-01"),
    date_to: str = Query("2026-01-31"),
    cutoff_time: str = Query("11:00"),
    resolution: str = Query("hourly")
):
    if not processor:
        raise HTTPException(status_code=500, detail="DataProcessor not initialized")

    aligned = processor.align_data(
        date_from=date_from,
        date_to=date_to,
        cutoff_time=cutoff_time,
        resolution=resolution
    )
    daily = AnalyticsEngine.calculate_daily_summary(aligned)
    return {
        "count": len(daily),
        "daily": daily
    }

@app.get("/api/sensitivity")
def get_sensitivity(
    date_from: str = Query("2026-01-01"),
    date_to: str = Query("2026-01-31"),
    resolution: str = Query("hourly")
):
    """
    Evaluates forecast accuracy across multiple Day-Ahead cutoff timestamps (06:00, 09:00, 11:00, 14:00, 18:00).
    Demonstrates the value of information closer to gate closure.
    """
    if not processor:
        raise HTTPException(status_code=500, detail="DataProcessor not initialized")

    test_cutoffs = ["06:00", "09:00", "11:00", "14:00", "18:00"]
    results = []
    for ct in test_cutoffs:
        aligned = processor.align_data(
            date_from=date_from,
            date_to=date_to,
            cutoff_time=ct,
            resolution=resolution
        )
        metrics = AnalyticsEngine.calculate_summary_metrics(aligned)
        results.append({
            "cutoffTime": ct,
            "mae": metrics["mae"],
            "rmse": metrics["rmse"],
            "mape": metrics["mape"],
            "bias": metrics["bias"],
            "p90": metrics["p90"],
            "count": metrics["count"]
        })
    return {"sensitivity": results}

# Serve frontend build in production if available
root_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
frontend_dist = os.path.join(root_dir, "frontend", "dist")
if os.path.exists(frontend_dist):
    app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="frontend")
