
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Video, Play, AlertTriangle, CheckCircle, Eye } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation, Language } from '@/utils/i18n';

interface VideoUpload {
  id: string;
  name: string;
  size: string;
  uploadTime: Date;
  status: 'processing' | 'analyzed' | 'error';
  analysis?: {
    issues: string[];
    coverage: number;
    quality: 'good' | 'fair' | 'poor';
  };
}

const DroneVideoUpload = () => {
  const { language, addAlert } = useApp();
  const { t } = useTranslation(language as Language);
  const [uploadedVideos, setUploadedVideos] = useState<VideoUpload[]>([
    {
      id: '1',
      name: 'field_survey_morning.mp4',
      size: '45.2 MB',
      uploadTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'analyzed',
      analysis: {
        issues: ['Pest detection in sector B', 'Low moisture in sector A'],
        coverage: 95,
        quality: 'good'
      }
    }
  ]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/')) {
      addAlert({
        type: 'error',
        title: 'Invalid File Type',
        message: 'Please upload a video file (MP4, AVI, MOV)',
        resolved: false
      });
      return;
    }

    // Validate file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      addAlert({
        type: 'error',
        title: 'File Too Large',
        message: 'Please upload a video smaller than 100MB',
        resolved: false
      });
      return;
    }

    setIsUploading(true);

    // Simulate upload and analysis process
    const newVideo: VideoUpload = {
      id: Date.now().toString(),
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      uploadTime: new Date(),
      status: 'processing'
    };

    setUploadedVideos(prev => [newVideo, ...prev]);

    // Simulate processing time
    setTimeout(() => {
      setUploadedVideos(prev => prev.map(video => 
        video.id === newVideo.id 
          ? {
              ...video,
              status: 'analyzed' as const,
              analysis: {
                issues: generateRandomIssues(),
                coverage: Math.floor(Math.random() * 20) + 80,
                quality: ['good', 'fair', 'poor'][Math.floor(Math.random() * 3)] as 'good' | 'fair' | 'poor'
              }
            }
          : video
      ));
      setIsUploading(false);
      
      addAlert({
        type: 'info',
        title: 'Video Analysis Complete',
        message: `Analysis completed for ${file.name}`,
        resolved: false
      });
    }, 3000);

    // Reset input
    event.target.value = '';
  };

  const generateRandomIssues = (): string[] => {
    const possibleIssues = [
      'Pest detection in sector A',
      'Pest detection in sector B', 
      'Low moisture detected',
      'Weed growth identified',
      'Irrigation blockage spotted',
      'Crop damage in north field',
      'Animal intrusion detected',
      'Equipment malfunction visible'
    ];
    
    const numIssues = Math.floor(Math.random() * 3);
    const selectedIssues = [];
    
    for (let i = 0; i < numIssues; i++) {
      const randomIssue = possibleIssues[Math.floor(Math.random() * possibleIssues.length)];
      if (!selectedIssues.includes(randomIssue)) {
        selectedIssues.push(randomIssue);
      }
    }
    
    return selectedIssues;
  };

  const getStatusColor = (status: VideoUpload['status']) => {
    switch (status) {
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'analyzed': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'good': return 'text-green-600';
      case 'fair': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5 text-blue-600" />
            {t('droneVideoUpload')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-900">{t('uploadDroneVideo')}</p>
              <p className="text-sm text-gray-500">{t('supportedFormats')}: MP4, AVI, MOV (Max 100MB)</p>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileUpload}
                className="hidden"
                id="video-upload"
                disabled={isUploading}
              />
              <label htmlFor="video-upload">
                <Button 
                  className="bg-green-600 hover:bg-green-700" 
                  disabled={isUploading}
                  asChild
                >
                  <span className="cursor-pointer">
                    {isUploading ? t('uploading') : t('selectVideo')}
                  </span>
                </Button>
              </label>
            </div>
          </div>

          {isUploading && (
            <Alert className="mt-4 border-blue-200 bg-blue-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-blue-800">
                {t('processingVideo')} - AI analysis in progress...
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Uploaded Videos List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-green-600" />
            {t('uploadedVideos')} ({uploadedVideos.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {uploadedVideos.map((video) => (
              <div key={video.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Play className="h-5 w-5 text-gray-600" />
                      <span className="font-medium text-gray-900">{video.name}</span>
                      <Badge className={getStatusColor(video.status)}>
                        {video.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                      <div>
                        <span className="font-medium">{t('size')}:</span> {video.size}
                      </div>
                      <div>
                        <span className="font-medium">{t('uploaded')}:</span> {video.uploadTime.toLocaleTimeString()}
                      </div>
                      {video.analysis && (
                        <>
                          <div>
                            <span className="font-medium">{t('coverage')}:</span> {video.analysis.coverage}%
                          </div>
                          <div>
                            <span className="font-medium">{t('quality')}:</span> 
                            <span className={`ml-1 ${getQualityColor(video.analysis.quality)}`}>
                              {video.analysis.quality}
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    {video.analysis?.issues && video.analysis.issues.length > 0 && (
                      <div>
                        <p className="font-medium text-sm text-gray-700 mb-2">{t('detectedIssues')}:</p>
                        <div className="flex flex-wrap gap-2">
                          {video.analysis.issues.map((issue, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              {issue}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {video.status === 'analyzed' && (!video.analysis?.issues || video.analysis.issues.length === 0) && (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">{t('noIssuesDetected')}</span>
                      </div>
                    )}
                  </div>
                  
                  <Button variant="outline" size="sm" className="ml-4">
                    {t('viewDetails')}
                  </Button>
                </div>
              </div>
            ))}
            
            {uploadedVideos.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Video className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>{t('noVideosUploaded')}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DroneVideoUpload;
