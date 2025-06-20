import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Database, Droplets, Thermometer, AlertTriangle } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation, Language } from '@/utils/i18n';

const IoTDashboard = () => {
  const { language, iotData, addAlert } = useApp();
  const { t } = useTranslation(language as Language);

  // Real-time monitoring and alerting
  useEffect(() => {
    if (iotData.soilMoisture < 25) {
      addAlert({
        type: 'warning',
        title: 'Low Soil Moisture',
        message: t('lowMoisture'),
        resolved: false
      });
    }
  }, [iotData.soilMoisture, addAlert, t]);

  const getSensorStatus = (value: number, type: 'moisture' | 'temp' | 'water') => {
    switch (type) {
      case 'moisture':
        if (value < 30) return { status: 'warning', color: 'text-orange-600 border-orange-600' };
        if (value > 70) return { status: t('optimal'), color: 'text-green-600 border-green-600' };
        return { status: t('normal'), color: 'text-blue-600 border-blue-600' };
      
      case 'temp':
        if (value > 35) return { status: 'warning', color: 'text-red-600 border-red-600' };
        if (value < 20) return { status: 'warning', color: 'text-blue-600 border-blue-600' };
        return { status: t('normal'), color: 'text-green-600 border-green-600' };
      
      case 'water':
        if (value < 25) return { status: 'critical', color: 'text-red-600 border-red-600' };
        if (value > 80) return { status: t('full'), color: 'text-green-600 border-green-600' };
        return { status: t('normal'), color: 'text-blue-600 border-blue-600' };
      
      default:
        return { status: t('normal'), color: 'text-gray-600 border-gray-600' };
    }
  };

  const moistureStatus = getSensorStatus(iotData.soilMoisture, 'moisture');
  const tempStatus = getSensorStatus(iotData.temperature, 'temp');
  const waterStatus = getSensorStatus(iotData.waterLevel, 'water');

  return (
    <div className="space-y-6">
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('iotTitle')}</CardTitle>
          <Database className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Soil Moisture */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">{t('moisture')}</span>
                </div>
                <Badge variant="outline" className={moistureStatus.color}>
                  {moistureStatus.status}
                </Badge>
              </div>
              <div className="text-2xl font-bold text-gray-900">{iotData.soilMoisture.toFixed(1)}%</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${iotData.soilMoisture}%` }}
                ></div>
              </div>
            </div>

            {/* Temperature */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium">{t('temperature')}</span>
                </div>
                <Badge variant="outline" className={tempStatus.color}>
                  {tempStatus.status}
                </Badge>
              </div>
              <div className="text-2xl font-bold text-gray-900">{iotData.temperature.toFixed(1)}°C</div>
            </div>

            {/* Water Tank Level */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-cyan-500" />
                  <span className="text-sm font-medium">{t('tank')}</span>
                </div>
                <Badge variant="outline" className={waterStatus.color}>
                  {waterStatus.status}
                </Badge>
              </div>
              <div className="text-2xl font-bold text-gray-900">{iotData.waterLevel.toFixed(1)}%</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-cyan-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${iotData.waterLevel}%` }}
                ></div>
              </div>
            </div>

            {/* Status Summary */}
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <div className="text-lg font-bold text-gray-900">8/8</div>
                <div className="text-xs text-gray-500">{t('sensorsOnline')}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Critical Alerts */}
      {iotData.soilMoisture < 25 && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-orange-800">
            {t('lowMoisture')} - Irrigation recommended immediately.
          </AlertDescription>
        </Alert>
      )}

      {iotData.waterLevel < 20 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-red-800">
            Water tank critically low. Please refill immediately.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default IoTDashboard;
