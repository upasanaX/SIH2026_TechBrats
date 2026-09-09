from pathlib import Path
import numpy as np
import pandas as pd
from xgboost import XGBRegressor


# ============================================================
# CONFIGURATION
# ============================================================

BASE_DIR = Path(__file__).resolve().parents[1]

MODEL_FILE = (
    BASE_DIR
    / "data"
    / "models"
    / "temperature_spatial_xgb.json"
)

FORECAST_FILE = (
    BASE_DIR
    / "data"
    / "raw"
    / "open_meteo_forecast"
    / "live_forecast.csv"
)

ELEVATION_FILE = (
    BASE_DIR
    / "data"
    / "processed"
    / "panchayat_elevation.csv"
)

OUTPUT_DIR = (
    BASE_DIR
    / "data"
    / "processed"
)

OUTPUT_FILE = (
    OUTPUT_DIR
    / "live_downscaled_temperature.csv"
)


# ============================================================
# MODEL FEATURES
# ============================================================

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


# ============================================================
# LOAD MODEL
# ============================================================

print("=" * 60)
print("LOADING TRAINED MODEL")
print("=" * 60)

model = XGBRegressor()

model.load_model(str(MODEL_FILE))

print("Model loaded successfully.")
print(f"Model: {MODEL_FILE}")


# ============================================================
# LOAD LIVE FORECAST
# ============================================================

print()
print("=" * 60)
print("LOADING REAL OPEN-METEO FORECAST")
print("=" * 60)

forecast = pd.read_csv(
    FORECAST_FILE
)

forecast.columns = forecast.columns.str.strip()

forecast["time"] = pd.to_datetime(
    forecast["time"]
)

print(
    f"Forecast rows: {len(forecast)}"
)

print(
    f"Panchayants: "
    f"{forecast['lgd_code'].nunique()}"
)


# ============================================================
# LOAD ELEVATION
# ============================================================

print()
print("=" * 60)
print("LOADING ELEVATION")
print("=" * 60)

elevation = pd.read_csv(
    ELEVATION_FILE
)

elevation.columns = elevation.columns.str.strip()

elevation["lgd_code"] = (
    pd.to_numeric(
        elevation["lgd_code"],
        errors="raise"
    )
    .astype(int)
)

elevation = elevation[
    [
        "lgd_code",
        "elevation_m",
    ]
].drop_duplicates(
    subset=["lgd_code"]
)

print(
    f"Elevation records: {len(elevation)}"
)


# ============================================================
# MERGE ELEVATION
# ============================================================

print()
print("=" * 60)
print("MERGING SPATIAL FEATURES")
print("=" * 60)

forecast["lgd_code"] = (
    pd.to_numeric(
        forecast["lgd_code"],
        errors="raise"
    )
    .astype(int)
)

forecast = forecast.merge(
    elevation,
    on="lgd_code",
    how="left",
    validate="many_to_one",
)

if forecast["elevation_m"].isna().any():
    missing_lgd = (
        forecast.loc[
            forecast["elevation_m"].isna(),
            "lgd_code"
        ]
        .unique()
        .tolist()
    )

    raise ValueError(
        "Missing elevation for LGD codes: "
        f"{missing_lgd}"
    )

print("Spatial merge: PASS")


# ============================================================
# IMPORTANT NOTE
# ============================================================

print()
print("=" * 60)
print("PREPARING LIVE FORECAST FEATURES")
print("=" * 60)

print(
    "The trained model expects previous-day "
    "forecast variables."
)

print(
    "For this first live integration, "
    "tomorrow's Open-Meteo forecast is used "
    "as the closest operational approximation "
    "to the model's fixed ~24-hour lead."
)


# ============================================================
# SELECT TOMORROW'S FORECAST
# ============================================================

forecast_dates = forecast["time"].dt.date

today = pd.Timestamp.now(
    tz=None
).date()

tomorrow = (
    pd.Timestamp.today()
    + pd.Timedelta(days=1)
).date()

tomorrow_data = forecast[
    forecast["time"].dt.date == tomorrow
].copy()


if tomorrow_data.empty:
    raise ValueError(
        "No tomorrow forecast records found."
    )


print(
    f"Tomorrow forecast rows: "
    f"{len(tomorrow_data)}"
)


# ============================================================
# CREATE MODEL FEATURE NAMES
# ============================================================

