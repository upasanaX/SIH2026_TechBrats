import os
import pandas as pd
import numpy as np

INPUT_FILE = "data/raw/open_meteo/historical_weather_2024_2025.csv"
OUTPUT_FILE = "data/processed/training_weather.csv"


def main():
    print()
    print("==============================================")
    print(" KrishiKavach - Training Data Preparation")
    print("==============================================")
    print()

    print("Reading historical weather...")
    df = pd.read_csv(INPUT_FILE)

    print(f"Input rows: {len(df)}")

    # Convert timestamp
    df["time"] = pd.to_datetime(df["time"])

    # Sort properly for time-based feature engineering
    df = df.sort_values(
        ["lgd_code", "time"]
    ).reset_index(drop=True)

    # --------------------------------------------------
    # Time features
    # --------------------------------------------------

    df["hour"] = df["time"].dt.hour
    df["day_of_year"] = df["time"].dt.dayofyear
    df["month"] = df["time"].dt.month

    # Cyclic encoding for time
    df["hour_sin"] = np.sin(
        2 * np.pi * df["hour"] / 24
    )

    df["hour_cos"] = np.cos(
        2 * np.pi * df["hour"] / 24
    )

    df["day_sin"] = np.sin(
        2 * np.pi * df["day_of_year"] / 365.25
    )

    df["day_cos"] = np.cos(
        2 * np.pi * df["day_of_year"] / 365.25
    )

    # --------------------------------------------------
    # Weather lag features
    # --------------------------------------------------

    grouped = df.groupby("lgd_code")

    df["temperature_lag_1h"] = grouped[
        "temperature_2m"
    ].shift(1)

    df["temperature_lag_3h"] = grouped[
        "temperature_2m"
    ].shift(3)

    df["temperature_lag_6h"] = grouped[
        "temperature_2m"
    ].shift(6)

    df["temperature_lag_24h"] = grouped[
        "temperature_2m"
    ].shift(24)

    df["humidity_lag_1h"] = grouped[
        "relative_humidity_2m"
    ].shift(1)

    df["pressure_lag_1h"] = grouped[
        "pressure_msl"
    ].shift(1)

    # --------------------------------------------------
    # Rolling weather features
    # --------------------------------------------------

    df["temperature_rolling_3h"] = grouped[
        "temperature_2m"
    ].transform(
        lambda x: x.rolling(3, min_periods=1).mean()
    )

    df["temperature_rolling_6h"] = grouped[
        "temperature_2m"
    ].transform(
        lambda x: x.rolling(6, min_periods=1).mean()
    )

    df["temperature_rolling_24h"] = grouped[
        "temperature_2m"
    ].transform(
        lambda x: x.rolling(24, min_periods=1).mean()
    )

    df["rain_rolling_6h"] = grouped[
        "precipitation"
    ].transform(
        lambda x: x.rolling(6, min_periods=1).sum()
    )

    df["rain_rolling_24h"] = grouped[
        "precipitation"
    ].transform(
        lambda x: x.rolling(24, min_periods=1).sum()
    )

    # --------------------------------------------------
    # Remove rows where lag features are unavailable
    # --------------------------------------------------

    df = df.dropna().reset_index(drop=True)

    # --------------------------------------------------
    # Save
    # --------------------------------------------------

    os.makedirs(
        os.path.dirname(OUTPUT_FILE),
        exist_ok=True
    )

    df.to_csv(
        OUTPUT_FILE,
        index=False
    )

    print()
    print("==============================================")
    print("DONE")
    print("==============================================")
    print()

    print(f"Training rows: {len(df)}")
    print(f"Training columns: {len(df.columns)}")
    print(f"Saved to: {OUTPUT_FILE}")
    print()

    print("Panchayats:")
    print(
        df[
            ["lgd_code", "panchayat_name"]
        ].drop_duplicates().to_string(index=False)
    )

    print()


if __name__ == "__main__":
    main()