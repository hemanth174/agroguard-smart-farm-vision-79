
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ShoppingCart, 
  Play, 
  Droplets, 
  Leaf, 
  Camera, 
  Globe, 
  Zap, 
  Wrench, 
  FileText, 
  Phone 
} from 'lucide-react';

// Import service components
import ShoppingService from './services/ShoppingSevice';
import VideoGuidesService from './services/VideoGuidesService';
import PlantHealthService from './services/PlantHealthService';
import IoTSoilTestingService from './services/IoTSoilTestingService';
import EmergencyToolsService from './services/EmergencyToolsService';
import DrainagePlanner from './DrainagePlanner';
import ContractsManagement from './ContractsManagement';

interface FarmingServicesCardProps {
  onServiceSelect: (service: string | null) => void;
}

const FarmingServicesCard = ({ onServiceSelect }: FarmingServicesCardProps) => {
  const [activeService, setActiveService] = useState<string | null>(null);

  const services = [
    {
      id: 'shopping',
      title: '🛒 Shopping',
      description: 'Browse & buy farming tools, fertilizers, and equipment with secure payment',
      icon: ShoppingCart,
      color: 'bg-blue-500',
    },
    {
      id: 'video-guides',
      title: '📹 Video Guides',
      description: 'Watch multilingual farming tutorials and best practices',
      icon: Play,
      color: 'bg-purple-500',
    },
    {
      id: 'drainage',
      title: '🚰 Drainage Planner',
      description: 'AI-powered drainage system design for your fields',
      icon: Droplets,
      color: 'bg-cyan-500',
    },
    {
      id: 'plant-health',
      title: '🧬 Plant Health',
      description: 'Detect diseases and get treatment recommendations',
      icon: Leaf,
      color: 'bg-green-500',
    },
    {
      id: 'drone-alerts',
      title: '📣 Drone AI Alerts',
      description: 'Upload drone footage for automated crop monitoring',
      icon: Camera,
      color: 'bg-orange-500',
    },
    {
      id: 'multilingual',
      title: '🌐 Multilingual Assistant',
      description: 'Get help in Telugu, Hindi, English, and more languages',
      icon: Globe,
      color: 'bg-indigo-500',
    },
    {
      id: 'iot-soil',
      title: '🌱 IoT Soil Testing',
      description: 'Analyze soil conditions and get AI recommendations',
      icon: Zap,
      color: 'bg-yellow-500',
    },
    {
      id: 'smart-tools',
      title: '🚜 Smart Farming Tools',
      description: 'Discover and learn about modern farming equipment',
      icon: Wrench,
      color: 'bg-gray-500',
    },
    {
      id: 'contracts',
      title: '🤝 Agri Contracts',
      description: 'Find and apply for farming service contracts',
      icon: FileText,
      color: 'bg-emerald-500',
    },
    {
      id: 'emergency',
      title: '🆘 Emergency Tools',
      description: 'Quick access to emergency contacts and reporting',
      icon: Phone,
      color: 'bg-red-500',
    },
  ];

  const handleServiceClick = (serviceId: string) => {
    setActiveService(serviceId);
    onServiceSelect(serviceId);
  };

  const renderServiceContent = () => {
    switch (activeService) {
      case 'shopping':
        return <ShoppingService />;
      case 'video-guides':
        return <VideoGuidesService />;
      case 'drainage':
        return <DrainagePlanner />;
      case 'plant-health':
        return <PlantHealthService />;
      case 'iot-soil':
        return <IoTSoilTestingService />;
      case 'emergency':
        return <EmergencyToolsService />;
      case 'contracts':
        return <ContractsManagement />;
      case 'drone-alerts':
        return (
          <div className="space-y-6 p-4 max-w-full overflow-hidden">
            <h2 className="text-xl md:text-2xl font-bold">📣 Drone AI Alerts</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 md:p-6">
              <h3 className="text-lg font-semibold mb-4">AI-Powered Crop Monitoring</h3>
              <p className="text-gray-700 mb-4 text-sm md:text-base">
                Upload drone footage to automatically detect:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm md:text-base">
                <li>Fire or smoke detection</li>
                <li>Pest infestations</li>
                <li>Crop diseases</li>
                <li>Irrigation issues</li>
                <li>Animal intrusions</li>
                <li>Equipment malfunctions</li>
              </ul>
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm md:text-base">
                  🚧 This feature is currently in development. Mock alerts are being generated based on IoT sensor data.
                </p>
              </div>
            </div>
          </div>
        );
      case 'multilingual':
        return (
          <div className="space-y-6 p-4 max-w-full overflow-hidden">
            <h2 className="text-xl md:text-2xl font-bold">🌐 Multilingual Assistant</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {[
                { lang: 'English', code: 'en', flag: '🇺🇸' },
                { lang: 'हिंदी (Hindi)', code: 'hi', flag: '🇮🇳' },
                { lang: 'తెలుగు (Telugu)', code: 'te', flag: '🇮🇳' },
                { lang: '中文 (Chinese)', code: 'zh', flag: '🇨🇳' },
                { lang: 'Español (Spanish)', code: 'es', flag: '🇪🇸' },
                { lang: 'मराठी (Marathi)', code: 'mr', flag: '🇮🇳' },
                { lang: 'ગુજરાતી (Gujarati)', code: 'gu', flag: '🇮🇳' },
                { lang: 'ಕನ್ನಡ (Kannada)', code: 'kn', flag: '🇮🇳' },
                { lang: 'தமிழ் (Tamil)', code: 'ta', flag: '🇮🇳' },
              ].map((language) => (
                <Card key={language.code} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-3 md:p-4 text-center">
                    <div className="text-3xl md:text-4xl mb-2">{language.flag}</div>
                    <h3 className="font-semibold text-sm md:text-base">{language.lang}</h3>
                    <p className="text-xs md:text-sm text-gray-600 mt-2">
                      Full support for farming guidance, weather alerts, and AI assistance
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 md:p-6">
              <h3 className="text-lg font-semibold mb-4">Language Features</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm md:text-base">
                <li>All UI elements translated</li>
                <li>Voice commands in native language</li>
                <li>Localized weather and market data</li>
                <li>Cultural farming practices integrated</li>
                <li>Region-specific crop recommendations</li>
              </ul>
            </div>
          </div>
        );
      case 'smart-tools':
        return (
          <div className="space-y-6 p-4 max-w-full overflow-hidden">
            <h2 className="text-xl md:text-2xl font-bold">🚜 Smart Farming Tools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {[
                {
                  name: 'pH Meter',
                  description: 'Digital soil pH testing device',
                  price: '₹2,500',
                  image: '/placeholder.svg',
                  features: ['Digital display', 'Waterproof', 'Auto calibration']
                },
                {
                  name: 'Moisture Sensor',
                  description: 'IoT-enabled soil moisture monitor',
                  price: '₹1,800',
                  image: '/placeholder.svg',
                  features: ['Real-time monitoring', 'Mobile alerts', 'Solar powered']
                },
                {
                  name: 'Battery Tester',
                  description: 'Universal battery voltage tester',
                  price: '₹500',
                  image: '/placeholder.svg',
                  features: ['Digital display', 'Multiple battery types', 'Compact design']
                },
                {
                  name: 'Irrigation Controller',
                  description: 'Smart irrigation system controller',
                  price: '₹8,500',
                  image: '/placeholder.svg',
                  features: ['App control', 'Weather integration', 'Zone management']
                },
                {
                  name: 'Drone Camera',
                  description: 'Agricultural monitoring drone',
                  price: '₹45,000',
                  image: '/placeholder.svg',
                  features: ['4K camera', 'GPS navigation', 'Real-time streaming']
                },
                {
                  name: 'Weather Station',
                  description: 'Personal weather monitoring station',
                  price: '₹12,000',
                  image: '/placeholder.svg',
                  features: ['Multiple sensors', 'Data logging', 'Cloud sync']
                },
              ].map((tool, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-3 md:p-4">
                    <img
                      src={tool.image}
                      alt={tool.name}
                      className="w-full h-32 md:h-48 object-cover rounded-lg mb-3 md:mb-4"
                    />
                    <h3 className="font-semibold text-base md:text-lg mb-2">{tool.name}</h3>
                    <p className="text-gray-600 text-xs md:text-sm mb-3">{tool.description}</p>
                    <div className="text-lg md:text-2xl font-bold text-green-600 mb-3">{tool.price}</div>
                    <div className="space-y-1 mb-4">
                      {tool.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs md:text-sm">
                          <span className="text-green-400">✓</span>
                          {feature}
                        </div>
                      ))}
                    </div>
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-sm md:text-base">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (activeService) {
    return (
      <div className="space-y-4 max-w-full overflow-hidden">
        <Button 
          variant="outline" 
          onClick={() => {
            setActiveService(null);
            onServiceSelect(null);
          }}
          className="mb-4"
        >
          ← Back to Services
        </Button>
        <div className="max-w-full overflow-x-auto">
          {renderServiceContent()}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 max-w-full overflow-hidden">
      <div className="text-center">
        <h2 className="text-xl md:text-2xl font-bold mb-2">🌾 Comprehensive Farming Services</h2>
        <p className="text-gray-600 text-sm md:text-base">Everything you need for modern, efficient farming</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {services.map((service) => (
          <Card 
            key={service.id} 
            className="hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105"
            onClick={() => handleServiceClick(service.id)}
          >
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                <div className={`p-2 md:p-3 rounded-lg ${service.color} bg-opacity-10`}>
                  <service.icon className={`h-5 w-5 md:h-6 md:w-6 ${service.color.replace('bg-', 'text-')}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm md:text-lg truncate">{service.title}</h3>
                </div>
              </div>
              <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-3 md:mb-4 line-clamp-3">
                {service.description}
              </p>
              <Button 
                variant="outline" 
                className="w-full hover:bg-green-50 hover:border-green-500 text-xs md:text-sm"
              >
                Access Service →
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 md:p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-xl md:text-2xl font-bold text-green-600">10</div>
            <div className="text-xs md:text-sm text-gray-600">Services Available</div>
          </div>
          <div>
            <div className="text-xl md:text-2xl font-bold text-blue-600">9</div>
            <div className="text-xs md:text-sm text-gray-600">Languages Supported</div>
          </div>
          <div>
            <div className="text-xl md:text-2xl font-bold text-purple-600">24/7</div>
            <div className="text-xs md:text-sm text-gray-600">AI Assistant</div>
          </div>
          <div>
            <div className="text-xl md:text-2xl font-bold text-orange-600">100+</div>
            <div className="text-xs md:text-sm text-gray-600">Products Available</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmingServicesCard;
