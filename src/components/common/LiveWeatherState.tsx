import React from 'react';
import { AlertCircle, LoaderCircle } from 'lucide-react';

interface LiveWeatherStateProps {
  loading: boolean;
  error: string | null;
}

export const LiveWeatherState: React.FC<LiveWeatherStateProps> = ({ loading, error }) => {
  if (!loading && !error) return null;
  return (
    <div className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-xs ${error ? 'border-red-200 bg-red-50 text-red-800' : 'border-emerald-200 bg-emerald-50 text-emerald-800'}`}>
      {error ? <AlertCircle className="w-4 h-4 shrink-0" /> : <LoaderCircle className="w-4 h-4 shrink-0 animate-spin" />}
      <span>{error || 'Loading live weather...'}</span>
    </div>
  );
};