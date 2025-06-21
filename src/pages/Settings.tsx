
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Settings as SettingsIcon, Lock, Globe, Bell, Moon, Sun, Save } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation, Language, getLanguageDetails } from '@/utils/i18n';
import { useToast } from '@/hooks/use-toast';
import BackButton from '@/components/BackButton';
import LanguageIndicator from '@/components/LanguageIndicator';

const Settings = () => {
  const { language, setLanguage } = useApp();
  const { t } = useTranslation(language as Language);
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoAlerts, setAutoAlerts] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const languages: Language[] = ['en', 'hi', 'te', 'kn', 'ta', 'gu', 'mr'];

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: 'Password Mismatch',
        description: 'New password and confirm password do not match',
        variant: 'destructive',
      });
      return;
    }
    
    if (newPassword.length < 6) {
      toast({
        title: 'Password Too Short',
        description: 'Password must be at least 6 characters long',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Password Updated',
      description: 'Your password has been successfully updated',
    });
    
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSaveSettings = () => {
    toast({
      title: 'Settings Saved',
      description: 'Your preferences have been updated successfully',
    });
  };

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    toast({
      title: 'Language Changed',
      description: `Interface language changed to ${getLanguageDetails(newLanguage).nativeName}`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <BackButton />
      <LanguageIndicator />
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('settings')}</h1>
        <p className="text-gray-600">Manage your account preferences and security</p>
      </div>

      <div className="grid gap-6">
        {/* Language Settings */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-green-600" />
              {t('language')} & Region
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Select {t('language')}</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {languages.map((lang) => {
                  const langInfo = getLanguageDetails(lang);
                  return (
                    <Button
                      key={lang}
                      variant={language === lang ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleLanguageChange(lang)}
                      className="flex items-center gap-2 justify-start"
                    >
                      <span>{langInfo.flag}</span>
                      <span className="hidden sm:inline">{langInfo.nativeName}</span>
                    </Button>
                  );
                })}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Current: {getLanguageDetails(language as Language).nativeName}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" />
              {t('notifications')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Push {t('notifications')}</p>
                <p className="text-sm text-gray-600">Receive alerts and updates</p>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto Emergency Alerts</p>
                <p className="text-sm text-gray-600">Automatic alerts for emergencies</p>
              </div>
              <Switch
                checked={autoAlerts}
                onCheckedChange={setAutoAlerts}
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isDarkMode ? <Moon className="w-5 h-5 text-purple-600" /> : <Sun className="w-5 h-5 text-purple-600" />}
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-gray-600">Switch to dark theme</p>
              </div>
              <Switch
                checked={isDarkMode}
                onCheckedChange={setIsDarkMode}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-red-600" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Current Password</label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">New Password</label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Confirm New Password</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>
            
            <Button 
              onClick={handlePasswordChange}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              <Lock className="w-4 h-4 mr-2" />
              Update Password
            </Button>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button 
          onClick={handleSaveSettings}
          className="w-full bg-green-600 hover:bg-green-700"
          size="lg"
        >
          <Save className="w-4 h-4 mr-2" />
          {t('save')} All {t('settings')}
        </Button>
      </div>
    </div>
  );
};

export default Settings;
