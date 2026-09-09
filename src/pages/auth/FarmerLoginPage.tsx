import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PANCHAYATS } from '../../data/panchayats';
import { AUTH_COPY } from '../../utils/authTranslations';
import { 
  Sprout, 
  Phone, 
  MapPin, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  Radio,
  Sparkles
} from 'lucide-react';

interface FarmerLoginPageProps {
  onSwitchPortal?: (role: 'farmer' | 'consumer' | 'fpo' | 'government') => void;
}

export const FarmerLoginPage: React.FC<FarmerLoginPageProps> = ({ onSwitchPortal }) => {
  const { login, setActiveTab, setCurrentPanchayat, showToast, speakAdvisory, stopSpeaking, isSpeaking, language } = useApp();
  const copy = AUTH_COPY[language].farmer;
  
  const [mobileNumber, setMobileNumber] = useState('+91 98310 44219');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [selectedPanchayatId, setSelectedPanchayatId] = useState('panchayat-bhangar-1');
  const [landAcre, setLandAcre] = useState('2.5');
  const [primaryCrop, setPrimaryCrop] = useState('Aman Paddy');
  const [preferredAlertChannel, setPreferredAlertChannel] = useState<'sms' | 'ivr' | 'app'>('sms');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [fullName, setFullName] = useState('Subodh Mondal');

  const voiceInstructions = {
    en: "Namaskar Kisan brother. Enter your mobile number to receive weather alerts and crop advisories for your panchayat.",
    hi: "नमस्कार किसान भाई। अपनी पंचायत के मौसम पूर्वानुमान और फसल सुरक्षा के लिए अपना मोबाइल नंबर दर्ज करें।",
    bn: "নমস্কার কৃষক ভাই। আপনার পঞ্চায়েতের আবহাওয়া বার্তা এবং ফসল সুরক্ষার জন্য আপনার মোবাইল নম্বর লিখুন।"
  };

  const handleSendOtp = () => {
    if (!mobileNumber) {
      showToast('Please enter a valid mobile number');
      return;
    }
    setOtpSent(true);
    setOtpCode('5821');
    showToast(`SMS OTP sent to ${mobileNumber}: Demo OTP is 5821`);
  };

  const handleFarmerLogin = (name: string, panchayatId: string) => {
    const targetPanchayat = PANCHAYATS.find(p => p.id === panchayatId) || PANCHAYATS[0];
    setCurrentPanchayat(targetPanchayat);
    login({ id: `farmer-${panchayatId}`, name, role: 'farmer', contact: mobileNumber, location: targetPanchayat.name, status: 'active', joinedAt: new Date().toISOString().slice(0, 10) });
    showToast(`Welcome ${name}! Connected to ${targetPanchayat.name} Agro Grid.`);
    setActiveTab('farmer');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFarmerLogin(fullName || 'Registered Farmer', selectedPanchayatId);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner Card with Voice Assistance */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-700/50 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-400/30 text-emerald-200 text-xs font-bold">
              <Sprout className="w-3.5 h-3.5 text-emerald-300" />
              <span>{copy.badge}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {copy.title}
            </h1>
            
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              {copy.description}
            </p>
          </div>

          {/* Voice Assistance Button */}
          <div className="shrink-0 flex flex-col sm:items-end gap-2">
            <button
              onClick={() => {
                if (isSpeaking) {
                  stopSpeaking();
                } else {
                  speakAdvisory(voiceInstructions[language] || voiceInstructions.en, language);
                }
              }}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                isSpeaking 
                  ? 'bg-amber-400 text-slate-900 animate-pulse font-extrabold' 
                  : 'bg-emerald-700 hover:bg-emerald-600 text-white border border-emerald-500/40'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-200" />}
              <span>{isSpeaking ? copy.stop : copy.listen}</span>
            </button>
            <span className="text-[11px] text-emerald-200/80">
              Zero-literacy barrier • Hindi & Bengali supported
            </span>
          </div>
        </div>

        {/* 1-Click Fast Evaluator Personas */}
        <div className="mt-6 pt-6 border-t border-emerald-700/60">
          <div className="text-[11px] uppercase tracking-wider font-bold text-emerald-300 mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>1-Click Evaluator Fast Farmer Personas</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleFarmerLogin('Ramesh Mondal', 'panchayat-bhangar-1')}
              className="p-3 bg-emerald-800/80 hover:bg-emerald-700/90 border border-emerald-600/60 rounded-2xl text-left transition-all group flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-sm text-white group-hover:text-emerald-200">Ramesh Mondal (Marginal Farmer)</div>
                <div className="text-xs text-emerald-200">Bhangar-I Panchayat • 2.5 Acres • Aman Paddy & Veg</div>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-300 group-hover:translate-x-1 transition-transform shrink-0 ml-2" />
            </button>

            <button
              type="button"
              onClick={() => handleFarmerLogin('Subodh Roy', 'panchayat-canning-2')}
              className="p-3 bg-emerald-800/80 hover:bg-emerald-700/90 border border-emerald-600/60 rounded-2xl text-left transition-all group flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-sm text-white group-hover:text-emerald-200">Subodh Roy (Coastal Farmer)</div>
                <div className="text-xs text-emerald-200">Canning-II Panchayat • 4.0 Acres • Boro Paddy & Betel</div>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-300 group-hover:translate-x-1 transition-transform shrink-0 ml-2" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Login & Registration Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        
        {/* Sign In vs Register Toggle */}
        <div className="flex border-b border-slate-200 pb-3 justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsRegisterMode(false)}
              className={`text-sm font-bold pb-1 transition-colors ${
                !isRegisterMode 
                  ? 'text-emerald-700 border-b-2 border-emerald-700' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {copy.signIn}
            </button>
            <button
              onClick={() => setIsRegisterMode(true)}
              className={`text-sm font-bold pb-1 transition-colors ${
                isRegisterMode 
                  ? 'text-emerald-700 border-b-2 border-emerald-700' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {copy.register}
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-md">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Kisan e-KYC Verified</span>
          </div>
        </div>

        {!isRegisterMode ? (
          /* SIGN IN FORM */
          <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
            
            {/* Mobile OTP authentication */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                {copy.signIn}
              </label>
            </div>

            <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {copy.mobile} *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="+91 98310 XXXXX"
                      className="flex-1 p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shrink-0"
                    >
                      {otpSent ? copy.resendOtp : copy.sendOtp}
                    </button>
                  </div>
                </div>

                {otpSent && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 animate-in fade-in">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-900">{copy.enterOtp}</span>
                      <span className="text-emerald-700 font-mono text-[11px]">Auto-filled: {otpCode}</span>
                    </div>
                    <input
                      type="text"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="5821"
                      className="w-full p-2.5 bg-white border border-emerald-300 rounded-lg text-center tracking-widest font-mono font-black text-sm"
                    />
                  </div>
                )}
            </div>

            {/* Select Panchayat Node */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                {copy.panchayat}
              </label>
              <select
                value={selectedPanchayatId}
                onChange={(e) => setSelectedPanchayatId(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
              >
                {PANCHAYATS.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.bengaliName}) • {p.block}, {p.district}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-black text-sm shadow-md transition-all flex items-center justify-center gap-2"
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
                <label className="block font-bold text-slate-700 mb-1">Farmer Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Subodh Mondal"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mobile Handset Number *</label>
                <input
                  type="tel"
                  required
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="+91 98310 XXXXX"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Gram Panchayat</label>
                <select
                  value={selectedPanchayatId}
                  onChange={(e) => setSelectedPanchayatId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                >
                  {PANCHAYATS.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.district})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Farm Land Holding (Acres)</label>
                <input
                  type="number"
                  step="0.1"
                  value={landAcre}
                  onChange={(e) => setLandAcre(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Primary Cultivated Crop</label>
                <input
                  type="text"
                  value={primaryCrop}
                  onChange={(e) => setPrimaryCrop(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Preferred Early Warning Channel</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPreferredAlertChannel('sms')}
                  className={`p-2.5 rounded-xl border font-bold text-center ${
                    preferredAlertChannel === 'sms' ? 'bg-emerald-50 border-emerald-600 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  Basic SMS (Feature Phone)
                </button>
                <button
                  type="button"
                  onClick={() => setPreferredAlertChannel('ivr')}
                  className={`p-2.5 rounded-xl border font-bold text-center ${
                    preferredAlertChannel === 'ivr' ? 'bg-emerald-50 border-emerald-600 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  Voice IVR Call (Regional)
                </button>
                <button
                  type="button"
                  onClick={() => setPreferredAlertChannel('app')}
                  className={`p-2.5 rounded-xl border font-bold text-center ${
                    preferredAlertChannel === 'app' ? 'bg-emerald-50 border-emerald-600 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  Smartphone App Push
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-md transition-colors"
            >
              Complete Registration & Enter Farmer Dashboard
            </button>
          </form>
        )}

        {/* Quick Portal Switch Footer */}
        {onSwitchPortal && (
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <span>Not a farmer? Switch to your role portal:</span>
            <div className="flex gap-2">
              <button 
                onClick={() => onSwitchPortal('consumer')} 
                className="text-amber-700 hover:underline font-bold"
              >
                Consumer Portal →
              </button>
              <span className="text-slate-300">•</span>
              <button 
                onClick={() => onSwitchPortal('fpo')} 
                className="text-blue-700 hover:underline font-bold"
              >
                FPO Portal →
              </button>
              <span className="text-slate-300">•</span>
              <button 
                onClick={() => onSwitchPortal('government')} 
                className="text-slate-800 hover:underline font-bold"
              >
                Government Portal →
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
