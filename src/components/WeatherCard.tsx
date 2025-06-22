
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, Sun, Droplets } from 'lucide-react';
import { useTranslation, Language } from '@/utils/i18n';

interface WeatherCardProps {
  language: string;
  location: string;
}

const WeatherCard = ({ language, location }: WeatherCardProps) => {
  const { t } = useTranslation(language as Language);

  // Fallback translations for weather-specific terms
  const weatherTranslations = {
    en: {
      title: 'Weather',
      humidity: 'Humidity',
      wind: 'Wind Speed',
      forecast: '5-day forecast available'
    },
    hi: {
      title: 'मौसम',
      humidity: 'आर्द्रता',
      wind: 'हवा की गति',
      forecast: '5-दिन का पूर्वानुमान उपलब्ध'
    },
    te: {
      title: 'వాతావరణం',
      humidity: 'తేమ',
      wind: 'గాలి వేగం',
      forecast: '5-రోజుల సూచన అందుబాటులో'
    }
  };

  const weatherLang = language as keyof typeof weatherTranslations;
  const weatherText = weatherTranslations[weatherLang] || weatherTranslations.en;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{weatherText.title}</CardTitle>
        <Sun className="h-4 w-4 text-yellow-600" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-gray-900">28°C</div>
            <div className="flex items-center gap-1">
              <Cloud className="h-4 w-4 text-gray-500" />
              <span className="text-xs text-gray-600">Partly Cloudy</span>
            </div>
          </div>
          
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex items-center justify-between">
              <span>{weatherText.humidity}</span>
              <span className="font-medium">65%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>{weatherText.wind}</span>
              <span className="font-medium">12 km/h</span>
            </div>
          </div>

          <div className="pt-2 border-t">
            <p className="text-xs text-gray-500">{weatherText.forecast}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
