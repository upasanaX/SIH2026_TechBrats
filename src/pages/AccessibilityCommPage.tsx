import React from 'react';
import { useApp } from '../context/AppContext';
import { Volume2, VolumeX } from 'lucide-react';

export const AccessibilityCommPage: React.FC = () => {
  const { 
    language, 
    speakAdvisory, 
    isSpeaking, 
    stopSpeaking, 
    currentPanchayat
  } = useApp();

  const sampleAdvisory = {
    en: `KrishiKavach Voice Broadcast for ${currentPanchayat.name}. Severe rainfall expected in next 12 hours. Please withhold fertilizer application and protect stored seeds.`,
    hi: `${currentPanchayat.name} के लिए कृषिकवच की आवाज सलाह। अगले 12 घंटों में भारी बारिश की संभावना है। कृपया खाद न डालें और कटी हुई फसलों को सुरक्षित करें।`,
    bn: `${currentPanchayat.bengaliName} পঞ্চায়েতের জন্য কৃষিকবচ ভয়েস পরামর্শ। আগামী ১২ ঘণ্টায় ভারী বৃষ্টির সম্ভাবনা। জমিতে সার প্রয়োগ বন্ধ রাখুন ও ফসল সুরক্ষিত করুন।`
  };

  const handleTestTTS = () => {
    speakAdvisory(sampleAdvisory[language], language);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      
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

    </div>
  );
};
