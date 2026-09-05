import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Settings, 
  ShieldCheck, 
  MapPin, 
  Bell, 
  Lock, 
  Sliders, 
  Info, 
  CheckCircle2, 
  Award, 
  Database,
  ExternalLink
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { currentPanchayat, showToast } = useApp();
  const [rainThreshold, setRainThreshold] = useState<number>(30); // mm
  const [windThreshold, setWindThreshold] = useState<number>(40); // km/h
  const [gpsConsent, setGpsConsent] = useState<boolean>(true);
  const [smsOptIn, setSmsOptIn] = useState<boolean>(true);
  const [ivrOptIn, setIvrOptIn] = useState<boolean>(true);

  const handleSaveSettings = () => {
    showToast('Preferences and alert sensitivity thresholds successfully saved.');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      
      {/* Title */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-emerald-700" />
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Settings, Governance & Privacy Policy
          </h1>
        </div>
        <p className="text-xs text-slate-500">
          Configure localized hazard warning thresholds, GPS consent, and review official disclaimers
        </p>
      </div>

      {/* ALERT THRESHOLDS */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-5">
        <div className="space-y-1 pb-3 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Custom Alert Sensitivity Thresholds</h2>
          <p className="text-xs text-slate-500">Configure when automated SMS sirens should trigger for your farm</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          
          <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between font-bold text-slate-800">
              <span>Rainfall Hazard Trigger</span>
              <span className="text-emerald-700 font-mono text-sm">{rainThreshold} mm / 6h</span>
            </div>
            <input 
              type="range"
              min={10}
              max={80}
              step={5}
              value={rainThreshold}
              onChange={(e) => setRainThreshold(Number(e.target.value))}
              className="w-full accent-emerald-700"
            />
            <p className="text-[11px] text-slate-500">
              Alerts trigger when downscaled precipitation rate exceeds this accumulation level.
            </p>
          </div>

          <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between font-bold text-slate-800">
              <span>Wind Squall Trigger</span>
              <span className="text-teal-700 font-mono text-sm">{windThreshold} km/h</span>
            </div>
            <input 
              type="range"
              min={20}
              max={90}
              step={5}
              value={windThreshold}
              onChange={(e) => setWindThreshold(Number(e.target.value))}
              className="w-full accent-emerald-700"
            />
            <p className="text-[11px] text-slate-500">
              Protects banana, papaya, and trellis vegetables from storm detachment.
            </p>
          </div>

        </div>
      </div>

      {/* CONSENT & NOTIFICATION CHANNELS */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-5">
        <div className="space-y-1 pb-3 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Privacy, Consent & Dispatch Channels</h2>
          <p className="text-xs text-slate-500">Manage how KrishiKavach uses your coordinates and sends warnings</p>
        </div>

        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
            <div>
              <div className="font-bold text-slate-900">Panchayat & GPS Location Usage Consent</div>
              <div className="text-[11px] text-slate-500">Allows downscaling models to pinpoint weather cells strictly within 2.5km of your farm.</div>
            </div>
            <input 
              type="checkbox"
              checked={gpsConsent}
              onChange={(e) => setGpsConsent(e.target.checked)}
              className="w-4 h-4 accent-emerald-700"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
            <div>
              <div className="font-bold text-slate-900">Cellular SMS Emergency Broadcasts (Zero Data Required)</div>
              <div className="text-[11px] text-slate-500">Receive flash SMS text bulletins in your regional language.</div>
            </div>
            <input 
              type="checkbox"
              checked={smsOptIn}
              onChange={(e) => setSmsOptIn(e.target.checked)}
              className="w-4 h-4 accent-emerald-700"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
            <div>
              <div className="font-bold text-slate-900">Automated Regional IVR Voice Calls</div>
              <div className="text-[11px] text-slate-500">Outbound call siren for critical surge warnings and late-night flash floods.</div>
            </div>
            <input 
              type="checkbox"
              checked={ivrOptIn}
              onChange={(e) => setIvrOptIn(e.target.checked)}
              className="w-4 h-4 accent-emerald-700"
            />
          </label>
        </div>

        <button
          onClick={handleSaveSettings}
          className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
        >
          Save All Preferences
        </button>
      </div>

      {/* OFFICIAL ADVISORY & DATA SEPARATION DISCLAIMER */}
      <div className="bg-amber-50/70 rounded-3xl p-6 sm:p-8 border border-amber-200 space-y-3 text-xs text-amber-950">
        <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
          <ShieldCheck className="w-5 h-5 text-amber-700" />
          <span>Statutory Disclaimer & Data Integrity Disclosure</span>
        </div>
        
        <p className="leading-relaxed">
          <strong>1. Advisory Role:</strong> KrishiKavach provides algorithmic crop protection guidance and downscaled meteorological insights. It does not replace binding instructions issued by the India Meteorological Department (IMD), the National Disaster Management Authority (NDMA), or local District Magistrates.
        </p>

        <p className="leading-relaxed">
          <strong>2. Prototype & Mock Data Separation:</strong> For the purposes of this platform demonstration, all displayed readings, alerts, and marketplace transactions represent high-fidelity mock data operating locally in-browser without live external API dependencies.
        </p>

        <p className="leading-relaxed">
          <strong>3. Privacy Protection:</strong> No farmer telephone numbers or personal coordinates are shared with third-party advertising brokers. All direct marketplace interactions strictly connect verified growers with registered buyers.
        </p>
      </div>

      <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 text-center text-xs text-slate-500 space-y-1">
        <div className="font-bold text-slate-700">KrishiKavach (कृषिकवच / কৃষিকবচ) • Hyperlocal Agri-Weather Grid</div>
        <div>Engineered with React 19, TypeScript, Tailwind CSS, and Recharts</div>
      </div>

    </div>
  );
};
