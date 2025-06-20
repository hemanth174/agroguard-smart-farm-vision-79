
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  Thermometer, 
  Droplets, 
  Gauge,
  RefreshCw,
  Send
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const IoTTester = () => {
  const { iotData, addAlert } = useApp();
  const [testValues, setTestValues] = useState({
    soilMoisture: 0,
    temperature: 0,
    waterLevel: 0
  });
  const [isSimulating, setIsSimulating] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setTestValues(prev => ({
      ...prev,
      [field]: Number(value)
    }));
  };

  const runSimulation = () => {
    setIsSimulating(true);
    
    // Simulate test results
    setTimeout(() => {
      const results = [];
      
      if (testValues.soilMoisture < 30) {
        results.push('Low soil moisture detected');
      }
      if (testValues.temperature > 35) {
        results.push('High temperature warning');
      }
      if (testValues.waterLevel < 25) {
        results.push('Low water level alert');
      }
      
      if (results.length > 0) {
        addAlert({
          type: 'warning',
          title: 'IoT Simulation Results',
          message: results.join(', '),
          resolved: false
        });
      } else {
        addAlert({
          type: 'info',
          title: 'IoT Test Complete',
          message: 'All parameters within normal range',
          resolved: false
        });
      }
      
      setIsSimulating(false);
    }, 2000);
  };

  const getStatusColor = (value: number, type: string) => {
    switch (type) {
      case 'moisture':
        return value < 30 ? 'text-red-500' : value < 50 ? 'text-yellow-500' : 'text-green-500';
      case 'temperature':
        return value > 35 ? 'text-red-500' : value > 30 ? 'text-yellow-500' : 'text-green-500';
      case 'water':
        return value < 25 ? 'text-red-500' : value < 50 ? 'text-yellow-500' : 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          IoT Data Tester
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current IoT Data */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Current IoT Readings</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <Droplets className={`w-6 h-6 mx-auto mb-1 ${getStatusColor(iotData.soilMoisture, 'moisture')}`} />
              <div className="text-lg font-bold">{iotData.soilMoisture}%</div>
              <div className="text-xs text-gray-500">Soil Moisture</div>
            </div>
            <div className="text-center">
              <Thermometer className={`w-6 h-6 mx-auto mb-1 ${getStatusColor(iotData.temperature, 'temperature')}`} />
              <div className="text-lg font-bold">{iotData.temperature}°C</div>
              <div className="text-xs text-gray-500">Temperature</div>
            </div>
            <div className="text-center">
              <Gauge className={`w-6 h-6 mx-auto mb-1 ${getStatusColor(iotData.waterLevel, 'water')}`} />
              <div className="text-lg font-bold">{iotData.waterLevel}%</div>
              <div className="text-xs text-gray-500">Water Level</div>
            </div>
          </div>
        </div>

        {/* Test Input */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Test Custom Values</h3>
          <div className="space-y-3">
            <div>
              <Label htmlFor="soilMoisture">Soil Moisture (%)</Label>
              <Input
                id="soilMoisture"
                type="number"
                min="0"
                max="100"
                value={testValues.soilMoisture}
                onChange={(e) => handleInputChange('soilMoisture', e.target.value)}
                placeholder="Enter soil moisture percentage"
              />
            </div>
            
            <div>
              <Label htmlFor="temperature">Temperature (°C)</Label>
              <Input
                id="temperature"
                type="number"
                min="-10"
                max="50"
                value={testValues.temperature}
                onChange={(e) => handleInputChange('temperature', e.target.value)}
                placeholder="Enter temperature"
              />
            </div>
            
            <div>
              <Label htmlFor="waterLevel">Water Level (%)</Label>
              <Input
                id="waterLevel"
                type="number"
                min="0"
                max="100"
                value={testValues.waterLevel}
                onChange={(e) => handleInputChange('waterLevel', e.target.value)}
                placeholder="Enter water level percentage"
              />
            </div>
          </div>
        </div>

        {/* Test Controls */}
        <div className="flex gap-2">
          <Button 
            onClick={runSimulation} 
            disabled={isSimulating}
            className="flex items-center gap-2"
          >
            {isSimulating ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {isSimulating ? 'Running Test...' : 'Run Simulation'}
          </Button>
        </div>

        {/* Status Indicators */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Alert Thresholds</h4>
          <div className="text-xs space-y-1">
            <div className="flex justify-between">
              <span>Soil Moisture:</span>
              <Badge variant="outline" className="text-xs">
                &lt; 30% Warning
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Temperature:</span>
              <Badge variant="outline" className="text-xs">
                &gt; 35°C Warning
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Water Level:</span>
              <Badge variant="outline" className="text-xs">
                &lt; 25% Critical
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IoTTester;
