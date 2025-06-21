
import { useState, useEffect } from 'react';
import { IoTData } from '@/types/app';

export const useIoTData = () => {
  const [iotData, setIoTData] = useState<IoTData>({
    soilMoisture: 65,
    temperature: 24,
    waterLevel: 78,
    humidity: 60,
    ph: 6.8,
    timestamp: new Date()
  });

  // Simulate real-time IoT data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setIoTData(prev => ({
        soilMoisture: Math.max(20, Math.min(100, prev.soilMoisture + (Math.random() - 0.5) * 10)),
        temperature: Math.max(15, Math.min(40, prev.temperature + (Math.random() - 0.5) * 3)),
        waterLevel: Math.max(10, Math.min(100, prev.waterLevel + (Math.random() - 0.5) * 8)),
        humidity: Math.max(30, Math.min(90, prev.humidity + (Math.random() - 0.5) * 5)),
        ph: Math.max(5.5, Math.min(8.5, prev.ph + (Math.random() - 0.5) * 0.3)),
        timestamp: new Date()
      }));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return { iotData };
};
