
import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Video, AlertTriangle, CheckCircle, Eye, Play, Pause, Download, Languages } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation, Language } from '@/utils/i18n';

interface Detection {
  id: string;
  class: string;
  confidence: number;
  alert: string;
  alertTelugu: string;
  frame: number;
  timestamp: number;
  bbox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface VideoDetectionResult {
  videoId: string;
  filename: string;
  duration: number;
  totalFrames: number;
  detections: Detection[];
  processingStatus: 'uploading' | 'processing' | 'completed' | 'failed';
  uploadProgress: number;
}

const DroneVideoDetection = () => {
  const { language, addAlert } = useApp();
  const { t } = useTranslation(language as Language);
  const [isDragging, setIsDragging] = useState(false);
  const [videoResults, setVideoResults] = useState<VideoDetectionResult[]>([]);
  const [currentVideo, setCurrentVideo] = useState<VideoDetectionResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [alertLanguage, setAlertLanguage] = useState<'en' | 'te'>('en'); // Default to English
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);

  // English and Telugu alerts mapping
  const alertMappings = {
    'person': {
      en: 'Person detected! 👤',
      te: 'వ్యక్తి కనబడింది! 👤'
    },
    'car': {
      en: 'Car detected! 🚗',
      te: 'కారు కనబడింది! 🚗'
    },
    'truck': {
      en: 'Truck detected! 🚛',
      te: 'ట్రక్ కనబడింది! 🚛'
    },
    'fire': {
      en: 'Fire detected! 🔥 Immediate action required!',
      te: 'అగ్ని ప్రమాదం! 🔥 తక్షణ చర్య అవసరం!'
    },
    'smoke': {
      en: 'Smoke detected! 💨 Caution!',
      te: 'పొగ కనబడింది! 💨 జాగ్రత్త!'
    },
    'animal': {
      en: 'Animal detected! 🐄',
      te: 'జంతువు కనబడింది! 🐄'
    },
    'bird': {
      en: 'Bird detected! 🐦',
      te: 'పక్షి కనబడింది! 🐦'
    },
    'bicycle': {
      en: 'Bicycle detected! 🚲',
      te: 'సైకిల్ కనబడింది! 🚲'
    },
    'motorcycle': {
      en: 'Motorcycle detected! 🏍️',
      te: 'మోటార్‌సైకిల్ కనబడింది! 🏍️'
    },
    'default': {
      en: 'Object detected!',
      te: 'వస్తువు కనబడింది!'
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const videoFile = files.find(file => file.type.startsWith('video/'));
    
    if (videoFile) {
      processVideoFile(videoFile);
    } else {
      addAlert({
        type: 'error',
        title: 'Invalid File',
        message: 'Please drop a video file (MP4, AVI, MOV, WebM)',
        resolved: false
      });
    }
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      processVideoFile(file);
    }
  };

