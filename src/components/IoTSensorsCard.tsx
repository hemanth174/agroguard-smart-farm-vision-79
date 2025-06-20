
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, Droplets, Thermometer } from 'lucide-react';

interface IoTSensorsCardProps {
  language: string;
}

const IoTSensorsCard = ({ language }: IoTSensorsCardProps) => {
  const translations = {
    en: {
      title: 'IoT Sensors',
      moisture: 'Soil Moisture',
      temperature: 'Temperature',
      tank: 'Water Tank',
      optimal: 'Optimal',
      normal: 'Normal',
      full: 'Full'
    },
    hi: {
      title: 'IoT सेंसर',
      moisture: 'मिट्टी की नमी',
      temperature: 'तापमान',
      tank: 'पानी का टैंक',
      optimal: 'अनुकूल',
      normal: 'सामान्य',
      full: 'भरा हुआ'
    },
    te: {
      title: 'IoT సెన్సర్లు',
      moisture: 'మట్టి తేమ',
      temperature: 'ఉష్ణోగ్రత',
      tank: 'నీటి ట్యాంక్',
      optimal: 'అనుకూలం',
      normal: 'సాధారణం',
      full: 'నిండినది'
    }
  };

  const t = translations[language];

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{t.title}</CardTitle>
        <Database className="h-4 w-4 text-blue-600" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplets className="h-3 w-3 text-blue-500" />
              <span className="text-xs text-gray-600">{t.moisture}</span>
            </div>
            <Badge variant="outline" className="text-green-600 border-green-600">
              {t.optimal}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Thermometer className="h-3 w-3 text-orange-500" />
              <span className="text-xs text-gray-600">{t.temperature}</span>
            </div>
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              {t.normal}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-3 w-3 text-cyan-500" />
              <span className="text-xs text-gray-600">{t.tank}</span>
            </div>
            <Badge variant="outline" className="text-green-600 border-green-600">
              {t.full}
            </Badge>
          </div>

          <div className="pt-2">
            <div className="text-lg font-bold text-gray-900">8/8</div>
            <div className="text-xs text-gray-500">Sensors Online</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IoTSensorsCard;
