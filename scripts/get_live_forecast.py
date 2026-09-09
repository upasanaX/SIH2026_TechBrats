from pathlib import Path
import requests
import pandas as pd


# ============================================================
# CONFIGURATION
# ============================================================

BASE_DIR = Path(__file__).resolve().parents[1]

COORDINATES_FILE = (
    BASE_DIR
    / "data"
    / "processed"
    / "panchayat_coordinates.csv"
)

OUTPUT_DIR = (
    BASE_DIR
    / "data"
    / "raw"
    / "open_meteo_forecast"
)

OUTPUT_FILE = OUTPUT_DIR / "live_forecast.csv"

OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"


# ============================================================
# WEATHER VARIABLES
# ============================================================

HOURLY_VARIABLES = [
    "temperature_2m",
    "relative_humidity_2m",
    "precipitation",
    "pressure_msl",
    "wind_speed_10m",
    "wind_direction_10m",
    "cloud_cover",
]


# ============================================================
# LOAD PANCHAYAT COORDINATES
# ============================================================

print("=" * 60)
print("LOADING PANCHAYAT COORDINATES")
print("=" * 60)

coordinates = pd.read_csv(COORDINATES_FILE)

coordinates.columns = coordinates.columns.str.strip()

required_columns = [
    "lgd_code",
    "panchayat_name",
    "latitude",
    "longitude",
]

missing = [
    col for col in required_columns
    if col not in coordinates.columns
]

if missing:
    raise ValueError(
        f"Missing coordinate columns: {missing}"
    )

coordinates["lgd_code"] = (
    pd.to_numeric(
        coordinates["lgd_code"],
        errors="raise"
    )
    .astype(int)
)

print(f"Panchayats found: {len(coordinates)}")


# ============================================================
# CREATE OUTPUT DIRECTORY
# ============================================================

OUTPUT_DIR.mkdir(
    parents=True,
    exist_ok=True
)


# ============================================================
# DOWNLOAD LIVE FORECAST
# ============================================================

all_forecasts = []

print()
print("=" * 60)
print("DOWNLOADING REAL OPEN-METEO FORECAST")
print("=" * 60)


for _, row in coordinates.iterrows():

    lgd_code = int(row["lgd_code"])
    panchayat_name = row["panchayat_name"]

    latitude = float(row["latitude"])
    longitude = float(row["longitude"])

    print()
    print(
        f"Fetching forecast for "
        f"{panchayat_name} "
        f"(LGD {lgd_code})"
    )

    params = {
        "latitude": latitude,
        "longitude": longitude,
        "hourly": ",".join(HOURLY_VARIABLES),
        "forecast_days": 2,
        "timezone": "auto",
    }

    response = requests.get(
        OPEN_METEO_URL,
        params=params,
        timeout=30,
    )

    response.raise_for_status()

    data = response.json()

    if "hourly" not in data:
        raise ValueError(
            f"No hourly forecast returned for "
            f"{panchayat_name}"
        )

    hourly = data["hourly"]

    forecast_df = pd.DataFrame(hourly)

    forecast_df["lgd_code"] = lgd_code
    forecast_df["panchayat_name"] = panchayat_name
    forecast_df["latitude"] = latitude
    forecast_df["longitude"] = longitude

    all_forecasts.append(forecast_df)

    print(
        f"Received {len(forecast_df)} hourly records."
    )


# ============================================================
# COMBINE FORECASTS
# ============================================================

print()
print("=" * 60)
print("COMBINING FORECAST DATA")
print("=" * 60)

forecast = pd.concat(
    all_forecasts,
    ignore_index=True
)

forecast["time"] = pd.to_datetime(
    forecast["time"]
)

forecast = forecast.sort_values(
    [
        "lgd_code",
        "time",
    ]
).reset_index(drop=True)


# ============================================================
# VALIDATION
# ============================================================

print()
print("=" * 60)
print("VALIDATING FORECAST DATA")
print("=" * 60)

expected_columns = [
    "time",
    "temperature_2m",
    "relative_humidity_2m",
    "precipitation",
    "pressure_msl",
    "wind_speed_10m",
    "wind_direction_10m",
    "cloud_cover",
    "lgd_code",
    "panchayat_name",
    "latitude",
    "longitude",
]

missing = [
    col
    for col in expected_columns
    if col not in forecast.columns
]

if missing:
    raise ValueError(
        f"Missing forecast columns: {missing}"
    )


weather_columns = [
    "temperature_2m",
    "relative_humidity_2m",
    "precipitation",
    "pressure_msl",
    "wind_speed_10m",
    "wind_direction_10m",
    "cloud_cover",
]

missing_values = forecast[
    weather_columns
].isna().sum()

print()
print("Missing values:")

print(missing_values)

if missing_values.sum() > 0:
    print()
    print(
        "WARNING: Some weather variables contain "
        "missing values."
    )

else:
    print()
    print("Weather data validation: PASS")


# ============================================================
# SAVE
# ============================================================

forecast.to_csv(
    OUTPUT_FILE,
    index=False
)

print()
print("=" * 60)
print("LIVE FORECAST DOWNLOAD COMPLETED")
print("=" * 60)

print()
print(f"Rows: {len(forecast)}")
print(f"Panchayats: {forecast['lgd_code'].nunique()}")
print(f"Output: {OUTPUT_FILE}")

print()
print("Sample:")
print(
    forecast.head(10).to_string(index=False)
)