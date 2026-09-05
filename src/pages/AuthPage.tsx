import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PANCHAYATS } from '../data/panchayats';
import { Role, Language } from '../types';
import { 
  LogIn, 
  UserPlus, 
  UserCheck, 
  MapPin, 
  Phone, 
  Sprout, 
  CheckCircle2, 
  Radio, 
  Building, 
  Store, 
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { currentRole, setCurrentRole, setActiveTab, setCurrentPanchayat, showToast } = useApp();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>('farmer');

  // Registration Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    language: 'bn',
    state: 'West Bengal',
    district: 'South 24 Parganas',
    block: 'Bhangar-I Block',
    panchayat: 'Bhangar-I',
    village: '',
    primaryCrop: 'Aman Paddy',
    farmSizeAcre: '2.5',
    preferredChannel: 'sms'
  });

  const handleDemoLogin = (role: Role, name: string, panchayatId?: string) => {
    setCurrentRole(role);
    if (panchayatId) {
      const p = PANCHAYATS.find(x => x.id === panchayatId);
      if (p) setCurrentPanchayat(p);
    }
    showToast(`Logged in as demo ${role.toUpperCase()}: ${name}`);
    if (role === 'farmer') setActiveTab('farmer');
    else if (role === 'consumer') setActiveTab('marketplace');
    else setActiveTab('government');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) {
      showToast('Please provide your name and mobile number.');
      return;
    }
    showToast(`Registration submitted for ${formData.fullName}! Welcome to KrishiKavach.`);
    setCurrentRole(selectedRole);
    setActiveTab('farmer');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          Kisan Identity & Portal Access
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Welcome to KrishiKavach
        </h1>
        <p className="text-xs text-slate-500 max-w-lg mx-auto">
          Access village-level weather forecasts, proactive hazard alerts, and the direct farmer-to-consumer marketplace
        </p>
      </div>

      {/* QUICK 1-CLICK DEMO LOGIN (Evaluator Friendly) */}
      <div className="bg-emerald-900 text-white rounded-3xl p-8 shadow-md space-y-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-300">
            Stakeholder Demonstration Personas
          </div>
          <h2 className="text-xl font-bold text-white">1-Click Fast Evaluator Demo Access</h2>
          <p className="text-xs text-emerald-100">
            Instantly switch between distinct stakeholder personas with pre-configured Panchayat datasets:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          
          <button
            onClick={() => handleDemoLogin('farmer', 'Ramesh Mondal', 'panchayat-bhangar-1')}
            className="p-4 bg-emerald-800 hover:bg-emerald-700 rounded-2xl border border-emerald-600 text-left space-y-2 transition-all group"
          >
            <div className="flex items-center justify-between">
              <Sprout className="w-5 h-5 text-emerald-300" />
              <span className="text-[10px] font-bold uppercase bg-emerald-950 px-2 py-0.5 rounded-sm">Farmer</span>
            </div>
            <div className="font-bold text-white text-sm">Ramesh Mondal</div>
            <p className="text-[11px] text-emerald-200">Bhangar-I Panchayat • Aman Paddy & Vegetables</p>
            <div className="text-[10px] text-emerald-300 font-bold group-hover:underline flex items-center gap-1">
              Enter Farmer Dashboard →
            </div>
          </button>

          <button
            onClick={() => handleDemoLogin('consumer', 'Pooja Sen')}
            className="p-4 bg-emerald-800 hover:bg-emerald-700 rounded-2xl border border-emerald-600 text-left space-y-2 transition-all group"
          >
            <div className="flex items-center justify-between">
              <Store className="w-5 h-5 text-amber-300" />
              <span className="text-[10px] font-bold uppercase bg-emerald-950 px-2 py-0.5 rounded-sm">Consumer</span>
            </div>
            <div className="font-bold text-white text-sm">Pooja Sen</div>
            <p className="text-[11px] text-emerald-200">Kolkata Urban Area • Direct Farm Buyer</p>
            <div className="text-[10px] text-emerald-300 font-bold group-hover:underline flex items-center gap-1">
              Enter Marketplace →
            </div>
          </button>

          <button
            onClick={() => handleDemoLogin('official', 'Dr. Anil Sharma')}
            className="p-4 bg-emerald-800 hover:bg-emerald-700 rounded-2xl border border-emerald-600 text-left space-y-2 transition-all group"
          >
            <div className="flex items-center justify-between">
              <Building className="w-5 h-5 text-blue-300" />
              <span className="text-[10px] font-bold uppercase bg-emerald-950 px-2 py-0.5 rounded-sm">Govt / FPO</span>
            </div>
            <div className="font-bold text-white text-sm">Dr. Anil Sharma</div>
            <p className="text-[11px] text-emerald-200">District Agromet Officer • 6 Panchayats</p>
            <div className="text-[10px] text-emerald-300 font-bold group-hover:underline flex items-center gap-1">
              Enter Oversight Portal →
            </div>
          </button>

        </div>
      </div>

      {/* REGISTRATION & LOGIN TOGGLE CONTAINER */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-6">
        
        {/* Switcher Tabs */}
        <div className="flex border-b border-slate-200 pb-3 justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsRegisterMode(false)}
              className={`text-sm font-bold pb-1 transition-colors ${
                !isRegisterMode ? 'text-emerald-700 border-b-2 border-emerald-700' : 'text-slate-500'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsRegisterMode(true)}
              className={`text-sm font-bold pb-1 transition-colors ${
                isRegisterMode ? 'text-emerald-700 border-b-2 border-emerald-700' : 'text-slate-500'
              }`}
            >
              Register New Farmer / FPO
            </button>
          </div>

          <div className="text-xs text-slate-500 font-mono">
            Sandbox Auth Mode (No Password Needed)
          </div>
        </div>

        {/* ROLE SELECTION RADIO */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase text-slate-500">
            Choose Your Platform Role
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(['farmer', 'consumer', 'official'] as Role[]).map(r => (
              <button
                key={r}
                type="button"
                onClick={() => setSelectedRole(r)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedRole === r 
                    ? 'border-emerald-700 bg-emerald-50 text-emerald-900 font-bold ring-1 ring-emerald-700' 
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="capitalize text-xs font-bold">{r}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {r === 'farmer' ? 'Weather & Crops' : r === 'consumer' ? 'Direct Produce' : 'Administration'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* REGISTRATION FORM */}
        {isRegisterMode ? (
          <form onSubmit={handleRegisterSubmit} className="space-y-5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Farmer / User Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Subodh Mondal"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mobile Handset Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
            </div>

            {/* Geographic cascade */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">District</label>
                <select
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                >
                  <option value="South 24 Parganas">South 24 Parganas</option>
                  <option value="Hooghly">Hooghly</option>
                  <option value="North 24 Parganas">North 24 Parganas</option>
                  <option value="Purba Bardhaman">Purba Bardhaman</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Block</label>
                <input
                  type="text"
                  value={formData.block}
                  onChange={(e) => setFormData({ ...formData, block: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Panchayat</label>
                <select
                  value={formData.panchayat}
                  onChange={(e) => setFormData({ ...formData, panchayat: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                >
                  {PANCHAYATS.map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Farm specific info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Village Name</label>
                <input
                  type="text"
                  placeholder="e.g. Purba Para"
                  value={formData.village}
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Primary Cultivated Crop</label>
                <input
                  type="text"
                  value={formData.primaryCrop}
                  onChange={(e) => setFormData({ ...formData, primaryCrop: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Preferred Alert Channel</label>
                <select
                  value={formData.preferredChannel}
                  onChange={(e) => setFormData({ ...formData, preferredChannel: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                >
                  <option value="sms">Basic SMS (Feature Phone)</option>
                  <option value="ivr">Voice IVR Call (Hindi / Bengali)</option>
                  <option value="app">Mobile Smartphone Push</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-md transition-colors"
            >
              Complete Farmer Registration & Connect Weather Grid
            </button>
          </form>
        ) : (
          /* QUICK SIGN IN FORM */
          <div className="space-y-4 text-xs max-w-md mx-auto">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Mobile Handset Number</label>
              <input
                type="tel"
                placeholder="+91 98310 XXXXX"
                defaultValue="+91 98310 12345"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs"
              />
            </div>

            <button
              onClick={() => handleDemoLogin(selectedRole, 'Registered User')}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-md transition-colors"
            >
              Enter Dashboard as {selectedRole.toUpperCase()}
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
