
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Thermometer, 
  Droplets, 
  Zap, 
  Activity, 
  RefreshCw, 
  CheckCircle,
  AlertTriangle,
  Wifi,
  Battery
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation, Language } from '@/utils/i18n';

interface SensorReading {
  id: string;
  name: string;
  value: number;
  unit: string;
  icon: any;
  color: string;
  status: 'normal' | 'warning' | 'critical';
  lastUpdate: Date;
}

const IoTTester = () => {
  const { language, addAlert, iotData } = useApp();
  const { t } = useTranslation(language as Language);
  const [sensors, setSensors] = useState<SensorReading[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [customSensorName, setCustomSensorName] = useState('');
  const [customSensorValue, setCustomSensorValue] = useState('');

  // Initialize sensors with current IoT data
  useEffect(() => {
    const initialSensors: SensorReading[] = [
      {
        id: 'temperature',
        name: 'Temperature',
        value: iotData.temperature || 25.6,
        unit: '°C',
        icon: Thermometer,
        color: 'text-red-500',
        status: 'normal',
        lastUpdate: new Date()
      },
      {
        id: 'humidity',
        name: 'Humidity',
        value: iotData.humidity || 68.4,
        unit: '%',
        icon: Droplets,
        color: 'text-blue-500',
        status: 'normal',
        lastUpdate: new Date()
      },
      {
        id: 'soilMoisture',
        name: 'Soil Moisture',
        value: iotData.soilMoisture || 45.2,
        unit: '%',
        icon: Droplets,
        color: 'text-green-500',
        status: 'normal',
        lastUpdate: new Date()
      },
      {
        id: 'ph',
        name: 'Soil pH',
        value: iotData.ph || 6.8,
        unit: 'pH',
        icon: Activity,
        color: 'text-purple-500',
        status: 'normal',
        lastUpdate: new Date()
      },
      {
        id: 'light',
        name: 'Light Intensity',
        value: Math.random() * 100 + 500,
        unit: 'lux',
        icon: Zap,
        color: 'text-yellow-500',
        status: 'normal',
        lastUpdate: new Date()
      }
    ];

    setSensors(initialSensors);
  }, [iotData]);

  // Auto-refresh sensors every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      updateSensorReadings();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const updateSensorReadings = () => {
    setSensors(prevSensors => 
      prevSensors.map(sensor => {
        let newValue = sensor.value;
        let status: 'normal' | 'warning' | 'critical' = 'normal';

        // Simulate realistic sensor variations
        switch (sensor.id) {
          case 'temperature':
            newValue = Math.max(15, Math.min(40, sensor.value + (Math.random() - 0.5) * 2));
            status = newValue > 35 ? 'critical' : newValue > 30 ? 'warning' : 'normal';
            break;
          case 'humidity':
            newValue = Math.max(30, Math.min(90, sensor.value + (Math.random() - 0.5) * 5));
            status = newValue < 40 || newValue > 80 ? 'warning' : 'normal';
            break;
          case 'soilMoisture':
            newValue = Math.max(20, Math.min(80, sensor.value + (Math.random() - 0.5) * 3));
            status = newValue < 30 ? 'critical' : newValue < 40 ? 'warning' : 'normal';
            break;
          case 'ph':
            newValue = Math.max(5.5, Math.min(8.5, sensor.value + (Math.random() - 0.5) * 0.2));
            status = newValue < 6.0 || newValue > 7.5 ? 'warning' : 'normal';
            break;
          case 'light':
            newValue = Math.max(100, Math.min(1000, sensor.value + (Math.random() - 0.5) * 100));
            break;
        }

        return {
          ...sensor,
          value: Math.round(newValue * 10) / 10,
          status,
          lastUpdate: new Date()
        };
      })
    );
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    updateSensorReadings();
    setIsRefreshing(false);
    
    addAlert({
      type: 'info',
      title: 'Sensors Updated',
      message: 'All sensor readings have been refreshed successfully',
      resolved: false
    });
  };

  const addCustomSensor = () => {
    if (!customSensorName || !customSensorValue) return;

    const newSensor: SensorReading = {
      id: `custom-${Date.now()}`,
      name: customSensorName,
      value: parseFloat(customSensorValue),
      unit: '',
      icon: Activity,
      color: 'text-gray-500',
      status: 'normal',
      lastUpdate: new Date()
    };

    setSensors(prev => [...prev, newSensor]);
    setCustomSensorName('');
    setCustomSensorValue('');

    addAlert({
      type: 'info',
      title: 'Custom Sensor Added',
      message: `${customSensorName} sensor has been added successfully`,
      resolved: false
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default: return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Wifi className="h-5 w-5 text-green-600" />
            {t('iotTester')} - Live Readings
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className="flex items-center gap-1 bg-green-100 text-green-800">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Real-time
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Real-time Sensor Readings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sensors.map((sensor) => (
              <div
                key={sensor.id}
                className="bg-gray-50 rounded-lg p-4 border transition-all hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <sensor.icon className={`h-5 w-5 ${sensor.color}`} />
                    <span className="font-medium text-sm">{sensor.name}</span>
                  </div>
                  {getStatusIcon(sensor.status)}
                </div>
                
                <div className="mb-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {sensor.value}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">{sensor.unit}</span>
                </div>
                
                <Badge className={`text-xs ${getStatusColor(sensor.status)}`}>
                  {sensor.status.toUpperCase()}
                </Badge>
                
                <p className="text-xs text-gray-500 mt-2">
                  Updated: {sensor.lastUpdate.toLocaleTimeString()}
                </p>
              </div>
            ))}
          </div>

          {/* Add Custom Sensor */}
          <div className="border-t pt-6">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Battery className="h-4 w-4" />
              Add Custom Sensor
            </h4>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Sensor name (e.g., CO2 Level)"
                value={customSensorName}
                onChange={(e) => setCustomSensorName(e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="Current value"
                type="number"
                value={customSensorValue}
                onChange={(e) => setCustomSensorValue(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={addCustomSensor}
                disabled={!customSensorName || !customSensorValue}
                className="bg-green-600 hover:bg-green-700"
              >
                Add Sensor
              </Button>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold mb-2 text-blue-900">System Status</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Network: Online</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Sensors: {sensors.length} Active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>Alerts: {sensors.filter(s => s.status !== 'normal').length}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Battery: 87%</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IoTTester;
