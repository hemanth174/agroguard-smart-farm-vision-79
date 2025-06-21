
import { useState, useEffect } from 'react';
import { IoTData } from '@/types/app';

export const useIoTData = () => {
  const [iotData, setIoTData] = useState<IoTData>({
    soilMoisture: 65,
    temperature: 28,
    waterLevel: 85,
    humidity: 68,
    ph: 6.8,
    timestamp: new Date()
  });

  // Simulate IoT data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setIoTData(prev => ({
        soilMoisture: Math.max(10, Math.min(100, prev.soilMoisture + (Math.random() - 0.5) * 5)),
        temperature: Math.max(15, Math.min(45, prev.temperature + (Math.random() - 0.5) * 2)),
        waterLevel: Math.max(0, Math.min(100, prev.waterLevel + (Math.random() - 0.5) * 3)),
        humidity: Math.max(30, Math.min(90, prev.humidity + (Math.random() - 0.5) * 4)),
        ph: Math.max(5.5, Math.min(8.5, prev.ph + (Math.random() - 0.5) * 0.2)),
        timestamp: new Date()
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return { iotData };
};
