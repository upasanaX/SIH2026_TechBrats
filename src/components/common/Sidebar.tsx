import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Home, 
  LayoutDashboard, 
  CloudSun, 
  ShieldAlert, 
  Sprout, 
  Map, 
  Store, 
  ShoppingCart, 
  Building2, 
  Radio, 
  HelpCircle, 
  Cpu, 
  LogIn, 
  Settings,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const { activeTab, setActiveTab, alerts, currentPanchayat, cart } = useApp();

  const activeAlertCount = alerts.filter(
    a => a.primaryPanchayatId === currentPanchayat.id && (a.severity === 'critical' || a.severity === 'high')
  ).length;

  const cartItemCount = cart.reduce((tot, i) => tot + i.quantity, 0);

  const navSections = [
    {
      title: 'Operational Hub',
      items: [
        { id: 'landing', label: 'Public Home', icon: Home },
        { id: 'farmer', label: 'Farmer Dashboard', icon: LayoutDashboard },
        { id: 'weather', label: 'Hyperlocal Weather', icon: CloudSun },
        { 
          id: 'alerts', 
          label: 'Disaster Alerts', 
          icon: ShieldAlert, 
          badge: activeAlertCount > 0 ? activeAlertCount : undefined,
          badgeColor: 'bg-red-600 text-white'
        },
        { id: 'advisory', label: 'Crop Advisory', icon: Sprout }
      ]
    },
    {
      title: 'Field & Direct Trade',
      items: [
        { id: 'map', label: 'Farm & Panchayat Map', icon: Map },
        { id: 'marketplace', label: 'Direct Marketplace', icon: Store },
        { 
          id: 'cart', 
          label: 'Cart & Order Flow', 
          icon: ShoppingCart,
          badge: cartItemCount > 0 ? cartItemCount : undefined,
          badgeColor: 'bg-emerald-600 text-white'
        }
      ]
    },
    {
      title: 'Governance & Reach',
      items: [
        { id: 'government', label: 'FPO / Govt Monitoring', icon: Building2 },
        { id: 'communication', label: 'SMS & IVR Center', icon: Radio }
      ]
    },
    {
      title: 'Platform Overview',
      items: [
        { id: 'about', label: 'About KrishiKavach', icon: HelpCircle },
        { id: 'architecture', label: 'Technical Architecture', icon: Cpu },
        { id: 'auth', label: 'Login & Registration', icon: LogIn },
        { id: 'settings', label: 'Settings & Privacy', icon: Settings }
      ]
    }
  ];

  return (
    <aside 
      className={`fixed lg:sticky top-[61px] left-0 z-30 h-[calc(100vh-61px)] w-64 bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        
        {navSections.map((sec, idx) => (
          <div key={idx} className="space-y-1">
            <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {sec.title}
            </div>
            {sec.items.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (onClose) onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all group ${
                    isActive 
                      ? 'bg-emerald-700 text-white shadow-xs font-bold' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-400'
                    }`} />
                    <span>{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.badge !== undefined && (
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${item.badgeColor || 'bg-slate-700 text-slate-300'}`}>
                        {item.badge}
                      </span>
                    )}
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-emerald-200" />}
                  </div>
                </button>
              );
            })}
          </div>
        ))}

      </div>

      {/* Sidebar Footer Badge */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60">
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-slate-800/80 border border-slate-700/60 text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
          <div className="truncate">
            <div className="font-bold text-slate-100 truncate">Panchayat Grid v2.4</div>
            <div className="text-[10px] text-slate-400">All local nodes synchronized</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
