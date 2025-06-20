
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Phone, AlertTriangle, Camera, MapPin, Clock, Bell } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

interface EmergencyReport {
  reportType: string;
  description: string;
  location: string;
  priority: string;
}

const EmergencyToolsService = () => {
  const [activeTab, setActiveTab] = useState('call');
  const [report, setReport] = useState<EmergencyReport>({
    reportType: 'pest',
    description: '',
    location: '',
    priority: 'medium',
  });
  const [submitting, setSubmitting] = useState(false);
  const { user, alerts } = useApp();
  const { toast } = useToast();

  const emergencyNumbers = [
    { label: 'Emergency Helpline', number: '6305003695', icon: Phone },
    { label: 'Fire Department', number: '101', icon: AlertTriangle },
    { label: 'Police', number: '100', icon: Bell },
    { label: 'Agriculture Dept', number: '155261', icon: Phone },
  ];

  const reportTypes = [
    { value: 'pest', label: 'Pest Infestation' },
    { value: 'disease', label: 'Crop Disease' },
    { value: 'weather', label: 'Weather Damage' },
    { value: 'irrigation', label: 'Irrigation Issue' },
    { value: 'equipment', label: 'Equipment Failure' },
    { value: 'fire', label: 'Fire Emergency' },
    { value: 'theft', label: 'Theft/Security' },
    { value: 'other', label: 'Other Emergency' },
  ];

  const priorityLevels = [
    { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
    { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800' },
  ];

  const makeCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  const submitReport = async () => {
    if (!user) {
      toast({
        title: 'Please sign in',
        description: 'You need to be signed in to submit emergency reports',
        variant: 'destructive',
      });
      return;
    }

    if (!report.description.trim() || !report.location.trim()) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('emergency_reports')
        .insert({
          user_id: user.id,
          report_type: report.reportType,
          description: report.description,
          location: report.location,
          priority: report.priority,
        });

      if (error) throw error;

      toast({
        title: 'Report submitted',
        description: 'Your emergency report has been submitted successfully. Our team will respond shortly.',
      });

      // Reset form
      setReport({
        reportType: 'pest',
        description: '',
        location: '',
        priority: 'medium',
      });
    } catch (error) {
      console.error('Error submitting report:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit emergency report',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const activeAlerts = alerts.filter(alert => !alert.resolved);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">🆘 Emergency Tools</h2>

      {/* Tab Navigation */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab('call')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'call' 
              ? 'border-b-2 border-green-500 text-green-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Emergency Call
        </button>
        <button
          onClick={() => setActiveTab('alerts')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'alerts' 
              ? 'border-b-2 border-green-500 text-green-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Alert Center ({activeAlerts.length})
        </button>
        <button
          onClick={() => setActiveTab('report')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'report' 
              ? 'border-b-2 border-green-500 text-green-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Report Issue
        </button>
      </div>

      {/* Emergency Call Tab */}
      {activeTab === 'call' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {emergencyNumbers.map((contact, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <contact.icon className="h-8 w-8 text-red-500" />
                    <div>
                      <h3 className="font-semibold">{contact.label}</h3>
                      <p className="text-2xl font-bold text-green-600">{contact.number}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => makeCall(contact.number)}
                    className="bg-red-600 hover:bg-red-700"
                    size="lg"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Alert Center Tab */}
      {activeTab === 'alerts' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-orange-500" />
              Active Alerts ({activeAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeAlerts.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No active alerts</h3>
                <p className="text-gray-500">All alerts have been resolved or there are no current issues.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeAlerts.map((alert, index) => (
                  <div key={index} className="p-4 border border-orange-200 bg-orange-50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-orange-600 border-orange-600">
                            {alert.type}
                          </Badge>
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date().toLocaleString()}
                          </span>
                        </div>
                        <h4 className="font-semibold text-orange-800">{alert.title}</h4>
                        <p className="text-orange-700 mt-1">{alert.message}</p>
                      </div>
                      <AlertTriangle className="h-5 w-5 text-orange-500 flex-shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Report Issue Tab */}
      {activeTab === 'report' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Report Emergency Issue
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Issue Type</label>
                <select
                  value={report.reportType}
                  onChange={(e) => setReport({...report, reportType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {reportTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Priority Level</label>
                <select
                  value={report.priority}
                  onChange={(e) => setReport({...report, priority: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {priorityLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="e.g., Field A-3, North Section, GPS coordinates"
                  value={report.location}
                  onChange={(e) => setReport({...report, location: e.target.value})}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                placeholder="Describe the emergency situation in detail..."
                value={report.description}
                onChange={(e) => setReport({...report, description: e.target.value})}
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => setReport({
                  reportType: 'pest',
                  description: '',
                  location: '',
                  priority: 'medium',
                })}
              >
                Clear Form
              </Button>
              <Button
                onClick={submitReport}
                disabled={submitting}
                className="bg-red-600 hover:bg-red-700"
              >
                {submitting ? 'Submitting...' : 'Submit Emergency Report'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmergencyToolsService;
