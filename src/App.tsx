import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { MobileNav } from './components/common/MobileNav';
import { Toast } from './components/common/Toast';

// Pages
import { LandingPage } from './pages/LandingPage';
import { FarmerDashboardPage } from './pages/FarmerDashboardPage';
import { HyperlocalWeatherPage } from './pages/HyperlocalWeatherPage';
import { DisasterAlertsPage } from './pages/DisasterAlertsPage';
import { CropAdvisoryPage } from './pages/CropAdvisoryPage';
import { FarmMapPage } from './pages/FarmMapPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { CartOrderPage } from './pages/CartOrderPage';
import { GovernmentDashboardPage } from './pages/GovernmentDashboardPage';
import { AboutSolutionPage } from './pages/AboutSolutionPage';
import { AuthPage } from './pages/AuthPage';
import { SettingsPage } from './pages/SettingsPage';
import { FarmerListingPage } from './pages/FarmerListingPage';
import { FarmerOrdersPage } from './pages/FarmerOrdersPage';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, currentRole, isAuthenticated } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const allowedTabsByRole: Record<string, string[]> = {
    farmer: ['farmer', 'alerts', 'about', 'settings', 'auth', 'farmer-listing', 'farmer-orders'],
    consumer: ['marketplace', 'product', 'cart', 'about', 'settings', 'auth'],
    fpo: ['government', 'alerts', 'about', 'settings', 'auth'],
    government: ['government', 'alerts', 'about', 'settings', 'auth'],
    official: ['government', 'alerts', 'about', 'settings', 'auth']
  };

  const roleHome = currentRole === 'consumer' ? 'marketplace' : (currentRole === 'fpo' || currentRole === 'government' || currentRole === 'official') ? 'government' : 'farmer';
  const isUnauthenticated = !isAuthenticated && activeTab !== 'auth';
  const isUnauthorizedTab = isAuthenticated && activeTab !== 'auth' && !allowedTabsByRole[currentRole]?.includes(activeTab);

  useEffect(() => {
    if (isUnauthenticated) setActiveTab('auth');
    else if (isUnauthorizedTab) setActiveTab(roleHome);
  }, [isUnauthenticated, isUnauthorizedTab, roleHome, setActiveTab]);

  const isGovtOrFpo = currentRole === 'fpo' || currentRole === 'government' || currentRole === 'official';
  const isRestrictedTab = activeTab === 'government' && !isGovtOrFpo;

  const renderAccessRestricted = () => (
    <div className="p-6 sm:p-12 max-w-2xl mx-auto text-center space-y-6 animate-in fade-in">
      <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center shadow-md">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>

      <div className="space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider bg-red-100 text-red-800 px-3 py-1 rounded-full border border-red-200">
          Role-Based Access Control
        </span>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Governance & Reach Center is Restricted
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
          You are currently logged in as a <strong>{currentRole.toUpperCase()}</strong>. District oversight heatmaps, disaster sirens, and SMS/IVR broadcast tools are strictly reserved for FPO coordinators and Government Agromet authorities.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          onClick={() => setActiveTab(currentRole === 'consumer' ? 'marketplace' : 'farmer')}
          className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
        >
          {currentRole === 'consumer' ? 'Return to Marketplace' : 'Return to Farmer Dashboard'}
        </button>

        <button
          onClick={() => setActiveTab('auth')}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
        >
          Switch to FPO or Government Portal
        </button>
      </div>
    </div>
  );

  const renderActivePage = () => {
    if (isUnauthenticated) {
      return <AuthPage />;
    }

    if (isUnauthorizedTab || isRestrictedTab) {
      return renderAccessRestricted();
    }

    switch (activeTab) {
      case 'landing':
        return <LandingPage />;
      case 'farmer':
        return <FarmerDashboardPage />;
      case 'weather':
        return <HyperlocalWeatherPage />;
      case 'alerts':
        return <DisasterAlertsPage />;
      case 'advisory':
        return <CropAdvisoryPage />;
      case 'map':
        return <FarmMapPage />;
      case 'marketplace':
        return <MarketplacePage />;
      case 'farmer-listing':
        return <FarmerListingPage />;
      case 'farmer-orders':
        return <FarmerOrdersPage />;
      case 'product':
        return <ProductDetailsPage />;
      case 'cart':
        return <CartOrderPage />;
      case 'government':
        return <GovernmentDashboardPage />;
      case 'about':
        return <AboutSolutionPage />;
      case 'auth':
        return <AuthPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-emerald-200 selection:text-emerald-950">
      
      {/* Top Header */}
      <Header onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex-1 flex w-full relative">
        
        {/* Left Sidebar */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />

        {/* Backdrop for Mobile Sidebar Drawer */}
        {isSidebarOpen && (
          <div 
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-20 bg-slate-950/50 backdrop-blur-2xs lg:hidden"
          />
        )}

        {/* Main Content Viewport */}
        <main className="flex-1 w-full pb-20 lg:pb-12 min-w-0">
          {renderActivePage()}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav onOpenSidebar={() => setIsSidebarOpen(true)} />

      {/* Global Toast Notification System */}
      <Toast />

    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
