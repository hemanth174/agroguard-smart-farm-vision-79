
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Camera, 
  Video, 
  Upload, 
  Play, 
  Pause, 
  Square,
  AlertTriangle,
  Eye,
  Users,
  Car,
  Bike
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

interface Detection {
  id: string;
  type: 'person' | 'vehicle' | 'animal' | 'suspicious';
  confidence: number;
  bbox: { x: number; y: number; width: number; height: number };
  timestamp: Date;
}

const AIVideoDetection = () => {
  const { addAlert } = useApp();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [videoSource, setVideoSource] = useState<'webcam' | 'upload' | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Mock YOLO detection simulation
  const mockDetections = [
    { type: 'person', confidence: 0.95, label: 'Person' },
    { type: 'vehicle', confidence: 0.87, label: 'Vehicle' },
    { type: 'animal', confidence: 0.78, label: 'Animal' },
    { type: 'suspicious', confidence: 0.65, label: 'Suspicious Activity' }
  ];

  // Start webcam
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setVideoSource('webcam');
        setIsRecording(true);
      }
    } catch (error) {
      console.error('Error accessing webcam:', error);
      addAlert({
        type: 'error',
        title: 'Webcam Access Failed',
        message: 'Unable to access webcam. Please check permissions.',
        resolved: false
      });
    }
  };

  // Stop webcam
  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsRecording(false);
    setVideoSource(null);
    setDetections([]);
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setUploadedFile(file);
      setVideoSource('upload');
      
      if (videoRef.current) {
        const url = URL.createObjectURL(file);
        videoRef.current.src = url;
        videoRef.current.load();
      }
      
      // Start processing simulation
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        simulateDetection();
      }, 3000);
    }
  };

  // Simulate AI detection
  const simulateDetection = () => {
    const randomDetection = mockDetections[Math.floor(Math.random() * mockDetections.length)];
    
    const newDetection: Detection = {
      id: Date.now().toString(),
      type: randomDetection.type as any,
      confidence: randomDetection.confidence,
      bbox: {
        x: Math.random() * 400,
        y: Math.random() * 300,
        width: 80 + Math.random() * 100,
        height: 80 + Math.random() * 100
      },
      timestamp: new Date()
    };

    setDetections(prev => [newDetection, ...prev.slice(0, 4)]);
    
    // Add alert for suspicious activity
    if (randomDetection.type === 'suspicious' || randomDetection.confidence > 0.9) {
      addAlert({
        type: 'warning',
        title: 'AI Detection Alert',
        message: `🛫 Detected: ${randomDetection.label} (${(randomDetection.confidence * 100).toFixed(1)}% confidence)`,
        resolved: false
      });
    }
  };

  // Real-time detection simulation for webcam
  useEffect(() => {
    if (isRecording && videoSource === 'webcam') {
      const interval = setInterval(() => {
        if (Math.random() < 0.3) { // 30% chance of detection every 2 seconds
          simulateDetection();
        }
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isRecording, videoSource]);

  // Draw bounding boxes on canvas
  useEffect(() => {
    if (canvasRef.current && videoRef.current && detections.length > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const video = videoRef.current;
      
      if (ctx && video.videoWidth > 0) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        detections.forEach((detection, index) => {
          if (index < 3) { // Show only recent detections
            const { bbox } = detection;
            const colors = {
              person: '#22c55e',
              vehicle: '#3b82f6',
              animal: '#f59e0b',
              suspicious: '#ef4444'
            };
            
            ctx.strokeStyle = colors[detection.type];
            ctx.lineWidth = 3;
            ctx.strokeRect(bbox.x, bbox.y, bbox.width, bbox.height);
            
            // Label
            ctx.fillStyle = colors[detection.type];
            ctx.fillRect(bbox.x, bbox.y - 25, 150, 25);
            ctx.fillStyle = 'white';
            ctx.font = '14px Arial';
            ctx.fillText(
              `${detection.type} ${(detection.confidence * 100).toFixed(1)}%`,
              bbox.x + 5,
              bbox.y - 8
            );
          }
        });
      }
    }
  }, [detections]);

  const getDetectionIcon = (type: string) => {
    switch (type) {
      case 'person': return <Users className="h-4 w-4 text-green-500" />;
      case 'vehicle': return <Car className="h-4 w-4 text-blue-500" />;
      case 'animal': return <Bike className="h-4 w-4 text-yellow-500" />;
      case 'suspicious': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Eye className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-600" />
            AI Video Detection System (YOLOv8)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Video Display */}
          <div className="relative mb-4">
            <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                muted
                playsInline
              />
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
              />
              
              {!videoSource && (
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  <div className="text-center">
                    <Camera className="w-16 h-16 mx-auto mb-2 opacity-50" />
                    <p className="text-sm opacity-75">AI Video Detection Ready</p>
                  </div>
                </div>
              )}
              
              {isProcessing && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
                    <p>🧠 AI Processing Video...</p>
                  </div>
                </div>
              )}
              
              {isRecording && (
                <div className="absolute top-4 left-4">
                  <Badge variant="destructive" className="animate-pulse">
                    ● LIVE AI DETECTION
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-2 justify-center mb-4">
            {!isRecording ? (
              <>
                <Button onClick={startWebcam} className="flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  Start Webcam
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Upload Video
                </Button>
              </>
            ) : (
              <Button onClick={stopWebcam} variant="destructive" className="flex items-center gap-2">
                <Square className="w-4 h-4" />
                Stop Detection
              </Button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* Detection Status */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <Users className="w-6 h-6 mx-auto mb-1 text-green-600" />
              <p className="text-sm font-medium">People</p>
              <p className="text-xs text-gray-600">{detections.filter(d => d.type === 'person').length}</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <Car className="w-6 h-6 mx-auto mb-1 text-blue-600" />
              <p className="text-sm font-medium">Vehicles</p>
              <p className="text-xs text-gray-600">{detections.filter(d => d.type === 'vehicle').length}</p>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <Bike className="w-6 h-6 mx-auto mb-1 text-yellow-600" />
              <p className="text-sm font-medium">Animals</p>
              <p className="text-xs text-gray-600">{detections.filter(d => d.type === 'animal').length}</p>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="w-6 h-6 mx-auto mb-1 text-red-600" />
              <p className="text-sm font-medium">Alerts</p>
              <p className="text-xs text-gray-600">{detections.filter(d => d.type === 'suspicious').length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detection Results */}
      {detections.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Detections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {detections.slice(0, 5).map((detection) => (
                <Alert key={detection.id} className="border-l-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getDetectionIcon(detection.type)}
                      <div>
                        <p className="font-medium capitalize">
                          🛫 Detected: {detection.type.replace('_', ' ')}
                        </p>
                        <p className="text-xs text-gray-500">
                          {detection.timestamp.toLocaleTimeString()} • Confidence: {(detection.confidence * 100).toFixed(1)}%
                        </p>
                        {detection.type === 'suspicious' && (
                          <p className="text-xs text-red-600 font-medium">🛑 Alert: Suspicious Activity Detected</p>
                        )}
                      </div>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIVideoDetection;
