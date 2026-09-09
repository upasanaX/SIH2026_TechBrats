import os
import requests
import pandas as pd

INPUT_FILE = "data/processed/panchayat_elevation.csv"
OUTPUT_FILE = "data/raw/open_meteo_forecast/historical_forecast_2024_2025.csv"

API_URL = "https://historical-forecast-api.open-meteo.com/v1/forecast"

START_DATE = "2024-01-01"
END_DATE = "2025-12-31"


def main():
    print()
    print("==============================================")
    print(" KrishiKavach - Historical Forecast Downloader")
    print("==============================================")
    print()

    df = pd.read_csv(INPUT_FILE)

    print(f"Found {len(df)} Panchayats.")

    latitudes = ",".join(str(x) for x in df["latitude"])
    longitudes = ",".join(str(x) for x in df["longitude"])
    elevations = ",".join(str(x) for x in df["elevation_m"])

    params = {
        "latitude": latitudes,
        "longitude": longitudes,
        "elevation": elevations,
        "start_date": START_DATE,
        "end_date": END_DATE,
        "hourly": (
            "temperature_2m,"
            "relative_humidity_2m,"
            "precipitation,"
            "pressure_msl,"
            "wind_speed_10m,"
            "wind_direction_10m,"
            "cloud_cover"
        ),
        "timezone": "auto",
        "wind_speed_unit": "kmh",
        "precipitation_unit": "mm",
        "temperature_unit": "celsius"
    }

    print("Requesting historical forecast data...")

    response = requests.get(
        API_URL,
        params=params,
        timeout=120
    )

    response.raise_for_status()

    data = response.json()

    if not isinstance(data, list):
        data = [data]

    all_rows = []

    for location_index, weather in enumerate(data):

        print(
            f"Processing "
            f"{location_index + 1}/{len(data)}..."
        )

        hourly = weather["hourly"]

        weather_df = pd.DataFrame(hourly)

        weather_df["lgd_code"] = (
            df.iloc[location_index]["lgd_code"]
        )

        weather_df["panchayat_name"] = (
            df.iloc[location_index]["panchayat_name"]
        )

        weather_df["latitude"] = (
            df.iloc[location_index]["latitude"]
        )

        weather_df["longitude"] = (
            df.iloc[location_index]["longitude"]
        )

        weather_df["elevation_m"] = (
            df.iloc[location_index]["elevation_m"]
        )

        all_rows.append(weather_df)

    final_df = pd.concat(
        all_rows,
        ignore_index=True
    )

    os.makedirs(
        os.path.dirname(OUTPUT_FILE),
        exist_ok=True
    )

    final_df.to_csv(
        OUTPUT_FILE,
        index=False
    )

    print()
    print("==============================================")
    print("DONE")
    print("==============================================")
    print()

    print(f"Rows downloaded: {len(final_df)}")
    print(f"Saved to: {OUTPUT_FILE}")
    print()


if __name__ == "__main__":
    main()