  const processVideoFile = async (file: File) => {
    // Validate file size (max 500MB)
    if (file.size > 500 * 1024 * 1024) {
      addAlert({
        type: 'error',
        title: 'File Too Large',
        message: 'Please upload a video smaller than 500MB',
        resolved: false
      });
      return;
    }

    const videoId = `video_${Date.now()}`;
    const newVideoResult: VideoDetectionResult = {
      videoId,
      filename: file.name,
      duration: 0,
      totalFrames: 0,
      detections: [],
      processingStatus: 'uploading',
      uploadProgress: 0
    };

    setVideoResults(prev => [newVideoResult, ...prev]);
    setCurrentVideo(newVideoResult);
    setIsProcessing(true);

    try {
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setVideoResults(prev => 
          prev.map(result => 
            result.videoId === videoId 
              ? { ...result, uploadProgress: progress }
              : result
          )
        );
      }

      // Change status to processing
      setVideoResults(prev => 
        prev.map(result => 
          result.videoId === videoId 
            ? { ...result, processingStatus: 'processing' }
            : result
        )
      );

      // Simulate AI detection processing
      const detections = await simulateYOLODetection(file);
      
      // Update with results
      setVideoResults(prev => 
        prev.map(result => 
          result.videoId === videoId 
            ? { 
                ...result, 
                detections,
                processingStatus: 'completed',
                duration: 120, // Simulated duration
                totalFrames: 3600 // Simulated frame count
              }
            : result
        )
      );

      // Show alerts for critical detections
      const criticalDetections = detections.filter(d => 
        d.class === 'fire' || d.class === 'smoke' || d.confidence > 0.9
      );

      if (criticalDetections.length > 0) {
        addAlert({
          type: 'error',
          title: 'Critical Detection Alert!',
          message: `${criticalDetections.length} critical issue(s) detected in video: ${file.name}`,
          resolved: false
        });
      }

    } catch (error) {
      console.error('Video processing failed:', error);
      setVideoResults(prev => 
        prev.map(result => 
          result.videoId === videoId 
            ? { ...result, processingStatus: 'failed' }
            : result
        )
      );
      
      addAlert({
        type: 'error',
        title: 'Processing Failed',
        message: 'Failed to process video. Please try again.',
        resolved: false
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Simulate YOLO detection (replace with actual API call)
  const simulateYOLODetection = async (file: File): Promise<Detection[]> => {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Generate mock detections
    const mockDetections: Detection[] = [];
    const classes = ['person', 'car', 'animal', 'fire', 'smoke', 'bird'];
    
    for (let i = 0; i < Math.floor(Math.random() * 10) + 1; i++) {
      const className = classes[Math.floor(Math.random() * classes.length)];
      const frame = Math.floor(Math.random() * 3600);
      const alertData = alertMappings[className] || alertMappings.default;
      
      mockDetections.push({
        id: `det_${Date.now()}_${i}`,
        class: className,
        confidence: 0.5 + Math.random() * 0.5,
        alert: alertData.en,
        alertTelugu: alertData.te,
        frame,
        timestamp: frame / 30, // Assuming 30 FPS
        bbox: {
          x: Math.random() * 640,
          y: Math.random() * 480,
          width: 50 + Math.random() * 100,
          height: 50 + Math.random() * 100
        }
      });
    }

    return mockDetections.sort((a, b) => a.frame - b.frame);
  };

  const getSeverityColor = (detection: Detection) => {
    if (detection.class === 'fire' || detection.class === 'smoke') {
      return 'border-red-500 bg-red-50';
    }
    if (detection.confidence > 0.8) {
      return 'border-orange-500 bg-orange-50';
    }
    return 'border-green-500 bg-green-50';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'uploading':
        return <Badge className="bg-blue-100 text-blue-800">Uploading...</Badge>;
      case 'processing':
        return <Badge className="bg-yellow-100 text-yellow-800">Processing...</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-blue-600" />
              🌾 Village Sentinel – AI Video Detection
            </CardTitle>
            <div className="flex items-center gap-2">
              <Languages className="h-4 w-4 text-gray-600" />
              <Select value={alertLanguage} onValueChange={(value: 'en' | 'te') => setAlertLanguage(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="te">తెలుగు</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Drag and Drop Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
              isDragging 
                ? 'border-green-400 bg-green-50' 
                : 'border-gray-300 hover:border-green-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-green-100 rounded-full">
                <Upload className="h-12 w-12 text-green-600" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-900">
                  📹 {alertLanguage === 'te' ? 'వీడియో డ్రాగ్ & డ్రాప్ చేయండి' : 'Drag & Drop Video'}
                </h3>
                <p className="text-gray-600">
                  {alertLanguage === 'te' ? 'లేదా క్లిక్ చేసి ఫైల్ ఎంచుకోండి' : 'Or click to select file'}
                </p>
                <p className="text-sm text-gray-500">
                  Supported: MP4, AVI, MOV, WebM (Max 500MB)
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isProcessing}
              />
              
              <Button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="bg-green-600 hover:bg-green-700"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    {alertLanguage === 'te' ? 'ఫైల్ ఎంచుకోండి' : 'Select File'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Video Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-green-600" />
            {alertLanguage === 'te' ? 'AI డిటెక్షన్ రిజల్ట్స్' : 'AI Detection Results'} ({videoResults.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {videoResults.map((result) => (
              <div key={result.videoId} className="border rounded-lg p-6 bg-gray-50">
                {/* Video Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Video className="h-6 w-6 text-gray-600" />
                    <div>
                      <h4 className="font-semibold text-gray-900">{result.filename}</h4>
                      <p className="text-sm text-gray-500">
                        Duration: {Math.floor(result.duration / 60)}:{(result.duration % 60).toString().padStart(2, '0')} | 
                        Frames: {result.totalFrames.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(result.processingStatus)}
                    {result.detections.length > 0 && (
                      <Badge variant="outline">
                        {result.detections.length} detections
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Upload Progress */}
                {result.processingStatus === 'uploading' && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Uploading...</span>
                      <span>{result.uploadProgress}%</span>
                    </div>
                    <Progress value={result.uploadProgress} className="h-2" />
                  </div>
                )}

                {/* Processing Status */}
                {result.processingStatus === 'processing' && (
                  <Alert className="mb-4 border-blue-200 bg-blue-50">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-blue-800">
                      🤖 {alertLanguage === 'te' ? 'AI విశ్లేషణ ప్రోగ్రెస్‌లో ఉంది... దయచేసి వేచి ఉండండి.' : 'AI analysis in progress... Please wait.'}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Detections */}
                {result.detections.length > 0 && (
                  <div className="space-y-3">
                    <h5 className="font-medium text-gray-900 flex items-center gap-2">
                      🚨 Detection Alerts ({result.detections.length})
                    </h5>
                    
                    <div className="grid gap-3 max-h-64 overflow-y-auto">
                      {result.detections.map((detection) => (
                        <div 
                          key={detection.id}
                          className={`p-4 rounded-lg border-l-4 ${getSeverityColor(detection)}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm">
                              Frame {detection.frame} ({Math.floor(detection.timestamp / 60)}:{(detection.timestamp % 60).toFixed(0).padStart(2, '0')})
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {(detection.confidence * 100).toFixed(1)}% confidence
                            </Badge>
                          </div>
                          <p className="text-sm font-medium text-gray-900">
                            🎯 Class: {detection.class}
                          </p>
                          <p className="text-sm text-gray-700 mt-1">
                            {alertLanguage === 'te' ? detection.alertTelugu : detection.alert}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Detections */}
                {result.processingStatus === 'completed' && result.detections.length === 0 && (
                  <div className="flex items-center gap-2 text-green-600 p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5" />
                    <span>
                      ✅ {alertLanguage === 'te' ? 'ఎలాంటి సమస్యలు కనుగొనబడలేదు - అన్నీ సురక్షితం!' : 'No issues detected - All clear!'}
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Button variant="outline" size="sm">
                    <Play className="h-4 w-4 mr-2" />
                    {alertLanguage === 'te' ? 'వీడియో చూడండి' : 'View Video'}
                  </Button>
                  {result.detections.length > 0 && (
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Download className="h-4 w-4 mr-2" />
                      {alertLanguage === 'te' ? 'రిపోర్ట్ డౌన్‌లోడ్' : 'Download Report'}
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {/* Empty State */}
            {videoResults.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Video className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">
                  {alertLanguage === 'te' ? 'ఇంకా వీడియోలు అప్‌లోడ్ చేయలేదు' : 'No videos uploaded yet'}
                </h3>
                <p className="text-sm">
                  {alertLanguage === 'te' ? 'AI విశ్లేషణతో మీ మొదటి డ్రోన్ వీడియోను అప్‌లోడ్ చేయండి' : 'Upload your first drone video with AI analysis'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DroneVideoDetection;
