import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Activity, Droplets, Zap, Leaf, TrendingUp, TrendingDown, Wifi, WifiOff, Bluetooth, Loader2, RefreshCw, Thermometer } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

interface SoilTestData {
  moistureLevel: number;
  phLevel: number;
  nitrogenLevel: number;
  phosphorusLevel: number;
  potassiumLevel: number;
  temperature: number;
  electricalConductivity: number;
}

interface SoilRecommendations {
  moisture: string[];
  ph: string[];
  nutrients: string[];
  overall: string;
}

interface IoTDevice {
  id: string;
  name: string;
  ip: string;
  type: 'wifi' | 'bluetooth';
  status: 'online' | 'offline';
}

const IoTSoilTestingService = () => {
  const [testData, setTestData] = useState<SoilTestData>({
    moistureLevel: 0,
    phLevel: 0,
    nitrogenLevel: 0,
    phosphorusLevel: 0,
    potassiumLevel: 0,
    temperature: 0,
    electricalConductivity: 0,
  });
  const [recommendations, setRecommendations] = useState<SoilRecommendations | null>(null);
  const [loading, setLoading] = useState(false);
  const [useSimulatedData, setUseSimulatedData] = useState(false);
  const [devices, setDevices] = useState<IoTDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<IoTDevice | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [deviceIp, setDeviceIp] = useState('192.168.1.100');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { user } = useApp();
  const { toast } = useToast();

  // Auto-refresh data every 10 seconds when connected
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isConnected && autoRefresh && selectedDevice) {
      interval = setInterval(() => {
        fetchDeviceData(selectedDevice);
      }, 10000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isConnected, autoRefresh, selectedDevice]);

  const scanForDevices = async () => {
    setLoading(true);
    try {
      // Simulate device discovery - in real implementation, this would scan network or Bluetooth
      const mockDevices: IoTDevice[] = [
        { id: 'soil-sensor-01', name: 'AgriSense Pro v2.1', ip: '192.168.1.100', type: 'wifi', status: 'online' },
        { id: 'soil-sensor-02', name: 'FarmBot Soil Monitor', ip: '192.168.1.101', type: 'wifi', status: 'offline' },
        { id: 'bluetooth-sensor', name: 'Portable Soil Tester', ip: '', type: 'bluetooth', status: 'online' },
      ];
      
      setDevices(mockDevices);
      toast({
        title: 'Device scan complete',
        description: `Found ${mockDevices.length} IoT devices`,
      });
    } catch (error) {
      toast({
        title: 'Scan failed',
        description: 'Could not scan for IoT devices',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const connectToDevice = async (device: IoTDevice) => {
    setIsConnecting(true);
    try {
      if (device.type === 'wifi') {
        // Try to connect to Wi-Fi device
        const response = await fetch(`http://${device.ip}/status`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          signal: AbortSignal.timeout(5000), // 5 second timeout
        });
        
        if (response.ok) {
          setSelectedDevice(device);
          setIsConnected(true);
          await fetchDeviceData(device);
          toast({
            title: 'Connected successfully',
            description: `Connected to ${device.name}`,
          });
        } else {
          throw new Error('Device not responding');
        }
      } else if (device.type === 'bluetooth') {
        // Simulate Bluetooth connection
        await new Promise(resolve => setTimeout(resolve, 2000));
        setSelectedDevice(device);
        setIsConnected(true);
        await generateSimulatedDeviceData();
        toast({
          title: 'Bluetooth connected',
          description: `Connected to ${device.name} via Bluetooth`,
        });
      }
    } catch (error) {
      console.error('Connection error:', error);
      toast({
        title: 'Connection failed',
        description: `Could not connect to ${device.name}. Device may be offline or unreachable.`,
        variant: 'destructive',
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const connectToCustomDevice = async () => {
    if (!deviceIp.trim()) {
      toast({
        title: 'IP address required',
        description: 'Please enter a valid device IP address',
        variant: 'destructive',
      });
      return;
    }

    const customDevice: IoTDevice = {
      id: 'custom-device',
      name: 'Custom Device',
      ip: deviceIp,
      type: 'wifi',
      status: 'online'
    };

    await connectToDevice(customDevice);
  };

  const fetchDeviceData = async (device: IoTDevice) => {
    try {
      const response = await fetch(`http://${device.ip}/data`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        const data = await response.json();
        setTestData({
          moistureLevel: data.moisture || 0,
          phLevel: data.ph || 0,
          nitrogenLevel: data.nitrogen || 0,
          phosphorusLevel: data.phosphorus || 0,
          potassiumLevel: data.potassium || 0,
          temperature: data.temperature || 0,
          electricalConductivity: data.ec || 0,
        });
        setLastUpdated(new Date());
        setUseSimulatedData(false);
      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Data fetch error:', error);
      // Fallback to simulated data if real device fails
      await generateSimulatedDeviceData();
      toast({
        title: 'Using simulated data',
        description: 'Could not fetch real data, showing simulated values',
        variant: 'destructive',
      });
    }
  };

  const generateSimulatedDeviceData = async () => {
    // Simulate realistic sensor data
    setTestData({
      moistureLevel: 35 + Math.random() * 30, // 35-65%
      phLevel: 6.0 + Math.random() * 2, // 6.0-8.0
      nitrogenLevel: 40 + Math.random() * 40, // 40-80 mg/kg
      phosphorusLevel: 15 + Math.random() * 25, // 15-40 mg/kg
      potassiumLevel: 120 + Math.random() * 80, // 120-200 mg/kg
      temperature: 22 + Math.random() * 8, // 22-30°C
      electricalConductivity: 0.8 + Math.random() * 1.2, // 0.8-2.0 dS/m
    });
    setLastUpdated(new Date());
    setUseSimulatedData(true);
  };

  const disconnectDevice = () => {
    setIsConnected(false);
    setSelectedDevice(null);
    setAutoRefresh(false);
    setLastUpdated(null);
    toast({
      title: 'Disconnected',
      description: 'Device disconnected successfully',
    });
  };

  const generateSimulatedData = () => {
    setTestData({
      moistureLevel: Math.random() * 100,
      phLevel: 5.5 + Math.random() * 3, // 5.5 - 8.5
      nitrogenLevel: Math.random() * 100,
      phosphorusLevel: Math.random() * 50,
      potassiumLevel: Math.random() * 80,
      temperature: 20 + Math.random() * 15,
      electricalConductivity: Math.random() * 3,
    });
    setUseSimulatedData(true);
  };

  const analyzeData = () => {
    const rec: SoilRecommendations = {
      moisture: [],
      ph: [],
      nutrients: [],
      overall: '',
    };

    // moisture analysis
    if (testData.moistureLevel < 30) {
      rec.moisture.push('Increase irrigation frequency');
      rec.moisture.push('Consider drip irrigation system');
    } else if (testData.moistureLevel > 80) {
      rec.moisture.push('Reduce watering');
      rec.moisture.push('Improve soil drainage');
    } else {
      rec.moisture.push('Moisture levels are optimal');
    }

    // pH analysis
    if (testData.phLevel < 6.0) {
      rec.ph.push('Soil is too acidic - add lime');
      rec.ph.push('Consider organic matter addition');
    } else if (testData.phLevel > 7.5) {
      rec.ph.push('Soil is too alkaline - add sulfur');
      rec.ph.push('Use acidic fertilizers');
    } else {
      rec.ph.push('pH levels are optimal for most crops');
    }

    // nutrient analysis
    if (testData.nitrogenLevel < 40) rec.nutrients.push('Apply nitrogen-rich fertilizer (Urea)');
    if (testData.phosphorusLevel < 20) rec.nutrients.push('Add phosphorus fertilizer (DAP)');
    if (testData.potassiumLevel < 30) rec.nutrients.push('Apply potassium fertilizer (MOP)');
    if (rec.nutrients.length === 0) rec.nutrients.push('Nutrient levels are adequate');

    // overall recommendation
    const issues = [];
    if (testData.moistureLevel < 30 || testData.moistureLevel > 80) issues.push('moisture');
    if (testData.phLevel < 6.0 || testData.phLevel > 7.5) issues.push('pH');
    if (testData.nitrogenLevel < 40 || testData.phosphorusLevel < 20 || testData.potassiumLevel < 30) issues.push('nutrients');

    if (issues.length === 0) {
      rec.overall = 'Excellent! Your soil conditions are optimal for healthy crop growth.';
    } else if (issues.length === 1) {
      rec.overall = `Good soil health with minor ${issues[0]} adjustments needed.`;
    } else {
      rec.overall = `Moderate soil health. Address ${issues.join(' and ')} issues for better yields.`;
    }

    setRecommendations(rec);
  };

  const saveResults = async () => {
    if (!user?.name || !recommendations) {
      toast({
        title: 'Cannot save',
        description: 'Please sign in and run analysis first',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // For now, simulate saving results without database interaction
      // In a real app, this would require proper Supabase auth setup
      toast({
        title: 'Results saved',
        description: 'Soil test results have been saved to your dashboard (simulated)',
      });
    } catch (error) {
      console.error('Error saving results:', error);
      toast({
        title: 'Error',
        description: 'Failed to save results',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (value: number, type: string) => {
    switch (type) {
      case 'moisture':
        if (value < 30) return 'text-red-500';
        if (value > 80) return 'text-red-500';
        return 'text-green-500';
      case 'ph':
        if (value < 6.0 || value > 7.5) return 'text-red-500';
        return 'text-green-500';
      case 'nitrogen':
        return value < 40 ? 'text-red-500' : 'text-green-500';
      case 'phosphorus':
        return value < 20 ? 'text-red-500' : 'text-green-500';
      case 'potassium':
        return value < 30 ? 'text-red-500' : 'text-green-500';
      case 'temperature':
        if (value < 15 || value > 35) return 'text-red-500';
        return 'text-green-500';
      case 'ec':
        if (value > 2.5) return 'text-red-500';
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (value: number, type: string) => {
    const isGood = getStatusColor(value, type) === 'text-green-500';
    return isGood ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
  };

  const getSoilHealthColor = () => {
    const criticalCount = [
      testData.moistureLevel < 30 || testData.moistureLevel > 80,
      testData.phLevel < 6.0 || testData.phLevel > 7.5,
      testData.nitrogenLevel < 40,
      testData.phosphorusLevel < 20,
      testData.potassiumLevel < 30,
      testData.temperature < 15 || testData.temperature > 35,
      testData.electricalConductivity > 2.5
    ].filter(Boolean).length;

    if (criticalCount === 0) return 'bg-green-50 border-green-200';
    if (criticalCount <= 2) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">🌱 IoT Soil Testing</h2>

      {/* Device Connection Card */}
      <Card className={getSoilHealthColor()}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isConnected ? <Wifi className="h-5 w-5 text-green-500" /> : <WifiOff className="h-5 w-5 text-gray-400" />}
            IoT Device Connection
            {isConnected && (
              <Badge variant="outline" className="text-green-600 border-green-600">
                Connected
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isConnected ? (
            <>
              <div className="flex gap-4 mb-4">
                <Button
                  onClick={scanForDevices}
                  disabled={loading}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Activity className="h-4 w-4" />}
                  Scan for Devices
                </Button>
              </div>

              {devices.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium">Available Devices:</h4>
                  {devices.map((device) => (
                    <div key={device.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {device.type === 'wifi' ? <Wifi className="h-4 w-4" /> : <Bluetooth className="h-4 w-4" />}
                        <div>
                          <div className="font-medium">{device.name}</div>
                          <div className="text-sm text-gray-500">
                            {device.type === 'wifi' ? device.ip : 'Bluetooth Device'}
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => connectToDevice(device)}
                        disabled={isConnecting || device.status === 'offline'}
                        size="sm"
                      >
                        {isConnecting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Connect'}
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Connect Custom Device:</h4>
                <div className="flex gap-2">
                  <Input
                    placeholder="Device IP Address (e.g., 192.168.1.100)"
                    value={deviceIp}
                    onChange={(e) => setDeviceIp(e.target.value)}
                  />
                  <Button
                    onClick={connectToCustomDevice}
                    disabled={isConnecting}
                    className="flex items-center gap-2"
                  >
                    {isConnecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wifi className="h-4 w-4" />}
                    Connect
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <div>
                    <div className="font-medium">{selectedDevice?.name}</div>
                    <div className="text-sm text-gray-500">
                      {selectedDevice?.type === 'wifi' ? selectedDevice.ip : 'Bluetooth Connected'}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => selectedDevice && fetchDeviceData(selectedDevice)}
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </Button>
                  <Button
                    onClick={disconnectDevice}
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                  >
                    Disconnect
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                    className="rounded"
                  />
                  Auto-refresh every 10 seconds
                </label>
                {lastUpdated && (
                  <div className="text-sm text-gray-500">
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Manual Input Form */}
      <Card>
        <CardHeader>
          <CardTitle>Manual Soil Analysis Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Moisture Level (%)</label>
              <Input
                type="number"
                min="0"
                max="100"
                value={testData.moistureLevel}
                onChange={(e) => setTestData({...testData, moistureLevel: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">pH Level</label>
              <Input
                type="number"
                min="0"
                max="14"
                step="0.1"
                value={testData.phLevel}
                onChange={(e) => setTestData({...testData, phLevel: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Temperature (°C)</label>
              <Input
                type="number"
                min="-10"
                max="50"
                step="0.1"
                value={testData.temperature}
                onChange={(e) => setTestData({...testData, temperature: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Nitrogen (mg/kg)</label>
              <Input
                type="number"
                min="0"
                value={testData.nitrogenLevel}
                onChange={(e) => setTestData({...testData, nitrogenLevel: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phosphorus (mg/kg)</label>
              <Input
                type="number"
                min="0"
                value={testData.phosphorusLevel}
                onChange={(e) => setTestData({...testData, phosphorusLevel: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Potassium (mg/kg)</label>
              <Input
                type="number"
                min="0"
                value={testData.potassiumLevel}
                onChange={(e) => setTestData({...testData, potassiumLevel: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">EC (dS/m)</label>
              <Input
                type="number"
                min="0"
                step="0.1"
                value={testData.electricalConductivity}
                onChange={(e) => setTestData({...testData, electricalConductivity: parseFloat(e.target.value) || 0})}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={generateSimulatedData}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Activity className="h-4 w-4" />
              Generate Test Data
            </Button>
            <Button
              onClick={analyzeData}
              className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
            >
              <Zap className="h-4 w-4" />
              Analyze Soil
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Display section with soil metrics and recommendations */}
      {recommendations && (
        <div className="space-y-4">
          {/* Soil Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Soil Analysis Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Droplets className={`h-8 w-8 mx-auto mb-2 ${getStatusColor(testData.moistureLevel, 'moisture')}`} />
                  <div className="text-2xl font-bold">{testData.moistureLevel.toFixed(1)}%</div>
                  <div className="text-sm text-gray-600">Moisture</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Activity className={`h-8 w-8 mx-auto mb-2 ${getStatusColor(testData.phLevel, 'ph')}`} />
                  <div className="text-2xl font-bold">{testData.phLevel.toFixed(1)}</div>
                  <div className="text-sm text-gray-600">pH Level</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Thermometer className={`h-8 w-8 mx-auto mb-2 ${getStatusColor(testData.temperature, 'temperature')}`} />
                  <div className="text-2xl font-bold">{testData.temperature.toFixed(1)}°C</div>
                  <div className="text-sm text-gray-600">Temperature</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Leaf className={`h-8 w-8 mx-auto mb-2 ${getStatusColor(testData.nitrogenLevel, 'nitrogen')}`} />
                  <div className="text-2xl font-bold">{testData.nitrogenLevel.toFixed(0)}</div>
                  <div className="text-sm text-gray-600">Nitrogen</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Zap className={`h-8 w-8 mx-auto mb-2 ${getStatusColor(testData.phosphorusLevel, 'phosphorus')}`} />
                  <div className="text-2xl font-bold">{testData.phosphorusLevel.toFixed(0)}</div>
                  <div className="text-sm text-gray-600">Phosphorus</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <Activity className={`h-8 w-8 mx-auto mb-2 ${getStatusColor(testData.potassiumLevel, 'potassium')}`} />
                  <div className="text-2xl font-bold">{testData.potassiumLevel.toFixed(0)}</div>
                  <div className="text-sm text-gray-600">Potassium</div>
                </div>
                <div className="text-center p-4 bg-cyan-50 rounded-lg">
                  <Zap className={`h-8 w-8 mx-auto mb-2 ${getStatusColor(testData.electricalConductivity, 'ec')}`} />
                  <div className="text-2xl font-bold">{testData.electricalConductivity.toFixed(1)}</div>
                  <div className="text-sm text-gray-600">EC (dS/m)</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>AI Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Overall Assessment</h4>
                <p className="text-green-700">{recommendations.overall}</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    Moisture Management
                  </h4>
                  <ul className="space-y-2">
                    {recommendations.moisture.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-blue-400 mt-1">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-purple-500" />
                    pH Balance
                  </h4>
                  <ul className="space-y-2">
                    {recommendations.ph.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-purple-400 mt-1">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-green-500" />
                    Nutrients
                  </h4>
                  <ul className="space-y-2">
                    {recommendations.nutrients.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-green-400 mt-1">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={saveResults}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {loading ? 'Saving...' : 'Save Results'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default IoTSoilTestingService;
