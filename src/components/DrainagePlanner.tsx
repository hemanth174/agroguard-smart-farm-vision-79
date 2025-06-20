
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/utils/i18n';

interface DrainagePlan {
  farmSize: number;
  rainfall: number;
  soilType: string;
  pipeLength: number;
  pipeDiameter: number;
  drainagePoints: number;
  estimatedCost: number;
}

const DrainagePlanner = () => {
  const { language } = useApp();
  const { t } = useTranslation(language);
  const [farmSize, setFarmSize] = useState<string>('');
  const [rainfall, setRainfall] = useState<string>('');
  const [soilType, setSoilType] = useState<string>('clay');
  const [plan, setPlan] = useState<DrainagePlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateDrainagePlan = async () => {
    if (!farmSize || !rainfall) return;
    
    setIsGenerating(true);
    
    // Simulate planning calculation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const size = parseFloat(farmSize);
    const rain = parseFloat(rainfall);
    
    // Simple drainage calculation logic
    const drainageCoefficient = soilType === 'clay' ? 1.5 : soilType === 'loam' ? 1.2 : 1.0;
    const pipeLength = Math.ceil(size * 100 * drainageCoefficient); // meters
    const pipeDiameter = rain > 1000 ? 300 : rain > 500 ? 250 : 200; // mm
    const drainagePoints = Math.ceil(size / 2); // points per acre
    const estimatedCost = pipeLength * 150 + drainagePoints * 5000; // INR

    const newPlan: DrainagePlan = {
      farmSize: size,
      rainfall: rain,
      soilType,
      pipeLength,
      pipeDiameter,
      drainagePoints,
      estimatedCost
    };

    setPlan(newPlan);
    setIsGenerating(false);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Drainage System Planner</CardTitle>
        <p className="text-sm text-gray-600">Plan your farm's drainage system to prevent flooding</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="farmSize">Farm Size (acres)</Label>
            <Input
              id="farmSize"
              type="number"
              placeholder="e.g., 5"
              value={farmSize}
              onChange={(e) => setFarmSize(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="rainfall">Annual Rainfall (mm)</Label>
            <Input
              id="rainfall"
              type="number"
              placeholder="e.g., 800"
              value={rainfall}
              onChange={(e) => setRainfall(e.target.value)}
            />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="soilType">Soil Type</Label>
            <select
              id="soilType"
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="clay">Clay (Heavy drainage needed)</option>
              <option value="loam">Loam (Moderate drainage)</option>
              <option value="sandy">Sandy (Light drainage)</option>
            </select>
          </div>
        </div>

        <Button 
          onClick={generateDrainagePlan}
          disabled={!farmSize || !rainfall || isGenerating}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isGenerating ? 'Generating Plan...' : 'Generate Drainage Plan'}
        </Button>

        {/* Drainage Plan Results */}
        {plan && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-lg mb-4">Recommended Drainage Plan</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Pipe Length Required:</span>
                  <Badge variant="outline">{plan.pipeLength}m</Badge>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Pipe Diameter:</span>
                  <Badge variant="outline">{plan.pipeDiameter}mm</Badge>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Drainage Points:</span>
                  <Badge variant="outline">{plan.drainagePoints}</Badge>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Cost:</span>
                  <Badge className="bg-green-100 text-green-800">₹{plan.estimatedCost.toLocaleString()}</Badge>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Installation Time:</span>
                  <Badge variant="outline">5-7 days</Badge>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Maintenance:</span>
                  <Badge variant="outline">Annual</Badge>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="mt-4 p-3 bg-white rounded border">
              <h4 className="font-medium mb-2">Installation Recommendations:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Install main drainage line along the lowest elevation</li>
                <li>• Place secondary drains every 50-100 meters</li>
                <li>• Ensure 1% minimum slope for proper water flow</li>
                <li>• Use filter fabric around pipes to prevent clogging</li>
                <li>• Install inspection chambers at junction points</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DrainagePlanner;
