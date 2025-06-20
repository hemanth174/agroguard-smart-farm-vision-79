import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  AlertTriangle, 
  Phone, 
  MessageSquare, 
  Bell, 
  Plane,
  MapPin,
  Clock,
  Mic,
  MicOff,
  Camera,
  Send
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation, Language } from '@/utils/i18n';

const EmergencySection = () => {
  const { language, addAlert } = useApp();
  const { t } = useTranslation(language as Language);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [reportForm, setReportForm] = useState({ type: '', description: '', location: '' });
  const [isListening, setIsListening] = useState(false);

  const emergencyActions = [
    {
      id: 'emergency-call',
      title: t('emergencyCall'),
      description: 'Call emergency services',
      icon: Phone,
      color: 'bg-red-100 text-red-700 hover:bg-red-200',
      urgent: true
    },
    {
      id: 'report-issue',
      title: t('reportIssue'),
      description: 'Report a farming issue',
      icon: MessageSquare,
      color: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
      urgent: false
    },
    {
      id: 'alert-center',
      title: 'Alert Center',
      description: 'View active alerts',
      icon: Bell,
      color: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
      urgent: false
    },
    {
      id: 'drone-patrol',
      title: 'Drone Patrol',
      description: 'Monitor with AI drones',
      icon: Plane,
      color: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
      urgent: false
    }
  ];

  const activeAlerts = [
    {
      id: 1,
      type: 'weather',
      title: t('weatherAlert'),
      severity: 'high',
      location: 'Field A-12',
      time: '5 min ago'
    },
    {
      id: 2,
      type: 'pest',
      title: 'Pest Detection Alert',
      severity: 'medium',
      location: 'Field B-8',
      time: '1 hour ago'
    },
    {
      id: 3,
      type: 'irrigation',
      title: 'Irrigation System Alert',
      severity: 'low',
      location: 'Sector C',
      time: '3 hours ago'
    }
  ];

  const dronePatrolData = [
    {
      id: 1,
      status: 'Active',
      location: 'Zone A',
      battery: '85%',
      lastScan: '2 min ago',
      alerts: 0
    },
    {
      id: 2,
      status: 'Charging',
      location: 'Base Station',
      battery: '45%',
      lastScan: '30 min ago',
      alerts: 2
    }
  ];

  const handleEmergencyCall = () => {
    // In a real app, this would trigger an actual call
    addAlert({
      type: 'error',
      title: 'Emergency Call Initiated',
      message: 'Emergency services have been contacted.',
      severity: 'high',
      resolved: false
    });
    alert('Emergency call initiated! (Demo mode)');
  };

  const handleReportSubmit = () => {
    if (reportForm.description) {
      addAlert({
        type: 'info',
        title: `Issue Reported: ${reportForm.type}`,
        message: reportForm.description,
        severity: 'medium',
        resolved: false
      });
      setReportForm({ type: '', description: '', location: '' });
      setSelectedAction(null);
    }
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    // In a real app, this would start/stop speech recognition
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        setReportForm(prev => ({
          ...prev,
          description: prev.description + ' [Voice input simulated]'
        }));
      }, 2000);
    }
  };

  const renderActionContent = () => {
    switch (selectedAction) {
      case 'emergency-call':
        return (
          <div className="space-y-4">
            <div className="text-center">
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-red-700">Emergency Call</h3>
              <p className="text-gray-600 mb-6">This will contact emergency services immediately</p>
              <Button onClick={handleEmergencyCall} className="bg-red-600 hover:bg-red-700">
                <Phone className="w-4 h-4 mr-2" />
                Call Emergency Services
              </Button>
            </div>
          </div>
        );

      case 'report-issue':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Report an Issue</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Issue Type</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={reportForm.type}
                  onChange={(e) => setReportForm(prev => ({ ...prev, type: e.target.value }))}
                >
                  <option value="">Select issue type</option>
                  <option value="pest">Pest Problem</option>
                  <option value="disease">Plant Disease</option>
                  <option value="irrigation">Irrigation Issue</option>
                  <option value="equipment">Equipment Failure</option>
                  <option value="weather">Weather Damage</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <Input
                  placeholder="Enter field location"
                  value={reportForm.location}
                  onChange={(e) => setReportForm(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Textarea
                  placeholder="Describe the issue in detail..."
                  value={reportForm.description}
                  onChange={(e) => setReportForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={toggleVoiceInput}
                  className={isListening ? 'bg-red-100' : ''}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  {isListening ? 'Stop Recording' : 'Voice Input'}
                </Button>
                <Button variant="outline">
                  <Camera className="w-4 h-4 mr-2" />
                  Add Photo
                </Button>
              </div>
              
              <Button onClick={handleReportSubmit} className="w-full">
                <Send className="w-4 h-4 mr-2" />
                Submit Report
              </Button>
            </div>
          </div>
        );

      case 'alert-center':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Active Alerts</h3>
            <div className="space-y-3">
              {activeAlerts.map((alert) => (
                <div key={alert.id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          alert.severity === 'high' ? 'destructive' : 
                          alert.severity === 'medium' ? 'default' : 'secondary'
                        }>
                          {alert.severity}
                        </Badge>
                        <span className="font-medium">{alert.title}</span>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {alert.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {alert.time}
                        </span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'drone-patrol':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Drone Patrol Status</h3>
            <div className="space-y-3">
              {dronePatrolData.map((drone) => (
                <div key={drone.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Plane className="w-4 h-4" />
                        <span className="font-medium">Drone {drone.id}</span>
                        <Badge variant={drone.status === 'Active' ? 'default' : 'secondary'}>
                          {drone.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Location: {drone.location} • Battery: {drone.battery}
                      </div>
                      <div className="text-xs text-gray-500">
                        Last scan: {drone.lastScan} • Alerts: {drone.alerts}
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Control
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full">
              <Plane className="w-4 h-4 mr-2" />
              Deploy New Patrol
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="border-red-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50">
        <CardTitle className="flex items-center gap-2 text-red-700">
          <AlertTriangle className="w-5 h-5" />
          {t('emergencySection')}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {selectedAction ? (
          <div>
            <Button 
              variant="outline" 
              onClick={() => setSelectedAction(null)}
              className="mb-4"
            >
              ← Back to Emergency Actions
            </Button>
            {renderActionContent()}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {emergencyActions.map((action) => (
              <Card 
                key={action.id}
                className={`cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105 ${
                  action.urgent ? 'border-red-300' : 'border-gray-200'
                }`}
                onClick={() => setSelectedAction(action.id)}
              >
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mx-auto mb-3`}>
                    <action.icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold mb-1">{action.title}</h4>
                  <p className="text-xs text-gray-600">{action.description}</p>
                  {action.urgent && (
                    <Badge variant="destructive" className="mt-2 text-xs">
                      URGENT
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmergencySection;
