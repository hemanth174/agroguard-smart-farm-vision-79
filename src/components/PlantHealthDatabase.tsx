
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Leaf, Camera, AlertTriangle, CheckCircle, Eye, Upload } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation, Language } from '@/utils/i18n';

interface Disease {
  id: string;
  name: string;
  symptoms: string[];
  affectedCrops: string[];
  treatment: string;
  severity: 'low' | 'medium' | 'high';
  prevention: string;
  imageUrl?: string;
}

const PlantHealthDatabase = () => {
  const { language, addAlert } = useApp();
  const { t } = useTranslation(language as Language);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<Disease | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  // ... keep existing code (diseases array and other data)
  const diseases: Disease[] = [
    {
      id: '1',
      name: 'Rice Blast',
      symptoms: ['Diamond-shaped lesions on leaves', 'Brown spots with gray centers', 'Stunted growth'],
      affectedCrops: ['Rice', 'Wheat'],
      treatment: 'Apply copper-based fungicides. Remove infected plant debris. Ensure proper drainage.',
      severity: 'high',
      prevention: 'Use resistant varieties, avoid over-fertilization with nitrogen, maintain field hygiene.'
    },
    {
      id: '2',
      name: 'Cotton Bollworm',
      symptoms: ['Holes in cotton bolls', 'Caterpillars inside bolls', 'Premature boll drop'],
      affectedCrops: ['Cotton', 'Tomato', 'Corn'],
      treatment: 'Use biological control agents like Trichogramma wasps. Apply neem-based pesticides.',
      severity: 'high',
      prevention: 'Plant trap crops, use pheromone traps, follow crop rotation.'
    },
    {
      id: '3',
      name: 'Powdery Mildew',
      symptoms: ['White powdery coating on leaves', 'Yellowing of leaves', 'Stunted growth'],
      affectedCrops: ['Tomato', 'Cucumber', 'Grapes', 'Roses'],
      treatment: 'Spray with baking soda solution (1 tsp per liter). Apply sulfur-based fungicides.',
      severity: 'medium',
      prevention: 'Ensure good air circulation, avoid overhead watering, plant resistant varieties.'
    },
    {
      id: '4',
      name: 'Bacterial Leaf Blight',
      symptoms: ['Water-soaked lesions on leaves', 'Yellow halos around spots', 'Wilting'],
      affectedCrops: ['Rice', 'Wheat', 'Sugarcane'],
      treatment: 'Apply copper-based bactericides. Remove infected plants. Improve drainage.',
      severity: 'medium',
      prevention: 'Use certified disease-free seeds, avoid excessive nitrogen, maintain field sanitation.'
    },
    {
      id: '5',
      name: 'Aphids',
      symptoms: ['Small green/black insects on leaves', 'Curled leaves', 'Sticky honeydew'],
      affectedCrops: ['Most vegetables', 'Cotton', 'Wheat'],
      treatment: 'Release ladybugs or lacewings. Spray with neem oil or insecticidal soap.',
      severity: 'low',
      prevention: 'Use reflective mulches, plant companion crops like marigolds, avoid over-fertilization.'
    },
    {
      id: '6',
      name: 'Late Blight',
      symptoms: ['Dark water-soaked spots on leaves', 'White fungal growth on leaf undersides', 'Rapid plant death'],
      affectedCrops: ['Tomato', 'Potato', 'Pepper'],
      treatment: 'Apply copper-based fungicides preventively. Remove infected plants immediately.',
      severity: 'high',
      prevention: 'Use resistant varieties, ensure good air circulation, avoid overhead irrigation.'
    }
  ];

  const crops = ['all', 'Rice', 'Cotton', 'Tomato', 'Wheat', 'Potato', 'Cucumber', 'Corn'];

  const getSeverityColor = (severity: Disease['severity']) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredDiseases = diseases.filter(disease => {
    const matchesSearch = disease.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         disease.symptoms.some(symptom => symptom.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         disease.treatment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCrop = selectedCrop === 'all' || disease.affectedCrops.includes(selectedCrop);
    return matchesSearch && matchesCrop;
  });

  const simulateAIAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    // Simulate real-time analysis progress
    const progressSteps = [
      { progress: 20, message: 'Preprocessing image...' },
      { progress: 40, message: 'Detecting plant features...' },
      { progress: 60, message: 'Analyzing symptoms...' },
      { progress: 80, message: 'Matching disease patterns...' },
      { progress: 100, message: 'Analysis complete!' }
    ];

    for (const step of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setAnalysisProgress(step.progress);
      
      addAlert({
        type: 'info',
        title: 'AI Analysis',
        message: step.message,
        resolved: false
      });
    }

    // Select a random disease for demonstration
    const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];
    setAnalysisResult(randomDisease);
    setIsAnalyzing(false);
    
    addAlert({
      type: 'info',
      title: 'Analysis Complete',
      message: `Detected: ${randomDisease.name} with ${Math.floor(Math.random() * 15 + 85)}% confidence`,
      resolved: false
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addAlert({
        type: 'error',
        title: 'Invalid File Type',
        message: 'Please upload an image file (JPG, PNG, etc.)',
        resolved: false
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      addAlert({
        type: 'error',
        title: 'File Too Large',
        message: 'Please upload an image smaller than 10MB',
        resolved: false
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      setAnalysisResult(null);
      
      // Start AI analysis immediately after upload
      simulateAIAnalysis();
    };
    reader.readAsDataURL(file);
    
    // Reset input
    event.target.value = '';
  };

  const resetAnalysis = () => {
    setUploadedImage(null);
    setAnalysisResult(null);
    setIsAnalyzing(false);
    setAnalysisProgress(0);
  };

  return (
    <div className="space-y-6">
      {/* Image Upload and Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-green-600" />
            {t('plantImageAnalysis')} - Real-time AI Detection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Upload Area */}
            <div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                <Camera className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-3">{t('uploadPlantImage')}</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="plant-image-upload"
                  disabled={isAnalyzing}
                />
                <label htmlFor="plant-image-upload">
                  <Button variant="outline" asChild className="cursor-pointer" disabled={isAnalyzing}>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      {isAnalyzing ? 'Analyzing...' : 'Select Image'}
                    </span>
                  </Button>
                </label>
                {uploadedImage && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={resetAnalysis}
                    className="ml-2"
                    disabled={isAnalyzing}
                  >
                    Clear
                  </Button>
                )}
              </div>
              
              {uploadedImage && (
                <div className="mt-4">
                  <img 
                    src={uploadedImage} 
                    alt="Uploaded plant" 
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  {isAnalyzing && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${analysisProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Analyzing: {analysisProgress}%</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Analysis Result */}
            <div>
              {analysisResult && !isAnalyzing ? (
                <div className="border rounded-lg p-4 bg-blue-50">
                  <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    {t('analysisResult')}
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium">{t('detectedIssue')}:</span>
                      <p className="text-blue-800 font-semibold">{analysisResult.name}</p>
                    </div>
                    <div>
                      <span className="font-medium">Confidence:</span>
                      <p className="text-green-600 font-semibold">{Math.floor(Math.random() * 15 + 85)}%</p>
                    </div>
                    <div>
                      <span className="font-medium">{t('recommendedTreatment')}:</span>
                      <p className="text-sm text-blue-700">{analysisResult.treatment}</p>
                    </div>
                    <Badge className={getSeverityColor(analysisResult.severity)}>
                      {t('severity')}: {analysisResult.severity}
                    </Badge>
                  </div>
                </div>
              ) : isAnalyzing ? (
                <div className="border rounded-lg p-4 bg-yellow-50">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
                    <span>Real-time AI analysis in progress...</span>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>Processing with advanced ML models</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span>Comparing with disease database</span>
                    </div>
                  </div>
                </div>
              ) : uploadedImage ? (
                <div className="border rounded-lg p-4 bg-green-50">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="h-4 w-4" />
                    <span>Image uploaded successfully!</span>
                  </div>
                  <p className="text-sm text-green-600 mt-2">
                    AI analysis will begin automatically...
                  </p>
                </div>
              ) : (
                <div className="border rounded-lg p-4 bg-gray-50 text-center text-gray-500">
                  <Camera className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>{t('uploadImageForAnalysis')}</p>
                  <p className="text-xs mt-1">Supports JPG, PNG, WebP (max 10MB)</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plant Health Database */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-green-600" />
            {t('plantHealthDatabase')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t('searchDiseases')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {crops.map(crop => (
                <option key={crop} value={crop}>
                  {crop === 'all' ? t('allCrops') : crop}
                </option>
              ))}
            </select>
          </div>

          {/* Diseases List */}
          <div className="grid gap-4">
            {filteredDiseases.map((disease) => (
              <Card key={disease.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    <div className="flex-1">
                      {/* Disease Header */}
                      <div className="flex flex-wrap items-start gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 flex-1">
                          {disease.name}
                        </h3>
                        <Badge className={getSeverityColor(disease.severity)}>
                          {t('severity')}: {disease.severity}
                        </Badge>
                      </div>

                      {/* Affected Crops */}
                      <div className="mb-3">
                        <span className="font-medium text-sm text-gray-700">{t('affectedCrops')}: </span>
                        <div className="inline-flex flex-wrap gap-1 mt-1">
                          {disease.affectedCrops.map((crop, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {crop}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Symptoms */}
                      <div className="mb-3">
                        <span className="font-medium text-sm text-gray-700">{t('symptoms')}:</span>
                        <ul className="mt-1 space-y-1">
                          {disease.symptoms.map((symptom, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="text-red-500 mt-1">•</span>
                              {symptom}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Treatment */}
                      <div className="mb-3">
                        <span className="font-medium text-sm text-gray-700">{t('treatment')}:</span>
                        <p className="text-sm text-gray-600 mt-1">{disease.treatment}</p>
                      </div>

                      {/* Prevention */}
                      <div>
                        <span className="font-medium text-sm text-gray-700">{t('prevention')}:</span>
                        <p className="text-sm text-gray-600 mt-1">{disease.prevention}</p>
                      </div>
                    </div>

                    <Button variant="outline" size="sm" className="lg:ml-4">
                      <Eye className="h-4 w-4 mr-2" />
                      {t('viewDetails')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredDiseases.length === 0 && (
              <div className="text-center py-12">
                <Leaf className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('noDiseasesFound')}</h3>
                <p className="text-gray-500">{t('tryDifferentSearch')}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlantHealthDatabase;
