
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, X, Mic, Send, MicOff } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/utils/i18n';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isVoice?: boolean;
}

const ChatbotAdvanced = () => {
  const { language, user, isOnline } = useApp();
  const { t } = useTranslation(language);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      // Set language based on app language
      const speechLang = {
        'en': 'en-US',
        'hi': 'hi-IN',
        'te': 'te-IN'
      };
      recognitionRef.current.lang = speechLang[language] || 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [language]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initial greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greetings = {
        en: `Hello ${user?.name || 'Farmer'}! I'm your AgroGuard assistant. How can I help you today?`,
        hi: `नमस्ते ${user?.name || 'किसान जी'}! मैं आपका एग्रोगार्ड सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?`,
        te: `హలో ${user?.name || 'రైతు గారు'}! నేను మీ అగ్రోగార్డ్ సహాయకుడిని। ఈరోజు నేను మీకు ఎలా సహాయం చేయగలను?`
      };

      addBotMessage(greetings[language] || greetings.en);
    }
  }, [isOpen, messages.length, user?.name, language]);

  const addBotMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addUserMessage = (text: string, isVoice = false) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
      isVoice
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    const responses = {
      en: {
        weather: "Based on current conditions, temperature is 28°C with 65% humidity. Perfect weather for most crops! Would you like specific crop recommendations?",
        price: "Current market prices: Rice ₹2,450/quintal (+₹50), Wheat ₹2,100/quintal (-₹25), Cotton ₹5,800/quintal (+₹100). Prices updated 1 hour ago.",
        irrigation: "Your soil moisture is at 65% - optimal level! No immediate irrigation needed. I'll alert you when it drops below 30%.",
        disease: "Upload a photo of the affected plant and I'll analyze it for diseases. You can also describe the symptoms you're seeing.",
        drone: "Drone last scanned 2 hours ago with 95% field coverage. No issues detected. Would you like to start a new scan?",
        sensors: "All 8 IoT sensors are online. Soil moisture: 65%, Temperature: 28°C, Water tank: 85% full. Everything looks good!",
        contracts: "I can help you find farming contracts. What crop are you planning to grow and what's your farm size?",
        fertilizer: "Based on your soil conditions, I recommend balanced NPK fertilizer. Check our farming shop for organic options.",
        default: "I can help with weather, market prices, irrigation, disease detection, drone monitoring, and more. What would you like to know?"
      },
      hi: {
        weather: "वर्तमान मौसम के अनुसार, तापमान 28°C है और आर्द्रता 65% है। अधिकांश फसलों के लिए बेहतरीन मौसम! क्या आपको विशिष्ट फसल की सिफारिशें चाहिए?",
        price: "वर्तमान बाजार भाव: चावल ₹2,450/क्विंटल (+₹50), गेहूं ₹2,100/क्विंटल (-₹25), कपास ₹5,800/क्विंटल (+₹100)। भाव 1 घंटे पहले अपडेट किए गए।",
        irrigation: "आपकी मिट्टी में नमी 65% है - यह उत्तम स्तर है! अभी सिंचाई की जरूरत नहीं। जब यह 30% से नीचे गिरेगी तो मैं आपको अलर्ट करूंगा।",
        disease: "प्रभावित पौधे की फोटो अपलोड करें और मैं बीमारियों के लिए इसका विश्लेषण करूंगा। आप लक्षणों का वर्णन भी कर सकते हैं।",
        drone: "ड्रोन ने 2 घंटे पहले 95% खेत कवरेज के साथ अंतिम स्कैन किया। कोई समस्या नहीं मिली। क्या आप नया स्कैन शुरू करना चाहते हैं?",
        sensors: "सभी 8 IoT सेंसर ऑनलाइन हैं। मिट्टी की नमी: 65%, तापमान: 28°C, पानी की टंकी: 85% भरी। सब कुछ ठीक लग रहा है!",
        contracts: "मैं आपको कृषि अनुबंध खोजने में मदद कर सकता हूं। आप कौन सी फसल उगाने की योजना बना रहे हैं और आपके खेत का आकार क्या है?",
        fertilizer: "आपकी मिट्टी की स्थिति के आधार पर, मैं संतुलित NPK उर्वरक की सिफारिश करता हूं। जैविक विकल्पों के लिए हमारी कृषि दुकान देखें।",
        default: "मैं मौसम, बाजार भाव, सिंचाई, रोग पहचान, ड्रोन निगरानी और भी बहुत कुछ में मदद कर सकता हूं। आप क्या जानना चाहते हैं?"
      },
      te: {
        weather: "ప్రస్తుత వాతావరణం ప్రకారం, ఉష్ణోగ్రత 28°C మరియు తేమ 65%. చాలా పంటలకు అద్భుతమైన వాతావరణం! మీకు నిర్దిష్ట పంట సిఫార్సులు కావాలా?",
        price: "ప్రస్తుత మార్కెట్ ధరలు: వరి ₹2,450/క్వింటల్ (+₹50), గోధుమ ₹2,100/క్వింటల్ (-₹25), పత్తి ₹5,800/క్వింటల్ (+₹100). ధరలు 1 గంట క్రితం నవీకరించబడ్డాయి.",
        irrigation: "మీ మట్టిలో తేమ 65% ఉంది - ఇది అనుకూల స్థాయి! ఇప్పుడు నీటిపారుదల అవసరం లేదు. ఇది 30% కంటే తక్కువగా ఉన్నప్పుడు నేను మిమ్మల్ని అలర్ట్ చేస్తాను.",
        disease: "ప్రభావిత మొక్క యొక్క ఫోటోను అప్‌లోడ్ చేయండి మరియు నేను వ్యాధుల కోసం దాన్ని విశ్లేషిస్తాను. మీరు కనిపించే లక్షణాలను కూడా వివరించవచ్చు.",
        drone: "డ్రోన్ 2 గంటల క్రితం 95% పొలం కవరేజీతో చివరిసారి స్కాన్ చేసింది. ఎటువంటి సమస్యలు కనుగొనబడలేదు. మీరు కొత్త స్కాన్ ప్రారంభించాలనుకుంటున్నారా?",
        sensors: "అన్ని 8 IoT సెన్సర్లు ఆన్‌లైన్‌లో ఉన్నాయి. మట్టి తేమ: 65%, ఉష్ణోగ్రత: 28°C, నీటి ట్యాంక్: 85% నిండింది. అంతా బాగానే ఉంది!",
        contracts: "నేను మీకు వ్యవసాయ ఒప్పందాలను కనుగొనడంలో సహాయం చేయగలను. మీరు ఏ పంటను పండించాలని అనుకుంటున్నారు మరియు మీ పొలం పరిమాణం ఎంత?",
        fertilizer: "మీ మట్టి పరిస్థితుల ఆధారంగా, నేను సమతుల్య NPK ఎరువును సిఫార్సు చేస్తున్నాను. సేంద్రీయ ఎంపికల కోసం మా వ్యవసాయ దుకాణాన్ని చూడండి.",
        default: "నేను వాతావరణం, మార్కెట్ ధరలు, నీటిపారుదల, వ్యాధి గుర్తింపు, డ్రోన్ పర్యవేక్షణ మరియు మరిన్నింటిలో సహాయం చేయగలను. మీరు ఏమి తెలుసుకోవాలనుకుంటున్నారు?"
      }
    };

    const currentResponses = responses[language] || responses.en;

    if (lowerMessage.includes('weather') || lowerMessage.includes('मौसम') || lowerMessage.includes('వాతావరణం')) {
      return currentResponses.weather;
    }
    if (lowerMessage.includes('price') || lowerMessage.includes('भाव') || lowerMessage.includes('ধর')) {
      return currentResponses.price;
    }
    if (lowerMessage.includes('water') || lowerMessage.includes('irrigation') || lowerMessage.includes('सिंचाई') || lowerMessage.includes('నీటిపారుదల')) {
      return currentResponses.irrigation;
    }
    if (lowerMessage.includes('disease') || lowerMessage.includes('बीमारी') || lowerMessage.includes('వ్యాధి')) {
      return currentResponses.disease;
    }
    if (lowerMessage.includes('drone') || lowerMessage.includes('ड्रोन') || lowerMessage.includes('డ్రోన్')) {
      return currentResponses.drone;
    }
    if (lowerMessage.includes('sensor') || lowerMessage.includes('सेंसर') || lowerMessage.includes('సెన్సర్')) {
      return currentResponses.sensors;
    }
    if (lowerMessage.includes('contract') || lowerMessage.includes('अनुबंध') || lowerMessage.includes('ఒప్పందం')) {
      return currentResponses.contracts;
    }
    if (lowerMessage.includes('fertilizer') || lowerMessage.includes('उर्वरक') || lowerMessage.includes('ఎరువు')) {
      return currentResponses.fertilizer;
    }

    return currentResponses.default;
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    addUserMessage(inputMessage);
    setInputMessage('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = generateBotResponse(inputMessage);
      addBotMessage(response);
      setIsTyping(false);
      
      // Text-to-speech for bot responses (if available)
      if ('speechSynthesis' in window && isOnline) {
        const utterance = new SpeechSynthesisUtterance(response);
        utterance.lang = language === 'hi' ? 'hi-IN' : language === 'te' ? 'te-IN' : 'en-US';
        utterance.rate = 0.8;
        speechSynthesis.speak(utterance);
      }
    }, 1000 + Math.random() * 2000);
  };

  const startVoiceRecognition = () => {
    if (recognitionRef.current && isOnline) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopVoiceRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

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
    <div className="fixed bottom-6 right-6 z-50 w-96 h-96">
      <Card className="shadow-xl h-full flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 flex-shrink-0">
          <div>
            <CardTitle className="text-sm font-medium">{t('chatTitle')}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">
                {t('online')}
              </Badge>
              {!isOnline && (
                <Badge variant="destructive" className="text-xs">
                  {t('offline')}
                </Badge>
              )}
            </div>
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
        
        <CardContent className="flex-1 flex flex-col space-y-4 overflow-hidden">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto space-y-3 min-h-0">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-2 rounded-lg text-sm ${
                    message.sender === 'user'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {message.text}
                  {message.isVoice && (
                    <Mic className="h-3 w-3 inline ml-1" />
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 p-2 rounded-lg text-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex gap-2 flex-shrink-0">
            <Input
              placeholder={t('chatPlaceholder')}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
              disabled={!isOnline}
            />
            <Button
              size="sm"
              onClick={handleSendMessage}
              className="bg-green-600 hover:bg-green-700"
              disabled={!inputMessage.trim() || !isOnline}
            >
              <Send className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={isListening ? stopVoiceRecognition : startVoiceRecognition}
              disabled={!isOnline}
              className={isListening ? 'bg-red-50 border-red-200' : ''}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatbotAdvanced;
