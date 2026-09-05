import React from 'react';
import { AlertSeverity } from '../../types';
import { AlertTriangle, ShieldAlert, AlertCircle, Info } from 'lucide-react';

interface RiskBadgeProps {
  severity: AlertSeverity;
  showIcon?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ 
  severity, 
  showIcon = true, 
  className = '',
  size = 'md'
}) => {
  const config = {
    critical: {
      bg: 'bg-red-800 text-white border-red-900',
      icon: ShieldAlert,
      label: 'Critical Risk',
      labelHi: 'गंभीर जोखिम',
      labelBn: 'জরুরি ঝুঁকি'
    },
    high: {
      bg: 'bg-red-600 text-white border-red-700',
      icon: AlertTriangle,
      label: 'High Risk',
      labelHi: 'उच्च जोखिम',
      labelBn: 'উচ্চ ঝুঁকি'
    },
    moderate: {
      bg: 'bg-amber-600 text-white border-amber-700',
      icon: AlertCircle,
      label: 'Moderate Risk',
      labelHi: 'मध्यम जोखिम',
      labelBn: 'মাঝারি ঝুঁকি'
    },
    info: {
      bg: 'bg-blue-600 text-white border-blue-700',
      icon: Info,
      label: 'Normal / Advisory',
      labelHi: 'सामान्य / सलाह',
      labelBn: 'স্বাভাবিক / পরামর্শ'
    }
  };

  const item = config[severity] || config.info;
  const IconComponent = item.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 font-medium gap-1',
    md: 'text-xs px-2.5 py-1 font-semibold gap-1.5',
    lg: 'text-sm px-3 py-1.5 font-bold gap-2'
  };

  return (
    <span 
      className={`inline-flex items-center rounded-md border tracking-wide uppercase shadow-xs ${item.bg} ${sizeClasses[size]} ${className}`}
      role="status"
    >
      {showIcon && <IconComponent className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />}
      <span>{item.label}</span>
    </span>
  );
};
