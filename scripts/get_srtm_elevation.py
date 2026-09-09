import os
import time
import requests
import pandas as pd
from dotenv import load_dotenv


# Load .env
load_dotenv()

API_KEY = os.getenv("OPENTOPOGRAPHY_API_KEY")

if not API_KEY:
    raise ValueError(
        "OPENTOPOGRAPHY_API_KEY was not found in your .env file."
    )


# Input and output files
INPUT_FILE = "data/processed/panchayat_coordinates.csv"
OUTPUT_FILE = "data/processed/panchayat_elevation.csv"

# OpenTopography Point Elevation API
API_URL = "https://portal.opentopography.org/API/v1/elevation"

# We are using SRTM GL1
DATASET = "SRTM_GL1"


def get_elevation(latitude, longitude):
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "dataset": DATASET,
        "API_Key": API_KEY,
    }

    response = requests.get(API_URL, params=params, timeout=30)

    response.raise_for_status()

    data = response.json()

    if data.get("Status") != "Success":
        raise RuntimeError(f"OpenTopography error: {data}")

    return data["Elevation"]


def main():
    print("Reading Panchayat coordinates...")

    df = pd.read_csv(INPUT_FILE)

    print(f"Found {len(df)} Panchayats.")

    elevations = []

    for index, row in df.iterrows():

        name = row["panchayat_name"]
        lgd_code = row["lgd_code"]
        latitude = row["latitude"]
        longitude = row["longitude"]

        print(
            f"[{index + 1}/{len(df)}] "
            f"{name} ({lgd_code})..."
        )

        try:
            elevation = get_elevation(latitude, longitude)

            print(f"    Elevation: {elevation} m")

            elevations.append(elevation)

        except Exception as e:
            print(f"    ERROR: {e}")
            elevations.append(None)

        # Small pause between requests
        time.sleep(1)

    df["elevation_m"] = elevations

    os.makedirs(
        os.path.dirname(OUTPUT_FILE),
        exist_ok=True
    )

    df.to_csv(
        OUTPUT_FILE,
        index=False
    )

    print()
    print("Done!")
    print(f"Saved to: {OUTPUT_FILE}")


if __name__ == "__main__":
    main()