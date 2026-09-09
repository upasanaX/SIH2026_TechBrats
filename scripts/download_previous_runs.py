import requests
import pandas as pd
from pathlib import Path

COORDS = [
    ("Aahaley", 260972, 26.968183, 88.700822),
    ("Abad Bhagawanpur", 108220, 22.034705, 88.337723),
    ("Abinashpur", 108917, 23.817222, 87.574944),
    ("Adabari", 109013, 26.123361, 89.309876),
    ("Adhata", 107777, 22.866320, 88.525101),
]

START_DATE = "2024-01-01"
END_DATE = "2025-12-31"

OUTPUT = Path("data/raw/previous_runs/previous_day1_temperature_2024_2025.csv")

URL = "https://previous-runs-api.open-meteo.com/v1/forecast"

all_rows = []

for name, lgd, lat, lon in COORDS:
    print(f"Downloading {name}...")

    params = {
        "latitude": lat,
        "longitude": lon,
        "start_date": START_DATE,
        "end_date": END_DATE,
        "hourly": "temperature_2m_previous_day1",
        "timezone": "UTC",
    }

    response = requests.get(URL, params=params, timeout=60)
    response.raise_for_status()

    data = response.json()

    hourly = data["hourly"]

    df = pd.DataFrame({
        "time": pd.to_datetime(hourly["time"]),
        "temperature_2m_previous_day1": hourly[
            "temperature_2m_previous_day1"
        ],
    })

    df["lgd_code"] = lgd
    df["panchayat_name"] = name
    df["latitude"] = lat
    df["longitude"] = lon

    all_rows.append(df)

result = pd.concat(all_rows, ignore_index=True)

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
result.to_csv(OUTPUT, index=False)

print()
print("Saved:", OUTPUT)
print("Shape:", result.shape)
print("Missing values:")
print(result.isna().sum())
print()
print(result.groupby("panchayat_name").size())