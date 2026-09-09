from pathlib import Path
import time

import pandas as pd
import requests


INPUT_FILE = Path("data/processed/panchayat_coordinates.csv")
OUTPUT_FILE = Path(
    "data/raw/previous_runs/previous_day1_weather_features_2024_2025.csv"
)

BASE_URL = "https://previous-runs-api.open-meteo.com/v1/forecast"

START_DATE = "2024-01-01"
END_DATE = "2025-12-31"

HOURLY_VARIABLES = ",".join(
    [
        "temperature_2m_previous_day1",
        "relative_humidity_2m_previous_day1",
        "pressure_msl_previous_day1",
        "wind_speed_10m_previous_day1",
        "wind_direction_10m_previous_day1",
        "cloud_cover_previous_day1",
        "precipitation_previous_day1",
    ]
)


def download_for_panchayat(row):
    params = {
        "latitude": row["latitude"],
        "longitude": row["longitude"],
        "hourly": HOURLY_VARIABLES,
        "start_date": START_DATE,
        "end_date": END_DATE,
        "timezone": "GMT",
    }

    print(
        f"Downloading {row['panchayat_name']} "
        f"({row['latitude']}, {row['longitude']})"
    )

    response = requests.get(
        BASE_URL,
        params=params,
        timeout=120,
    )

    response.raise_for_status()

    data = response.json()

    if "hourly" not in data:
        raise RuntimeError(
            f"No hourly data returned for {row['panchayat_name']}"
        )

    hourly = pd.DataFrame(data["hourly"])

    hourly["lgd_code"] = row["lgd_code"]
    hourly["panchayat_name"] = row["panchayat_name"]
    hourly["latitude"] = row["latitude"]
    hourly["longitude"] = row["longitude"]

    return hourly


def main():
    INPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

    locations = pd.read_csv(INPUT_FILE)

    required_columns = {
        "lgd_code",
        "panchayat_name",
        "latitude",
        "longitude",
    }

    missing = required_columns - set(locations.columns)

    if missing:
        raise ValueError(
            f"Missing columns in {INPUT_FILE}: {sorted(missing)}"
        )

    all_data = []

    for _, row in locations.iterrows():
        try:
            data = download_for_panchayat(row)
            all_data.append(data)

            time.sleep(1)

        except Exception as exc:
            print(
                f"ERROR for {row['panchayat_name']}: {exc}"
            )
            raise

    result = pd.concat(
        all_data,
        ignore_index=True,
    )

    result["time"] = pd.to_datetime(result["time"])

    result = result.sort_values(
        ["lgd_code", "time"]
    ).reset_index(drop=True)

    result.to_csv(
        OUTPUT_FILE,
        index=False,
    )

    print()
    print("=" * 60)
    print("DOWNLOAD COMPLETE")
    print("=" * 60)
    print(f"Output: {OUTPUT_FILE}")
    print(f"Shape: {result.shape}")
    print()
    print("Columns:")
    for column in result.columns:
        print(f"  - {column}")

    print()
    print("Missing values:")
    print(result.isna().sum())

    print()
    print("Rows per Panchayat:")
    print(
        result.groupby("panchayat_name")
        .size()
        .to_string()
    )


if __name__ == "__main__":
    main()