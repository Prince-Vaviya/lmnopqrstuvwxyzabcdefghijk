import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.analytics import AnalyticsEngine
from app.data_processor import DataProcessor

client = TestClient(app)

def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["actualsLoaded"] > 0
    assert data["forecastsLoaded"] > 0

def test_overview_endpoint():
    response = client.get("/api/overview?date_from=2026-01-01&date_to=2026-01-07&cutoff_time=11:00&resolution=hourly")
    assert response.status_code == 200
    data = response.json()
    assert "metrics" in data
    metrics = data["metrics"]
    assert metrics["count"] > 0
    assert metrics["mae"] > 0
    assert metrics["rmse"] >= metrics["mae"]
    assert "p90" in metrics
    assert "bias" in metrics

def test_timeseries_endpoint():
    response = client.get("/api/timeseries?date_from=2026-01-01&date_to=2026-01-02")
    assert response.status_code == 200
    data = response.json()
    assert data["count"] > 0
    first = data["data"][0]
    assert "timestamp" in first
    assert "actual" in first
    assert "forecast" in first
    assert "error" in first
    assert "publishTime" in first

def test_diurnal_endpoint():
    response = client.get("/api/diurnal?date_from=2026-01-01&date_to=2026-01-10")
    assert response.status_code == 200
    data = response.json()
    assert len(data["profile"]) == 24
    assert data["profile"][0]["hour"] == 0

def test_distribution_endpoint():
    response = client.get("/api/distribution?date_from=2026-01-01&date_to=2026-01-10&bins=10")
    assert response.status_code == 200
    data = response.json()
    assert len(data["bins"]) == 10

def test_sensitivity_endpoint():
    response = client.get("/api/sensitivity?date_from=2026-01-01&date_to=2026-01-07")
    assert response.status_code == 200
    data = response.json()
    assert len(data["sensitivity"]) == 5

def test_analytics_math():
    sample_data = [
        {"error": 100.0, "absError": 100.0, "actual": 1000.0, "forecast": 1100.0},
        {"error": -50.0, "absError": 50.0, "actual": 1000.0, "forecast": 950.0},
    ]
    res = AnalyticsEngine.calculate_summary_metrics(sample_data)
    assert res["count"] == 2
    assert res["mae"] == 75.0
    assert res["bias"] == 25.0
    assert res["totalActualGWh"] == 2.0
    assert res["totalForecastGWh"] == 2.05
