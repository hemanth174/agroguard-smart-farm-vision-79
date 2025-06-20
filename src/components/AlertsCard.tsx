
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, AlertTriangle } from 'lucide-react';

interface AlertsCardProps {
  language: string;
}

const AlertsCard = ({ language }: AlertsCardProps) => {
  const translations = {
    en: {
      title: 'Alerts',
      active: 'Active',
      resolved: 'Resolved Today',
      viewAll: 'View All Alerts'
    },
    hi: {
      title: 'अलर्ट',
      active: 'सक्रिय',
      resolved: 'आज हल हुए',
      viewAll: 'सभी अलर्ट देखें'
    },
    te: {
      title: 'హెచ్చరికలు',
      active: 'క్రియాశీలం',
      resolved: 'ఈరోజు పరిష్కరించబడినవి',
      viewAll: 'అన్ని హెచ్చరికలు చూడండి'
    }
  };

  const t = translations[language];

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{t.title}</CardTitle>
        <Bell className="h-4 w-4 text-orange-600" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-orange-600">2</div>
            <Badge variant="outline" className="text-orange-600 border-orange-600">
              {t.active}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>{t.resolved}</span>
            <span className="font-medium text-green-600">5</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-md">
              <AlertTriangle className="h-3 w-3 text-orange-500" />
              <span className="text-xs text-orange-800">Low soil moisture</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertsCard;
