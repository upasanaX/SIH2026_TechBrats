import React, { useState } from 'react';
import { DisasterAlert } from '../../types';
import { RiskBadge } from './RiskBadge';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Clock, 
  ShieldAlert, 
  Share2, 
  CheckSquare, 
  Square, 
  PhoneCall, 
  CheckCircle2, 
  Radio, 
  ExternalLink 
} from 'lucide-react';

interface AlertDetailModalProps {
  alert: DisasterAlert | null;
  onClose: () => void;
  onOpenSimulator: () => void;
}

export const AlertDetailModal: React.FC<AlertDetailModalProps> = ({ 
  alert, 
  onClose,
  onOpenSimulator 
}) => {
  const { acknowledgeAlert, showToast } = useApp();
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  if (!alert) return null;

  const toggleCheck = (idx: number) => {
    setCheckedItems(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleShare = () => {
    const text = `KrishiKavach ALERT: ${alert.title} for ${alert.affectedPanchayats.join(', ')}. Window: ${alert.timeWindow}. Check KrishiKavach app for details.`;
    navigator.clipboard?.writeText?.(text);
    showToast('Alert advisory text copied to clipboard. Ready to share via WhatsApp / SMS.');
  };

  const handleAcknowledge = () => {
    acknowledgeAlert(alert.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-start justify-between gap-4 border-b border-slate-800">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <RiskBadge severity={alert.severity} size="md" />
              <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5" />
                {alert.timeWindow}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {alert.title}
            </h2>
            <p className="text-xs text-slate-300">
              {alert.titleBengali} • {alert.titleHindi}
            </p>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Key Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-[11px] text-slate-500 font-medium">Confidence</div>
              <div className="text-lg font-extrabold text-emerald-700">{alert.confidence}%</div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1.5 overflow-hidden">
                <div 
                  className="bg-emerald-600 h-full rounded-full" 
                  style={{ width: `${alert.confidence}%` }} 
                />
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-[11px] text-slate-500 font-medium">Affected Area</div>
              <div className="text-sm font-bold text-slate-900 truncate">{alert.affectedPanchayats.length} Panchayats</div>
              <div className="text-[10px] text-slate-500 truncate mt-1">{alert.affectedPanchayats.join(', ')}</div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-[11px] text-slate-500 font-medium">SMS Sent</div>
              <div className="text-sm font-bold text-slate-900">{alert.broadcastStatus.smsSent} Handsets</div>
              <div className="text-[10px] text-emerald-600 font-medium mt-1">100% Dispatched</div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-[11px] text-slate-500 font-medium">IVR Calls</div>
              <div className="text-sm font-bold text-slate-900">{alert.broadcastStatus.ivrSent} Placed</div>
              <div className="text-[10px] text-blue-600 font-medium mt-1">Voice Connected</div>
            </div>
          </div>

          {/* Meteorological Summary */}
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase tracking-wide mb-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-700" />
              Meteorological Hazard Synopsis
            </div>
            <p className="text-sm text-slate-800 leading-relaxed">
              {alert.summary}
            </p>
            <div className="mt-2 text-[11px] text-slate-500">
              <span className="font-semibold text-slate-700">Source:</span> {alert.source}
            </div>
          </div>

          {/* Affected Crops */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Vulnerable Crops in Target Panchayats
            </h4>
            <div className="flex flex-wrap gap-2">
              {alert.affectedCrops.map((crop, idx) => (
                <span 
                  key={idx}
                  className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-800 rounded-lg text-xs font-semibold"
                >
                  🌾 {crop}
                </span>
              ))}
            </div>
          </div>

          {/* Action Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Recommended Farmer Action Checklist (Check to Track)
              </h4>
              <span className="text-xs text-slate-500 font-medium">
                {Object.values(checkedItems).filter(Boolean).length} of {alert.actionChecklist.length} completed
              </span>
            </div>

            <div className="space-y-2">
              {alert.actionChecklist.map((action, idx) => {
                const isChecked = !!checkedItems[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleCheck(idx)}
                    className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                      isChecked 
                        ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900 line-through opacity-80' 
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                    }`}
                  >
                    <button className="mt-0.5 shrink-0 text-emerald-700">
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                    <span className="text-xs leading-relaxed font-medium select-none">
                      {action}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSimulator}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>Simulate SMS / IVR Broadcast</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-100 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Share Advisory</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {alert.isAcknowledged ? (
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-4 h-4" />
                Acknowledged
              </span>
            ) : (
              <button
                onClick={handleAcknowledge}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
              >
                Acknowledge Alert
              </button>
            )}

            <button
              onClick={onClose}
              className="px-3 py-2 text-slate-600 hover:text-slate-800 text-xs font-medium"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
