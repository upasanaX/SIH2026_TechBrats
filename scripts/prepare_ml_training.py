import pandas as pd
from pathlib import Path

RESIDUAL_FILE = Path(
    "data/processed/temperature_residual_training.csv"
)

FEATURE_FILE = Path(
    "data/processed/training_weather.csv"
)

OUTPUT = Path(
    "data/processed/ml_temperature_training.csv"
)

# --------------------------------------------------
# Load datasets
# --------------------------------------------------

residual = pd.read_csv(RESIDUAL_FILE)
features = pd.read_csv(FEATURE_FILE)

residual["time"] = pd.to_datetime(residual["time"])
features["time"] = pd.to_datetime(features["time"])

# --------------------------------------------------
# Select ML features from training_weather.csv
# --------------------------------------------------

feature_columns = [
    "time",
    "lgd_code",
    "panchayat_name",
    "latitude",
    "longitude",
    "elevation_m",

    # Atmospheric variables
    "relative_humidity_2m",
    "pressure_msl",
    "wind_speed_10m",
    "wind_direction_10m",
    "cloud_cover",

    # Precipitation
    "precipitation",

    # Time features
    "hour",
    "day_of_year",
    "month",
    "hour_sin",
    "hour_cos",
    "day_sin",
    "day_cos",

    # Temperature history
    "temperature_lag_1h",
    "temperature_lag_3h",
    "temperature_lag_6h",
    "temperature_lag_24h",

    # Other history
    "humidity_lag_1h",
    "pressure_lag_1h",

    # Rolling features
    "temperature_rolling_3h",
    "temperature_rolling_6h",
    "temperature_rolling_24h",
    "rain_rolling_6h",
    "rain_rolling_24h",
]

features = features[feature_columns]

# --------------------------------------------------
# Select target + previous-run forecast
# --------------------------------------------------

target_data = residual[
    [
        "time",
        "lgd_code",
        "temperature_2m_previous_day1",
        "temperature_residual",
    ]
]

# --------------------------------------------------
# Merge
# --------------------------------------------------

ml = target_data.merge(
    features,
    on=["time", "lgd_code"],
    how="inner",
)

# --------------------------------------------------
# Remove duplicate Panchayat column if created
# --------------------------------------------------

if "panchayat_name_x" in ml.columns:
    ml["panchayat_name"] = ml["panchayat_name_x"]

    ml = ml.drop(
        columns=[
            "panchayat_name_x",
            "panchayat_name_y",
        ],
        errors="ignore",
    )

# --------------------------------------------------
# Remove missing values
# --------------------------------------------------

ml = ml.dropna().copy()

# --------------------------------------------------
# Sort chronologically
# --------------------------------------------------

ml = ml.sort_values(
    ["lgd_code", "time"]
).reset_index(drop=True)

# --------------------------------------------------
# Save
# --------------------------------------------------

OUTPUT.parent.mkdir(
    parents=True,
    exist_ok=True,
)

ml.to_csv(
    OUTPUT,
    index=False,
)

# --------------------------------------------------
# Validation output
# --------------------------------------------------

print("Saved:", OUTPUT)
print("Shape:", ml.shape)

print()
print("Missing values:")
print(ml.isna().sum())

print()
print("Rows per Panchayat:")
print(
    ml.groupby("panchayat_name").size()
)

print()
print("Columns:")
print(list(ml.columns))