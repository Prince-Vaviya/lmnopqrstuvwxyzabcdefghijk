# AeroTrade UK: Internal Technical Lead Review & Architecture Specification
**Review Target:** Internal Technical Lead / Engineering Review Board  
**Author:** Product Developer  
**Status:** Version 1.0 (Tested & Containerized)  

---

## 1. System Overview & Architecture

AeroTrade UK is a modular full-stack analytics platform built to ingest, align, and evaluate renewable power forecast accuracy from Elexon BMRS in the context of the UK wholesale electricity market.

```
+--------------------------------------------------------------------------------+
|                               SYSTEM TOPOLOGY                                  |
+--------------------------------------------------------------------------------+
|                                                                                |
|  [ Elexon BMRS API ]                                                           |
|         │                                                                      |
|         ├─── FUELHH/stream (Actuals: Half-hourly, fuelType="WIND")             |
|         └─── WINDFOR/stream (Forecasts: Hourly, publishTime vs startTime)      |
|                      │                                                         |
|                      ▼                                                         |
|         ┌─────────────────────────────────────────────────┐                    |
|         │   Data Ingestion & Two-Tier Cache Layer         │                    |
|         │   (backend/app/elexon_client.py)                │                    |
|         │   • Local JSON persistence                      │                    |
|         │   • Memory lookup tables                        │                    |
|         └─────────────────────────────────────────────────┘                    |
|                      │                                                         |
|                      ▼                                                         |
|         ┌─────────────────────────────────────────────────┐                    |
|         │   Temporal Alignment & Decision Gate Engine     │                    |
|         │   (backend/app/data_processor.py)               │                    |
|         │   • D-1 Gate Closure Cutoff (publishTime <= T)  │                    |
|         │   • Resolution mapping: Hourly / Half-Hourly    │                    |
|         └─────────────────────────────────────────────────┘                    |
|                      │                                                         |
|                      ▼                                                         |
|         ┌─────────────────────────────────────────────────┐                    |
|         │   Statistical Analytics Engine                  │                    |
|         │   (backend/app/analytics.py)                    │                    |
|         │   • MAE, RMSE, MAPE, Mean Bias Error (MBE)      │                    |
|         │   • Empirical Quantiles (P10, P50, P90, P95)    │                    |
|         │   • Diurnal 24h Profile, Error Histogram Bins   │                    |
|         └─────────────────────────────────────────────────┘                    |
|                      │                                                         |
|                      ▼                                                         |
|         ┌─────────────────────────────────────────────────┐                    |
|         │   FastAPI Asynchronous REST Gateway             │                    |
|         │   (backend/app/main.py)                         │                    |
|         │   • JSON REST APIs: /overview, /timeseries, etc.│                    |
|         │   • Production Static Asset Mount               │                    |
|         └─────────────────────────────────────────────────┘                    |
|                      │                                                         |
|                      ▼                                                         |
|         ┌─────────────────────────────────────────────────┐                    |
|         │   React 18 / Vite Trading Dashboard             │                    |
|         │   (frontend/src/)                               │                    |
|         │   • Recharts dual-axis trajectory visualization │                    |
|         │   • Interactive thermal hedging calculator      │                    |
|         │   • Daily ledger with CSV export                │                    |
|         └─────────────────────────────────────────────────┘                    |
|                                                                                |
+--------------------------------------------------------------------------------+
```

---

## 2. Key Engineering Decisions & Rationale

### 2.1 Handling the Asymmetry between `FUELHH` and `WINDFOR`
- **Data Asymmetry:**
  - `FUELHH` (actual generation) is reported at **30-minute settlement period (half-hourly)** resolution (48 records per day).
  - `WINDFOR` (forecasted wind generation) is published at **60-minute (hourly)** resolution (73 future hourly steps per publication run).
- **Solution:**
  - In `hourly` mode (standard for wholesale auctions): The engine groups the two half-hourly `FUELHH` records (e.g. `00:00` and `00:30`) and averages their generation to produce the true hourly outturn for the hour starting at `00:00`.
  - In `half_hourly` mode: The engine applies step-wise block mapping (standard for hourly power contracts traded across half-hourly balancing periods).

### 2.2 Strict Day-Ahead Decision Gate Enforcement (Zero Lookahead Bias)
- Each forecast record in `WINDFOR` has both a `startTime` (target delivery period) and a `publishTime` (timestamp when the forecast was issued).
- For a target delivery date $D$, day-ahead trading decisions are made on day $D - 1$.
- Standard EPEX SPOT UK Day-Ahead gate closure is **11:00 GMT**.
- **Algorithm in `DataProcessor._get_latest_forecast`:**
  $$\text{Cutoff} = \text{datetime}(D-1, \text{cutoff\_hour}, \text{cutoff\_minute})$$
  $$\text{Candidate Forecasts} = \{ f \in \text{WINDFOR} \mid f.\text{startTime} = t \land f.\text{publishTime} \le \text{Cutoff} \}$$
  $$\text{Selected Forecast} = \arg\max_{f \in \text{Candidate Forecasts}} (f.\text{publishTime})$$
