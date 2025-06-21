
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  AlertTriangle, 
  Bell, 
  Plane, 
  TrendingUp, 
  ShoppingCart, 
  User, 
  Settings, 
  HelpCircle,
  X
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation, Language } from '@/utils/i18n';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar = ({ isOpen, onClose, activeSection, onSectionChange }: SidebarProps) => {
  const { language, alerts } = useApp();
  const { t } = useTranslation(language as Language);

  const menuItems = [
    { id: 'dashboard', label: t('dashboard'), icon: Home, badge: null },
    { id: 'emergency', label: t('reportIssue'), icon: AlertTriangle, badge: null },
    { id: 'alerts', label: t('alertCenter'), icon: Bell, badge: alerts.filter(a => !a.resolved).length },
    { id: 'drone', label: t('droneMonitor'), icon: Plane, badge: null },
    { id: 'market', label: t('marketPrices'), icon: TrendingUp, badge: null },
    { id: 'shopping', label: t('shoppingCart'), icon: ShoppingCart, badge: null },
    { id: 'profile', label: t('profile'), icon: User, badge: null },
    { id: 'settings', label: t('settings'), icon: Settings, badge: null },
    { id: 'support', label: t('support'), icon: HelpCircle, badge: null }
  ];

  const handleItemClick = (itemId: string) => {
    if (itemId === 'profile') {
      window.location.href = '/profile';
    } else if (itemId === 'settings') {
      window.location.href = '/settings';
    } else if (itemId === 'support') {
      window.location.href = '/support';
    } else if (itemId === 'market') {
      window.location.href = '/market-prices';
    } else {
      onSectionChange(itemId);
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:relative lg:shadow-none lg:border-r lg:border-gray-200
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">VE</span>
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">VillageEye</span>
              <p className="text-xs text-gray-500">Smart Villages Platform</p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Menu Items */}
        <div className="p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = activeSection === item.id;
            const Icon = item.icon;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start gap-3 py-3 px-4 ${
                  isActive 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => handleItemClick(item.id)}
              >
                <Icon className="w-5 h-5" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-center text-gray-600">
            Built for Smart Villages 🇮🇳<br/>
            Powered by AI & Innovation
          </p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
