from __future__ import annotations

from datetime import date, datetime, timedelta
from pathlib import Path
from threading import Lock
from typing import Any
from zoneinfo import ZoneInfo

import numpy as np
import pandas as pd
import requests
from xgboost import XGBRegressor


BASE_DIR = Path(__file__).resolve().parents[1]
OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"
TIMEZONE = ZoneInfo("Asia/Kolkata")
SUPPORTED_LGDS = {260972, 108220, 108917, 109013, 107777}
MODEL_FEATURES = [
    "temperature_2m_previous_day1",
    "relative_humidity_2m_previous_day1",
    "pressure_msl_previous_day1",
    "wind_speed_10m_previous_day1",
    "wind_direction_10m_previous_day1",
    "cloud_cover_previous_day1",
    "precipitation_previous_day1",
    "hour",
    "day_of_year",
    "month",
    "hour_sin",
    "hour_cos",
    "day_sin",
    "day_cos",
    "latitude",
    "longitude",
    "elevation_m",
]
WEATHER_VARIABLES = [
    "temperature_2m",
    "relative_humidity_2m",
    "precipitation",
    "pressure_msl",
    "wind_speed_10m",
    "wind_direction_10m",
    "cloud_cover",
]
DAILY_VARIABLES = [
    "temperature_2m_max",
    "temperature_2m_min",
    "precipitation_sum",
    "precipitation_probability_max",
]


class WeatherServiceError(Exception):
    pass


