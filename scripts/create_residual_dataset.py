import pandas as pd
from pathlib import Path

REFERENCE = Path(
    "data/raw/open_meteo/historical_weather_2024_2025.csv"
)

PREVIOUS_RUN = Path(
    "data/raw/previous_runs/previous_day1_temperature_2024_2025.csv"
)

OUTPUT = Path(
    "data/processed/temperature_residual_training.csv"
)

# Load datasets
reference = pd.read_csv(REFERENCE)
previous = pd.read_csv(PREVIOUS_RUN)

reference["time"] = pd.to_datetime(reference["time"])
previous["time"] = pd.to_datetime(previous["time"])

# Keep only the columns we need from the previous-run dataset
previous = previous[
    [
        "time",
        "lgd_code",
        "temperature_2m_previous_day1",
    ]
]

# Merge using Panchayat + timestamp
merged = reference.merge(
    previous,
    on=["time", "lgd_code"],
    how="inner",
)

# Remove rows where the previous-run forecast is unavailable
merged = merged.dropna(
    subset=["temperature_2m_previous_day1"]
).copy()

# Calculate forecast residual
merged["temperature_residual"] = (
    merged["temperature_2m"]
    - merged["temperature_2m_previous_day1"]
)

# Sort
merged = merged.sort_values(
    ["lgd_code", "time"]
).reset_index(drop=True)

# Save
OUTPUT.parent.mkdir(parents=True, exist_ok=True)
merged.to_csv(OUTPUT, index=False)

print("Saved:", OUTPUT)
print("Shape:", merged.shape)
print()
print("Missing values:")
print(merged.isna().sum())
print()
print("Rows per Panchayat:")
print(merged.groupby("panchayat_name").size())
print()
print("Residual statistics:")
print(
    merged["temperature_residual"].describe()
)