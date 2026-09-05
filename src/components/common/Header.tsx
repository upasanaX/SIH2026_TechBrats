import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PanchayatSelectorModal } from './PanchayatSelectorModal';
import { SmsIvrSimulatorModal } from './SmsIvrSimulatorModal';
import { 
  MapPin, 
  Globe, 
  ShieldAlert, 
  ShoppingCart, 
  Eye, 
  Type, 
  Volume2, 
  VolumeX, 
  Menu, 
  UserCheck, 
  ChevronDown,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { Role, Language } from '../../types';

interface HeaderProps {
  onMenuToggle?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { 
    currentPanchayat, 
    currentRole, 
    setCurrentRole, 
    language, 
    setLanguage, 
    cart, 
    activeTab, 
    setActiveTab, 
    alerts, 
    highContrast, 
    setHighContrast, 
    largeText, 
    setLargeText,
    isSpeaking,
    stopSpeaking,
    showToast
  } = useApp();

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Check if current panchayat has high or critical alerts
  const hasCriticalWarning = alerts.some(
    a => a.primaryPanchayatId === currentPanchayat.id && (a.severity === 'critical' || a.severity === 'high')
  );

  const roles: { key: Role; label: string; sub: string }[] = [
    { key: 'farmer', label: 'Farmer Dashboard', sub: 'Weather, crop protection & market sales' },
    { key: 'consumer', label: 'Consumer Marketplace', sub: 'Buy directly from certified farmers' },
    { key: 'official', label: 'Govt / FPO Monitoring', sub: 'District oversight, alerts & logistics' }
  ];

  const languages: { key: Language; label: string; native: string }[] = [
    { key: 'en', label: 'English', native: 'English' },
    { key: 'hi', label: 'Hindi', native: 'हिंदी' },
    { key: 'bn', label: 'Bengali', native: 'বাংলা' }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
        {/* Top Emergency Ticker if high/critical alert is active */}
        {hasCriticalWarning && (
          <div className="bg-red-700 text-white px-4 py-1.5 text-xs font-semibold flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-2 max-w-5xl mx-auto w-full">
              <ShieldAlert className="w-4 h-4 shrink-0 text-amber-300" />
              <span>
                <strong>CRITICAL WEATHER ADVISORY:</strong> High precipitation risk detected over {currentPanchayat.name} ({currentPanchayat.block}).
              </span>
              <button 
                onClick={() => setActiveTab('alerts')} 
                className="underline hover:text-amber-200 ml-2 font-bold cursor-pointer"
              >
                View Action Checklist →
              </button>
            </div>
            <button 
              onClick={() => setIsSmsModalOpen(true)}
              className="hidden sm:flex items-center gap-1 bg-white text-red-800 px-2 py-0.5 rounded-sm text-[11px] font-bold hover:bg-amber-100"
            >
              <PhoneCall className="w-3 h-3" />
              Simulate SMS / IVR Broadcast
            </button>
          </div>
        )}

        <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
          
          {/* Left: Mobile Menu Toggle & Brand */}
          <div className="flex items-center gap-3">
            {onMenuToggle && (
              <button 
                onClick={onMenuToggle}
                className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
                aria-label="Toggle Navigation"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <div 
              onClick={() => setActiveTab('landing')}
              className="cursor-pointer flex items-center gap-2.5 group"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-700 flex items-center justify-center text-white font-black text-lg shadow-sm border border-emerald-800 group-hover:bg-emerald-800 transition-colors">
                KK
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-slate-900 text-lg tracking-tight">KrishiKavach</span>
                  <span className="text-xs text-slate-400 font-medium">कृषिकवচ</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-sm border border-emerald-200">
                    Agro Grid
                  </span>
                </div>
                <div className="text-[10px] font-semibold text-emerald-700 hidden sm:block">
                  Panchayat-Level Hyperlocal Agro-Weather Grid
                </div>
              </div>
            </div>
          </div>

          {/* Center: Selected Location Badge with Click-to-Change */}
          <div className="hidden md:flex items-center">
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-emerald-50 border border-slate-300 hover:border-emerald-500 rounded-lg text-xs transition-all shadow-2xs group"
              title="Click to switch Panchayat"
            >
              <MapPin className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span>{currentPanchayat.name}</span>
                  <span className="text-[10px] text-slate-500 font-normal">({currentPanchayat.bengaliName})</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  {currentPanchayat.block}, {currentPanchayat.district}
                </div>
              </div>
            </button>
          </div>

          {/* Right: Actions, Role Selector, Language, Accessibility */}
          <div className="flex items-center gap-2 sm:gap-2.5">

            {/* Speaking audio active indicator */}
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-red-100 border border-red-300 text-red-800 rounded-full text-xs font-semibold animate-pulse"
                title="Stop spoken audio advisory"
              >
                <VolumeX className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Stop Audio</span>
              </button>
            )}

            {/* Test SMS/IVR button */}
            <button
              onClick={() => setIsSmsModalOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 transition-colors shadow-xs"
              title="Simulate SMS dispatch and IVR voice call"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-200" />
              <span>SMS / IVR Test</span>
            </button>

            {/* Accessibility: High Contrast */}
            <button
              onClick={() => {
                setHighContrast(!highContrast);
                showToast(highContrast ? 'Standard theme restored' : 'High-contrast mode activated for low-visibility');
              }}
              className={`p-1.5 rounded-lg border text-xs transition-colors ${
                highContrast 
                  ? 'bg-amber-400 text-black border-amber-500 font-bold' 
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
              title="Toggle High Contrast Mode"
              aria-label="Toggle High Contrast Mode"
            >
              <Eye className="w-4 h-4" />
            </button>

            {/* Accessibility: Large Text */}
            <button
              onClick={() => {
                setLargeText(!largeText);
                showToast(largeText ? 'Standard font size' : 'Large text mode activated');
              }}
              className={`p-1.5 rounded-lg border text-xs transition-colors ${
                largeText 
                  ? 'bg-emerald-700 text-white border-emerald-800 font-bold' 
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
              title="Toggle Large Text Mode"
              aria-label="Toggle Large Text Mode"
            >
              <Type className="w-4 h-4" />
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setLangDropdownOpen(!langDropdownOpen);
                  setRoleDropdownOpen(false);
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 transition-colors"
                title="Change language"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span className="uppercase">{language}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-40 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50 animate-in fade-in">
                  <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100">
                    Select Language
                  </div>
                  {languages.map(l => (
                    <button
                      key={l.key}
                      onClick={() => {
                        setLanguage(l.key);
                        setLangDropdownOpen(false);
                        showToast(`Language switched to ${l.label} (${l.native})`);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                        language === l.key ? 'font-bold text-emerald-700 bg-emerald-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span>{l.label}</span>
                      <span className="text-[11px] text-slate-400">{l.native}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Role / Demo-Mode Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setRoleDropdownOpen(!roleDropdownOpen);
                  setLangDropdownOpen(false);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors shadow-2xs"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span className="hidden sm:inline">
                  {currentRole === 'farmer' ? 'Farmer Mode' : currentRole === 'consumer' ? 'Consumer' : 'FPO / Govt'}
                </span>
                <ChevronDown className="w-3 h-3 text-emerald-700" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-50 animate-in fade-in">
                  <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100 mb-1">
                    Evaluator Demo Role Switcher
                  </div>
                  {roles.map(r => (
                    <button
                      key={r.key}
                      onClick={() => {
                        setCurrentRole(r.key);
                        setRoleDropdownOpen(false);
                        if (r.key === 'farmer') setActiveTab('farmer');
                        if (r.key === 'consumer') setActiveTab('marketplace');
                        if (r.key === 'official') setActiveTab('government');
                        showToast(`Switched view to ${r.label}`);
                      }}
                      className={`w-full text-left p-2.5 rounded-lg transition-all mb-1 ${
                        currentRole === r.key 
                          ? 'bg-emerald-700 text-white font-semibold shadow-xs' 
                          : 'hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      <div className="text-xs font-bold">{r.label}</div>
                      <div className={`text-[11px] mt-0.5 ${currentRole === r.key ? 'text-emerald-100' : 'text-slate-500'}`}>
                        {r.sub}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Icon with badge */}
            <button
              onClick={() => setActiveTab('cart')}
              className="relative p-2 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
              title="View Cart & Orders"
              aria-label="View Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {cartItemCount}
                </span>
              )}
            </button>

          </div>

        </div>

        {/* Mobile Location bar if screen is small */}
        <div className="md:hidden px-4 py-1.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <button 
            onClick={() => setIsLocationModalOpen(true)}
            className="flex items-center gap-1.5 font-bold text-slate-800 hover:text-emerald-700 text-left"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>{currentPanchayat.name}, {currentPanchayat.district}</span>
            <span className="text-[10px] text-emerald-700 underline font-normal">(Change)</span>
          </button>
          <button
            onClick={() => setIsSmsModalOpen(true)}
            className="text-[10px] font-bold bg-emerald-700 text-white px-2 py-0.5 rounded-sm"
          >
            SMS / IVR Test
          </button>
        </div>
      </header>

      {/* Panchayat Selector Modal */}
      <PanchayatSelectorModal 
        isOpen={isLocationModalOpen} 
        onClose={() => setIsLocationModalOpen(false)} 
      />

      {/* SMS & IVR Broadcast Simulator */}
      <SmsIvrSimulatorModal 
        isOpen={isSmsModalOpen} 
        onClose={() => setIsSmsModalOpen(false)} 
      />
    </>
  );
};
