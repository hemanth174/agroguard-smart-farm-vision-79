
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageCircle, X, Mic, MicOff, Send, Volume2, VolumeX, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  language: string;
  isVoice?: boolean;
}

interface Language {
  code: string;
  name: string;
  flag: string;
  speechLang: string;
}

const VoiceChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [speakerMuted, setSpeakerMuted] = useState(false);
  const [audioWave, setAudioWave] = useState(0);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const waveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const languages: Language[] = [
    { code: 'en', name: 'English', flag: '🇺🇸', speechLang: 'en-US' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳', speechLang: 'hi-IN' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳', speechLang: 'te-IN' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳', speechLang: 'mr-IN' },
    { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳', speechLang: 'gu-IN' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳', speechLang: 'ta-IN' },
    { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳', speechLang: 'kn-IN' },
    { code: 'zh', name: '中文', flag: '🇨🇳', speechLang: 'zh-CN' },
    { code: 'es', name: 'Español', flag: '🇪🇸', speechLang: 'es-ES' }
  ];

  const currentLanguage = languages.find(lang => lang.code === selectedLanguage) || languages[0];

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      try {
        const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognitionAPI();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = currentLanguage.speechLang;

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputMessage(transcript);
          setIsListening(false);
          stopAudioWave();
        };

        recognitionRef.current.onerror = () => {
          setIsListening(false);
          stopAudioWave();
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
          stopAudioWave();
        };
      } catch (error) {
        console.log('Speech recognition not available:', error);
      }
    }
  }, [currentLanguage.speechLang]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Add greeting message when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greetings = {
        en: "Hello! I'm your voice-enabled farming assistant. You can speak or type your questions about agriculture, weather, crops, and more. How can I help you today?",
        hi: "नमस्कार! मैं आपका वॉयस-सक्षम कृषि सहायक हूं। आप कृषि, मौसम, फसलों के बारे में बोल या लिख सकते हैं। मैं आपकी कैसे मदद कर सकता हूं?",
        te: "నమస్కారం! నేను మీ వాయిస్-ఎనేబుల్డ్ వ్యవసాయ సహాయకుడిని। మీరు వ్యవసాయం, వాతావరణం, పంటల గురించి మాట్లాడవచ్చు లేదా టైప్ చేయవచ్చు. నేను మీకు ఎలా సహాయం చేయగలను?",
        mr: "नमस्कार! मी तुमचा आवाज-सक्षम शेती सहाय्यक आहे. तुम्ही शेती, हवामान, पिकांबद्दल बोलू किंवा टाइप करू शकता. मी तुम्हाला कशी मदत करू शकतो?",
        gu: "નમસ્તે! હું તમારો વૉઇસ-સક્ષમ કૃષિ સહાયક છું. તમે કૃષિ, હવામાન, પાકો વિશે બોલી અથવા લખી શકો છો. હું તમારી કેવી રીતે મદદ કરી શકું?",
        ta: "வணக்கம்! நான் உங்கள் குரல்-இயக்கப்பட்ட விவசாய உதவியாளர். நீங்கள் விவசாயம், வானிலை, பயிர்கள் பற்றி பேசலாம் அல்லது தட்டச்சு செய்யலாம். நான் உங்களுக்கு எப்படி உதவ முடியும்?",
        kn: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಧ್ವನಿ-ಸಕ್ರಿಯ ಕೃಷಿ ಸಹಾಯಕ. ನೀವು ಕೃಷಿ, ಹವಾಮಾನ, ಬೆಳೆಗಳ ಬಗ್ಗೆ ಮಾತನಾಡಬಹುದು ಅಥವಾ ಟೈಪ್ ಮಾಡಬಹುದು. ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?",
        zh: "您好！我是您的语音农业助手。您可以说话或输入关于农业、天气、作物的问题。我如何为您提供帮助？",
        es: "¡Hola! Soy tu asistente agrícola habilitado por voz. Puedes hablar o escribir sobre agricultura, clima, cultivos. ¿Cómo puedo ayudarte hoy?"
      };

      addBotMessage(greetings[selectedLanguage] || greetings.en);
    }
  }, [isOpen, selectedLanguage]);

  const startAudioWave = () => {
    waveIntervalRef.current = setInterval(() => {
      setAudioWave(prev => (prev + 1) % 4);
    }, 200);
  };

  const stopAudioWave = () => {
    if (waveIntervalRef.current) {
      clearInterval(waveIntervalRef.current);
      waveIntervalRef.current = null;
    }
    setAudioWave(0);
  };

  const addBotMessage = useCallback((text: string) => {
    const newMessage: Message = {
      id: `bot-${Date.now()}`,
      text,
      sender: 'bot',
      timestamp: new Date(),
      language: selectedLanguage
    };
    setMessages(prev => [...prev, newMessage]);
  }, [selectedLanguage]);

  const addUserMessage = useCallback((text: string, isVoice = false) => {
    const newMessage: Message = {
      id: `user-${Date.now()}`,
      text,
      sender: 'user',
      timestamp: new Date(),
      language: selectedLanguage,
      isVoice
    };
    setMessages(prev => [...prev, newMessage]);
  }, [selectedLanguage]);

  const generateBotResponse = useCallback((userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    const responses = {
      en: {
        weather: "Current weather conditions are ideal for farming. Temperature: 28°C, Humidity: 65%, Light winds. Perfect for most agricultural activities. Would you like specific crop recommendations for this weather?",
        crops: "For the current season, I recommend: Rice (high demand), Cotton (good prices), Wheat (stable market), Sugarcane (profitable). Each has specific soil and climate requirements. Which crop interests you most?",
        irrigation: "Smart irrigation tips: Water early morning (5-7 AM) or evening (6-8 PM). Check soil moisture 2-3 inches deep. Drip irrigation saves 30-50% water. Your current soil moisture looks optimal!",
        price: "Current market prices: Rice ₹2,450/quintal (+₹50), Wheat ₹2,100/quintal, Cotton ₹5,800/quintal (+₹100). Prices are trending upward. Good time to sell rice and cotton!",
        fertilizer: "Based on soil analysis: Use NPK 19:19:19 for balanced nutrition. Apply organic compost for soil health. Current soil pH is good. Apply fertilizers during cool hours for better absorption.",
        pest: "Common pest control: Use neem oil spray (5ml/liter) for general pests. Yellow sticky traps for aphids. Crop rotation prevents soil-borne pests. Upload plant photos for specific disease identification.",
        default: "I'm here to help with farming questions! I can assist with weather forecasts, crop recommendations, irrigation advice, market prices, pest control, and much more. What specific farming topic interests you?"
      },
      hi: {
        weather: "वर्तमान मौसम खेती के लिए आदर्श है। तापमान: 28°C, आर्द्रता: 65%, हल्की हवा। अधिकांश कृषि गतिविधियों के लिए उत्तम। क्या आपको इस मौसम के लिए विशिष्ट फसल सुझाव चाहिए?",
        crops: "वर्तमान मौसम के लिए सुझाव: धान (अच्छी मांग), कपास (अच्छे भाव), गेहूं (स्थिर बाजार), गन्ना (लाभकारी)। हर फसल की अपनी मिट्टी और जलवायु आवश्यकताएं हैं। कौन सी फसल में रुचि है?",
        irrigation: "स्मार्ट सिंचाई तकनीक: सुबह (5-7 बजे) या शाम (6-8 बजे) पानी दें। मिट्टी की नमी 2-3 इंच गहराई में जांचें। ड्रिप सिंचाई 30-50% पानी बचाती है। आपकी मिट्टी की नमी अच्छी लग रही है!",
        price: "वर्तमान बाजार भाव: धान ₹2,450/क्विंटल (+₹50), गेहूं ₹2,100/क्विंटल, कपास ₹5,800/क्विंटल (+₹100)। भाव बढ़ रहे हैं। धान और कपास बेचने का अच्छा समय!",
        fertilizer: "मिट्टी विश्लेषण के आधार पर: संतुलित पोषण के लिए NPK 19:19:19 का उपयोग करें। मिट्टी के स्वास्थ्य के लिए जैविक खाद। मिट्टी का pH अच्छा है। बेहतर अवशोषण के लिए ठंडे समय में उर्वरक डालें।",
        pest: "सामान्य कीट नियंत्रण: सामान्य कीटों के लिए नीम तेल स्प्रे (5ml/लीटर)। माहू के लिए पीले चिपचिपे जाल। फसल चक्र मिट्टी के कीटों से बचाता है। विशिष्ट रोग पहचान के लिए पौधे की फोटो अपलोड करें।",
        default: "मैं खेती के सवालों में मदद के लिए यहां हूं! मैं मौसम पूर्वानुमान, फसल सुझाव, सिंचाई सलाह, बाजार भाव, कीट नियंत्रण में सहायता कर सकता हूं। कौन सा कृषि विषय दिलचस्प है?"
      },
      te: {
        weather: "ప్రస్తుత వాతావరణ పరిస్థితులు వ్యవసాయానికి అనుకూలంగా ఉన్నాయి। ఉష్ణోగ్రత: 28°C, తేమ: 65%, తేలికపాటి గాలులు। చాలా వ్యవసాయ కార్యకలాపాలకు అద్భుతం. ఈ వాతావరణానికి నిర్దిష్ట పంట సిఫార్సులు కావాలా?",
        crops: "ప్రస్తుత సీజన్‌కు సిఫార్సులు: వరి (మంచి డిమాండ్), పత్తి (మంచి ధరలు), గోధుమ (స్థిరమైన మార్కెట్), చెరకు (లాభదాయకం). ప్రతి పంటకు నిర్దిష్ట మట్టి మరియు వాతావరణ అవసరాలు ఉన్నాయి. ఏ పంట మీకు ఆసక్తికరంగా ఉంది?",
        irrigation: "స్మార్ట్ నీటిపారుదల చిట్కాలు: ఉదయం (5-7 గంటలు) లేదా సాయంత్రం (6-8 గంటలు) నీరు పెట్టండి. మట్టి తేమను 2-3 అంగుళాల లోతులో తనిఖీ చేయండి. డ్రిప్ ఇర్రిగేషన్ 30-50% నీరు ఆదా చేస్తుంది. మీ మట్టి తేమ అనుకూలంగా కనిపిస్తోంది!",
        price: "ప్రస్తుత మార్కెట్ ధరలు: వరి ₹2,450/క్వింటల్ (+₹50), గోధుమ ₹2,100/క్వింటల్, పత్తి ₹5,800/క్వింటల్ (+₹100). ధరలు పెరుగుతున్నాయి. వరి మరియు పత్తి అమ్మడానికి మంచి సమయం!",
        fertilizer: "మట్టి విశ్లేషణ ఆధారంగా: సమతుల్య పోషణ కోసం NPK 19:19:19 ఉపయోగించండి. మట్టి ఆరోగ్యం కోసం సేంద్రీయ కంపోస్ట్ వేయండి. ప్రస్తుత మట్టి pH మంచిది. మంచి శోషణ కోసం చల్లని సమయాల్లో ఎరువులు వేయండి.",
        pest: "సాధారణ కీటక నియంత్రణ: సాధారణ కీటకాలకు వేప నూనె స్ప్రే (5ml/లీటర్). అఫిడ్స్‌కు పసుపు అంటుకునే ట్రాప్‌లు. పంట మార్పిడి మట్టిలోని కీటకాలను నివారిస్తుంది. నిర్దిష్ట వ్యాధి గుర్తింపు కోసం మొక్క ఫోటోలను అప్‌లోడ్ చేయండి.",
        default: "నేను వ్యవసాయ ప్రశ్నలతో సహాయం చేయడానికి ఇక్కడ ఉన్నాను! నేను వాతావరణ అంచనాలు, పంట సిఫార్సులు, నీటిపారుదల సలహా, మార్కెట్ ధరలు, కీటక నియంత్రణలో సహాయం చేయగలను. ఏ నిర్దిష్ట వ్యవసాయ అంశం మీకు ఆసక్తికరంగా ఉంది?"
      }
    };

    const currentResponses = responses[selectedLanguage] || responses.en;

    if (lowerMessage.includes('weather') || lowerMessage.includes('मौसम') || lowerMessage.includes('వాతావరణం')) {
      return currentResponses.weather;
    }
    if (lowerMessage.includes('crop') || lowerMessage.includes('फसल') || lowerMessage.includes('పంట')) {
      return currentResponses.crops;
    }
    if (lowerMessage.includes('water') || lowerMessage.includes('irrigation') || lowerMessage.includes('सिंचाई') || lowerMessage.includes('నీటిపారుదల')) {
      return currentResponses.irrigation;
    }
    if (lowerMessage.includes('price') || lowerMessage.includes('market') || lowerMessage.includes('भाव') || lowerMessage.includes('ధర')) {
      return currentResponses.price;
    }
    if (lowerMessage.includes('fertilizer') || lowerMessage.includes('उर्वरक') || lowerMessage.includes('ఎరువు')) {
      return currentResponses.fertilizer;
    }
    if (lowerMessage.includes('pest') || lowerMessage.includes('disease') || lowerMessage.includes('कीट') || lowerMessage.includes('కీటక')) {
      return currentResponses.pest;
    }

    return currentResponses.default;
  }, [selectedLanguage]);

  const speakText = useCallback((text: string) => {
    if (speakerMuted || !('speechSynthesis' in window)) return;

    setIsSpeaking(true);
    
    try {
      // Cancel any ongoing speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentLanguage.speechLang;
      utterance.rate = 0.9;
      utterance.volume = 0.8;
      
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Speech synthesis error:', error);
      setIsSpeaking(false);
    }
  }, [speakerMuted, currentLanguage.speechLang]);

  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim() || isTyping) return;

    const currentInput = inputMessage.trim();
    setInputMessage('');
    addUserMessage(currentInput);
    setIsTyping(true);

    // Simulate realistic typing delay
    setTimeout(() => {
      const response = generateBotResponse(currentInput);
      addBotMessage(response);
      setIsTyping(false);
      
      // Speak the response
      speakText(response);
    }, 1000 + Math.random() * 2000);
  }, [inputMessage, isTyping, addUserMessage, addBotMessage, generateBotResponse, speakText]);

  const startVoiceRecognition = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      startAudioWave();
      try {
        recognitionRef.current.lang = currentLanguage.speechLang;
        recognitionRef.current.start();
      } catch (error) {
        console.error('Voice recognition error:', error);
        setIsListening(false);
        stopAudioWave();
      }
    }
  }, [isListening, currentLanguage.speechLang]);

  const stopVoiceRecognition = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      stopAudioWave();
    }
  }, []);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 left-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-16 h-16 shadow-lg bg-blue-600 hover:bg-blue-700 animate-pulse"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 z-50 w-96 h-[600px] flex flex-col">
      <Card className="shadow-xl h-full flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 flex-shrink-0 bg-blue-600 text-white rounded-t-lg">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Voice Assistant
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 text-xs">
                {currentLanguage.flag} {currentLanguage.name}
              </Badge>
              {isSpeaking && (
                <Badge className="bg-green-100 text-green-800 text-xs">
                  Speaking...
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSpeakerMuted(!speakerMuted)}
              className="h-8 w-8 p-0 text-white hover:bg-blue-700"
              title={speakerMuted ? 'Unmute Speaker' : 'Mute Speaker'}
            >
              {speakerMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0 text-white hover:bg-blue-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
          {/* Language Selector */}
          <div className="p-3 border-b bg-gray-50">
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <span className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[380px]">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.sender === 'user' ? 'bg-blue-600' : 'bg-gray-200'
                }`}>
                  {message.sender === 'user' ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Bot className="h-4 w-4 text-gray-600" />
                  )}
                </div>
                <div
                  className={`max-w-[75%] p-3 rounded-lg text-sm leading-relaxed ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-gray-100 text-gray-900 rounded-tl-none'
                  }`}
                >
                  {message.text}
                  {message.isVoice && (
                    <Mic className="h-3 w-3 inline ml-1 opacity-70" />
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-gray-600" />
                </div>
                <div className="bg-gray-100 text-gray-900 p-3 rounded-lg rounded-tl-none text-sm">
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
          <div className="p-4 border-t bg-gray-50 flex-shrink-0">
            {isListening && (
              <div className="mb-2 flex items-center justify-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 bg-red-500 rounded-full transition-all duration-200 ${
                        audioWave === i ? 'h-6' : 'h-2'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-red-600 text-sm font-medium">Listening...</span>
              </div>
            )}
            
            <div className="flex gap-2">
              <Input
                placeholder={`Ask in ${currentLanguage.name}...`}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
                disabled={isTyping}
              />
              <Button
                size="sm"
                onClick={handleSendMessage}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={!inputMessage.trim() || isTyping}
              >
                <Send className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={isListening ? stopVoiceRecognition : startVoiceRecognition}
                disabled={!recognitionRef.current || isTyping}
                className={isListening ? 'bg-red-50 border-red-200' : ''}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceChatbot;
