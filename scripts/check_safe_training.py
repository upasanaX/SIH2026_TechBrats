from pathlib import Path

import pandas as pd


INPUT_FILE = Path(
    "data/processed/safe_ml_temperature_training.csv"
)


def main():
    df = pd.read_csv(
        INPUT_FILE,
        parse_dates=["time"],
    )

    print("=" * 60)
    print("SAFE TRAINING DATA CHECK")
    print("=" * 60)

    forbidden = [
        "temperature_lag_1h",
        "temperature_lag_3h",
        "temperature_lag_6h",
        "temperature_lag_24h",
        "humidity_lag_1h",
        "pressure_lag_1h",
        "temperature_rolling_3h",
        "temperature_rolling_6h",
        "temperature_rolling_24h",
        "rain_rolling_6h",
        "rain_rolling_24h",
        "relative_humidity_2m",
        "pressure_msl",
        "wind_speed_10m",
        "wind_direction_10m",
        "cloud_cover",
        "precipitation",
    ]

    found = [
        column
        for column in forbidden
        if column in df.columns
    ]

    if found:
        print()
        print("WARNING: potentially unsafe columns found:")
        for column in found:
            print("  -", column)

        raise SystemExit(1)

    print()
    print("PASS: no forbidden valid-time features found.")

    print()
    print("Actual feature columns:")

    for column in df.columns:
        print("  -", column)

    print()
    print("Shape:", df.shape)
    print("Missing values:", df.isna().sum().sum())

    print()
    print("PASS")


if __name__ == "__main__":
    main()