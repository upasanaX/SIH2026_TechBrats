from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from .weather_service import WeatherService, WeatherServiceError


app = FastAPI(title="KrishiKavach Weather API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["*"],
)
service = WeatherService()


def service_error(exc: WeatherServiceError) -> HTTPException:
    message = str(exc)
    status = 404 if message.startswith("Unsupported LGD code") else 503
    return HTTPException(status_code=status, detail=message)


@app.get("/health")
def health() -> dict[str, object]:
    return {"status": "ok", "model_loaded": service.model is not None}


@app.get("/api/v1/panchayats")
def panchayats() -> list[dict[str, object]]:
    return list(service.panchayats.values())


@app.get("/api/v1/weather/downscaled")
def downscaled_weather(lgd_code: int = Query(..., description="Supported Panchayat LGD code")) -> dict[str, object]:
    try:
        return service.get_weather(lgd_code, apply_model=True)
    except WeatherServiceError as exc:
        raise service_error(exc) from exc
    except Exception as exc:
        raise HTTPException(status_code=503, detail="Unable to fetch live weather data") from exc


@app.get("/api/v1/weather/raw")
def raw_weather(lgd_code: int = Query(..., description="Supported Panchayat LGD code")) -> dict[str, object]:
    try:
        return service.get_weather(lgd_code, apply_model=False)
    except WeatherServiceError as exc:
        raise service_error(exc) from exc
    except Exception as exc:
        raise HTTPException(status_code=503, detail="Unable to fetch live weather data") from exc


@app.get("/api/v1/model/status")
def model_status() -> dict[str, object]:
    return service.model_status()


@app.get("/api/v1/model/metrics")
def model_metrics() -> dict[str, object]:
    return service.metrics()