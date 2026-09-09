from pathlib import Path
import pandas as pd


BASE_DIR = Path(__file__).resolve().parents[1]

FORECAST_FILE = (
    BASE_DIR
    / "data"
    / "raw"
    / "open_meteo_forecast"
    / "historical_forecast_2024_2025.csv"
)

REFERENCE_FILE = (
    BASE_DIR
    / "data"
    / "processed"
    / "training_weather.csv"
)

OUTPUT_DIR = (
    BASE_DIR
    / "data"
    / "processed"
)

OUTPUT_FILE = (
    OUTPUT_DIR
    / "live_forecast_residual_training.csv"
)


print("=" * 60)
print("LOADING HISTORICAL FORECAST")
print("=" * 60)

forecast = pd.read_csv(
    FORECAST_FILE
)

forecast.columns = forecast.columns.str.strip()

forecast["time"] = pd.to_datetime(
    forecast["time"]
)

forecast["lgd_code"] = (
    pd.to_numeric(
        forecast["lgd_code"],
        errors="raise"
    )
    .astype(int)
)

print(
    f"Forecast rows: {len(forecast)}"
)


print()
print("=" * 60)
print("LOADING REFERENCE DATA")
print("=" * 60)

reference = pd.read_csv(
    REFERENCE_FILE
)

reference.columns = reference.columns.str.strip()

reference["time"] = pd.to_datetime(
    reference["time"]
)

reference["lgd_code"] = (
    pd.to_numeric(
        reference["lgd_code"],
        errors="raise"
    )
    .astype(int)
)

print(
    f"Reference rows: {len(reference)}"
)


print()
print("=" * 60)
print("CHECKING KEYS")
print("=" * 60)

forecast_key = forecast[
    ["time", "lgd_code"]
]

reference_key = reference[
    ["time", "lgd_code"]
]

print(
    "Forecast duplicate keys:",
    forecast_key.duplicated().sum()
)

print(
    "Reference duplicate keys:",
    reference_key.duplicated().sum()
)


print()
print("=" * 60)
print("MERGING FORECAST WITH REFERENCE")
print("=" * 60)

merged = forecast.merge(
    reference[
        [
            "time",
            "lgd_code",
            "temperature_2m",
        ]
    ],
    on=[
        "time",
        "lgd_code",
    ],
    how="inner",
    suffixes=(
        "_forecast",
        "_reference",
    ),
    validate="one_to_one",
)

print(
    f"Merged rows: {len(merged)}"
)


if merged.empty:
    raise ValueError(
        "No matching forecast/reference records."
    )


print()
print("=" * 60)
print("CREATING RESIDUAL TARGET")
print("=" * 60)

merged[
    "temperature_residual"
] = (
    merged[
        "temperature_2m_reference"
    ]
    -
    merged[
        "temperature_2m_forecast"
    ]
)


print(
    "Residual statistics:"
)

print(
    merged[
        "temperature_residual"
    ].describe()
)


print()
print("=" * 60)
print("PREPARING TRAINING DATA")
print("=" * 60)

keep_columns = [
    "time",
    "lgd_code",
    "panchayat_name",
    "latitude",
    "longitude",
    "temperature_2m_forecast",
    "relative_humidity_2m",
    "pressure_msl",
    "wind_speed_10m",
    "wind_direction_10m",
    "cloud_cover",
    "precipitation",
    "temperature_residual",
]

missing = [
    column
    for column in keep_columns
    if column not in merged.columns
]

if missing:
    raise ValueError(
        f"Missing columns: {missing}"
    )


training = merged[
    keep_columns
].copy()


training = training.dropna(
    subset=[
        "temperature_2m_forecast",
        "temperature_residual",
    ]
)


print(
    f"Final rows: {len(training)}"
)

print(
    f"Panchayants: "
    f"{training['lgd_code'].nunique()}"
)


print()
print("=" * 60)
print("SAVING DATASET")
print("=" * 60)

OUTPUT_DIR.mkdir(
    parents=True,
    exist_ok=True
)

training.to_csv(
    OUTPUT_FILE,
    index=False
)

print(
    f"Saved to: {OUTPUT_FILE}"
)

print()
print(
    training.head().to_string(
        index=False
    )
)