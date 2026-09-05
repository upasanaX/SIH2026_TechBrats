export type Role = 'farmer' | 'consumer' | 'official';
export type Language = 'en' | 'hi' | 'bn';
export type AlertSeverity = 'critical' | 'high' | 'moderate' | 'info';
export type AlertType = 
  | 'heavy_rain' 
  | 'hailstorm' 
  | 'thunderstorm' 
  | 'heatwave' 
  | 'strong_wind' 
  | 'flood_risk' 
  | 'drought_stress';

export interface Panchayat {
  id: string;
  name: string;
  bengaliName: string;
  hindiName: string;
  block: string;
  district: string;
  state: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  elevation: number; // meters
  registeredFarmers: number;
  primaryCrops: string[];
  soilType: string;
  currentRisk: AlertSeverity;
  activeAlertCount: number;
  fpoPartner: string;
}

export interface WeatherReading {
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  rainProbability: number;
  rainfallMm: number;
  pressure: number;
  uvIndex: number;
  soilMoisture: number; // percentage
  condition: string;
  conditionBengali: string;
  conditionHindi: string;
  icon: string;
  riskConfidence: number; // 0-100%
  lastUpdated: string;
  dataSource: string;
  validityPeriod: string;
  isDownscaled: boolean;
}

export interface HourlyForecast {
  time: string;
  temp: number;
  rainProb: number;
  rainfallMm: number;
  condition: string;
  icon: string;
  windSpeed: number;
}

export interface DailyForecast {
  day: string;
  date: string;
  minTemp: number;
  maxTemp: number;
  rainProb: number;
  rainfallMm: number;
  condition: string;
  icon: string;
  severity: AlertSeverity;
  advisorySummary: string;
}

export interface DistrictVsPanchayatComparison {
  districtName: string;
  panchayatName: string;
  districtForecast: {
    condition: string;
    rainProb: number;
    temp: string;
    resolution: string;
    warning: string;
  };
  panchayatForecast: {
    condition: string;
    rainProb: number;
    temp: string;
    resolution: string;
    warning: string;
    localizedFeature: string;
  };
  downscalingReason: string;
}

export interface DisasterAlert {
  id: string;
  title: string;
  titleHindi: string;
  titleBengali: string;
  severity: AlertSeverity;
  type: AlertType;
  affectedPanchayats: string[];
  primaryPanchayatId: string;
  timeWindow: string;
  confidence: number;
  source: string;
  affectedCrops: string[];
  summary: string;
  actionChecklist: string[];
  broadcastStatus: {
    appSent: number;
    smsSent: number;
    ivrSent: number;
    totalTargeted: number;
  };
  timestamp: string;
  isAcknowledged?: boolean;
}

export interface CropAdvisory {
  id: string;
  cropId: string;
  cropName: string;
  hindiName: string;
  bengaliName: string;
  growthStage: 'sowing' | 'vegetative' | 'flowering' | 'grain_filling' | 'harvesting';
  stageLabel: {
    en: string;
    hi: string;
    bn: string;
  };
  soilType: string;
  weatherConditionTrigger: string;
  todayAction: {
    en: string;
    hi: string;
    bn: string;
  };
  irrigationGuidance: {
    en: string;
    hi: string;
    bn: string;
  };
  pestDiseasePrecaution: {
    en: string;
    hi: string;
    bn: string;
  };
  fertilizerTiming: {
    en: string;
    hi: string;
    bn: string;
  };
  harvestStorageAdvice: {
    en: string;
    hi: string;
    bn: string;
  };
  priority: 'urgent' | 'recommended' | 'informational';
  reason: string;
  validityPeriod: string;
}

export interface Product {
  id: string;
  name: string;
  bengaliName: string;
  hindiName: string;
  category: 'grains' | 'vegetables' | 'spices' | 'fruits' | 'pulses';
  image: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  village: string;
  panchayat: string;
  district: string;
  quantityAvailable: number;
  unit: string;
  pricePerUnit: number;
  traditionalMandiPrice: number; // baseline comparison
  harvestDate: string;
  organic: boolean;
  deliveryOptions: ('direct_pickup' | 'hub_delivery' | 'express_courier')[];
  pickupLocation: string;
  shelfLifeDays: number;
  rating: number;
  verifiedFarmer: boolean;
  description: string;
  farmerStory: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  farmerEarnings: number;
  middlemanSavings: number;
  deliveryType: 'direct_pickup' | 'hub_delivery' | 'express_courier';
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine: string;
    city: string;
    pincode: string;
  };
  paymentMethod: 'upi' | 'kisan_pay' | 'cod';
  status: 'confirmed' | 'ready_for_pickup' | 'in_transit' | 'delivered';
  createdAt: string;
}

export interface CommunicationLog {
  id: string;
  type: 'sms' | 'ivr' | 'app';
  recipientName: string;
  recipientPhone: string;
  panchayat: string;
  messagePreview: string;
  audioDurationSeconds?: number;
  status: 'delivered' | 'calling' | 'completed' | 'queued';
  timestamp: string;
}