- This guarantees zero lookahead leakage: forecasts published at 11:30 or 15:30 on $D-1$ are ignored for the day-ahead auction view, accurately simulating the exact information available to traders at decision time.

---

## 3. Statistical Formulations

Let $N$ be the number of aligned settlement periods in the evaluation window.  
Let $A_t$ be the actual wind generation (MW) at period $t$.  
Let $F_t$ be the latest available day-ahead forecast (MW) for period $t$.  
The error is defined as:
$$e_t = F_t - A_t$$

1. **Mean Absolute Error (MAE):**
   $$\text{MAE} = \frac{1}{N} \sum_{t=1}^{N} |F_t - A_t|$$
2. **Root Mean Squared Error (RMSE):**
   $$\text{RMSE} = \sqrt{\frac{1}{N} \sum_{t=1}^{N} (F_t - A_t)^2}$$
3. **Mean Bias Error (MBE):**
   $$\text{MBE} = \frac{1}{N} \sum_{t=1}^{N} (F_t - A_t)$$
   - $\text{MBE} > 0$: Systematic over-forecasting (Short risk).
   - $\text{MBE} < 0$: Systematic under-forecasting (Long risk).
4. **Normalized MAE (nMAE):**
   $$\text{nMAE} = \frac{\text{MAE}}{\max_{t} A_t} \times 100\%$$
5. **Empirical Quantiles (Value-at-Risk):**
   Sorted errors $e_{(1)} \le e_{(2)} \le \dots \le e_{(N)}$. The $p$-th percentile is:
   $$\hat{q}_p = e_{(\lceil p \cdot N \rceil)}$$
   $P_{90}$ is extracted to define the recommended Day-Ahead thermal procurement margin.

---

## 4. API Endpoints Specification

| Method | Endpoint | Query Parameters | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | - | Health check and cached record counts |
| `GET` | `/api/overview` | `date_from`, `date_to`, `cutoff_time`, `resolution` | Summary KPIs, MAE, RMSE, Bias, P90, GWh |
| `GET` | `/api/timeseries` | `date_from`, `date_to`, `cutoff_time`, `resolution` | Aligned time-series with error delta and metadata |
| `GET` | `/api/diurnal` | `date_from`, `date_to`, `cutoff_time`, `resolution` | 24-hour diurnal profile of MAE and Bias |
| `GET` | `/api/distribution` | `date_from`, `date_to`, `cutoff_time`, `bins` | Histogram bins and frequency distribution |
| `GET` | `/api/daily` | `date_from`, `date_to`, `cutoff_time`, `resolution` | Day-by-day table of outturn and error metrics |
| `GET` | `/api/sensitivity` | `date_from`, `date_to`, `resolution` | Multi-gate comparison (06:00, 09:00, 11:00, 14:00, 18:00) |

---

## 5. Verification & Testing Strategy

- **Test Suite (`backend/tests/test_api.py`):**
  - All 7 tests executed via `pytest`:
    1. `test_health`: Verifies BMRS data ingestion and service vitality.
    2. `test_overview_endpoint`: Validates KPI mathematical consistency ($\text{RMSE} \ge \text{MAE}$).
    3. `test_timeseries_endpoint`: Verifies timestamps, delta errors, and lead time metadata.
    4. `test_diurnal_endpoint`: Verifies 24-hour diurnal structure.
    5. `test_distribution_endpoint`: Verifies histogram binning.
    6. `test_sensitivity_endpoint`: Verifies multi-cutoff gate sensitivity.
    7. `test_analytics_math`: Verifies analytical precision and GWh energy integration.
- **Frontend Build Validation:**
  - Compiles via Vite Rollup compiler with zero linter errors into `frontend/dist/`.
- **FastAPI Static Mount:**
  - Validated that FastAPI serves the compiled React single-page application at `/` with HTTP 200 OK.

---

## 6. Containerization & Deployment

- **Dockerfile:** Multi-stage build (Node 22 Alpine $\rightarrow$ Python 3.11 slim).
  - Eliminates Node.js from runtime image, producing a minimal, secure container footprint.
- **Heroku / Cloud Ready:** Dynamic `$PORT` binding in `CMD` (`${PORT:-8000}`).
- **Local Compose:** `docker-compose up --build` launches the full stack on port 8000.
