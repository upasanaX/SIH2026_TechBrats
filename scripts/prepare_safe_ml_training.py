from pathlib import Path

import pandas as pd


REFERENCE_FILE = Path(
    "data/processed/training_weather.csv"
)

FORECAST_FILE = Path(
    "data/raw/previous_runs/"
    "previous_day1_weather_features_2024_2025.csv"
)

OUTPUT_FILE = Path(
    "data/processed/safe_ml_temperature_training.csv"
)


def main():
    reference = pd.read_csv(
        REFERENCE_FILE,
        parse_dates=["time"],
    )

    forecast = pd.read_csv(
        FORECAST_FILE,
        parse_dates=["time"],
    )

    print("Reference shape:", reference.shape)
    print("Forecast shape:", forecast.shape)

    # Only take the reference temperature.
    reference = reference[
        [
            "time",
            "lgd_code",
            "temperature_2m",
        ]
    ].copy()

    # These are all features available from the
    # previous-day forecast.
    forecast_columns = [
        "time",
        "lgd_code",
        "panchayat_name",
        "latitude",
        "longitude",
        "temperature_2m_previous_day1",
        "relative_humidity_2m_previous_day1",
        "pressure_msl_previous_day1",
        "wind_speed_10m_previous_day1",
        "wind_direction_10m_previous_day1",
        "cloud_cover_previous_day1",
        "precipitation_previous_day1",
    ]

    forecast = forecast[forecast_columns].copy()

    # Merge reference temperature with the
    # previous-day forecast.
    df = reference.merge(
        forecast,
        on=["time", "lgd_code"],
        how="inner",
        validate="one_to_one",
    )

    # ---------------------------------------------------------
    # TARGET
    # ---------------------------------------------------------
    #
    # Positive residual:
    # reference was warmer than the forecast.
    #
    # Negative residual:
    # reference was colder than the forecast.
    #
    df["temperature_residual"] = (
        df["temperature_2m"]
        - df["temperature_2m_previous_day1"]
    )
    
    # ---------------------------------------------------------
# REMOVE ROWS WHERE THE TARGET CANNOT BE CALCULATED
# ---------------------------------------------------------

    before_rows = len(df)

    df = df.dropna(
        subset=[
        "temperature_2m",
        "temperature_2m_previous_day1",
        "temperature_residual",
        ]
    ).copy()

    after_rows = len(df)

    print()
    print(
        f"Removed {before_rows - after_rows} rows "
        "with missing target information."
    )

    # ---------------------------------------------------------
    # TIME FEATURES
    # ---------------------------------------------------------

    df["hour"] = df["time"].dt.hour

    df["day_of_year"] = df["time"].dt.dayofyear

    df["month"] = df["time"].dt.month

    df["hour_sin"] = (
        __import__("numpy").sin(
            2 * __import__("numpy").pi * df["hour"] / 24
        )
    )

    df["hour_cos"] = (
        __import__("numpy").cos(
            2 * __import__("numpy").pi * df["hour"] / 24
        )
    )

    df["day_sin"] = (
        __import__("numpy").sin(
            2
            * __import__("numpy").pi
            * df["day_of_year"]
            / 365.25
        )
    )

    df["day_cos"] = (
        __import__("numpy").cos(
            2
            * __import__("numpy").pi
            * df["day_of_year"]
            / 365.25
        )
    )

    # ---------------------------------------------------------
    # FINAL SAFE FEATURE LIST
    # ---------------------------------------------------------

    columns = [
        "time",
        "lgd_code",
        "panchayat_name",
        "latitude",
        "longitude",

        # Target
        "temperature_2m",
        "temperature_residual",

        # Previous-day forecast features
        "temperature_2m_previous_day1",
        "relative_humidity_2m_previous_day1",
        "pressure_msl_previous_day1",
        "wind_speed_10m_previous_day1",
        "wind_direction_10m_previous_day1",
        "cloud_cover_previous_day1",
        "precipitation_previous_day1",

        # Time features
        "hour",
        "day_of_year",
        "month",
        "hour_sin",
        "hour_cos",
        "day_sin",
        "day_cos",
    ]

    df = df[columns]

    df = df.sort_values(
        ["time", "lgd_code"]
    ).reset_index(drop=True)

    OUTPUT_FILE.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    df.to_csv(
        OUTPUT_FILE,
        index=False,
    )

    print()
    print("=" * 60)
    print("SAFE TRAINING DATA CREATED")
    print("=" * 60)

    print("Output:", OUTPUT_FILE)
    print("Shape:", df.shape)

    print()
    print("Missing values:")
    print(df.isna().sum())

    print()
    print("Date range:")
    print(df["time"].min())
    print(df["time"].max())

    print()
    print("Panchayats:")
    print(
        df.groupby("panchayat_name")
        .size()
        .to_string()
    )

    print()
    print("Residual statistics:")
    print(
        df["temperature_residual"].describe()
    )


if __name__ == "__main__":
    main()