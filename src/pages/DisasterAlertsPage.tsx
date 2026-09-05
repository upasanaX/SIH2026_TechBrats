import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DISASTER_ALERTS } from '../data/alerts';
import { DisasterAlert, AlertSeverity, AlertType } from '../types';
import { RiskBadge } from '../components/common/RiskBadge';
import { AlertDetailModal } from '../components/common/AlertDetailModal';
import { SmsIvrSimulatorModal } from '../components/common/SmsIvrSimulatorModal';
import { 
  ShieldAlert, 
  Filter, 
  Search, 
  Clock, 
  MapPin, 
  Share2, 
  CheckCircle2, 
  Radio, 
  ArrowRight,
  AlertTriangle,
  Send,
  CloudRain,
  Flame,
  Wind,
  Droplets,
  CloudLightning
} from 'lucide-react';

export const DisasterAlertsPage: React.FC = () => {
  const { alerts, currentPanchayat, acknowledgeAlert, showToast } = useApp();
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [activeModalAlert, setActiveModalAlert] = useState<DisasterAlert | null>(null);
  const [isSmsSimulatorOpen, setIsSmsSimulatorOpen] = useState(false);
  const [simulatorMessage, setSimulatorMessage] = useState<string>('');

  const severityFilters: { id: string; label: string; count: number }[] = [
    { id: 'all', label: 'All Warnings', count: alerts.length },
    { id: 'critical', label: 'Critical', count: alerts.filter(a => a.severity === 'critical').length },
    { id: 'high', label: 'High Risk', count: alerts.filter(a => a.severity === 'high').length },
    { id: 'moderate', label: 'Moderate', count: alerts.filter(a => a.severity === 'moderate').length },
    { id: 'info', label: 'Informational', count: alerts.filter(a => a.severity === 'info').length }
  ];

  const typeFilters: { id: string; label: string; icon: any }[] = [
    { id: 'all', label: 'All Hazards', icon: ShieldAlert },
    { id: 'heavy_rain', label: 'Heavy Rain', icon: CloudRain },
    { id: 'flood_risk', label: 'Flood Surge', icon: Droplets },
    { id: 'hailstorm', label: 'Hailstorm', icon: CloudLightning },
    { id: 'heatwave', label: 'Heat Stress', icon: Flame },
    { id: 'strong_wind', label: 'High Wind', icon: Wind }
  ];

  const filteredAlerts = alerts.filter(alert => {
    if (selectedSeverity !== 'all' && alert.severity !== selectedSeverity) return false;
    if (selectedType !== 'all' && alert.type !== selectedType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        alert.title.toLowerCase().includes(q) ||
        alert.affectedPanchayats.some(p => p.toLowerCase().includes(q)) ||
        alert.affectedCrops.some(c => c.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleOpenSimulator = (alert: DisasterAlert) => {
    setSimulatorMessage(
      `[KrishiKavach ALERT: ${alert.severity.toUpperCase()}] ${alert.title}. Window: ${alert.timeWindow}. Checklist: ${alert.actionChecklist[0]}. Helplines: 1800-180-1551.`
    );
    setIsSmsSimulatorOpen(true);
  };

  const handleShare = (alert: DisasterAlert) => {
    const text = `KrishiKavach Localized Weather Warning for ${alert.affectedPanchayats.join(', ')}: ${alert.title}. Time: ${alert.timeWindow}. Action: ${alert.actionChecklist[0]}`;
    navigator.clipboard?.writeText?.(text);
    showToast('Alert text copied to clipboard. Ready to paste in WhatsApp/Telegram groups.');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Panchayat Disaster & Early Warning Center
            </h1>
            <span className="text-[10px] font-bold uppercase bg-red-100 text-red-800 px-2.5 py-0.5 rounded-sm border border-red-300">
              Live Radar Feeds
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated localized hazard sirens covering waterlogging, hailstorms, storm surges, and thermal shocks
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => {
              setSimulatorMessage('');
              setIsSmsSimulatorOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs"
          >
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            <span>Simulate SMS / IVR Broadcast</span>
          </button>
        </div>
      </div>

      {/* FILTERS TOOLBAR */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        
        {/* Search and Severity Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search by hazard, Panchayat or crop..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white"
            />
          </div>

          {/* Severity Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {severityFilters.map(sf => (
              <button
                key={sf.id}
                onClick={() => setSelectedSeverity(sf.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  selectedSeverity === sf.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{sf.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedSeverity === sf.id ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {sf.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Hazard Type Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 pb-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase mr-1 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Hazard Type:
          </span>
          {typeFilters.map(tf => {
            const Icon = tf.icon;
            return (
              <button
                key={tf.id}
                onClick={() => setSelectedType(tf.id)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors ${
                  selectedType === tf.id
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tf.label}</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* ALERTS TIMELINE & CARDS */}
      <div className="space-y-4">
        {filteredAlerts.map(alert => {
          const isPrimary = alert.primaryPanchayatId === currentPanchayat.id;

          return (
            <div 
              key={alert.id}
              className={`bg-white rounded-2xl border transition-all p-5 shadow-xs hover:shadow-md ${
                alert.severity === 'critical' ? 'border-red-600/60 ring-1 ring-red-600/20' :
                alert.severity === 'high' ? 'border-red-400/70' :
                alert.severity === 'moderate' ? 'border-amber-400/80' : 'border-blue-300'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                
                {/* Left Info */}
                <div className="space-y-2.5 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <RiskBadge severity={alert.severity} size="md" />
                    {isPrimary && (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 text-[10px] font-bold rounded-sm border border-emerald-300">
                        Affects Current Panchayat ({currentPanchayat.name})
                      </span>
                    )}
                    <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {alert.timeWindow}
                    </span>
                  </div>

                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    {alert.title}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    {alert.titleBengali} • {alert.titleHindi}
                  </p>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-4xl">
                    {alert.summary}
                  </p>

                  {/* Impacted Panchayats & Crops */}
                  <div className="flex items-center gap-4 text-xs flex-wrap pt-1">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold text-slate-700">Panchayats:</span>{' '}
                      {alert.affectedPanchayats.join(', ')}
                    </div>

                    <div className="text-slate-600">
                      <span className="font-semibold text-slate-700">Affected Crops:</span>{' '}
                      {alert.affectedCrops.join(', ')}
                    </div>

                    <div className="text-emerald-700 font-bold">
                      Confidence: {alert.confidence}%
                    </div>
                  </div>

                  {/* Action highlight */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                    <span className="font-bold text-slate-800 block">Top Priority Action:</span>
                    <span className="text-slate-700">{alert.actionChecklist[0]}</span>
                  </div>
                </div>

                {/* Right Interactive CTAs */}
                <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-2.5 shrink-0 pt-2 md:pt-0">
                  <button
                    onClick={() => setActiveModalAlert(alert)}
                    className="w-full sm:w-auto px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <span>View Full Checklist</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleOpenSimulator(alert)}
                    className="w-full sm:w-auto px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Radio className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Test SMS / IVR</span>
                  </button>

                  <button
                    onClick={() => handleShare(alert)}
                    className="w-full sm:w-auto px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1"
                  >
                    <Share2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Share</span>
                  </button>

                  {alert.isAcknowledged ? (
                    <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Acknowledged
                    </span>
                  ) : (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="text-[11px] text-slate-500 underline hover:text-slate-800 font-medium"
                    >
                      Mark Acknowledged
                    </button>
                  )}
                </div>

              </div>
            </div>
          );
        })}

        {filteredAlerts.length === 0 && (
          <div className="py-12 bg-white rounded-2xl border border-slate-200 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Warnings Match Selected Criteria</h3>
            <p className="text-xs text-slate-500">Try changing your severity or hazard type filters.</p>
          </div>
        )}
      </div>

      {/* Alert Detail Modal */}
      <AlertDetailModal 
        alert={activeModalAlert}
        onClose={() => setActiveModalAlert(null)}
        onOpenSimulator={() => {
          if (activeModalAlert) handleOpenSimulator(activeModalAlert);
          setActiveModalAlert(null);
        }}
      />

      {/* SMS/IVR Simulator Modal */}
      <SmsIvrSimulatorModal 
        isOpen={isSmsSimulatorOpen}
        onClose={() => setIsSmsSimulatorOpen(false)}
        customMessage={simulatorMessage}
      />

    </div>
  );
};
