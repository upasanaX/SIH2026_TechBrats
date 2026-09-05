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
import { AccessibilityCommPage } from './pages/AccessibilityCommPage';
import { AboutSolutionPage } from './pages/AboutSolutionPage';
import { TechnicalArchitecturePage } from './pages/TechnicalArchitecturePage';
import { AuthPage } from './pages/AuthPage';
import { SettingsPage } from './pages/SettingsPage';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const renderActivePage = () => {
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
      case 'product':
        return <ProductDetailsPage />;
      case 'cart':
        return <CartOrderPage />;
      case 'government':
        return <GovernmentDashboardPage />;
      case 'communication':
        return <AccessibilityCommPage />;
      case 'about':
        return <AboutSolutionPage />;
      case 'architecture':
        return <TechnicalArchitecturePage />;
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
