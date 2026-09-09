from pathlib import Path
import json

import numpy as np
import pandas as pd

from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
)

from xgboost import XGBRegressor


# ============================================================
# PATHS
# ============================================================

INPUT_FILE = Path(
    "data/processed/safe_ml_temperature_training.csv"
)

REFERENCE_FILE = Path(
    "data/processed/training_weather.csv"
)

ELEVATION_FILE = Path(
    "data/processed/panchayat_elevation.csv"
)

MODEL_DIR = Path(
    "data/models"
)

REPORT_DIR = Path(
    "data/reports"
)

TEMPORAL_MODEL_FILE = (
    MODEL_DIR / "temperature_temporal_xgb.json"
)

SPATIAL_MODEL_FILE = (
    MODEL_DIR / "temperature_spatial_xgb.json"
)

METRICS_FILE = (
    MODEL_DIR / "temperature_model_metrics.json"
)

COMPARISON_REPORT_FILE = (
    REPORT_DIR / "temperature_model_comparison.csv"
)

FEATURE_IMPORTANCE_FILE = (
    REPORT_DIR / "temperature_spatial_feature_importance.csv"
)


# ============================================================
# FEATURES
# ============================================================

TEMPORAL_FEATURES = [
    "temperature_2m_previous_day1",
    "relative_humidity_2m_previous_day1",
    "pressure_msl_previous_day1",
    "wind_speed_10m_previous_day1",
    "wind_direction_10m_previous_day1",
    "cloud_cover_previous_day1",
    "precipitation_previous_day1",

    "hour",
    "day_of_year",
    "month",

    "hour_sin",
    "hour_cos",
    "day_sin",
    "day_cos",
]


SPATIAL_FEATURES = TEMPORAL_FEATURES + [
    "latitude",
    "longitude",
    "elevation_m",
]


# ============================================================
# HELPER FUNCTIONS
# ============================================================

def print_section(title):
    print()
    print("=" * 60)
    print(title)
    print("=" * 60)


def calculate_metrics(y_true, y_pred):
    """
    Calculate MAE, RMSE and Bias.
    """

    mae = mean_absolute_error(
        y_true,
        y_pred,
    )

    rmse = np.sqrt(
        mean_squared_error(
            y_true,
            y_pred,
        )
    )

    bias = np.mean(
        np.asarray(y_pred) - np.asarray(y_true)
    )

    return {
        "MAE": float(mae),
        "RMSE": float(rmse),
        "Bias": float(bias),
    }


def print_metrics(name, result):

    print()
    print(name)
    print("-" * 40)

    print(
        f"MAE  : {result['MAE']:.4f} °C"
    )

    print(
        f"RMSE : {result['RMSE']:.4f} °C"
    )

    print(
        f"Bias : {result['Bias']:.4f} °C"
    )


def train_model(
    X_train,
    y_train,
    X_validation,
    y_validation,
):
    """
    Train XGBoost residual correction model.
    """

    model = XGBRegressor(
        n_estimators=500,
        max_depth=6,
        learning_rate=0.05,
        subsample=0.8,
        colsample_bytree=0.8,
        objective="reg:squarederror",
        random_state=42,
        n_jobs=-1,
    )

    model.fit(
        X_train,
        y_train,
        eval_set=[
            (
                X_validation,
                y_validation,
            )
        ],
        verbose=False,
    )

    return model


def validate_columns(df, required_columns, name):

    missing_columns = [
        column
        for column in required_columns
        if column not in df.columns
    ]

    if missing_columns:
        raise ValueError(
            f"{name} is missing required columns: "
            f"{missing_columns}"
        )


# ============================================================
# MAIN
# ============================================================

