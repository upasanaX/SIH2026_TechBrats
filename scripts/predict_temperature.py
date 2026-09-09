from pathlib import Path

import numpy as np
import pandas as pd
from xgboost import XGBRegressor


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parents[1]

MODEL_PATH = (
    BASE_DIR
    / "data"
    / "models"
    / "temperature_spatial_xgb.json"
)

COORDINATES_PATH = (
    BASE_DIR
    / "data"
    / "processed"
    / "panchayat_coordinates.csv"
)

ELEVATION_PATH = (
    BASE_DIR
    / "data"
    / "processed"
    / "panchayat_elevation.csv"
)

OUTPUT_PATH = (
    BASE_DIR
    / "data"
    / "processed"
    / "temperature_prediction_test.csv"
)


# ============================================================
# MODEL FEATURES
# ============================================================

FEATURES = [
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
# HELPER
# ============================================================

def print_section(title):
    print()
    print("=" * 60)
    print(title)
    print("=" * 60)


# ============================================================
# TIME FEATURES
# ============================================================

def create_time_features(df):
    df = df.copy()

    df["time"] = pd.to_datetime(df["time"])

    df["hour"] = df["time"].dt.hour

    df["day_of_year"] = df["time"].dt.dayofyear

    df["month"] = df["time"].dt.month

    df["hour_sin"] = np.sin(
        2 * np.pi * df["hour"] / 24
    )

    df["hour_cos"] = np.cos(
        2 * np.pi * df["hour"] / 24
    )

    df["day_sin"] = np.sin(
        2 * np.pi * df["day_of_year"] / 365.25
    )

    df["day_cos"] = np.cos(
        2 * np.pi * df["day_of_year"] / 365.25
    )

    return df


# ============================================================
# 1. LOAD MODEL
# ============================================================

print_section("LOADING TRAINED MODEL")

if not MODEL_PATH.exists():
    raise FileNotFoundError(
        f"Model not found:\n{MODEL_PATH}"
    )

model = XGBRegressor()

model.load_model(MODEL_PATH)

print("Model loaded successfully.")
print(f"Model: {MODEL_PATH}")


# ============================================================
# 2. LOAD PANCHAYAT COORDINATES
# ============================================================

print_section("LOADING PANCHAYAT COORDINATES")

if not COORDINATES_PATH.exists():
    raise FileNotFoundError(
        f"Coordinates file not found:\n{COORDINATES_PATH}"
    )

coordinates = pd.read_csv(
    COORDINATES_PATH
)

print("Coordinate columns:")
print(list(coordinates.columns))

required_coordinate_columns = [
    "lgd_code",
    "panchayat_name",
    "latitude",
    "longitude",
]

missing_columns = [
    column
    for column in required_coordinate_columns
    if column not in coordinates.columns
]

if missing_columns:
    raise ValueError(
        f"Missing coordinate columns: {missing_columns}"
    )

print(
    f"Panchayats loaded: {len(coordinates)}"
)


# ============================================================
# 3. LOAD ELEVATION
# ============================================================

print_section("LOADING ELEVATION")

if not ELEVATION_PATH.exists():
    raise FileNotFoundError(
        f"Elevation file not found:\n{ELEVATION_PATH}"
    )

elevation = pd.read_csv(
    ELEVATION_PATH
)

print("Elevation columns:")
print(list(elevation.columns))

required_elevation_columns = [
    "lgd_code",
    "elevation_m",
]

missing_columns = [
    column
    for column in required_elevation_columns
    if column not in elevation.columns
]

if missing_columns:
    raise ValueError(
        f"Missing elevation columns: {missing_columns}"
    )

print(
    f"Elevation records loaded: {len(elevation)}"
)


# ============================================================
# 4. CLEAN COLUMN NAMES
# ============================================================

print_section("CLEANING INPUT DATA")

coordinates.columns = (
    coordinates.columns
    .str.strip()
)

elevation.columns = (
    elevation.columns
    .str.strip()
)

# Make sure LGD codes have the same type
coordinates["lgd_code"] = (
    pd.to_numeric(
        coordinates["lgd_code"],
        errors="raise"
    ).astype(int)
)

elevation["lgd_code"] = (
    pd.to_numeric(
        elevation["lgd_code"],
        errors="raise"
    ).astype(int)
)

# Make sure elevation is numeric
elevation["elevation_m"] = pd.to_numeric(
    elevation["elevation_m"],
    errors="coerce"
)


# ============================================================
# 5. CHECK DUPLICATES
# ============================================================

if coordinates["lgd_code"].duplicated().any():
    raise ValueError(
        "Duplicate LGD codes found in coordinates file."
    )

if elevation["lgd_code"].duplicated().any():
    raise ValueError(
        "Duplicate LGD codes found in elevation file."
    )


# ============================================================
# 6. MERGE COORDINATES + ELEVATION
# ============================================================

print_section("PREPARING SPATIAL FEATURES")

panchayats = coordinates.merge(
    elevation[
        [
            "lgd_code",
            "elevation_m",
        ]
    ],
    on="lgd_code",
    how="left",
    validate="one_to_one",
)

print("Merged columns:")
print(list(panchayats.columns))


# ============================================================
# 7. VALIDATE SPATIAL DATA
# ============================================================

required_spatial_columns = [
    "lgd_code",
    "panchayat_name",
    "latitude",
    "longitude",
    "elevation_m",
]

missing_columns = [
    column
    for column in required_spatial_columns
    if column not in panchayats.columns
]

if missing_columns:
    raise ValueError(
        f"Missing spatial columns after merge: "
        f"{missing_columns}"
    )

if panchayats["elevation_m"].isna().any():
    missing_count = int(
        panchayats["elevation_m"].isna().sum()
    )

    raise ValueError(
        f"Missing elevation for "
        f"{missing_count} Panchayats."
    )

print(
    "Spatial feature validation: PASS"
)


# ============================================================
# 8. CREATE TEST FORECAST INPUT
# ============================================================

print_section("CREATING TEST FORECAST INPUT")

# For the first Part L test, use the first Panchayat.
panchayat = panchayats.iloc[0]

prediction_time = pd.Timestamp(
    "2025-12-15 12:00:00"
)

# IMPORTANT:
#
# These values are TEST INPUTS ONLY.
#
# Later, we will replace these with real
# Open-Meteo forecast values.

input_row = {
    "time": prediction_time,

    "lgd_code": int(
        panchayat["lgd_code"]
    ),

    "panchayat_name": str(
        panchayat["panchayat_name"]
    ),

    "latitude": float(
        panchayat["latitude"]
    ),

    "longitude": float(
        panchayat["longitude"]
    ),

    "elevation_m": float(
        panchayat["elevation_m"]
    ),

    "temperature_2m_previous_day1": 25.0,

    "relative_humidity_2m_previous_day1": 70.0,

    "pressure_msl_previous_day1": 1012.0,

    "wind_speed_10m_previous_day1": 8.0,

    "wind_direction_10m_previous_day1": 180.0,

    "cloud_cover_previous_day1": 40.0,

    "precipitation_previous_day1": 0.0,
}

df = pd.DataFrame(
    [input_row]
)

print("Test input created successfully.")

print()
print(
    df[
        [
            "lgd_code",
            "panchayat_name",
            "latitude",
            "longitude",
            "elevation_m",
        ]
    ].to_string(index=False)
)


# ============================================================
# 9. CREATE TIME FEATURES
# ============================================================

print_section("CREATING TIME FEATURES")

df = create_time_features(
    df
)

print("Time features created successfully.")


# ============================================================
# 10. VALIDATE MODEL FEATURES
# ============================================================

print_section("VALIDATING MODEL INPUT")

missing_features = [
    feature
    for feature in FEATURES
    if feature not in df.columns
]

if missing_features:
    raise ValueError(
        f"Missing model features: "
        f"{missing_features}"
    )

if df[FEATURES].isna().any().any():

    missing_values = int(
        df[FEATURES]
        .isna()
        .sum()
        .sum()
    )

    raise ValueError(
        f"Model input contains "
        f"{missing_values} missing values."
    )

print(
    "Feature validation: PASS"
)

print()
print("Features being sent to model:")

for feature in FEATURES:
    print(
        f"  {feature}: "
        f"{df.loc[0, feature]}"
    )


# ============================================================
# 11. RUN XGBOOST MODEL
# ============================================================

print_section("RUNNING TEMPERATURE PREDICTION")

X = df[
    FEATURES
]

predicted_residual = model.predict(
    X
)

df["predicted_residual"] = (
    predicted_residual
)

print(
    "Residual prediction completed."
)


# ============================================================
# 12. CALCULATE DOWNSCALED TEMPERATURE
# ============================================================

print_section(
    "CALCULATING DOWNSCALED TEMPERATURE"
)

df["raw_temperature"] = df[
    "temperature_2m_previous_day1"
]

df["downscaled_temperature"] = (
    df["raw_temperature"]
    + df["predicted_residual"]
)


# ============================================================
# 13. DISPLAY RESULT
# ============================================================

print()
print("=" * 60)
print("PREDICTION RESULT")
print("=" * 60)

print(
    f"Panchayat         : "
    f"{df.loc[0, 'panchayat_name']}"
)

print(
    f"LGD Code          : "
    f"{int(df.loc[0, 'lgd_code'])}"
)

print(
    f"Time              : "
    f"{df.loc[0, 'time']}"
)

print(
    f"Raw Temperature   : "
    f"{df.loc[0, 'raw_temperature']:.2f} °C"
)

print(
    f"Predicted Residual: "
    f"{df.loc[0, 'predicted_residual']:.2f} °C"
)

print(
    f"Downscaled Temp   : "
    f"{df.loc[0, 'downscaled_temperature']:.2f} °C"
)


# ============================================================
# 14. SAVE RESULT
# ============================================================

print_section("SAVING PREDICTION")

OUTPUT_PATH.parent.mkdir(
    parents=True,
    exist_ok=True
)

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

df[
    output_columns
].to_csv(
    OUTPUT_PATH,
    index=False
)

print(
    f"Prediction saved to:\n"
    f"{OUTPUT_PATH}"
)


# ============================================================
# DONE
# ============================================================

print()
print("=" * 60)
print("PART L TEST COMPLETED SUCCESSFULLY")
print("=" * 60)