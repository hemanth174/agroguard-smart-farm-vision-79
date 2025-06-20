import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, User, Globe, WifiOff, Menu, X, Settings, HelpCircle, Phone } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation, Language } from '@/utils/i18n';
import { useState } from 'react';

const Navigation = () => {
  const { language, setLanguage, user, signOut, alerts, isOnline } = useApp();
  const { t } = useTranslation(language as Language);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

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

  const navItems = [
    { label: t('dashboard'), href: '#dashboard', id: 'dashboard' },
    { label: t('services'), href: '#services', id: 'services' },
    { label: t('market'), href: '#market', id: 'market' },
    { label: t('support'), href: '#support', id: 'support' }
  ];

  const handleNavClick = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">AG</span>
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">AgroGuard</span>
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`transition-colors font-medium px-3 py-2 rounded-md ${
                  activeSection === item.id 
                    ? 'text-green-600 bg-green-50' 
                    : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                }`}
              >
                {item.label}
              </button>
            ))}
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

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{user?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white z-50">
                <DropdownMenuItem className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {t('profile')}
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  {t('settings')}
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4" />
                  {t('support')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={signOut} className="flex items-center gap-2 text-red-600">
                  {t('signOut')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Toggle */}
            <Button
              variant="outline"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 bg-white">
            <div className="space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                    activeSection === item.id 
                      ? 'text-green-600 bg-green-50' 
                      : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              {/* Mobile Emergency Button */}
              <a 
                href="tel:6305003695" 
                className="block w-full text-left px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                📞 {t('emergency')}: 6305003695
              </a>
            </div>
            
            {/* Mobile Language Selector */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-500 mb-2">{t('language')}</p>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(languages).map(([key, lang]) => (
                  <Button
                    key={key}
                    variant={language === key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLanguage(key as any)}
                    className="flex items-center gap-1 text-xs"
                  >
                    <span>{lang.flag}</span>
                    <span className="truncate">{lang.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
