
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, PlayCircle, Wrench, FileText } from 'lucide-react';

interface FarmingServicesCardProps {
  language: string;
}

const FarmingServicesCard = ({ language }: FarmingServicesCardProps) => {
  const translations = {
    en: {
      title: 'Farming Services',
      shopping: 'Farming Shop',
      shopDesc: 'Seeds, fertilizers, tools',
      videos: 'Video Guides',
      videoDesc: 'Multilingual tutorials',
      tools: 'Planning Tools',
      toolsDesc: 'Drainage & irrigation',
      contracts: 'Agri Contracts',
      contractsDesc: 'End-to-end farming',
      browse: 'Browse',
      watch: 'Watch',
      plan: 'Plan',
      apply: 'Apply'
    },
    hi: {
      title: 'कृषि सेवाएं',
      shopping: 'कृषि दुकान',
      shopDesc: 'बीज, उर्वरक, उपकरण',
      videos: 'वीडियो गाइड',
      videoDesc: 'बहुभाषी ट्यूटोरियल',
      tools: 'योजना उपकरण',
      toolsDesc: 'जल निकासी और सिंचाई',
      contracts: 'कृषि अनुबंध',
      contractsDesc: 'संपूर्ण कृषि समाधान',
      browse: 'ब्राउज़ करें',
      watch: 'देखें',
      plan: 'योजना बनाएं',
      apply: 'आवेदन करें'
    },
    te: {
      title: 'వ్యవసాయ సేవలు',
      shopping: 'వ్యవసాయ దుకాణం',
      shopDesc: 'విత్తనాలు, ఎరువులు, పరికరాలు',
      videos: 'వీడియో గైడ్‌లు',
      videoDesc: 'బహుభాషా ట్యుటోరియల్స్',
      tools: 'ప్లానింగ్ టూల్స్',
      toolsDesc: 'డ్రైనేజీ & నీటిపారుదల',
      contracts: 'వ్యవసాయ ఒప్పందాలు',
      contractsDesc: 'పూర్తి వ్యవసాయ పరిష్కారం',
      browse: 'బ్రౌజ్ చేయండి',
      watch: 'చూడండి',
      plan: 'ప్లాన్ చేయండి',
      apply: 'దరఖాస్తు చేయండి'
    }
  };

  const t = translations[language];

  const services = [
    {
      icon: ShoppingCart,
      title: t.shopping,
      description: t.shopDesc,
      color: 'blue',
      action: t.browse
    },
    {
      icon: PlayCircle,
      title: t.videos,
      description: t.videoDesc,
      color: 'green',
      action: t.watch
    },
    {
      icon: Wrench,
      title: t.tools,
      description: t.toolsDesc,
      color: 'purple',
      action: t.plan
    },
    {
      icon: FileText,
      title: t.contracts,
      description: t.contractsDesc,
      color: 'orange',
      action: t.apply
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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">{t.title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow border-2">
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
