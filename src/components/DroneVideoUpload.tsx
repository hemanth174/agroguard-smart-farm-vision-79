
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Video, Play, AlertTriangle, CheckCircle, Eye, MapPin, Clock, Zap } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation, Language } from '@/utils/i18n';
import { useDronePatrol } from '@/hooks/useDronePatrol';

const DroneVideoUpload = () => {
  const { language, addAlert } = useApp();
  const { t } = useTranslation(language as Language);
  const { videos, detections, alerts, loading, uploadVideo } = useDronePatrol();
  const [isUploading, setIsUploading] = useState(false);
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get current location for GPS tagging
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGpsLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          addAlert({
            type: 'info',
            title: 'Location Captured',
            message: 'GPS coordinates added to video metadata',
            resolved: false
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          addAlert({
            type: 'warning',
            title: 'Location Error',
            message: 'Could not get GPS location. Video will be uploaded without coordinates.',
            resolved: false
          });
        }
      );
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/')) {
      addAlert({
        type: 'error',
        title: 'Invalid File Type',
        message: 'Please upload a video file (MP4, AVI, MOV, WebM)',
        resolved: false
      });
      return;
    }

    // Validate file size (max 500MB for drone videos)
    if (file.size > 500 * 1024 * 1024) {
      addAlert({
        type: 'error',
        title: 'File Too Large',
        message: 'Please upload a video smaller than 500MB',
        resolved: false
      });
      return;
    }

    setIsUploading(true);

    try {
      const metadata = {
        gps_latitude: gpsLocation?.lat,
        gps_longitude: gpsLocation?.lng,
        field_sector: 'Auto-detected',
        weather_conditions: {
          temperature: Math.round(Math.random() * 10 + 20),
          humidity: Math.round(Math.random() * 40 + 40),
          wind_speed: Math.round(Math.random() * 15 + 5)
        }
      };

      await uploadVideo(file, metadata);
      
      // Reset GPS location after upload
      setGpsLocation(null);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-green-500 bg-green-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  // Get detections for each video
  const getVideoDetections = (videoId: string) => {
    return detections.filter(d => d.video_id === videoId);
  };

  return (
    <div className="space-y-6">
      {/* Alert Banner for Critical Issues */}
      {alerts.filter(a => a.priority_level === 'critical').length > 0 && (
        <Alert className="border-red-500 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-800">
            <strong>CRITICAL ALERT:</strong> {alerts.filter(a => a.priority_level === 'critical').length} critical issue(s) detected. Immediate action required!
          </AlertDescription>
        </Alert>
      )}

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5 text-blue-600" />
            {t('droneVideoUpload')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* GPS Location Section */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                GPS Location
              </span>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={getCurrentLocation}
                disabled={isUploading}
              >
                Get Location
              </Button>
            </div>
            {gpsLocation ? (
              <p className="text-xs text-green-600">
                ✓ Location captured: {gpsLocation.lat.toFixed(6)}, {gpsLocation.lng.toFixed(6)}
              </p>
            ) : (
              <p className="text-xs text-gray-500">
                No GPS location captured. Videos will be uploaded without coordinates.
              </p>
            )}
          </div>

          {/* Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-900">{t('uploadDroneVideo')}</p>
              <p className="text-sm text-gray-500">
                Supported: MP4, AVI, MOV, WebM (Max 500MB) • AI Analysis Included
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileUpload}
                className="hidden"
                id="video-upload"
                disabled={isUploading || loading}
              />
              <label htmlFor="video-upload">
                <Button 
                  className="bg-green-600 hover:bg-green-700" 
                  disabled={isUploading || loading}
                  asChild
                >
                  <span className="cursor-pointer flex items-center gap-2">
                    {isUploading ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Uploading & Analyzing...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        {t('selectVideo')}
                      </>
                    )}
                  </span>
                </Button>
              </label>
            </div>
          </div>

          {isUploading && (
            <Alert className="mt-4 border-blue-200 bg-blue-50">
              <Zap className="h-4 w-4" />
              <AlertDescription className="text-blue-800">
                Video uploading... AI analysis will start automatically after upload completes.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Video Analysis Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-green-600" />
            Video Analysis Results ({videos.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full mx-auto mb-3"></div>
              <p className="text-gray-500">Loading patrol data...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {videos.map((video) => {
                const videoDetections = getVideoDetections(video.id);
                const hasHighPriorityIssues = videoDetections.some(d => 
                  d.severity_level === 'critical' || d.severity_level === 'high'
                );

                return (
                  <div key={video.id} className={`border rounded-lg p-4 ${hasHighPriorityIssues ? 'border-red-200 bg-red-50' : 'bg-gray-50'}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Play className="h-5 w-5 text-gray-600" />
                          <span className="font-medium text-gray-900">{video.filename}</span>
                          <Badge className={getStatusColor(video.processing_status)}>
                            {video.processing_status}
                          </Badge>
                          {hasHighPriorityIssues && (
                            <Badge className="bg-red-100 text-red-800">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              High Priority
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                          <div>
                            <span className="font-medium">Size:</span> {(video.file_size / (1024 * 1024)).toFixed(1)} MB
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span className="font-medium">Uploaded:</span> {new Date(video.upload_timestamp).toLocaleTimeString()}
                          </div>
                          {video.gps_latitude && video.gps_longitude && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span className="font-medium">GPS:</span> {video.gps_latitude.toFixed(4)}, {video.gps_longitude.toFixed(4)}
                            </div>
                          )}
                          <div>
                            <span className="font-medium">Detections:</span> {videoDetections.length}
                          </div>
                        </div>

                        {/* AI Detections */}
                        {videoDetections.length > 0 ? (
                          <div>
                            <p className="font-medium text-sm text-gray-700 mb-2">AI Detections:</p>
                            <div className="space-y-2">
                              {videoDetections.map((detection) => (
                                <div key={detection.id} className={`p-3 rounded border-l-4 ${getSeverityColor(detection.severity_level)}`}>
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium text-sm capitalize">
                                      {detection.detection_type.replace('_', ' ')}
                                    </span>
                                    <Badge variant="outline" className="text-xs">
                                      {(detection.confidence_score * 100).toFixed(1)}% confidence
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-gray-600">{detection.description}</p>
                                  {detection.requires_action && (
                                    <p className="text-xs text-red-600 font-medium mt-1">⚠ Action Required</p>
                                  )}
                                  {detection.timestamp_in_video && (
                                    <p className="text-xs text-gray-500 mt-1">
                                      Detected at: {Math.floor(detection.timestamp_in_video / 60)}:{(detection.timestamp_in_video % 60).toString().padStart(2, '0')}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : video.processing_status === 'completed' ? (
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-sm">No issues detected - All clear! ✓</span>
                          </div>
                        ) : video.processing_status === 'processing' ? (
                          <div className="flex items-center gap-2 text-blue-600">
                            <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                            <span className="text-sm">AI analysis in progress...</span>
                          </div>
                        ) : null}
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm">
                          View Video
                        </Button>
                        {videoDetections.length > 0 && (
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            View Report
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {videos.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Video className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No videos uploaded yet</p>
                  <p className="text-sm">Upload your first drone patrol video to get started with AI analysis</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DroneVideoUpload;
