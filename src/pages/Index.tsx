
import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation, Language } from '@/utils/i18n';
import SignIn from '@/components/SignIn';
import Navigation from '@/components/Navigation';
import ChatbotAdvanced from '@/components/ChatbotAdvanced';
import IoTDashboard from '@/components/IoTDashboard';
import WeatherService from '@/components/WeatherService';
import FarmingServicesCard from '@/components/FarmingServicesCard';
import DroneVideoUpload from '@/components/DroneVideoUpload';
import DroneMonitor from '@/components/DroneMonitor';
import ContractsManagement from '@/components/ContractsManagement';
import PlantHealthDatabase from '@/components/PlantHealthDatabase';
import DrainagePlanner from '@/components/DrainagePlanner';
import IoTTester from '@/components/IoTTester';
import EmergencySection from '@/components/EmergencySection';
import MarketPricesCard from '@/components/MarketPricesCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Users, Activity, Bell } from 'lucide-react';

const Index = () => {
  const { isSignedIn, language, user, alerts, iotData } = useApp();
  const { t } = useTranslation(language as Language);
  const [activeService, setActiveService] = useState<string | null>(null);

  if (!isSignedIn) {
    return <SignIn />;
  }

  const activeAlerts = alerts.filter(alert => !alert.resolved);

  const quickStats = [
    { label: t('totalFarms'), value: '1,247', icon: TrendingUp, color: 'text-green-600' },
    { label: t('activeAlerts'), value: activeAlerts.length.toString(), icon: Bell, color: 'text-red-600' },
    { label: t('onlineFarmers'), value: '834', icon: Users, color: 'text-blue-600' },
    { label: t('todayUpdates'), value: '23', icon: Activity, color: 'text-purple-600' }
  ];

  const renderServiceContent = () => {
    switch (activeService) {
      case 'drone-video':
        return <DroneVideoUpload />;
      case 'drone-monitor':
        return <DroneMonitor />;
      case 'contracts':
        return <ContractsManagement />;
      case 'plant-health':
        return <PlantHealthDatabase />;
      case 'drainage':
        return <DrainagePlanner />;
      case 'iot-tester':
        return <IoTTester />;
      default:
        return <FarmingServicesCard onServiceSelect={setActiveService} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-6 space-y-8">
        {/* Welcome Section */}
        <div id="dashboard" className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                {t('welcomeToVillageEye')}, {user?.name}!
              </h1>
              <p className="text-green-100 text-lg">
                {t('smartFarmingSolution')}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Badge className="bg-white text-green-600 hover:bg-white text-sm">
                📍 {user?.location}
              </Badge>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dashboard Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* IoT Dashboard */}
            <IoTDashboard />
            
            {/* Enhanced Weather Service */}
            <WeatherService />
            
            {/* IoT Tester */}
            <IoTTester />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Market Prices */}
            <MarketPricesCard language={language} />
            
            {/* Emergency Section */}
            <EmergencySection />
          </div>
        </div>

        {/* Services Section */}
        <div id="services">
          <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-bold">{t('farmingServices')}</CardTitle>
              {activeService && (
                <Button 
                  variant="outline" 
                  onClick={() => setActiveService(null)}
                  size="sm"
                >
                  {t('backToServices')}
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {renderServiceContent()}
            </CardContent>
          </Card>
        </div>

        {/* Market Section */}
        <div id="market">
          <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold">{t('marketPrices')}</CardTitle>
            </CardHeader>
            <CardContent>
              <MarketPricesCard language={language} />
            </CardContent>
          </Card>
        </div>

        {/* Support Section */}
        <div id="support">
          <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold">{t('support')} & {t('emergency')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <EmergencySection />
                <div>
                  <h3 className="text-lg font-semibold mb-4">{t('contactSupport')}</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <span className="text-2xl">📞</span>
                      <div>
                        <p className="font-medium">{t('emergency')} / Customer Care</p>
                        <a href="tel:6305003695" className="text-green-600 hover:underline">
                          6305003695
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <span className="text-2xl">💬</span>
                      <div>
                        <p className="font-medium">{t('aiChatbot')}</p>
                        <p className="text-sm text-gray-600">{t('aiChatbotDesc')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <span className="text-2xl">📧</span>
                      <div>
                        <p className="font-medium">Email Support</p>
                        <a href="mailto:support@villageeye.com" className="text-purple-600 hover:underline">
                          support@villageeye.com
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Chatbot */}
      <ChatbotAdvanced />
    </div>
  );
};

export default Index;
