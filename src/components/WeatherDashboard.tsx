
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cloud, Sun, Droplets, Wind, Eye, Thermometer } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/utils/i18n';

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  visibility: number;
  uvIndex: number;
  forecast: {
    day: string;
    high: number;
    low: number;
    condition: string;
  }[];
}

const WeatherDashboard = () => {
  const { language, user, addAlert } = useApp();
  const { t } = useTranslation(language);
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 28,
    humidity: 65,
    windSpeed: 12,
    condition: 'Partly Cloudy',
    visibility: 10,
    uvIndex: 6,
    forecast: [
      { day: 'Today', high: 32, low: 24, condition: 'Sunny' },
      { day: 'Tomorrow', high: 30, low: 22, condition: 'Cloudy' },
      { day: 'Wed', high: 28, low: 20, condition: 'Rain' },
      { day: 'Thu', high: 29, low: 21, condition: 'Sunny' },
      { day: 'Fri', high: 31, low: 23, condition: 'Partly Cloudy' }
    ]
  });

  // Simulate weather updates
  useEffect(() => {
    const interval = setInterval(() => {
      setWeather(prev => ({
        ...prev,
        temperature: Math.max(20, Math.min(40, prev.temperature + (Math.random() - 0.5) * 2)),
        humidity: Math.max(30, Math.min(90, prev.humidity + (Math.random() - 0.5) * 5)),
        windSpeed: Math.max(0, Math.min(30, prev.windSpeed + (Math.random() - 0.5) * 3))
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Weather-based alerts
  useEffect(() => {
    if (weather.temperature > 35) {
      addAlert({
        type: 'warning',
        message: 'High temperature alert. Consider additional watering for crops.',
        resolved: false
      });
    }
    
    if (weather.windSpeed > 25) {
      addAlert({
        type: 'warning',
        message: 'High wind speeds detected. Secure equipment and check for damage.',
        resolved: false
      });
    }
  }, [weather, addAlert]);

  const getWeatherIcon = (condition: string) => {
    if (condition.includes('Sun')) return <Sun className="h-6 w-6 text-yellow-500" />;
    if (condition.includes('Cloud')) return <Cloud className="h-6 w-6 text-gray-500" />;
    if (condition.includes('Rain')) return <Droplets className="h-6 w-6 text-blue-500" />;
    return <Sun className="h-6 w-6 text-yellow-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Current Weather */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('weatherTitle')}</CardTitle>
          {getWeatherIcon(weather.condition)}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Main Temperature Display */}
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-gray-900">{weather.temperature.toFixed(1)}°C</div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-700">{weather.condition}</div>
                <div className="text-xs text-gray-500">{user?.location || 'Location detecting...'}</div>
              </div>
            </div>

            {/* Weather Details Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Droplets className="h-3 w-3" />
                  {t('humidity')}
                </span>
                <span className="font-medium">{weather.humidity.toFixed(0)}%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Wind className="h-3 w-3" />
                  {t('wind')}
                </span>
                <span className="font-medium">{weather.windSpeed.toFixed(1)} km/h</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  Visibility
                </span>
                <span className="font-medium">{weather.visibility} km</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Sun className="h-3 w-3" />
                  UV Index
                </span>
                <Badge variant={weather.uvIndex > 7 ? 'destructive' : 'outline'}>
                  {weather.uvIndex}
                </Badge>
              </div>
            </div>

            {/* Farming Advisory */}
            <div className="pt-2 border-t">
              <p className="text-xs text-gray-500">{t('forecast')}</p>
              {weather.humidity < 40 && (
                <p className="text-xs text-orange-600 mt-1">
                  Low humidity detected. Consider misting crops.
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5-Day Forecast */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">5-Day Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {weather.forecast.map((day, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {getWeatherIcon(day.condition)}
                  <div>
                    <p className="font-medium text-sm">{day.day}</p>
                    <p className="text-xs text-gray-500">{day.condition}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{day.high}°</p>
                  <p className="text-xs text-gray-500">{day.low}°</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeatherDashboard;
