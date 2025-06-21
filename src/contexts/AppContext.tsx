
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { AppContextType } from '@/types/app';
import { useAuth } from '@/hooks/useAuth';
import { useAlerts } from '@/hooks/useAlerts';
import { useIoTData } from '@/hooks/useIoTData';
import { useLanguage } from '@/hooks/useLanguage';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();
  const alerts = useAlerts();
  const { iotData } = useIoTData();
  const language = useLanguage();
  const { isOnline } = useOnlineStatus();

  // Initialize app on mount
  useEffect(() => {
    language.initializeLanguage();
    auth.initializeAuth();
  }, []);

  // Monitor IoT data for alerts
  useEffect(() => {
    if (iotData.soilMoisture < 30) {
      alerts.addAlert({
        type: 'warning',
        title: 'Low Soil Moisture',
        message: 'Low soil moisture detected. Irrigation recommended.',
        resolved: false
      });
    }
    
    if (iotData.waterLevel < 20) {
      alerts.addAlert({
        type: 'error',
        title: 'Water Level Critical',
        message: 'Water tank level critically low.',
        resolved: false
      });
    }
  }, [iotData, alerts.addAlert]);

  return (
    <AppContext.Provider value={{
      language: language.language,
      setLanguage: language.setLanguage,
      user: auth.user,
      setUser: auth.setUser,
      isOnline,
      iotData,
      alerts: alerts.alerts,
      addAlert: alerts.addAlert,
      resolveAlert: alerts.resolveAlert,
      isSignedIn: auth.isSignedIn,
      isAdmin: auth.isAdmin,
      signIn: auth.signIn,
      signOut: auth.signOut
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
