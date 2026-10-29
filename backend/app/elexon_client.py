import os
import json
import logging
from datetime import datetime
from typing import List, Dict, Any, Optional
import urllib.request
import urllib.error

logger = logging.getLogger("elexon_client")
logging.basicConfig(level=logging.INFO)

CACHE_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
FUELHH_CACHE_FILE = os.path.join(CACHE_DIR, "fuelhh_jan2026.json")
WINDFOR_CACHE_FILE = os.path.join(CACHE_DIR, "windfor_jan2026.json")

BMRS_BASE_URL = "https://data.elexon.co.uk/bmrs/api/v1"

class ElexonClient:
    """
    Client for interacting with Elexon BMRS API endpoints:
    - FUELHH/stream: Half-hourly actual generation by fuel type (WIND)
    - WINDFOR/stream: Generation forecasts for wind power
    Includes local file caching for instant response times and offline resilience.
    """

    def __init__(self, cache_dir: str = CACHE_DIR):
        self.cache_dir = cache_dir
        os.makedirs(self.cache_dir, exist_ok=True)

    def _fetch_url(self, url: str, timeout: int = 40) -> bytes:
        logger.info(f"Fetching from Elexon API: {url}")
        req = urllib.request.Request(
            url,
            headers={
                "User-Agent": "UK-Energy-Trader-App/1.0",
                "Accept": "application/json"
            }
        )
        try:
            with urllib.request.urlopen(req, timeout=timeout) as response:
                return response.read()
        except urllib.error.URLError as e:
            logger.error(f"Error fetching URL {url}: {e}")
            raise

    def get_actual_generation(
        self,
        date_from: str = "2026-01-01",
        date_to: str = "2026-01-31",
        force_refresh: bool = False
    ) -> List[Dict[str, Any]]:
        """
        Retrieves actual wind generation (FUELHH stream, fuelType=WIND).
        """
        cache_path = os.path.join(self.cache_dir, f"fuelhh_{date_from}_{date_to}.json")
        if not force_refresh and os.path.exists(cache_path):
            logger.info(f"Loading FUELHH actuals from cache: {cache_path}")
            with open(cache_path, "r", encoding="utf-8") as f:
                return json.load(f)

        url = f"{BMRS_BASE_URL}/datasets/FUELHH/stream?settlementDateFrom={date_from}&settlementDateTo={date_to}&fuelType=WIND"
        try:
            raw_data = self._fetch_url(url)
            records = json.loads(raw_data.decode("utf-8"))
            logger.info(f"Fetched {len(records)} actual WIND records from BMRS")
            with open(cache_path, "w", encoding="utf-8") as f:
                json.dump(records, f)
            return records
        except Exception as e:
            if os.path.exists(cache_path):
                logger.warning(f"Fetch failed ({e}), falling back to cached file {cache_path}")
                with open(cache_path, "r", encoding="utf-8") as f:
                    return json.load(f)
            raise

    def get_wind_forecasts(
        self,
        publish_from: str = "2025-12-30T00:00:00Z",
        publish_to: str = "2026-02-01T23:59:59Z",
        force_refresh: bool = False
    ) -> List[Dict[str, Any]]:
        """
        Retrieves wind forecasts (WINDFOR stream).
        Fetches starting from 2025-12-30 so that Day-Ahead decisions made on Dec 31
        for Jan 1 delivery are fully covered.
        """
        safe_key = f"{publish_from[:10]}_{publish_to[:10]}"
        cache_path = os.path.join(self.cache_dir, f"windfor_{safe_key}.json")
        if not force_refresh and os.path.exists(cache_path):
            logger.info(f"Loading WINDFOR forecasts from cache: {cache_path}")
            with open(cache_path, "r", encoding="utf-8") as f:
                return json.load(f)

        url = f"{BMRS_BASE_URL}/datasets/WINDFOR/stream?publishDateTimeFrom={publish_from}&publishDateTimeTo={publish_to}"
        try:
            raw_data = self._fetch_url(url)
            records = json.loads(raw_data.decode("utf-8"))
            logger.info(f"Fetched {len(records)} WINDFOR forecast records from BMRS")
            with open(cache_path, "w", encoding="utf-8") as f:
                json.dump(records, f)
            return records
        except Exception as e:
            if os.path.exists(cache_path):
                logger.warning(f"Fetch failed ({e}), falling back to cached file {cache_path}")
                with open(cache_path, "r", encoding="utf-8") as f:
                    return json.load(f)
            raise
