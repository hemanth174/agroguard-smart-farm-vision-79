
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sun, Cloud, CloudRain, Thermometer, Droplets, Wind, Sunrise, Sunset } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

interface WeatherData {
  location: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
  rainChance: number;
  sunrise: string;
  sunset: string;
  icon: string;
}

const WeatherService = () => {
  const { user, language } = useApp();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  const translations = {
    en: {
      title: 'Live Weather',
      temperature: 'Temperature',
      humidity: 'Humidity',
      windSpeed: 'Wind Speed',
      rainChance: 'Rain Chance',
      sunrise: 'Sunrise',
      sunset: 'Sunset',
      loading: 'Loading weather...',
      farmingConditions: 'Farming Conditions',
      excellent: 'Excellent',
      good: 'Good',
      fair: 'Fair'
    },
    hi: {
      title: 'मौसम की जानकारी',
      temperature: 'तापमान',
      humidity: 'आर्द्रता',
      windSpeed: 'हवा की गति',
      rainChance: 'बारिश की संभावना',
      sunrise: 'सूर्योदय',
      sunset: 'सूर्यास्त',
      loading: 'मौसम लोड हो रहा है...',
      farmingConditions: 'खेती की स्थिति',
      excellent: 'उत्कृष्ट',
      good: 'अच्छी',
      fair: 'ठीक'
    },
    te: {
      title: 'ప్రత్యక్ష వాతావరణం',
      temperature: 'ఉష్ణోగ్రత',
      humidity: 'తేమ',
      windSpeed: 'గాలి వేగం',
      rainChance: 'వర్షం అవకాశం',
      sunrise: 'సూర్యోదయం',
      sunset: 'సూర్యాస్తమయం',
      loading: 'వాతావరణం లోడ్ అవుతోంది...',
      farmingConditions: 'వ్యవసాయ పరిస్థితులు',
      excellent: 'అద్భుతం',
      good: 'మంచిది',
      fair: 'సరేకం'
    }
  };

  const t = translations[language] || translations.en;

  useEffect(() => {
    // Simulate weather API call
    const fetchWeather = async () => {
      setLoading(true);
      
      // Mock weather data based on user location
      const mockWeatherData: WeatherData = {
        location: user?.location || 'Telangana, India',
        temperature: 28 + Math.floor(Math.random() * 8), // 28-35°C
        humidity: 60 + Math.floor(Math.random() * 25), // 60-85%
        windSpeed: 5 + Math.floor(Math.random() * 10), // 5-15 km/h
        description: ['Clear Sky', 'Partly Cloudy', 'Sunny'][Math.floor(Math.random() * 3)],
        rainChance: Math.floor(Math.random() * 30), // 0-30%
        sunrise: '06:15 AM',
        sunset: '06:45 PM',
        icon: 'sunny'
      };

      setTimeout(() => {
        setWeather(mockWeatherData);
        setLoading(false);
      }, 1000);
    };

    fetchWeather();
  }, [user?.location]);

  const getWeatherIcon = (description: string) => {
    if (description.includes('Rain')) return <CloudRain className="h-8 w-8 text-blue-500" />;
    if (description.includes('Cloud')) return <Cloud className="h-8 w-8 text-gray-500" />;
    return <Sun className="h-8 w-8 text-yellow-500" />;
  };

  const getFarmingCondition = (temp: number, humidity: number, rain: number) => {
    if (temp >= 25 && temp <= 30 && humidity >= 60 && humidity <= 75 && rain <= 20) {
      return { status: t.excellent, color: 'bg-green-100 text-green-800' };
    } else if (temp >= 20 && temp <= 35 && humidity >= 50 && humidity <= 85 && rain <= 40) {
      return { status: t.good, color: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { status: t.fair, color: 'bg-orange-100 text-orange-800' };
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">{t.loading}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!weather) return null;

  const farmingCondition = getFarmingCondition(weather.temperature, weather.humidity, weather.rainChance);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {t.title}
          {getWeatherIcon(weather.description)}
        </CardTitle>
        <p className="text-sm text-gray-600">{weather.location}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Main Weather Info */}
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">{weather.temperature}°C</div>
            <p className="text-gray-600">{weather.description}</p>
            <Badge className={farmingCondition.color}>
              {t.farmingConditions}: {farmingCondition.status}
            </Badge>
          </div>

          {/* Weather Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
              <Thermometer className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-xs text-gray-600">{t.temperature}</p>
                <p className="font-medium">{weather.temperature}°C</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
              <Droplets className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-xs text-gray-600">{t.humidity}</p>
                <p className="font-medium">{weather.humidity}%</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-2 bg-purple-50 rounded">
              <Wind className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-xs text-gray-600">{t.windSpeed}</p>
                <p className="font-medium">{weather.windSpeed} km/h</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-2 bg-orange-50 rounded">
              <CloudRain className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-xs text-gray-600">{t.rainChance}</p>
                <p className="font-medium">{weather.rainChance}%</p>
              </div>
            </div>
          </div>

          {/* Sun Times */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="flex items-center gap-2">
              <Sunrise className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-xs text-gray-600">{t.sunrise}</p>
                <p className="font-medium">{weather.sunrise}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Sunset className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-xs text-gray-600">{t.sunset}</p>
                <p className="font-medium">{weather.sunset}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherService;
