import math
from typing import List, Dict, Any

class AnalyticsEngine:
    """
    Computes rigorous quantitative accuracy and risk metrics
    for energy utility trading desks.
    """

    @staticmethod
    def calculate_summary_metrics(aligned_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        if not aligned_data:
            return {
                "count": 0,
                "mae": 0.0,
                "rmse": 0.0,
                "mape": 0.0,
                "bias": 0.0,
                "stdDev": 0.0,
                "p10": 0.0,
                "p50": 0.0,
                "p90": 0.0,
                "p95": 0.0,
                "maxOverForecast": 0.0,
                "maxUnderForecast": 0.0,
                "totalActualGWh": 0.0,
                "totalForecastGWh": 0.0,
                "netImbalanceGWh": 0.0,
                "overForecastHoursPct": 0.0,
                "underForecastHoursPct": 0.0,
                "nmae": 0.0
            }

        n = len(aligned_data)
        errors = [d["error"] for d in aligned_data]
        abs_errors = [d["absError"] for d in aligned_data]
        actuals = [d["actual"] for d in aligned_data]
        forecasts = [d["forecast"] for d in aligned_data]

        mae = sum(abs_errors) / n
        mse = sum(e ** 2 for e in errors) / n
        rmse = math.sqrt(mse)
        bias = sum(errors) / n

        # Standard deviation of error
        variance = sum((e - bias) ** 2 for e in errors) / n
        std_dev = math.sqrt(variance)

        # MAPE calculation (filtered for non-negligible actual generation)
        mape_points = [
            d["absError"] / max(d["actual"], 50.0)
            for d in aligned_data
        ]
        mape = (sum(mape_points) / n) * 100.0

        # Percentiles
        sorted_errors = sorted(errors)
        def percentile(p: float) -> float:
            idx = int(round(p * (n - 1)))
            return sorted_errors[max(0, min(n - 1, idx))]

        p10 = percentile(0.10)
        p25 = percentile(0.25)
        p50 = percentile(0.50)
        p75 = percentile(0.75)
        p90 = percentile(0.90)
        p95 = percentile(0.95)

        max_over = max(errors)
        max_under = min(errors)

        # GWh totals (assuming hourly points = MWh, or half-hourly = MWh / 2)
        is_half_hourly = "settlementPeriod" in aligned_data[0]
        factor = 0.5 if is_half_hourly else 1.0

        total_actual_gwh = (sum(actuals) * factor) / 1000.0
        total_forecast_gwh = (sum(forecasts) * factor) / 1000.0
        net_imbalance_gwh = (sum(errors) * factor) / 1000.0

        over_count = sum(1 for e in errors if e > 0)
        under_count = sum(1 for e in errors if e < 0)

        # Normalized MAE against peak generation in dataset (or capacity)
        peak_actual = max(actuals) if actuals else 1.0
        nmae = (mae / peak_actual) * 100.0 if peak_actual > 0 else 0.0

        return {
            "count": n,
            "mae": round(mae, 1),
            "rmse": round(rmse, 1),
            "mape": round(mape, 2),
            "bias": round(bias, 1),
            "stdDev": round(std_dev, 1),
            "p10": round(p10, 1),
            "p25": round(p25, 1),
            "p50": round(p50, 1),
            "p75": round(p75, 1),
            "p90": round(p90, 1),
            "p95": round(p95, 1),
            "maxOverForecast": round(max_over, 1),
            "maxUnderForecast": round(max_under, 1),
            "totalActualGWh": round(total_actual_gwh, 2),
            "totalForecastGWh": round(total_forecast_gwh, 2),
            "netImbalanceGWh": round(net_imbalance_gwh, 2),
            "overForecastHoursPct": round((over_count / n) * 100.0, 1),
            "underForecastHoursPct": round((under_count / n) * 100.0, 1),
            "nmae": round(nmae, 2),
            "peakActualMW": round(peak_actual, 1)
        }

    @staticmethod
    def calculate_diurnal_profile(aligned_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Calculates error metrics by hour of the day (0 to 23).
        Critical for identifying peak uncertainty windows (e.g. evening ramp).
        """
        hours_data: Dict[int, List[Dict[str, Any]]] = {h: [] for h in range(24)}
        for d in aligned_data:
            h = d.get("hour", 0)
            hours_data[h].append(d)

        profile = []
        for h in range(24):
            pts = hours_data[h]
            if not pts:
                continue
            errors = [p["error"] for p in pts]
            abs_errors = [p["absError"] for p in pts]
            actuals = [p["actual"] for p in pts]
            forecasts = [p["forecast"] for p in pts]

            mae = sum(abs_errors) / len(pts)
            rmse = math.sqrt(sum(e ** 2 for e in errors) / len(pts))
            bias = sum(errors) / len(pts)
            avg_actual = sum(actuals) / len(pts)
            avg_forecast = sum(forecasts) / len(pts)

            profile.append({
                "hour": h,
                "hourLabel": f"{h:02d}:00",
                "mae": round(mae, 1),
                "rmse": round(rmse, 1),
                "bias": round(bias, 1),
                "avgActual": round(avg_actual, 1),
                "avgForecast": round(avg_forecast, 1),
                "sampleCount": len(pts)
            })
        return profile

    @staticmethod
    def calculate_error_distribution(aligned_data: List[Dict[str, Any]], num_bins: int = 16) -> Dict[str, Any]:
        """
        Creates error frequency histogram bins for risk management.
        """
        if not aligned_data:
            return {"bins": [], "minError": 0, "maxError": 0}

        errors = [d["error"] for d in aligned_data]
        min_err = min(errors)
        max_err = max(errors)

        if min_err == max_err:
            return {
                "bins": [{"range": f"{round(min_err)}", "count": len(errors), "percentage": 100.0}],
                "minError": min_err,
                "maxError": max_err
            }

        bin_width = (max_err - min_err) / num_bins
        bins = []
        for i in range(num_bins):
            b_start = min_err + i * bin_width
            b_end = b_start + bin_width if i < num_bins - 1 else max_err + 0.001
            count = sum(1 for e in errors if (b_start <= e < b_end) or (i == num_bins - 1 and e == max_err))
            pct = (count / len(errors)) * 100.0
            mid = (b_start + b_end) / 2
            bins.append({
                "binIndex": i,
                "range": f"{round(b_start)} to {round(b_end)}",
                "binMid": round(mid),
                "count": count,
                "percentage": round(pct, 1),
                "isOverForecast": mid > 0
            })

        return {
            "bins": bins,
            "minError": round(min_err, 1),
            "maxError": round(max_err, 1)
        }

    @staticmethod
    def calculate_daily_summary(aligned_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Breaks down accuracy day by day across the month.
        """
        days_map: Dict[str, List[Dict[str, Any]]] = {}
        for d in aligned_data:
            dt = d.get("targetDate")
            if dt not in days_map:
                days_map[dt] = []
            days_map[dt].append(d)

        daily = []
        for dt, pts in sorted(days_map.items()):
            errors = [p["error"] for p in pts]
            abs_errors = [p["absError"] for p in pts]
            actuals = [p["actual"] for p in pts]
            forecasts = [p["forecast"] for p in pts]

            mae = sum(abs_errors) / len(pts)
            rmse = math.sqrt(sum(e ** 2 for e in errors) / len(pts))
            bias = sum(errors) / len(pts)
            avg_actual = sum(actuals) / len(pts)
            avg_forecast = sum(forecasts) / len(pts)

            daily.append({
                "date": dt,
                "mae": round(mae, 1),
                "rmse": round(rmse, 1),
                "bias": round(bias, 1),
                "avgActual": round(avg_actual, 1),
                "avgForecast": round(avg_forecast, 1),
                "peakActual": round(max(actuals), 1),
                "totalActualMWh": round(sum(actuals), 1),
                "periods": len(pts),
                "direction": "Over" if bias > 0 else "Under"
            })
        return daily
