
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface User {
  name: string;
  mobile: string;
  location: string;
}

interface IoTData {
  soilMoisture: number;
  temperature: number;
  waterLevel: number;
  timestamp: Date;
}

interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: Date;
  resolved: boolean;
}

interface AppContextType {
  language: string;
  setLanguage: (lang: string) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  isOnline: boolean;
  iotData: IoTData;
  alerts: Alert[];
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp'>) => void;
  resolveAlert: (id: string) => void;
  isSignedIn: boolean;
  signIn: (name: string, mobile: string) => void;
  signOut: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<string>('en');
  const [user, setUser] = useState<User | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [iotData, setIoTData] = useState<IoTData>({
    soilMoisture: 65,
    temperature: 28,
    waterLevel: 85,
    timestamp: new Date()
  });
  const { toast } = useToast();

  // Initialize from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('agroguard-language');
    const savedUser = localStorage.getItem('agroguard-user');
    
    if (savedLanguage) {
      setLanguageState(savedLanguage);
    }
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Connection Restored",
        description: "You're back online!",
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "Offline Mode Activated",
        description: "Limited functionality available. SMS alerts will be used.",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  // Simulate IoT data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setIoTData(prev => ({
        soilMoisture: Math.max(10, Math.min(100, prev.soilMoisture + (Math.random() - 0.5) * 5)),
        temperature: Math.max(15, Math.min(45, prev.temperature + (Math.random() - 0.5) * 2)),
        waterLevel: Math.max(0, Math.min(100, prev.waterLevel + (Math.random() - 0.5) * 3)),
        timestamp: new Date()
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Monitor IoT data for alerts
  useEffect(() => {
    if (iotData.soilMoisture < 30) {
      addAlert({
        type: 'warning',
        message: 'Low soil moisture detected. Irrigation recommended.',
        resolved: false
      });
    }
    
    if (iotData.waterLevel < 20) {
      addAlert({
        type: 'error',
        message: 'Water tank level critically low.',
        resolved: false
      });
    }
  }, [iotData]);

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('agroguard-language', lang);
  };

  const signIn = (name: string, mobile: string) => {
    // Simulate location detection
    const mockLocation = 'Telangana, India';
    const newUser = { name, mobile, location: mockLocation };
    setUser(newUser);
    localStorage.setItem('agroguard-user', JSON.stringify(newUser));
    
    toast({
      title: "Welcome to AgroGuard!",
      description: `Signed in successfully as ${name}`,
    });
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('agroguard-user');
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
  };

  const addAlert = (alert: Omit<Alert, 'id' | 'timestamp'>) => {
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
  };

  const resolveAlert = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, resolved: true } : alert
    ));
  };

  return (
    <AppContext.Provider value={{
      language,
      setLanguage,
      user,
      setUser,
      isOnline,
      iotData,
      alerts,
      addAlert,
      resolveAlert,
      isSignedIn: !!user,
      signIn,
      signOut
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
