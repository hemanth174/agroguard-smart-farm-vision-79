
import { useApp } from '@/contexts/AppContext';
import Navigation from '@/components/Navigation';
import WeatherService from '@/components/WeatherService';
import ChatbotEnhanced from '@/components/ChatbotEnhanced';
import AdminDashboard from '@/components/AdminDashboard';
import EmergencySection from '@/components/EmergencySection';
import DroneVideoInput from '@/components/DroneVideoInput';
import IoTTester from '@/components/IoTTester';
import { useTranslation, Language } from '@/utils/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Tractor, 
  ShoppingCart, 
  PlayCircle, 
  TrendingUp, 
  Droplets, 
  Bot,
  Leaf,
  FileText,
  Camera,
  AlertTriangle,
  Plane,
  MapPin,
  Phone,
  MessageSquare,
  Settings,
  Users,
  BarChart3,
  Calendar,
  Bell
} from 'lucide-react';
import { useState } from 'react';

const Index = () => {
  const { user, language, isAdmin } = useApp();
  const { t } = useTranslation(language as Language);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);

  const services = [
    {
      id: 'farming-shopping',
      title: t('farmingShoppingTitle'),
      description: t('farmingShoppingDesc'),
      icon: ShoppingCart,
      color: 'bg-green-100 text-green-700 hover:bg-green-200',
      category: 'farming'
    },
    {
      id: 'video-guides',
      title: t('videoGuidesTitle'),
      description: t('videoGuidesDesc'),
      icon: PlayCircle,
      color: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
      category: 'learning'
    },
    {
      id: 'market-prices',
      title: t('marketPricesTitle'),
      description: t('marketPricesDesc'),
      icon: TrendingUp,
      color: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
      category: 'market'
    },
    {
      id: 'drainage-planning',
      title: t('drainagePlanningTitle'),
      description: t('drainagePlanningDesc'),
      icon: Droplets,
      color: 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200',
      category: 'planning'
    },
    {
      id: 'smart-drone',
      title: t('smartDroneTitle'),
      description: t('smartDroneDesc'),
      icon: Plane,
      color: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
      category: 'technology'
    },
    {
      id: 'agri-contracts',
      title: t('agriContractsTitle'),
      description: t('agriContractsDesc'),
      icon: FileText,
      color: 'bg-orange-100 text-orange-700 hover:bg-orange-200',
      category: 'business'
    },
    {
      id: 'plant-health',
      title: t('plantHealthTitle'),
      description: t('plantHealthDesc'),
      icon: Leaf,
      color: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200',
      category: 'health'
    },
    {
      id: 'ai-chatbot',
      title: t('aiChatbotTitle'),
      description: t('aiChatbotDesc'),
      icon: Bot,
      color: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200',
      category: 'ai'
    }
  ];

  const quickStats = [
    { label: t('totalFarms'), value: '1,247', icon: MapPin, color: 'text-green-600' },
    { label: t('activeAlerts'), value: '23', icon: Bell, color: 'text-red-600' },
    { label: t('onlineFarmers'), value: '892', icon: Users, color: 'text-blue-600' },
    { label: t('todayUpdates'), value: '156', icon: BarChart3, color: 'text-purple-600' }
  ];

  const renderServiceContent = (serviceId: string) => {
    const mockData = {
      'farming-shopping': {
        title: t('farmingShoppingTitle'),
        content: (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: t('seeds'), price: '₹150/kg', image: '🌱', stock: 'In Stock' },
                { name: t('fertilizer'), price: '₹400/bag', image: '🧪', stock: 'Limited' },
                { name: t('tools'), price: '₹2,500', image: '🔧', stock: 'In Stock' },
                { name: t('pesticides'), price: '₹350/L', image: '🧴', stock: 'In Stock' }
              ].map((item, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="text-4xl mb-2">{item.image}</div>
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-lg font-bold text-green-600">{item.price}</p>
                    <Badge variant={item.stock === 'In Stock' ? 'default' : 'secondary'}>
                      {item.stock}
                    </Badge>
                    <Button className="w-full mt-2" size="sm">
                      {t('addToCart')}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )
      },
      'video-guides': {
        title: t('videoGuidesTitle'),
        content: (
          <div className="space-y-4">
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
              <PlayCircle className="w-16 h-16 text-gray-400" />
            </div>
            <h4 className="font-semibold">{t('organicFarmingGuide')}</h4>
            <p className="text-gray-600">{t('organicFarmingDesc')}</p>
          </div>
        )
      },
      'market-prices': {
        title: t('marketPricesTitle'),
        content: (
          <div className="space-y-4">
            {[
              { crop: t('rice'), price: '₹25/kg', change: '+2.3%', trend: 'up' },
              { crop: t('wheat'), price: '₹23/kg', change: '-1.2%', trend: 'down' },
              { crop: t('cotton'), price: '₹65/kg', change: '+5.1%', trend: 'up' },
              { crop: t('sugarcane'), price: '₹3.2/kg', change: '+0.8%', trend: 'up' }
            ].map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="font-medium">{item.crop}</span>
                <div className="text-right">
                  <div className="font-bold">{item.price}</div>
                  <div className={`text-sm ${item.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {item.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      },
      'drainage-planning': {
        title: t('drainagePlanningTitle'),
        content: <IoTTester />
      },
      'smart-drone': {
        title: t('smartDroneTitle'),
        content: <DroneVideoInput />
      },
      'agri-contracts': {
        title: t('agriContractsTitle'),
        content: (
          <div className="space-y-4">
            <p className="text-gray-600">Agricultural contract management system</p>
            <div className="grid gap-4">
              {[
                { type: 'Purchase Contract', status: 'Active', value: '₹2,50,000' },
                { type: 'Supply Agreement', status: 'Pending', value: '₹1,80,000' },
                { type: 'Service Contract', status: 'Completed', value: '₹95,000' }
              ].map((contract, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{contract.type}</h4>
                        <p className="text-sm text-gray-500">Value: {contract.value}</p>
                      </div>
                      <Badge variant={contract.status === 'Active' ? 'default' : 'secondary'}>
                        {contract.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )
      },
      'plant-health': {
        title: t('plantHealthTitle'),
        content: (
          <div className="space-y-4">
            <p className="text-gray-600">Monitor and analyze plant health conditions</p>
            <div className="grid gap-4">
              {[
                { field: 'Field A-12', health: 'Excellent', issues: 0, color: 'text-green-600' },
                { field: 'Field B-8', health: 'Good', issues: 1, color: 'text-blue-600' },
                { field: 'Field C-5', health: 'Warning', issues: 3, color: 'text-yellow-600' }
              ].map((field, index) => (
                <div key={index} className="flex justify-between items-center p-3 border rounded">
                  <div>
                    <h4 className="font-medium">{field.field}</h4>
                    <p className={`text-sm ${field.color}`}>{field.health}</p>
                  </div>
                  <Badge variant={field.issues === 0 ? 'default' : 'destructive'}>
                    {field.issues} Issues
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )
      },
      'ai-chatbot': {
        title: t('aiChatbotTitle'),
        content: (
          <div className="space-y-4">
            <p className="text-gray-600">AI-powered farming assistance and guidance</p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Sample conversation:</p>
              <div className="space-y-2">
                <div className="bg-blue-100 p-2 rounded text-sm">
                  User: "What's the best time to plant tomatoes?"
                </div>
                <div className="bg-green-100 p-2 rounded text-sm">
                  AI: "The best time to plant tomatoes is 2-3 weeks after the last frost date in your area. For your location in Telangana, this would typically be between February and March."
                </div>
              </div>
            </div>
          </div>
        )
      }
    };

    return mockData[serviceId] || { title: t('comingSoon'), content: <div>{t('featureComingSoon')}</div> };
  };

  if (showAdmin && isAdmin) {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('welcomeToAgroGuard')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              {t('smartFarmingSolution')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                {t('getStarted')}
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                {t('watchDemo')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4 text-center">
                <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Emergency Section */}
            <div className="mb-8">
              <EmergencySection />
            </div>

            {/* Services Grid */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  {t('farmingServices')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedService ? (
                  <div>
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedService(null)}
                      className="mb-4"
                    >
                      ← {t('backToServices')}
                    </Button>
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold">
                        {renderServiceContent(selectedService).title}
                      </h3>
                      {renderServiceContent(selectedService).content}
                    </div>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {services.map((service) => (
                      <Card 
                        key={service.id} 
                        className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                        onClick={() => setSelectedService(service.id)}
                      >
                        <CardContent className="p-6">
                          <div className={`w-12 h-12 rounded-lg ${service.color} flex items-center justify-center mb-4`}>
                            <service.icon className="w-6 h-6" />
                          </div>
                          <h3 className="font-semibold mb-2">{service.title}</h3>
                          <p className="text-sm text-gray-600">{service.description}</p>
                          <Badge variant="outline" className="mt-2">
                            {service.category}
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Admin Access */}
            {isAdmin && (
              <Card className="mb-8">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{t('adminPanel')}</h3>
                      <p className="text-sm text-gray-600">{t('manageSystem')}</p>
                    </div>
                    <Button onClick={() => setShowAdmin(true)}>
                      {t('openDashboard')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Weather Widget */}
            <WeatherService />

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {t('quickActions')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Phone className="w-4 h-4" />
                  {t('emergencyCall')}
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  {t('reportIssue')}
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <MessageSquare className="w-4 h-4" />
                  {t('contactSupport')}
                </Button>
              </CardContent>
            </Card>

            {/* Recent Updates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  {t('recentUpdates')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { title: t('weatherAlert'), time: '2 min ago', type: 'warning' },
                  { title: t('marketUpdate'), time: '15 min ago', type: 'info' },
                  { title: t('newGuide'), time: '1 hour ago', type: 'success' }
                ].map((update, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      update.type === 'warning' ? 'bg-yellow-500' :
                      update.type === 'info' ? 'bg-blue-500' : 'bg-green-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{update.title}</p>
                      <p className="text-xs text-gray-500">{update.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Enhanced Chatbot */}
      <ChatbotEnhanced />
    </div>
  );
};

export default Index;
