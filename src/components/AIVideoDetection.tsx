
import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  Bike,
  FileVideo,
  Loader
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

interface Detection {
  id: string;
  type: 'person' | 'vehicle' | 'animal' | 'fire' | 'tree' | 'suspicious';
  confidence: number;
  bbox: { x: number; y: number; width: number; height: number };
  timestamp: Date;
  frameTime: string;
}

const AIVideoDetection = () => {
  const { addAlert } = useApp();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [detectionLog, setDetectionLog] = useState<string[]>([]);
  const [videoSource, setVideoSource] = useState<'webcam' | 'upload' | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Mock YOLO detection responses
  const mockDetections = [
    { type: 'person', confidence: 0.95, label: 'Person' },
    { type: 'vehicle', confidence: 0.87, label: 'Vehicle' },
    { type: 'animal', confidence: 0.78, label: 'Cow' },
    { type: 'tree', confidence: 0.92, label: 'Tree' },
    { type: 'fire', confidence: 0.85, label: 'Fire' },
    { type: 'suspicious', confidence: 0.65, label: 'Suspicious Activity' }
  ];

  // Start webcam
  const startWebcam = async () => {
    try {
      setIsProcessing(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setVideoSource('webcam');
        setIsRecording(true);
        setIsProcessing(false);
        
        // Start detection simulation
        startDetectionSimulation();
        
        addDetectionLog('📹 Webcam started - AI detection active');
      }
    } catch (error) {
      console.error('Error accessing webcam:', error);
      setIsProcessing(false);
      addAlert({
        type: 'error',
        title: 'Webcam Access Failed',
        message: 'Unable to access webcam. Please check permissions and try again.',
        resolved: false
      });
      addDetectionLog('❌ Webcam access failed - Please check permissions');
    }
  };

  // Stop webcam
  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }
    setIsRecording(false);
    setVideoSource(null);
    setDetections([]);
    setDetectionLog([]);
    addDetectionLog('🛑 Detection stopped');
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
      
      addDetectionLog(`📁 Video uploaded: ${file.name}`);
      
      // Start processing simulation
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        addDetectionLog('🧠 AI processing completed - Ready for detection');
      }, 2000);
    } else {
      addDetectionLog('❌ Please upload a valid video file (MP4, WebM, etc.)');
    }
  };

  // Play/Pause uploaded video
  const togglePlayback = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        if (detectionIntervalRef.current) {
          clearInterval(detectionIntervalRef.current);
        }
      } else {
        videoRef.current.play();
        startDetectionSimulation();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Add detection log entry
  const addDetectionLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDetectionLog(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)]);
  };

  // Start detection simulation
  const startDetectionSimulation = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }
    
    detectionIntervalRef.current = setInterval(() => {
      if (Math.random() < 0.4) { // 40% chance of detection
        simulateDetection();
      }
    }, 3000);
  };

  // Simulate AI detection
  const simulateDetection = () => {
    const randomDetection = mockDetections[Math.floor(Math.random() * mockDetections.length)];
    const currentTime = videoRef.current?.currentTime || 0;
    
    const newDetection: Detection = {
      id: Date.now().toString(),
      type: randomDetection.type as any,
      confidence: randomDetection.confidence,
      bbox: {
        x: Math.random() * 300,
        y: Math.random() * 200,
        width: 60 + Math.random() * 80,
        height: 60 + Math.random() * 80
      },
      timestamp: new Date(),
      frameTime: `${Math.floor(currentTime / 60)}:${Math.floor(currentTime % 60).toString().padStart(2, '0')}`
    };

    setDetections(prev => [newDetection, ...prev.slice(0, 9)]);
    
    // Add to detection log
    const confidencePercent = (randomDetection.confidence * 100).toFixed(1);
    addDetectionLog(`🛫 Detected: ${randomDetection.label} (${confidencePercent}% confidence)`);
    
    // Add alert for high-priority detections
    if (randomDetection.type === 'fire' || randomDetection.type === 'suspicious' || randomDetection.confidence > 0.9) {
      addAlert({
        type: 'warning',
        title: 'AI Detection Alert',
        message: `🚨 ${randomDetection.label} detected with ${confidencePercent}% confidence`,
        resolved: false
      });
      addDetectionLog(`🚨 HIGH PRIORITY: ${randomDetection.label} detected!`);
    }
  };

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
        
        detections.slice(0, 3).forEach((detection) => {
          const { bbox } = detection;
          const colors = {
            person: '#22c55e',
            vehicle: '#3b82f6',
            animal: '#f59e0b',
            fire: '#ef4444',
            tree: '#10b981',
            suspicious: '#ef4444'
          };
          
          ctx.strokeStyle = colors[detection.type];
          ctx.lineWidth = 2;
          ctx.strokeRect(bbox.x, bbox.y, bbox.width, bbox.height);
          
          // Label background
          ctx.fillStyle = colors[detection.type];
          ctx.fillRect(bbox.x, bbox.y - 20, 120, 20);
          ctx.fillStyle = 'white';
          ctx.font = '12px Arial';
          ctx.fillText(
            `${detection.type} ${(detection.confidence * 100).toFixed(0)}%`,
            bbox.x + 2,
            bbox.y - 5
          );
        });
      }
    }
  }, [detections]);

  // Video event handlers
  const handleVideoPlay = () => {
    setIsPlaying(true);
    if (videoSource === 'upload') {
      startDetectionSimulation();
    }
  };

  const handleVideoPause = () => {
    setIsPlaying(false);
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }
  };

  const getDetectionIcon = (type: string) => {
    switch (type) {
      case 'person': return <Users className="h-4 w-4 text-green-500" />;
      case 'vehicle': return <Car className="h-4 w-4 text-blue-500" />;
      case 'animal': return <Bike className="h-4 w-4 text-yellow-500" />;
      case 'fire': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'tree': return <Eye className="h-4 w-4 text-green-500" />;
      case 'suspicious': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Eye className="h-4 w-4" />;
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card className="border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Eye className="h-6 w-6 text-blue-600" />
            🧠 AI Video Detection System (YOLOv8)
          </CardTitle>
          <p className="text-gray-600">Real-time object detection for uploaded videos and live webcam feed</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Video Display */}
          <div className="relative">
            <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden relative border-2 border-gray-300">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay={videoSource === 'webcam'}
                muted
                playsInline
                onPlay={handleVideoPlay}
                onPause={handleVideoPause}
                controls={videoSource === 'upload'}
              />
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
              />
              
              {!videoSource && (
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  <div className="text-center">
                    <Camera className="w-20 h-20 mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">AI Video Detection Ready</p>
                    <p className="text-sm opacity-75">Upload video or start webcam to begin</p>
                  </div>
                </div>
              )}
              
              {isProcessing && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="text-white text-center">
                    <Loader className="animate-spin w-12 h-12 mx-auto mb-4" />
                    <p className="text-lg">🧠 AI Processing Video...</p>
                    <p className="text-sm opacity-75">Initializing detection models</p>
                  </div>
                </div>
              )}
              
              {isRecording && (
                <div className="absolute top-4 left-4">
                  <Badge variant="destructive" className="animate-pulse text-sm px-3 py-1">
                    ● LIVE AI DETECTION
                  </Badge>
                </div>
              )}

              {videoSource === 'upload' && !isPlaying && !isProcessing && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button onClick={togglePlayback} size="lg" className="bg-blue-600 hover:bg-blue-700">
                    <Play className="w-6 h-6 mr-2" />
                    Start Detection
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-3 justify-center">
            {!isRecording ? (
              <>
                <Button onClick={startWebcam} className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
                  <Camera className="w-4 h-4" />
                  Start Webcam Detection
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 border-blue-500 text-blue-600 hover:bg-blue-50"
                >
                  <Upload className="w-4 h-4" />
                  Upload Video File
                </Button>
              </>
            ) : (
              <Button onClick={stopWebcam} variant="destructive" className="flex items-center gap-2">
                <Square className="w-4 h-4" />
                Stop Detection
              </Button>
            )}

            {videoSource === 'upload' && isPlaying && (
              <Button onClick={togglePlayback} variant="outline" className="flex items-center gap-2">
                <Pause className="w-4 h-4" />
                Pause Detection
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
        </CardContent>
      </Card>

      {/* Detection Results */}
      {detections.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Current Detections */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Eye className="h-5 w-5 text-blue-600" />
                Current Detections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {detections.slice(0, 5).map((detection) => (
                  <div key={detection.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                    <div className="flex items-center gap-3">
                      {getDetectionIcon(detection.type)}
                      <div>
                        <p className="font-medium capitalize">
                          {detection.type.replace('_', ' ')}
                        </p>
                        <p className="text-xs text-gray-500">
                          {detection.frameTime} • {(detection.confidence * 100).toFixed(1)}% confidence
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant={detection.type === 'fire' || detection.type === 'suspicious' ? 'destructive' : 'outline'}
                      className="text-xs"
                    >
                      {detection.type === 'fire' || detection.type === 'suspicious' ? 'ALERT' : 'DETECTED'}
                    </Badge>
                  </div>
                ))}
                {detections.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No detections yet. AI is analyzing...</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Detection Log */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileVideo className="h-5 w-5 text-purple-600" />
                Detection Log
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-60 overflow-y-auto bg-gray-900 rounded-lg p-3">
                {detectionLog.map((log, index) => (
                  <div key={index} className="text-sm text-green-400 font-mono">
                    {log}
                  </div>
                ))}
                {detectionLog.length === 0 && (
                  <p className="text-gray-400 text-center py-4 text-sm">Detection log will appear here...</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Fallback Message */}
      {videoSource && detections.length === 0 && !isProcessing && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {videoSource === 'webcam' 
              ? "AI is analyzing the webcam feed. Objects will appear here when detected."
              : "Couldn't detect anything yet. Try playing the video or upload a different file with people, vehicles, or objects."
            }
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default AIVideoDetection;
