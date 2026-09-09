import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CROP_ADVISORIES } from '../data/advisories';
import { PANCHAYATS } from '../data/panchayats';
import { CropAdvisory, Language } from '../types';
import { ADVISORY_COPY, ADVISORY_REASONS } from '../utils/advisoryTranslations';
import { 
  Sprout, 
  Droplets, 
  Bug, 
  Beaker, 
  Package, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  Languages,
  Clock,
  Layers,
  HelpCircle
} from 'lucide-react';

export const CropAdvisoryPage: React.FC = () => {
  const { 
    currentPanchayat, 
    setCurrentPanchayat, 
    language, 
    setLanguage, 
    speakAdvisory, 
    isSpeaking, 
    stopSpeaking, 
    showToast 
  } = useApp();
  const copy = ADVISORY_COPY[language];

  const [selectedCropId, setSelectedCropId] = useState<string>('crop-paddy');
  const [selectedStage, setSelectedStage] = useState<string>('vegetative');
  const [selectedSoil, setSelectedSoil] = useState<string>('alluvial');

  const crops = [
    { id: 'crop-paddy', name: 'Aman Paddy (ধান)', hindi: 'अमन धान' },
    { id: 'crop-mustard', name: 'Yellow Mustard (সরিষা)', hindi: 'पीली सरसों' },
    { id: 'crop-potato', name: 'Potato Jyoti (আলু)', hindi: 'आलू ज्योति' },
    { id: 'crop-tomato', name: 'Hybrid Tomato (টমেটো)', hindi: 'टमाटर' }
  ];

  const stages = [
    { id: 'sowing', label: 'Sowing / Seedbed' },
    { id: 'vegetative', label: 'Vegetative Growth' },
    { id: 'flowering', label: 'Flowering & Fruit Set' },
    { id: 'harvesting', label: 'Maturity / Harvest' }
  ];

  // Match advisory
  const activeAdvisory = CROP_ADVISORIES.find(
    a => a.cropId === selectedCropId
  ) || CROP_ADVISORIES[0];

  const cropName = crops.find(c => c.id === selectedCropId)?.[language === 'bn' ? 'name' : language === 'hi' ? 'hindi' : 'name'] || activeAdvisory.cropName;
  const reason = ADVISORY_REASONS[activeAdvisory.id]?.[language] || activeAdvisory.reason;

  const getTranslated = (obj: { en: string; hi: string; bn: string }) => {
    return obj[language] || obj.en;
  };

  const handleSpeak = () => {
    const textToSpeak = `${cropName}, ${copy.voiceSummary}: ${getTranslated(activeAdvisory.todayAction)}. ${copy.irrigation}: ${getTranslated(activeAdvisory.irrigationGuidance)}. ${copy.why} ${reason}`;
    speakAdvisory(textToSpeak, language);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Top Advisory Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {copy.title}
            </h1>
            <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-sm border border-emerald-300">
              {copy.badge}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {copy.description}
          </p>
        </div>

        {/* Audio Advisory Trigger & Multilingual Switcher */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Language Selector */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => { setLanguage('en'); showToast('Advisory language: English'); }}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${language === 'en' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600'}`}
            >
              English
            </button>
            <button
              onClick={() => { setLanguage('hi'); showToast('परामर्श भाषा: हिंदी'); }}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${language === 'hi' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600'}`}
            >
              हिंदी
            </button>
            <button
              onClick={() => { setLanguage('bn'); showToast('পরামর্শের ভাষা: বাংলা'); }}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${language === 'bn' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600'}`}
            >
              বাংলা
            </button>
          </div>

          {/* Voice Synthesis Button */}
          {!isSpeaking ? (
            <button
              onClick={handleSpeak}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <Volume2 className="w-4 h-4" />
              <span>{copy.readAloud} ({language.toUpperCase()})</span>
            </button>
          ) : (
            <button
              onClick={stopSpeaking}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs animate-pulse"
            >
              <VolumeX className="w-4 h-4" />
              <span>{copy.stopAudio}</span>
            </button>
          )}
        </div>
      </div>

      {/* SELECTOR PANELS: CROP, GROWTH STAGE, PANCHAYAT, SOIL */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Crop Selector */}
        <div>
          <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1.5">
            {copy.selectCrop}
          </label>
          <select
            value={selectedCropId}
            onChange={(e) => setSelectedCropId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-600"
          >
            {crops.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Growth Stage */}
        <div>
          <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1.5">
            {copy.growthStage}
          </label>
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-600"
          >
            {stages.map(s => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Panchayat Location */}
        <div>
          <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1.5">
            {copy.panchayatSoil}
          </label>
          <select
            value={currentPanchayat.id}
            onChange={(e) => {
              const p = PANCHAYATS.find(x => x.id === e.target.value);
              if (p) setCurrentPanchayat(p);
            }}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-600"
          >
            {PANCHAYATS.map(p => (
              <option key={p.id} value={p.id}>{p.name} ({p.district})</option>
            ))}
          </select>
        </div>

        {/* Soil Type */}
        <div>
          <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1.5">
            {copy.soilTexture}
          </label>
          <select
            value={selectedSoil}
            onChange={(e) => setSelectedSoil(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-600"
          >
            <option value="alluvial">Clayey Alluvial (High Moisture)</option>
            <option value="loam">Gangetic Deep Loam</option>
            <option value="sandy">Sandy Loam (Quick Drainage)</option>
            <option value="saline">Coastal Saline Inundated</option>
          </select>
        </div>

      </div>

      {/* TODAY'S RECOMMENDATION HIGHLIGHT */}
      <div className="bg-emerald-900 text-white rounded-2xl p-6 shadow-md space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-200">
              {copy.priority} ({activeAdvisory.validityPeriod})
            </span>
          </div>

          <span className="px-2.5 py-0.5 rounded-sm bg-red-600 text-white text-[10px] font-extrabold uppercase tracking-wider">
            {copy.recommendation}: {activeAdvisory.priority}
          </span>
        </div>

        <h2 className="text-lg sm:text-xl font-bold leading-relaxed text-white">
          {getTranslated(activeAdvisory.todayAction)}
        </h2>

        {/* Explainability notice */}
        <div className="p-3 bg-emerald-950/70 border border-emerald-700/60 rounded-xl text-xs text-emerald-200 flex items-start gap-2">
          <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <strong>{copy.why}</strong> {reason}
          </div>
        </div>
      </div>

      {/* DETAILED ADVISORY CATEGORY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Irrigation Advice */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2.5 text-blue-700 font-bold text-sm pb-2 border-b border-slate-100">
            <Droplets className="w-5 h-5" />
            <h3>{copy.irrigation}</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
            {getTranslated(activeAdvisory.irrigationGuidance)}
          </p>
          <div className="text-[11px] text-slate-500 bg-blue-50/70 p-2.5 rounded-lg border border-blue-100">
            <strong>{copy.rule}</strong> {language === 'hi' ? 'जड़ की सहनशीलता से अधिक जलभराव से पत्तियों का रंग स्थायी रूप से फीका पड़ सकता है।' : language === 'bn' ? 'শিকড়ের সহনশীলতার বেশি জল জমলে পাতার রং স্থায়ীভাবে ফ্যাকাশে হতে পারে।' : 'Inundation exceeding root respiration tolerance causes irreversible chlorophyll bleaching.'}
          </div>
        </div>

        {/* Pest & Disease Precautions */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2.5 text-amber-700 font-bold text-sm pb-2 border-b border-slate-100">
            <Bug className="w-5 h-5" />
            <h3>{copy.pest}</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
            {getTranslated(activeAdvisory.pestDiseasePrecaution)}
          </p>
          <div className="text-[11px] text-slate-500 bg-amber-50/70 p-2.5 rounded-lg border border-amber-100">
            <strong>{copy.organic}</strong> {language === 'hi' ? 'हल्की बारिश में 5% नीम बीज अर्क (NSKE) रासायनिक दवाओं का विकल्प हो सकता है।' : language === 'bn' ? 'হালকা বৃষ্টিতে ৫% নিমবীজ নির্যাস (NSKE) রাসায়নিক ওষুধের বিকল্প হতে পারে।' : '5% Neem Seed Kernel Extract (NSKE) can substitute synthetic organophosphates if rain is light.'}
          </div>
        </div>

        {/* Fertilizer Application Timing */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2.5 text-emerald-700 font-bold text-sm pb-2 border-b border-slate-100">
            <Beaker className="w-5 h-5" />
            <h3>{copy.fertilizer}</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
            {getTranslated(activeAdvisory.fertilizerTiming)}
          </p>
          <div className="text-[11px] text-slate-500 bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-100">
            <strong>{copy.saving}</strong> {language === 'hi' ? 'उर्वरक बहने से रोकने पर इनपुट लागत में लगभग ₹1,200/बीघा की बचत होती है।' : language === 'bn' ? 'সার ধুয়ে যাওয়া রোধ করলে প্রায় ₹১,২০০/বিঘা খরচ বাঁচে।' : 'Preventing fertilizer leaching saves approximately ₹1,200/bigha in input replacement costs.'}
          </div>
        </div>

        {/* Harvest & Storage Precautions */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2.5 text-slate-800 font-bold text-sm pb-2 border-b border-slate-100">
            <Package className="w-5 h-5" />
            <h3>{copy.harvest}</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
            {getTranslated(activeAdvisory.harvestStorageAdvice)}
          </p>
          <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <strong>{copy.market}</strong> {language === 'hi' ? 'खराब होने से बचाने के लिए जल्दी कटाई हो तो सीधे बाजार में बेचें और बिचौलिया नुकसान से बचें।' : language === 'bn' ? 'নষ্ট হওয়া এড়াতে আগে ফসল কাটলে সরাসরি বাজারে বিক্রি করে মধ্যস্বত্বভোগীর ক্ষতি এড়ান।' : 'If crops are harvested early to avoid spoilage, use the Direct Marketplace to sell immediately without middleman loss.'}
          </div>
        </div>

      </div>

      {/* Advisory Verification Stamp */}
      <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between text-xs text-slate-600 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{copy.validated}</span>
        </div>
        <span className="font-mono text-slate-500">{copy.validity}</span>
      </div>

    </div>
  );
};
