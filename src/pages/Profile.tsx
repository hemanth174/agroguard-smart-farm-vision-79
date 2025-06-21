
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { User, Phone, MapPin, Globe, Edit, Save } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation, Language } from '@/utils/i18n';
import { useState } from 'react';

const Profile = () => {
  const { user, language } = useApp();
  const { t } = useTranslation(language as Language);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Ravi Kumar',
    phone: '+91 9876543210',
    village: 'Kadapa District',
    occupation: 'Farmer'
  });

  const handleSave = () => {
    setIsEditing(false);
    // Save profile logic would go here
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('profile')}</h1>
        <p className="text-gray-600">Manage your personal information and preferences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Info Card */}
        <Card className="border-green-200">
          <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-green-600" />
              Personal Information
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="ml-auto"
              >
                {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                {isEditing ? 'Save' : 'Edit'}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              {isEditing ? (
                <Input
                  value={profileData.name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                />
              ) : (
                <p className="text-lg font-semibold">{profileData.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              {isEditing ? (
                <Input
                  value={profileData.phone}
                  onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                />
              ) : (
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-green-600" />
                  {profileData.phone}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Village/Location</label>
              {isEditing ? (
                <Input
                  value={profileData.village}
                  onChange={(e) => setProfileData(prev => ({ ...prev, village: e.target.value }))}
                />
              ) : (
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-green-600" />
                  {profileData.village}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Occupation</label>
              {isEditing ? (
                <Input
                  value={profileData.occupation}
                  onChange={(e) => setProfileData(prev => ({ ...prev, occupation: e.target.value }))}
                />
              ) : (
                <p className="font-medium">{profileData.occupation}</p>
              )}
            </div>

            {isEditing && (
              <Button onClick={handleSave} className="w-full bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Account Status Card */}
        <Card className="border-blue-200">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600" />
              Account Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Account Status</span>
              <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Language</span>
              <Badge variant="outline">{language === 'en' ? 'English' : language === 'hi' ? 'हिंदी' : 'తెలుగు'}</Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Member Since</span>
              <span className="text-sm text-gray-600">January 2024</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Last Login</span>
              <span className="text-sm text-gray-600">Today, 2:30 PM</span>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Recent Activity</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Reported irrigation issue - 2 days ago</p>
                <p>• Checked market prices - 1 week ago</p>
                <p>• Updated profile information - 2 weeks ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
