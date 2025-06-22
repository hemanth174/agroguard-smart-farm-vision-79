
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Video, MapPin } from 'lucide-react';

interface DronePatrolCardProps {
  language: string;
}

const DronePatrolCard = ({ language }: DronePatrolCardProps) => {
  const translations = {
    en: {
      title: 'Drone Patrol',
      status: 'Active',
      lastScan: 'Last scan: 2 hours ago',
      coverage: '95% field coverage',
      issues: 'No issues detected',
      viewLive: 'View Live Feed'
    },
    hi: {
      title: 'ड्रोन गश्त',
      status: 'सक्रिय',
      lastScan: 'अंतिम स्कैन: 2 घंटे पहले',
      coverage: '95% खेत कवरेज',
      issues: 'कोई समस्या नहीं मिली',
      viewLive: 'लाइव फ़ीड देखें'
    },
    te: {
      title: 'డ్రోన్ గస్తీ',
      status: 'క్రియాశీలం',
      lastScan: 'చివరి స్కాన్: 2 గంటల క్రితం',
      coverage: '95% పొలం కవరేజ్',
      issues: 'ఎటువంటి సమస్యలు కనుగొనబడలేదు',
      viewLive: 'లైవ్ ఫీడ్ చూడండి'
    }
  };

  // Use fallback to English if language not found
  const t = translations[language as keyof typeof translations] || translations.en;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{t.title}</CardTitle>
        <Video className="h-4 w-4 text-green-600" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
              {t.status}
            </Badge>
            <MapPin className="h-3 w-3 text-gray-400" />
          </div>
          <div className="text-xs text-gray-600 space-y-1">
            <p>{t.lastScan}</p>
            <p>{t.coverage}</p>
            <p className="text-green-600 font-medium">{t.issues}</p>
          </div>
          <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
            {t.viewLive}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DronePatrolCard;
