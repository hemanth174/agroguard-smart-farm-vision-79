
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Phone, MapPin, Globe, Edit3, Save, Camera } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation, Language, getLanguageDetails } from '@/utils/i18n';
import { useToast } from '@/hooks/use-toast';
import BackButton from '@/components/BackButton';
import LanguageIndicator from '@/components/LanguageIndicator';

const Profile = () => {
  const { user, language } = useApp();
  const { t } = useTranslation(language as Language);
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Ravi Kumar',
    mobile: '+91 98765 43210',
    email: 'ravi.kumar@village.in',
    village: 'Anantapur Village',
    district: 'Anantapur District',
    state: 'Andhra Pradesh',
    language: language
  });

  const languageInfo = getLanguageDetails(language as Language);

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <BackButton />
      <LanguageIndicator />
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('profile')}</h1>
        <p className="text-gray-600">Manage your account information and preferences</p>
      </div>

      <div className="grid gap-6">
        {/* Profile Header Card */}
        <Card className="border-green-200">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarFallback className="bg-green-100 text-green-700 text-xl font-bold">
                    {profileData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0 bg-green-600 hover:bg-green-700"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <CardTitle className="text-2xl">{profileData.name}</CardTitle>
            <div className="flex justify-center gap-2 mt-2">
              <Badge className="bg-green-100 text-green-800">Verified Farmer</Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                {languageInfo.flag} {languageInfo.nativeName}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Personal Information */}
        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Personal Information
            </CardTitle>
            <Button
              variant={isEditing ? "default" : "outline"}
              size="sm"
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              className="flex items-center gap-2"
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4" />
                  {t('save')}
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4" />
                  Edit
                </>
              )}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t('name')}</label>
                <Input
                  value={profileData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('mobile')}</label>
                <Input
                  value={profileData.mobile}
                  onChange={(e) => handleInputChange('mobile', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('email')}</label>
                <Input
                  value={profileData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('village')}</label>
                <Input
                  value={profileData.village}
                  onChange={(e) => handleInputChange('village', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Information */}
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-purple-600" />
              Location Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">District</label>
                <Input
                  value={profileData.district}
                  onChange={(e) => handleInputChange('district', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">State</label>
                <Input
                  value={profileData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Language Preferences */}
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-orange-600" />
              {t('language')} Preferences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              Choose your preferred language for the interface
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="default" className="flex items-center gap-1">
                {languageInfo.flag} {languageInfo.nativeName}
              </Badge>
              <span className="text-sm text-gray-500">Current Language</span>
            </div>
          </CardContent>
        </Card>

        {/* Account Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Account Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">15</div>
                <div className="text-sm text-gray-600">Reports Filed</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">8</div>
                <div className="text-sm text-gray-600">Alerts Resolved</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">23</div>
                <div className="text-sm text-gray-600">Orders Placed</div>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">7</div>
                <div className="text-sm text-gray-600">Days Active</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
