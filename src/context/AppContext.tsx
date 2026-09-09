import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Panchayat, 
  Role, 
  Language, 
  DisasterAlert, 
  Product, 
  CartItem, 
  Order,
  WeatherReading,
  HourlyForecast,
  DailyForecast,
  UserAccount,
  ProductListingInput
} from '../types';
import { PANCHAYATS, DEFAULT_PANCHAYAT } from '../data/panchayats';
import { DISASTER_ALERTS } from '../data/alerts';
import { PRODUCTS } from '../data/products';
import { TRANSLATIONS } from '../utils/translations';
import { fetchDownscaledWeather, LiveDailyWeather, LiveHourlyWeather, LiveWeatherResponse } from '../api/weatherApi';

interface AppContextType {
  currentPanchayat: Panchayat;
  setCurrentPanchayat: (panchayat: Panchayat) => void;
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  currentUser: UserAccount | null;
  isAuthenticated: boolean;
  login: (account: UserAccount) => void;
  logout: () => void;
  accounts: UserAccount[];
  updateAccountStatus: (accountId: string, status: UserAccount['status']) => void;
  removeAccount: (accountId: string) => void;
  addProductListing: (listing: ProductListingInput) => Product;
  products: Product[];
  language: Language;
  setLanguage: (lang: Language) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  orders: Order[];
  createOrder: (order: Partial<Order>) => Order;
  alerts: DisasterAlert[];
  acknowledgeAlert: (alertId: string) => void;
  selectedAlert: DisasterAlert | null;
  setSelectedAlert: (alert: DisasterAlert | null) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  largeText: boolean;
  setLargeText: (val: boolean) => void;
  isOfflineDemo: boolean;
  setIsOfflineDemo: (val: boolean) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  t: (key: string) => string;
  speakAdvisory: (text: string, lang?: Language) => void;
  isSpeaking: boolean;
  stopSpeaking: () => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  liveWeather: LiveWeatherResponse | null;
  liveHourlyWeather: LiveHourlyWeather[];
  liveDailyWeather: LiveDailyWeather[];
  liveWeatherLoading: boolean;
  liveWeatherError: string | null;
  weatherReading: WeatherReading | null;
  hourlyForecasts: HourlyForecast[];
  dailyForecasts: DailyForecast[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPanchayat, setCurrentPanchayat] = useState<Panchayat>(DEFAULT_PANCHAYAT);
  const [currentRole, setCurrentRole] = useState<Role>('farmer');
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const savedUser = window.localStorage.getItem('krishikavach-user');
    if (!savedUser) return null;
    try {
      return JSON.parse(savedUser) as UserAccount;
    } catch {
      window.localStorage.removeItem('krishikavach-user');
      return null;
    }
  });
  const [accounts, setAccounts] = useState<UserAccount[]>([
    { id: 'farmer-ramesh', name: 'Ramesh Mondal', role: 'farmer', contact: '+91 98310 44219', location: 'Bhangar-I Panchayat', status: 'active', joinedAt: '2026-04-12' },
    { id: 'farmer-subodh', name: 'Subodh Roy', role: 'farmer', contact: '+91 98765 11990', location: 'Canning-II Panchayat', status: 'active', joinedAt: '2026-05-08' },
    { id: 'consumer-pooja', name: 'Pooja Sen', role: 'consumer', contact: 'pooja.sen@kolkata-agro.in', location: 'Salt Lake, Kolkata', status: 'active', joinedAt: '2026-06-21' },
    { id: 'consumer-anirban', name: 'Anirban Ghosh', role: 'consumer', contact: '+91 98765 43210', location: 'New Town, Kolkata', status: 'active', joinedAt: '2026-07-02' }
  ]);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLanguage = window.localStorage.getItem('krishikavach-language');
    return savedLanguage === 'hi' || savedLanguage === 'bn' ? savedLanguage : 'en';
  });
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [alerts, setAlerts] = useState<DisasterAlert[]>(DISASTER_ALERTS);
  const [selectedAlert, setSelectedAlert] = useState<DisasterAlert | null>(null);
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [largeText, setLargeText] = useState<boolean>(false);
  const [isOfflineDemo, setIsOfflineDemo] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [liveWeather, setLiveWeather] = useState<LiveWeatherResponse | null>(null);
  const [liveWeatherLoading, setLiveWeatherLoading] = useState(true);
  const [liveWeatherError, setLiveWeatherError] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) setCurrentRole(currentUser.role);
  }, [currentUser]);

  const login = (account: UserAccount) => {
    if (account.status !== 'active') {
      showToast('This account is not active. Please contact an administrator.');
      return;
    }
    setCurrentUser(account);
    setCurrentRole(account.role);
    window.localStorage.setItem('krishikavach-user', JSON.stringify(account));
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentRole('farmer');
    setActiveTab('auth');
    setCart([]);
    window.localStorage.removeItem('krishikavach-user');
  };

  const updateAccountStatus = (accountId: string, status: UserAccount['status']) => {
    setAccounts(prev => prev.map(account => account.id === accountId ? { ...account, status } : account));
    if (currentUser?.id === accountId && status !== 'active') logout();
  };

  const removeAccount = (accountId: string) => {
    setAccounts(prev => prev.filter(account => account.id !== accountId));
    showToast('Account removed from the local management register.');
  };

  const addProductListing = (listing: ProductListingInput): Product => {
    const farmer = currentUser;
    const product: Product = {
      id: `KK-LIST-${Date.now()}`,
      name: listing.name,
      bengaliName: listing.name,
      hindiName: listing.name,
      category: listing.category,
      image: listing.image || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=900&q=80',
      farmerId: farmer?.id || 'demo-farmer',
      farmerName: farmer?.name || 'Demo Farmer',
      farmerPhone: farmer?.contact || '+91 98310 44219',
      village: listing.village,
      panchayat: currentPanchayat.name,
      district: listing.district,
      quantityAvailable: listing.quantityAvailable,
      unit: listing.unit,
      pricePerUnit: listing.pricePerUnit,
      traditionalMandiPrice: listing.pricePerUnit * 1.15,
      harvestDate: listing.harvestDate,
      organic: listing.organic,
      deliveryOptions: ['direct_pickup', 'hub_delivery'],
      pickupLocation: `${listing.village}, ${listing.district}`,
      shelfLifeDays: 7,
      rating: 5,
      verifiedFarmer: true,
      description: `${listing.name} harvested by ${farmer?.name || 'a local farmer'} and listed for direct purchase.`,
      farmerStory: `${farmer?.name || 'A local farmer'} is selling this fresh harvest directly through KrishiKavach.`
    };
    setProducts(prev => [product, ...prev]);
    showToast(`${product.name} listing created successfully.`);
    return product;
  };

  useEffect(() => {
    let active = true;
    const loadWeather = async () => {
      setLiveWeatherLoading(true);
      setLiveWeatherError(null);
      try {
        const result = await fetchDownscaledWeather(currentPanchayat.lgdCode);
        if (active) setLiveWeather(result);
      } catch (error) {
        if (active) {
          setLiveWeather(null);
          setLiveWeatherError(error instanceof Error ? error.message : 'Unable to fetch live weather data.');
        }
      } finally {
        if (active) setLiveWeatherLoading(false);
      }
    };
    loadWeather();
    const refresh = window.setInterval(loadWeather, 10 * 60 * 1000);
    return () => {
      active = false;
      window.clearInterval(refresh);
    };
  }, [currentPanchayat.lgdCode]);

  const localizedAlerts = alerts.map(alert => ({
    ...alert,
    title: language === 'hi' ? alert.titleHindi : language === 'bn' ? alert.titleBengali : alert.title
  }));

  const setLanguage = (lang: Language) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    setLanguageState(lang);
    window.localStorage.setItem('krishikavach-language', lang);
  };

  // Sync class on document body for accessibility
  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [highContrast]);

  useEffect(() => {
    if (largeText) {
      document.body.classList.add('large-text');
    } else {
      document.body.classList.remove('large-text');
    }
  }, [largeText]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  const t = (key: string): string => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    return langDict[key] || TRANSLATIONS.en[key] || key;
  };

  const weatherReading: WeatherReading | null = liveWeather ? {
    temp: liveWeather.temperature.downscaled_c,
    feelsLike: null,
    humidity: liveWeather.humidity_percent,
    windSpeed: liveWeather.wind.speed_kmh,
    windDirection: `${Math.round(liveWeather.wind.direction_deg)}°`,
    rainProbability: null,
    rainfallMm: liveWeather.rainfall.precipitation_mm,
    pressure: liveWeather.pressure_hpa,
    uvIndex: null,
    soilMoisture: null,
    condition: 'Live Open-Meteo forecast',
    conditionBengali: 'Live Open-Meteo forecast',
    conditionHindi: 'Live Open-Meteo forecast',
    icon: 'cloud',
    riskConfidence: null,
    lastUpdated: new Date(liveWeather.timestamp).toLocaleString('en-IN'),
    dataSource: 'Open-Meteo live forecast; temperature uses XGBoost local correction',
    validityPeriod: 'Tomorrow hourly forecast',
    isDownscaled: true
  } : null;

  const hourlyForecasts: HourlyForecast[] = liveWeather?.hourly.map(item => ({
    time: new Date(item.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    temp: item.downscaled_temperature_c,
    rainProb: null,
    rainfallMm: item.precipitation_mm,
    condition: 'Live forecast',
    icon: 'cloud',
    windSpeed: item.wind_speed_kmh
  })) || [];

  const dailyForecasts: DailyForecast[] = liveWeather?.daily.map(item => ({
    day: new Date(`${item.date}T00:00:00`).toLocaleDateString('en-IN', { weekday: 'short' }),
    date: item.date,
    minTemp: item.raw_min_temperature_c,
    maxTemp: item.raw_max_temperature_c,
    rainProb: item.precipitation_probability_percent,
    rainfallMm: item.precipitation_sum_mm,
    condition: 'Live forecast',
    icon: 'cloud',
    severity: 'info',
    advisorySummary: 'Live Open-Meteo forecast; consult official advisories for decisions.'
  })) || [];

  const addToCart = (product: Product, quantity: number = 1) => {
    if (currentRole !== 'consumer') {
      showToast('Only signed-in consumers can add products to a cart.');
      return;
    }
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added ${quantity} ${product.unit} of ${product.name} to cart.`);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => 
      item.product.id === productId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  const createOrder = (orderData: Partial<Order>): Order => {
    if (currentRole !== 'consumer') {
      showToast('Only signed-in consumers can place orders.');
    }
    const newOrder: Order = {
      id: `KK-ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      items: cart,
      subtotal: orderData.subtotal || 0,
      deliveryFee: orderData.deliveryFee || 0,
      totalAmount: orderData.totalAmount || 0,
      farmerEarnings: orderData.farmerEarnings || 0,
      middlemanSavings: orderData.middlemanSavings || 0,
      deliveryType: orderData.deliveryType || 'hub_delivery',
      shippingAddress: orderData.shippingAddress || {
        fullName: 'Demo Consumer',
        phone: '+91 98765 43210',
        addressLine: 'Flat 4B, Salt Lake Sector V',
        city: 'Kolkata',
        pincode: '700091'
      },
      paymentMethod: orderData.paymentMethod || 'upi',
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => 
      a.id === alertId ? { ...a, isAcknowledged: true } : a
    ));
    showToast('Alert acknowledged. Local emergency team informed.');
  };

  const speakAdvisory = (text: string, lang: Language = language) => {
    if (!('speechSynthesis' in window)) {
      showToast('Voice read-aloud is not supported on this browser.');
      return;
    }

    window.speechSynthesis.cancel();
    const targetLocale = lang === 'hi' ? 'hi-IN' : lang === 'bn' ? 'bn-IN' : 'en-IN';
    const languagePrefix = targetLocale.slice(0, 2).toLowerCase();

    const speakWhenReady = (voices: SpeechSynthesisVoice[]) => {
      const matchingVoice = voices.find(voice => voice.lang.toLowerCase() === targetLocale.toLowerCase())
        || voices.find(voice => voice.lang.toLowerCase().startsWith(languagePrefix));

      if (lang !== 'en' && !matchingVoice) {
        setIsSpeaking(false);
        showToast(`No ${lang === 'hi' ? 'Hindi' : 'Bengali'} voice is installed in this browser.`);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = targetLocale;
      if (matchingVoice) utterance.voice = matchingVoice;
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      showToast(`Voice advisory audio started (${lang.toUpperCase()})`);
    };

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      speakWhenReady(voices);
      return;
    }

    let settled = false;
    const handleVoicesChanged = () => {
      if (settled) return;
      settled = true;
      window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
      speakWhenReady(window.speechSynthesis.getVoices());
    };
    window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
    window.setTimeout(() => {
      if (settled) return;
      settled = true;
      window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
      speakWhenReady(window.speechSynthesis.getVoices());
    }, 1000);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentPanchayat,
        setCurrentPanchayat,
        currentRole,
        setCurrentRole,
        currentUser,
        isAuthenticated: currentUser !== null,
        login,
        logout,
        accounts,
        updateAccountStatus,
        removeAccount,
        addProductListing,
        products,
        language,
        setLanguage,
        activeTab,
        setActiveTab,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        orders,
        createOrder,
        alerts: localizedAlerts,
        acknowledgeAlert,
        selectedAlert,
        setSelectedAlert,
        highContrast,
        setHighContrast,
        largeText,
        setLargeText,
        isOfflineDemo,
        setIsOfflineDemo,
        toastMessage,
        showToast,
        t,
        speakAdvisory,
        isSpeaking,
        stopSpeaking,
        selectedProductId,
        setSelectedProductId,
        liveWeather,
        liveHourlyWeather: liveWeather?.hourly || [],
        liveDailyWeather: liveWeather?.daily || [],
        liveWeatherLoading,
        liveWeatherError,
        weatherReading,
        hourlyForecasts,
        dailyForecasts
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
