export type Language = 'en' | 'hi' | 'te';

interface Translations {
  en: Record<string, string>;
  hi: Record<string, string>;
  te: Record<string, string>;
}

const translations: Translations = {
  en: {
    // Navigation
    welcomeToAgroGuard: "Welcome to AgroGuard",
    smartFarmingSolution: "Smart Farming Solution for the Digital Age",
    getStarted: "Get Started",
    watchDemo: "Watch Demo",
    dashboard: "Dashboard",
    services: "Services",
    market: "Market",
    support: "Support",
    profile: "Profile",
    settings: "Settings",
    signOut: "Sign Out",
    offline: "Offline",
    language: "Language",
    notifications: "Notifications",
    noNewNotifications: "No new notifications",

    // Main content
    quickStats: "Quick Stats",
    activeFields: "Active Fields",
    totalYield: "Total Yield",
    weatherAlerts: "Weather Alerts",
    selectService: "Select a Service",
    emergencySection: "Emergency & Safety",
    
    // Weather
    weatherAlert: "Severe Weather Alert",
    temperature: "Temperature",
    humidity: "Humidity",
    rainfall: "Rainfall",
    windSpeed: "Wind Speed",
    soilMoisture: "Soil Moisture",
    pestAlert: "Pest Alert",
    good: "Good",
    poor: "Poor",
    excellent: "Excellent",
    fair: "Fair",

    // Emergency actions
    emergencyCall: "Emergency Call",
    reportIssue: "Report Issue",
    
    // Services
    shopping: "Shopping",
    shopDesc: "Buy farming tools and supplies",
    browse: "Browse",
    videos: "Video Guides",
    videoDesc: "Learn farming techniques",
    smartTools: "Smart Tools",
    toolsDesc: "AI-powered farming tools",
    plan: "Plan",
    contracts: "Contracts",
    contractsDesc: "Field service contracts",
    apply: "Apply",
    back: "Back",
    servicesTitle: "Farming Services",

    // Chatbot
    chatTitle: "AgroGuard Assistant",
    online: "Online",
    chatPlaceholder: "Ask me anything about farming...",

    // Drone
    droneTitle: "Drone Monitoring",
    droneStatus: "Drone Status",
    lastScan: "Last Scan",
    coverage: "Coverage",
    issues: "Issues",
    viewLive: "View Live",

    // IoT
    lowMoisture: "Low Moisture Alert",
    
    // Services
    farmingShoppingTitle: "Farming Shopping",
    farmingShoppingDesc: "Buy farming tools and supplies",
    videoGuidesTitle: "Video Guides",
    videoGuidesDesc: "Learn farming techniques",
    marketPricesTitle: "Market Prices",
    marketPricesDesc: "Check current market rates",
    drainagePlanningTitle: "Drainage Planning",
    drainagePlanningDesc: "Plan your field drainage",
    smartDroneTitle: "Smart Drone",
    smartDroneDesc: "AI-powered drone monitoring",
    agriContractsTitle: "Agri Contracts",
    agriContractsDesc: "Field service contracts",
    plantHealthTitle: "Plant Health",
    plantHealthDesc: "Monitor plant diseases",
    aiChatbotTitle: "AI Chatbot",
    aiChatbotDesc: "Get farming assistance",
    
    // Stats
    totalFarms: "Total Farms",
    activeAlerts: "Active Alerts",
    onlineFarmers: "Online Farmers",
    todayUpdates: "Today's Updates",
    
    // Quick Actions and Updates
    quickActions: "Quick Actions",
    contactSupport: "Contact Support",
    recentUpdates: "Recent Updates",
    marketUpdate: "Market Update",
    newGuide: "New Guide Available",
    
    // Services content
    backToServices: "Back to Services",
    farmingServices: "Farming Services",
    featureComingSoon: "This feature is coming soon!",
    
    // Shopping items
    seeds: "Seeds",
    fertilizer: "Fertilizer",
    tools: "Tools",
    pesticides: "Pesticides",
    addToCart: "Add to Cart",
    
    // Video content
    organicFarmingGuide: "Organic Farming Guide",
    organicFarmingDesc: "Learn sustainable farming practices",
    
    // Market prices
    rice: "Rice",
    wheat: "Wheat",
    cotton: "Cotton",
    sugarcane: "Sugarcane"
  },
  hi: {
    // Navigation
    welcomeToAgroGuard: "एग्रोगार्ड में आपका स्वागत है",
    smartFarmingSolution: "डिजिटल युग के लिए स्मार्ट फार्मिंग समाधान",
    getStarted: "शुरू करें",
    watchDemo: "डेमो देखें",
    dashboard: "डैशबोर्ड",
    services: "सेवाएं",
    market: "बाजार",
    support: "सहायता",
    profile: "प्रोफाइल",
    settings: "सेटिंग्स",
    signOut: "साइन आउट",
    offline: "ऑफलाइन",
    language: "भाषा",
    notifications: "सूचनाएं",
    noNewNotifications: "कोई नई सूचना नहीं",

    // Main content
    quickStats: "त्वरित आंकड़े",
    activeFields: "सक्रिय खेत",
    totalYield: "कुल उत्पादन",
    weatherAlerts: "मौसम चेतावनी",
    selectService: "सेवा चुनें",
    emergencySection: "आपातकाल और सुरक्षा",
    
    // Weather
    weatherAlert: "गंभीर मौसम चेतावनी",
    temperature: "तापमान",
    humidity: "आर्द्रता",
    rainfall: "वर्षा",
    windSpeed: "हवा की गति",
    soilMoisture: "मिट्टी की नमी",
    pestAlert: "कीट चेतावनी",
    good: "अच्छा",
    poor: "खराब",
    excellent: "उत्कृष्ट",
    fair: "ठीक",

    // Emergency actions
    emergencyCall: "आपातकालीन कॉल",
    reportIssue: "समस्या की रिपोर्ट करें",
    
    // Services
    shopping: "खरीदारी",
    shopDesc: "खेती के उपकरण और सामान खरीदें",
    browse: "ब्राउज़ करें",
    videos: "वीडियो गाइड",
    videoDesc: "खेती की तकनीक सीखें",
    smartTools: "स्मार्ट टूल्स",
    toolsDesc: "AI-संचालित खेती के उपकरण",
    plan: "योजना",
    contracts: "अनुबंध",
    contractsDesc: "फील्ड सेवा अनुबंध",
    apply: "आवेदन करें",
    back: "वापस",
    servicesTitle: "खेती सेवाएं",

    // Chatbot
    chatTitle: "एग्रोगार्ड सहायक",
    online: "ऑनलाइन",
    chatPlaceholder: "खेती के बारे में कुछ भी पूछें...",

    // Drone
    droneTitle: "ड्रोन निगरानी",
    droneStatus: "ड्रोन स्थिति",
    lastScan: "अंतिम स्कैन",
    coverage: "कवरेज",
    issues: "समस्याएं",
    viewLive: "लाइव देखें",

    // IoT
    lowMoisture: "कम नमी चेतावनी",
    
    // Services
    farmingShoppingTitle: "खेती की खरीदारी",
    farmingShoppingDesc: "खेती के उपकरण और सामान खरीदें",
    videoGuidesTitle: "वीडियो गाइड",
    videoGuidesDesc: "खेती की तकनीक सीखें",
    marketPricesTitle: "बाजार की कीमतें",
    marketPricesDesc: "वर्तमान बाजार दरें देखें",
    drainagePlanningTitle: "जल निकासी योजना",
    drainagePlanningDesc: "अपने खेत की जल निकासी की योजना बनाएं",
    smartDroneTitle: "स्मार्ट ड्रोन",
    smartDroneDesc: "AI-संचालित ड्रोन निगरानी",
    agriContractsTitle: "कृषि अनुबंध",
    agriContractsDesc: "फील्ड सेवा अनुबंध",
    plantHealthTitle: "पौधे का स्वास्थ्य",
    plantHealthDesc: "पौधों की बीमारियों की निगरानी करें",
    aiChatbotTitle: "AI चैटबॉट",
    aiChatbotDesc: "खेती में सहायता प्राप्त करें",
    
    // Stats
    totalFarms: "कुल खेत",
    activeAlerts: "सक्रिय चेतावनी",
    onlineFarmers: "ऑनलाइन किसान",
    todayUpdates: "आज के अपडेट",
    
    // Quick Actions and Updates
    quickActions: "त्वरित कार्य",
    contactSupport: "सहायता से संपर्क करें",
    recentUpdates: "हाल के अपडेट",
    marketUpdate: "बाजार अपडेट",
    newGuide: "नई गाइड उपलब्ध",
    
    // Services content
    backToServices: "सेवाओं पर वापस जाएं",
    farmingServices: "खेती सेवाएं",
    featureComingSoon: "यह सुविधा जल्द ही आ रही है!",
  },
  te: {
    // Navigation
    welcomeToAgroGuard: "అగ్రోగార్డ్‌కు స్వాగతం",
    smartFarmingSolution: "డిజిటల్ యుగం కోసం స్మార్ట్ ఫార్మింగ్ సొల్యూషన్",
    getStarted: "ప్రారంభించండి",
    watchDemo: "డెమో చూడండి",
    dashboard: "డాష్‌బోర్డ్",
    services: "సేవలు",
    market: "మార్కెట్",
    support: "సపోర్ట్",
    profile: "ప్రొఫైల్",
    settings: "సెట్టింగ్‌లు",
    signOut: "సైన్ అవుట్",
    offline: "ఆఫ్‌లైన్",
    language: "భాష",
    notifications: "నోటిఫికేషన్‌లు",
    noNewNotifications: "కొత్త నోటిఫికేషన్‌లు లేవు",

    // Main content
    quickStats: "త్వరిత గణాంకాలు",
    activeFields: "క్రియాశీల పొలాలు",
    totalYield: "మొత్తం దిగుబడి",
    weatherAlerts: "వాతావరణ హెచ్చరికలు",
    selectService: "సేవను ఎంచుకోండి",
    emergencySection: "అత్యవసర మరియు భద్రత",
    
    // Weather
    weatherAlert: "తీవ్ర వాతావరణ హెచ్చరిక",
    temperature: "ఉష్ణోగ్రత",
    humidity: "తేమ",
    rainfall: "వర్షపాతం",
    windSpeed: "గాలి వేగం",
    soilMoisture: "నేల తేమ",
    pestAlert: "కీటకాల హెచ్చరిక",
    good: "మంచిది",
    poor: "చెడ్డది",
    excellent: "అద్భుతం",
    fair: "సరియైనది",

    // Emergency actions
    emergencyCall: "అత్యవసర కాల్",
    reportIssue: "సమస్యను నివేదించండి",
    
    // Services
    shopping: "షాపింగ్",
    shopDesc: "వ్యవసాయ పరికరాలు మరియు సామాగ్రిని కొనుగోలు చేయండి",
    browse: "బ్రౌజ్ చేయండి",
    videos: "వీడియో గైడ్‌లు",
    videoDesc: "వ్యవసాయ పద్ధతులను నేర్చుకోండి",
    smartTools: "స్మార్ట్ టూల్స్",
    toolsDesc: "AI-ఆధారిత వ్యవసాయ పరికరాలు",
    plan: "ప్లాన్",
    contracts: "కాంట్రాక్టులు",
    contractsDesc: "ఫీల్డ్ సర్వీస్ కాంట్రాక్టులు",
    apply: "దరఖాస్తు చేయండి",
    back: "వెనుకకు",
    servicesTitle: "వ్యవసాయ సేవలు",

    // Chatbot
    chatTitle: "అగ్రోగార్డ్ అసిస్టెంట్",
    online: "ఆన్‌లైన్",
    chatPlaceholder: "వ్యవసాయం గురించి ఏదైనా అడగండి...",

    // Drone
    droneTitle: "డ్రోన్ పర్యవేక్షణ",
    droneStatus: "డ్రోన్ స్థితి",
    lastScan: "చివరి స్కాన్",
    coverage: "కవరేజ్",
    issues: "సమస్యలు",
    viewLive: "లైవ్ చూడండి",

    // IoT
    lowMoisture: "తక్కువ తేమ హెచ్చరిక",
    
    // Services
    farmingShoppingTitle: "వ్యవసాయ షాపింగ్",
    farmingShoppingDesc: "వ్యవసాయ పరికరాలు మరియు సామాగ్రిని కొనుగోలు చేయండి",
    videoGuidesTitle: "వీడియో గైడ్‌లు",
    videoGuidesDesc: "వ్యవసాయ పద్ధతులను నేర్చుకోండి",
    marketPricesTitle: "మార్కెట్ ధరలు",
    marketPricesDesc: "ప్రస్తుత మార్కెట్ రేట్లను చూడండి",
    drainagePlanningTitle: "డ్రైనేజ్ ప్లానింగ్",
    drainagePlanningDesc: "మీ పొలం డ్రైనేజ్‌ను ప్లాన్ చేయండి",
    smartDroneTitle: "స్మార్ట్ డ్రోన్",
    smartDroneDesc: "AI-ఆధారిత డ్రోన్ పర్యవేక్షణ",
    agriContractsTitle: "వ్యవసాయ కాంట్రాక్టులు",
    agriContractsDesc: "ఫీల్డ్ సర్వీస్ కాంట్రాక్టులు",
    plantHealthTitle: "మొక్కల ఆరోగ్యం",
    plantHealthDesc: "మొక్కల వ్యాధులను పర్యవేక్షించండి",
    aiChatbotTitle: "AI చాట్‌బాట్",
    aiChatbotDesc: "వ్యవసాయంలో సహాయం పొందండి",
    
    // Stats
    totalFarms: "మొత్తం పొలాలు",
    activeAlerts: "క్రియాశీల హెచ్చరికలు",
    onlineFarmers: "ఆన్‌లైన్ రైతులు",
    todayUpdates: "నేటి అప్‌డేట్‌లు",
    
    // Quick Actions and Updates
    quickActions: "త్వరిత చర్యలు",
    contactSupport: "సపోర్ట్‌ను సంప్రదించండి",
    recentUpdates: "ఇటీవలి అప్‌డేట్‌లు",
    marketUpdate: "మార్కెట్ అప్‌డేట్",
    newGuide: "కొత్త గైడ్ అందుబాటులో ఉంది",
    
    // Services content
    backToServices: "సేవలకు తిరిగి వెళ్ళు",
    farmingServices: "వ్యవసాయ సేవలు",
    featureComingSoon: "ఈ ఫీచర్ త్వరలో వస్తుంది!",
  }
};

export const useTranslation = (language: Language) => {
  const t = (key: keyof typeof translations.en): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  return { t };
};
