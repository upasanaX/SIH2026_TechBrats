import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage, showToast } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md animate-bounce-short">
      <div className="flex items-center justify-between gap-3 px-4 py-3 bg-slate-900 text-white rounded-lg shadow-xl border border-slate-700">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium text-slate-100">{toastMessage}</span>
        </div>
        <button 
          onClick={() => showToast('')}
          className="text-slate-400 hover:text-white p-1 rounded-sm transition-colors"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
