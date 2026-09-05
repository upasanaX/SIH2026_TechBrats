import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PANCHAYATS } from '../data/panchayats';
import { 
  PANCHAYAT_WEATHER, 
  HOURLY_FORECASTS, 
  DAILY_FORECASTS, 
  DISTRICT_VS_PANCHAYAT_COMPARISONS 
} from '../data/weatherData';
import { RiskBadge } from '../components/common/RiskBadge';
import { 
  MapPin, 
  CloudRain, 
  Wind, 
  Compass, 
  Droplets, 
  Sun, 
  Layers, 
  Cpu, 
  AlertCircle, 
  Info, 
  CheckCircle2, 
  ArrowRight,
  TrendingDown,
  Clock,
  Database
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

export const HyperlocalWeatherPage: React.FC = () => {
  const { currentPanchayat, setCurrentPanchayat, showToast } = useApp();
  const [selectedBlock, setSelectedBlock] = useState(currentPanchayat.block);
  
  const weather = PANCHAYAT_WEATHER[currentPanchayat.id] || PANCHAYAT_WEATHER['panchayat-bhangar-1'];
  const comparison = DISTRICT_VS_PANCHAYAT_COMPARISONS[currentPanchayat.id] || DISTRICT_VS_PANCHAYAT_COMPARISONS['panchayat-bhangar-1'];

  const handlePanchayatChange = (panchayatId: string) => {
    const found = PANCHAYATS.find(p => p.id === panchayatId);
    if (found) {
      setCurrentPanchayat(found);
      setSelectedBlock(found.block);
      showToast(`Loaded meteorological grid for ${found.name}`);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Title & Administrative Selector Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Hyperlocal Downscaled Weather Intelligence
              </h1>
              <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-sm border border-emerald-300">
                2.5 km Micro-Grid
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              High-resolution numerical weather prediction downscaled for Panchayat contours and agricultural catchments
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <div>
              <span className="text-slate-500">Coordinates:</span>{' '}
              <strong className="text-slate-800">{currentPanchayat.coordinates.lat.toFixed(4)}°N, {currentPanchayat.coordinates.lng.toFixed(4)}°E</strong>
              <span className="text-slate-400 ml-2">| {currentPanchayat.elevation}m MSL</span>
            </div>
          </div>
        </div>

        {/* Dynamic Multi-Level Geographic Cascading Selectors */}
        <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">District</label>
            <select 
              disabled 
              className="w-full bg-slate-100 border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 cursor-not-allowed"
            >
              <option>{currentPanchayat.district} ({currentPanchayat.state})</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Block</label>
            <select 
              value={selectedBlock}
              onChange={(e) => setSelectedBlock(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-600"
            >
              {(Array.from(new Set(PANCHAYATS.map(p => p.block))) as string[]).map((b, idx) => (
                <option key={idx} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Gram Panchayat</label>
            <select 
              value={currentPanchayat.id}
              onChange={(e) => handlePanchayatChange(e.target.value)}
              className="w-full bg-white border border-emerald-500 rounded-lg px-3 py-2 text-xs font-bold text-emerald-900 focus:ring-2 focus:ring-emerald-600"
            >
              {PANCHAYATS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.bengaliName}) - {p.currentRisk.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Primary Crop Profile</label>
            <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 font-medium truncate">
              {currentPanchayat.primaryCrops.join(', ')}
            </div>
          </div>
        </div>
      </div>

      {/* CORE COMPARISON COMPONENT: DISTRICT-LEVEL VS KRISHIKAVACH DOWNSCALED */}
      <div className="bg-white rounded-2xl p-6 border-2 border-emerald-700/40 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-700 text-white rounded-lg">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Spatial Resolution Comparison: District Average vs KrishiKavach Micro-Grid
              </h2>
              <p className="text-xs text-slate-600">
                Demonstrating why macro forecasts miss localized agricultural threats
              </p>
            </div>
          </div>
          <span className="text-xs font-mono bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-bold">
            10x Spatial Precision
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          
          {/* District Level Macro View */}
          <div className="p-5 bg-slate-50 border border-slate-300 rounded-xl space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200">
              <span className="font-bold text-slate-500 uppercase">Conventional District Forecast</span>
              <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-sm font-mono text-[10px]">
                {comparison.districtForecast.resolution}
              </span>
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-600">{comparison.districtName}</div>
              <div className="text-xl font-bold text-slate-800 mt-1">{comparison.districtForecast.condition}</div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                <div className="text-slate-500 text-[10px]">Rain Probability</div>
                <div className="text-base font-bold text-slate-700">{comparison.districtForecast.rainProb}%</div>
              </div>
              <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                <div className="text-slate-500 text-[10px]">Expected Warning</div>
                <div className="text-xs font-semibold text-slate-600 truncate">{comparison.districtForecast.warning}</div>
              </div>
            </div>

            <p className="text-xs text-slate-500 italic leading-relaxed">
              *Macro model assumes uniform meteorological stability across 3,500 sq km, masking localized convective triggers.
            </p>
          </div>

          {/* KrishiKavach Downscaled View */}
          <div className="p-5 bg-emerald-50/60 border-2 border-emerald-600 rounded-xl space-y-3 shadow-xs">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-emerald-200">
              <div className="flex items-center gap-1.5 font-black text-emerald-900 uppercase">
                <Cpu className="w-4 h-4 text-emerald-700" />
                <span>KrishiKavach Downscaled Grid</span>
              </div>
              <span className="bg-emerald-700 text-white px-2 py-0.5 rounded-sm font-mono text-[10px] font-bold">
                {comparison.panchayatForecast.resolution}
              </span>
            </div>

            <div>
              <div className="text-xs font-bold text-emerald-800">{comparison.panchayatName}</div>
              <div className="text-xl font-black text-emerald-950 mt-1">{comparison.panchayatForecast.condition}</div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-white border border-emerald-300 rounded-lg">
                <div className="text-slate-500 text-[10px]">Local Rain Probability</div>
                <div className="text-base font-black text-blue-700">{comparison.panchayatForecast.rainProb}%</div>
              </div>
              <div className="p-2.5 bg-white border border-emerald-300 rounded-lg">
                <div className="text-slate-500 text-[10px]">Downscaled Hazard</div>
                <div className="text-xs font-bold text-red-700 truncate">{comparison.panchayatForecast.warning}</div>
              </div>
            </div>

            <p className="text-xs text-emerald-900 font-medium leading-relaxed">
              <strong>Downscaling Driver:</strong> {comparison.downscalingReason}
            </p>
          </div>

        </div>
      </div>

      {/* METEOROLOGICAL PARAMETERS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="p-3 bg-white border border-slate-200 rounded-xl text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Air Temp</span>
          <div className="text-xl font-bold text-slate-900">{weather.temp}°C</div>
          <span className="text-[9px] text-slate-500">Feels {weather.feelsLike}°C</span>
        </div>

        <div className="p-3 bg-white border border-slate-200 rounded-xl text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Rain Prob</span>
          <div className="text-xl font-bold text-blue-600">{weather.rainProbability}%</div>
          <span className="text-[9px] text-slate-500">{weather.rainfallMm} mm rate</span>
        </div>

        <div className="p-3 bg-white border border-slate-200 rounded-xl text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Wind Velocity</span>
          <div className="text-xl font-bold text-slate-900">{weather.windSpeed}</div>
          <span className="text-[9px] text-slate-500">km/h ({weather.windDirection})</span>
        </div>

        <div className="p-3 bg-white border border-slate-200 rounded-xl text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Humidity</span>
          <div className="text-xl font-bold text-slate-900">{weather.humidity}%</div>
          <span className="text-[9px] text-slate-500">Rel. Saturation</span>
        </div>

        <div className="p-3 bg-white border border-slate-200 rounded-xl text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Soil Moisture</span>
          <div className="text-xl font-bold text-indigo-700">{weather.soilMoisture}%</div>
          <span className="text-[9px] text-slate-500">Root zone 15cm</span>
        </div>

        <div className="p-3 bg-white border border-slate-200 rounded-xl text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Pressure</span>
          <div className="text-xl font-bold text-slate-900">{weather.pressure}</div>
          <span className="text-[9px] text-slate-500">hPa Barometric</span>
        </div>

        <div className="p-3 bg-white border border-slate-200 rounded-xl text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">UV Index</span>
          <div className="text-xl font-bold text-amber-700">{weather.uvIndex}</div>
          <span className="text-[9px] text-slate-500">Moderate solar</span>
        </div>

        <div className="p-3 bg-white border border-slate-200 rounded-xl text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Confidence</span>
          <div className="text-xl font-bold text-emerald-700">{weather.riskConfidence}%</div>
          <span className="text-[9px] text-slate-500">Cross-validated</span>
        </div>
      </div>

      {/* HOURLY METEOROLOGICAL SEQUENCE */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">24-Hour Micro-Step Forecast</h3>
            <p className="text-xs text-slate-500">Hourly trajectory of localized showers and wind vectors</p>
          </div>
          <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
            <Clock className="w-3.5 h-3.5" />
            {weather.validityPeriod}
          </span>
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="flex gap-3 min-w-[700px]">
            {HOURLY_FORECASTS.map((h, i) => (
              <div 
                key={i} 
                className={`flex-1 p-3 rounded-xl border text-center space-y-1.5 transition-all ${
                  h.rainProb > 70 
                    ? 'bg-blue-50/80 border-blue-300 shadow-2xs' 
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="text-xs font-bold text-slate-700">{h.time}</div>
                <div className="text-sm font-black text-slate-900">{h.temp}°C</div>
                <div className="text-xs font-bold text-blue-600">{h.rainProb}%</div>
                <div className="text-[10px] text-slate-500 font-mono">{h.rainfallMm} mm</div>
                <div className="text-[10px] text-slate-400 truncate">{h.condition}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER MET DATA SOURCE & DISCLAIMER */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-slate-400 shrink-0" />
          <span><strong>Data Sources:</strong> {weather.dataSource}</span>
        </div>
        <div className="italic">
          *Advisory Disclaimer: KrishiKavach forecasts are algorithmic decision-support tools and do not substitute official IMD/NDMA emergency directives.
        </div>
      </div>

    </div>
  );
};
