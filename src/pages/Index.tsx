
import React, { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation, Language } from '@/utils/i18n';
import SignIn from '@/components/SignIn';
import Navigation from '@/components/Navigation';
import ChatbotAdvanced from '@/components/ChatbotAdvanced';
import IoTDashboard from '@/components/IoTDashboard';
import WeatherService from '@/components/WeatherService';
import FarmingServicesCard from '@/components/FarmingServicesCard';
import DroneVideoUpload from '@/components/DroneVideoUpload';
import DroneVideoDetection from '@/components/DroneVideoDetection';
import DroneMonitor from '@/components/DroneMonitor';
import ContractsManagement from '@/components/ContractsManagement';
import PlantHealthDatabase from '@/components/PlantHealthDatabase';
import DrainagePlanner from '@/components/DrainagePlanner';
import IoTTester from '@/components/IoTTester';
import EmergencySection from '@/components/EmergencySection';
import ShoppingService from '@/components/services/ShoppingService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Users, Activity, Bell } from 'lucide-react';

const Index = () => {
  const { isSignedIn, language, user, alerts, iotData } = useApp();
  const { t } = useTranslation(language as Language);
  const [activeService, setActiveService] = useState<string | null>(null);
  const [realTimeStats, setRealTimeStats] = useState({
    totalFarms: 1247,
    onlineFarmers: 834,
    todayUpdates: 23
  });

  // Real-time stats updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeStats(prev => ({
        totalFarms: prev.totalFarms + Math.floor(Math.random() * 3),
        onlineFarmers: Math.max(800, prev.onlineFarmers + Math.floor(Math.random() * 10 - 5)),
        todayUpdates: prev.todayUpdates + Math.floor(Math.random() * 2)
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Move the conditional return AFTER all hooks
  if (!isSignedIn) {
    return <SignIn />;
  }

  const activeAlerts = alerts.filter(alert => !alert.resolved);

  const quickStats = [
    { label: t('totalFarms'), value: realTimeStats.totalFarms.toLocaleString(), icon: TrendingUp, color: 'text-green-600' },
    { label: t('activeAlerts'), value: activeAlerts.length.toString(), icon: Bell, color: 'text-red-600' },
    { label: t('onlineFarmers'), value: realTimeStats.onlineFarmers.toLocaleString(), icon: Users, color: 'text-blue-600' },
    { label: t('todayUpdates'), value: realTimeStats.todayUpdates.toString(), icon: Activity, color: 'text-purple-600' }
  ];

  const renderServiceContent = () => {
    switch (activeService) {
      case 'drone-video':
        return <DroneVideoUpload />;
      case 'drone-detection':
        return <DroneVideoDetection />;
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
      case 'shopping':
        return <ShoppingService />;
      default:
        return <FarmingServicesCard onServiceSelect={setActiveService} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 overflow-x-hidden">
      <Navigation />
      
      <main className="container mx-auto px-4 py-6 space-y-8 max-w-full">
        {/* Welcome Section */}
        <div id="dashboard" className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-4 md:p-6 text-white shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 truncate">
                {t('welcomeToVillageEye')}, {user?.name}!
              </h1>
              <p className="text-green-100 text-sm md:text-lg">
                {t('smartFarmingSolution')}
              </p>
            </div>
            <div className="flex-shrink-0">
              <Badge className="bg-white text-green-600 hover:bg-white text-xs md:text-sm">
                📍 {user?.location}
              </Badge>
            </div>
          </div>
        </div>

        {/* Quick Stats with Real-time Updates */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {quickStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow bg-white/80 backdrop-blur-sm">
              <CardContent className="p-3 md:p-4">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-xs md:text-sm font-medium text-gray-600 truncate">{stat.label}</p>
                    <p className="text-lg md:text-2xl font-bold text-gray-900 animate-pulse">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-6 w-6 md:h-8 md:w-8 ${stat.color} flex-shrink-0`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Video Detection Section */}
        <div id="ai-detection">
          <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl font-bold flex flex-col sm:flex-row sm:items-center gap-2">
                <span>🤖 AI Video Detection System</span>
                <Badge className="bg-green-100 text-green-800 text-xs">Telugu Alerts</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-hidden">
              <DroneVideoDetection />
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Grid */}
        <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6 min-w-0">
            {/* IoT Dashboard */}
            <div className="overflow-hidden">
              <IoTDashboard />
            </div>
            
            {/* Enhanced Weather Service */}
            <div className="overflow-hidden">
              <WeatherService />
            </div>
            
            {/* IoT Tester with Current Values */}
            <div className="overflow-hidden">
              <IoTTester />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4 md:space-y-6 min-w-0">
            {/* Emergency Section */}
            <div className="overflow-hidden">
              <EmergencySection />
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div id="services">
          <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle className="text-lg md:text-xl font-bold">{t('farmingServices')}</CardTitle>
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
            <CardContent className="overflow-hidden">
              <div className="max-w-full">
                {renderServiceContent()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Support Section */}
        <div id="support">
          <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl font-bold">{t('support')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <h3 className="text-base md:text-lg font-semibold mb-4">{t('contactSupport')}</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <span className="text-xl md:text-2xl">📞</span>
                    <div className="min-w-0">
                      <p className="font-medium text-sm md:text-base">{t('emergency')} / Customer Care</p>
                      <a href="tel:6305003695" className="text-green-600 hover:underline text-sm md:text-base">
                        6305003695
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <span className="text-xl md:text-2xl">💬</span>
                    <div className="min-w-0">
                      <p className="font-medium text-sm md:text-base">{t('aiChatbot')}</p>
                      <p className="text-xs md:text-sm text-gray-600">{t('aiChatbotDesc')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <span className="text-xl md:text-2xl">📧</span>
                    <div className="min-w-0">
                      <p className="font-medium text-sm md:text-base">Email Support</p>
                      <a href="mailto:support@villageeye.com" className="text-purple-600 hover:underline text-sm md:text-base break-all">
                        support@villageeye.com
                      </a>
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
