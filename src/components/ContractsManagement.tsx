
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { FileText, Search, Calendar, MapPin, Users, CheckCircle } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation, Language } from '@/utils/i18n';

interface Contract {
  id: string;
  title: string;
  description: string;
  type: 'full-service' | 'consultation' | 'equipment' | 'harvesting';
  duration: string;
  compensation: string;
  location: string;
  requirements: string[];
  status: 'open' | 'in-progress' | 'completed' | 'cancelled';
  deadline: Date;
  provider: string;
  applicants: number;
}

const ContractsManagement = () => {
  const { language, addAlert, user } = useApp();
  const { t } = useTranslation(language as Language);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [contracts] = useState<Contract[]>([
    {
      id: '1',
      title: 'Complete Field Service - Rice Cultivation',
      description: 'Full-cycle rice farming service including preparation, sowing, maintenance, and harvesting for 10-acre field.',
      type: 'full-service',
      duration: '4 months',
      compensation: '₹80,000',
      location: 'Warangal, Telangana',
      requirements: ['5+ years experience', 'Own equipment preferred', 'Organic certification'],
      status: 'open',
      deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      provider: 'Sri Krishna Farms',
      applicants: 12
    },
    {
      id: '2', 
      title: 'Cotton Cultivation Contract',
      description: 'Cotton farming contract for 5 acres with guaranteed buyback at market premium rates.',
      type: 'full-service',
      duration: '6 months', 
      compensation: '₹50,000',
      location: 'Khammam, Telangana',
      requirements: ['Cotton farming experience', 'Pest management knowledge'],
      status: 'open',
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      provider: 'Telangana Cotton Corp',
      applicants: 8
    },
    {
      id: '3',
      title: 'Organic Vegetable Farming',
      description: 'Organic vegetable cultivation for 2 acres with complete seed-to-sale support.',
      type: 'consultation',
      duration: '3 months',
      compensation: '₹25,000',
      location: 'Nizamabad, Telangana', 
      requirements: ['Organic farming certification', 'Local market knowledge'],
      status: 'in-progress',
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      provider: 'Green Valley Organics',
      applicants: 15
    },
    {
      id: '4',
      title: 'Harvesting Equipment Service',
      description: 'Provide harvesting equipment and operator services for multiple farms during harvest season.',
      type: 'equipment',
      duration: '2 months',
      compensation: '₹35,000',
      location: 'Karimnagar, Telangana',
      requirements: ['Own harvesting equipment', 'Experienced operator'],
      status: 'open',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      provider: 'Farmer Equipment Co-op',
      applicants: 5
    },
    {
      id: '5',
      title: 'Millet Cultivation Project',
      description: 'Government-sponsored millet cultivation program with training and guaranteed procurement.',
      type: 'full-service',
      duration: '5 months',
      compensation: '₹60,000',
      location: 'Medak, Telangana',
      requirements: ['Small/marginal farmer', 'Willingness to adopt new techniques'],
      status: 'completed',
      deadline: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      provider: 'Telangana Govt Agriculture Dept',
      applicants: 25
    }
  ]);

  const getStatusColor = (status: Contract['status']) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800'; 
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: Contract['type']) => {
    switch (type) {
      case 'full-service': return 'bg-purple-100 text-purple-800';
      case 'consultation': return 'bg-yellow-100 text-yellow-800';
      case 'equipment': return 'bg-orange-100 text-orange-800';
      case 'harvesting': return 'bg-cyan-100 text-cyan-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleApply = (contractId: string, contractTitle: string) => {
    addAlert({
      type: 'info',
      title: 'Application Submitted',
      message: `Your application for "${contractTitle}" has been submitted successfully.`,
      resolved: false
    });
  };

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || contract.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-600" />
            {t('agriContracts')} & {t('fieldServices')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t('searchContracts')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">{t('allStatus')}</option>
              <option value="open">{t('open')}</option>
              <option value="in-progress">{t('inProgress')}</option>
              <option value="completed">{t('completed')}</option>
            </select>
          </div>

          {/* Contracts Grid */}
          <div className="grid gap-6">
            {filteredContracts.map((contract) => (
              <Card key={contract.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex flex-wrap items-start gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 flex-1">
                          {contract.title}
                        </h3>
                        <div className="flex gap-2">
                          <Badge className={getStatusColor(contract.status)}>
                            {contract.status.replace('-', ' ')}
                          </Badge>
                          <Badge className={getTypeColor(contract.type)}>
                            {contract.type.replace('-', ' ')}
                          </Badge>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 mb-4">{contract.description}</p>

                      {/* Contract Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{t('duration')}:</span>
                          <span>{contract.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-green-600 font-bold text-lg">₹</span>
                          <span className="font-medium">{t('compensation')}:</span>
                          <span className="text-green-600 font-semibold">{contract.compensation}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{t('location')}:</span>
                          <span>{contract.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{t('applicants')}:</span>
                          <span>{contract.applicants}</span>
                        </div>
                      </div>

                      {/* Provider and Deadline */}
                      <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">{t('provider')}:</span> {contract.provider}
                        </div>
                        <div>
                          <span className="font-medium">{t('deadline')}:</span> {contract.deadline.toLocaleDateString()}
                        </div>
                      </div>

                      {/* Requirements */}
                      <div className="mb-4">
                        <p className="font-medium text-sm text-gray-700 mb-2">{t('requirements')}:</p>
                        <div className="flex flex-wrap gap-2">
                          {contract.requirements.map((req, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {req}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="lg:ml-6">
                      {contract.status === 'open' ? (
                        <Button
                          onClick={() => handleApply(contract.id, contract.title)}
                          className="bg-green-600 hover:bg-green-700 w-full lg:w-auto"
                        >
                          {t('apply')}
                        </Button>
                      ) : contract.status === 'in-progress' ? (
                        <Button variant="outline" className="w-full lg:w-auto">
                          {t('viewProgress')}
                        </Button>
                      ) : (
                        <Button variant="outline" disabled className="w-full lg:w-auto">
                          {t('completed')}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredContracts.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('noContractsFound')}</h3>
                <p className="text-gray-500">{t('tryDifferentSearch')}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContractsManagement;