def main():

    # --------------------------------------------------------
    # CREATE DIRECTORIES
    # --------------------------------------------------------

    MODEL_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    REPORT_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    # --------------------------------------------------------
    # LOAD SAFE TRAINING DATA
    # --------------------------------------------------------

    print_section(
        "LOADING SAFE TRAINING DATA"
    )

    if not INPUT_FILE.exists():
        raise FileNotFoundError(
            f"Safe training file not found: {INPUT_FILE}"
        )

    df = pd.read_csv(
        INPUT_FILE,
        parse_dates=["time"],
    )

    print(
        f"Safe training data: {df.shape}"
    )

    # --------------------------------------------------------
    # VALIDATE SAFE DATA
    # --------------------------------------------------------

    required_safe_columns = [
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

        "temperature_residual",

        "hour",
        "day_of_year",
        "month",

        "hour_sin",
        "hour_cos",
        "day_sin",
        "day_cos",
    ]

    validate_columns(
        df,
        required_safe_columns,
        "Safe training data",
    )

    # --------------------------------------------------------
    # REMOVE DUPLICATES
    # --------------------------------------------------------

    duplicate_count = df.duplicated(
        subset=[
            "time",
            "lgd_code",
        ]
    ).sum()

    if duplicate_count > 0:

        raise ValueError(
            "Safe training data contains "
            f"{duplicate_count} duplicate "
            "time/lgd_code rows."
        )

    # --------------------------------------------------------
    # ADD ELEVATION
    # --------------------------------------------------------

    print_section(
        "ADDING ELEVATION"
    )

    if not ELEVATION_FILE.exists():
        raise FileNotFoundError(
            f"Elevation file not found: "
            f"{ELEVATION_FILE}"
        )

    elevation = pd.read_csv(
        ELEVATION_FILE
    )

    validate_columns(
        elevation,
        [
            "lgd_code",
            "elevation_m",
        ],
        "Elevation data",
    )

    elevation = elevation[
        [
            "lgd_code",
            "elevation_m",
        ]
    ].copy()

    # Check duplicate LGD codes
    elevation_duplicates = elevation.duplicated(
        subset=["lgd_code"]
    ).sum()

    if elevation_duplicates > 0:

        raise ValueError(
            "Elevation data contains duplicate "
            f"LGD codes: {elevation_duplicates}"
        )

    df = df.merge(
        elevation,
        on="lgd_code",
        how="left",
        validate="many_to_one",
    )

    if df["elevation_m"].isna().any():

        missing_codes = (
            df.loc[
                df["elevation_m"].isna(),
                "lgd_code",
            ]
            .unique()
            .tolist()
        )

        raise ValueError(
            "Missing elevation for LGD codes: "
            f"{missing_codes}"
        )

    print(
        "Elevation validation: PASS"
    )

    # --------------------------------------------------------
    # LOAD REFERENCE TEMPERATURE
    # --------------------------------------------------------

    print_section(
        "LOADING REFERENCE TEMPERATURE"
    )

    if not REFERENCE_FILE.exists():
        raise FileNotFoundError(
            f"Reference weather file not found: "
            f"{REFERENCE_FILE}"
        )

    reference = pd.read_csv(
        REFERENCE_FILE,
        parse_dates=["time"],
    )

    validate_columns(
        reference,
        [
            "time",
            "lgd_code",
            "temperature_2m",
        ],
        "Reference weather data",
    )

    # Only keep what we need.
    reference = reference[
        [
            "time",
            "lgd_code",
            "temperature_2m",
        ]
    ].copy()

    # IMPORTANT:
    # Rename the reference temperature BEFORE merging.
    #
    # This prevents pandas from creating temperature_2m_x
    # and temperature_2m_y columns.
    reference = reference.rename(
        columns={
            "temperature_2m":
                "temperature_reference"
        }
    )

    # Check duplicates
    reference_duplicates = reference.duplicated(
        subset=[
            "time",
            "lgd_code",
        ]
    ).sum()

    if reference_duplicates > 0:

        raise ValueError(
            "Reference weather data contains "
            f"{reference_duplicates} duplicate "
            "time/lgd_code rows."
        )

    # Check missing values
    if reference[
        "temperature_reference"
    ].isna().any():

        missing_reference = int(
            reference[
                "temperature_reference"
            ].isna().sum()
        )

        raise ValueError(
            "Reference temperature contains "
            f"{missing_reference} missing values."
        )

    # Merge reference temperature
    df = df.merge(
        reference,
        on=[
            "time",
            "lgd_code",
        ],
        how="left",
        validate="one_to_one",
    )

    # Validate merge
    if df[
        "temperature_reference"
    ].isna().any():

        missing_after_merge = int(
            df[
                "temperature_reference"
            ].isna().sum()
        )

        raise ValueError(
            "Reference temperature missing "
            f"after merge: {missing_after_merge} rows."
        )

    print(
        "Reference temperature validation: PASS"
    )

    # --------------------------------------------------------
    # VALIDATE RESIDUAL TARGET
    # --------------------------------------------------------

    print_section(
        "VALIDATING RESIDUAL TARGET"
    )

    # The residual target should equal:
    #
    # reference temperature
    # minus
    # previous-day forecast temperature
    #
    # We check this instead of trusting a potentially
    # incorrect target column.

    calculated_residual = (
        df["temperature_reference"]
        - df["temperature_2m_previous_day1"]
    )

    residual_difference = (
        calculated_residual
        - df["temperature_residual"]
    ).abs()

    maximum_difference = (
        residual_difference.max()
    )

    print(
        "Maximum residual difference:",
        f"{maximum_difference:.10f}"
    )

    if maximum_difference > 1e-6:

        raise ValueError(
            "temperature_residual does not match "
            "reference temperature - previous-day "
            "forecast temperature."
        )

    print(
        "Residual target validation: PASS"
    )

    # --------------------------------------------------------
    # CHRONOLOGICAL SPLIT
    # --------------------------------------------------------

    print_section(
        "DATA SPLIT"
    )

    train_end = pd.Timestamp(
        "2024-12-31 23:00:00"
    )

    validation_end = pd.Timestamp(
        "2025-06-30 23:00:00"
    )

    train = df[
        df["time"] <= train_end
    ].copy()

    validation = df[
        (df["time"] > train_end)
        & (
            df["time"]
            <= validation_end
        )
    ].copy()

    test = df[
        df["time"] > validation_end
    ].copy()

    print(
        "Train:",
        train.shape,
        train["time"].min(),
        "to",
        train["time"].max(),
    )

    print(
        "Validation:",
        validation.shape,
        validation["time"].min(),
        "to",
        validation["time"].max(),
    )

    print(
        "Test:",
        test.shape,
        test["time"].min(),
        "to",
        test["time"].max(),
    )

    # Make sure all splits contain data
    if len(train) == 0:
        raise ValueError(
            "Training split is empty."
        )

    if len(validation) == 0:
        raise ValueError(
            "Validation split is empty."
        )

    if len(test) == 0:
        raise ValueError(
            "Test split is empty."
        )

    # --------------------------------------------------------
    # TARGET
    # --------------------------------------------------------

    y_train = train[
        "temperature_residual"
    ].copy()

    y_validation = validation[
        "temperature_residual"
    ].copy()

    y_test = test[
        "temperature_residual"
    ].copy()

    # --------------------------------------------------------
    # TARGET VALIDATION
    # --------------------------------------------------------

    print_section(
        "TARGET VALIDATION"
    )

    for name, target in [
        ("train", y_train),
        ("validation", y_validation),
        ("test", y_test),
    ]:

        if target.isna().any():

            raise ValueError(
                f"{name} target contains "
                f"{target.isna().sum()} NaN values."
            )

        if np.isinf(target).any():

            raise ValueError(
                f"{name} target contains "
                "infinite values."
            )

    print(
        "Target validation: PASS"
    )

    # --------------------------------------------------------
    # TEST REFERENCE TEMPERATURE
    # --------------------------------------------------------

    actual_test = (
        test[
            "temperature_reference"
        ]
        .to_numpy()
    )

    # Raw previous-day forecast
    raw_test = (
        test[
            "temperature_2m_previous_day1"
        ]
        .to_numpy()
    )

    # --------------------------------------------------------
    # BASELINE
    # --------------------------------------------------------

    print_section(
        "RAW FORECAST BASELINE"
    )

    baseline_result = calculate_metrics(
        actual_test,
        raw_test,
    )

    print_metrics(
        "Raw previous-day forecast",
        baseline_result,
    )

    # --------------------------------------------------------
    # TEMPORAL XGBOOST
    # --------------------------------------------------------

    print_section(
        "TRAINING TEMPORAL XGBOOST"
    )

    X_train_temporal = train[
        TEMPORAL_FEATURES
    ].copy()

    X_validation_temporal = validation[
        TEMPORAL_FEATURES
    ].copy()

    X_test_temporal = test[
        TEMPORAL_FEATURES
    ].copy()

    temporal_model = train_model(
        X_train_temporal,
        y_train,
        X_validation_temporal,
        y_validation,
    )

    temporal_residual = (
        temporal_model.predict(
            X_test_temporal
        )
    )

    # Residual correction:
    #
    # corrected temperature =
    # raw forecast + predicted residual

    temporal_prediction = (
        raw_test
        + temporal_residual
    )

    temporal_result = calculate_metrics(
        actual_test,
        temporal_prediction,
    )

    print_section(
        "TEMPORAL ML"
    )

    print_metrics(
        "Temporal XGBoost",
        temporal_result,
    )

    # --------------------------------------------------------
    # SPATIAL + TEMPORAL XGBOOST
    # --------------------------------------------------------

    print_section(
        "TRAINING SPATIAL + TEMPORAL XGBOOST"
    )

    X_train_spatial = train[
        SPATIAL_FEATURES
    ].copy()

    X_validation_spatial = validation[
        SPATIAL_FEATURES
    ].copy()

    X_test_spatial = test[
        SPATIAL_FEATURES
    ].copy()

    spatial_model = train_model(
        X_train_spatial,
        y_train,
        X_validation_spatial,
        y_validation,
    )

    spatial_residual = (
        spatial_model.predict(
            X_test_spatial
        )
    )

    spatial_prediction = (
        raw_test
        + spatial_residual
    )

    spatial_result = calculate_metrics(
        actual_test,
        spatial_prediction,
    )

    print_section(
        "SPATIAL + TEMPORAL ML"
    )

    print_metrics(
        "Spatial XGBoost",
        spatial_result,
    )

    # --------------------------------------------------------
    # IMPROVEMENT CALCULATIONS
    # --------------------------------------------------------

    baseline_mae = (
        baseline_result["MAE"]
    )

    temporal_mae = (
        temporal_result["MAE"]
    )

    spatial_mae = (
        spatial_result["MAE"]
    )

    baseline_rmse = (
        baseline_result["RMSE"]
    )

    temporal_rmse = (
        temporal_result["RMSE"]
    )

    spatial_rmse = (
        spatial_result["RMSE"]
    )

    temporal_improvement = (
        100.0
        * (
            baseline_mae
            - temporal_mae
        )
        / baseline_mae
    )

    spatial_improvement = (
        100.0
        * (
            baseline_mae
            - spatial_mae
        )
        / baseline_mae
    )

    spatial_vs_temporal = (
        100.0
        * (
            temporal_mae
            - spatial_mae
        )
        / temporal_mae
    )

    temporal_rmse_improvement = (
        100.0
        * (
            baseline_rmse
            - temporal_rmse
        )
        / baseline_rmse
    )

    spatial_rmse_improvement = (
        100.0
        * (
            baseline_rmse
            - spatial_rmse
        )
        / baseline_rmse
    )

    # --------------------------------------------------------
    # MODEL COMPARISON
    # --------------------------------------------------------

    print_section(
        "MODEL COMPARISON"
    )

    print(
        f"Raw forecast MAE:       "
        f"{baseline_mae:.4f} °C"
    )

    print(
        f"Temporal ML MAE:        "
        f"{temporal_mae:.4f} °C"
    )

    print(
        f"Spatial ML MAE:         "
        f"{spatial_mae:.4f} °C"
    )

    print()

    print(
        "Temporal ML improvement "
        "over raw:",
        f"{temporal_improvement:.2f}%"
    )

    print(
        "Spatial ML improvement "
        "over raw:",
        f"{spatial_improvement:.2f}%"
    )

    print(
        "Spatial improvement "
        "over temporal:",
        f"{spatial_vs_temporal:.2f}%"
    )

    # --------------------------------------------------------
    # RMSE COMPARISON
    # --------------------------------------------------------

    print_section(
        "RMSE COMPARISON"
    )

    print(
        f"Raw:       {baseline_rmse:.4f} °C"
    )

    print(
        f"Temporal:  {temporal_rmse:.4f} °C"
    )

    print(
        f"Spatial:   {spatial_rmse:.4f} °C"
    )

    print()

    print(
        "Temporal RMSE improvement "
        "over raw:",
        f"{temporal_rmse_improvement:.2f}%"
    )

    print(
        "Spatial RMSE improvement "
        "over raw:",
        f"{spatial_rmse_improvement:.2f}%"
    )

    # --------------------------------------------------------
    # FEATURE IMPORTANCE
    # --------------------------------------------------------

    print_section(
        "TOP SPATIAL MODEL FEATURES"
    )

    importance = pd.DataFrame(
        {
            "feature": SPATIAL_FEATURES,
            "importance":
                spatial_model.feature_importances_,
        }
    )

    importance = (
        importance
        .sort_values(
            "importance",
            ascending=False,
        )
        .reset_index(drop=True)
    )

    print(
        importance.head(20).to_string(
            index=False
        )
    )

    # --------------------------------------------------------
    # SAVE MODELS
    # --------------------------------------------------------

    print_section(
        "SAVING MODELS"
    )

    temporal_model.save_model(
        TEMPORAL_MODEL_FILE
    )

    spatial_model.save_model(
        SPATIAL_MODEL_FILE
    )

    print(
        TEMPORAL_MODEL_FILE
    )

    print(
        SPATIAL_MODEL_FILE
    )

    # --------------------------------------------------------
    # SAVE MODEL METRICS JSON
    # --------------------------------------------------------

    metrics_output = {
        "experiment": {
            "target":
                "temperature residual",
            "reference":
                "Open-Meteo training weather",
            "evaluation_period":
                "2025-07-01 to 2025-12-31",
            "training_period":
                "available 2024 data",
            "validation_period":
                "2025-01-01 to 2025-06-30",
        },

        "baseline": {
            "MAE":
                baseline_result["MAE"],
            "RMSE":
                baseline_result["RMSE"],
            "Bias":
                baseline_result["Bias"],
        },

        "temporal_xgboost": {
            "MAE":
                temporal_result["MAE"],
            "RMSE":
                temporal_result["RMSE"],
            "Bias":
                temporal_result["Bias"],
            "improvement_vs_raw_mae_percent":
                temporal_improvement,
            "improvement_vs_raw_rmse_percent":
                temporal_rmse_improvement,
        },

        "spatial_temporal_xgboost": {
            "MAE":
                spatial_result["MAE"],
            "RMSE":
                spatial_result["RMSE"],
            "Bias":
                spatial_result["Bias"],
            "improvement_vs_raw_mae_percent":
                spatial_improvement,
            "improvement_vs_raw_rmse_percent":
                spatial_rmse_improvement,
            "improvement_vs_temporal_mae_percent":
                spatial_vs_temporal,
        },

        "dataset": {
            "total_rows":
                int(len(df)),
            "train_rows":
                int(len(train)),
            "validation_rows":
                int(len(validation)),
            "test_rows":
                int(len(test)),
        },
    }

    with open(
        METRICS_FILE,
        "w",
        encoding="utf-8",
    ) as file:

        json.dump(
            metrics_output,
            file,
            indent=2,
        )

    # --------------------------------------------------------
    # K-2 REPORT
    # temperature_model_comparison.csv
    # --------------------------------------------------------

    print_section(
        "SAVING K-2 REPORT"
    )

    comparison_report = pd.DataFrame(
        [
            {
                "model":
                    "Raw forecast",

                "MAE":
                    baseline_result["MAE"],

                "RMSE":
                    baseline_result["RMSE"],

                "Bias":
                    baseline_result["Bias"],

                "improvement_vs_raw":
                    0.0,
            },

            {
                "model":
                    "Temporal XGBoost",

                "MAE":
                    temporal_result["MAE"],

                "RMSE":
                    temporal_result["RMSE"],

                "Bias":
                    temporal_result["Bias"],

                "improvement_vs_raw":
                    temporal_improvement,
            },

            {
                "model":
                    "Spatial + Temporal XGBoost",

                "MAE":
                    spatial_result["MAE"],

                "RMSE":
                    spatial_result["RMSE"],

                "Bias":
                    spatial_result["Bias"],

                "improvement_vs_raw":
                    spatial_improvement,
            },
        ]
    )

    comparison_report.to_csv(
        COMPARISON_REPORT_FILE,
        index=False,
    )

    # --------------------------------------------------------
    # SAVE FEATURE IMPORTANCE REPORT
    # --------------------------------------------------------

    importance.to_csv(
        FEATURE_IMPORTANCE_FILE,
        index=False,
    )

    # --------------------------------------------------------
    # FINAL OUTPUT
    # --------------------------------------------------------

    print(
        "K-2 comparison report:"
    )

    print(
        COMPARISON_REPORT_FILE
    )

    print()

    print(
        "Feature importance report:"
    )

    print(
        FEATURE_IMPORTANCE_FILE
    )

    print()

    print(
        "Model metrics:"
    )

    print(
        METRICS_FILE
    )

    print()

    print_section(
        "TRAINING COMPLETED SUCCESSFULLY"
    )

    print(
        "Models saved successfully."
    )

    print(
        "Reports saved successfully."
    )


# ============================================================
# ENTRY POINT
# ============================================================

if __name__ == "__main__":
    main()