class WeatherService:
    def __init__(self) -> None:
        self._cache: dict[int, tuple[datetime, dict[str, Any]]] = {}
        self._cache_lock = Lock()
        self.panchayats = self._load_panchayats()
        self.model: XGBRegressor | None = None
        self.model_error: str | None = None
        self._load_model()

    def _load_panchayats(self) -> dict[int, dict[str, Any]]:
        path = BASE_DIR / "data" / "processed" / "panchayat_elevation.csv"
        if not path.exists():
            raise WeatherServiceError(f"Panchayat elevation file not found: {path}")

        frame = pd.read_csv(path)
        required = {"lgd_code", "panchayat_name", "latitude", "longitude", "elevation_m"}
        missing = required.difference(frame.columns)
        if missing:
            raise WeatherServiceError(f"Panchayat elevation file is missing columns: {sorted(missing)}")

        frame["lgd_code"] = pd.to_numeric(frame["lgd_code"], errors="raise").astype(int)
        frame["elevation_m"] = pd.to_numeric(frame["elevation_m"], errors="raise")
        frame["latitude"] = pd.to_numeric(frame["latitude"], errors="raise")
        frame["longitude"] = pd.to_numeric(frame["longitude"], errors="raise")
        frame = frame[frame["lgd_code"].isin(SUPPORTED_LGDS)].copy()

        if set(frame["lgd_code"]) != SUPPORTED_LGDS or len(frame) != len(SUPPORTED_LGDS):
            raise WeatherServiceError("Panchayat data must contain exactly the five supported LGD codes")
        if frame[["latitude", "longitude", "elevation_m"]].isna().any().any():
            raise WeatherServiceError("All supported panchayats must have coordinates and elevation")

        return {
            int(row.lgd_code): {
                "lgd_code": int(row.lgd_code),
                "name": str(row.panchayat_name),
                "latitude": float(row.latitude),
                "longitude": float(row.longitude),
                "elevation_m": float(row.elevation_m),
            }
            for row in frame.itertuples(index=False)
        }

    def _load_model(self) -> None:
        path = BASE_DIR / "data" / "models" / "temperature_spatial_xgb.json"
        try:
            model = XGBRegressor()
            model.load_model(str(path))
            actual_features = model.get_booster().feature_names
            if actual_features != MODEL_FEATURES:
                raise WeatherServiceError(
                    "Saved model feature order does not match the existing live inference contract"
                )
            self.model = model
        except Exception as exc:
            self.model_error = str(exc)

    def model_status(self) -> dict[str, Any]:
        return {
            "loaded": self.model is not None,
            "model": "XGBoost temperature residual model",
            "variable": "temperature",
            "panchayats_supported": len(self.panchayats),
            **({"error": self.model_error} if self.model_error else {}),
        }

    def _get_panchayat(self, lgd_code: int) -> dict[str, Any]:
        try:
            return self.panchayats[int(lgd_code)]
        except (KeyError, TypeError, ValueError) as exc:
            raise WeatherServiceError(f"Unsupported LGD code: {lgd_code}") from exc

    def _fetch_forecast(self, panchayat: dict[str, Any]) -> pd.DataFrame:
        response = requests.get(
            OPEN_METEO_URL,
            params={
                "latitude": panchayat["latitude"],
                "longitude": panchayat["longitude"],
                "hourly": ",".join(WEATHER_VARIABLES),
                "daily": ",".join(DAILY_VARIABLES),
                "forecast_days": 7,
                "timezone": "Asia/Kolkata",
            },
            timeout=30,
        )
        response.raise_for_status()
        payload = response.json()
        hourly = payload.get("hourly")
        if not isinstance(hourly, dict) or not hourly.get("time"):
            raise WeatherServiceError("Open-Meteo returned no hourly weather data")
        daily = payload.get("daily")
        if not isinstance(daily, dict) or not daily.get("time"):
            raise WeatherServiceError("Open-Meteo returned no daily weather data")

        frame = pd.DataFrame(hourly)
        missing = [name for name in WEATHER_VARIABLES if name not in frame]
        if missing:
            raise WeatherServiceError(f"Open-Meteo response is missing variables: {missing}")
        daily_frame = pd.DataFrame(daily)
        missing_daily = [name for name in DAILY_VARIABLES if name not in daily_frame]
        if missing_daily:
            raise WeatherServiceError(f"Open-Meteo response is missing daily variables: {missing_daily}")
        frame["time"] = pd.to_datetime(frame["time"])
        daily_frame["time"] = pd.to_datetime(daily_frame["time"])
        frame["lgd_code"] = panchayat["lgd_code"]
        frame["latitude"] = panchayat["latitude"]
        frame["longitude"] = panchayat["longitude"]
        frame["elevation_m"] = panchayat["elevation_m"]
        frame.attrs["daily"] = daily_frame
        return frame

    @staticmethod
    def _prepare_features(frame: pd.DataFrame) -> pd.DataFrame:
        features = frame.rename(
            columns={
                "temperature_2m": "temperature_2m_previous_day1",
                "relative_humidity_2m": "relative_humidity_2m_previous_day1",
                "pressure_msl": "pressure_msl_previous_day1",
                "wind_speed_10m": "wind_speed_10m_previous_day1",
                "wind_direction_10m": "wind_direction_10m_previous_day1",
                "cloud_cover": "cloud_cover_previous_day1",
                "precipitation": "precipitation_previous_day1",
            }
        ).copy()
        features["hour"] = features["time"].dt.hour
        features["day_of_year"] = features["time"].dt.dayofyear
        features["month"] = features["time"].dt.month
        features["hour_sin"] = np.sin(2 * np.pi * features["hour"] / 24)
        features["hour_cos"] = np.cos(2 * np.pi * features["hour"] / 24)
        features["day_sin"] = np.sin(2 * np.pi * features["day_of_year"] / 365)
        features["day_cos"] = np.cos(2 * np.pi * features["day_of_year"] / 365)
        missing = [name for name in MODEL_FEATURES if name not in features]
        if missing:
            raise WeatherServiceError(f"Model feature preparation is missing: {missing}")
        model_features = features[MODEL_FEATURES]
        if model_features.isna().any().any():
            raise WeatherServiceError("Open-Meteo returned missing values required by the model")
        return model_features

    def _build_result(self, panchayat: dict[str, Any], frame: pd.DataFrame, apply_model: bool) -> dict[str, Any]:
        target_date = (datetime.now(TIMEZONE) + timedelta(days=1)).date()
        selected = frame[frame["time"].dt.date == target_date].copy()
        if selected.empty:
            raise WeatherServiceError("Open-Meteo returned no forecast rows for tomorrow")

        selected = selected.iloc[:24].copy()
        selected["raw_temperature"] = selected["temperature_2m"]
        selected["predicted_residual"] = 0.0
        if apply_model:
            if self.model is None:
                raise WeatherServiceError(self.model_error or "Temperature model is not loaded")
            selected["predicted_residual"] = self.model.predict(self._prepare_features(selected))
        selected["downscaled_temperature"] = selected["raw_temperature"] + selected["predicted_residual"]

        first = selected.iloc[0]
        hourly = [
            {
                "timestamp": row.time.isoformat(),
                "raw_temperature_c": float(row.raw_temperature),
                "downscaled_temperature_c": float(row.downscaled_temperature),
                "ml_correction_c": float(row.predicted_residual),
                "precipitation_mm": float(row.precipitation),
                "humidity_percent": float(row.relative_humidity_2m),
                "pressure_hpa": float(row.pressure_msl),
                "wind_speed_kmh": float(row.wind_speed_10m),
                "wind_direction_deg": float(row.wind_direction_10m),
                "cloud_cover_percent": float(row.cloud_cover),
            }
            for row in selected.itertuples(index=False)
        ]
        daily_frame: pd.DataFrame = frame.attrs["daily"]
        daily = [
            {
                "date": row.time.date().isoformat(),
                "raw_max_temperature_c": float(row.temperature_2m_max),
                "raw_min_temperature_c": float(row.temperature_2m_min),
                "precipitation_sum_mm": float(row.precipitation_sum),
                "precipitation_probability_percent": float(row.precipitation_probability_max),
            }
            for row in daily_frame.itertuples(index=False)
        ]
        return {
            "panchayat": panchayat,
            "timestamp": first.time.isoformat(),
            "temperature": {
                "raw_c": float(first.raw_temperature),
                "ml_correction_c": float(first.predicted_residual),
                "downscaled_c": float(first.downscaled_temperature),
                "method": "XGBoost local correction" if apply_model else "Open-Meteo live forecast",
            },
            "rainfall": {"precipitation_mm": float(first.precipitation)},
            "humidity_percent": float(first.relative_humidity_2m),
            "pressure_hpa": float(first.pressure_msl),
            "wind": {
                "speed_kmh": float(first.wind_speed_10m),
                "direction_deg": float(first.wind_direction_10m),
            },
            "cloud_cover_percent": float(first.cloud_cover),
            "hourly": hourly,
            "daily": daily,
            "sources": {
                "weather": "Open-Meteo",
                "temperature_model": "XGBoost" if apply_model else "Not applied",
                "elevation": "data/processed/panchayat_elevation.csv",
                "benchmark_note": "Benchmark against Open-Meteo-derived reference data; not station-ground-truth accuracy.",
            },
        }

    def get_weather(self, lgd_code: int, apply_model: bool) -> dict[str, Any]:
        panchayat = self._get_panchayat(lgd_code)
        cache_key = int(lgd_code) * 10 + int(apply_model)
        now = datetime.now(TIMEZONE)
        with self._cache_lock:
            cached = self._cache.get(cache_key)
            if cached and now - cached[0] < timedelta(minutes=10):
                return cached[1]
        result = self._build_result(panchayat, self._fetch_forecast(panchayat), apply_model)
        with self._cache_lock:
            self._cache[cache_key] = (now, result)
        return result

    def metrics(self) -> dict[str, Any]:
        path = BASE_DIR / "data" / "reports" / "temperature_model_comparison.csv"
        if not path.exists():
            return {"available": False, "benchmark": True, "rows": []}
        return {
            "available": True,
            "benchmark": True,
            "note": "Benchmark against Open-Meteo-derived reference data; not station-ground-truth accuracy.",
            "rows": pd.read_csv(path).replace({np.nan: None}).to_dict(orient="records"),
        }