
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AlertsCardProps {
  language: string;
}

const AlertsCard = ({ language }: AlertsCardProps) => {
  const [hasNotifiedToday, setHasNotifiedToday] = useState(false);
  const [lastNotificationTime, setLastNotificationTime] = useState<number>(0);
  const { toast } = useToast();

  const translations = {
    en: {
      title: 'Alerts',
      active: 'Active',
      resolved: 'Resolved Today',
      viewAll: 'View All Alerts',
      newAlert: 'New Alert!',
      lowMoisture: 'Low soil moisture detected in field A-3'
    },
    hi: {
      title: 'अलर्ट',
      active: 'सक्रिय',
      resolved: 'आज हल हुए',
      viewAll: 'सभी अलर्ट देखें',
      newAlert: 'नया अलर्ट!',
      lowMoisture: 'खेत A-3 में मिट्टी की नमी कम है'
    },
    te: {
      title: 'హెచ్చరికలు',
      active: 'క్రియాశీలం',
      resolved: 'ఈరోజు పరిష్కరించబడినవి',
      viewAll: 'అన్ని హెచ్చరికలు చూడండి',
      newAlert: 'కొత్త హెచ్చరిక!',
      lowMoisture: 'A-3 పొలంలో మట్టి తేమ తక్కువగా ఉంది'
    }
  };

  const t = translations[language];

  // Function to check if we should send a new notification
  const shouldSendNotification = () => {
    const now = Date.now();
    const cooldownPeriod = 30 * 60 * 1000; // 30 minutes in milliseconds
    const today = new Date().toDateString();
    const lastNotificationDate = new Date(lastNotificationTime).toDateString();
    
    // Reset daily flag if it's a new day
    if (today !== lastNotificationDate) {
      setHasNotifiedToday(false);
    }

    // Only send if we haven't notified today and cooldown period has passed
    return !hasNotifiedToday && (now - lastNotificationTime > cooldownPeriod);
  };

  // Function to send notification with cooldown protection
  const sendNotification = () => {
    if (shouldSendNotification()) {
      toast({
        title: t.newAlert,
        description: t.lowMoisture,
        variant: "destructive",
      });
      
      setHasNotifiedToday(true);
      setLastNotificationTime(Date.now());
      
      // Store in localStorage to persist across page reloads
      localStorage.setItem('lastAlertNotification', Date.now().toString());
      localStorage.setItem('notifiedToday', 'true');
    }
  };

  // Load notification state from localStorage on component mount
  useEffect(() => {
    const storedLastNotification = localStorage.getItem('lastAlertNotification');
    const storedNotifiedToday = localStorage.getItem('notifiedToday');
    
    if (storedLastNotification) {
      setLastNotificationTime(parseInt(storedLastNotification));
    }
    
    if (storedNotifiedToday === 'true') {
      const today = new Date().toDateString();
      const lastNotificationDate = new Date(parseInt(storedLastNotification || '0')).toDateString();
      
      if (today === lastNotificationDate) {
        setHasNotifiedToday(true);
      } else {
        // New day, reset the flag
        localStorage.setItem('notifiedToday', 'false');
      }
    }
  }, []);

  // Simulate alert checking every 5 minutes (in real app, this would be from IoT sensors)
  useEffect(() => {
    const alertCheckInterval = setInterval(() => {
      // Only simulate new alerts if soil moisture is actually low (mock condition)
      const mockSoilMoisture = Math.random() * 100;
      if (mockSoilMoisture < 20) { // Less than 20% moisture
        sendNotification();
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(alertCheckInterval);
  }, [hasNotifiedToday, lastNotificationTime]);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{t.title}</CardTitle>
        <Bell className="h-4 w-4 text-orange-600" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-orange-600">2</div>
            <Badge variant="outline" className="text-orange-600 border-orange-600">
              {t.active}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>{t.resolved}</span>
            <span className="font-medium text-green-600">5</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-md">
              <AlertTriangle className="h-3 w-3 text-orange-500" />
              <span className="text-xs text-orange-800">Low soil moisture</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertsCard;
