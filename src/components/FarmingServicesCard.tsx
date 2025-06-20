
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  PlayCircle, 
  Wrench, 
  FileText, 
  Droplets,
  Database,
  Video,
  Globe,
  AlertTriangle,
  Users
} from 'lucide-react';
import DrainagePlanner from './DrainagePlanner';
import PlantHealthDatabase from './PlantHealthDatabase';
import DroneVideoUpload from './DroneVideoUpload';
import IoTTester from './IoTTester';
import ContractsManagement from './ContractsManagement';
import { useTranslation, Language } from '@/utils/i18n';
import { useApp } from '@/contexts/AppContext';

interface FarmingServicesCardProps {
  onServiceSelect?: (serviceId: string | null) => void;
}

const FarmingServicesCard = ({ onServiceSelect }: FarmingServicesCardProps) => {
  const { language } = useApp();
  const { t } = useTranslation(language as Language);
  const [activeService, setActiveService] = useState<string | null>(null);

  const services = [
    {
      id: 'shopping',
      icon: ShoppingCart,
      title: t('shopping'),
      description: 'Browse & buy tools, fertilizers, pesticides',
      color: 'blue',
      action: t('browse')
    },
    {
      id: 'videos',
      icon: PlayCircle,
      title: t('videoGuides'),
      description: 'Language-based YouTube video tutorials',
      color: 'green',
      action: t('watch')
    },
    {
      id: 'drainage',
      icon: Droplets,
      title: t('drainagePlanner'),
      description: 'AI suggests pipe layout, length, type',
      color: 'blue',
      action: t('planSystem')
    },
    {
      id: 'plant-health',
      icon: Database,
      title: t('plantHealth'),
      description: 'Detect disease by symptoms, get solutions',
      color: 'green',
      action: t('diagnose')
    },
    {
      id: 'drone-alerts',
      icon: Video,
      title: 'Drone AI Alerts',
      description: 'Upload footage, auto-review crops for issues',
      color: 'purple',
      action: 'Upload & Analyze'
    },
    {
      id: 'multilingual',
      icon: Globe,
      title: t('multilingualAssistant'),
      description: 'All features work in 9 languages',
      color: 'orange',
      action: t('useAssistant')
    },
    {
      id: 'iot-soil',
      icon: Wrench,
      title: 'IoT Soil Testing',
      description: 'Test soil moisture, pH, and nutrients',
      color: 'purple',
      action: 'Test Soil'
    },
    {
      id: 'smart-tools',
      icon: Wrench,
      title: 'Smart Farming Tools',
      description: 'pH meters, battery testers, irrigation kits',
      color: 'blue',
      action: 'View Tools'
    },
    {
      id: 'contracts',
      icon: FileText,
      title: t('agriContracts'),
      description: 'Full-service farming contracts',
      color: 'orange',
      action: t('apply')
    },
    {
      id: 'emergency',
      icon: AlertTriangle,
      title: t('emergencyTools'),
      description: 'Alert Center, Drone Patrol, Emergency Call',
      color: 'red',
      action: t('accessTools')
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'text-blue-600 bg-blue-50 border-blue-200',
      green: 'text-green-600 bg-green-50 border-green-200',
      purple: 'text-purple-600 bg-purple-50 border-purple-200',
      orange: 'text-orange-600 bg-orange-50 border-orange-200',
      red: 'text-red-600 bg-red-50 border-red-200'
    };
    return colors[color] || colors.blue;
  };

  const handleServiceClick = (serviceId: string) => {
    if (onServiceSelect) {
      onServiceSelect(serviceId);
    } else {
      setActiveService(activeService === serviceId ? null : serviceId);
    }
  };

  // Service-specific content components
  if (activeService === 'drainage') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{t('drainagePlanner')}</h2>
          <Button variant="outline" onClick={() => setActiveService(null)}>
            {t('backToServices')}
          </Button>
        </div>
        <DrainagePlanner />
      </div>
    );
  }

  if (activeService === 'plant-health') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{t('plantHealth')}</h2>
          <Button variant="outline" onClick={() => setActiveService(null)}>
            {t('backToServices')}
          </Button>
        </div>
        <PlantHealthDatabase />
      </div>
    );
  }

  if (activeService === 'drone-alerts') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Drone AI Alerts</h2>
          <Button variant="outline" onClick={() => setActiveService(null)}>
            {t('backToServices')}
          </Button>
        </div>
        <DroneVideoUpload />
      </div>
    );
  }

  if (activeService === 'iot-soil') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">IoT Soil Testing</h2>
          <Button variant="outline" onClick={() => setActiveService(null)}>
            {t('backToServices')}
          </Button>
        </div>
        <IoTTester />
      </div>
    );
  }

  if (activeService === 'contracts') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{t('agriContracts')}</h2>
          <Button variant="outline" onClick={() => setActiveService(null)}>
            {t('backToServices')}
          </Button>
        </div>
        <ContractsManagement />
      </div>
    );
  }

  if (activeService === 'videos') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{t('videoGuides')}</h2>
          <Button variant="outline" onClick={() => setActiveService(null)}>
            {t('backToServices')}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: 'Modern Irrigation Techniques', duration: '15:30', language: 'English/Hindi/Telugu' },
            { title: 'Organic Farming Methods', duration: '12:45', language: 'English/Hindi/Telugu' },
            { title: 'Crop Disease Prevention', duration: '18:20', language: 'English/Hindi/Telugu' },
            { title: 'Soil Health Management', duration: '14:15', language: 'English/Hindi/Telugu' },
            { title: 'Pest Control Strategies', duration: '16:50', language: 'English/Hindi/Telugu' },
            { title: 'Harvest Optimization', duration: '13:30', language: 'English/Hindi/Telugu' },
            { title: 'Seed Treatment Guide', duration: '11:20', language: 'English/Hindi/Telugu' },
            { title: 'How to Use Drone for Sowing', duration: '19:45', language: 'English/Hindi/Telugu' }
          ].map((video, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="bg-gray-200 rounded-lg h-32 mb-3 flex items-center justify-center">
                  <PlayCircle className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="font-medium text-sm mb-2">{video.title}</h3>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{video.duration}</span>
                  <Badge variant="outline" className="text-xs">{video.language}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (activeService === 'shopping') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{t('farmingShop')}</h2>
          <Button variant="outline" onClick={() => setActiveService(null)}>
            {t('backToServices')}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'Premium Seeds', price: '₹500/kg', category: 'Seeds', inStock: true },
            { name: 'Organic Fertilizer', price: '₹800/bag', category: 'Fertilizers', inStock: true },
            { name: 'Electric Sprayer', price: '₹3,500', category: 'Tools', inStock: true },
            { name: 'Soil Testing Kit', price: '₹2,200', category: 'Testing', inStock: true },
            { name: 'Rain Sensors', price: '₹1,800', category: 'IoT', inStock: false },
            { name: 'Vermicompost', price: '₹400/bag', category: 'Fertilizers', inStock: true },
            { name: 'Mulching Sheets', price: '₹150/meter', category: 'Materials', inStock: true },
            { name: 'Drip Irrigation Kit', price: '₹5,000/set', category: 'Irrigation', inStock: true }
          ].map((product, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="bg-gray-100 rounded-lg h-24 mb-3 flex items-center justify-center">
                  <ShoppingCart className="h-8 w-8 text-gray-400" />
                </div>
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
  }

  if (activeService === 'smart-tools') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Smart Farming Tools</h2>
          <Button variant="outline" onClick={() => setActiveService(null)}>
            {t('backToServices')}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: 'Moisture Tester', description: 'Digital soil moisture meter', status: 'Available' },
            { name: 'pH Meter', description: 'Soil pH testing device', status: 'Available' },
            { name: 'Drone Battery Health Monitor', description: 'Monitor drone battery status', status: 'Coming Soon' },
            { name: 'Smart Irrigation Valve Controller', description: 'Automated water control', status: 'Available' },
            { name: 'NPK Soil Tester', description: 'Test nitrogen, phosphorus, potassium', status: 'Available' },
            { name: 'Weather Station', description: 'Local weather monitoring', status: 'Available' }
          ].map((tool, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg h-24 mb-3 flex items-center justify-center">
                  <Wrench className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-medium text-sm mb-2">{tool.name}</h3>
                <p className="text-xs text-gray-500 mb-3">{tool.description}</p>
                <Badge variant={tool.status === 'Available' ? 'outline' : 'secondary'}>
                  {tool.status}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (activeService === 'emergency') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{t('emergencyTools')}</h2>
          <Button variant="outline" onClick={() => setActiveService(null)}>
            {t('backToServices')}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: 'Alert Center', description: 'View all active alerts and warnings', color: 'red' },
            { name: 'Drone Patrol', description: 'Emergency drone surveillance', color: 'blue' },
            { name: 'Emergency Call', description: 'Direct call to emergency services', color: 'red' },
            { name: 'Report Issue', description: 'Report farming emergencies or issues', color: 'orange' }
          ].map((tool, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-full mb-4 flex items-center justify-center ${getColorClasses(tool.color)}`}>
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <h3 className="font-medium text-lg mb-2">{tool.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{tool.description}</p>
                <Button className="w-full" variant={tool.color === 'red' ? 'destructive' : 'default'}>
                  Access {tool.name}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (activeService === 'multilingual') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{t('multilingualAssistant')}</h2>
          <Button variant="outline" onClick={() => setActiveService(null)}>
            {t('backToServices')}
          </Button>
        </div>
        
        <div className="text-center py-8">
          <Globe className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-4">AI Assistant Available in 9 Languages</h3>
          <p className="text-gray-600 mb-6">
            Our intelligent farming assistant speaks your language and understands local farming practices.
          </p>
          
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4 max-w-2xl mx-auto">
            {[
              { lang: 'English', flag: '🇺🇸' },
              { lang: 'हिंदी', flag: '🇮🇳' },
              { lang: 'తెలుగు', flag: '🇮🇳' },
              { lang: '中文', flag: '🇨🇳' },
              { lang: 'Español', flag: '🇪🇸' },
              { lang: 'मराठी', flag: '🇮🇳' },
              { lang: 'ગુજરાતી', flag: '🇮🇳' },
              { lang: 'ಕನ್ನಡ', flag: '🇮🇳' },
              { lang: 'தமிழ்', flag: '🇮🇳' }
            ].map((item, index) => (
              <div key={index} className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl mb-1">{item.flag}</div>
                <div className="text-sm font-medium">{item.lang}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">{t('farmingServices')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow border-2 cursor-pointer" onClick={() => handleServiceClick(service.id)}>
            <CardHeader className="text-center pb-4">
              <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${getColorClasses(service.color)}`}>
                <service.icon className="h-8 w-8" />
              </div>
              <CardTitle className="text-lg">{service.title}</CardTitle>
              <p className="text-sm text-gray-600">{service.description}</p>
            </CardHeader>
            <CardContent className="pt-0">
              <Button className="w-full" variant="outline">
                {service.action}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FarmingServicesCard;
