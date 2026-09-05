import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Phone, MessageSquare, Volume2, VolumeX, Radio, CheckCircle, ShieldAlert } from 'lucide-react';

interface SmsIvrSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  alertTitle?: string;
  customMessage?: string;
}

export const SmsIvrSimulatorModal: React.FC<SmsIvrSimulatorModalProps> = ({ 
  isOpen, 
  onClose,
  alertTitle,
  customMessage
}) => {
  const { currentPanchayat, language, speakAdvisory, stopSpeaking, isSpeaking, showToast } = useApp();
  const [activeMode, setActiveMode] = useState<'sms' | 'ivr'>('sms');
  const [isCalling, setIsCalling] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

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

  const defaultSmsEn = `[KrishiKavach ALERT] High Risk Weather Warning for ${currentPanchayat.name} (${currentPanchayat.block}). Heavy rainfall (42mm) expected over next 12 hrs. Action: Open field drainage bunds, halt pesticide sprays, protect harvested produce. Helplines: 1800-180-1551.`;
  const defaultSmsHi = `[कृषिकवच चेतावनी] ${currentPanchayat.name} के लिए मौसम चेतावनी: अगले 12 घंटों में 42 मिमी भारी बारिश की आशंका। कृपया धान के खेतों में पानी निकासी की व्यवस्था करें और कीटनाशक छिड़काव रोकें।`;
  const defaultSmsBn = `[কৃষিকবচ জরুরি বার্তা] ${currentPanchayat.bengaliName} পঞ্চায়েতে আগামী ১২ ঘণ্টায় তীব্র বৃষ্টির (৪২ মিমি) সম্ভাবনা। আমন ধানের জমির অতিরিক্ত জল বের করার নালা খুলুন ও স্প্রে বন্ধ রাখুন।`;

  const smsText = customMessage || (
    language === 'hi' ? defaultSmsHi : language === 'bn' ? defaultSmsBn : defaultSmsEn
  );

  const ivrScriptEn = `Namaskar. This is an automated priority weather broadcast from KrishiKavach for ${currentPanchayat.name} Gram Panchayat. Doppler radar detects severe rainfall cells with 85% probability. Please do not apply fertilizers today and safeguard harvested crops. Press 1 to repeat, or press 9 to connect with your local FPO coordinator.`;
  const ivrScriptHi = `नमस्कार। यह ${currentPanchayat.name} ग्राम पंचायत के लिए कृषिकवच की ओर से स्वचालित मौसम आपातकालीन कॉल है। अगले 12 घंटों में तेज बारिश और जलभराव का खतरा है। अपनी फसलों को सुरक्षित रखें। पुनः सुनने के लिए 1 दबाएं।`;
  const ivrScriptBn = `নমস্কার। এটি ${currentPanchayat.bengaliName} গ্রাম পঞ্চায়েতের জন্য কৃষিকবচের স্বয়ংক্রিয় জরুরি আবহাওয়া বার্তা। আগামী কয়েক ঘণ্টায় ভারী বৃষ্টির সম্ভাবনা রয়েছে। জমির নিকাশি নালা পরিষ্কার রাখুন। পুনরায় শুনতে ১ টিপুন।`;

  const ivrText = language === 'hi' ? ivrScriptHi : language === 'bn' ? ivrScriptBn : ivrScriptEn;

  const handleStartCall = () => {
    setIsCalling(true);
    speakAdvisory(ivrText, language);
    showToast('IVR outbound call simulated. Playing audio advisory.');
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold">Inclusive Access Simulator</h2>
              <p className="text-xs text-slate-400">Panchayat SMS & IVR Automated Delivery Dispatch</p>
            </div>
          </div>
          <button 
            onClick={handleModalClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-100 p-1.5 gap-1.5">
          <button
            onClick={() => { setActiveMode('sms'); stopSpeaking(); setIsCalling(false); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-all ${
              activeMode === 'sms'
                ? 'bg-white text-emerald-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            Feature Phone SMS Broadcast
          </button>

          <button
            onClick={() => setActiveMode('ivr')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-all ${
              activeMode === 'ivr'
                ? 'bg-white text-emerald-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Phone className="w-4 h-4 text-blue-600" />
            Voice IVR Call Simulator
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {activeMode === 'sms' ? (
            /* SMS View Mockup */
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="font-semibold text-slate-700">Recipient Network: BSNL / Jio Rural Tower</span>
                <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-medium">GSM 7-bit Encoding</span>
              </div>

              {/* Realistic Mobile Screen Frame */}
              <div className="border-2 border-slate-700 bg-slate-900 rounded-2xl p-4 shadow-inner text-white">
                <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-slate-800">
                  <span>Sender: <strong className="text-emerald-400">KRISHI-KAVACH</strong></span>
                  <span>Today, 08:35 PM</span>
                </div>

                <div className="my-4 p-3.5 bg-slate-800/90 rounded-xl border border-slate-700 text-sm leading-relaxed text-slate-100">
                  <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold mb-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    PRIORITY DISASTER ADVISORY
                  </div>
                  {smsText}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
                  <span>Characters: {smsText.length} / 160 (1 SMS Credit)</span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle className="w-3.5 h-3.5" /> Delivered to 1,420 Handsets
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600">
                <p className="font-semibold text-slate-800 mb-1">How this helps farmers without smartphones:</p>
                <p>Even on ₹1,000 basic feature phones with zero internet or 2G connectivity, automated broadcast alerts arrive in the farmer’s regional language within 8 seconds of issuance.</p>
              </div>
            </div>
          ) : (
            /* IVR Call View Mockup */
            <div className="space-y-5">
              <div className="border-2 border-slate-800 bg-slate-950 rounded-2xl p-6 text-center text-white shadow-xl">
                <div className="w-16 h-16 mx-auto rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 text-emerald-400 mb-3 shadow-md">
                  <Phone className={`w-8 h-8 ${isCalling ? 'animate-bounce text-emerald-400' : 'text-slate-400'}`} />
                </div>

                <h3 className="text-lg font-bold text-slate-100">KrishiKavach Rural Helpline</h3>
                <p className="text-xs text-slate-400 mb-2">1800-180-1551 • Outbound Priority Broadcast</p>
                
                {isCalling ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Call in progress: {formatSeconds(callDuration)}
                  </div>
                ) : (
                  <span className="inline-block px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-medium">
                    Ready to simulate call
                  </span>
                )}

                {/* IVR Transcript */}
                <div className="mt-5 text-left p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-300 leading-relaxed max-h-28 overflow-y-auto">
                  <span className="text-[10px] uppercase font-bold text-blue-400 block mb-1">Spoken Audio Script:</span>
                  "{ivrText}"
                </div>

                {/* Call Control Buttons */}
                <div className="mt-6 flex items-center justify-center gap-4">
                  {!isCalling ? (
                    <button
                      onClick={handleStartCall}
                      className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-semibold text-sm shadow-lg transition-transform active:scale-95"
                    >
                      <Phone className="w-4 h-4" />
                      Simulate Incoming Call & Audio
                    </button>
                  ) : (
                    <button
                      onClick={handleEndCall}
                      className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold text-sm shadow-lg transition-transform active:scale-95"
                    >
                      <Phone className="w-4 h-4 rotate-135" />
                      End Call & Stop Audio
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 px-1">
                <span>Synthetic Audio: Web Speech Multilingual Synthesis</span>
                <span className="font-semibold text-slate-800">Panchayat: {currentPanchayat.name}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">Zero internet barrier for rural Indian agriculture</span>
          <button 
            onClick={handleModalClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
          >
            Close Simulator
          </button>
        </div>
      </div>
    </div>
  );
};
