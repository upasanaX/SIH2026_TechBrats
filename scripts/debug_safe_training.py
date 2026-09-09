from pathlib import Path

import numpy as np
import pandas as pd


INPUT_FILE = Path(
    "data/processed/safe_ml_temperature_training.csv"
)


def main():
    df = pd.read_csv(
        INPUT_FILE,
        parse_dates=["time"],
    )

    print("=" * 70)
    print("DEBUGGING SAFE TRAINING DATA")
    print("=" * 70)

    print()
    print("Shape:")
    print(df.shape)

    print()
    print("Missing values by column:")
    missing = df.isna().sum()

    print(
        missing[
            missing > 0
        ].to_string()
    )

    print()
    print("Infinite values by column:")

    numeric_columns = df.select_dtypes(
        include=[np.number]
    ).columns

    infinite_counts = np.isinf(
        df[numeric_columns]
    ).sum()

    print(
        infinite_counts[
            infinite_counts > 0
        ].to_string()
    )

    print()
    print("Target statistics:")

    target = df["temperature_residual"]

    print(target.describe())

    print()
    print("Target NaN count:")
    print(target.isna().sum())

    print()
    print("Target infinite count:")
    print(np.isinf(target).sum())

    print()
    print("Rows with invalid target:")

    invalid_target = (
        target.isna()
        | np.isinf(target)
    )

    print(
        df.loc[
            invalid_target
        ].to_string(index=False)
    )

    print()
    print("Invalid target rows by Panchayat:")

    print(
        df.loc[
            invalid_target
        ]
        .groupby("panchayat_name")
        .size()
        .to_string()
    )


if __name__ == "__main__":
    main()