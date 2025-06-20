import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, X, Mic, Send, MicOff, Languages } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation, Language } from '@/utils/i18n';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isVoice?: boolean;
}

const ChatbotAdvanced = () => {
  const { language, user, isOnline, setLanguage } = useApp();
  const { t } = useTranslation(language as Language);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' }
  ];

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      try {
        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognitionAPI();
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
      } catch (error) {
        console.log('Speech recognition not available:', error);
      }
    }
  }, [language]);

  // Auto-scroll to bottom with smooth behavior
  useEffect(() => {
    if (messagesEndRef.current && messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, isTyping]);

  // Reset messages when language changes and add new greeting
  useEffect(() => {
    if (isOpen && language) {
      const greetings = {
        en: `Hello ${user?.name || 'Farmer'}! I'm your AgroGuard assistant. I can help you with farming questions, weather information, market prices, crop diseases, irrigation advice, and much more. What would you like to know?`,
        hi: `नमस्ते ${user?.name || 'किसान जी'}! मैं आपका एग्रोगार्ड सहायक हूं। मैं आपकी कृषि के सवालों, मौसम की जानकारी, बाजार भाव, फसल की बीमारियों, सिंचाई की सलाह और बहुत कुछ में मदद कर सकता हूं। आप क्या जानना चाहते हैं?`,
        te: `హలో ${user?.name || 'రైతు గారు'}! నేను మీ అగ్రోగార్డ్ సహాయకుడిని। నేను మీకు వ్యవసాయ ప్రశ్నలు, వాతావరణ సమాచారం, మార్కెట్ ధరలు, పంట వ్యాధులు, నీటిపారుదల సలహా మరియు మరిన్నింటిలో సహాయం చేయగలను। మీరు ఏమి తెలుసుకోవాలనుకుంటున్నారు?`
      };

      setMessages([{
        id: 'greeting',
        text: greetings[language] || greetings.en,
        sender: 'bot',
        timestamp: new Date()
      }]);
    }
  }, [isOpen, language, user?.name]);

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

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    setShowLanguageMenu(false);
    
    // Add a system message about language change
    const languageChangeMessages = {
      en: "Language changed to English. How can I help you?",
      hi: "भाषा हिंदी में बदल दी गई। मैं आपकी कैसे मदद कर सकता हूं?",
      te: "భాష తెలుగులోకి మార్చబడింది. నేను మీకు ఎలా సహాయం చేయగలను?"
    };
    
    setTimeout(() => {
      addBotMessage(languageChangeMessages[newLanguage] || languageChangeMessages.en);
    }, 500);
  };

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    const responses = {
      en: {
        weather: "Current weather: Temperature 28°C, Humidity 65%, Light winds. Perfect conditions for most crops! The forecast shows good farming weather for the next 3 days. Would you like specific recommendations for your crops?",
        price: "Current market prices (updated 1 hour ago): Rice ₹2,450/quintal (+₹50 from yesterday), Wheat ₹2,100/quintal (-₹25), Cotton ₹5,800/quintal (+₹100), Sugarcane ₹280/quintal. Prices are showing positive trends. Would you like price alerts?",
        irrigation: "Your soil moisture is at 65% - this is optimal! No immediate irrigation needed. The system will alert you when moisture drops below 30%. For best results, maintain moisture between 60-80% during growing season.",
        disease: "To detect plant diseases, please upload a clear photo of the affected plant leaves or describe the symptoms you're seeing (yellowing, spots, wilting, etc.). I can identify common diseases like blight, rust, powdery mildew, and suggest organic treatments.",
        drone: "Drone status: Last patrol completed 2 hours ago with 95% field coverage. No issues detected. Available services: crop monitoring, pest detection, fertilizer spraying, irrigation mapping. Would you like to schedule a new patrol or view the last scan results?",
        sensors: "IoT Sensor Status: All 8 sensors online and functioning. Soil moisture: 65% (optimal), Temperature: 28°C (good), Water tank: 85% full, pH levels: 6.8 (ideal). All parameters are within optimal ranges for crop growth.",
        contracts: "Available farming contracts in your area: Cotton cultivation (5 acres, ₹50,000), Organic vegetable farming (2 acres, ₹25,000), Rice farming (10 acres, ₹80,000). All contracts include seeds, fertilizers, and guaranteed buyback. Which interests you?",
        fertilizer: "Based on your soil analysis, I recommend: NPK 10:26:26 for flowering stage, Urea for nitrogen boost, Organic compost for soil health. Current soil pH is 6.8 - perfect for most crops. Apply fertilizers early morning or evening for best absorption.",
        shopping: "Our farming shop offers: Premium seeds (₹500-1200/kg), Organic fertilizers (₹800-1500/bag), Bio-pesticides (₹600-2000/L), Tools (₹200-5000), Irrigation equipment (₹150-3000/meter). Free delivery on orders above ₹2000. What do you need?",
        emergency: "For farming emergencies: Fire outbreak - Call 101, Animal intrusion - Contact forest dept, Crop disease outbreak - Upload photos for instant diagnosis, Equipment breakdown - Our service team available 24/7. What's your emergency?",
        default: "I'm here to help with all your farming needs! I can assist with: weather forecasts, market prices, crop diseases, irrigation advice, fertilizer recommendations, pest control, contract farming, equipment guidance, and emergency support. What specific information do you need?"
      },
      hi: {
        weather: "वर्तमान मौसम: तापमान 28°C, आर्द्रता 65%, हल्की हवा। अधिकांश फसलों के लिए उत्तम स्थितियां! अगले 3 दिन मौसम खेती के लिए अच्छा रहेगा। क्या आपको अपनी फसलों के लिए विशिष्ट सुझाव चाहिए?",
        price: "वर्तमान बाजार भाव (1 घंटे पहले अपडेट): चावल ₹2,450/क्विंटल (+₹50 कल से), गेहूं ₹2,100/क्विंटल (-₹25), कपास ₹5,800/क्विंटल (+₹100), गन्ना ₹280/क्विंटल। भाव अच्छे चल रहे हैं। क्या आपको भाव अलर्ट चाहिए?",
        irrigation: "आपकी मिट्टी में नमी 65% है - यह उत्तम है! अभी सिंचाई की जरूरत नहीं। जब नमी 30% से नीचे गिरेगी तो सिस्टम अलर्ट करेगा। बेहतर परिणाम के लिए बढ़ते मौसम में 60-80% नमी बनाए रखें।",
        disease: "पौधों की बीमारी पहचानने के लिए, प्रभावित पत्तियों की साफ फोटो अपलोड करें या लक्षण बताएं (पीलापन, धब्बे, मुरझाना आदि)। मैं सामान्य बीमारियां जैसे झुलसा, किट्ट, फफूंद पहचान सकता हूं और जैविक इलाज सुझा सकता हूं।",
        drone: "ड्रोन स्थिति: 2 घंटे पहले 95% खेत कवरेज के साथ अंतिम गश्त पूरी। कोई समस्या नहीं मिली। उपलब्ध सेवाएं: फसल निगरानी, कीट पहचान, उर्वरक छिड़काव, सिंचाई मैपिंग। नई गश्त शेड्यूल करना चाहते हैं?",
        sensors: "IoT सेंसर स्थिति: सभी 8 सेंसर ऑनलाइन। मिट्टी की नमी: 65% (उत्तम), तापमान: 28°C (अच्छा), पानी की टंकी: 85% भरी, pH स्तर: 6.8 (आदर्श)। सभी पैरामीटर फसल वृद्धि के लिए उत्तम सीमा में हैं।",
        contracts: "आपके क्षेत्र में उपलब्ध कृषि अनुबंध: कपास की खेती (5 एकड़, ₹50,000), जैविक सब्जी की खेती (2 एकड़, ₹25,000), धान की खेती (10 एकड़, ₹80,000)। सभी अनुबंधों में बीज, उर्वरक और गारंटीशुदा खरीद शामिल है। कौन सा दिलचस्प है?",
        fertilizer: "आपके मिट्टी विश्लेषण के आधार पर सुझाव: फूल आने के लिए NPK 10:26:26, नाइट्रोजन बूस्ट के लिए यूरिया, मिट्टी के स्वास्थ्य के लिए जैविक खाद। वर्तमान मिट्टी pH 6.8 है - अधिकांश फसलों के लिए उत्तम। बेहतर अवशोषण के लिए सुबह या शाम उर्वरक डालें।",
        shopping: "हमारी कृषि दुकान में: प्रीमियम बीज (₹500-1200/किलो), जैविक उर्वरक (₹800-1500/बैग), जैव-कीटनाशक (₹600-2000/लीटर), उपकरण (₹200-5000), सिंचाई उपकरण (₹150-3000/मीटर)। ₹2000 से ऊपर मुफ्त डिलीवरी। आपको क्या चाहिए?",
        emergency: "कृषि आपातकाल के लिए: आग लगने पर 101 कॉल करें, जानवरों के आक्रमण पर वन विभाग से संपर्क करें, फसल की बीमारी के लिए तुरंत फोटो अपलोड करें, उपकरण खराब होने पर हमारी सेवा टीम 24/7 उपलब्ध। आपकी क्या आपातकालीन स्थिति है?",
        default: "मैं आपकी सभी कृषि जरूरतों में मदद के लिए यहां हूं! मैं इनमें सहायता कर सकता हूं: मौसम पूर्वानुमान, बाजार भाव, फसल की बीमारियां, सिंचाई सलाह, उर्वरक सुझाव, कीट नियंत्रण, अनुबंध खेती, उपकरण मार्गदर्शन और आपातकालीन सहायता। आपको क्या विशिष्ट जानकारी चाहिए?"
      },
      te: {
        weather: "ప్రస్తుత వాతావరణం: ఉష్ణోగ్రత 28°C, తేమ 65%, తేలికపాటి గాలులు। చాలా పంటలకు అద్భుతమైన పరిస్థితులు! రాబోయే 3 రోజులు వ్యవసాయానికి మంచి వాతావరణం ఉంటుంది. మీ పంటలకు నిర్దిష్ట సిఫార్సులు కావాలా?",
        price: "ప్రస్తుత మార్కెట్ ధరలు (1 గంట క్రితం అప్‌డేట్): వరి ₹2,450/క్వింటల్ (నిన్న నుండి +₹50), గోధుమ ₹2,100/క్వింటల్ (-₹25), పత్తి ₹5,800/క్వింటల్ (+₹100), చెరకు ₹280/క్వింటల్. ధరలు మంచి ట్రెండ్ చూపుతున్నాయి. ధర అలర్ట్‌లు కావాలా?",
        irrigation: "మీ మట్టిలో తేమ 65% ఉంది - ఇది అనుకూలమైనది! ఇప్పుడు నీటిపారుదల అవసరం లేదు। తేమ 30% కంటే తక్కువగా ఉన్నప్పుడు సిస్టమ్ అలర్ట్ చేస్తుంది। మంచి ఫలితాల కోసం, పెరుగుతున్న సీజన్‌లో 60-80% తేమను నిర్వహించండి।",
        disease: "మొక్కల వ్యాధులను గుర్తించడానికి, ప్రభావిత ఆకుల స్పష్టమైన ఫోటోను అప్‌లోడ్ చేయండి లేదా మీరు చూస్తున్న లక్షణాలను వివరించండి (పసుపు రంగు, మచ్చలు, వాడిపోవడం మొదలైనవి). నేను సాధారణ వ్యాధులైన బ్లైట్, రస్ట్, పౌడరీ మిల్డ్యూ గుర్తించగలను మరియు సేంద్రీయ చికిత్సలను సూచించగలను।",
        drone: "డ్రోన్ స్థితి: 95% పొలం కవరేజీతో 2 గంటల క్రితం చివరి పెట్రోలింగ్ పూర్తయింది. ఎటువంటి సమస్యలు కనుగొనబడలేదు. అందుబాటులో ఉన్న సేవలు: పంట పర్యవేక్షణ, పెస్ట్ డిటెక్షన్, ఎరువుల స్ప్రేయింగ్, ఇర్రిగేషన్ మ్యాపింగ్. కొత్త పెట్రోలింగ్ షెడ్యూల్ చేయాలనుకుంటున్నారా?",
        sensors: "IoT సెన్సార్ స్థితి: అన్ని 8 సెన్సార్లు ఆన్‌లైన్‌లో మరియు పనిచేస్తున్నాయి। మట్టి తేమ: 65% (అనుకూలం), ఉష్ణోగ్రత: 28°C (మంచిది), నీటి ట్యాంక్: 85% నిండింది, pH స్థాయిలు: 6.8 (ఆదర్శం). అన్ని పారామీటర్లు పంట పెరుగుదలకు అనుకూల పరిధుల్లో ఉన్నాయి।",
        contracts: "మీ ప్రాంతంలో అందుబాటులో ఉన్న వ్యవసాయ ఒప్పందాలు: పత్తి సాగు (5 ఎకరాలు, ₹50,000), సేంద్రీయ కూరగాయల వ్యవసాయం (2 ఎకరాలు, ₹25,000), వరి వ్యవసాయం (10 ఎకరాలు, ₹80,000). అన్ని ఒప్పందాలలో విత్తనాలు, ఎరువులు మరియు హామీతో కూడిన కొనుగోలు ఉంటాయి. ఏది మీకు ఆసక్తికరంగా ఉంది?",
        fertilizer: "మీ మట్టి విశ్లేషణ ఆధారంగా నేను సిఫార్సు చేస్తున్నాను: పుష్పించే దశకు NPK 10:26:26, నత్రజని బూస్ట్ కోసం యూరియా, మట్టి ఆరోగ్యం కోసం సేంద్రీయ కంపోస్ట్. ప్రస్తుత మట్టి pH 6.8 - చాలా పంటలకు పర్ఫెక్ట్. మంచి శోషణ కోసం ఉదయం లేదా సాయంత్రం ఎరువులు వేయండి।",
        shopping: "మా వ్యవసాయ దుకాణం అందిస్తుంది: ప్రీమియం విత్తనాలు (₹500-1200/కిలో), సేంద్రీయ ఎరువులు (₹800-1500/బ్యాగ్), బయో-పెస్టిసైడ్స్ (₹600-2000/లీటర్), టూల్స్ (₹200-5000), నీటిపారుదల పరికరాలు (₹150-3000/మీటర్). ₹2000 మీద ఆర్డర్లకు ఉచిత డెలివరీ. మీకు ఏమి కావాలి?",
        emergency: "వ్యవసాయ అత్యవసర పరిస్థితుల కోసం: అగ్ని ప్రకోపం - 101కు కాల్ చేయండి, జంతువుల చొరబాటు - అటవీ శాఖను సంప్రదించండి, పంట వ్యాధి వ్యాప్తి - తక్షణ నిర్ధారణ కోసం ఫోటోలు అప్‌లోడ్ చేయండి, పరికరాల వైఫల్యం - మా సేవా బృందం 24/7 అందుబాటులో ఉంది. మీ అత్యవసర పరిస్థితి ఏమిటి?",
        default: "నేను మీ అన్ని వ్యవసాయ అవసరాలతో సహాయం చేయడానికి ఇక్కడ ఉన్నాను! నేను వీటితో సహాయం చేయగలను: వాతావరణ అంచనాలు, మార్కెట్ ధరలు, పంట వ్యాధులు, నీటిపారుదల సలహా, ఎరువుల సిఫార్సులు, పెస్ట్ కంట్రోల్, కాంట్రాక్ట్ ఫార్మింగ్, పరికరాల మార్గదర్శకత్వం మరియు అత్యవసర మద్దతు. మీకు ఏ నిర్దిష్ట సమాచారం కావాలి?"
      }
    };

    const currentResponses = responses[language] || responses.en;

    // Enhanced keyword matching for better responses
    if (lowerMessage.includes('weather') || lowerMessage.includes('मौसम') || lowerMessage.includes('వాతావరణం') || lowerMessage.includes('temperature') || lowerMessage.includes('rain')) {
      return currentResponses.weather;
    }
    if (lowerMessage.includes('price') || lowerMessage.includes('भाव') || lowerMessage.includes('ధర') || lowerMessage.includes('market') || lowerMessage.includes('cost')) {
      return currentResponses.price;
    }
    if (lowerMessage.includes('water') || lowerMessage.includes('irrigation') || lowerMessage.includes('सिंचाई') || lowerMessage.includes('నీటిపారుదల') || lowerMessage.includes('moisture')) {
      return currentResponses.irrigation;
    }
    if (lowerMessage.includes('disease') || lowerMessage.includes('बीमारी') || lowerMessage.includes('వ్యాధి') || lowerMessage.includes('sick') || lowerMessage.includes('problem')) {
      return currentResponses.disease;
    }
    if (lowerMessage.includes('drone') || lowerMessage.includes('ड्रोन') || lowerMessage.includes('డ్రోన్') || lowerMessage.includes('patrol') || lowerMessage.includes('monitor')) {
      return currentResponses.drone;
    }
    if (lowerMessage.includes('sensor') || lowerMessage.includes('सेंसर') || lowerMessage.includes('సెన్సర్') || lowerMessage.includes('iot') || lowerMessage.includes('data')) {
      return currentResponses.sensors;
    }
    if (lowerMessage.includes('contract') || lowerMessage.includes('अनुबंध') || lowerMessage.includes('ఒప్పందం') || lowerMessage.includes('farming contract')) {
      return currentResponses.contracts;
    }
    if (lowerMessage.includes('fertilizer') || lowerMessage.includes('उर्वरक') || lowerMessage.includes('ఎరువు') || lowerMessage.includes('nutrient') || lowerMessage.includes('soil')) {
      return currentResponses.fertilizer;
    }
    if (lowerMessage.includes('buy') || lowerMessage.includes('shop') || lowerMessage.includes('purchase') || lowerMessage.includes('दुकान') || lowerMessage.includes('దుకాణం')) {
      return currentResponses.shopping;
    }
    if (lowerMessage.includes('emergency') || lowerMessage.includes('help') || lowerMessage.includes('urgent') || lowerMessage.includes('आपातकाल') || lowerMessage.includes('అత్యవసర')) {
      return currentResponses.emergency;
    }

    return currentResponses.default;
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    addUserMessage(inputMessage);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    // Simulate realistic typing delay based on response length
    setTimeout(() => {
      const response = generateBotResponse(currentInput);
      addBotMessage(response);
      setIsTyping(false);
      
      // Text-to-speech for bot responses (if available)
      if (typeof window !== 'undefined' && 'speechSynthesis' in window && isOnline) {
        try {
          const utterance = new SpeechSynthesisUtterance(response);
          utterance.lang = language === 'hi' ? 'hi-IN' : language === 'te' ? 'te-IN' : 'en-US';
          utterance.rate = 0.8;
          utterance.volume = 0.7;
          speechSynthesis.speak(utterance);
        } catch (error) {
          console.log('Text-to-speech not available:', error);
        }
      }
    }, 1500 + Math.random() * 1500);
  };

  const startVoiceRecognition = () => {
    if (recognitionRef.current && isOnline) {
      try {
        setIsListening(true);
        recognitionRef.current.start();
      } catch (error) {
        console.log('Speech recognition error:', error);
        setIsListening(false);
      }
    }
  };

  const stopVoiceRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
      } catch (error) {
        console.log('Speech recognition stop error:', error);
        setIsListening(false);
      }
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
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[500px]">
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
          <div className="flex items-center gap-1">
            {/* Language Toggle Button */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className="h-8 w-8 p-0"
                title="Change Language"
              >
                <Languages className="h-4 w-4" />
              </Button>
              
              {/* Language Dropdown Menu */}
              {showLanguageMenu && (
                <div className="absolute top-8 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full text-left px-3 py-2 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg flex items-center gap-2 text-sm ${
                        language === lang.code ? 'bg-green-50 text-green-600' : 'text-gray-700'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span className="truncate">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col space-y-4 overflow-hidden p-4">
          {/* Messages Area */}
          <div 
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto space-y-3 min-h-0 scroll-smooth"
            style={{ scrollBehavior: 'smooth' }}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-lg text-sm leading-relaxed ${
                    message.sender === 'user'
                      ? 'bg-green-600 text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-900 rounded-bl-sm'
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
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 p-3 rounded-lg rounded-bl-sm text-sm">
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
              disabled={!isOnline || !recognitionRef.current}
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
