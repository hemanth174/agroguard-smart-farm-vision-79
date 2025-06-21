
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Zap, Shield } from 'lucide-react';
import AIVideoDetection from '@/components/AIVideoDetection';

const DroneVideoDetection = () => {
  return (
    <div className="space-y-6">
      {/* Header with Telugu Support */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          🤖 AI Video Detection System
        </h2>
        <div className="flex justify-center gap-2 mb-4">
          <Badge className="bg-green-100 text-green-800">
            <Shield className="h-3 w-3 mr-1" />
            Telugu Alerts
          </Badge>
          <Badge className="bg-blue-100 text-blue-800">
            <Zap className="h-3 w-3 mr-1" />
            Real-time Processing
          </Badge>
          <Badge className="bg-purple-100 text-purple-800">
            <Eye className="h-3 w-3 mr-1" />
            YOLOv8 AI
          </Badge>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Advanced AI-powered video analysis for real-time detection of people, vehicles, animals, and suspicious activities. 
          Supports both live webcam feed and uploaded video files.
        </p>
      </div>

      {/* AI Detection Component */}
      <AIVideoDetection />

      {/* Features Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            AI Detection Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Real-time Detection</h3>
              <p className="text-sm text-gray-600">Live webcam analysis with instant object detection and alerts</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">YOLOv8 AI Model</h3>
              <p className="text-sm text-gray-600">State-of-the-art object detection with high accuracy</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Multi-language Alerts</h3>
              <p className="text-sm text-gray-600">Alerts in Telugu, Hindi, and English for better accessibility</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer Notice */}
      <div className="text-center py-4">
        <p className="text-sm text-gray-500">
          Built for Smart Villages | Powered by AI & Innovation 🇮🇳
        </p>
      </div>
    </div>
  );
};

export default DroneVideoDetection;
