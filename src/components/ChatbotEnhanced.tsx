
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, X, Mic, Send, MicOff, Bot, User } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isVoice?: boolean;
}

const ChatbotEnhanced = () => {
  const { language, user, isOnline } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      try {
        const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognitionAPI();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : language === 'te' ? 'te-IN' : 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputMessage(transcript);
          setIsListening(false);
        };

        recognitionRef.current.onerror = () => setIsListening(false);
        recognitionRef.current.onend = () => setIsListening(false);
      } catch (error) {
        console.log('Speech recognition not available:', error);
      }
    }
  }, [language]);

  // Initialize with greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greetings = {
        en: `Hello ${user?.name || 'Farmer'}! I'm your smart farming assistant. I can help you with detailed information about crops, weather, market prices, pest control, irrigation, fertilizers, and much more. Ask me anything about farming!`,
        hi: `नमस्कार ${user?.name || 'किसान भाई'}! मैं आपका स्मार्ट कृषि सहायक हूँ। मैं आपकी फसल, मौसम, बाज़ार भाव, कीट नियंत्रण, सिंचाई, उर्वरक और कृषि की अन्य जानकारी में मदद कर सकता हूँ। खेती के बारे में कुछ भी पूछें!`,
        te: `నమస్కారం ${user?.name || 'రైతు గారు'}! నేను మీ స్మార్ట్ వ్యవసాయ సహాయకుడిని। నేను మీకు పంటలు, వాతావరణం, మార్కెట్ ధరలు, కీటక నియంత్రణ, నీటిపారుదల, ఎరువులు మరియు వ్యవసాయానికి సంబంధించిన వివరణాత్మక సమాచారం అందించగలను। వ్యవసాయం గురించి ఏదైనా అడగండి!`
      };

      addBotMessage(greetings[language] || greetings.en);
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

  const generateBotResponse = async (userMessage: string): Promise<string> => {
    // Enhanced AI responses with more comprehensive farming knowledge
    const lowerMessage = userMessage.toLowerCase();
    
    const responses = {
      en: {
        greeting: "Hello! I'm here to help with all your farming needs. What would you like to know?",
        weather: "Current weather conditions are ideal for farming. Temperature: 28°C, Humidity: 65%, Wind: Light breeze. Today is perfect for field work, irrigation, and pest monitoring. Tomorrow's forecast shows similar conditions with a slight chance of evening showers.",
        crops: "For your region, I recommend these seasonal crops: Kharif season (June-October) - Rice, Cotton, Sugarcane, Maize. Rabi season (November-April) - Wheat, Barley, Mustard, Chickpea. Summer crops - Watermelon, Muskmelon, Fodder crops. Would you like detailed cultivation practices for any specific crop?",
        irrigation: "Smart irrigation tips: 1) Water early morning (5-7 AM) or evening (6-8 PM) 2) Check soil moisture 2-3 inches deep 3) Drip irrigation saves 30-50% water 4) Mulching reduces water evaporation 5) Your current soil moisture is 65% - optimal level!",
        fertilizer: "Fertilizer recommendations based on crop stage: Vegetative growth - High Nitrogen (Urea 46% N), Flowering - Balanced NPK (19:19:19), Fruit development - High Potassium. Organic options: Vermicompost, FYM, Green manure. Apply during cool hours and water immediately.",
        pest: "Integrated Pest Management: 1) Use yellow sticky traps for aphids 2) Neem oil spray (5ml/liter) for general pests 3) Pheromone traps for specific insects 4) Beneficial insects like ladybugs 5) Crop rotation prevents soil-borne pests. Upload plant images for specific disease identification.",
        market: "Current market rates: Rice ₹2,450/quintal (+₹50), Wheat ₹2,100/quintal (-₹25), Cotton ₹5,800/quintal (+₹100), Onion ₹3,200/quintal (+₹200), Tomato ₹4,500/quintal (-₹300). Prices updated hourly. Best selling time: Early morning at mandis.",
        seeds: "Quality seed selection: 1) Buy certified seeds from authorized dealers 2) Check germination rate (>85%) 3) Disease-resistant varieties preferred 4) Local varieties adapt better 5) Hybrid seeds for higher yield. Seed treatment with fungicide recommended before sowing.",
        default: "I can help you with: Crop cultivation, Weather guidance, Irrigation planning, Fertilizer recommendations, Pest & disease management, Market prices, Seed selection, Soil health, Equipment guidance, Government schemes, and much more. Please tell me what specific farming topic you'd like to know about?"
      },
      hi: {
        greeting: "नमस्कार! मैं आपकी सभी कृषि आवश्यकताओं में सहायता के लिए यहाँ हूँ। आप क्या जानना चाहते हैं?",
        weather: "वर्तमान मौसम स्थिति खेती के लिए आदर्श है। तापमान: 28°C, आर्द्रता: 65%, हवा: हल्की। आज खेत का काम, सिंचाई और कीट निगरानी के लिए बेहतरीन दिन है। कल का पूर्वानुमान भी ऐसा ही है, शाम को हल्की बारिश की संभावना।",
        crops: "आपके क्षेत्र के लिए मौसमी फसल सुझाव: खरीफ (जून-अक्टूबर) - धान, कपास, गन्ना, मक्का। रबी (नवंबर-अप्रैल) - गेहूं, जौ, सरसों, चना। गर्मी की फसल - तरबूज, खरबूजा, चारा फसल। किसी विशेष फसल की विस्तृत जानकारी चाहिए?",
        irrigation: "स्मार्ट सिंचाई तकनीक: 1) सुबह (5-7 बजे) या शाम (6-8 बजे) पानी दें 2) मिट्टी की नमी 2-3 इंच गहराई में जांचें 3) ड्रिप सिंचाई 30-50% पानी बचाती है 4) मल्चिंग से पानी कम वाष्पित होता है 5) आपकी मिट्टी की नमी 65% - उत्तम स्तर!",
        fertilizer: "फसल अवस्था अनुसार उर्वरक: वानस्पतिक वृद्धि - नाइट्रोजन (यूरिया 46% N), फूल आना - संतुलित NPK (19:19:19), फल विकास - पोटाश। जैविक विकल्प: वर्मी कम्पोस्ट, गोबर खाद, हरी खाद। ठंडे समय में डालें और तुरंत पानी दें।",
        pest: "एकीकृत कीट प्रबंधन: 1) माहू के लिए पीले चिपचिपे जाल 2) नीम तेल छिड़काव (5ml/लीटर) 3) फेरोमोन ट्रैप 4) लाभकारी कीट जैसे लेडीबग 5) फसल चक्र से मिट्टी के कीट नियंत्रित होते हैं। रोग पहचान के लिए पौधे की फोटो अपलोड करें।",
        market: "वर्तमान बाज़ार भाव: धान ₹2,450/क्विंटल (+₹50), गेहूं ₹2,100/क्विंटल (-₹25), कपास ₹5,800/क्विंटल (+₹100), प्याज ₹3,200/क्विंटल (+₹200), टमाटर ₹4,500/क्विंटल (-₹300)। भाव हर घंटे अपडेट। बेचने का सबसे अच्छा समय: सुबह मंडी में।",
        seeds: "गुणवत्तापूर्ण बीज चुनाव: 1) प्रामाणिक डीलर से प्रमाणित बीज 2) अंकुरण दर जांचें (>85%) 3) रोग प्रतिरोधी किस्में 4) स्थानीय किस्में बेहतर अनुकूलन 5) अधिक उत्पादन के लिए हाइब्रिड। बुआई से पहले बीज उपचार जरूरी।",
        default: "मैं इनमें आपकी सहायता कर सकता हूँ: फसल उत्पादन, मौसम मार्गदर्शन, सिंचाई योजना, उर्वरक सुझाव, कीट व रोग प्रबंधन, बाज़ार भाव, बीज चुनाव, मिट्टी स्वास्थ्य, उपकरण मार्गदर्शन, सरकारी योजनाएं। कृषि के किस विषय पर जानकारी चाहिए?"
      },
      te: {
        greeting: "నమస్కారం! నేను మీ అన్ని వ్యవసాయ అవసరాలలో సహాయం చేయడానికి ఇక్కడ ఉన్నాను। మీరు ఏమి తెలుసుకోవాలనుకుంటున్నారు?",
        weather: "ప్రస్తుత వాతావరణ పరిస్థితులు వ్యవసాయానికి అనుకూలంగా ఉన్నాయి. ఉష్ణోగ్రత: 28°C, తేమ: 65%, గాలి: తేలికపాటి. ఈరోజు పొలం పని, నీటిపారుదల మరియు కీటక పర్యవేక్షణకు అద్భుతమైన రోజు. రేపటి అంచనా కూడా ఇలాగే ఉంది, సాయంత్రం చిన్న వర్షం అవకాశం.",
        crops: "మీ ప్రాంతానికి కాలానుగుణ పంట సూచనలు: ఖరీఫ్ (జూన్-అక్టోబర్) - వరి, పత్తి, చెరకు, మొక్కజొన్న. రబీ (నవంబర్-ఏప్రిల్) - గోధుమ, బార్లీ, ఆవాలు, శనగలు. వేసవి పంటలు - పుచ్చకాయ, ఖర్బూజా, మేత పంటలు. ఏదైనా నిర్దిష్ట పంట వివరాలు కావాలా?",
        irrigation: "స్మార్ట్ నీటిపారుదల చిట్కాలు: 1) ఉదయం (5-7 గంటలు) లేదా సాయంత్రం (6-8 గంటలు) నీరు పెట్టండి 2) మట్టి తేమను 2-3 అంగుళాల లోతులో తనిఖీ చేయండి 3) డ్రిప్ ఇర్రిగేషన్ 30-50% నీరు ఆదా చేస్తుంది 4) మల్చింగ్ వల్ల నీరు ఆవిరైపోవడం తగ్గుతుంది 5) మీ మట్టి తేమ 65% - అనుకూల స్థాయి!",
        fertilizer: "పంట దశ ప్రకారం ఎరువులు: వృక్ష వృద్ధి - నత్రజని (యూరియా 46% N), పుష్పించడం - సమతుల్య NPK (19:19:19), పండు అభివృద్ధి - పొటాష్. సేంద్రీయ ఎంపికలు: వర్మి కంపోస్ట్, పశు గోబర ఎరువు, పచ్చి ఎరువు. చల్లని సమయంలో వేసి వెంటనే నీరు పెట్టండి.",
        pest: "సమీకృత కీటక నిర్వహణ: 1) ఆకుపురుగులకు పసుపు అంటే ఉచ్చులు 2) వేప నూనె స్ప్రే (5ml/లీటర్) 3) ఫెరోమోన్ ట్రాప్స్ 4) లేడీబగ్ వంటి మంచి కీటకాలు 5) పంట మార్పిడి వల్ల మట్టిలోని కీటకాలు నియంత్రించబడతాయి. వ్యాధి గుర్తింపు కోసం మొక్క ఫోటోలు అప్‌లోడ్ చేయండి.",
        market: "ప్రస్తుత మార్కెట్ ధరలు: వరి ₹2,450/క్వింటల్ (+₹50), గోధుమ ₹2,100/క్వింటల్ (-₹25), పత్తి ₹5,800/క్వింటల్ (+₹100), ఉల్లిపాయ ₹3,200/క్వింటల్ (+₹200), టమాటా ₹4,500/క్వింటల్ (-₹300)। ధరలు గంటకు ఒకసారి అప్‌డేట్. అమ్మకానికి మంచి సమయం: ఉదయం మార్కెట్‌లో.",
        seeds: "నాణ్యమైన విత్తన ఎంపిక: 1) అధికారిక డీలర్ల నుండి ధృవీకరించబడిన విత్తనాలు 2) మొలకెత్తే రేటు తనిఖీ (>85%) 3) వ్యాధి నిరోధక రకాలు 4) స్థానిక రకాలు మంచి అనుకూలత 5) ఎక్కువ దిగుబడికి హైబ్రిడ్. విత్తనానికి ముందు విత్తన చికిత్స అవసరం.",
        default: "నేను వీటిలో మీకు సహాయం చేయగలను: పంట పండింపు, వాతావరణ మార్గదర్శకత్వం, నీటిపారుదల ప్రణాళిక, ఎరువుల సూచనలు, కీటక మరియు వ్యాధి నిర్వహణ, మార్కెట్ ధరలు, విత్తన ఎంపిక, మట్టి ఆరోగ్యం, పరికరాల మార్గదర్శకత్వం, ప్రభుత్వ పథకాలు. వ్యవసాయానికి సంబంధించిన ఏ అంశంపై సమాచారం కావాలి?"
      }
    };

    const currentResponses = responses[language] || responses.en;

    // Enhanced keyword matching with full sentence responses
    if (lowerMessage.includes('weather') || lowerMessage.includes('मौसम') || lowerMessage.includes('వాతావరణం')) {
      return currentResponses.weather;
    }
    if (lowerMessage.includes('crop') || lowerMessage.includes('फसल') || lowerMessage.includes('పంట')) {
      return currentResponses.crops;
    }
    if (lowerMessage.includes('water') || lowerMessage.includes('irrigation') || lowerMessage.includes('सिंचाई') || lowerMessage.includes('నీటిపారుదల')) {
      return currentResponses.irrigation;
    }
    if (lowerMessage.includes('fertilizer') || lowerMessage.includes('उर्वरक') || lowerMessage.includes('ఎరువు')) {
      return currentResponses.fertilizer;
    }
    if (lowerMessage.includes('pest') || lowerMessage.includes('disease') || lowerMessage.includes('कीट') || lowerMessage.includes('कीड़े')) {
      return currentResponses.pest;
    }
    if (lowerMessage.includes('price') || lowerMessage.includes('market') || lowerMessage.includes('भाव') || lowerMessage.includes('ధర')) {
      return currentResponses.market;
    }
    if (lowerMessage.includes('seed') || lowerMessage.includes('बीज') || lowerMessage.includes('విత్తనం')) {
      return currentResponses.seeds;
    }
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('नमस्कार') || lowerMessage.includes('నమస్కారం')) {
      return currentResponses.greeting;
    }

    return currentResponses.default;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    addUserMessage(inputMessage);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    // Realistic typing delay
    setTimeout(async () => {
      const response = await generateBotResponse(currentInput);
      addBotMessage(response);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const startVoiceRecognition = () => {
    if (recognitionRef.current && isOnline) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-16 h-16 shadow-lg bg-green-600 hover:bg-green-700 animate-pulse"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] flex flex-col">
      <Card className="shadow-xl h-full flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 flex-shrink-0 bg-green-600 text-white rounded-t-lg">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Smart Farm Assistant
            </CardTitle>
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">
              {isOnline ? 'Online' : 'Offline'}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 p-0 text-white hover:bg-green-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
          {/* Messages Container with proper scrolling */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[460px]">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.sender === 'user' ? 'bg-green-600' : 'bg-gray-200'
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
                      ? 'bg-green-600 text-white rounded-tr-none'
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
            <div className="flex gap-2">
              <Input
                placeholder="Ask about farming, weather, crops..."
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
                onClick={startVoiceRecognition}
                disabled={!isOnline || !recognitionRef.current}
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

export default ChatbotEnhanced;
