import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { TelephonyProvider, TelephonyConfig, TelephonyDispatchResult } from '../../types';
import { TELEPHONY_PROVIDERS, executeTelephonyDispatch } from '../../utils/telephonyProviders';
import { 
  X, 
  Phone, 
  MessageSquare, 
  Volume2, 
  VolumeX, 
  Radio, 
  CheckCircle, 
  ShieldAlert,
  Code2,
  Settings2,
  Send,
  Sparkles,
  Terminal,
  Activity,
  Copy,
  Clock,
  ExternalLink
} from 'lucide-react';

interface SmsIvrSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  alertTitle?: string;
  customMessage?: string;
}

export const SmsIvrSimulatorModal: React.FC<SmsIvrSimulatorModalProps> = ({ 
  isOpen, 
  onClose,
  customMessage
}) => {
  const { currentPanchayat, language, speakAdvisory, stopSpeaking, isSpeaking, showToast } = useApp();
  
  const [selectedProvider, setSelectedProvider] = useState<TelephonyProvider>('twilio');
  const [activeTab, setActiveTab] = useState<'sms' | 'ivr' | 'code' | 'config'>('sms');
  const [recipientPhone, setRecipientPhone] = useState('+91 98310 44219');
  const [isCalling, setIsCalling] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isDispatching, setIsDispatching] = useState(false);
  const [lastResult, setLastResult] = useState<TelephonyDispatchResult | null>(null);

  // Per-provider credential configs initialized with defaults
  const [configs, setConfigs] = useState<Record<TelephonyProvider, TelephonyConfig>>({
    twilio: { ...TELEPHONY_PROVIDERS.twilio.defaultConfig },
    sinch: { ...TELEPHONY_PROVIDERS.sinch.defaultConfig },
    infobip: { ...TELEPHONY_PROVIDERS.infobip.defaultConfig },
    plivo: { ...TELEPHONY_PROVIDERS.plivo.defaultConfig }
  });

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isCalling) {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [isCalling]);

  if (!isOpen) return null;

  const currentConfig = configs[selectedProvider];
  const providerMeta = TELEPHONY_PROVIDERS[selectedProvider];

  const defaultSmsEn = `[KrishiKavach ALERT] High Risk Weather Warning for ${currentPanchayat.name} (${currentPanchayat.block}). Heavy rainfall (42mm) expected over next 12 hrs. Action: Open field drainage bunds, halt pesticide sprays. Helplines: 1800-180-1551.`;
  const defaultSmsHi = `[कृषिकवच चेतावनी] ${currentPanchayat.name} के लिए मौसम चेतावनी: अगले 12 घंटों में 42 मिमी भारी बारिश की आशंका। कृपया खेतों से अतिरिक्त पानी निकासी करें व कीटनाशक छिड़काव रोकें।`;
  const defaultSmsBn = `[কৃষিকবচ জরুরি বার্তা] ${currentPanchayat.bengaliName} পঞ্চায়েতে আগামী ১২ ঘণ্টায় তীব্র বৃষ্টির (৪২ মিমি) সম্ভাবনা। আমন ধানের জমির নিকাশি নালা খুলুন ও স্প্রে বন্ধ রাখুন।`;

  const [smsText, setSmsText] = useState(
    customMessage || (language === 'hi' ? defaultSmsHi : language === 'bn' ? defaultSmsBn : defaultSmsEn)
  );

  const ivrScriptEn = `Namaskar. Automated weather emergency broadcast from KrishiKavach for ${currentPanchayat.name} Gram Panchayat. Heavy precipitation detected with 85% probability. Please safeguard crops and do not apply urea today. Press 1 to repeat this message, or press 9 to connect with your local FPO coordinator.`;
  const ivrScriptHi = `नमस्कार। यह ${currentPanchayat.name} ग्राम पंचायत के लिए कृषिकवच की ओर से स्वचालित मौसम आपातकालीन कॉल है। भारी बारिश की संभावना है। अपनी फसलों को सुरक्षित रखें। पुनः सुनने के लिए 1 दबाएं, एफपीओ से बात करने के लिए 9 दबाएं।`;
  const ivrScriptBn = `নমস্কার। এটি ${currentPanchayat.bengaliName} গ্রাম পঞ্চায়েতের জন্য কৃষিকবচের স্বয়ংক্রিয় জরুরি আবহাওয়া কল। আগামী কয়েক ঘণ্টায় ভারী বৃষ্টির আশঙ্কা। ফসলের ক্ষতি এড়াতে ড্রেন পরিষ্কার রাখুন। পুনরায় শুনতে ১ টিপুন।`;

  const ivrText = language === 'hi' ? ivrScriptHi : language === 'bn' ? ivrScriptBn : ivrScriptEn;

  const handleTriggerSmsDispatch = async () => {
    setIsDispatching(true);
    try {
      const res = await executeTelephonyDispatch(
        selectedProvider,
        'sms',
        recipientPhone,
        smsText,
        currentConfig
      );
      setLastResult(res);
      showToast(`SMS sent via ${providerMeta.name}! SID: ${res.messageId} (${res.latencyMs}ms)`);
    } catch (err) {
      showToast('Error sending SMS via provider');
    } finally {
      setIsDispatching(false);
    }
  };

  const handleStartCall = async () => {
    setIsCalling(true);
    speakAdvisory(ivrText, language);
    setIsDispatching(true);
    try {
      const res = await executeTelephonyDispatch(
        selectedProvider,
        'ivr',
        recipientPhone,
        ivrText,
        currentConfig
      );
      setLastResult(res);
      showToast(`IVR Call initiated via ${providerMeta.name} Voice API! Playing audio.`);
    } catch (err) {
      showToast('Failed to start IVR call');
    } finally {
      setIsDispatching(false);
    }
  };

  const handleEndCall = () => {
    setIsCalling(false);
    stopSpeaking();
    showToast('IVR call terminated.');
  };

  const handleModalClose = () => {
    stopSpeaking();
    setIsCalling(false);
    onClose();
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const copyCurl = () => {
    const cmd = providerMeta.generateCurlCommand(recipientPhone, smsText, currentConfig, 'sms');
    navigator.clipboard.writeText(cmd);
    showToast(`Copied ${providerMeta.name} cURL command to clipboard!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* MODAL TOP HEADER */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 text-white border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold">Telecommunications SMS & IVR Test Engine</h2>
                <span className="text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-sm border border-emerald-500/30">
                  TRAI DLT Verified
                </span>
              </div>
              <p className="text-xs text-slate-400">Multi-Gateway Integration for Rural Last-Mile Broadcast</p>
            </div>
          </div>
          
          <button 
            onClick={handleModalClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PROVIDER SELECTOR BAR (Twilio, Sinch, Infobip, Plivo) */}
        <div className="bg-slate-900 px-6 py-2.5 border-b border-slate-800 flex items-center justify-between overflow-x-auto gap-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
            Select Telephony API:
          </div>

          <div className="flex items-center gap-2">
            {(['twilio', 'sinch', 'infobip', 'plivo'] as TelephonyProvider[]).map((p) => {
              const meta = TELEPHONY_PROVIDERS[p];
              const isSel = selectedProvider === p;
              return (
                <button
                  key={p}
                  onClick={() => {
                    setSelectedProvider(p);
                    showToast(`Active Gateway switched to ${meta.name}`);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isSel 
                      ? 'bg-white text-slate-900 shadow-md font-black ring-2 ring-emerald-400' 
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${meta.logoColor.replace('text-', 'bg-')}`} />
                  <span>{meta.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* SUB-TABS: SMS, IVR, CURL / PAYLOAD, CREDENTIALS */}
        <div className="flex border-b border-slate-200 bg-slate-100 p-1.5 gap-1.5">
          <button
            onClick={() => setActiveTab('sms')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'sms'
                ? 'bg-white text-emerald-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>SMS Dispatch Test</span>
          </button>

          <button
            onClick={() => setActiveTab('ivr')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'ivr'
                ? 'bg-white text-emerald-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Phone className="w-4 h-4 text-blue-600" />
            <span>Voice IVR Call Test</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'code'
                ? 'bg-white text-emerald-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Terminal className="w-4 h-4 text-purple-600" />
            <span>cURL & Payload</span>
          </button>

          <button
            onClick={() => setActiveTab('config')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'config'
                ? 'bg-white text-emerald-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Settings2 className="w-4 h-4 text-slate-700" />
            <span>API Credentials</span>
          </button>
        </div>

        {/* CONTENT VIEWPORT */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* Active Provider Info Badge */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${providerMeta.badgeBg}`}>
                {providerMeta.name} Gateway
              </span>
              <span className="text-slate-600">{providerMeta.tagline}</span>
            </div>
            <div className="text-[11px] font-mono text-slate-500">
              Sender ID: <strong className="text-slate-800">{currentConfig.fromNumber}</strong>
            </div>
          </div>

          {/* TAB 1: SMS TEST */}
          {activeTab === 'sms' && (
            <div className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Recipient Farmer Handset (GSM)
                  </label>
                  <input
                    type="tel"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    TRAI DLT Template ID
                  </label>
                  <input
                    type="text"
                    disabled
                    value={currentConfig.dltTemplateId || '110716892348910245'}
                    className="w-full p-2.5 bg-slate-100 border border-slate-300 rounded-xl text-xs font-mono text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <label className="font-bold text-slate-700">SMS Advisory Message Body</label>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {smsText.length} chars (1 SMS Credit • GSM 7-bit)
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={smsText}
                  onChange={(e) => setSmsText(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 leading-relaxed font-sans"
                />
              </div>

              {/* Language Presets */}
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-slate-600">Quick Regional Presets:</span>
                <button
                  type="button"
                  onClick={() => setSmsText(defaultSmsEn)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 text-[11px] font-semibold"
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setSmsText(defaultSmsHi)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 text-[11px] font-semibold"
                >
                  हिंदी (Hindi)
                </button>
                <button
                  type="button"
                  onClick={() => setSmsText(defaultSmsBn)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 text-[11px] font-semibold"
                >
                  বাংলা (Bengali)
                </button>
              </div>

              {/* Send Action */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleTriggerSmsDispatch}
                  disabled={isDispatching}
                  className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isDispatching ? `Dispatching via ${providerMeta.name}...` : `Dispatch Test SMS via ${providerMeta.name}`}</span>
                </button>

                <div className="text-[11px] text-slate-500 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Carrier handshake simulated on BSNL/Jio rural BTS</span>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: IVR TEST */}
          {activeTab === 'ivr' && (
            <div className="space-y-4">
              <div className="border-2 border-slate-800 bg-slate-950 rounded-2xl p-6 text-center text-white shadow-xl space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 text-blue-400 shadow-md">
                  <Phone className={`w-8 h-8 ${isCalling ? 'animate-bounce text-emerald-400' : 'text-blue-400'}`} />
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">
                    {providerMeta.name} Voice Automated Outbound Callout
                  </h3>
                  <p className="text-xs text-slate-400">Recipient: {recipientPhone} • Regional Speech Engine</p>
                </div>

                {isCalling ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Call in progress: {formatSeconds(callDuration)}
                  </div>
                ) : (
                  <span className="inline-block px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-medium">
                    Ready to initiate voice callout
                  </span>
                )}

                {/* IVR Script Preview */}
                <div className="text-left p-3.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 leading-relaxed max-h-28 overflow-y-auto">
                  <span className="text-[10px] uppercase font-bold text-blue-400 block mb-1">
                    Synthesized Regional Speech Script ({language.toUpperCase()}):
                  </span>
                  "{ivrText}"
                </div>

                {/* Interactive Keypad DTMF Simulator */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-center gap-2 text-xs">
                  <span className="text-slate-400 text-[11px]">Simulate DTMF Keypad:</span>
                  <button
                    onClick={() => {
                      speakAdvisory(ivrText, language);
                      showToast('DTMF [1] received: Replaying advisory');
                    }}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded-md font-mono font-bold"
                  >
                    [1] Repeat
                  </button>
                  <button
                    onClick={() => showToast('DTMF [9] received: Forwarding to Bhangar-I FPO Coordinator')}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-md font-mono font-bold"
                  >
                    [9] Connect FPO
                  </button>
                </div>

                {/* Call Control Buttons */}
                <div className="pt-2 flex items-center justify-center gap-4">
                  {!isCalling ? (
                    <button
                      onClick={handleStartCall}
                      className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold text-xs shadow-lg transition-transform active:scale-95"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Start {providerMeta.name} Voice Callout</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleEndCall}
                      className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold text-xs shadow-lg transition-transform active:scale-95"
                    >
                      <Phone className="w-4 h-4 rotate-135" />
                      <span>Terminate Call & Stop Audio</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: cURL & PAYLOAD INSPECTOR */}
          {activeTab === 'code' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">Official cURL Command Preview</span>
                <button
                  onClick={copyCurl}
                  className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy cURL</span>
                </button>
              </div>

              <div className="bg-slate-900 text-emerald-400 p-4 rounded-2xl font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800 shadow-inner">
                {providerMeta.generateCurlCommand(recipientPhone, smsText, currentConfig, 'sms')}
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-700">Request Body Payload (JSON)</span>
                <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl font-mono text-xs overflow-x-auto border border-slate-800 shadow-inner">
                  {JSON.stringify(providerMeta.generateSmsPayload(recipientPhone, smsText, currentConfig), null, 2)}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: API CREDENTIALS */}
          {activeTab === 'config' && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
                <strong>Sandbox Credentials Mode:</strong> Pre-filled with verified test credentials for {providerMeta.name}. You can edit these with your live API keys or test in instant sandbox mode.
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {selectedProvider === 'sinch' ? 'Service Plan ID' : selectedProvider === 'plivo' ? 'Auth ID' : 'Account SID / Org ID'}
                  </label>
                  <input
                    type="text"
                    value={currentConfig.accountSid}
                    onChange={(e) => setConfigs({
                      ...configs,
                      [selectedProvider]: { ...currentConfig, accountSid: e.target.value }
                    })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Auth Token / API Secret Key
                  </label>
                  <input
                    type="password"
                    value={currentConfig.authToken}
                    onChange={(e) => setConfigs({
                      ...configs,
                      [selectedProvider]: { ...currentConfig, authToken: e.target.value }
                    })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Sender Phone Number / Sender ID
                    </label>
                    <input
                      type="text"
                      value={currentConfig.fromNumber}
                      onChange={(e) => setConfigs({
                        ...configs,
                        [selectedProvider]: { ...currentConfig, fromNumber: e.target.value }
                      })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      India DLT Entity ID
                    </label>
                    <input
                      type="text"
                      value={currentConfig.dltEntityId || ''}
                      onChange={(e) => setConfigs({
                        ...configs,
                        [selectedProvider]: { ...currentConfig, dltEntityId: e.target.value }
                      })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setConfigs({
                      ...configs,
                      [selectedProvider]: { ...TELEPHONY_PROVIDERS[selectedProvider].defaultConfig }
                    });
                    showToast(`Reset ${providerMeta.name} credentials to verified sandbox defaults.`);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Reset to Certified Sandbox Presets
                </button>
              </div>
            </div>
          )}

          {/* LIVE DISPATCH RESULT LOG (if available) */}
          {lastResult && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl space-y-2 animate-in fade-in text-xs">
              <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                  <CheckCircle className="w-4 h-4 text-emerald-700" />
                  <span>Dispatch Confirmed via {TELEPHONY_PROVIDERS[lastResult.provider].name}</span>
                </div>
                <span className="font-mono text-emerald-800 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                  HTTP 201 Created • {lastResult.latencyMs}ms
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-emerald-950">
                <div>
                  <span className="text-emerald-700 font-semibold block">Message ID / SID:</span>
                  <span className="font-mono font-bold">{lastResult.messageId}</span>
                </div>
                <div>
                  <span className="text-emerald-700 font-semibold block">Carrier Routing:</span>
                  <span className="font-medium">{lastResult.carrier}</span>
                </div>
                <div>
                  <span className="text-emerald-700 font-semibold block">Timestamp:</span>
                  <span className="font-mono">{lastResult.timestamp}</span>
                </div>
                <div>
                  <span className="text-emerald-700 font-semibold block">Status:</span>
                  <span className="font-bold text-emerald-800 uppercase">{lastResult.status}</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* MODAL FOOTER */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Active Gateway: <strong className="text-slate-800">{providerMeta.name}</strong> API Node</span>
          </div>

          <button 
            onClick={handleModalClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors shadow-xs"
          >
            Close Telephony Sandbox
          </button>
        </div>

      </div>
    </div>
  );
};
