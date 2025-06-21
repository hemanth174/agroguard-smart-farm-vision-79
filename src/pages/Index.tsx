
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Sidebar from '@/components/Sidebar';
import AIBot from '@/components/AIBot';
import EmergencySection from '@/components/EmergencySection';
import WeatherCard from '@/components/WeatherCard';
import DronePatrolCard from '@/components/DronePatrolCard';
import PlantHealthCard from '@/components/PlantHealthCard';
import MarketPricesCard from '@/components/MarketPricesCard';
import IoTSensorsCard from '@/components/IoTSensorsCard';
import AlertsCard from '@/components/AlertsCard';
import ShoppingService from '@/components/services/ShoppingService';
import DroneVideoDetection from '@/components/DroneVideoDetection';
import { useApp } from '@/contexts/AppContext';
import { useTranslation, Language } from '@/utils/i18n';

const Index = () => {
  const { language } = useApp();
  const { t } = useTranslation(language as Language);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderMainContent = () => {
    switch (activeSection) {
      case 'emergency':
        return <EmergencySection />;
      case 'alerts':
        return <AlertsCard language={language} />;
      case 'drone':
        return <DroneVideoDetection />;
      case 'shopping':
        return <ShoppingService />;
      default:
        return (
          <div className="space-y-6">
            {/* Hero Section */}
            <div className="text-center py-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t('welcomeToVillageEye')}
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Smart farming solutions with AI-powered monitoring, emergency services, and village management tools
              </p>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <WeatherCard language={language} location="Village Center" />
              <DronePatrolCard language={language} />
              <PlantHealthCard language={language} />
              <MarketPricesCard language={language} />
              <IoTSensorsCard language={language} />
              <AlertsCard language={language} />
            </div>

            {/* Emergency Section */}
            <EmergencySection />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Navigation */}
        <Navigation onMenuToggle={() => setSidebarOpen(true)} />

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {renderMainContent()}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 p-4 text-center text-sm text-gray-600 bg-white">
          Built for Smart Villages | Powered by AI & Innovation 🇮🇳
        </footer>
      </div>

      {/* AI Bot */}
      <AIBot />
    </div>
  );
};

export default Index;
