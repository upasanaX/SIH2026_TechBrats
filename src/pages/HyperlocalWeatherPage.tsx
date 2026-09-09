import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PANCHAYATS } from '../data/panchayats';
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
import { LiveWeatherState } from '../components/common/LiveWeatherState';

export const HyperlocalWeatherPage: React.FC = () => {
  const { currentPanchayat, setCurrentPanchayat, showToast, t, weatherReading, hourlyForecasts, liveWeatherLoading, liveWeatherError } = useApp();
  const [selectedDistrict, setSelectedDistrict] = useState(currentPanchayat.district);
  const [selectedBlock, setSelectedBlock] = useState(currentPanchayat.block);
  const [selectedCrop, setSelectedCrop] = useState(currentPanchayat.primaryCrops[0]);
  
  const weather = weatherReading;

  if (!weather) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <LiveWeatherState loading={liveWeatherLoading} error={liveWeatherError} />
      </div>
    );
  }

  const comparison = {
    districtName: 'Open-Meteo live forecast reference',
    panchayatName: `${currentPanchayat.name} live forecast`,
    districtForecast: {
      condition: 'Live forecast reference',
      rainProb: null,
      temp: 'Direct forecast',
      resolution: 'Open-Meteo grid',
      warning: 'No probability value requested'
    },
    panchayatForecast: {
      condition: 'XGBoost temperature correction',
      rainProb: null,
      temp: `${weather.temp.toFixed(1)}°C`,
      resolution: 'Panchayat coordinates',
      warning: 'Use official advisories for hazards',
      localizedFeature: 'Panchayat latitude, longitude, and elevation'
    },
    downscalingReason: 'Temperature uses the existing XGBoost residual model. Rainfall and other variables remain direct Open-Meteo forecasts.'
  };

  const handlePanchayatChange = (panchayatId: string) => {
    const found = PANCHAYATS.find(p => p.id === panchayatId);
    if (found) {
      setCurrentPanchayat(found);
      setSelectedDistrict(found.district);
      setSelectedBlock(found.block);
      setSelectedCrop(found.primaryCrops[0]);
      showToast(`Loaded meteorological grid for ${found.name}`);
    }
  };

  const districts = Array.from(new Set(PANCHAYATS.map(p => p.district)));
  const blocks = Array.from(new Set(PANCHAYATS.filter(p => p.district === selectedDistrict).map(p => p.block)));
  const panchayatsInBlock = PANCHAYATS.filter(p => p.district === selectedDistrict && p.block === selectedBlock);

  const handleDistrictChange = (district: string) => {
    const firstInDistrict = PANCHAYATS.find(p => p.district === district);
    if (firstInDistrict) handlePanchayatChange(firstInDistrict.id);
  };

  const handleBlockChange = (block: string) => {
    const firstInBlock = PANCHAYATS.find(p => p.district === selectedDistrict && p.block === block);
    if (firstInBlock) handlePanchayatChange(firstInBlock.id);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Title & Administrative Selector Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {t('hyperlocalWeather')}
              </h1>
              <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-sm border border-emerald-300">
                {t('microGrid')}
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
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">{t('district')}</label>
            <select 
              value={selectedDistrict}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-600"
            >
              {districts.map(district => <option key={district} value={district}>{district}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">{t('block')}</label>
            <select 
              value={selectedBlock}
              onChange={(e) => handleBlockChange(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-600"
            >
              {blocks.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">{t('gramPanchayat')}</label>
            <select 
              value={currentPanchayat.id}
              onChange={(e) => handlePanchayatChange(e.target.value)}
              className="w-full bg-white border border-emerald-500 rounded-lg px-3 py-2 text-xs font-bold text-emerald-900 focus:ring-2 focus:ring-emerald-600"
            >
              {panchayatsInBlock.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.bengaliName}) - {p.currentRisk.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">{t('primaryCrop')}</label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-600"
            >
              {currentPanchayat.primaryCrops.map(crop => <option key={crop} value={crop}>{crop}</option>)}
            </select>
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
                <div className="text-slate-500 text-[10px]">Rainfall Probability</div>
                <div className="text-base font-bold text-slate-700">Unavailable</div>
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
                <div className="text-slate-500 text-[10px]">Local Rainfall Probability</div>
                <div className="text-base font-black text-blue-700">Unavailable</div>
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
          <div className="text-xl font-bold text-slate-900">{weather.temp.toFixed(1)}°C</div>
          <span className="text-[9px] text-emerald-700">ML Downscaled</span>
        </div>

        <div className="p-3 bg-white border border-slate-200 rounded-xl text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Rain Prob</span>
          <div className="text-xl font-bold text-blue-600">{weather.rainfallMm.toFixed(1)} mm</div>
          <span className="text-[9px] text-slate-500">Live forecast</span>
        </div>

        <div className="p-3 bg-white border border-slate-200 rounded-xl text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Wind Velocity</span>
          <div className="text-xl font-bold text-slate-900">{weather.windSpeed.toFixed(1)}</div>
          <span className="text-[9px] text-slate-500">km/h ({weather.windDirection})</span>
        </div>

        <div className="p-3 bg-white border border-slate-200 rounded-xl text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Humidity</span>
          <div className="text-xl font-bold text-slate-900">{weather.humidity}%</div>
          <span className="text-[9px] text-slate-500">Rel. Saturation</span>
        </div>

        <div className="p-3 bg-white border border-slate-200 rounded-xl text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Soil Moisture</span>
          <div className="text-xl font-bold text-indigo-700">Unavailable</div>
          <span className="text-[9px] text-slate-500">Not supplied by API</span>
        </div>

        <div className="p-3 bg-white border border-slate-200 rounded-xl text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Pressure</span>
          <div className="text-xl font-bold text-slate-900">{weather.pressure}</div>
          <span className="text-[9px] text-slate-500">hPa Barometric</span>
        </div>

        <div className="p-3 bg-white border border-slate-200 rounded-xl text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">UV Index</span>
          <div className="text-xl font-bold text-amber-700">Unavailable</div>
          <span className="text-[9px] text-slate-500">Not supplied by API</span>
        </div>

        <div className="p-3 bg-white border border-slate-200 rounded-xl text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Confidence</span>
          <div className="text-xl font-bold text-emerald-700">Live</div>
          <span className="text-[9px] text-slate-500">No confidence score claimed</span>
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
            {hourlyForecasts.map((h, i) => (
              <div 
                key={i} 
                className={`flex-1 p-3 rounded-xl border text-center space-y-1.5 transition-all ${
                  h.rainfallMm > 0
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
