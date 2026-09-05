import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Layers, 
  Sprout, 
  Store, 
  Radio, 
  Award, 
  Lightbulb, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Cpu,
  HeartHandshake,
  Globe2
} from 'lucide-react';

export const AboutSolutionPage: React.FC = () => {
  const { setActiveTab } = useApp();

  const uniquenessPoints = [
    {
      title: 'Dual Protection: Shields & Sells the Harvest',
      desc: 'Most agri-apps stop at weather charts or isolated marketplaces. KrishiKavach is an end-to-end ecosystem that provides proactive crop defense before disaster strikes, and an immediate direct liquidation channel if pre-disaster harvesting is necessary.'
    },
    {
      title: 'Panchayat & Catchment-Oriented Downscaling',
      desc: 'Bypasses conventional 25km district averages by incorporating micro-elevation DEMs, local water bodies, and soil moisture saturation to generate actionable village-level micro-forecasts.'
    },
    {
      title: 'Farmer-First Jargon-Free Presentation',
      desc: 'Translates millibar pressure indices and convective CAPE values into plain actionable instructions: "Do not apply urea today", "Open corner bund drains", "Secure harvested mustard under poly sheets".'
    },
    {
      title: 'Zero-Digital-Divide Multi-Channel Delivery',
      desc: 'Ensures equitable access across modern smartphone apps, basic ₹1,000 keypad feature phones (SMS), and regional automated IVR voice calls in Hindi and Bengali.'
    }
  ];

  const feasibilityPoints = [
    {
      title: 'Software-First Architecture',
      desc: 'Requires no expensive physical hardware deployment on farmer fields. Uses existing meteorological satellite telemetry, open GIS data, and cloud-native serverless compute.'
    },
    {
      title: 'Open Data & API Integration Points',
      desc: 'Pre-architected to ingest IMD Doppler radars, NASA POWER solar datasets, ISRO/Bhuvan topography, and OpenStreetMap administrative boundary layers.'
    },
    {
      title: 'Extensible to Rural FPOs & Cooperatives',
      desc: 'Leverages existing Primary Agricultural Credit Societies (PACS) and FPOs as local aggregation points, minimizing supply-chain onboarding friction.'
    }
  ];

  const viabilityPoints = [
    {
      metric: '~30%',
      label: 'Crop Loss Mitigation',
      desc: 'Proactive 6–12 hour early warnings prevent waterlogging rot, hail shattering, and unabsorbed fertilizer runoff.'
    },
    {
      metric: '20–30%',
      label: 'Direct Income Boost',
      desc: 'Eliminating the 35% commission margin extracted by commission intermediaries during distress weather sales.'
    },
    {
      metric: '100%',
      label: 'Open-Source Stack',
      desc: 'Utilizes React, FastAPI, PostgreSQL/PostGIS, and XGBoost, ensuring zero proprietary software licensing overhead for state governments.'
    },
    {
      metric: '3 Channels',
      label: 'Inclusive Accessibility',
      desc: 'Reaches both high-tech modern farmers and marginal smallholders without data connections.'
    }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-10">
      
      {/* Top Hero Showcase */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold">
            <Award className="w-4 h-4 text-emerald-700" />
            National Agro-Meteorological Defense Initiative
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            KrishiKavach (कृषिकवच / কৃষিকবচ)
          </h1>

          <p className="text-base text-slate-600 leading-relaxed">
            A farmer-first digital ecosystem transforming broad meteorological data into hyperlocal Panchayat-level early warnings, agronomic advisories, and a direct marketplace to protect farmer yields and income.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('farmer')}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2"
            >
              <span>Explore Live Prototype</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('architecture')}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold border border-slate-300"
            >
              View System Architecture
            </button>
          </div>
        </div>
      </div>

      {/* PROBLEM & SOLUTION SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* The Problem */}
        <div className="bg-red-50/70 rounded-3xl p-8 border border-red-200 space-y-4">
          <div className="text-xs font-bold uppercase text-red-700 tracking-wider">The Rural Problem</div>
          <h2 className="text-2xl font-black text-slate-900">Macro Weather Blindspots & Distress Selling</h2>
          
          <ul className="space-y-3 text-xs text-slate-700 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 shrink-0" />
              <span><strong>Macro Distortion:</strong> District-level forecasts (25km resolution) report mild clouds while low-lying wetland Panchayats experience destructive localized downpours.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 shrink-0" />
              <span><strong>Catastrophic Input Loss:</strong> Farmers apply costly nitrogen and foliar sprays hours before unexpected squalls wash them into river canals.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 shrink-0" />
              <span><strong>Middleman Exploitation:</strong> Perishable harvests harvested prematurely to prevent rot are dumped at distress rates to local agents taking 35% cuts.</span>
            </li>
          </ul>
        </div>

        {/* The Solution */}
        <div className="bg-emerald-50/70 rounded-3xl p-8 border border-emerald-200 space-y-4">
          <div className="text-xs font-bold uppercase text-emerald-800 tracking-wider">The KrishiKavach Solution</div>
          <h2 className="text-2xl font-black text-slate-900">Panchayat Micro-Grid & Direct Liquidation</h2>
          
          <ul className="space-y-3 text-xs text-slate-800 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 mt-1.5 shrink-0" />
              <span><strong>Topographic Downscaling:</strong> Downscales regional forecasts into 2.5km village grids incorporating elevation DEMs and soil moisture index.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 mt-1.5 shrink-0" />
              <span><strong>Phenological Advisories:</strong> Translates rain projections into actionable field actions tailored to crop growth stage (Paddy, Mustard, Potato, Tomato).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 mt-1.5 shrink-0" />
              <span><strong>Direct Marketplace:</strong> Connects farmers directly with urban consumers and cooperatives at transparent, fair prices with instant settlement.</span>
            </li>
          </ul>
        </div>

      </div>

      {/* UNIQUENESS SECTION */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="space-y-1">
          <div className="text-xs font-bold uppercase text-emerald-700 tracking-wider">Competitive Differentiation</div>
          <h2 className="text-2xl font-black text-slate-900">What Makes KrishiKavach Unique?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {uniquenessPoints.map((pt, i) => (
            <div key={i} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{pt.title}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{pt.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FEASIBILITY & VIABILITY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Feasibility (6 Cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-5">
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase text-blue-700 tracking-wider">Implementation Viability</div>
            <h3 className="text-xl font-black text-slate-900">Practical & Scalable Rollout</h3>
          </div>

          <div className="space-y-3.5">
            {feasibilityPoints.map((pt, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <h4 className="font-bold text-slate-900 text-xs">{pt.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{pt.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Viability Metrics (6 Cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-5">
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase text-emerald-700 tracking-wider">Socio-Economic Impact</div>
            <h3 className="text-xl font-black text-slate-900">Economic & Agronomic Viability</h3>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            {viabilityPoints.map((v, i) => (
              <div key={i} className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
                <div className="text-2xl font-black text-emerald-800">{v.metric}</div>
                <div className="text-xs font-bold text-slate-900">{v.label}</div>
                <p className="text-[11px] text-slate-600 leading-snug">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
