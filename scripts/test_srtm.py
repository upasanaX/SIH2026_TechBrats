import csv
import os
import time
from pathlib import Path

import requests
from dotenv import load_dotenv


# ---------------------------------------------------------
# Configuration
# ---------------------------------------------------------

load_dotenv()

API_KEY = os.getenv("OPENTOPOGRAPHY_API_KEY")

if not API_KEY:
    raise RuntimeError(
        "OPENTOPOGRAPHY_API_KEY is missing. "
        "Put it in your .env file."
    )

API_URL = "https://portal.opentopography.org/API/v1/elevation"

DATASET = "SRTM_GL1"

OUTPUT_DIR = Path("data/raw/dem")
OUTPUT_FILE = OUTPUT_DIR / "srtm_test_5_panchayats.csv"

# Small test set.
# Coordinates are representative test points associated with
# the Panchayats we selected earlier.
PANCHAYATS = [
    {
        "panchayat_name": "Aahaley",
        "lgd_code": "260972",
        "block": "Gorubathan",
        "district": "Kalimpong",
        "latitude": 26.968183,
        "longitude": 88.700822,
    },
    {
        "panchayat_name": "Abad Bhagawanpur",
        "lgd_code": "108220",
        "block": "Mathurapur I",
        "district": "South 24 Parganas",
        "latitude": 22.034705,
        "longitude": 88.337723,
    },
    {
        "panchayat_name": "Abinashpur",
        "lgd_code": "108917",
        "block": "Suri II",
        "district": "Birbhum",
        "latitude": 23.817222,
        "longitude": 87.574944,
    },
    {
        "panchayat_name": "Adabari",
        "lgd_code": "109013",
        "block": "Sitai",
        "district": "Cooch Behar",
        "latitude": 26.123361,
        "longitude": 89.309876,
    },
    {
        "panchayat_name": "Adhata",
        "lgd_code": "107777",
        "block": "Amdanga",
        "district": "North 24 Parganas",
        "latitude": 22.866320,
        "longitude": 88.525101,
    },
]


# ---------------------------------------------------------
# OpenTopography request
# ---------------------------------------------------------

def get_elevation(latitude: float, longitude: float) -> dict:
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "dataset": DATASET,
        "API_Key": API_KEY,
    }

    response = requests.get(
        API_URL,
        params=params,
        timeout=30,
    )

    response.raise_for_status()

    data = response.json()

    return data


# ---------------------------------------------------------
# Main
# ---------------------------------------------------------

def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    print("=" * 60)
    print("KrishiKavach - SRTM Elevation Test")
    print("=" * 60)
    print(f"Dataset : {DATASET}")
    print(f"Points  : {len(PANCHAYATS)}")
    print()

    results = []

    for index, panchayat in enumerate(PANCHAYATS, start=1):

        print(
            f"[{index}/{len(PANCHAYATS)}] "
            f"{panchayat['panchayat_name']} "
            f"(LGD {panchayat['lgd_code']})"
        )

        try:
            response = get_elevation(
                latitude=panchayat["latitude"],
                longitude=panchayat["longitude"],
            )

            elevation = response.get("Elevation")
            unit = response.get("Unit")
            status = response.get("Status")

            location = response.get("Location", {})

            result = {
                **panchayat,
                "dataset": DATASET,
                "elevation": elevation,
                "elevation_unit": unit,
                "api_status": status,
                "returned_latitude": location.get("Latitude"),
                "returned_longitude": location.get("Longitude"),
                "vcrs_epsg": response.get("VCRS_EPSG"),
                "reference_dataset": response.get(
                    "Reference Dataset"
                ),
                "error": "",
            }

            results.append(result)

            print(f"    Status    : {status}")
            print(f"    Elevation : {elevation} {unit}")
            print(f"    VCRS EPSG : {response.get('VCRS_EPSG')}")
            print("    ✓ Success")

        except requests.HTTPError as exc:
            print(f"    ✗ HTTP error: {exc}")

            results.append({
                **panchayat,
                "dataset": DATASET,
                "elevation": "",
                "elevation_unit": "",
                "api_status": "",
                "returned_latitude": "",
                "returned_longitude": "",
                "vcrs_epsg": "",
                "reference_dataset": "",
                "error": f"HTTP error: {exc}",
            })

        except requests.RequestException as exc:
            print(f"    ✗ Request error: {exc}")

            results.append({
                **panchayat,
                "dataset": DATASET,
                "elevation": "",
                "elevation_unit": "",
                "api_status": "",
                "returned_latitude": "",
                "returned_longitude": "",
                "vcrs_epsg": "",
                "reference_dataset": "",
                "error": f"Request error: {exc}",
            })

        except Exception as exc:
            print(f"    ✗ Error: {exc}")

            results.append({
                **panchayat,
                "dataset": DATASET,
                "elevation": "",
                "elevation_unit": "",
                "api_status": "",
                "returned_latitude": "",
                "returned_longitude": "",
                "vcrs_epsg": "",
                "reference_dataset": "",
                "error": str(exc),
            })

        print()

        # Be gentle with the API.
        if index < len(PANCHAYATS):
            time.sleep(1)


    # -----------------------------------------------------
    # Save CSV
    # -----------------------------------------------------

    fieldnames = [
        "panchayat_name",
        "lgd_code",
        "block",
        "district",
        "latitude",
        "longitude",
        "dataset",
        "elevation",
        "elevation_unit",
        "api_status",
        "returned_latitude",
        "returned_longitude",
        "vcrs_epsg",
        "reference_dataset",
        "error",
    ]

    with OUTPUT_FILE.open(
        "w",
        newline="",
        encoding="utf-8",
    ) as file:

        writer = csv.DictWriter(
            file,
            fieldnames=fieldnames,
        )

        writer.writeheader()
        writer.writerows(results)


    # -----------------------------------------------------
    # Summary
    # -----------------------------------------------------

    successful = sum(
        1
        for row in results
        if row["elevation"] not in ("", None)
    )

    failed = len(results) - successful

    print("=" * 60)
    print("TEST COMPLETE")
    print("=" * 60)
    print(f"Successful : {successful}")
    print(f"Failed     : {failed}")
    print(f"CSV        : {OUTPUT_FILE}")
    print()


if __name__ == "__main__":
    main()