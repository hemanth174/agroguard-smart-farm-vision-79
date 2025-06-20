
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, AlertTriangle, CheckCircle, Leaf } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PlantDisease {
  id: string;
  disease_name: string;
  crop_type: string;
  symptoms: string[];
  solutions: string[];
  severity: string;
  image_url: string;
}

const PlantHealthService = () => {
  const [diseases, setDiseases] = useState<PlantDisease[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const cropTypes = ['all', 'Rice', 'Wheat', 'Cotton', 'Sugarcane'];
  const severityLevels = ['all', 'low', 'medium', 'high'];

  useEffect(() => {
    fetchDiseases();
  }, []);

  const fetchDiseases = async () => {
    try {
      const { data, error } = await supabase
        .from('plant_diseases')
        .select('*')
        .order('disease_name');

      if (error) throw error;
      setDiseases(data || []);
    } catch (error) {
      console.error('Error fetching diseases:', error);
      toast({
        title: 'Error',
        description: 'Failed to load plant disease database',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low': return <CheckCircle className="h-4 w-4" />;
      case 'medium': return <AlertTriangle className="h-4 w-4" />;
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      default: return <Leaf className="h-4 w-4" />;
    }
  };

  const filteredDiseases = diseases.filter(disease => {
    const matchesSearch = disease.disease_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         disease.symptoms.some(symptom => symptom.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         disease.crop_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCrop = selectedCrop === 'all' || disease.crop_type === selectedCrop;
    const matchesSeverity = selectedSeverity === 'all' || disease.severity === selectedSeverity;
    return matchesSearch && matchesCrop && matchesSeverity;
  });

  if (loading) {
    return <div className="text-center py-8">Loading plant health database...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">🧬 Plant Health Database</h2>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search diseases or symptoms..."
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
          {cropTypes.map(crop => (
            <option key={crop} value={crop}>
              {crop === 'all' ? 'All Crops' : crop}
            </option>
          ))}
        </select>
        <select
          value={selectedSeverity}
          onChange={(e) => setSelectedSeverity(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {severityLevels.map(severity => (
            <option key={severity} value={severity}>
              {severity === 'all' ? 'All Severity Levels' : severity.charAt(0).toUpperCase() + severity.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Disease Cards */}
      <div className="grid gap-6">
        {filteredDiseases.map((disease) => (
          <Card key={disease.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-1/4">
                  <img
                    src={disease.image_url}
                    alt={disease.disease_name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
                <div className="lg:w-3/4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{disease.disease_name}</h3>
                      <div className="flex gap-2">
                        <Badge variant="outline">{disease.crop_type}</Badge>
                        <Badge className={getSeverityColor(disease.severity)}>
                          {getSeverityIcon(disease.severity)}
                          {disease.severity.charAt(0).toUpperCase() + disease.severity.slice(1)} Risk
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-red-600 mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Symptoms
                      </h4>
                      <ul className="space-y-2">
                        {disease.symptoms.map((symptom, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <span className="text-red-400 mt-1">•</span>
                            {symptom}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-green-600 mb-3 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Solutions
                      </h4>
                      <ul className="space-y-2">
                        {disease.solutions.map((solution, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <span className="text-green-400 mt-1">•</span>
                            {solution}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDiseases.length === 0 && (
        <div className="text-center py-8">
          <Leaf className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No diseases found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
        </div>
      )}
    </div>
  );
};

export default PlantHealthService;