rename_map = {
    "temperature_2m":
        "temperature_2m_previous_day1",

    "relative_humidity_2m":
        "relative_humidity_2m_previous_day1",

    "pressure_msl":
        "pressure_msl_previous_day1",

    "wind_speed_10m":
        "wind_speed_10m_previous_day1",

    "wind_direction_10m":
        "wind_direction_10m_previous_day1",

    "cloud_cover":
        "cloud_cover_previous_day1",

    "precipitation":
        "precipitation_previous_day1",
}

tomorrow_data = tomorrow_data.rename(
    columns=rename_map
)


# ============================================================
# TIME FEATURES
# ============================================================

print()
print("=" * 60)
print("CREATING TIME FEATURES")
print("=" * 60)

tomorrow_data["hour"] = (
    tomorrow_data["time"].dt.hour
)

tomorrow_data["day_of_year"] = (
    tomorrow_data["time"].dt.dayofyear
)

tomorrow_data["month"] = (
    tomorrow_data["time"].dt.month
)

tomorrow_data["hour_sin"] = np.sin(
    2 * np.pi *
    tomorrow_data["hour"] / 24
)

tomorrow_data["hour_cos"] = np.cos(
    2 * np.pi *
    tomorrow_data["hour"] / 24
)

tomorrow_data["day_sin"] = np.sin(
    2 * np.pi *
    tomorrow_data["day_of_year"] / 365
)

tomorrow_data["day_cos"] = np.cos(
    2 * np.pi *
    tomorrow_data["day_of_year"] / 365
)

print("Time features created successfully.")


# ============================================================
# VALIDATE MODEL FEATURES
# ============================================================

print()
print("=" * 60)
print("VALIDATING MODEL INPUT")
print("=" * 60)

missing_features = [
    feature
    for feature in MODEL_FEATURES
    if feature not in tomorrow_data.columns
]

if missing_features:

    raise ValueError(
        "Missing model features: "
        f"{missing_features}"
    )

print("Feature validation: PASS")


# ============================================================
# CHECK MISSING VALUES
# ============================================================

X = tomorrow_data[
    MODEL_FEATURES
].copy()

missing_counts = X.isna().sum()

if missing_counts.sum() > 0:

    print()
    print(
        "Missing model input values:"
    )

    print(
        missing_counts[
            missing_counts > 0
        ]
    )

    raise ValueError(
        "Cannot run model with missing "
        "feature values."
    )


# ============================================================
# RUN MODEL
# ============================================================

print()
print("=" * 60)
print("RUNNING XGBOOST")
print("=" * 60)

predicted_residual = model.predict(X)

tomorrow_data[
    "predicted_residual"
] = predicted_residual


# ============================================================
# CALCULATE DOWNSCALED TEMPERATURE
# ============================================================

print()
print("=" * 60)
print("CALCULATING DOWNSCALED TEMPERATURE")
print("=" * 60)

tomorrow_data[
    "downscaled_temperature"
] = (
    tomorrow_data[
        "temperature_2m_previous_day1"
    ]
    + tomorrow_data[
        "predicted_residual"
    ]
)


# ============================================================
# RENAME RAW TEMPERATURE
# ============================================================

tomorrow_data[
    "raw_temperature"
] = tomorrow_data[
    "temperature_2m_previous_day1"
]


# ============================================================
# SELECT OUTPUT COLUMNS
# ============================================================

output_columns = [
    "time",
    "lgd_code",
    "panchayat_name",
    "latitude",
    "longitude",
    "elevation_m",
    "raw_temperature",
    "predicted_residual",
    "downscaled_temperature",
]

result = tomorrow_data[
    output_columns
].copy()


# ============================================================
# SAVE
# ============================================================

OUTPUT_DIR.mkdir(
    parents=True,
    exist_ok=True
)

result.to_csv(
    OUTPUT_FILE,
    index=False
)


# ============================================================
# DISPLAY RESULTS
# ============================================================

print()
print("=" * 60)
print("LIVE DOWNSCALING COMPLETED")
print("=" * 60)

print()
print(
    f"Predictions: {len(result)}"
)

print(
    f"Panchayants: "
    f"{result['lgd_code'].nunique()}"
)

print()
print(
    result.head(20).to_string(
        index=False
    )
)

print()
print(
    f"Saved to: {OUTPUT_FILE}"
)