import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AUTH_COPY } from '../../utils/authTranslations';
import { 
  Store, 
  ShoppingCart, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Heart,
  Truck,
  CheckCircle2,
  Tag
} from 'lucide-react';

interface ConsumerLoginPageProps {
  onSwitchPortal?: (role: 'farmer' | 'consumer' | 'fpo' | 'government') => void;
}

export const ConsumerLoginPage: React.FC<ConsumerLoginPageProps> = ({ onSwitchPortal }) => {
  const { login, setActiveTab, showToast } = useApp();
  const { language } = useApp();
  const copy = AUTH_COPY[language].consumer;

  const [authMethod, setAuthMethod] = useState<'mobile' | 'email'>('mobile');
  const [mobilePhone, setMobilePhone] = useState('+91 98765 43210');
  const [emailAddress, setEmailAddress] = useState('pooja.sen@kolkata-agro.in');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [deliveryCity, setDeliveryCity] = useState('Kolkata');
  const [pincode, setPincode] = useState('700091');
  const [buyerType, setBuyerType] = useState<'household' | 'restaurant'>('household');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [consumerName, setConsumerName] = useState('Pooja Sen');

  const handleSendOtp = () => {
    setOtpSent(true);
    setOtpCode('4920');
    showToast(`Instant Buyer OTP sent: Demo code is 4920`);
  };

  const handleConsumerLogin = (name: string, city: string) => {
    login({ id: `consumer-${name.toLowerCase().replace(/\s+/g, '-')}`, name, role: 'consumer', contact: mobilePhone, location: city, status: 'active', joinedAt: new Date().toISOString().slice(0, 10) });
    showToast(`Welcome ${name}! Connected to Direct Farm Marketplace (${city}).`);
    setActiveTab('marketplace');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleConsumerLogin(consumerName || 'Valued Consumer', deliveryCity);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Hero Header Card */}
      <div className="bg-gradient-to-br from-amber-900 via-stone-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-700/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-bold">
            <Store className="w-3.5 h-3.5 text-amber-300" />
            <span>{copy.badge}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="max-w-xl space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {copy.title}
              </h1>
              <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
                Connect directly with verified local Panchayat growers. Zero middleman markup, 100% farm-traceable harvest dates, and 20–30% higher earnings going directly into rural farmers' pockets.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-black/30 p-3 rounded-2xl border border-white/10 shrink-0">
              <div className="text-center">
                <div className="text-lg font-black text-amber-400">0%</div>
                <div className="text-[10px] text-stone-300">Middleman Fee</div>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div className="text-center">
                <div className="text-lg font-black text-emerald-400">24-48h</div>
                <div className="text-[10px] text-stone-300">Farm to Door</div>
              </div>
            </div>
          </div>

          {/* 1-Click Fast Evaluator Personas */}
          <div className="pt-4 border-t border-white/10">
            <div className="text-[11px] uppercase tracking-wider font-bold text-amber-300 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>1-Click Evaluator Consumer Personas</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleConsumerLogin('Pooja Sen', 'Salt Lake Sector V, Kolkata')}
                className="p-3 bg-stone-900/80 hover:bg-stone-800/90 border border-amber-600/50 rounded-2xl text-left transition-all group flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-sm text-white group-hover:text-amber-200">Pooja Sen (Urban Household)</div>
                  <div className="text-xs text-stone-300">Salt Lake Sector V, Kolkata • Organic Grains & Vegetables</div>
                </div>
                <ArrowRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1 transition-transform shrink-0 ml-2" />
              </button>

              <button
                type="button"
                onClick={() => handleConsumerLogin('Anirban Ghosh', 'New Town Action Area I')}
                className="p-3 bg-stone-900/80 hover:bg-stone-800/90 border border-amber-600/50 rounded-2xl text-left transition-all group flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-sm text-white group-hover:text-amber-200">Anirban Ghosh (Restaurant Buyer)</div>
                  <div className="text-xs text-stone-300">New Town, Kolkata • Bulk Gobindobhog Rice & Mustard</div>
                </div>
                <ArrowRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1 transition-transform shrink-0 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        
        {/* Toggle */}
        <div className="flex border-b border-slate-200 pb-3 justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsRegisterMode(false)}
              className={`text-sm font-bold pb-1 transition-colors ${
                !isRegisterMode ? 'text-amber-700 border-b-2 border-amber-700' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {copy.signIn}
            </button>
            <button
              onClick={() => setIsRegisterMode(true)}
              className={`text-sm font-bold pb-1 transition-colors ${
                isRegisterMode ? 'text-amber-700 border-b-2 border-amber-700' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {copy.register}
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-amber-800 font-semibold bg-amber-50 px-2.5 py-1 rounded-md">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Farm-Traceable Guarantee</span>
          </div>
        </div>

        {!isRegisterMode ? (
          /* SIGN IN FORM */
          <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
            
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                {copy.signInWith}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAuthMethod('mobile')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    authMethod === 'mobile' 
                      ? 'bg-amber-50 border-amber-600 text-amber-900 shadow-xs' 
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{copy.mobile}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAuthMethod('email')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    authMethod === 'email' 
                      ? 'bg-amber-50 border-amber-600 text-amber-900 shadow-xs' 
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{copy.email}</span>
                </button>
              </div>
            </div>

            {authMethod === 'mobile' ? (
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700">
                  Consumer Mobile Handset Number *
                </label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={mobilePhone}
                    onChange={(e) => setMobilePhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="flex-1 p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shrink-0"
                  >
                    {otpSent ? copy.resend : copy.getOtp}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700">
                  Registered Email Address *
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder="user@kolkata-agro.in"
                    className="flex-1 p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shrink-0"
                  >
                    {otpSent ? copy.resend : copy.getOtp}
                  </button>
                </div>
              </div>
            )}

            {otpSent && (
              <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-900">Enter Verification Code</span>
                  <span className="text-amber-800 font-mono text-[11px]">Auto-filled: {otpCode}</span>
                </div>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="4920"
                  className="w-full p-2.5 bg-white border border-amber-300 rounded-lg text-center tracking-widest font-mono font-black text-sm"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{copy.city}</label>
                <select
                  value={deliveryCity}
                  onChange={(e) => setDeliveryCity(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                >
                  <option value="Kolkata">Kolkata Urban</option>
                  <option value="Salt Lake">Salt Lake City</option>
                  <option value="New Town">New Town Rajarhat</option>
                  <option value="Howrah">Howrah Central</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{copy.pincode}</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="700091"
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-black text-sm shadow-md transition-all flex items-center justify-center gap-2"
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
                <label className="block font-bold text-slate-700 mb-1">Full Consumer / Business Name *</label>
                <input
                  type="text"
                  required
                  value={consumerName}
                  onChange={(e) => setConsumerName(e.target.value)}
                  placeholder="e.g. Pooja Sen"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mobile Handset Number *</label>
                <input
                  type="tel"
                  required
                  value={mobilePhone}
                  onChange={(e) => setMobilePhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Buyer Category</label>
                <select
                  value={buyerType}
                  onChange={(e) => setBuyerType(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                >
                  <option value="household">Household Family</option>
                  <option value="restaurant">Restaurant / Hotel</option>
                  <option value="society">Apartment Co-op Society</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Delivery City</label>
                <input
                  type="text"
                  value={deliveryCity}
                  onChange={(e) => setDeliveryCity(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Pincode</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-bold shadow-md transition-colors"
            >
              Complete Registration & Start Shopping Fresh Farm Produce
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
              <button onClick={() => onSwitchPortal('fpo')} className="text-blue-700 hover:underline font-bold">
                FPO Portal →
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
