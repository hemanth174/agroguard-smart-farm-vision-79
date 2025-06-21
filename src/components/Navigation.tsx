
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, User, Globe, WifiOff, Menu, Settings, HelpCircle, Phone, LogOut } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation, Language } from '@/utils/i18n';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface NavigationProps {
  onMenuToggle: () => void;
}

const Navigation = ({ onMenuToggle }: NavigationProps) => {
  const { language, setLanguage, user, signOut, alerts, isOnline } = useApp();
  const { t } = useTranslation(language as Language);
  const navigate = useNavigate();

  const languages = {
    en: { name: 'English', flag: '🇺🇸' },
    hi: { name: 'हिंदी', flag: '🇮🇳' },
    te: { name: 'తెలుగు', flag: '🇮🇳' },
    zh: { name: '中文', flag: '🇨🇳' },
    es: { name: 'Español', flag: '🇪🇸' },
    mr: { name: 'मराठी', flag: '🇮🇳' },
    gu: { name: 'ગુજરાતી', flag: '🇮🇳' },
    kn: { name: 'ಕನ್ನಡ', flag: '🇮🇳' },
    ta: { name: 'தமிழ்', flag: '🇮🇳' }
  };

  const activeAlerts = alerts.filter(alert => !alert.resolved);

  const handleProfileNavigation = (page: string) => {
    switch (page) {
      case 'profile':
        navigate('/profile');
        break;
      case 'settings':
        navigate('/settings');
        break;
      case 'support':
        navigate('/support');
        break;
      case 'logout':
        signOut();
        break;
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Left side with menu and logo */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuToggle}
              className="lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">VE</span>
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">VillageEye</span>
                <div className="flex items-center gap-2">
                  {!isOnline && (
                    <Badge variant="destructive" className="flex items-center gap-1 text-xs">
                      <WifiOff className="w-3 h-3" />
                      {t('offline')}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Emergency Call Button */}
            <a 
              href="tel:6305003695" 
              className="hidden sm:flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden lg:inline">{t('emergency')}</span>
            </a>

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 hidden sm:flex">
                  <Globe className="w-4 h-4" />
                  <span className="hidden lg:inline">{languages[language].name}</span>
                  <span className="lg:hidden">{languages[language].flag}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white z-50">
                {Object.entries(languages).map(([key, lang]) => (
                  <DropdownMenuItem
                    key={key}
                    onClick={() => setLanguage(key as any)}
                    className="flex items-center gap-2 hover:bg-green-50"
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                    {language === key && <Badge variant="secondary" className="ml-auto">Active</Badge>}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="relative">
                  <Bell className="w-4 h-4" />
                  {activeAlerts.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 w-5 h-5 text-xs p-0 flex items-center justify-center bg-red-500 hover:bg-red-600">
                      {activeAlerts.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-white z-50">
                <div className="p-2 border-b">
                  <p className="font-semibold">{t('notifications')}</p>
                </div>
                {activeAlerts.length > 0 ? (
                  activeAlerts.slice(0, 3).map((alert, index) => (
                    <DropdownMenuItem key={index} className="flex-col items-start p-3">
                      <span className="font-medium">{alert.title}</span>
                      <span className="text-sm text-gray-500">{alert.message}</span>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem className="text-gray-500">
                    {t('noNewNotifications')}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 max-w-40">
                  <User className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden sm:inline truncate">{user?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white z-50 shadow-lg">
                <DropdownMenuItem 
                  onClick={() => handleProfileNavigation('profile')}
                  className="flex items-center gap-2 hover:bg-green-50"
                >
                  <User className="w-4 h-4" />
                  {t('profile')}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleProfileNavigation('settings')}
                  className="flex items-center gap-2 hover:bg-blue-50"
                >
                  <Settings className="w-4 h-4" />
                  {t('settings')}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleProfileNavigation('support')}
                  className="flex items-center gap-2 hover:bg-purple-50"
                >
                  <HelpCircle className="w-4 h-4" />
                  {t('support')}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleProfileNavigation('logout')}
                  className="flex items-center gap-2 text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  {t('signOut')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
