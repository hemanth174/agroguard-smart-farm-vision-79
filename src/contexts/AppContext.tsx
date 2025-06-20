import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface User {
  name: string;
  mobile: string;
  location: string;
  email?: string;
  image?: string;
}

interface IoTData {
  soilMoisture: number;
  temperature: number;
  waterLevel: number;
  humidity: number;
  ph: number;
  timestamp: Date;
}

interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  resolved: boolean;
  severity?: 'low' | 'medium' | 'high';
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
  isAdmin: boolean;
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
    humidity: 68,
    ph: 6.8,
    timestamp: new Date()
  });
  const { toast } = useToast();

  // Initialize from localStorage on app start
  useEffect(() => {
    const initializeApp = () => {
      try {
        // Load saved language
        const savedLanguage = localStorage.getItem('villageeye-language');
        if (savedLanguage) {
          setLanguageState(savedLanguage);
        }
        
        // Load saved user data
        const savedUser = localStorage.getItem('villageeye-user');
        const savedLoginTime = localStorage.getItem('villageeye-login-time');
        
        if (savedUser && savedLoginTime) {
          const loginTime = parseInt(savedLoginTime);
          const currentTime = Date.now();
          const timeDiff = currentTime - loginTime;
          
          // Keep user logged in for 30 days (30 * 24 * 60 * 60 * 1000 ms)
          const maxSessionTime = 30 * 24 * 60 * 60 * 1000;
          
          if (timeDiff < maxSessionTime) {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
            console.log('✅ User auto-logged in:', parsedUser.name);
          } else {
            // Session expired, clear stored data
            localStorage.removeItem('villageeye-user');
            localStorage.removeItem('villageeye-login-time');
            console.log('⚠️ User session expired, cleared data');
          }
        }
      } catch (error) {
        console.error('Error initializing app:', error);
        // Clear corrupted data
        localStorage.removeItem('villageeye-user');
        localStorage.removeItem('villageeye-login-time');
      }
    };

    initializeApp();
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
        humidity: Math.max(30, Math.min(90, prev.humidity + (Math.random() - 0.5) * 4)),
        ph: Math.max(5.5, Math.min(8.5, prev.ph + (Math.random() - 0.5) * 0.2)),
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
        title: 'Low Soil Moisture',
        message: 'Low soil moisture detected. Irrigation recommended.',
        resolved: false
      });
    }
    
    if (iotData.waterLevel < 20) {
      addAlert({
        type: 'error',
        title: 'Water Level Critical',
        message: 'Water tank level critically low.',
        resolved: false
      });
    }
  }, [iotData]);

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('villageeye-language', lang);
  };

  const signIn = (name: string, mobile: string) => {
    try {
      // Simulate location detection
      const mockLocation = 'Telangana, India';
      const newUser = { name, mobile, location: mockLocation };
      
      // Set user state
      setUser(newUser);
      
      // Persist user data and login time to localStorage
      localStorage.setItem('villageeye-user', JSON.stringify(newUser));
      localStorage.setItem('villageeye-login-time', Date.now().toString());
      
      console.log('✅ User signed in and data persisted:', newUser);
      
      toast({
        title: "Welcome to VillageEye!",
        description: `Signed in successfully as ${name}`,
      });
    } catch (error) {
      console.error('Error during sign in:', error);
      toast({
        title: "Sign In Error",
        description: "Failed to save login data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const signOut = () => {
    try {
      setUser(null);
      // Clear persisted data
      localStorage.removeItem('villageeye-user');
      localStorage.removeItem('villageeye-login-time');
      
      console.log('✅ User signed out and data cleared');
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    } catch (error) {
      console.error('Error during sign out:', error);
    }
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
      isAdmin: user?.name === 'admin', // Simple admin check
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
