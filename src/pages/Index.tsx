
import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation, Language } from '@/utils/i18n';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ChatbotEnhanced from '@/components/ChatbotEnhanced';
import VoiceChatbot from '@/components/VoiceChatbot';

const Index = () => {
  const { user, setUser } = useApp();
  const { language } = useApp();
  const { t } = useTranslation(language as Language);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 py-3 bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex items-center justify-between">
        <div className="font-bold text-lg">{t('title')}</div>
        <div className="flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/icons/avatar.png" alt={user.name || "Avatar"} />
                    <AvatarFallback>{user.name ? user.name[0] : 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>{user.name}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => navigate('/login')}>Login</Button>
          )}
        </div>
      </header>

      <div className="flex-grow flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">{t('welcome')}</h1>
          <p className="text-gray-600 dark:text-gray-400">{t('description')}</p>
        </div>
      </div>

      {/* Enhanced Chatbot Widget */}
      <ChatbotEnhanced />
      
      {/* Voice Chatbot */}
      <VoiceChatbot />
    </div>
  );
};

export default Index;
