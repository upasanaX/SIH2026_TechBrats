import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SmsIvrSimulatorModal } from '../components/common/SmsIvrSimulatorModal';
import { 
  Radio, 
  Phone, 
  MessageSquare, 
  Volume2, 
  VolumeX, 
  Eye, 
  Type, 
  WifiOff, 
  Wifi, 
  Globe, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Sparkles,
  Smartphone
} from 'lucide-react';
import { Language } from '../types';

export const AccessibilityCommPage: React.FC = () => {
  const { 
    language, 
    setLanguage, 
    highContrast, 
    setHighContrast, 
    largeText, 
    setLargeText, 
    isOfflineDemo, 
    setIsOfflineDemo, 
    speakAdvisory, 
    isSpeaking, 
    stopSpeaking, 
    currentPanchayat,
    showToast 
  } = useApp();

  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [emergencyPhone, setEmergencyPhone] = useState('+91 98310 99887');

  const sampleAdvisory = {
    en: `KrishiKavach Voice Broadcast for ${currentPanchayat.name}. Severe rainfall expected in next 12 hours. Please withhold fertilizer application and protect stored seeds.`,
    hi: `${currentPanchayat.name} के लिए कृषिकवच की आवाज सलाह। अगले 12 घंटों में भारी बारिश की संभावना है। कृपया खाद न डालें और कटी हुई फसलों को सुरक्षित करें।`,
    bn: `${currentPanchayat.bengaliName} পঞ্চায়েতের জন্য কৃষিকবচ ভয়েস পরামর্শ। আগামী ১২ ঘণ্টায় ভারী বৃষ্টির সম্ভাবনা। জমিতে সার প্রয়োগ বন্ধ রাখুন ও ফসল সুরক্ষিত করুন।`
  };

  const handleTestTTS = () => {
    speakAdvisory(sampleAdvisory[language], language);
  };

  const handleSaveContact = () => {
    showToast(`Emergency contact updated to ${emergencyPhone}. SMS alerts linked.`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Universal Accessibility & Multi-Channel Center
            </h1>
            <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-sm border border-emerald-300">
              Zero-Digital-Divide
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Empowering every farmer across smartphone apps, ₹1,000 basic feature phones, and low-connectivity rural towers
          </p>
        </div>

        <button
          onClick={() => setIsSimulatorOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
        >
          <Radio className="w-4 h-4 text-emerald-400" />
          <span>Launch SMS & IVR Phone Simulator</span>
        </button>
      </div>

      {/* THREE INTERACTION TILES: HIGH CONTRAST, LARGE TEXT, OFFLINE SIMULATOR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* High Contrast */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                <Eye className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm ${highContrast ? 'bg-amber-400 text-black' : 'bg-slate-100 text-slate-600'}`}>
                {highContrast ? 'Active' : 'Standard'}
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-base">High-Contrast Sunlight Mode</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Optimized for farmers viewing mobile displays under glaring direct outdoor sunlight or for visually impaired users.
            </p>
          </div>

          <button
            onClick={() => {
              setHighContrast(!highContrast);
              showToast(highContrast ? 'Standard theme restored' : 'High-contrast mode enabled');
            }}
            className={`w-full py-2.5 rounded-xl text-xs font-bold transition-colors ${
              highContrast 
                ? 'bg-amber-400 text-black border border-amber-500' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
            }`}
          >
            {highContrast ? 'Disable High Contrast' : 'Enable High Contrast'}
          </button>
        </div>

        {/* Large Text Mode */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
                <Type className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm ${largeText ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                {largeText ? 'Active (115%)' : 'Standard'}
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-base">Large Typography Mode</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Increases interface scale, button tap targets, and advisory body text for elder farmers without reading glasses.
            </p>
          </div>

          <button
            onClick={() => {
              setLargeText(!largeText);
              showToast(largeText ? 'Standard text size restored' : 'Large text mode enabled');
            }}
            className={`w-full py-2.5 rounded-xl text-xs font-bold transition-colors ${
              largeText 
                ? 'bg-emerald-700 text-white' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
            }`}
          >
            {largeText ? 'Reset Font Scale' : 'Activate 115% Text Scale'}
          </button>
        </div>

        {/* Low-Connectivity / Offline Simulator */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isOfflineDemo ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'}`}>
                {isOfflineDemo ? <WifiOff className="w-5 h-5" /> : <Wifi className="w-5 h-5" />}
              </div>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm ${isOfflineDemo ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                {isOfflineDemo ? '4G/5G Dropped' : 'Broadband Online'}
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-base">Low-Connectivity Failover</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Demonstrates automatic fallback to 2G GSM SMS and automated IVR voice queues when monsoon rain causes tower blackout.
            </p>
          </div>

          <button
            onClick={() => {
              setIsOfflineDemo(!isOfflineDemo);
              showToast(isOfflineDemo ? 'Network restored: App sync online' : 'Simulating rural tower failure: SMS & IVR failover active');
            }}
            className={`w-full py-2.5 rounded-xl text-xs font-bold transition-colors ${
              isOfflineDemo 
                ? 'bg-red-700 text-white' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
            }`}
          >
            {isOfflineDemo ? 'Restore High-Speed Connection' : 'Simulate Low-Connectivity Drop'}
          </button>
        </div>

      </div>

      {/* FAILOVER NOTIFICATION IF OFFLINE DEMO ACTIVE */}
      {isOfflineDemo && (
        <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl text-xs text-amber-950 flex items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
            <div>
              <strong>MONSOON TOWER FAILOVER SIMULATION ACTIVE:</strong> Data connection lost. KrishiKavach has switched your Panchayat priority alerts to SMS broadcast and automated BSNL/Jio cellular voice calls.
            </div>
          </div>
          <button
            onClick={() => setIsSimulatorOpen(true)}
            className="shrink-0 px-3 py-1.5 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800"
          >
            Inspect Fallback SMS
          </button>
        </div>
      )}

      {/* VOICE READ-ALOUD AUDIO CENTER */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-emerald-700" />
            <h2 className="text-base font-bold text-slate-900">Synthetic Web Speech Audio Synthesizer</h2>
          </div>
          <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
            Language: {language.toUpperCase()}
          </span>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Current Spoken Script:</span>
          <p className="text-slate-800 font-medium leading-relaxed italic">
            "{sampleAdvisory[language]}"
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!isSpeaking ? (
            <button
              onClick={handleTestTTS}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-xs"
            >
              <Volume2 className="w-4 h-4" />
              <span>Test Audio Playback in {language === 'bn' ? 'Bengali' : language === 'hi' ? 'Hindi' : 'English'}</span>
            </button>
          ) : (
            <button
              onClick={stopSpeaking}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-xs animate-pulse"
            >
              <VolumeX className="w-4 h-4" />
              <span>Stop Voice Speech</span>
            </button>
          )}

          <span className="text-xs text-slate-500">
            Enables illiterate or visually challenged rural farmers to absorb complex meteorological advice hands-free.
          </span>
        </div>
      </div>

      {/* TELEPHONY GATEWAYS TEST SUITE: TWILIO, SINCH, INFOBIP, PLIVO */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-emerald-700" />
              <h2 className="text-base font-bold text-slate-900">
                Telephony Gateway Testing Suite (Twilio • Sinch • Infobip • Plivo)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Multi-carrier cellular dispatch engine for mass village alerting and voice IVR outreach
            </p>
          </div>

          <button
            onClick={() => setIsSimulatorOpen(true)}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs shrink-0"
          >
            Open Multi-Gateway Sandbox →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          
          {/* Twilio Card */}
          <div className="p-4 rounded-xl border border-red-200 bg-red-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-red-900">Twilio API</span>
              <span className="text-[10px] font-bold uppercase bg-red-100 text-red-800 px-2 py-0.5 rounded-sm">
                Active Node
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              Programmable SMS & Voice Calls with TwiML IVR response trees and Indian DLT compliance.
            </p>
            <div className="text-[10px] font-mono text-slate-500">Latency: ~210ms • BSNL/Jio Handshake</div>
            <button
              onClick={() => setIsSimulatorOpen(true)}
              className="w-full py-1.5 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-lg transition-colors"
            >
              Test Twilio Gateway
            </button>
          </div>

          {/* Sinch Card */}
          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-amber-900">Sinch Enterprise</span>
              <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded-sm">
                XMS Service
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              High-throughput SMS batches & automated PSTN voice callout for disaster sirens.
            </p>
            <div className="text-[10px] font-mono text-slate-500">Latency: ~188ms • Airtel Circle</div>
            <button
              onClick={() => setIsSimulatorOpen(true)}
              className="w-full py-1.5 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold rounded-lg transition-colors"
            >
              Test Sinch Gateway
            </button>
          </div>

          {/* Infobip Card */}
          <div className="p-4 rounded-xl border border-orange-200 bg-orange-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-orange-900">Infobip Cloud</span>
              <span className="text-[10px] font-bold uppercase bg-orange-100 text-orange-800 px-2 py-0.5 rounded-sm">
                Omnichannel
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              Advanced multilingual SMS and Regional TTS Voice synthesis for low-literacy coverage.
            </p>
            <div className="text-[10px] font-mono text-slate-500">Latency: ~240ms • Jio Rural BTS</div>
            <button
              onClick={() => setIsSimulatorOpen(true)}
              className="w-full py-1.5 bg-orange-700 hover:bg-orange-800 text-white text-xs font-bold rounded-lg transition-colors"
            >
              Test Infobip Gateway
            </button>
          </div>

          {/* Plivo Card */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-emerald-900">Plivo Zentrunk</span>
              <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-sm">
                SIP & REST
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              Global SMS API and XML-driven automated call menus with instant DTMF feedback.
            </p>
            <div className="text-[10px] font-mono text-slate-500">Latency: ~195ms • Vi/BSNL Node</div>
            <button
              onClick={() => setIsSimulatorOpen(true)}
              className="w-full py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors"
            >
              Test Plivo Gateway
            </button>
          </div>

        </div>
      </div>

      {/* EMERGENCY SMS / PHONE SETTINGS */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
          Emergency Contact & Priority Channel Preferences
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="space-y-2">
            <label className="block font-bold text-slate-700">Primary Mobile Handset for SMS Broadcast</label>
            <input
              type="text"
              value={emergencyPhone}
              onChange={(e) => setEmergencyPhone(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold"
            />
            <p className="text-slate-500 text-[11px]">
              Critical weather alerts arrive as localized flash SMS messages with zero data charge.
            </p>
          </div>

          <div className="space-y-2">
            <label className="block font-bold text-slate-700">Preferred Dissemination Order</label>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 space-y-1">
              <div>1. In-App Rich Push (if online)</div>
              <div>2. Cellular Flash SMS (within 8 seconds)</div>
              <div>3. Outbound Automated IVR Voice Call (if unacknowledged)</div>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={handleSaveContact}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs"
          >
            Save Emergency Contact Settings
          </button>
        </div>
      </div>

      {/* SMS/IVR Simulator Modal */}
      <SmsIvrSimulatorModal 
        isOpen={isSimulatorOpen} 
        onClose={() => setIsSimulatorOpen(false)} 
      />

    </div>
  );
};
