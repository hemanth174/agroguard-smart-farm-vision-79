
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Camera, 
  Video, 
  AlertTriangle, 
  MapPin, 
  Upload,
  BarChart3,
  Settings,
  Zap
} from 'lucide-react';
import DroneVideoUpload from './DroneVideoUpload';
import DroneAlertsPanel from './DroneAlertsPanel';
import DroneMonitor from './DroneMonitor';
import { useDronePatrol } from '@/hooks/useDronePatrol';

const DroneDashboard = () => {
  const { videos, detections, alerts, loading } = useDronePatrol();
  const [activeTab, setActiveTab] = useState('overview');

  const criticalAlerts = alerts.filter(a => a.priority_level === 'critical').length;
  const highPriorityAlerts = alerts.filter(a => a.priority_level === 'high').length;
  const totalDetections = detections.length;
  const recentVideos = videos.filter(v => {
    const uploadTime = new Date(v.upload_timestamp);
    const now = new Date();
    const daysDiff = (now.getTime() - uploadTime.getTime()) / (1000 * 3600 * 24);
    return daysDiff <= 7; // Videos from last 7 days
  }).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🛰️ Drone Patrol Command Center</h1>
          <p className="text-gray-600">AI-powered field surveillance and threat detection</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-green-600 hover:bg-green-700">
            <Upload className="h-4 w-4 mr-2" />
            Quick Upload
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Critical Alert Banner */}
      {criticalAlerts > 0 && (
        <Card className="border-red-500 bg-red-50 animate-pulse">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-800">🚨 CRITICAL ALERTS DETECTED</h3>
                <p className="text-red-700">
                  {criticalAlerts} critical issue(s) require immediate attention. 
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-red-800 underline ml-1"
                    onClick={() => setActiveTab('alerts')}
                  >
                    View Details →
                  </Button>
                </p>
              </div>
              <Badge className="bg-red-100 text-red-800 text-lg px-3 py-1">
                {criticalAlerts}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                <p className="text-3xl font-bold text-orange-600">{alerts.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
            {criticalAlerts > 0 && (
              <p className="text-xs text-red-600 mt-2">
                {criticalAlerts} critical, {highPriorityAlerts} high priority
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Videos This Week</p>
                <p className="text-3xl font-bold text-blue-600">{recentVideos}</p>
              </div>
              <Video className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {videos.length} total videos uploaded
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">AI Detections</p>
                <p className="text-3xl font-bold text-purple-600">{totalDetections}</p>
              </div>
              <Zap className="h-8 w-8 text-purple-500" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Across all uploaded videos
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Field Coverage</p>
                <p className="text-3xl font-bold text-green-600">95%</p>
              </div>
              <MapPin className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              GPS-tracked patrol areas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload & Analysis
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Alerts ({alerts.length})
          </TabsTrigger>
          <TabsTrigger value="monitor" className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Live Monitor
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {videos.slice(0, 3).map((video) => {
                    const videoDetections = detections.filter(d => d.video_id === video.id);
                    return (
                      <div key={video.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Video className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium">{video.filename}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(video.upload_timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {videoDetections.length} detections
                          </Badge>
                          <Badge className={video.processing_status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                            {video.processing_status}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Threat Detection Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Threat Detection Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['fire_detection', 'pest_infestation', 'animal_intrusion', 'pipeline_damage'].map((type) => {
                    const count = detections.filter(d => d.detection_type === type).length;
                    return (
                      <div key={type} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{type.replace('_', ' ')}</span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  className="bg-green-600 hover:bg-green-700 h-16"
                  onClick={() => setActiveTab('upload')}
                >
                  <Upload className="h-5 w-5 mr-2" />
                  Upload New Video
                </Button>
                <Button 
                  variant="outline" 
                  className="h-16"
                  onClick={() => setActiveTab('alerts')}
                >
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Review Alerts
                </Button>
                <Button 
                  variant="outline" 
                  className="h-16"
                  onClick={() => setActiveTab('monitor')}
                >
                  <Camera className="h-5 w-5 mr-2" />
                  Live Monitor
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload">
          <DroneVideoUpload />
        </TabsContent>

        <TabsContent value="alerts">
          <DroneAlertsPanel />
        </TabsContent>

        <TabsContent value="monitor">
          <DroneMonitor />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DroneDashboard;
