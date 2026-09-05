import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PANCHAYATS } from '../data/panchayats';
import { PANCHAYAT_WEATHER } from '../data/weatherData';
import { Panchayat, AlertSeverity } from '../types';
import { RiskBadge } from '../components/common/RiskBadge';
import { 
  MapPin, 
  Layers, 
  ShieldAlert, 
  CloudRain, 
  Building2, 
  Store, 
  Truck, 
  Search, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  Users,
  Compass,
  ArrowRight,
  Eye,
  Info
} from 'lucide-react';

export const FarmMapPage: React.FC = () => {
  const { currentPanchayat, setCurrentPanchayat, alerts, setActiveTab, showToast } = useApp();
  const [selectedMapPanchayat, setSelectedMapPanchayat] = useState<Panchayat>(currentPanchayat);
  
  // Layer Toggles
  const [showBoundaries, setShowBoundaries] = useState(true);
  const [showRiskOverlay, setShowRiskOverlay] = useState(true);
  const [showRainRadar, setShowRainRadar] = useState(true);
  const [showAlertPins, setShowAlertPins] = useState(true);
  const [showFPOs, setShowFPOs] = useState(true);
  const [showMarkets, setShowMarkets] = useState(true);

  const [zoomLevel, setZoomLevel] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const weather = PANCHAYAT_WEATHER[selectedMapPanchayat.id] || PANCHAYAT_WEATHER['panchayat-bhangar-1'];
  const activeAlertsForPanchayat = alerts.filter(a => a.primaryPanchayatId === selectedMapPanchayat.id);

  const handleSelectPanchayat = (p: Panchayat) => {
    setSelectedMapPanchayat(p);
    setCurrentPanchayat(p);
    showToast(`Focused map on ${p.name} Panchayat`);
  };

  const mapPanchayats = PANCHAYATS.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.block.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // SVG coordinates simulation mapping lat/lng to viewport (21.5 - 23.5 lat, 87.0 - 89.0 lng)
  const getCoordinatesPosition = (lat: number, lng: number) => {
    const minLat = 21.5;
    const maxLat = 23.5;
    const minLng = 87.2;
    const maxLng = 88.9;

    const xPercent = ((lng - minLng) / (maxLng - minLng)) * 80 + 10;
    const yPercent = (1 - (lat - minLat) / (maxLat - minLat)) * 75 + 12;
    return { x: `${xPercent}%`, y: `${yPercent}%` };
  };

  const riskColors: Record<AlertSeverity, string> = {
    critical: '#991b1b',
    high: '#dc2626',
    moderate: '#d97706',
    info: '#2563eb'
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Title Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Farm & Panchayat Geospatial Risk Map
            </h1>
            <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-sm border border-emerald-300">
              Interactive GIS
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Topographic boundaries, convective radar intensity layers, alert pins, FPOs, and collection hubs
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search Panchayat or Block on map..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white"
          />
        </div>
      </div>

      {/* MAP & SIDEBAR CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Map Viewport (8 Cols) */}
        <div className="lg:col-span-8 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl relative min-h-[560px] flex flex-col">
          
          {/* Map Controls Header */}
          <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 bg-slate-900/90 backdrop-blur-md p-2 rounded-xl border border-slate-700/80 shadow-md">
            
            <button
              onClick={() => setShowRiskOverlay(!showRiskOverlay)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                showRiskOverlay ? 'bg-red-600/30 text-red-300 border border-red-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Risk Heatmap</span>
            </button>

            <button
              onClick={() => setShowRainRadar(!showRainRadar)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                showRainRadar ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              <CloudRain className="w-3.5 h-3.5" />
              <span>Rain Radar</span>
            </button>

            <button
              onClick={() => setShowFPOs(!showFPOs)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                showFPOs ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>FPOs</span>
            </button>

            <button
              onClick={() => setShowMarkets(!showMarkets)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                showMarkets ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Mandi Hubs</span>
            </button>
          </div>

          {/* Zoom and Reset Controls */}
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700 shadow-md">
            <button
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2))}
              className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.75))}
              className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 text-[10px] font-bold"
              title="Reset Zoom"
            >
              1x
            </button>
          </div>

          {/* Interactive Geospatial Canvas Simulator */}
          <div 
            className="flex-1 w-full relative overflow-hidden flex items-center justify-center select-none"
            style={{ 
              background: 'radial-gradient(circle at 50% 50%, #0f172a 0%, #020617 100%)',
              cursor: 'grab'
            }}
          >
            {/* Background Grid Lines representing Micro-Grid */}
            <div 
              className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" 
            />

            {/* Simulated River Network / Ganges & Matla Estuary */}
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none opacity-40 transition-transform duration-300"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <path 
                d="M 120 0 Q 200 180 340 240 T 480 380 T 560 600" 
                fill="none" 
                stroke="#0284c7" 
                strokeWidth="7" 
                strokeLinecap="round"
              />
              <path 
                d="M 340 240 Q 420 280 510 320 T 680 440 T 780 600" 
                fill="none" 
                stroke="#0284c7" 
                strokeWidth="4" 
                strokeLinecap="round"
              />
            </svg>

            {/* Radar Intensity Sweep Animation */}
            {showRainRadar && (
              <div 
                className="absolute inset-0 pointer-events-none overflow-hidden"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                <div className="absolute top-[30%] left-[45%] w-96 h-96 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-500/20 bg-blue-500/5 animate-radar">
                  <div className="w-1/2 h-1/2 bg-gradient-to-br from-blue-500/30 to-transparent origin-bottom-right rounded-tl-full" />
                </div>
              </div>
            )}

            {/* Render Panchayat Nodes & Polygons */}
            <div 
              className="absolute inset-0 w-full h-full transition-transform duration-300"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              {mapPanchayats.map((p) => {
                const isSelected = p.id === selectedMapPanchayat.id;
                const pos = getCoordinatesPosition(p.coordinates.lat, p.coordinates.lng);
                const color = riskColors[p.currentRisk];

                return (
                  <div 
                    key={p.id}
                    onClick={() => handleSelectPanchayat(p)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
                    style={{ left: pos.x, top: pos.y }}
                  >
                    {/* Simulated Polygon Boundaries & Heatmap Area */}
                    {showRiskOverlay && (
                      <div 
                        className={`absolute -inset-10 rounded-full blur-md opacity-40 transition-all ${
                          isSelected ? 'opacity-80 scale-125 ring-2 ring-white' : ''
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    )}

                    {/* Panchayat Pin Marker */}
                    <div className={`relative flex items-center justify-center p-2 rounded-xl border shadow-lg transition-transform group-hover:scale-110 ${
                      isSelected 
                        ? 'bg-white text-slate-950 border-white ring-4 ring-emerald-500/50 scale-110' 
                        : 'bg-slate-900/90 text-white border-slate-700'
                    }`}>
                      <MapPin className={`w-4 h-4 ${isSelected ? 'text-emerald-700' : 'text-slate-300'}`} />
                      
                      {/* Pulse ring for critical/high alerts */}
                      {(p.currentRisk === 'critical' || p.currentRisk === 'high') && showAlertPins && (
                        <span 
                          className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-ping"
                          style={{ backgroundColor: color }}
                        />
                      )}
                    </div>

                    {/* Pin Label Tooltip */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2.5 py-1 bg-slate-900/95 text-white text-[11px] rounded-md whitespace-nowrap border border-slate-700 font-bold shadow-md pointer-events-none">
                      {p.name}
                      <span className="block text-[9px] font-normal text-slate-400">{p.block}</span>
                    </div>

                    {/* Nearby FPO Pin if enabled */}
                    {showFPOs && (
                      <div 
                        className="absolute -top-6 -right-6 p-1 bg-emerald-700 text-white rounded-md border border-emerald-400 text-[9px] font-bold shadow-xs flex items-center gap-0.5"
                        title={p.fpoPartner}
                      >
                        <Building2 className="w-2.5 h-2.5" />
                        <span>FPO</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>

          {/* Bottom Map Legend */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 text-xs text-slate-300 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-[11px] font-bold uppercase text-slate-400">Risk Color Scale:</span>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-red-800 inline-block" />
                <span className="text-[11px]">Critical Surge</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-red-600 inline-block" />
                <span className="text-[11px]">High Inundation</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-amber-600 inline-block" />
                <span className="text-[11px]">Moderate Squall</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" />
                <span className="text-[11px]">Advisory / Low</span>
              </div>
            </div>

            <div className="text-[10px] text-slate-400">
              Click any pin to inspect Panchayat details
            </div>
          </div>

        </div>

        {/* Side Detail Panel (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900">{selectedMapPanchayat.name}</h2>
                <RiskBadge severity={selectedMapPanchayat.currentRisk} size="sm" />
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {selectedMapPanchayat.bengaliName} • {selectedMapPanchayat.block}, {selectedMapPanchayat.district}
              </p>
            </div>
          </div>

          {/* Current Localized Readings */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-[10px] text-slate-500 font-medium">Temperature</div>
              <div className="text-base font-bold text-slate-900 mt-0.5">{weather.temp}°C</div>
              <div className="text-[10px] text-slate-400">Feels {weather.feelsLike}°C</div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-[10px] text-slate-500 font-medium">Rainfall Projected</div>
              <div className="text-base font-bold text-blue-700 mt-0.5">{weather.rainProbability}%</div>
              <div className="text-[10px] text-slate-400">{weather.rainfallMm} mm accumulation</div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-[10px] text-slate-500 font-medium">Registered Farmers</div>
              <div className="text-base font-bold text-slate-900 mt-0.5">{selectedMapPanchayat.registeredFarmers}</div>
              <div className="text-[10px] text-emerald-700 font-medium">100% In System</div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-[10px] text-slate-500 font-medium">Elevation MSL</div>
              <div className="text-base font-bold text-slate-900 mt-0.5">{selectedMapPanchayat.elevation} m</div>
              <div className="text-[10px] text-slate-400">Lowland catchment</div>
            </div>
          </div>

          {/* Active Alerts for this Panchayat */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Hazard Bulletins ({activeAlertsForPanchayat.length})
            </h4>

            {activeAlertsForPanchayat.map(a => (
              <div key={a.id} className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-1 text-xs">
                <div className="font-bold text-red-900">{a.title}</div>
                <p className="text-[11px] text-red-800 leading-snug">{a.summary}</p>
                <div className="text-[10px] text-slate-500 pt-1 font-mono">{a.timeWindow}</div>
              </div>
            ))}

            {activeAlertsForPanchayat.length === 0 && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 text-center">
                No active severe warnings. Normal crop monitoring active.
              </div>
            )}
          </div>

          {/* FPO Partner & Logistics */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-emerald-950">
              <Building2 className="w-4 h-4 text-emerald-700" />
              <span>Assigned FPO Cooperative</span>
            </div>
            <p className="text-slate-700 font-medium">
              {selectedMapPanchayat.fpoPartner}
            </p>
            <div className="text-[11px] text-slate-500 pt-1">
              Provides cold storage aggregation and direct marketplace pickup services.
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2 pt-2">
            <button
              onClick={() => setActiveTab('weather')}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>View Full Downscaled Weather Grid</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setActiveTab('advisory')}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <span>View Crop Advisory for this Panchayat</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
