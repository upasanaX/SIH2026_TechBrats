import { CommunicationLog } from '../types';

export interface FPODashboardMetrics {
  totalRegisteredFarmers: number;
  activePanchayats: number;
  activeAlertCount: number;
  advisoryDeliveryRate: number; // percentage
  marketplaceVolumeINR: number;
  totalProduceListedKg: number;
  farmersDirectSavingsINR: number;
  lastUpdated: string;
}

export const FPO_METRICS: FPODashboardMetrics = {
  totalRegisteredFarmers: 10110,
  activePanchayats: 6,
  activeAlertCount: 4,
  advisoryDeliveryRate: 94.2,
  marketplaceVolumeINR: 846200,
  totalProduceListedKg: 42500,
  farmersDirectSavingsINR: 238000,
  lastUpdated: '05 Sep 2026, 08:30 PM IST'
};

export const RISK_DISTRIBUTION = [
  { severity: 'Critical Risk', count: 1, color: '#991b1b', panchayat: 'Canning-II' },
  { severity: 'High Risk', count: 2, color: '#dc2626', panchayat: 'Bhangar-I, Padima-II' },
  { severity: 'Moderate Risk', count: 2, color: '#d97706', panchayat: 'Singur, Memari' },
  { severity: 'Normal / Info', count: 1, color: '#2563eb', panchayat: 'Chhota Jagulia' }
];

export const CHANNEL_PERFORMANCE = [
  { channel: 'Mobile Smart App', delivered: 4890, pending: 110, failed: 45, deliveryRate: 97.0, avgLatency: '1.2s' },
  { channel: 'Targeted SMS Broadcast', delivered: 8750, pending: 210, failed: 95, deliveryRate: 96.6, avgLatency: '4.8s' },
  { channel: 'Automated IVR Voice Call', delivered: 6420, pending: 340, failed: 180, deliveryRate: 92.5, avgLatency: '18.4s' }
];

export const PANCHAYAT_COMPARISON_TABLE = [
  {
    id: 'bhangar-1',
    name: 'Bhangar-I',
    district: 'South 24 Parganas',
    registeredFarmers: 1420,
    dominantCrop: 'Paddy & Veg',
    riskLevel: 'high',
    activeAlerts: 2,
    rainfall24h: '42.5 mm',
    smsSent: 1420,
    ivrCompleted: 960,
    marketListedKg: 8500
  },
  {
    id: 'canning-2',
    name: 'Canning-II',
    district: 'South 24 Parganas',
    registeredFarmers: 1850,
    dominantCrop: 'Boro Paddy & Fish',
    riskLevel: 'critical',
    activeAlerts: 3,
    rainfall24h: '68.0 mm',
    smsSent: 1850,
    ivrCompleted: 1850,
    marketListedKg: 4200
  },
  {
    id: 'singur',
    name: 'Singur Rural',
    district: 'Hooghly',
    registeredFarmers: 2100,
    dominantCrop: 'Potato & Mustard',
    riskLevel: 'moderate',
    activeAlerts: 1,
    rainfall24h: '8.5 mm',
    smsSent: 2100,
    ivrCompleted: 1100,
    marketListedKg: 14800
  },
  {
    id: 'barasat-1',
    name: 'Chhota Jagulia',
    district: 'North 24 Parganas',
    registeredFarmers: 980,
    dominantCrop: 'Tomato & Cole Crops',
    riskLevel: 'info',
    activeAlerts: 0,
    rainfall24h: '1.2 mm',
    smsSent: 980,
    ivrCompleted: 420,
    marketListedKg: 3200
  },
  {
    id: 'memari-1',
    name: 'Bagila Gram Panchayat',
    district: 'Purba Bardhaman',
    registeredFarmers: 2640,
    dominantCrop: 'Gobindobhog Rice',
    riskLevel: 'moderate',
    activeAlerts: 1,
    rainfall24h: '14.0 mm',
    smsSent: 2640,
    ivrCompleted: 1400,
    marketListedKg: 9600
  },
  {
    id: 'padima-2',
    name: 'Padima-II Coastal',
    district: 'Purba Medinipur',
    registeredFarmers: 1120,
    dominantCrop: 'Betel Vine & Cashew',
    riskLevel: 'high',
    activeAlerts: 2,
    rainfall24h: '52.0 mm',
    smsSent: 1120,
    ivrCompleted: 980,
    marketListedKg: 2200
  }
];

export const RECENT_COMMUNICATION_LOGS: CommunicationLog[] = [
  {
    id: 'comm-01',
    type: 'sms',
    recipientName: 'Ramesh Mondal',
    recipientPhone: '+91 98310 XXXXX',
    panchayat: 'Bhangar-I',
    messagePreview: 'KrishiKavach ALERT: Heavy rain (42mm) expected in Bhangar-I by 10 PM. Open paddy field bunds and suspend spraying.',
    status: 'delivered',
    timestamp: '10 mins ago'
  },
  {
    id: 'comm-02',
    type: 'ivr',
    recipientName: 'Haripada Das',
    recipientPhone: '+91 94332 XXXXX',
    panchayat: 'Canning-II',
    messagePreview: 'Bengali Audio: "সতর্কবার্তা: মাতলা নদীতে তীব্র জোয়ার ও জলোচ্ছ্বাসের আশঙ্কা। স্লুইস গেট বন্ধ রাখুন।"',
    audioDurationSeconds: 42,
    status: 'completed',
    timestamp: '18 mins ago'
  },
  {
    id: 'comm-03',
    type: 'app',
    recipientName: 'Subir Mondal',
    recipientPhone: '+91 98312 XXXXX',
    panchayat: 'Bagila Gram Panchayat',
    messagePreview: 'Advisory updated: Moderate late-night squall. Store Gobindobhog seed bags on elevated pallets.',
    status: 'delivered',
    timestamp: '25 mins ago'
  },
  {
    id: 'comm-04',
    type: 'sms',
    recipientName: 'Bikas Ghosh',
    recipientPhone: '+91 91633 XXXXX',
    panchayat: 'Singur Rural',
    messagePreview: 'Marketplace Update: Hooghly consumer group requested 10 bags of Jyoti Potato (500kg). Direct pickup.',
    status: 'delivered',
    timestamp: '42 mins ago'
  },
  {
    id: 'comm-05',
    type: 'ivr',
    recipientName: 'Purnima Halder',
    recipientPhone: '+91 94338 XXXXX',
    panchayat: 'Chhota Jagulia',
    messagePreview: 'Bengali Audio: "টমেটো সংরক্ষণের পরামর্শ: দুপুরের চড়া রোদের আগে ফল সংগ্রহ করুন।"',
    audioDurationSeconds: 36,
    status: 'completed',
    timestamp: '1 hour ago'
  }
];
