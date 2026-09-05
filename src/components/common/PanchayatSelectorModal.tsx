import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PANCHAYATS } from '../../data/panchayats';
import { Panchayat } from '../../types';
import { RiskBadge } from './RiskBadge';
import { MapPin, Search, Check, X, Users, Compass, ShieldAlert } from 'lucide-react';

interface PanchayatSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PanchayatSelectorModal: React.FC<PanchayatSelectorModalProps> = ({ isOpen, onClose }) => {
  const { currentPanchayat, setCurrentPanchayat, showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filtered = PANCHAYATS.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.block.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.bengaliName.includes(searchTerm) ||
    p.hindiName.includes(searchTerm)
  );

  const handleSelect = (panchayat: Panchayat) => {
    setCurrentPanchayat(panchayat);
    showToast(`Switched active location to ${panchayat.name} (${panchayat.block}).`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-600/30 rounded-lg border border-emerald-500/40 text-emerald-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Select Active Panchayat</h2>
              <p className="text-xs text-slate-300">Choose a location to view localized downscaled meteorology & alerts</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search by Panchayat name, block, or district..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
              autoFocus
            />
          </div>
        </div>

        {/* List of Panchayats */}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-2.5">
          {filtered.map(p => {
            const isSelected = p.id === currentPanchayat.id;
            return (
              <div 
                key={p.id}
                onClick={() => handleSelect(p)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  isSelected 
                    ? 'border-emerald-600 bg-emerald-50/60 shadow-xs ring-1 ring-emerald-600' 
                    : 'border-slate-200 bg-white hover:border-emerald-400 hover:bg-slate-50/80'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-bold text-slate-900 text-base">{p.name}</span>
                    <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 text-slate-600 rounded-sm">
                      {p.bengaliName} / {p.hindiName}
                    </span>
                    <RiskBadge severity={p.currentRisk} size="sm" />
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-600 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5 text-slate-400" />
                      {p.block}, {p.district}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      {p.registeredFarmers.toLocaleString()} Farmers
                    </span>
                    {p.activeAlertCount > 0 && (
                      <span className="flex items-center gap-1 text-red-600 font-semibold">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        {p.activeAlertCount} Active Warnings
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-500">
                    <span className="font-medium text-slate-700">Primary Crops:</span> {p.primaryCrops.join(', ')}
                  </div>
                </div>

                <div className="shrink-0">
                  {isSelected ? (
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-600 text-white shadow-xs">
                      <Check className="w-4 h-4" />
                    </span>
                  ) : (
                    <button className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-colors">
                      Select
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="py-8 text-center text-slate-500 text-sm">
              No Panchayats matched your search criteria. Try a different query.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Targeting 1,000+ Panchayats via KrishiKavach Cloud Grid</span>
          <button 
            onClick={onClose}
            className="px-3 py-1.5 text-slate-700 font-medium hover:text-slate-900"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
