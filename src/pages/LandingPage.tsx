import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldAlert, 
  Store, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  Building, 
  HeartHandshake, 
  Layers, 
  Sprout,
  Building2,
  Landmark,
  LogIn,
  ChevronRight
} from 'lucide-react';
import { LiveWeatherState } from '../components/common/LiveWeatherState';

export const LandingPage: React.FC = () => {
  const { setActiveTab, currentPanchayat, language, currentRole, setCurrentRole, weatherReading, liveWeatherLoading, liveWeatherError } = useApp();
  const landingCopy = {
    en: { badge: 'National Agri-Tech Initiative • Dual-Channel Agri-Defense', title: 'Weather intelligence that protects every Panchayat.', description: 'KrishiKavach transforms broad regional forecasts into village-accurate weather predictions, localized disaster early warnings, crop-saving advisories, and a direct farmer-to-consumer marketplace.', live: 'View Live Farmer Dashboard', explore: 'Explore Solution Architecture', ai: 'Panchayat-Level AI', warnings: 'Disaster Warnings', sales: 'Direct Sales Hub', channels: 'App, SMS & IVR', active: 'Active', inspect: 'Inspect Panchayat Micro-Grid Comparison' },
    hi: { badge: 'राष्ट्रीय कृषि-तकनीक पहल • दो-चैनल कृषि सुरक्षा', title: 'मौसम की जानकारी हर पंचायत की रक्षा करती है।', description: 'कृषिकवच क्षेत्रीय पूर्वानुमानों को गांव-स्तरीय मौसम जानकारी, स्थानीय आपदा चेतावनी, फसल सलाह और सीधे किसान-उपभोक्ता बाजार में बदलता है।', live: 'किसान डैशबोर्ड देखें', explore: 'समाधान वास्तुकला देखें', ai: 'पंचायत-स्तरीय AI', warnings: 'आपदा चेतावनियां', sales: 'सीधा बिक्री केंद्र', channels: 'ऐप, SMS और IVR', active: 'सक्रिय', inspect: 'पंचायत माइक्रो-ग्रिड तुलना देखें' },
    bn: { badge: 'জাতীয় কৃষি-প্রযুক্তি উদ্যোগ • দ্বৈত-চ্যানেল কৃষি সুরক্ষা', title: 'আবহাওয়ার তথ্য প্রতিটি পঞ্চায়েতকে সুরক্ষিত করে।', description: 'কৃষিকবচ আঞ্চলিক পূর্বাভাসকে গ্রাম-নির্ভুল আবহাওয়া, স্থানীয় দুর্যোগ সতর্কতা, ফসল পরামর্শ এবং সরাসরি কৃষক-ক্রেতা বাজারে রূপান্তর করে।', live: 'কৃষক ড্যাশবোর্ড দেখুন', explore: 'সমাধানের কাঠামো দেখুন', ai: 'পঞ্চায়েত-স্তরের AI', warnings: 'দুর্যোগ সতর্কতা', sales: 'সরাসরি বিক্রয় কেন্দ্র', channels: 'অ্যাপ, SMS ও IVR', active: 'সক্রিয়', inspect: 'পঞ্চায়েত মাইক্রো-গ্রিড তুলনা দেখুন' }
  }[language];
  const weather = weatherReading;

  const pillars = [
    {
      title: 'AI-Driven Downscaling',
      desc: 'Converts coarse 25km regional weather models into micro-topographical 2.5km Panchayat grids using elevation DEMs and machine learning.',
      icon: Layers,
      color: 'bg-emerald-700 text-white'
    },
    {
      title: 'Proactive Disaster Alerts',
      desc: 'Early warning sirens for heavy rain, hailstorms, high tidal surges, and heatwaves dispatched through App, SMS, and automated IVR voice calls.',
      icon: ShieldAlert,
      color: 'bg-red-700 text-white'
    },
    {
      title: 'Farmer-to-Consumer Market',
      desc: 'Direct digital mandi enabling distress-free sales to nearby urban consumers, eliminating commission middlemen and protecting farm margins.',
      icon: Store,
      color: 'bg-slate-800 text-white'
    }
  ];

  const workflowSteps = [
    { step: '01', title: 'Data Ingestion', desc: 'Continuous satellite, radar (IMD, NASA POWER, GIS) and ground meteorological ingestion.' },
    { step: '02', title: 'Topographical Downscaling', desc: 'XGBoost engine integrates terrain contours, soil moisture, and micro-convection dynamics.' },
    { step: '03', title: 'Panchayat Micro-Forecast', desc: 'Hyperlocal village-level temperature, rain probability, and gust velocity generated.' },
    { step: '04', title: 'Crop-Specific Advice', desc: 'Growth stage matching generates precise instructions: withhold fertilizer, drain bunds, or harvest early.' },
    { step: '05', title: 'Tri-Channel Dispatch', desc: 'Reaches farmers instantly across mobile smartphone app, basic feature-phone SMS, or regional IVR voice.' },
    { step: '06', title: 'Direct Market Liquidation', desc: 'Produce harvested ahead of impending weather hazards is listed directly for consumer purchase.' }
  ];

  const audiences = [
    { title: 'Smallholder Farmers', desc: 'Timely localized hazard protection, crop preservation, and direct pricing without mandi exploitation.', icon: Users },
    { title: 'FPOs & Cooperatives', desc: 'Bulk harvest aggregation, logistics coordination, and member disaster relief management.', icon: Building },
    { title: 'Government & Disaster Depts', desc: 'Real-time Panchayat risk heatmaps, automated early warning sirens, and verified impact logging.', icon: ShieldAlert },
    { title: 'NGOs & Extension Workers', desc: 'Hyperlocal advisory dissemination tools to assist remote villages with low digital literacy.', icon: HeartHandshake },
    { title: 'Conscious Consumers', desc: 'Fresh, traceable produce straight from verified rural growers at transparent, fair-trade prices.', icon: Store }
  ];

  const loginPortals = [
    {
      id: 'farmer' as const,
      label: '🌾 Farmer Portal',
      sub: 'Kisan ID, crop protection, hyperlocal weather & disaster alerts',
      icon: Sprout,
      gradient: 'from-emerald-600 to-emerald-800',
      border: 'border-emerald-700',
      badge: 'Growers & Producers',
      badgeBg: 'bg-emerald-500/20 text-emerald-200 border-emerald-600/40',
      role: 'farmer' as const
    },
    {
      id: 'consumer' as const,
      label: '🛒 Consumer Portal',
      sub: 'Fresh produce, direct farm-to-door mandi & transparent pricing',
      icon: Store,
      gradient: 'from-amber-600 to-orange-700',
      border: 'border-amber-700',
      badge: 'Urban Buyers',
      badgeBg: 'bg-amber-500/20 text-amber-200 border-amber-600/40',
      role: 'consumer' as const
    },
    {
      id: 'fpo' as const,
      label: '🏢 FPO Co-op Portal',
      sub: 'Bulk aggregation, member management & district monitoring',
      icon: Building2,
      gradient: 'from-indigo-600 to-indigo-800',
      border: 'border-indigo-700',
      badge: 'Cooperatives',
      badgeBg: 'bg-indigo-500/20 text-indigo-200 border-indigo-600/40',
      role: 'fpo' as const
    },
    {
      id: 'government' as const,
      label: '🏛️ Government Portal',
      sub: 'District agromet oversight, emergency broadcast & analytics',
      icon: Landmark,
      gradient: 'from-slate-700 to-slate-900',
      border: 'border-slate-600',
      badge: 'IMD & Agromet',
      badgeBg: 'bg-slate-500/20 text-slate-200 border-slate-500/40',
      role: 'government' as const
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200 py-16 lg:py-24">
        {/* Subtle background grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-60 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                {landingCopy.badge}
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
                {landingCopy.title}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                {landingCopy.description}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <button
                  onClick={() => {
                    const section = document.getElementById('login-portals');
                    section?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <span>{landingCopy.live}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActiveTab('about')}
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl font-bold text-sm transition-colors"
                >
                  About KrishiKavach
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-slate-700">{landingCopy.ai}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-slate-700">{landingCopy.warnings}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-slate-700">{landingCopy.sales}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-slate-700">{landingCopy.channels}</span>
                </div>
              </div>

            </div>

            {/* Hero Right: Live Dashboard Preview Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-300 overflow-hidden ring-1 ring-slate-200">
                
                <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                    <span className="text-xs font-mono text-slate-300 ml-2">Live Node: {currentPanchayat.name}</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-sm border border-emerald-500/30">
                    {landingCopy.active}
                  </span>
                </div>

                <div className="p-5 space-y-4">
                  <LiveWeatherState loading={liveWeatherLoading} error={liveWeatherError} />
                  
                  {/* Current Reading */}
                  <div className="flex items-center justify-between bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <div>
                      <div className="text-xs text-slate-500 font-medium">Downscaled Temp & Rain</div>
                      <div className="text-2xl font-black text-slate-900">{weather ? `${weather.temp.toFixed(1)}°C` : 'Unavailable'}</div>
                      <div className="text-xs text-emerald-700 font-semibold">{weather ? 'ML Downscaled' : 'Live weather unavailable'}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-500">Live Rainfall</div>
                      <div className="text-lg font-bold text-blue-600">{weather ? `${weather.rainfallMm.toFixed(1)} mm` : 'Unavailable'}</div>
                      <div className="text-[10px] text-slate-400">Open-Meteo forecast</div>
                    </div>
                  </div>

                  {/* Immediate Action Notice */}
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs space-y-1">
                    <div className="font-bold text-red-800 flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                      Immediate Action for Aman Paddy
                    </div>
                    <p className="text-red-900 leading-snug">
                      Review the live forecast before field work and follow official local advisories for emergency decisions.
                    </p>
                  </div>

                  {/* Channel Reach Demo */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg">
                      <div className="text-slate-500 text-[10px]">App Push</div>
                      <div className="font-bold text-slate-800">840 Sent</div>
                    </div>
                    <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg">
                      <div className="text-slate-500 text-[10px]">SMS Handsets</div>
                      <div className="font-bold text-emerald-700">1,420 Sent</div>
                    </div>
                    <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg">
                      <div className="text-slate-500 text-[10px]">Voice IVR</div>
                      <div className="font-bold text-blue-700">960 Calls</div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('weather')}
                    className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>{landingCopy.inspect}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section className="py-16 bg-slate-100 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-red-700 mb-2">The Critical Agriculture Blindspot</h2>
            <p className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Why District-Level Weather Forecasts Fail Indian Farmers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold">
                01
              </div>
              <h3 className="font-bold text-slate-900 text-base">Coarse Spatial Resolution</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Conventional forecasts average across 25–50 km grid cells. A single district may contain coastal marshes, dry plateaus, and river basins with wildly differing micro-climates.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold">
                02
              </div>
              <h3 className="font-bold text-slate-900 text-base">Adjacent Village Disparity</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Neighboring villages can experience very different conditions while a regional forecast remains unchanged.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold">
                03
              </div>
              <h3 className="font-bold text-slate-900 text-base">Delayed Hazard Warning</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Without village-level warnings 6 to 12 hours prior, farmers waste expensive fertilizers right before heavy rains wash them into drainage canals.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold">
                04
              </div>
              <h3 className="font-bold text-slate-900 text-base">Post-Disaster Distress Selling</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                When sudden rains damage standing crops, desperate farmers dump harvest with commission middlemen for 30–50% below fair farmgate value.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SOLUTION PILLARS */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2">The KrishiKavach Ecosystem</h2>
            <p className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Three Pillars Protecting the Farmer’s Crop & Income
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <div key={i} className="p-8 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 hover:border-emerald-500 transition-colors shadow-xs">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${pillar.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{pillar.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{pillar.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS: 6-STEP WORKFLOW */}
      <section className="py-16 bg-slate-100 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Operational Pipeline</h2>
            <p className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              From Cloud Ingestion to Direct Liquidation
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflowSteps.map((step, idx) => (
              <div key={idx} className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs space-y-2 relative overflow-hidden">
                <div className="text-2xl font-black text-emerald-700/30">
                  {step.step}
                </div>
                <h4 className="text-base font-bold text-slate-900">{step.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECT IMPACT TARGETS (Clearly labeled targets) */}
      <section className="py-16 bg-emerald-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs uppercase font-bold tracking-widest text-emerald-300 mb-1">
              Project Performance Objectives
            </div>
            <h2 className="text-2xl sm:text-4xl font-black">
              Quantifiable Impact Targets
            </h2>
            <p className="text-xs text-emerald-200 mt-2">
              (Empirical model estimates for Panchayat agro-climatic planning)
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-emerald-800/80 border border-emerald-700 rounded-xl text-center space-y-2">
              <div className="text-4xl font-black text-emerald-300">~30%</div>
              <div className="text-sm font-bold text-white">Less Crop Loss</div>
              <p className="text-xs text-emerald-100">Via 6-12 hr proactive micro-alerts prior to hailstorms and waterlogging.</p>
            </div>

            <div className="p-6 bg-emerald-800/80 border border-emerald-700 rounded-xl text-center space-y-2">
              <div className="text-4xl font-black text-emerald-300">20–30%</div>
              <div className="text-sm font-bold text-white">Income Improvement</div>
              <p className="text-xs text-emerald-100">By replacing commission intermediaries with direct farm-to-door sales.</p>
            </div>

            <div className="p-6 bg-emerald-800/80 border border-emerald-700 rounded-xl text-center space-y-2">
              <div className="text-4xl font-black text-emerald-300">1,000+</div>
              <div className="text-sm font-bold text-white">Target Panchayats</div>
              <p className="text-xs text-emerald-100">Horizontally scalable micro-grid backend deploying over rural cloud nodes.</p>
            </div>

            <div className="p-6 bg-emerald-800/80 border border-emerald-700 rounded-xl text-center space-y-2">
              <div className="text-4xl font-black text-emerald-300">3 Channels</div>
              <div className="text-sm font-bold text-white">Tri-Access Inclusion</div>
              <p className="text-xs text-emerald-100">Smartphone App, basic feature-phone SMS, and automated regional IVR voice calls.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TARGET AUDIENCE SECTION */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Stakeholder Architecture</h2>
            <p className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Empowering the Entire Rural Value Chain
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {audiences.map((aud, idx) => {
              const Icon = aud.icon;
              return (
                <div key={idx} className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{aud.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{aud.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* LOGIN PORTALS SECTION */}
      <section id="login-portals" className="py-20 bg-slate-900 relative overflow-hidden">
        {/* Decorative bg radial */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,#064e3b_0%,transparent_60%)] opacity-60 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,#1e3a5f_0%,transparent_60%)] opacity-50 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Secure Role-Based Access
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Choose Your Portal
            </h2>
            <p className="text-slate-400 text-sm mt-3 max-w-xl mx-auto">
              Each stakeholder has a dedicated, tailored experience. Select your role to access personalized dashboards, data, and tools.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {loginPortals.map((portal) => {
              const Icon = portal.icon;
              const isActive = currentRole === portal.role;
              return (
                <div
                  key={portal.id}
                  className={`relative group rounded-2xl overflow-hidden border cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl ${
                    isActive
                      ? `bg-gradient-to-br ${portal.gradient} ${portal.border} shadow-xl`
                      : 'bg-slate-800/80 border-slate-700 hover:border-slate-500'
                  }`}
                  onClick={() => {
                    setCurrentRole(portal.role);
                    setActiveTab('auth');
                  }}
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isActive ? 'bg-white/20' : 'bg-slate-700 group-hover:bg-slate-600'
                      } transition-colors`}>
                        <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-slate-300'}`} />
                      </div>
                      <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full border ${
                        isActive ? portal.badgeBg : 'bg-slate-700/60 text-slate-400 border-slate-600'
                      }`}>
                        {portal.badge}
                      </span>
                    </div>

                    <div>
                      <div className={`font-black text-base leading-tight ${
                        isActive ? 'text-white' : 'text-slate-100'
                      }`}>
                        {portal.label}
                      </div>
                      <p className={`text-xs mt-1.5 leading-relaxed ${
                        isActive ? 'text-white/75' : 'text-slate-400'
                      }`}>
                        {portal.sub}
                      </p>
                    </div>

                    <div className={`flex items-center gap-1.5 text-xs font-bold pt-1 ${
                      isActive ? 'text-white' : 'text-emerald-400 group-hover:text-emerald-300'
                    } transition-colors`}>
                      {isActive ? (
                        <><CheckCircle2 className="w-4 h-4" /> Current Role — Enter Portal</>
                      ) : (
                        <>Login as this role <ChevronRight className="w-3.5 h-3.5" /></>
                      )}
                    </div>
                  </div>

                  {/* Active glow ring */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-2xl ring-2 ring-white/30 pointer-events-none" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Role isolation note */}
          <div className="mt-10 text-center">
            <p className="text-xs text-slate-500 max-w-2xl mx-auto">
              🔒 <strong className="text-slate-400">Role Isolation Active:</strong> Farmers & Consumers access weather, crop advisory, and marketplace only. FPO & Government users additionally access district monitoring, disaster sirens, and SMS/IVR broadcast tools.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};
