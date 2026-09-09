import os
import requests
import pandas as pd


INPUT_FILE = "data/processed/panchayat_elevation.csv"
OUTPUT_FILE = "data/raw/open_meteo/historical_weather_2024_2025.csv"

API_URL = "https://archive-api.open-meteo.com/v1/archive"

START_DATE = "2024-01-01"
END_DATE = "2025-12-31"


def main():

    print()
    print("==============================================")
    print(" KrishiKavach - Historical Weather Downloader")
    print("==============================================")
    print()

    # ------------------------------------------------
    # 1. Read Panchayat + elevation data
    # ------------------------------------------------

    print("Reading Panchayat elevation data...")

    df = pd.read_csv(INPUT_FILE)

    print(f"Found {len(df)} Panchayats.")
    print()


    # ------------------------------------------------
    # 2. Prepare coordinate lists
    # ------------------------------------------------

    latitudes = ",".join(
        str(x) for x in df["latitude"]
    )

    longitudes = ",".join(
        str(x) for x in df["longitude"]
    )

    elevations = ",".join(
        str(x) for x in df["elevation_m"]
    )


    # ------------------------------------------------
    # 3. Request historical weather
    # ------------------------------------------------

    print("Requesting historical weather data...")
    print(f"Start date: {START_DATE}")
    print(f"End date:   {END_DATE}")
    print()


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


    response = requests.get(
        API_URL,
        params=params,
        timeout=120
    )


    response.raise_for_status()

    data = response.json()


    # ------------------------------------------------
    # 4. Convert response into rows
    # ------------------------------------------------

    print("Weather data received.")
    print()


    all_rows = []


    # Open-Meteo returns a list when multiple
    # coordinates are requested.

    if not isinstance(data, list):
        data = [data]


    for location_index, weather in enumerate(data):

        print(
            f"Processing "
            f"{location_index + 1}/{len(data)}..."
        )


        hourly = weather["hourly"]


        weather_df = pd.DataFrame(hourly)


        # Add Panchayat information

        weather_df["lgd_code"] = df.iloc[
            location_index
        ]["lgd_code"]

        weather_df["panchayat_name"] = df.iloc[
            location_index
        ]["panchayat_name"]

        weather_df["latitude"] = df.iloc[
            location_index
        ]["latitude"]

        weather_df["longitude"] = df.iloc[
            location_index
        ]["longitude"]

        weather_df["elevation_m"] = df.iloc[
            location_index
        ]["elevation_m"]


        all_rows.append(weather_df)


    # ------------------------------------------------
    # 5. Combine all Panchayats
    # ------------------------------------------------

    final_df = pd.concat(
        all_rows,
        ignore_index=True
    )


    # ------------------------------------------------
    # 6. Create output directory
    # ------------------------------------------------

    os.makedirs(
        os.path.dirname(OUTPUT_FILE),
        exist_ok=True
    )


    # ------------------------------------------------
    # 7. Save CSV
    # ------------------------------------------------

    final_df.to_csv(
        OUTPUT_FILE,
        index=False
    )


    print()
    print("==============================================")
    print("DONE")
    print("==============================================")
    print()

    print(
        f"Rows downloaded: {len(final_df)}"
    )

    print(
        f"Saved to: {OUTPUT_FILE}"
    )

    print()


if __name__ == "__main__":
    main()