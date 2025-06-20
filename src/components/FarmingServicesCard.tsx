
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, PlayCircle, Wrench, FileText, Droplets } from 'lucide-react';
import DrainagePlanner from './DrainagePlanner';
import { useTranslation, Language } from '@/utils/i18n';

interface FarmingServicesCardProps {
  onServiceSelect?: (serviceId: string | null) => void;
}

const FarmingServicesCard = ({ onServiceSelect }: FarmingServicesCardProps) => {
  const { language } = { language: 'en' }; // Get from context or props
  const { t } = useTranslation(language as Language);

  const [activeService, setActiveService] = useState<string | null>(null);

  const services = [
    {
      id: 'shopping',
      icon: ShoppingCart,
      title: 'Shopping',
      description: 'Buy farming tools and supplies',
      color: 'blue',
      action: 'Browse'
    },
    {
      id: 'videos',
      icon: PlayCircle,
      title: 'Video Guides',
      description: 'Learn farming techniques',
      color: 'green',
      action: 'Watch'
    },
    {
      id: 'drainage',
      icon: Droplets,
      title: 'Drainage Planner',
      description: 'Design underground pipe system',
      color: 'blue',
      action: 'Plan System'
    },
    {
      id: 'tools',
      icon: Wrench,
      title: 'Smart Tools',
      description: 'AI-powered farming tools',
      color: 'purple',
      action: 'Plan'
    },
    {
      id: 'contracts',
      icon: FileText,
      title: 'Contracts',
      description: 'Field service contracts',
      color: 'orange',
      action: 'Apply'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'text-blue-600 bg-blue-50 border-blue-200',
      green: 'text-green-600 bg-green-50 border-green-200',
      purple: 'text-purple-600 bg-purple-50 border-purple-200',
      orange: 'text-orange-600 bg-orange-50 border-orange-200'
    };
    return colors[color] || colors.blue;
  };

  const handleServiceClick = (serviceId: string) => {
    if (onServiceSelect) {
      onServiceSelect(serviceId);
    } else {
      // Fallback to local state if no onServiceSelect provided
      if (serviceId === 'drainage') {
        setActiveService(activeService === 'drainage' ? null : 'drainage');
      } else if (serviceId === 'videos') {
        setActiveService(activeService === 'videos' ? null : 'videos');
      } else if (serviceId === 'shopping') {
        setActiveService(activeService === 'shopping' ? null : 'shopping');
      }
    }
  };

  if (activeService === 'drainage') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Drainage System Planner</h2>
          <Button variant="outline" onClick={() => setActiveService(null)}>
            Back to Services
          </Button>
        </div>
        <DrainagePlanner />
      </div>
    );
  }

  if (activeService === 'videos') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Farming Video Guides</h2>
          <Button variant="outline" onClick={() => setActiveService(null)}>
            Back to Services
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: 'Modern Irrigation Techniques', duration: '15:30', language: 'English/Hindi/Telugu' },
            { title: 'Organic Farming Methods', duration: '12:45', language: 'English/Hindi/Telugu' },
            { title: 'Crop Disease Prevention', duration: '18:20', language: 'English/Hindi/Telugu' },
            { title: 'Soil Health Management', duration: '14:15', language: 'English/Hindi/Telugu' },
            { title: 'Pest Control Strategies', duration: '16:50', language: 'English/Hindi/Telugu' },
            { title: 'Harvest Optimization', duration: '13:30', language: 'English/Hindi/Telugu' }
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
          <h2 className="text-2xl font-bold text-gray-900">Farming Shop</h2>
          <Button variant="outline" onClick={() => setActiveService(null)}>
            Back to Services
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'Premium Seeds', price: '₹500/kg', category: 'Seeds', inStock: true },
            { name: 'Organic Fertilizer', price: '₹800/bag', category: 'Fertilizers', inStock: true },
            { name: 'Pesticide Spray', price: '₹1,200/L', category: 'Pesticides', inStock: false },
            { name: 'Irrigation Pipes', price: '₹150/meter', category: 'Tools', inStock: true },
            { name: 'Soil pH Tester', price: '₹2,500', category: 'Tools', inStock: true },
            { name: 'Plant Growth Hormone', price: '₹600/bottle', category: 'Fertilizers', inStock: true },
            { name: 'Garden Tools Set', price: '₹3,200', category: 'Tools', inStock: true },
            { name: 'Greenhouse Materials', price: '₹15,000/kit', category: 'Infrastructure', inStock: false }
          ].map((product, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="bg-gray-100 rounded-lg h-24 mb-3 flex items-center justify-center">
                  <ShoppingCart className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="font-medium text-sm mb-1">{product.name}</h3>
                <p className="text-xs text-gray-500 mb-2">{product.category}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-green-600">{product.price}</span>
                  <Badge variant={product.inStock ? 'outline' : 'destructive'}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </Badge>
                </div>
                <Button 
                  size="sm" 
                  className="w-full mt-2" 
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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Farming Services</h2>
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
