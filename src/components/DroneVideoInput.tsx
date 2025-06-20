
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  Video, 
  Upload, 
  Play, 
  Pause, 
  Square,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const DroneVideoInput = () => {
  const { addAlert } = useApp();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startRecording = () => {
    setIsRecording(true);
    // Simulate recording
    setTimeout(() => {
      setIsRecording(false);
      setIsProcessing(true);
      // Simulate AI processing
      setTimeout(() => {
        setIsProcessing(false);
        addAlert({
          type: 'info',
          title: 'Video Analysis Complete',
          message: 'Drone video analyzed. No threats detected.',
          resolved: false
        });
      }, 3000);
    }, 5000);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setIsProcessing(true);
      
      // Simulate processing
      setTimeout(() => {
        setIsProcessing(false);
        addAlert({
          type: 'warning',
          title: 'Potential Issue Detected',
          message: 'AI detected possible crop damage in uploaded video.',
          resolved: false
        });
      }, 2000);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Drone Video Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Live Feed Simulation */}
        <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center relative">
          <video 
            ref={videoRef}
            className="w-full h-full rounded-lg object-cover"
            style={{ display: uploadedFile ? 'block' : 'none' }}
          />
          
          {!uploadedFile && (
            <div className="text-center text-white">
              <Camera className="w-16 h-16 mx-auto mb-2 opacity-50" />
              <p className="text-sm opacity-75">
                {isRecording ? 'Recording Live Feed...' : 'Drone Camera Ready'}
              </p>
            </div>
          )}
          
          {isRecording && (
            <div className="absolute top-4 left-4">
              <Badge variant="destructive" className="animate-pulse">
                ● REC
              </Badge>
            </div>
          )}
          
          {isProcessing && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
                <p>AI Processing Video...</p>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex gap-2 justify-center">
          {!isRecording ? (
            <Button onClick={startRecording} className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Start Recording
            </Button>
          ) : (
            <Button onClick={stopRecording} variant="destructive" className="flex items-center gap-2">
              <Square className="w-4 h-4" />
              Stop Recording
            </Button>
          )}
          
          <Button 
            variant="outline" 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload Video
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">AI Analysis Status:</span>
            <Badge variant={isProcessing ? "default" : "secondary"}>
              {isProcessing ? "Processing" : "Ready"}
            </Badge>
          </div>
          
          {uploadedFile && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Video uploaded: {uploadedFile.name}
            </div>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-orange-500" />
            Threat Detection
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-green-500" />
            Crop Health Analysis
          </div>
          <div className="flex items-center gap-1">
            <Camera className="w-3 h-3 text-blue-500" />
            Real-time Processing
          </div>
          <div className="flex items-center gap-1">
            <Video className="w-3 h-3 text-purple-500" />
            HD Video Support
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DroneVideoInput;
