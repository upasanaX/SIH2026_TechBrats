export interface PanchayatApiRecord {
  lgd_code: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation_m: number;
}

export interface LiveHourlyWeather {
  timestamp: string;
  raw_temperature_c: number;
  downscaled_temperature_c: number;
  ml_correction_c: number;
  precipitation_mm: number;
  humidity_percent: number;
  pressure_hpa: number;
  wind_speed_kmh: number;
  wind_direction_deg: number;
  cloud_cover_percent: number;
}

export interface LiveDailyWeather {
  date: string;
  raw_max_temperature_c: number;
  raw_min_temperature_c: number;
  precipitation_sum_mm: number;
  precipitation_probability_percent: number;
}

export interface LiveWeatherResponse {
  panchayat: PanchayatApiRecord;
  timestamp: string;
  temperature: {
    raw_c: number;
    ml_correction_c: number;
    downscaled_c: number;
    method: string;
  };
  rainfall: { precipitation_mm: number };
  humidity_percent: number;
  pressure_hpa: number;
  wind: { speed_kmh: number; direction_deg: number };
  cloud_cover_percent: number;
  hourly: LiveHourlyWeather[];
  daily: LiveDailyWeather[];
  sources: {
    weather: string;
    temperature_model: string;
    elevation: string;
    benchmark_note: string;
  };
}

const API_BASE = import.meta.env.VITE_WEATHER_API_BASE || 'http://localhost:8000';

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) {
    let detail = 'Unable to fetch live weather data.';
    try {
      const body = await response.json() as { detail?: string };
      if (body.detail) detail = body.detail;
    } catch {
      // Keep the user-facing error stable when the backend does not return JSON.
    }
    throw new Error(detail);
  }
  return response.json() as Promise<T>;
}

export const fetchPanchayats = () => getJson<PanchayatApiRecord[]>('/api/v1/panchayats');

export const fetchDownscaledWeather = (lgdCode: number) =>
  getJson<LiveWeatherResponse>(`/api/v1/weather/downscaled?lgd_code=${lgdCode}`);