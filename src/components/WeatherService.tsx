import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sun, Cloud, CloudRain, Thermometer, Droplets, Wind, Sunrise, Sunset, MapPin, RefreshCw } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

interface HourlyWeather {
  time: string;
  temp: number;
  humidity: number;
  description: string;
  icon: string;
}

interface WeatherData {
  location: string;
  coordinates: { lat: number; lon: number };
  current: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    description: string;
    icon: string;
  };
  hourly: HourlyWeather[];
  sunrise: string;
  sunset: string;
  lastUpdated: string;
}

const WeatherService = () => {
  const { user, language } = useApp();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const translations = {
    en: {
      title: 'Live Weather Forecast',
      currentWeather: 'Current Weather',
      hourlyForecast: 'Hourly Forecast',
      temperature: 'Temperature',
      humidity: 'Humidity',
      windSpeed: 'Wind Speed',
      sunrise: 'Sunrise',
      sunset: 'Sunset',
      loading: 'Loading weather data...',
      refresh: 'Refresh',
      lastUpdated: 'Last updated',
      getLocation: 'Get My Location',
      locationError: 'Unable to get location',
      viewOnMap: 'View on Map'
    },
    hi: {
      title: 'मौसम पूर्वानुमान',
      currentWeather: 'वर्तमान मौसम',
      hourlyForecast: 'घंटेवार पूर्वानुमान',
      temperature: 'तापमान',
      humidity: 'आर्द्रता',
      windSpeed: 'हवा की गति',
      sunrise: 'सूर्योदय',
      sunset: 'सूर्यास्त',
      loading: 'मौसम डेटा लोड हो रहा है...',
      refresh: 'रीफ्रेश करें',
      lastUpdated: 'अंतिम अपडेट',
      getLocation: 'मेरा स्थान प्राप्त करें',
      locationError: 'स्थान प्राप्त नहीं हो सका',
      viewOnMap: 'मैप पर देखें'
    },
    te: {
      title: 'ప్రత్యక్ష వాతావరణ సూచన',
      currentWeather: 'ప్రస్తుత వాతావరణం',
      hourlyForecast: 'గంటవారీ సూచన',
      temperature: 'ఉష్ణోగ్రత',
      humidity: 'తేమ',
      windSpeed: 'గాలి వేగం',
      sunrise: 'సూర్యోదయం',
      sunset: 'సూర్యాస్తమయం',
      loading: 'వాతావరణ డేటా లోడ్ అవుతోంది...',
      refresh: 'రీఫ్రెష్',
      lastUpdated: 'చివరిసారి అప్‌డేట్',
      getLocation: 'నా లొకేషన్ పొందండి',
      locationError: 'లొకేషన్ పొందలేకపోయింది',
      viewOnMap: 'మ్యాప్‌లో చూడండి'
    }
  };

  const t = translations[language] || translations.en;

  // Get user's current location
  const getCurrentLocation = () => {
    setLoading(true);
    setError(null);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherData(latitude, longitude);
        },
        (error) => {
          console.error('Location error:', error);
          setError(t.locationError);
          // Fallback to mock data with user's stored location
          fetchMockWeatherData();
        }
      );
    } else {
      setError(t.locationError);
      fetchMockWeatherData();
    }
  };

  // TODO: Replace with actual OpenWeatherMap API call
  const fetchWeatherData = async (lat: number, lon: number) => {
    try {
      // This is where you would call the actual API:
      // const API_KEY = 'YOUR_OPENWEATHER_API_KEY'; // Store in Supabase secrets
      // const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
      // const data = await response.json();
      
      // For now, using enhanced mock data
      await fetchMockWeatherData(lat, lon);
    } catch (error) {
      console.error('Weather API error:', error);
      setError('Failed to fetch weather data');
      setLoading(false);
    }
  };

  const fetchMockWeatherData = async (lat?: number, lon?: number) => {
    // Enhanced mock data that simulates real API response
    const mockData: WeatherData = {
      location: user?.location || 'Telangana, India',
      coordinates: { 
        lat: lat || 17.3850, 
        lon: lon || 78.4867 
      },
      current: {
        temperature: 28 + Math.floor(Math.random() * 8),
        humidity: 60 + Math.floor(Math.random() * 25),
        windSpeed: 5 + Math.floor(Math.random() * 10),
        description: ['Clear Sky', 'Partly Cloudy', 'Sunny', 'Light Clouds'][Math.floor(Math.random() * 4)],
        icon: 'sunny'
      },
      hourly: Array.from({ length: 12 }, (_, i) => ({
        time: new Date(Date.now() + i * 3600000).toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          hour12: true 
        }),
        temp: 25 + Math.floor(Math.random() * 10),
        humidity: 50 + Math.floor(Math.random() * 30),
        description: ['Clear', 'Cloudy', 'Sunny'][Math.floor(Math.random() * 3)],
        icon: 'sunny'
      })),
      sunrise: '06:15 AM',
      sunset: '06:45 PM',
      lastUpdated: new Date().toLocaleTimeString()
    };

    setTimeout(() => {
      setWeather(mockData);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  // New function to open Google Maps with weather layer
  const openWeatherMap = () => {
    if (weather?.coordinates) {
      const { lat, lon } = weather.coordinates;
      // Create a Google Maps URL with weather layer
      const mapsUrl = `https://www.google.com/maps/@${lat},${lon},10z/data=!5m1!1e1`;
      
      // Open in new window
      const mapWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
      
      if (mapWindow) {
        mapWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Weather Map - ${weather.location}</title>
            <style>
              body { margin: 0; font-family: Arial, sans-serif; }
              #map { height: 100vh; width: 100%; }
              .weather-info {
                position: absolute;
                top: 10px;
                left: 10px;
                background: white;
                padding: 15px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                z-index: 1000;
                max-width: 250px;
              }
              .weather-info h3 { margin: 0 0 10px 0; color: #333; }
              .weather-detail { display: flex; justify-content: space-between; margin: 5px 0; }
            </style>
          </head>
          <body>
            <div class="weather-info">
              <h3>🌤️ Current Weather</h3>
              <div class="weather-detail">
                <span>Location:</span>
                <span>${weather.location}</span>
              </div>
              <div class="weather-detail">
                <span>Temperature:</span>
                <span>${weather.current.temperature}°C</span>
              </div>
              <div class="weather-detail">
                <span>Humidity:</span>
                <span>${weather.current.humidity}%</span>
              </div>
              <div class="weather-detail">
                <span>Wind Speed:</span>
                <span>${weather.current.windSpeed} km/h</span>
              </div>
              <div class="weather-detail">
                <span>Condition:</span>
                <span>${weather.current.description}</span>
              </div>
            </div>
            <div id="map"></div>
            
            <script>
              function initMap() {
                const location = { lat: ${lat}, lng: ${lon} };
                
                const map = new google.maps.Map(document.getElementById("map"), {
                  zoom: 10,
                  center: location,
                  mapTypeId: 'terrain'
                });
                
                // Add weather marker
                const weatherMarker = new google.maps.Marker({
                  position: location,
                  map: map,
                  title: "${weather.location} - ${weather.current.temperature}°C",
                  icon: {
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(\`
                      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="20" cy="20" r="18" fill="#4285f4" stroke="#fff" stroke-width="2"/>
                        <text x="20" y="26" text-anchor="middle" fill="white" font-family="Arial" font-size="12" font-weight="bold">
                          ${weather.current.temperature}°
                        </text>
                      </svg>
                    \`),
                    scaledSize: new google.maps.Size(40, 40)
                  }
                });
                
                // Add info window
                const infoWindow = new google.maps.InfoWindow({
                  content: \`
                    <div style="padding: 10px; max-width: 200px;">
                      <h4 style="margin: 0 0 10px 0; color: #333;">${weather.location}</h4>
                      <p style="margin: 5px 0;"><strong>Temperature:</strong> ${weather.current.temperature}°C</p>
                      <p style="margin: 5px 0;"><strong>Condition:</strong> ${weather.current.description}</p>
                      <p style="margin: 5px 0;"><strong>Humidity:</strong> ${weather.current.humidity}%</p>
                      <p style="margin: 5px 0;"><strong>Wind:</strong> ${weather.current.windSpeed} km/h</p>
                      <p style="margin: 5px 0; font-size: 12px; color: #666;">Last updated: ${weather.lastUpdated}</p>
                    </div>
                  \`
                });
                
                weatherMarker.addListener("click", () => {
                  infoWindow.open(map, weatherMarker);
                });
                
                // Open info window by default
                infoWindow.open(map, weatherMarker);
                
                // Add click listener to map for weather info
                map.addListener("click", (event) => {
                  const clickedLat = event.latLng.lat();
                  const clickedLng = event.latLng.lng();
                  
                  // Simulate weather data for clicked location
                  const tempVariation = Math.floor(Math.random() * 10) - 5;
                  const newTemp = ${weather.current.temperature} + tempVariation;
                  
                  const clickInfoWindow = new google.maps.InfoWindow({
                    position: event.latLng,
                    content: \`
                      <div style="padding: 10px;">
                        <h4 style="margin: 0 0 10px 0; color: #333;">Weather Info</h4>
                        <p style="margin: 5px 0;"><strong>Coordinates:</strong> \${clickedLat.toFixed(4)}, \${clickedLng.toFixed(4)}</p>
                        <p style="margin: 5px 0;"><strong>Est. Temperature:</strong> \${newTemp}°C</p>
                        <p style="margin: 5px 0; font-size: 12px; color: #666;">Click on map for weather estimates</p>
                      </div>
                    \`
                  });
                  
                  clickInfoWindow.open(map);
                });
              }
            </script>
            <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDP3t9Bkrt4-fDPu_JdqTxznbqsYdGDlgk&callback=initMap" async defer></script>
          </body>
          </html>
        `);
        mapWindow.document.close();
      }
    }
  };

  const getWeatherIcon = (description: string) => {
    if (description.toLowerCase().includes('rain')) return <CloudRain className="h-6 w-6 text-blue-500" />;
    if (description.toLowerCase().includes('cloud')) return <Cloud className="h-6 w-6 text-gray-500" />;
    return <Sun className="h-6 w-6 text-yellow-500" />;
  };

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-bold text-gray-800">
            <Sun className="h-7 w-7 text-yellow-500" />
            {t.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">{t.loading}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !weather) {
    return (
      <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200 shadow-xl">
        <CardHeader>
          <CardTitle className="text-red-700">{t.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error || 'Failed to load weather data'}</p>
            <Button onClick={getCurrentLocation} className="bg-green-600 hover:bg-green-700">
              <RefreshCw className="h-4 w-4 mr-2" />
              {t.refresh}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Weather Card */}
      <Card className="bg-gradient-to-br from-blue-50 via-white to-green-50 border-0 shadow-2xl hover:shadow-3xl transition-all duration-300">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl font-bold text-gray-800 mb-2">
                {getWeatherIcon(weather.current.description)}
                {t.currentWeather}
              </CardTitle>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span className="font-medium">{weather.location}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button 
                onClick={getCurrentLocation} 
                variant="outline" 
                size="sm"
                className="hover:bg-green-50 border-green-300"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {t.refresh}
              </Button>
              <Button 
                onClick={openWeatherMap} 
                variant="outline" 
                size="sm"
                className="hover:bg-blue-50 border-blue-300"
              >
                <MapPin className="h-4 w-4 mr-2" />
                {t.viewOnMap}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Main Temperature Display */}
          <div className="text-center mb-6">
            <div className="text-6xl font-bold text-gray-900 mb-2">
              {weather.current.temperature}°C
            </div>
            <p className="text-xl text-gray-600 font-medium">{weather.current.description}</p>
            <p className="text-sm text-gray-500 mt-2">
              {t.lastUpdated}: {weather.lastUpdated}
            </p>
          </div>

          {/* Weather Details Grid */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-white bg-opacity-60 rounded-xl shadow-sm">
              <Droplets className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <p className="text-xs text-gray-600 font-medium">{t.humidity}</p>
              <p className="text-lg font-bold text-gray-900">{weather.current.humidity}%</p>
            </div>
            
            <div className="text-center p-4 bg-white bg-opacity-60 rounded-xl shadow-sm">
              <Wind className="h-6 w-6 text-gray-500 mx-auto mb-2" />
              <p className="text-xs text-gray-600 font-medium">{t.windSpeed}</p>
              <p className="text-lg font-bold text-gray-900">{weather.current.windSpeed} km/h</p>
            </div>
            
            <div className="text-center p-4 bg-white bg-opacity-60 rounded-xl shadow-sm">
              <Thermometer className="h-6 w-6 text-red-500 mx-auto mb-2" />
              <p className="text-xs text-gray-600 font-medium">{t.temperature}</p>
              <p className="text-lg font-bold text-gray-900">{weather.current.temperature}°C</p>
            </div>
          </div>

          {/* Sun Times */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Sunrise className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">{t.sunrise}</p>
                <p className="font-bold text-gray-900">{weather.sunrise}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Sunset className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">{t.sunset}</p>
                <p className="font-bold text-gray-900">{weather.sunset}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hourly Forecast */}
      <Card className="bg-white shadow-xl border-0">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800">{t.hourlyForecast}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="flex gap-4 pb-4">
              {weather.hourly.slice(0, 8).map((hour, index) => (
                <div 
                  key={index} 
                  className="flex-shrink-0 text-center p-4 bg-gradient-to-b from-gray-50 to-white rounded-xl shadow-sm hover:shadow-md transition-shadow min-w-[100px]"
                >
                  <p className="text-sm font-medium text-gray-600 mb-2">{hour.time}</p>
                  {getWeatherIcon(hour.description)}
                  <p className="text-lg font-bold text-gray-900 mt-2">{hour.temp}°</p>
                  <p className="text-xs text-gray-500">{hour.humidity}%</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeatherService;
