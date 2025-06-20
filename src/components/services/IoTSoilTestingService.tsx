
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Activity, Droplets, Zap, Leaf, TrendingUp, TrendingDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

interface SoilTestData {
  fieldLocation: string;
  moistureLevel: number;
  phLevel: number;
  nitrogenLevel: number;
  phosphorusLevel: number;
  potassiumLevel: number;
}

interface SoilRecommendations {
  moisture: string[];
  ph: string[];
  nutrients: string[];
  overall: string;
}

const IoTSoilTestingService = () => {
  const [testData, setTestData] = useState<SoilTestData>({
    fieldLocation: '',
    moistureLevel: 0,
    phLevel: 0,
    nitrogenLevel: 0,
    phosphorusLevel: 0,
    potassiumLevel: 0,
  });
  const [recommendations, setRecommendations] = useState<SoilRecommendations | null>(null);
  const [loading, setLoading] = useState(false);
  const [useSimulatedData, setUseSimulatedData] = useState(false);
  const { user } = useApp();
  const { toast } = useToast();

  const generateSimulatedData = () => {
    setTestData({
      fieldLocation: 'Field A-3',
      moistureLevel: Math.random() * 100,
      phLevel: 5.5 + Math.random() * 3, // 5.5 - 8.5
      nitrogenLevel: Math.random() * 100,
      phosphorusLevel: Math.random() * 50,
      potassiumLevel: Math.random() * 80,
    });
    setUseSimulatedData(true);
  };

  const analyzeData = () => {
    if (!testData.fieldLocation.trim()) {
      toast({
        title: 'Field location required',
        description: 'Please enter a field location',
        variant: 'destructive',
      });
      return;
    }

    const rec: SoilRecommendations = {
      moisture: [],
      ph: [],
      nutrients: [],
      overall: '',
    };

    // Moisture analysis
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

    // Nutrient analysis
    if (testData.nitrogenLevel < 40) rec.nutrients.push('Apply nitrogen-rich fertilizer (Urea)');
    if (testData.phosphorusLevel < 20) rec.nutrients.push('Add phosphorus fertilizer (DAP)');
    if (testData.potassiumLevel < 30) rec.nutrients.push('Apply potassium fertilizer (MOP)');
    if (rec.nutrients.length === 0) rec.nutrients.push('Nutrient levels are adequate');

    // Overall recommendation
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
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (value: number, type: string) => {
    const isGood = getStatusColor(value, type) === 'text-green-500';
    return isGood ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">🌱 IoT Soil Testing</h2>

      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle>Soil Analysis Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Field Location</label>
            <Input
              placeholder="e.g., Field A-3, North Section"
              value={testData.fieldLocation}
              onChange={(e) => setTestData({...testData, fieldLocation: e.target.value})}
            />
          </div>

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

      {/* Results Display */}
      {recommendations && (
        <div className="space-y-4">
          {/* Soil Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Soil Analysis Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
