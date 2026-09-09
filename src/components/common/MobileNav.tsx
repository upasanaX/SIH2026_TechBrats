import React from 'react';
import { useApp } from '../../context/AppContext';
import { LayoutDashboard, ShieldAlert, Store, ShoppingCart, ClipboardList, Menu } from 'lucide-react';

interface MobileNavProps {
  onOpenSidebar: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ onOpenSidebar }) => {
  const { activeTab, setActiveTab, alerts, currentPanchayat, t, currentRole } = useApp();

  const activeAlertCount = alerts.filter(
    a => a.primaryPanchayatId === currentPanchayat.id && (a.severity === 'critical' || a.severity === 'high')
  ).length;

  const isPrivileged = currentRole === 'fpo' || currentRole === 'government' || currentRole === 'official';
  const tabs = currentRole === 'consumer'
    ? [{ id: 'marketplace', label: t('navMarketplace'), icon: Store }, { id: 'cart', label: t('cartOrderFlow'), icon: ShoppingCart }]
    : isPrivileged
      ? [{ id: 'government', label: t('adminAnalytics'), icon: LayoutDashboard }, { id: 'alerts', label: t('navAlerts'), icon: ShieldAlert }]
      : [{ id: 'farmer', label: t('farmerRole'), icon: LayoutDashboard }, { id: 'alerts', label: t('navAlerts'), icon: ShieldAlert, badge: activeAlertCount > 0 ? activeAlertCount : undefined }, { id: 'farmer-orders', label: t('farmerOrders'), icon: ClipboardList }];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-lg px-2 py-1 flex items-center justify-around">
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors ${
              isActive ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-700 scale-110' : 'text-slate-500'} transition-transform`} />
              {tab.badge !== undefined && (
                <span className="absolute -top-1.5 -right-2 bg-red-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className="mt-0.5">{tab.label}</span>
          </button>
        );
      })}

      {/* More / Menu Drawer trigger */}
      <button
        onClick={onOpenSidebar}
        className="flex flex-col items-center py-1 px-2 text-[10px] font-semibold text-slate-500 hover:text-slate-800"
      >
        <Menu className="w-5 h-5" />
        <span className="mt-0.5">{t('platformOverview')}</span>
      </button>
    </div>
  );
};
