import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Video, MapPin, Camera, AlertTriangle, Flame, Bug } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation, Language } from '@/utils/i18n';

interface Detection {
  id: string;
  type: 'fire' | 'damage' | 'animal' | 'pipeline';
  confidence: number;
  location: string;
  timestamp: Date;
  description: string;
}

const DroneMonitor = () => {
  const { language, addAlert } = useApp();
  const { t } = useTranslation(language as Language);
  const [isScanning, setIsScanning] = useState(false);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [liveFeed, setLiveFeed] = useState(true);

  // Simulate AI vision detections
  useEffect(() => {
    if (!isScanning) return;

    const interval = setInterval(() => {
      const randomDetection = Math.random();
      
      if (randomDetection < 0.1) { // 10% chance of detection
        const detectionTypes = [
          {
            type: 'fire' as const,
            description: 'Fire outbreak detected in sector B',
            confidence: Math.random() * 30 + 70
          },
          {
            type: 'damage' as const,
            description: 'Crop damage spotted in field A',
            confidence: Math.random() * 20 + 80
          },
          {
            type: 'animal' as const,
            description: 'Wild animal intrusion detected',
            confidence: Math.random() * 25 + 75
          },
          {
            type: 'pipeline' as const,
            description: 'Pipeline leak identified',
            confidence: Math.random() * 20 + 80
          }
        ];

        const detection = detectionTypes[Math.floor(Math.random() * detectionTypes.length)];
        
        const newDetection: Detection = {
          id: Date.now().toString(),
          ...detection,
          location: `GPS: ${(Math.random() * 0.01 + 17.385).toFixed(6)}, ${(Math.random() * 0.01 + 78.486).toFixed(6)}`,
          timestamp: new Date()
        };

        setDetections(prev => [newDetection, ...prev.slice(0, 4)]);
        
        // Add alert for critical detections
        if (detection.type === 'fire' || detection.confidence > 85) {
          addAlert({
            type: 'error',
            title: 'AI Vision Alert',
            message: `AI Vision: ${detection.description}`,
            resolved: false
          });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isScanning, addAlert]);

  const startDroneScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 30000); // 30 second scan
  };

  const getDetectionIcon = (type: string) => {
    switch (type) {
      case 'fire': return <Flame className="h-4 w-4 text-red-500" />;
      case 'damage': return <Bug className="h-4 w-4 text-orange-500" />;
      case 'animal': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'pipeline': return <AlertTriangle className="h-4 w-4 text-blue-500" />;
      default: return <Camera className="h-4 w-4" />;
    }
  };

  const getDetectionColor = (type: string) => {
    switch (type) {
      case 'fire': return 'text-red-600 border-red-600';
      case 'damage': return 'text-orange-600 border-orange-600';
      case 'animal': return 'text-yellow-600 border-yellow-600';
      case 'pipeline': return 'text-blue-600 border-blue-600';
      default: return 'text-gray-600 border-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Drone Status Card */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('droneTitle')}</CardTitle>
          <Video className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge className={`${isScanning ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'} hover:bg-current`}>
                {isScanning ? 'Scanning...' : t('droneStatus')}
              </Badge>
              <MapPin className="h-3 w-3 text-gray-400" />
            </div>
            
            <div className="text-xs text-gray-600 space-y-1">
              <p>{t('lastScan')}</p>
              <p>{t('coverage')}</p>
              {detections.length === 0 && (
                <p className="text-green-600 font-medium">{t('issues')}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button 
                size="sm" 
                className="bg-green-600 hover:bg-green-700"
                onClick={startDroneScan}
                disabled={isScanning}
              >
                {isScanning ? 'Scanning...' : 'Start Scan'}
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setLiveFeed(!liveFeed)}
              >
                {liveFeed ? 'Stop Feed' : t('viewLive')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Feed Simulation */}
      {liveFeed && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Live Drone Feed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 rounded-lg p-4 text-center text-white">
              <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm opacity-75">
                {isScanning ? 'AI Vision Processing...' : 'Drone Camera Feed'}
              </p>
              {isScanning && (
                <div className="mt-2">
                  <div className="animate-pulse bg-green-500 h-1 w-full rounded"></div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Detection Results */}
      {detections.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">AI Vision Detections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {detections.map((detection) => (
                <Alert key={detection.id} className="border-l-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getDetectionIcon(detection.type)}
                      <div>
                        <p className="font-medium">{detection.description}</p>
                        <p className="text-xs text-gray-500">
                          {detection.location} • {detection.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className={getDetectionColor(detection.type)}>
                      {detection.confidence.toFixed(1)}%
                    </Badge>
                  </div>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DroneMonitor;
