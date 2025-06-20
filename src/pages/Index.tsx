
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navigation from '@/components/Navigation';
import DronePatrolCard from '@/components/DronePatrolCard';
import IoTSensorsCard from '@/components/IoTSensorsCard';
import AlertsCard from '@/components/AlertsCard';
import WeatherCard from '@/components/WeatherCard';
import MarketPricesCard from '@/components/MarketPricesCard';
import PlantHealthCard from '@/components/PlantHealthCard';
import FarmingServicesCard from '@/components/FarmingServicesCard';
import ChatbotWidget from '@/components/ChatbotWidget';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [language, setLanguage] = useState('en');
  const [location, setLocation] = useState('Detecting...');
  const [user, setUser] = useState({ name: 'Farmer', mobile: '+91 98765 43210' });
  const { toast } = useToast();

  const translations = {
    en: {
      title: 'AgroGuard Dashboard',
      overview: 'Farm Overview',
      services: 'Services',
      alerts: 'Active Alerts',
      welcome: 'Welcome back',
      location: 'Location',
      status: 'All systems operational'
    },
    hi: {
      title: 'एग्रोगार्ड डैशबोर्ड',
      overview: 'खेत अवलोकन',
      services: 'सेवाएं',
      alerts: 'सक्रिय अलर्ट',
      welcome: 'वापसी पर स्वागत है',
      location: 'स्थान',
      status: 'सभी सिस्टम चालू हैं'
    },
    te: {
      title: 'అగ్రోగార్డ్ డ్యాష్‌బోర్డ్',
      overview: 'వ్యవసాయ అవలోకనం',
      services: 'సేవలు',
      alerts: 'క్రియాశీల హెచ్చరికలు',
      welcome: 'తిరిగి స్వాగతం',
      location: 'స్థానం',
      status: 'అన్ని వ్యవస్థలు పనిచేస్తున్నాయి'
    }
  };

  const t = translations[language];

  useEffect(() => {
    // Simulate location detection
    setTimeout(() => {
      setLocation('Telangana, India');
    }, 2000);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100">
      <Navigation language={language} setLanguage={setLanguage} user={user} />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
            <p className="text-gray-600 mt-1">{t.welcome}, {user.name}</p>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              {t.location}: {location}
            </p>
          </div>
          <div className="flex gap-3">
            <Badge variant="outline" className="bg-green-100 text-green-800">
              {t.status}
            </Badge>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3">
            <TabsTrigger value="overview">{t.overview}</TabsTrigger>
            <TabsTrigger value="services">{t.services}</TabsTrigger>
            <TabsTrigger value="alerts">{t.alerts}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <DronePatrolCard language={language} />
              <IoTSensorsCard language={language} />
              <WeatherCard language={language} location={location} />
              <AlertsCard language={language} />
            </div>

            {/* Main Content Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MarketPricesCard language={language} />
              <PlantHealthCard language={language} />
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <FarmingServicesCard language={language} />
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <div className="grid gap-4">
              <Alert className="border-orange-200 bg-orange-50">
                <AlertDescription className="text-orange-800">
                  Soil moisture low in Field A - Irrigation recommended
                </AlertDescription>
              </Alert>
              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">
                  Drone patrol completed - No issues detected
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <ChatbotWidget language={language} />
    </div>
  );
};

export default Index;
