
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
    watch: "Watch",
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
    lowMoisture: "Low Moisture Alert"
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
    watch: "देखें",
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
    lowMoisture: "कम नमी चेतावनी"
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
    watch: "చూడండి",
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
    lowMoisture: "తక్కువ తేమ హెచ్చరిక"
  }
};

export const useTranslation = (language: Language) => {
  const t = (key: keyof typeof translations.en): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  return { t };
};
