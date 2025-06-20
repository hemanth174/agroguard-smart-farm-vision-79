
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Leaf, Camera, AlertTriangle, CheckCircle, Eye } from 'lucide-react';
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

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      
      // Simulate AI analysis
      setTimeout(() => {
        const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];
        setAnalysisResult(randomDisease);
        
        addAlert({
          type: 'info',
          title: 'Image Analysis Complete',
          message: `Potential issue detected: ${randomDisease.name}`,
          resolved: false
        });
      }, 2000);
    };
    reader.readAsDataURL(file);
    
    // Reset input
    event.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Image Upload and Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-green-600" />
            {t('plantImageAnalysis')}
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
                />
                <label htmlFor="plant-image-upload">
                  <Button variant="outline" asChild>
                    <span className="cursor-pointer">{t('selectImage')}</span>
                  </Button>
                </label>
              </div>
              
              {uploadedImage && (
                <div className="mt-4">
                  <img 
                    src={uploadedImage} 
                    alt="Uploaded plant" 
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                </div>
              )}
            </div>

            {/* Analysis Result */}
            <div>
              {analysisResult ? (
                <div className="border rounded-lg p-4 bg-blue-50">
                  <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    {t('analysisResult')}
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium">{t('detectedIssue')}:</span>
                      <p className="text-blue-800">{analysisResult.name}</p>
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
              ) : uploadedImage ? (
                <div className="border rounded-lg p-4 bg-yellow-50">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
                    <span>{t('analyzingImage')}...</span>
                  </div>
                </div>
              ) : (
                <div className="border rounded-lg p-4 bg-gray-50 text-center text-gray-500">
                  {t('uploadImageForAnalysis')}
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
