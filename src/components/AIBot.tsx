
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Bot, 
  User, 
  X,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation, Language } from '@/utils/i18n';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  language?: string;
}

const AIBot = () => {
  const { language } = useApp();
  const { t } = useTranslation(language as Language);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: language === 'hi' 
        ? 'नमस्ते! मैं VillageEye AI असिस्टेंट हूँ। मैं आपकी मदद कैसे कर सकता हूँ?' 
        : language === 'te'
        ? 'నమస్కారం! నేను VillageEye AI అసిస్టెంట్. నేను మీకు ఎలా సహాయం చేయగలను?'
        : 'Hello! I\'m VillageEye AI Assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
      language
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const botResponses = {
    en: {
      'fire': 'For fire emergencies, immediately call our emergency helpline 6305003695 or use the Emergency Call button in the dashboard. Stay safe and evacuate if necessary.',
      'report': 'To report an issue, go to the Emergency section and click "Report Issue". Fill in the details and location. Our team will respond quickly.',
      'price': 'Current tomato prices are ₹25/kg. Rice is ₹45/kg. For latest prices, check the Market Prices section.',
      'drone': 'To check drone alerts, visit the Drone Monitor section. It shows real-time AI detection and patrol status.',
      'password': 'To reset your password, go to Settings > Security. Or contact support at support@villageeye.in',
      'help': 'I can help with: Emergency reporting, Market prices, Drone monitoring, Shopping, and general questions. What do you need?',
      'default': 'I understand you need help. Please ask about emergencies, market prices, drone monitoring, or other VillageEye features.'
    },
    hi: {
      'fire': 'आग की आपातकाल के लिए, तुरंत हमारी आपातकालीन हेल्पलाइन 6305003695 पर कॉल करें या डैशबोर्ड में इमरजेंसी कॉल बटन का उपयोग करें।',
      'report': 'समस्या रिपोर्ट करने के लिए, इमरजेंसी सेक्शन में जाएं और "Report Issue" पर क्लिक करें।',
      'price': 'वर्तमान टमाटर की कीमत ₹25/किलो है। चावल ₹45/किलो है। नवीनतम कीमतों के लिए Market Prices देखें।',
      'drone': 'ड्रोन अलर्ट देखने के लिए, Drone Monitor सेक्शन पर जाएं।',
      'password': 'पासवर्ड रीसेट करने के लिए, Settings > Security में जाएं।',
      'help': 'मैं मदद कर सकता हूं: आपातकालीन रिपोर्टिंग, बाजार की कीमतें, ड्रोन मॉनिटरिंग।',
      'default': 'मैं समझता हूं कि आपको मदद चाहिए। कृपया आपातकाल, बाजार की कीमतों के बारे में पूछें।'
    },
    te: {
      'fire': 'అగ్ని ప్రమాదాల కోసం, వెంటనే మా ఎమర్జెన్సీ హెల్ప్‌లైన్ 6305003695కు కాల్ చేయండి లేదా డ్యాష్‌బోర్డ్‌లో ఎమర్జెన్సీ కాల్ బటన్‌ను ఉపయోగించండి.',
      'report': 'సమస్యను నివేదించడానికి, ఎమర్జెన్సీ విభాగానికి వెళ్లి "Report Issue"పై క్లిక్ చేయండి.',
      'price': 'ప్రస్తుత టమోటా ధర ₹25/కిలో. బియ్యం ₹45/కిలో. తాజా ధరల కోసం Market Prices చూడండి.',
      'drone': 'డ్రోన్ అలర్ట్‌లను చూడటానికి, డ్రోన్ మానిటర్ విభాగాన్ని సందర్శించండి.',
      'password': 'మీ పాస్‌వర్డ్ రీసెట్ చేయడానికి, సెట్టింగ్స్ > సెక్యూరిటీకి వెళ్లండి.',
      'help': 'నేను సహాయం చేయగలను: ఎమర్జెన్సీ రిపోర్టింగ్, మార్కెట్ ధరలు, డ్రోన్ మానిటరింగ్.',
      'default': 'మీకు సహాయం కావాలని నేను అర్థం చేసుకున్నాను. దయచేసి ఎమర్జెన్సీలు, మార్కెట్ ధరల గురించి అడగండి.'
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const detectIntent = (message: string) => {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('fire') || lowerMessage.includes('आग') || lowerMessage.includes('అగ్ని')) return 'fire';
    if (lowerMessage.includes('report') || lowerMessage.includes('रिपोर्ट') || lowerMessage.includes('నివేదించు')) return 'report';
    if (lowerMessage.includes('price') || lowerMessage.includes('कीमत') || lowerMessage.includes('ధర')) return 'price';
    if (lowerMessage.includes('drone') || lowerMessage.includes('ड्रोन') || lowerMessage.includes('డ్రోన్')) return 'drone';
    if (lowerMessage.includes('password') || lowerMessage.includes('पासवर्ड') || lowerMessage.includes('పాస్వర్డ్')) return 'password';
    if (lowerMessage.includes('help') || lowerMessage.includes('मदद') || lowerMessage.includes('సహాయం')) return 'help';
    return 'default';
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot thinking
    setTimeout(() => {
      const intent = detectIntent(inputMessage);
      const responses = botResponses[language as keyof typeof botResponses] || botResponses.en;
      const response = responses[intent as keyof typeof responses] || responses.default;

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date(),
        language
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);

      // Auto-speak bot response
      speakText(response);
    }, 1500);
  };

  const toggleListening = () => {
    if (!isListening) {
      startListening();
    } else {
      stopListening();
    }
  };

  const startListening = () => {
    setIsListening(true);
    // Simulate voice input
    setTimeout(() => {
      setInputMessage("How to report fire emergency?");
      setIsListening(false);
    }, 2000);
  };

  const stopListening = () => {
    setIsListening(false);
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set voice based on language
      const voices = speechSynthesis.getVoices();
      if (language === 'hi') {
        const hindiVoice = voices.find(voice => voice.lang.includes('hi'));
        if (hindiVoice) utterance.voice = hindiVoice;
      } else if (language === 'te') {
        const teluguVoice = voices.find(voice => voice.lang.includes('te'));
        if (teluguVoice) utterance.voice = teluguVoice;
      }

      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg z-50 animate-pulse"
        size="icon"
      >
        <Bot className="w-6 h-6 text-white" />
      </Button>
    );
  }

  return (
    <Card className={`fixed bottom-6 right-6 w-96 h-96 shadow-2xl z-50 flex flex-col ${isMinimized ? 'h-16' : 'h-96'} transition-all duration-300`}>
      <CardHeader className="p-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            <CardTitle className="text-sm">VillageEye AI Assistant</CardTitle>
            <Badge variant="secondary" className="text-xs bg-white/20 text-white">
              {language === 'hi' ? 'हिंदी' : language === 'te' ? 'తెలుగు' : 'English'}
            </Badge>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMinimized(!isMinimized)}
              className="w-6 h-6 text-white hover:bg-white/20"
            >
              {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="w-6 h-6 text-white hover:bg-white/20"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {!isMinimized && (
        <>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'bot' && (
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-green-600" />
                  </div>
                )}
                
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    message.sender === 'user'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {message.text}
                  <div className={`text-xs mt-1 ${message.sender === 'user' ? 'text-green-100' : 'text-gray-500'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                {message.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-green-600" />
                </div>
                <div className="bg-gray-100 px-3 py-2 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <div className="flex-1 flex gap-1">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={
                    language === 'hi' 
                      ? 'अपना सवाल लिखें...' 
                      : language === 'te'
                      ? 'మీ ప్రశ్న టైప్ చేయండి...'
                      : 'Type your question...'
                  }
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="text-sm"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleListening}
                  className={`flex-shrink-0 ${isListening ? 'bg-red-100 text-red-600' : ''}`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
              </div>
              
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                size="icon"
                className="bg-green-600 hover:bg-green-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex justify-between items-center mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={isSpeaking ? stopSpeaking : () => speakText(messages[messages.length - 1]?.text || '')}
                className="text-xs"
              >
                {isSpeaking ? <VolumeX className="w-3 h-3 mr-1" /> : <Volume2 className="w-3 h-3 mr-1" />}
                {isSpeaking ? 'Stop' : 'Speak'}
              </Button>
              <span className="text-xs text-gray-500">
                {language === 'hi' ? 'बोलकर या टाइप करें' : language === 'te' ? 'మాట్లాడండి లేదా టైప్ చేయండి' : 'Speak or type'}
              </span>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};

export default AIBot;
