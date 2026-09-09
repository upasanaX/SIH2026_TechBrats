from pathlib import Path

import pandas as pd


INPUT_FILE = Path(
    "data/raw/previous_runs/previous_day1_weather_features_2024_2025.csv"
)


def main():
    df = pd.read_csv(INPUT_FILE)

    print("=" * 60)
    print("PREVIOUS RUN FEATURES VALIDATION")
    print("=" * 60)

    print()
    print("Shape:")
    print(df.shape)

    print()
    print("Columns:")
    for column in df.columns:
        print(f"  {column}")

    print()
    print("Missing values:")
    print(df.isna().sum())

    print()
    print("Rows per Panchayat:")
    print(
        df.groupby("panchayat_name")
        .size()
        .to_string()
    )

    print()
    print("Date range:")
    print(df["time"].min())
    print(df["time"].max())

    print()
    print("Unique Panchayats:")
    print(df["lgd_code"].nunique())

    print()
    print("Sample:")
    print(df.head().to_string(index=False))


if __name__ == "__main__":
    main()