
import { useState, useCallback } from 'react';
import { Alert } from '@/types/app';
import { useToast } from '@/hooks/use-toast';

export const useAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const { toast } = useToast();

  const addAlert = useCallback((alert: Omit<Alert, 'id' | 'timestamp'>) => {
    const newAlert: Alert = {
      ...alert,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    
    setAlerts(prev => [newAlert, ...prev]);
    
    // Show toast notification
    toast({
      title: "New Alert",
      description: alert.message,
      variant: alert.type === 'error' ? 'destructive' : 'default',
    });
  }, [toast]);

  const resolveAlert = useCallback((id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, resolved: true } : alert
    ));
  }, []);

  return {
    alerts,
    addAlert,
    resolveAlert
  };
};
