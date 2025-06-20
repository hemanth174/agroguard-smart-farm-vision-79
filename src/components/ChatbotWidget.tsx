
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, X, Mic, Send } from 'lucide-react';

interface ChatbotWidgetProps {
  language: string;
}

const ChatbotWidget = ({ language }: ChatbotWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const translations = {
    en: {
      title: 'VillageEye Assistant',
      placeholder: 'Ask about farming, weather, prices...',
      send: 'Send',
      voice: 'Voice',
      online: 'Online'
    },
    hi: {
      title: 'विलेजआई सहायक',
      placeholder: 'कृषि, मौसम, मूल्य के बारे में पूछें...',
      send: 'भेजें',
      voice: 'आवाज़',
      online: 'ऑनलाइन'
    },
    te: {
      title: 'విలేజ్ఐ సహాయకుడు',
      placeholder: 'వ్యవసాయం, వాతావరణం, ధరల గురించి అడగండి...',
      send: 'పంపండి',
      voice: 'వాయిస్',
      online: 'ఆన్‌లైన్'
    }
  };

  const t = translations[language];

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-16 h-16 shadow-lg bg-green-600 hover:bg-green-700"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80">
      <Card className="shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <div>
            <CardTitle className="text-sm font-medium">{t.title}</CardTitle>
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs mt-1">
              {t.online}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-40 bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
            <p>Hello! I'm your VillageEye assistant. How can I help you today?</p>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder={t.placeholder}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1"
            />
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              <Send className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline">
              <Mic className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatbotWidget;
