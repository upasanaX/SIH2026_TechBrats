import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Panchayat, 
  Role, 
  Language, 
  DisasterAlert, 
  Product, 
  CartItem, 
  Order 
} from '../types';
import { PANCHAYATS, DEFAULT_PANCHAYAT } from '../data/panchayats';
import { DISASTER_ALERTS } from '../data/alerts';
import { TRANSLATIONS } from '../utils/translations';

interface AppContextType {
  currentPanchayat: Panchayat;
  setCurrentPanchayat: (panchayat: Panchayat) => void;
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPanchayat, setCurrentPanchayat] = useState<Panchayat>(DEFAULT_PANCHAYAT);
  const [currentRole, setCurrentRole] = useState<Role>('farmer');
  const [language, setLanguage] = useState<Language>('en');
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

  const addToCart = (product: Product, quantity: number = 1) => {
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
    const utterance = new SpeechSynthesisUtterance(text);
    if (lang === 'hi') {
      utterance.lang = 'hi-IN';
    } else if (lang === 'bn') {
      utterance.lang = 'bn-IN';
    } else {
      utterance.lang = 'en-IN';
    }
    utterance.rate = 0.9;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    showToast(`Voice advisory audio started (${lang.toUpperCase()})`);
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
        alerts,
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
        setSelectedProductId
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
