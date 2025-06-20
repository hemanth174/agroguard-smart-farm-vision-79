
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Navigation from '@/components/Navigation';
import DroneMonitor from '@/components/DroneMonitor';
import IoTDashboard from '@/components/IoTDashboard';
import WeatherDashboard from '@/components/WeatherDashboard';
import AlertsCard from '@/components/AlertsCard';
import MarketPricesCard from '@/components/MarketPricesCard';
import PlantHealthCard from '@/components/PlantHealthCard';
import FarmingServicesCard from '@/components/FarmingServicesCard';
import ChatbotAdvanced from '@/components/ChatbotAdvanced';
import SignIn from '@/components/SignIn';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/utils/i18n';
import { AlertTriangle } from 'lucide-react';

const Index = () => {
  const { language, user, isSignedIn, alerts, isOnline } = useApp();
  const { t } = useTranslation(language);

  if (!isSignedIn) {
    return <SignIn />;
  }

  const activeAlerts = alerts.filter(alert => !alert.resolved);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
            <p className="text-gray-600 mt-1">{t('welcome')}, {user?.name}</p>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></span>
              {t('location')}: {user?.location || t('detecting')}
            </p>
          </div>
          <div className="flex gap-3">
            <Badge variant="outline" className={`${isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {isOnline ? t('status') : t('offline')}
            </Badge>
          </div>
        </div>

        {/* Critical Alerts Banner */}
        {activeAlerts.length > 0 && (
          <div className="space-y-2">
            {activeAlerts.slice(0, 2).map((alert) => (
              <Alert key={alert.id} className={`border-l-4 ${
                alert.type === 'error' ? 'border-red-500 bg-red-50' : 
                alert.type === 'warning' ? 'border-orange-500 bg-orange-50' : 
                'border-blue-500 bg-blue-50'
              }`}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className={
                  alert.type === 'error' ? 'text-red-800' : 
                  alert.type === 'warning' ? 'text-orange-800' : 
                  'text-blue-800'
                }>
                  {alert.message}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Main Dashboard Content */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="services">{t('services')}</TabsTrigger>
            <TabsTrigger value="alerts">{t('alerts')}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AlertsCard language={language} />
              <MarketPricesCard language={language} />
              <PlantHealthCard language={language} />
            </div>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <DroneMonitor />
              </div>
              <div className="space-y-6">
                <IoTDashboard />
                <WeatherDashboard />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <FarmingServicesCard language={language} />
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <div className="grid gap-4">
              {activeAlerts.length > 0 ? (
                activeAlerts.map((alert) => (
                  <Alert key={alert.id} className={`border-l-4 ${
                    alert.type === 'error' ? 'border-red-500 bg-red-50' : 
                    alert.type === 'warning' ? 'border-orange-500 bg-orange-50' : 
                    'border-blue-500 bg-blue-50'
                  }`}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className={
                      alert.type === 'error' ? 'text-red-800' : 
                      alert.type === 'warning' ? 'text-orange-800' : 
                      'text-blue-800'
                    }>
                      <div className="flex justify-between items-start">
                        <div>
                          <p>{alert.message}</p>
                          <p className="text-xs mt-1 opacity-75">
                            {alert.timestamp.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))
              ) : (
                <Alert className="border-green-200 bg-green-50">
                  <AlertDescription className="text-green-800">
                    No active alerts. All systems are functioning normally.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <ChatbotAdvanced />
    </div>
  );
};

export default Index;
