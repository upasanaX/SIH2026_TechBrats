import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AUTH_COPY } from '../../utils/authTranslations';
import { 
  Building, 
  ShieldAlert, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  KeyRound, 
  Lock, 
  FileCheck,
  Radio,
  Landmark,
  BadgeCheck
} from 'lucide-react';

interface GovernmentLoginPageProps {
  onSwitchPortal?: (role: 'farmer' | 'consumer' | 'fpo' | 'government') => void;
}

export const GovernmentLoginPage: React.FC<GovernmentLoginPageProps> = ({ onSwitchPortal }) => {
  const { login, setActiveTab, showToast, language } = useApp();
  const copy = AUTH_COPY[language].government;

  const [officialEmail, setOfficialEmail] = useState('anil.sharma@imd.gov.in');
  const [employeeCode, setEmployeeCode] = useState('WB-AGRI-4092');
  const [securityPin, setSecurityPin] = useState('7702');
  const [department, setDepartment] = useState('Department of Agriculture & Agromet Directorate');
  const [districtJurisdiction, setDistrictJurisdiction] = useState('South 24 Parganas & Hooghly');
  const [is2FaVerified, setIs2FaVerified] = useState(false);

  const handleSimulate2Fa = () => {
    setIs2FaVerified(true);
    showToast('Govt e-Pramaan 2FA Authenticated via Digital Token');
  };

  const handleGovtLogin = (name: string, title: string) => {
    login({ id: 'government-demo', name, role: 'government', contact: officialEmail, location: districtJurisdiction, status: 'active', joinedAt: new Date().toISOString().slice(0, 10) });
    showToast(`Welcome ${name}! Authenticated as ${title}.`);
    setActiveTab('government');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleGovtLogin('Dr. Anil Sharma', 'Senior Agromet Officer');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Official Government Header Banner */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700/80 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-200 text-xs font-bold">
              <Landmark className="w-3.5 h-3.5 text-amber-300" />
              <span>{copy.badge}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-300 px-2 py-0.5 rounded-sm border border-slate-700">
              Security Clearance: Tier-3
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="max-w-xl space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {copy.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {copy.description}
              </p>
            </div>

            <div className="flex items-center gap-3 bg-white/5 p-3.5 rounded-2xl border border-white/10 shrink-0">
              <ShieldAlert className="w-8 h-8 text-amber-400" />
              <div>
                <div className="text-sm font-black text-white">District Command</div>
                <div className="text-[11px] text-slate-300">NDMA & IMD Integrated</div>
              </div>
            </div>
          </div>

          {/* 1-Click Fast Evaluator Personas */}
          <div className="pt-4 border-t border-slate-800">
            <div className="text-[11px] uppercase tracking-wider font-bold text-amber-300 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>1-Click Fast Evaluator Government Personas</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleGovtLogin('Dr. Anil Sharma', 'District Agromet Officer (IMD / Agriculture)')}
                className="p-3 bg-slate-900/90 hover:bg-slate-800 border border-blue-600/50 rounded-2xl text-left transition-all group flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-sm text-white group-hover:text-blue-300">Dr. Anil Sharma (Agromet Directorate)</div>
                  <div className="text-xs text-slate-300">South 24 Parganas Jurisdiction • 6 Active Monitoring Panchayats</div>
                </div>
                <ArrowRight className="w-4 h-4 text-blue-300 group-hover:translate-x-1 transition-transform shrink-0 ml-2" />
              </button>

              <button
                type="button"
                onClick={() => handleGovtLogin('Smt. Kalyani Das', 'ADM - Disaster Management Directorate')}
                className="p-3 bg-slate-900/90 hover:bg-slate-800 border border-blue-600/50 rounded-2xl text-left transition-all group flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-sm text-white group-hover:text-blue-300">Smt. Kalyani Das (Disaster Management)</div>
                  <div className="text-xs text-slate-300">Coastal Inundation & Cyclone Alert Siren Authority</div>
                </div>
                <ArrowRight className="w-4 h-4 text-blue-300 group-hover:translate-x-1 transition-transform shrink-0 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        
        <div className="flex border-b border-slate-200 pb-3 justify-between items-center">
          <div className="flex items-center gap-2">
            <BadgeCheck className="w-5 h-5 text-blue-700" />
            <span className="text-sm font-black text-slate-900">National e-Gov SSO Authentication</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-blue-900 font-semibold bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
            <Lock className="w-3.5 h-3.5 text-blue-700" />
            <span>NIC Certificate Encrypted (256-bit)</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 max-w-xl mx-auto">
          
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              {copy.email} (@gov.in / @nic.in) *
            </label>
            <input
              type="email"
              value={officialEmail}
              onChange={(e) => setOfficialEmail(e.target.value)}
              placeholder="officer.name@nic.in"
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                {copy.employee} *
              </label>
              <input
                type="text"
                value={employeeCode}
                onChange={(e) => setEmployeeCode(e.target.value)}
                placeholder="WB-AGRI-4092"
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                {copy.pin}
              </label>
              <input
                type="password"
                value={securityPin}
                onChange={(e) => setSecurityPin(e.target.value)}
                placeholder="••••"
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">{copy.department}</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
              >
                <option value="Department of Agriculture & Agromet Directorate">Agriculture & Agromet</option>
                <option value="State Disaster Management Authority (SDMA)">Disaster Management (SDMA)</option>
                <option value="IMD Regional Meteorological Centre Kolkata">IMD Regional Met Office</option>
                <option value="Panchayat & Rural Development Dept">Rural Development Dept</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">{copy.jurisdiction}</label>
              <input
                type="text"
                value={districtJurisdiction}
                onChange={(e) => setDistrictJurisdiction(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
              />
            </div>
          </div>

          {/* 2FA Token Verification Card */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <KeyRound className="w-5 h-5 text-blue-700 shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-900">National e-Pramaan Token Verification</div>
                <div className="text-[11px] text-slate-500">
                  {is2FaVerified ? 'Hardware key & OTP verified' : 'Click to simulate biometric token'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSimulate2Fa}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                is2FaVerified 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                  : 'bg-blue-700 text-white hover:bg-blue-800'
              }`}
            >
              {is2FaVerified ? 'Verified ✓' : 'Verify 2FA'}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
                  <span>{copy.continue}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Portal Switch Footer */}
        {onSwitchPortal && (
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <span>Looking for other stakeholder portals?</span>
            <div className="flex gap-2">
              <button onClick={() => onSwitchPortal('farmer')} className="text-emerald-700 hover:underline font-bold">
                Farmer Portal →
              </button>
              <span className="text-slate-300">•</span>
              <button onClick={() => onSwitchPortal('consumer')} className="text-amber-700 hover:underline font-bold">
                Consumer Portal →
              </button>
              <span className="text-slate-300">•</span>
              <button onClick={() => onSwitchPortal('fpo')} className="text-indigo-700 hover:underline font-bold">
                FPO Portal →
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
