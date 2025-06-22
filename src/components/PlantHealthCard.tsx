
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, Leaf, Upload } from 'lucide-react';

interface PlantHealthCardProps {
  language: string;
}

const PlantHealthCard = ({ language }: PlantHealthCardProps) => {
  const translations = {
    en: {
      title: 'Plant Health Scanner',
      description: 'AI-powered disease detection',
      scanNow: 'Scan Plant',
      uploadImage: 'Upload Image',
      recentScans: 'Recent Scans',
      healthy: 'Healthy',
      diseased: 'Disease Detected'
    },
    hi: {
      title: 'पौधे स्वास्थ्य स्कैनर',
      description: 'AI-संचालित रोग पहचान',
      scanNow: 'पौधे को स्कैन करें',
      uploadImage: 'इमेज अपलोड करें',
      recentScans: 'हाल की स्कैन',
      healthy: 'स्वस्थ',
      diseased: 'रोग मिला'
    },
    te: {
      title: 'మొక్క ఆరోగ్య స్కానర్',
      description: 'AI-శక్తితో వ్యాధి గుర్తింపు',
      scanNow: 'మొక్కను స్కాన్ చేయండి',
      uploadImage: 'చిత్రం అప్‌లోడ్ చేయండి',
      recentScans: 'ఇటీవలి స్కాన్‌లు',
      healthy: 'ఆరోగ్యకరం',
      diseased: 'వ్యాధి కనుగొనబడింది'
    }
  };

  // Use fallback to English if language not found
  const t = translations[language as keyof typeof translations] || translations.en;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Leaf className="h-5 w-5 text-green-600" />
          {t.title}
        </CardTitle>
        <p className="text-sm text-gray-600">{t.description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
              <Camera className="h-4 w-4" />
              {t.scanNow}
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              {t.uploadImage}
            </Button>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">{t.recentScans}</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-green-50 rounded-md">
                <span className="text-sm text-gray-700">Tomato Plant</span>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  {t.healthy}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-red-50 rounded-md">
                <span className="text-sm text-gray-700">Cotton Leaf</span>
                <Badge variant="destructive">
                  {t.diseased}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlantHealthCard;
