import logging
from datetime import datetime, timedelta, time
from typing import List, Dict, Any, Optional

logger = logging.getLogger("data_processor")

class DataProcessor:
    """
    Processes and aligns Elexon FUELHH actuals and WINDFOR forecasts.
    Enforces Day-Ahead decision gate closure timing:
    For target delivery date D, selects the latest forecast published on or before D-1 at cutoff_time.
    """

    def __init__(self, actuals: List[Dict[str, Any]], forecasts: List[Dict[str, Any]]):
        self.actuals = actuals
        self.forecasts = forecasts
        self._index_forecasts()

    def _index_forecasts(self):
        """
        Indexes forecasts by target startTime:
        target_startTime -> list of (publishTime_str, generation)
        """
        self.forecast_index: Dict[str, List[tuple]] = {}
        for f in self.forecasts:
            st = f.get("startTime")
            pt = f.get("publishTime")
            gen = f.get("generation")
            if st and pt and gen is not None:
                if st not in self.forecast_index:
                    self.forecast_index[st] = []
                self.forecast_index[st].append((pt, float(gen)))

        # Sort each list by publishTime ascending
        for st in self.forecast_index:
            self.forecast_index[st].sort(key=lambda x: x[0])

    def align_data(
        self,
        date_from: str = "2026-01-01",
        date_to: str = "2026-01-31",
        cutoff_time: str = "11:00",
        resolution: str = "hourly"
    ) -> List[Dict[str, Any]]:
        """
        Aligns actuals and forecasts for each period between date_from and date_to.
        
        cutoff_time: HH:MM on D-1 (e.g. '11:00' UK Day-Ahead gate closure)
        resolution: 'hourly' (24 periods/day) or 'half_hourly' (48 periods/day)
        """
        try:
            cutoff_h, cutoff_m = map(int, cutoff_time.split(":"))
        except Exception:
            cutoff_h, cutoff_m = 11, 0

        # Filter actuals to requested date range
        filtered_actuals = [
            a for a in self.actuals
            if date_from <= a.get("settlementDate", "") <= date_to
            and a.get("fuelType") == "WIND"
        ]

        if resolution == "hourly":
            return self._align_hourly(filtered_actuals, cutoff_h, cutoff_m)
        else:
            return self._align_half_hourly(filtered_actuals, cutoff_h, cutoff_m)

    def _get_latest_forecast(self, target_st: str, cutoff_iso: str) -> Optional[tuple]:
        """
        Returns (publishTime, generation) for latest forecast published <= cutoff_iso.
        """
        candidates = self.forecast_index.get(target_st, [])
        valid = [c for c in candidates if c[0] <= cutoff_iso]
        if not valid:
            # Fallback: if none before cutoff, return earliest available or None
            return None
        return max(valid, key=lambda x: x[0])

    def _align_hourly(
        self,
        actuals: List[Dict[str, Any]],
        cutoff_h: int,
        cutoff_m: int
    ) -> List[Dict[str, Any]]:
        """
        Aggregates half-hourly actuals into hourly average, aligns with hourly forecast.
        """
        # Group actuals by (settlementDate, hour)
        grouped_actuals: Dict[str, List[float]] = {}
        for a in actuals:
            st = a["startTime"] # e.g. "2026-01-01T00:30:00Z"
            dt = datetime.fromisoformat(st.replace("Z", "+00:00"))
            hour_key = dt.strftime("%Y-%m-%dT%H:00:00Z")
            if hour_key not in grouped_actuals:
                grouped_actuals[hour_key] = []
            grouped_actuals[hour_key].append(float(a.get("generation", 0)))

        aligned = []
        for hour_st, gens in sorted(grouped_actuals.items()):
            actual_gen = sum(gens) / len(gens) if gens else 0.0
            dt = datetime.fromisoformat(hour_st.replace("Z", "+00:00"))
            target_date = dt.date()
            decision_date = target_date - timedelta(days=1)
            cutoff_dt = datetime(
                decision_date.year, decision_date.month, decision_date.day,
                cutoff_h, cutoff_m, 0, tzinfo=dt.tzinfo
            )
            cutoff_iso = cutoff_dt.isoformat().replace("+00:00", "Z")

            latest_fc = self._get_latest_forecast(hour_st, cutoff_iso)
            if latest_fc:
                pt, fc_gen = latest_fc
                error = fc_gen - actual_gen
                abs_error = abs(error)
                pct_error = (abs_error / max(actual_gen, 50.0)) * 100.0

                aligned.append({
                    "timestamp": hour_st,
                    "targetDate": target_date.isoformat(),
                    "hour": dt.hour,
                    "actual": round(actual_gen, 1),
                    "forecast": round(fc_gen, 1),
                    "error": round(error, 1),
                    "absError": round(abs_error, 1),
                    "pctError": round(pct_error, 2),
                    "publishTime": pt,
                    "cutoffTime": cutoff_iso,
                    "leadHours": round((dt - datetime.fromisoformat(pt.replace("Z", "+00:00"))).total_seconds() / 3600, 1),
                    "overForecast": error > 0
                })
        return aligned

    def _align_half_hourly(
        self,
        actuals: List[Dict[str, Any]],
        cutoff_h: int,
        cutoff_m: int
    ) -> List[Dict[str, Any]]:
        """
        Keeps half-hourly resolution. Maps the hourly forecast to each corresponding half-hour.
        """
        aligned = []
        for a in sorted(actuals, key=lambda x: x["startTime"]):
            st = a["startTime"]
            dt = datetime.fromisoformat(st.replace("Z", "+00:00"))
            target_date = dt.date()
            decision_date = target_date - timedelta(days=1)
            cutoff_dt = datetime(
                decision_date.year, decision_date.month, decision_date.day,
                cutoff_h, cutoff_m, 0, tzinfo=dt.tzinfo
            )
            cutoff_iso = cutoff_dt.isoformat().replace("+00:00", "Z")

            # Look up hourly forecast for top-of-hour
            top_of_hour = dt.strftime("%Y-%m-%dT%H:00:00Z")
            latest_fc = self._get_latest_forecast(top_of_hour, cutoff_iso)

            if latest_fc:
                pt, fc_gen = latest_fc
                actual_gen = float(a.get("generation", 0))
                error = fc_gen - actual_gen
                abs_error = abs(error)
                pct_error = (abs_error / max(actual_gen, 50.0)) * 100.0

                aligned.append({
                    "timestamp": st,
                    "targetDate": target_date.isoformat(),
                    "settlementPeriod": a.get("settlementPeriod"),
                    "hour": dt.hour,
                    "minute": dt.minute,
                    "actual": round(actual_gen, 1),
                    "forecast": round(fc_gen, 1),
                    "error": round(error, 1),
                    "absError": round(abs_error, 1),
                    "pctError": round(pct_error, 2),
                    "publishTime": pt,
                    "cutoffTime": cutoff_iso,
                    "leadHours": round((dt - datetime.fromisoformat(pt.replace("Z", "+00:00"))).total_seconds() / 3600, 1),
                    "overForecast": error > 0
                })
        return aligned
