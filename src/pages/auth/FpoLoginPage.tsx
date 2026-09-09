import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AUTH_COPY } from '../../utils/authTranslations';
import { 
  Building2, 
  Users, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Truck, 
  FileText, 
  Briefcase,
  Radio,
  BarChart3
} from 'lucide-react';

interface FpoLoginPageProps {
  onSwitchPortal?: (role: 'farmer' | 'consumer' | 'fpo' | 'government') => void;
}

export const FpoLoginPage: React.FC<FpoLoginPageProps> = ({ onSwitchPortal }) => {
  const { login, setActiveTab, showToast } = useApp();
  const { language } = useApp();
  const copy = AUTH_COPY[language].fpo;

  const [cinNumber, setCinNumber] = useState('U01100WB2021PTC245678');
  const [fpoName, setFpoName] = useState('Sundarban Organic Agro Producers Co.');
  const [officerPhone, setOfficerPhone] = useState('+91 94332 88190');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [leadDistrict, setLeadDistrict] = useState('South 24 Parganas');
  const [memberCount, setMemberCount] = useState('1850');
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const handleSendOtp = () => {
    setOtpSent(true);
    setOtpCode('8319');
    showToast(`FPO Coordinator OTP sent to registered phone: Demo code is 8319`);
  };

  const handleFpoLogin = (orgName: string, leader: string) => {
    login({ id: 'fpo-demo', name: leader, role: 'fpo', contact: officerPhone, location: leadDistrict, status: 'active', joinedAt: new Date().toISOString().slice(0, 10) });
    showToast(`Welcome ${leader}! Authenticated as FPO Management for ${orgName}.`);
    setActiveTab('government');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFpoLogin(fpoName, 'Authorized FPO Director');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-700/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-200 text-xs font-bold">
            <Building2 className="w-3.5 h-3.5 text-indigo-300" />
            <span>{copy.badge}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="max-w-xl space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {copy.title}
              </h1>
              <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed">
                {copy.description}
              </p>
            </div>

            <div className="flex items-center gap-3 bg-white/5 p-3.5 rounded-2xl border border-white/10 shrink-0">
              <Users className="w-8 h-8 text-indigo-300" />
              <div>
                <div className="text-sm font-black text-white">Member Aggregation</div>
                <div className="text-[11px] text-indigo-200">Member operations & marketplace data</div>
              </div>
            </div>
          </div>

          {/* 1-Click Fast Evaluator Personas */}
          <div className="pt-4 border-t border-indigo-800/60">
            <div className="text-[11px] uppercase tracking-wider font-bold text-indigo-300 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>1-Click Evaluator FPO Leader Personas</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleFpoLogin('Sundarban Organic Agro Producers Ltd.', 'Debashis Roy (FPO Chairman)')}
                className="p-3 bg-indigo-900/80 hover:bg-indigo-800/90 border border-indigo-600/50 rounded-2xl text-left transition-all group flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-sm text-white group-hover:text-indigo-200">Debashis Roy (Sundarban Organic FPO)</div>
                  <div className="text-xs text-indigo-200">Canning & Bhangar Clusters • 1,850 Member Farmers</div>
                </div>
                <ArrowRight className="w-4 h-4 text-indigo-300 group-hover:translate-x-1 transition-transform shrink-0 ml-2" />
              </button>

              <button
                type="button"
                onClick={() => handleFpoLogin('Hooghly Agri Producer Cooperative', 'Tanmay Paul (Lead Coordinator)')}
                className="p-3 bg-indigo-900/80 hover:bg-indigo-800/90 border border-indigo-600/50 rounded-2xl text-left transition-all group flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-sm text-white group-hover:text-indigo-200">Tanmay Paul (Hooghly Producer Co.)</div>
                  <div className="text-xs text-indigo-200">Singur Rural Hub • 2,100 Member Farmers • Potato & Mustard</div>
                </div>
                <ArrowRight className="w-4 h-4 text-indigo-300 group-hover:translate-x-1 transition-transform shrink-0 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        
        <div className="flex border-b border-slate-200 pb-3 justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsRegisterMode(false)}
              className={`text-sm font-bold pb-1 transition-colors ${
                !isRegisterMode ? 'text-indigo-700 border-b-2 border-indigo-700' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {copy.signIn}
            </button>
            <button
              onClick={() => setIsRegisterMode(true)}
              className={`text-sm font-bold pb-1 transition-colors ${
                isRegisterMode ? 'text-indigo-700 border-b-2 border-indigo-700' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {copy.register}
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-indigo-800 font-semibold bg-indigo-50 px-2.5 py-1 rounded-md">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SFAC / NABARD Registered</span>
          </div>
        </div>

        {!isRegisterMode ? (
          /* SIGN IN FORM */
          <form onSubmit={handleSubmit} className="space-y-5 max-w-xl mx-auto">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                {copy.cin} *
              </label>
              <input
                type="text"
                value={cinNumber}
                onChange={(e) => setCinNumber(e.target.value)}
                placeholder="e.g. U01100WB2021PTC245678"
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                {copy.phone} *
              </label>
              <div className="flex gap-2">
                <input
                  type="tel"
                  value={officerPhone}
                  onChange={(e) => setOfficerPhone(e.target.value)}
                  placeholder="+91 94332 XXXXX"
                  className="flex-1 p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900"
                />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shrink-0"
                >
                  {otpSent ? copy.resend : copy.sendOtp}
                </button>
              </div>
            </div>

            {otpSent && (
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-indigo-900">Enter Officer 2FA Code</span>
                  <span className="text-indigo-700 font-mono text-[11px]">Auto-filled: {otpCode}</span>
                </div>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="8319"
                  className="w-full p-2.5 bg-white border border-indigo-300 rounded-lg text-center tracking-widest font-mono font-black text-sm"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{copy.district}</label>
                <select
                  value={leadDistrict}
                  onChange={(e) => setLeadDistrict(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                >
                  <option value="South 24 Parganas">South 24 Parganas</option>
                  <option value="Hooghly">Hooghly</option>
                  <option value="North 24 Parganas">North 24 Parganas</option>
                  <option value="Purba Bardhaman">Purba Bardhaman</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{copy.members}</label>
                <input
                  type="text"
                  value={memberCount}
                  onChange={(e) => setMemberCount(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl font-black text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>{copy.continue}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* REGISTRATION FORM */
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">FPO Registered Name *</label>
                <input
                  type="text"
                  required
                  value={fpoName}
                  onChange={(e) => setFpoName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">CIN / Society Registration Number *</label>
                <input
                  type="text"
                  required
                  value={cinNumber}
                  onChange={(e) => setCinNumber(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Lead District</label>
                <input
                  type="text"
                  value={leadDistrict}
                  onChange={(e) => setLeadDistrict(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Active Member Farmers</label>
                <input
                  type="number"
                  value={memberCount}
                  onChange={(e) => setMemberCount(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Director Mobile</label>
                <input
                  type="tel"
                  value={officerPhone}
                  onChange={(e) => setOfficerPhone(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl font-bold shadow-md transition-colors"
            >
              Submit FPO Onboarding for Multi-Panchayat Access
            </button>
          </form>
        )}

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
              <button onClick={() => onSwitchPortal('government')} className="text-slate-800 hover:underline font-bold">
                Government Portal →
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
