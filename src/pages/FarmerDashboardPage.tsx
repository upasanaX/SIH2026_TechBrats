import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RiskBadge } from '../components/common/RiskBadge';
import { AlertDetailModal } from '../components/common/AlertDetailModal';
import { 
  Thermometer, 
  CloudRain, 
  Wind, 
  Droplets, 
  ShieldAlert, 
  Clock, 
  CheckSquare, 
  Square, 
  ArrowRight, 
  Volume2, 
  VolumeX, 
  MapPin, 
  Sparkles,
  Sprout,
  AlertTriangle,
  RefreshCw,
  ExternalLink
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
import { DisasterAlert } from '../types';
import { LiveWeatherState } from '../components/common/LiveWeatherState';

export const FarmerDashboardPage: React.FC = () => {
  const { 
    currentPanchayat, 
    alerts, 
    language, 
    t, 
    setActiveTab, 
    speakAdvisory, 
    isSpeaking, 
    stopSpeaking,
    showToast,
    weatherReading,
    hourlyForecasts,
    dailyForecasts,
    liveWeatherLoading,
    liveWeatherError
  } = useApp();

  const [activeAlertModal, setActiveAlertModal] = useState<DisasterAlert | null>(null);
  const [completedActions, setCompletedActions] = useState<Record<string, boolean>>({
    'act-1': false,
    'act-2': true,
    'act-3': false,
    'act-4': false
  });

  const weather = weatherReading;
  const panchayatAlerts = alerts.filter(a => a.primaryPanchayatId === currentPanchayat.id);

  if (!weather) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <LiveWeatherState loading={liveWeatherLoading} error={liveWeatherError} />
      </div>
    );
  }

  const toggleAction = (id: string) => {
    setCompletedActions(prev => {
      const updated = { ...prev, [id]: !prev[id] };
      showToast(updated[id] ? 'Action marked as completed.' : 'Action marked as pending.');
      return updated;
    });
  };

  const todayActions = [
    {
      id: 'act-1',
      title: 'Delay Canal Irrigation & Pumping',
      desc: 'Live Open-Meteo precipitation forecast indicates that irrigation decisions should be reviewed before pumping.',
      urgent: true,
      category: 'Irrigation'
    },
    {
      id: 'act-2',
      title: 'Secure Harvested Produce',
      desc: 'Cover open-air grain yards and bags with waterproof poly sheets before 09:00 PM.',
      urgent: true,
      category: 'Harvest Care'
    },
    {
      id: 'act-3',
      title: 'Avoid Nitrogen / Urea Top-Dressing',
      desc: 'Heavy runoff will wash unabsorbed granular fertilizer into peripheral water bodies.',
      urgent: false,
      category: 'Fertilizer'
    },
    {
      id: 'act-4',
      title: 'Open Field Bund Outlets in Aman Paddy',
      desc: 'Clear drainage corners to avoid submergence exceeding 5 cm above seedling root zone.',
      urgent: true,
      category: 'Field Drainage'
    }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Top Welcome & Sub-Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t('farmerRole')} • {currentPanchayat.name}
            </h1>
            <RiskBadge severity={currentPanchayat.currentRisk} size="md" />
          </div>
          <p className="text-xs text-slate-500">
            {currentPanchayat.block}, {currentPanchayat.district}, {currentPanchayat.state} • Elevation: {currentPanchayat.elevation}m MSL
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setActiveTab('weather')}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-semibold hover:bg-emerald-100 transition-colors"
          >
            <CloudRain className="w-3.5 h-3.5 text-emerald-600" />
            <span>Downscaled Weather Grid</span>
          </button>
        </div>
      </div>

      {/* TOP WEATHER SUMMARY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        {/* Temperature */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-medium">{t('temperature')}</span>
            <Thermometer className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{weather.temp.toFixed(1)}°C</div>
          <div className="text-[10px] text-emerald-700">ML Downscaled</div>
        </div>

        {/* Rain Probability */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-medium">{t('rainProbability')}</span>
            <CloudRain className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-700">{weather.rainfallMm.toFixed(1)} mm</div>
          <div className="text-[10px] text-slate-500">Live forecast</div>
        </div>

        {/* Wind Speed */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-medium">{t('windSpeed')}</span>
            <Wind className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{weather.windSpeed.toFixed(1)} <span className="text-xs font-normal">km/h</span></div>
          <div className="text-[10px] text-slate-400">{weather.windDirection}</div>
        </div>

        {/* Soil Moisture */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-medium">{t('soilMoisture')}</span>
            <Droplets className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-indigo-700">Unavailable</div>
          <div className="text-[10px] text-slate-500">Not supplied by API</div>
        </div>

        {/* Alert Status */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-medium">Alert Status</span>
            <ShieldAlert className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-lg font-bold text-red-700 truncate">
            {currentPanchayat.currentRisk.toUpperCase()}
          </div>
          <div className="text-[10px] text-red-600 font-medium">
            {panchayatAlerts.length} Warnings Active
          </div>
        </div>

        {/* Last Updated & Confidence */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-medium">Confidence</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">Live</div>
          <div className="text-[10px] text-slate-400 truncate">{weather.lastUpdated}</div>
        </div>

      </div>

      {/* CURRENT RISK BANNER */}
      <div className="p-5 bg-red-50 border-2 border-red-200 rounded-2xl shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-red-600 text-white rounded-xl shadow-xs shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <RiskBadge severity="high" size="sm" />
                <span className="text-xs font-bold text-red-800">
                  Time Window: Next 12 Hours (Tonight to Tomorrow Morning)
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                Moderate-to-Heavy Rainfall Risk & Canal Surcharge in {currentPanchayat.name}
              </h2>
              <p className="text-xs text-slate-700 mt-0.5">
                Recommended Action: Suspend all open-field fertilizer applications immediately; verify field bund drainage gates.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (panchayatAlerts.length > 0) setActiveAlertModal(panchayatAlerts[0]);
              else setActiveTab('alerts');
            }}
            className="shrink-0 px-4 py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
          >
            Review Warning Checklist
          </button>
        </div>
      </div>

      {/* CHARTS SECTION: 7-DAY TREND + HOURLY PRECIPITATION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 7-Day Temperature & Rain Projection (Area Chart) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">7-Day Hyperlocal Weather Projection</h2>
              <p className="text-xs text-slate-500">Max/Min temperatures (°C) and rain probability percentage</p>
            </div>
            <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded-sm">
              Temperature: XGBoost local correction; other values are live forecast
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyForecasts} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#15803d" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#15803d" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px', border: 'none' }}
                />
                <Area type="monotone" dataKey="maxTemp" stroke="#15803d" strokeWidth={2.5} fillOpacity={1} fill="url(#colorTemp)" name="Max Temp (°C)" />
                <Area type="monotone" dataKey="rainProb" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorRain)" name="Rain Prob (%)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-7 gap-1 pt-2 border-t border-slate-100 text-center">
            {dailyForecasts.map((d, i) => (
              <div key={i} className="p-1.5 rounded-lg bg-slate-50 text-[10px]">
                <div className="font-bold text-slate-800">{d.day.slice(0, 3)}</div>
                <div className="text-slate-500 font-mono mt-0.5">{d.maxTemp}° / {d.minTemp}°</div>
                <div className="text-blue-600 font-bold mt-0.5">{d.rainProb}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* 24-Hour Precipitation Forecast (Bar Chart) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Hourly Rain Accumulation</h2>
              <p className="text-xs text-slate-500">Predicted precipitation in millimeters (mm)</p>
            </div>
            <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-sm">
              Peak: 11 PM - 01 AM
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyForecasts.slice(0, 8)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px', border: 'none' }}
                />
                <Bar dataKey="rainfallMm" fill="#2563eb" radius={[4, 4, 0, 0]} name="Rainfall (mm)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 leading-snug">
            <strong>Hydrological Note:</strong> Use the live precipitation forecast alongside local drainage conditions and official advisories.
          </div>
        </div>

      </div>

      {/* SECTION: "WHAT SHOULD I DO NOW?" ACTION CARDS */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {t('whatToDoNow')}
              </h2>
              <p className="text-xs text-slate-500">
                Actionable crop defense guidelines generated for {currentPanchayat.primaryCrops[0]}
              </p>
            </div>
          </div>

          <button
            onClick={() => speakAdvisory(
              `Today's KrishiKavach advisory for ${currentPanchayat.name}: Review irrigation before pumping because the live forecast reports ${weather.rainfallMm.toFixed(1)} millimeters of precipitation. Secure harvested produce with poly sheets.`,
              language
            )}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors"
          >
            <Volume2 className="w-4 h-4 text-emerald-700" />
            <span>{t('listenAdvisory')}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {todayActions.map((act) => {
            const isDone = !!completedActions[act.id];
            return (
              <div
                key={act.id}
                onClick={() => toggleAction(act.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  isDone 
                    ? 'bg-emerald-50/60 border-emerald-300 opacity-70' 
                    : 'bg-slate-50/80 border-slate-200 hover:border-emerald-400 hover:bg-white'
                }`}
              >
                <button className="mt-0.5 shrink-0 text-emerald-700">
                  {isDone ? (
                    <CheckSquare className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-400" />
                  )}
                </button>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-bold ${isDone ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                      {act.title}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-sm bg-white border border-slate-200 text-slate-600">
                      {act.category}
                    </span>
                    {act.urgent && !isDone && (
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 bg-red-100 text-red-700 rounded-xs">
                        Urgent
                      </span>
                    )}
                  </div>
                  <p className={`text-xs leading-relaxed ${isDone ? 'line-through text-slate-400' : 'text-slate-600'}`}>
                    {act.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* LOWER SECTION: ACTIVE DISASTER ALERTS + MARKETPLACE SNAPSHOT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Active Alerts in Current Panchayat */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-600" />
              <h2 className="text-sm font-bold text-slate-900">Active Panchayat Warnings</h2>
            </div>
            <button
              onClick={() => setActiveTab('alerts')}
              className="text-xs font-bold text-emerald-700 hover:underline"
            >
              View All Disaster Alerts →
            </button>
          </div>

          <div className="space-y-3">
            {panchayatAlerts.map(alert => (
              <div 
                key={alert.id}
                onClick={() => setActiveAlertModal(alert)}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-red-400 transition-all cursor-pointer space-y-2"
              >
                <div className="flex items-center justify-between">
                  <RiskBadge severity={alert.severity} size="sm" />
                  <span className="text-[11px] font-mono text-slate-500">{alert.timeWindow}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{alert.title}</h4>
                <p className="text-xs text-slate-600 line-clamp-2">{alert.summary}</p>
                <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 pt-1">
                  <span>Open detailed checklist</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            ))}

            {panchayatAlerts.length === 0 && (
              <div className="py-8 text-center text-slate-500 text-xs">
                No active severe disaster alerts in {currentPanchayat.name}. Normal conditions prevail.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Alert Detail Modal */}
      <AlertDetailModal 
        alert={activeAlertModal} 
        onClose={() => setActiveAlertModal(null)}
      />

    </div>
  );
};
