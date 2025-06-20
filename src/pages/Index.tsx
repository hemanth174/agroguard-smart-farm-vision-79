
import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/utils/i18n';
import Navigation from '@/components/Navigation';
import SignIn from '@/components/SignIn';
import IoTDashboard from '@/components/IoTDashboard';
import DroneMonitor from '@/components/DroneMonitor';
import WeatherDashboard from '@/components/WeatherDashboard';
import WeatherService from '@/components/WeatherService';
import FarmingServicesCard from '@/components/FarmingServicesCard';
import ChatbotEnhanced from '@/components/ChatbotEnhanced';
import EmergencySection from '@/components/EmergencySection';
import DronePatrolCard from '@/components/DronePatrolCard';
import MarketPricesCard from '@/components/MarketPricesCard';
import PlantHealthCard from '@/components/PlantHealthCard';
import AdminDashboard from '@/components/AdminDashboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Shield, 
  ShoppingCart, 
  Video, 
  TrendingUp, 
  Droplets,
  Plane,
  FileText,
  Leaf,
  MessageCircle,
  Zap
} from 'lucide-react';

const Index = () => {
  const { isSignedIn, user, language } = useApp();
  const { t } = useTranslation(language);
  const [activeSection, setActiveSection] = useState('dashboard');

  if (!isSignedIn) {
    return <SignIn />;
  }

  // Check if user is admin
  if (user?.name === 'admin' || activeSection === 'admin') {
    return <AdminDashboard />;
  }

  const menuItems = [
    { id: 'dashboard', icon: Home, label: t('home') },
    { id: 'emergency', icon: Shield, label: language === 'en' ? 'Emergency' : language === 'hi' ? 'आपातकाल' : 'అత్యవసరం' },
    { id: 'shopping', icon: ShoppingCart, label: t('shopping') },
    { id: 'videos', icon: Video, label: t('videos') },
    { id: 'market', icon: TrendingUp, label: language === 'en' ? 'Market' : language === 'hi' ? 'बाज़ार' : 'మార్కెట్' },
    { id: 'drainage', icon: Droplets, label: language === 'en' ? 'Drainage' : language === 'hi' ? 'जल निकासी' : 'డ్రైనేజీ' },
    { id: 'drone-tech', icon: Plane, label: language === 'en' ? 'Drone Tech' : language === 'hi' ? 'ड्रोन तकनीक' : 'డ్రోన్ టెక్' },
    { id: 'contracts', icon: FileText, label: t('contracts') },
    { id: 'plant-health', icon: Leaf, label: language === 'en' ? 'Plant Health' : language === 'hi' ? 'पौधे का स्वास्थ्य' : 'మొక్క ఆరోగ్యం' },
    { id: 'weather', icon: Zap, label: language === 'en' ? 'Live Weather' : language === 'hi' ? 'मौसम' : 'వాతావరణం' },
    { id: 'admin', icon: Shield, label: 'Admin', adminOnly: true }
  ];

  const renderShoppingSection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">{t('shopping')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { name: 'Premium Seeds', price: '₹500/kg', category: 'Seeds', inStock: true, image: '🌱' },
          { name: 'Organic Fertilizer', price: '₹800/bag', category: 'Fertilizers', inStock: true, image: '🌿' },
          { name: 'Bio Pesticide', price: '₹1,200/L', category: 'Pesticides', inStock: false, image: '🧪' },
          { name: 'Irrigation Pipes', price: '₹150/meter', category: 'Tools', inStock: true, image: '🔧' },
          { name: 'Soil pH Tester', price: '₹2,500', category: 'Tools', inStock: true, image: '📊' },
          { name: 'Plant Growth Hormone', price: '₹600/bottle', category: 'Fertilizers', inStock: true, image: '💉' },
          { name: 'Garden Tools Set', price: '₹3,200', category: 'Tools', inStock: true, image: '🛠️' },
          { name: 'Greenhouse Kit', price: '₹15,000/kit', category: 'Infrastructure', inStock: false, image: '🏠' }
        ].map((product, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="text-4xl text-center mb-3">{product.image}</div>
              <h3 className="font-medium text-sm mb-1">{product.name}</h3>
              <p className="text-xs text-gray-500 mb-2">{product.category}</p>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-green-600">{product.price}</span>
                <Badge variant={product.inStock ? 'outline' : 'destructive'}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </Badge>
              </div>
              <Button 
                size="sm" 
                className="w-full" 
                disabled={!product.inStock}
                variant={product.inStock ? 'default' : 'outline'}
              >
                {product.inStock ? 'Add to Cart' : 'Notify Me'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderVideosSection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">{t('videos')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: 'Modern Irrigation Techniques', duration: '15:30', language: 'EN/HI/TE', views: '12K' },
          { title: 'Organic Farming Methods', duration: '12:45', language: 'EN/HI/TE', views: '8.5K' },
          { title: 'Crop Disease Prevention', duration: '18:20', language: 'EN/HI/TE', views: '15K' },
          { title: 'Soil Health Management', duration: '14:15', language: 'EN/HI/TE', views: '9.2K' },
          { title: 'Pest Control Strategies', duration: '16:50', language: 'EN/HI/TE', views: '11K' },
          { title: 'Harvest Optimization', duration: '13:30', language: 'EN/HI/TE', views: '7.8K' }
        ].map((video, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-lg h-32 mb-3 flex items-center justify-center text-white">
                <Video className="h-12 w-12" />
              </div>
              <h3 className="font-medium text-sm mb-2">{video.title}</h3>
              <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                <span>{video.duration}</span>
                <span>{video.views} views</span>
              </div>
              <Badge variant="outline" className="text-xs">{video.language}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderDroneTechSection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">
        {language === 'en' ? 'Smart Drone Technology' : language === 'hi' ? 'स्मार्ट ड्रोन तकनीक' : 'స్మార్ట్ డ్రోన్ టెక్నాలజీ'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          {
            title: language === 'en' ? 'Fertilizer Spraying' : language === 'hi' ? 'उर्वरक छिड़काव' : 'ఎరువుల స్ప్రేయింగ్',
            description: language === 'en' ? 'Automated drone fertilizer application' : language === 'hi' ? 'स्वचालित ड्रोन उर्वरक अनुप्रयोग' : 'ఆటోమేటెడ్ డ్రోన్ ఎరువుల అనువర్తనం',
            status: 'Available',
            icon: '💧'
          },
          {
            title: language === 'en' ? 'Precision Sowing' : language === 'hi' ? 'सटीक बुआई' : 'ఖచ్చితమైన విత్తనాలు',
            description: language === 'en' ? 'GPS-guided seed planting' : language === 'hi' ? 'GPS-निर्देशित बीज रोपण' : 'GPS-గైడెడ్ సీడ్ ప్లాంటింగ్',
            status: 'Coming Soon',
            icon: '🌱'
          },
          {
            title: language === 'en' ? 'Crop Monitoring' : language === 'hi' ? 'फसल निगरानी' : 'పంట పర్యవేక్షణ',
            description: language === 'en' ? 'Real-time crop health analysis' : language === 'hi' ? 'वास्तविक समय फसल स्वास्थ्य विश्लेषण' : 'రియల్ టైమ్ పంట ఆరోగ్య విశ్లేషణ',
            status: 'Active',
            icon: '📊'
          },
          {
            title: language === 'en' ? 'Harvest Insights' : language === 'hi' ? 'फसल अंतर्दृष्टि' : 'హార్వెస్ట్ అంతర్దృష్టులు',
            description: language === 'en' ? 'AI-powered harvest predictions' : language === 'hi' ? 'AI-संचालित फसल पूर्वानुमान' : 'AI-శక్తితో కూడిన హార్వెస్ట్ అంచనాలు',
            status: 'Beta',
            icon: '🚜'
          }
        ].map((tech, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{tech.icon}</span>
                  <CardTitle className="text-lg">{tech.title}</CardTitle>
                </div>
                <Badge variant={tech.status === 'Active' ? 'default' : tech.status === 'Available' ? 'outline' : 'secondary'}>
                  {tech.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{tech.description}</p>
              <Button 
                className="w-full" 
                disabled={tech.status === 'Coming Soon'}
                variant={tech.status === 'Active' ? 'default' : 'outline'}
              >
                {tech.status === 'Coming Soon' ? 'Notify When Ready' : 'Learn More'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderContractsSection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">{t('contracts')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          {
            title: 'Cotton Cultivation Contract',
            area: '5 acres',
            duration: '6 months',
            payment: '₹50,000',
            status: 'Open',
            type: 'Full Service'
          },
          {
            title: 'Organic Vegetable Farming',
            area: '2 acres',
            duration: '4 months',
            payment: '₹25,000',
            status: 'Limited Spots',
            type: 'Organic'
          },
          {
            title: 'Rice Cultivation',
            area: '10 acres',
            duration: '8 months',
            payment: '₹80,000',
            status: 'Open',
            type: 'Traditional'
          },
          {
            title: 'Tomato Greenhouse',
            area: '1 acre',
            duration: '6 months',
            payment: '₹35,000',
            status: 'Closing Soon',
            type: 'High-Tech'
          }
        ].map((contract, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{contract.title}</CardTitle>
                <Badge variant={contract.status === 'Open' ? 'default' : contract.status === 'Closing Soon' ? 'destructive' : 'secondary'}>
                  {contract.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Area:</span>
                  <span className="font-medium">{contract.area}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{contract.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment:</span>
                  <span className="font-bold text-green-600">{contract.payment}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium">{contract.type}</span>
                </div>
              </div>
              <Button 
                className="w-full" 
                disabled={contract.status === 'Closing Soon'}
                variant={contract.status === 'Open' ? 'default' : 'outline'}
              >
                {contract.status === 'Closing Soon' ? 'Application Closed' : t('apply')}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderCurrentSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <IoTDashboard />
                <DroneMonitor />
              </div>
              <div className="space-y-6">
                <WeatherService />
                <DronePatrolCard language={language} />
                <MarketPricesCard language={language} />
              </div>
            </div>
          </div>
        );
      case 'emergency':
        return <EmergencySection />;
      case 'shopping':
        return renderShoppingSection();
      case 'videos':
        return renderVideosSection();
      case 'market':
        return <MarketPricesCard language={language} />;
      case 'drainage':
        return <FarmingServicesCard language={language} />;
      case 'drone-tech':
        return renderDroneTechSection();
      case 'contracts':
        return renderContractsSection();
      case 'plant-health':
        return <PlantHealthCard language={language} />;
      case 'weather':
        return <WeatherService />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return renderCurrentSection();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        {/* Navigation Menu */}
        <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
          <div className="flex flex-wrap gap-2">
            {menuItems
              .filter(item => !item.adminOnly || user?.name === 'admin')
              .map((item) => (
              <Button
                key={item.id}
                variant={activeSection === item.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveSection(item.id)}
                className="flex items-center gap-2"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        {renderCurrentSection()}
      </div>

      <ChatbotEnhanced />
    </div>
  );
};

export default Index;
