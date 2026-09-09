import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Role } from '../types';
import { FarmerLoginPage } from './auth/FarmerLoginPage';
import { ConsumerLoginPage } from './auth/ConsumerLoginPage';
import { FpoLoginPage } from './auth/FpoLoginPage';
import { GovernmentLoginPage } from './auth/GovernmentLoginPage';
import { AUTH_HUB_COPY } from '../utils/authTranslations';
import { 
  Sprout, 
  Store, 
  Building2, 
  Landmark, 
  ShieldCheck, 
  Lock, 
  CheckCircle2,
  Info
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { currentRole, language } = useApp();
  const hubCopy = AUTH_HUB_COPY[language];
  
  // Default to currentRole if it matches one of our 4 roles, otherwise 'farmer'
  const initialPortal: 'farmer' | 'consumer' | 'fpo' | 'government' = 
    (currentRole === 'consumer' || currentRole === 'fpo' || currentRole === 'government')
      ? currentRole
      : 'farmer';

  const [activePortal, setActivePortal] = useState<'farmer' | 'consumer' | 'fpo' | 'government'>(initialPortal);

  const portals = [
    {
      id: 'farmer' as const,
      label: hubCopy.farmer,
      sub: 'Kisan Identity & Crop Protection',
      icon: Sprout,
      activeColor: 'bg-emerald-700 text-white shadow-md border-emerald-800',
      tag: 'Producers & Growers'
    },
    {
      id: 'consumer' as const,
      label: hubCopy.consumer,
      sub: 'Direct Produce Mandi & Fresh Orders',
      icon: Store,
      activeColor: 'bg-amber-700 text-white shadow-md border-amber-800',
      tag: 'Urban Buyers'
    },
    {
      id: 'fpo' as const,
      label: hubCopy.fpo,
      sub: 'Bulk Aggregation & Member Logistics',
      icon: Building2,
      activeColor: 'bg-indigo-700 text-white shadow-md border-indigo-800',
      tag: 'Cooperative Societies'
    },
    {
      id: 'government' as const,
      label: hubCopy.government,
      sub: 'District Agromet & Emergency Broadcast',
      icon: Landmark,
      activeColor: 'bg-slate-900 text-white shadow-md border-slate-950',
      tag: 'IMD & Agromet Dept'
    }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      
      {/* Top Welcome & Portal Selector Hub */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>{hubCopy.badge}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {hubCopy.title}
            </h1>
            <p className="text-xs text-slate-500 max-w-xl">
              {hubCopy.description}
            </p>
          </div>

          <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 max-w-xs">
            <Info className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-[11px] leading-tight">
              {hubCopy.isolation}
            </span>
          </div>
        </div>

        {/* 4 Dedicated Portal Buttons */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {portals.map(p => {
            const Icon = p.icon;
            const isSelected = activePortal === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setActivePortal(p.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                  isSelected 
                    ? p.activeColor 
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-xl ${isSelected ? 'bg-white/20 text-white' : 'bg-white text-slate-700 shadow-2xs'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-sm ${
                    isSelected ? 'bg-black/30 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {p.tag}
                  </span>
                </div>
                
                <div className="font-extrabold text-sm">{p.label}</div>
                <div className={`text-[11px] mt-0.5 leading-snug line-clamp-2 ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                  {p.sub}
                </div>

                {isSelected && (
                  <div className="mt-2.5 flex items-center gap-1 text-[10px] font-bold text-white/90">
                    <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                    <span>{hubCopy.active}</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Dedicated Portal Login View */}
      {activePortal === 'farmer' && (
        <FarmerLoginPage onSwitchPortal={(target) => setActivePortal(target)} />
      )}

      {activePortal === 'consumer' && (
        <ConsumerLoginPage onSwitchPortal={(target) => setActivePortal(target)} />
      )}

      {activePortal === 'fpo' && (
        <FpoLoginPage onSwitchPortal={(target) => setActivePortal(target)} />
      )}

      {activePortal === 'government' && (
        <GovernmentLoginPage onSwitchPortal={(target) => setActivePortal(target)} />
      )}

    </div>
  );
};
