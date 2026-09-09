import pandas as pd
import numpy as np
from pathlib import Path

from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error


# ============================================================
# Paths
# ============================================================

INPUT = Path(
    "data/processed/ml_temperature_training.csv"
)

MODEL_DIR = Path(
    "data/models"
)

MODEL_DIR.mkdir(
    parents=True,
    exist_ok=True
)

MODEL_FILE = MODEL_DIR / "temperature_residual_xgb.json"


# ============================================================
# Load ML dataset
# ============================================================

df = pd.read_csv(INPUT)

df["time"] = pd.to_datetime(df["time"])

# ------------------------------------------------------------
# Load reference temperature separately
#
# ml_temperature_training.csv does not contain temperature_2m.
# We get it from training_weather.csv.
# ------------------------------------------------------------

reference = pd.read_csv(
    "data/processed/training_weather.csv"
)

reference["time"] = pd.to_datetime(
    reference["time"]
)

reference = reference[
    [
        "time",
        "lgd_code",
        "temperature_2m",
    ]
]

# Merge reference temperature into ML dataset
df = df.merge(
    reference,
    on=["time", "lgd_code"],
    how="inner",
    validate="one_to_one",
)

df = df.sort_values(
    ["time", "lgd_code"]
).reset_index(drop=True)


print("Full dataset:", df.shape)
print("Missing reference temperature:",
      df["temperature_2m"].isna().sum())


# ============================================================
# Chronological split
# ============================================================

train = df[
    df["time"] < "2025-07-01"
].copy()

validation = df[
    (df["time"] >= "2025-07-01") &
    (df["time"] < "2025-10-01")
].copy()

test = df[
    df["time"] >= "2025-10-01"
].copy()


print()
print("Dataset sizes")
print("----------------")
print("Train:", train.shape)
print("Validation:", validation.shape)
print("Test:", test.shape)


# ============================================================
# Features
# ============================================================

features = [
    "temperature_2m_previous_day1",

    "latitude",
    "longitude",
    "elevation_m",

    "relative_humidity_2m",
    "pressure_msl",
    "wind_speed_10m",
    "wind_direction_10m",
    "cloud_cover",
    "precipitation",

    "hour",
    "day_of_year",
    "month",

    "hour_sin",
    "hour_cos",
    "day_sin",
    "day_cos",

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
]


TARGET = "temperature_residual"


# ============================================================
# Prepare X/y
# ============================================================

X_train = train[features]
y_train = train[TARGET]

X_val = validation[features]
y_val = validation[TARGET]

X_test = test[features]
y_test = test[TARGET]


# ============================================================
# XGBoost model
# ============================================================

model = XGBRegressor(
    n_estimators=600,
    max_depth=7,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,

    objective="reg:squarederror",

    random_state=42,
    n_jobs=-1,

    eval_metric="rmse",
    early_stopping_rounds=50,
)


# ============================================================
# Train
# ============================================================

print()
print("Training XGBoost...")

model.fit(
    X_train,
    y_train,

    eval_set=[
        (X_train, y_train),
        (X_val, y_val),
    ],

    verbose=False,
)


# ============================================================
# Predict residual
# ============================================================

val_pred_residual = model.predict(
    X_val
)

test_pred_residual = model.predict(
    X_test
)


# ============================================================
# Reconstruct corrected temperature
# ============================================================

validation["corrected_temperature"] = (
    validation["temperature_2m_previous_day1"]
    + val_pred_residual
)

test["corrected_temperature"] = (
    test["temperature_2m_previous_day1"]
    + test_pred_residual
)


# ============================================================
# Baseline forecast
# ============================================================

val_baseline = validation[
    "temperature_2m_previous_day1"
]

test_baseline = test[
    "temperature_2m_previous_day1"
]


# ============================================================
# Metrics
# ============================================================

def calculate_metrics(actual, predicted):

    mae = mean_absolute_error(
        actual,
        predicted
    )

    rmse = np.sqrt(
        mean_squared_error(
            actual,
            predicted
        )
    )

    bias = np.mean(
        predicted - actual
    )

    return mae, rmse, bias


# ============================================================
# Validation metrics
# ============================================================

val_baseline_mae, val_baseline_rmse, val_baseline_bias = (
    calculate_metrics(
        validation["temperature_2m"],
        val_baseline
    )
)

val_ml_mae, val_ml_rmse, val_ml_bias = (
    calculate_metrics(
        validation["temperature_2m"],
        validation["corrected_temperature"]
    )
)


# ============================================================
# Test metrics
# ============================================================

test_baseline_mae, test_baseline_rmse, test_baseline_bias = (
    calculate_metrics(
        test["temperature_2m"],
        test_baseline
    )
)

test_ml_mae, test_ml_rmse, test_ml_bias = (
    calculate_metrics(
        test["temperature_2m"],
        test["corrected_temperature"]
    )
)


# ============================================================
# Results
# ============================================================

print()
print("=" * 60)
print("VALIDATION RESULTS")
print("=" * 60)

print(
    f"Baseline MAE : {val_baseline_mae:.4f} °C"
)

print(
    f"ML MAE       : {val_ml_mae:.4f} °C"
)

print(
    f"Baseline RMSE: {val_baseline_rmse:.4f} °C"
)

print(
    f"ML RMSE      : {val_ml_rmse:.4f} °C"
)

print(
    f"Baseline Bias: {val_baseline_bias:.4f} °C"
)

print(
    f"ML Bias      : {val_ml_bias:.4f} °C"
)


print()
print("=" * 60)
print("TEST RESULTS")
print("=" * 60)

print(
    f"Baseline MAE : {test_baseline_mae:.4f} °C"
)

print(
    f"ML MAE       : {test_ml_mae:.4f} °C"
)

print(
    f"Baseline RMSE: {test_baseline_rmse:.4f} °C"
)

print(
    f"ML RMSE      : {test_ml_rmse:.4f} °C"
)

print(
    f"Baseline Bias: {test_baseline_bias:.4f} °C"
)

print(
    f"ML Bias      : {test_ml_bias:.4f} °C"
)


# ============================================================
# Improvement
# ============================================================

mae_improvement = (
    (test_baseline_mae - test_ml_mae)
    / test_baseline_mae
) * 100

rmse_improvement = (
    (test_baseline_rmse - test_ml_rmse)
    / test_baseline_rmse
) * 100


print()
print("=" * 60)
print("TEST IMPROVEMENT")
print("=" * 60)

print(
    f"MAE improvement : {mae_improvement:.2f}%"
)

print(
    f"RMSE improvement: {rmse_improvement:.2f}%"
)


# ============================================================
# Save model
# ============================================================

model.save_model(
    MODEL_FILE
)

print()
print("Model saved:")
print(MODEL_FILE)


# ============================================================
# Feature importance
# ============================================================

importance = pd.DataFrame({
    "feature": features,
    "importance": model.feature_importances_,
})

importance = importance.sort_values(
    "importance",
    ascending=False
)

print()
print("=" * 60)
print("TOP FEATURES")
print("=" * 60)

print(
    importance.head(15).to_string(
        index=False
    )
)

importance.to_csv(
    MODEL_DIR / "temperature_feature_importance.csv",
    index=False
)