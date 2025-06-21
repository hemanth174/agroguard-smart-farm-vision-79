
export interface User {
  name: string;
  mobile: string;
  location: string;
}

export interface IoTData {
  soilMoisture: number;
  temperature: number;
  waterLevel: number;
  humidity: number;
  ph: number;
  timestamp: Date;
}

export interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  resolved: boolean;
  severity?: 'low' | 'medium' | 'high';
}

export interface AppContextType {
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
