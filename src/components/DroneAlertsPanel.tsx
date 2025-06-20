import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  Fire, 
  Bug, 
  Zap, 
  MapPin, 
  Clock, 
  CheckCircle,
  X,
  Eye
} from 'lucide-react';
import { useDronePatrol } from '@/hooks/useDronePatrol';

const DroneAlertsPanel = () => {
  const { alerts, acknowledgeAlert, resolveAlert, loading } = useDronePatrol();

  const getAlertIcon = (alertType: string) => {
    switch (alertType) {
      case 'fire_detection': return <Fire className="h-4 w-4 text-red-500" />;
      case 'pest_infestation': return <Bug className="h-4 w-4 text-orange-500" />;
      case 'animal_intrusion': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'pipeline_damage': return <Zap className="h-4 w-4 text-blue-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-green-500 bg-green-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const criticalAlerts = alerts.filter(a => a.priority_level === 'critical');
  const highAlerts = alerts.filter(a => a.priority_level === 'high');
  const otherAlerts = alerts.filter(a => !['critical', 'high'].includes(a.priority_level));

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Drone Alerts Center
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-2 border-orange-600 border-t-transparent rounded-full mx-auto mb-3"></div>
            <p className="text-gray-500">Loading alerts...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Critical Alerts Banner */}
      {criticalAlerts.length > 0 && (
        <Alert className="border-red-500 bg-red-50 animate-pulse">
          <Fire className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-800">
            <strong>🚨 EMERGENCY ALERT:</strong> {criticalAlerts.length} critical issue(s) require immediate attention!
          </AlertDescription>
        </Alert>
      )}

      {/* Alerts Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-red-600">{criticalAlerts.length}</p>
                <p className="text-sm text-gray-600">Critical</p>
              </div>
              <Fire className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-orange-600">{highAlerts.length}</p>
                <p className="text-sm text-gray-600">High Priority</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-yellow-600">{otherAlerts.length}</p>
                <p className="text-sm text-gray-600">Other Alerts</p>
              </div>
              <Eye className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">{alerts.length}</p>
                <p className="text-sm text-gray-600">Total Active</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Active Alerts ({alerts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-300" />
              <p className="text-lg font-medium">All Clear!</p>
              <p className="text-sm">No active alerts. Your fields are secure.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Critical Alerts First */}
              {criticalAlerts.map((alert) => (
                <div key={alert.id} className={`border-l-4 rounded-lg p-4 ${getPriorityColor(alert.priority_level)} animate-pulse`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getAlertIcon(alert.alert_type)}
                        <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                        <Badge className={getPriorityBadgeColor(alert.priority_level)}>
                          {alert.priority_level.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-700 mb-3">{alert.message}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(alert.created_at).toLocaleString()}</span>
                        </div>
                        {alert.gps_location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>
                              {alert.gps_location.lat?.toFixed(4)}, {alert.gps_location.lng?.toFixed(4)}
                            </span>
                          </div>
                        )}
                        {alert.action_required && (
                          <div className="text-red-600 font-medium">
                            ⚠ {alert.action_required}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => acknowledgeAlert(alert.id)}
                      >
                        Acknowledge
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => resolveAlert(alert.id, 'Resolved by user')}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Resolve
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {/* High Priority Alerts */}
              {highAlerts.map((alert) => (
                <div key={alert.id} className={`border-l-4 rounded-lg p-4 ${getPriorityColor(alert.priority_level)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getAlertIcon(alert.alert_type)}
                        <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                        <Badge className={getPriorityBadgeColor(alert.priority_level)}>
                          {alert.priority_level.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-700 mb-3">{alert.message}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(alert.created_at).toLocaleString()}</span>
                        </div>
                        {alert.gps_location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>
                              {alert.gps_location.lat?.toFixed(4)}, {alert.gps_location.lng?.toFixed(4)}
                            </span>
                          </div>
                        )}
                        {alert.action_required && (
                          <div className="text-orange-600 font-medium">
                            ⚠ {alert.action_required}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => acknowledgeAlert(alert.id)}
                      >
                        Acknowledge
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => resolveAlert(alert.id, 'Resolved by user')}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Resolve
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Other Alerts */}
              {otherAlerts.map((alert) => (
                <div key={alert.id} className={`border-l-4 rounded-lg p-4 ${getPriorityColor(alert.priority_level)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getAlertIcon(alert.alert_type)}
                        <h3 className="font-medium text-gray-900">{alert.title}</h3>
                        <Badge className={getPriorityBadgeColor(alert.priority_level)}>
                          {alert.priority_level.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 mb-2">{alert.message}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(alert.created_at).toLocaleString()}</span>
                        </div>
                        {alert.gps_location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>
                              {alert.gps_location.lat?.toFixed(4)}, {alert.gps_location.lng?.toFixed(4)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => resolveAlert(alert.id, 'Resolved by user')}
                      >
                        <X className="h-3 w-3 mr-1" />
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DroneAlertsPanel;
