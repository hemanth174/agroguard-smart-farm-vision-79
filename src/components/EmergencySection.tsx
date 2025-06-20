
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  Phone, 
  MessageSquare, 
  Video, 
  Shield,
  Flame,
  Bug,
  Droplets
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/utils/i18n';

const EmergencySection = () => {
  const { language, addAlert, alerts } = useApp();
  const { t } = useTranslation(language);

  const emergencyActions = [
    {
      id: 'fire',
      icon: Flame,
      title: language === 'en' ? 'Fire Alert' : language === 'hi' ? 'आग अलर्ट' : 'అగ్ని హెచ్చరిక',
      description: language === 'en' ? 'Report fire outbreaks' : language === 'hi' ? 'आग की रिपोर्ट करें' : 'అగ్ని వ్యాప్తిని నివేదించండి',
      action: () => addAlert({ type: 'error', message: 'Fire emergency reported - authorities notified', resolved: false }),
      urgent: true
    },
    {
      id: 'pest',
      icon: Bug,
      title: language === 'en' ? 'Pest Attack' : language === 'hi' ? 'कीट आक्रमण' : 'కీటకాల దాడి',
      description: language === 'en' ? 'Massive pest infestation' : language === 'hi' ? 'बड़े पैमाने पर कीट संक्रमण' : 'భారీ కీటకాల ముట్టడి',
      action: () => addAlert({ type: 'warning', message: 'Pest infestation reported - expert consultation requested', resolved: false }),
      urgent: false
    },
    {
      id: 'flood',
      icon: Droplets,
      title: language === 'en' ? 'Flood/Drainage' : language === 'hi' ? 'बाढ़/जल निकासी' : 'వరద/డ్రైనేజీ',
      description: language === 'en' ? 'Water logging issues' : language === 'hi' ? 'जल भराव की समस्या' : 'నీరు నిలిచిపోవడం',
      action: () => addAlert({ type: 'warning', message: 'Flooding reported - drainage assessment initiated', resolved: false }),
      urgent: true
    }
  ];

  const quickActions = [
    {
      icon: Phone,
      title: language === 'en' ? 'Emergency Call' : language === 'hi' ? 'आपातकालीन कॉल' : 'అత్యవసర కాల్',
      action: () => window.open('tel:1800-XXX-XXXX'),
      color: 'bg-red-600 hover:bg-red-700'
    },
    {
      icon: MessageSquare,
      title: language === 'en' ? 'Report Issue' : language === 'hi' ? 'समस्या रिपोर्ट करें' : 'సమస్యను నివేదించండి',
      action: () => addAlert({ type: 'info', message: 'Issue report form opened', resolved: false }),
      color: 'bg-orange-600 hover:bg-orange-700'
    },
    {
      icon: Video,
      title: language === 'en' ? 'Drone Patrol' : language === 'hi' ? 'ड्रोन गश्त' : 'డ్రోన్ గస్తీ',
      action: () => addAlert({ type: 'info', message: 'Emergency drone patrol activated', resolved: false }),
      color: 'bg-blue-600 hover:bg-blue-700'
    }
  ];

  const activeAlerts = alerts.filter(alert => !alert.resolved).slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Emergency Actions */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-800 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {language === 'en' ? 'Emergency Actions' : language === 'hi' ? 'आपातकालीन कार्य' : 'అత్యవసర చర్యలు'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {emergencyActions.map((action) => (
              <Button
                key={action.id}
                onClick={action.action}
                variant="outline"
                className={`h-20 flex-col gap-2 ${action.urgent ? 'border-red-500 text-red-700 hover:bg-red-50' : 'border-orange-500 text-orange-700 hover:bg-orange-50'}`}
              >
                <action.icon className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium text-sm">{action.title}</div>
                  <div className="text-xs opacity-75">{action.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions.map((action, index) => (
          <Button
            key={index}
            onClick={action.action}
            className={`h-16 flex items-center gap-3 ${action.color} text-white`}
          >
            <action.icon className="h-5 w-5" />
            {action.title}
          </Button>
        ))}
      </div>

      {/* Alert Center */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            {language === 'en' ? 'Alert Center' : language === 'hi' ? 'अलर्ट केंद्र' : 'హెచ్చరిక కేంద్రం'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeAlerts.length > 0 ? (
            <div className="space-y-3">
              {activeAlerts.map((alert) => (
                <Alert key={alert.id} className={alert.type === 'error' ? 'border-red-200' : alert.type === 'warning' ? 'border-orange-200' : 'border-blue-200'}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="flex justify-between items-center">
                    <span>{alert.message}</span>
                    <Badge variant={alert.type === 'error' ? 'destructive' : 'outline'}>
                      {alert.type === 'error' ? 'Critical' : alert.type === 'warning' ? 'Warning' : 'Info'}
                    </Badge>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              {language === 'en' ? 'No active alerts' : language === 'hi' ? 'कोई सक्रिय अलर्ट नहीं' : 'క్రియాశీల హెచ్చరికలు లేవు'}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmergencySection;
