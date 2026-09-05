import { DisasterAlert } from '../types';

export const DISASTER_ALERTS: DisasterAlert[] = [
  {
    id: 'alert-hr-01',
    title: 'Severe Convective Rain & Waterlogging Threat',
    titleHindi: 'गंभीर संवहनी वर्षा और जलभराव का खतरा',
    titleBengali: 'তীব্র বৃষ্টিপাত এবং জল জমার সতর্কতা',
    severity: 'high',
    type: 'heavy_rain',
    primaryPanchayatId: 'panchayat-bhangar-1',
    affectedPanchayats: ['Bhangar-I', 'Bhangar-II', 'Sonarpur', 'Canning-I'],
    timeWindow: 'Next 12 Hours (Today 09:00 PM - Tomorrow 09:00 AM)',
    confidence: 91,
    source: 'IMD Doppler Radar Kolkata + KrishiKavach Hydrological Downscaling',
    affectedCrops: ['Aman Paddy (Vegetative Stage)', 'Pointed Gourd (Patol)', 'Chili'],
    summary: 'Localized convective storm cell detected moving east-southeast with anticipated precipitation rate of 28-35 mm/hour. Severe inundation danger for low-lying plots and drainage canals.',
    actionChecklist: [
      'Immediately open field bund drainage cuts to prevent submergence of young paddy tillers.',
      'Do not apply top-dressing urea or nitrogenous fertilizers before rainfall.',
      'Halt all foliar fungicide or pesticide sprays to avoid chemical runoff wastage.',
      'Elevate harvested vegetable crates on wooden pallets in covered sheds.',
      'Inspect solar pump installations and switch off submersibles.'
    ],
    broadcastStatus: {
      appSent: 840,
      smsSent: 1420,
      ivrSent: 960,
      totalTargeted: 1420
    },
    timestamp: '2026-09-05T19:30:00Z',
    isAcknowledged: false
  },
  {
    id: 'alert-fl-02',
    title: 'Estuarine High Tide Surge & Saline Embankment Vulnerability',
    titleHindi: 'ज्वारीय लहर और खारे पानी के तटबंध टूटने की चेतावनी',
    titleBengali: 'জোয়ারের জলোচ্ছ্বাস এবং নোনা বাঁধ ভাঙার উচ্চ সতর্কতা',
    severity: 'critical',
    type: 'flood_risk',
    primaryPanchayatId: 'panchayat-canning-2',
    affectedPanchayats: ['Canning-II', 'Basanti', 'Gosaba Coastal'],
    timeWindow: 'Next 6 to 18 Hours (Coinciding with Spring Tide Peak at 02:45 AM)',
    confidence: 95,
    source: 'INCOIS Storm Surge Bulletin + KrishiKavach Coastal Elevation Model',
    affectedCrops: ['Boro Seedlings', 'Freshwater Carp Ponds', 'Betel Vine'],
    summary: 'Spring tide coupled with 45 km/h squall expected to elevate Matla river levels by +1.4m above normal astronomical tide. High risk of brackish water breaching agricultural dikes.',
    actionChecklist: [
      'Erect sandbag reinforcements along vulnerable stretches of earthen sluice gates.',
      'Place nylon mesh nets around freshwater aquaculture ponds to prevent fish escape during overflow.',
      'Relocate livestock and portable power tillers to high-elevation community shelters.',
      'Close sluice flap gates tightly to restrict saline river ingress into paddy canals.',
      'Maintain emergency battery-operated radio and phone charged for Panchayat disaster team sirens.'
    ],
    broadcastStatus: {
      appSent: 1120,
      smsSent: 1850,
      ivrSent: 1850,
      totalTargeted: 1850
    },
    timestamp: '2026-09-05T18:45:00Z',
    isAcknowledged: false
  },
  {
    id: 'alert-hs-03',
    title: 'Isolated Hailstorm & Microburst Risk',
    titleHindi: 'स्थानीय ओलावृष्टि और तेज हवा का खतरा',
    titleBengali: 'বিচ্ছিন্ন শিলাবৃষ্টি এবং কালবৈশাখীর সতর্কতা',
    severity: 'moderate',
    type: 'hailstorm',
    primaryPanchayatId: 'panchayat-singur',
    affectedPanchayats: ['Singur Rural', 'Haripal North', 'Tarakeswar'],
    timeWindow: 'Tomorrow Afternoon (02:00 PM - 06:00 PM)',
    confidence: 84,
    source: 'KrishiKavach Cloud Top Brightness Temperature Index (ISRO/INSAT-3D)',
    affectedCrops: ['Potato Seedbed Tuber Growth', 'Young Mustard Seedlings', 'Banana Plantations'],
    summary: 'Elevated CAPE index (>2200 J/kg) indicates supercell thunderstorm formation capable of producing 1-2 cm hailstones and wind gusts up to 55 km/h.',
    actionChecklist: [
      'Provide bamboo staking and propping support for fruiting banana and papaya trees.',
      'Cover high-value nursery nursery beds with 50% shade agro-nets if available.',
      'Harvest mature open-field vegetables (cauliflower, chili) in the morning hours before noon.',
      'Clear perimeter ditches to avoid hail-melt pooling in potato ridges.'
    ],
    broadcastStatus: {
      appSent: 1350,
      smsSent: 2100,
      ivrSent: 1100,
      totalTargeted: 2100
    },
    timestamp: '2026-09-05T17:15:00Z',
    isAcknowledged: true
  },
  {
    id: 'alert-hw-04',
    title: 'High Thermal Stress & Soil Moisture Deficit',
    titleHindi: 'उच्च तापीय तनाव और मिट्टी में नमी की कमी',
    titleBengali: 'উচ্চ তাপমাত্রা ও মাটির আর্দ্রতা হ্রাসের সতর্কতা',
    severity: 'info',
    type: 'heatwave',
    primaryPanchayatId: 'panchayat-barasat-1',
    affectedPanchayats: ['Chhota Jagulia', 'Deganga', 'Amdanga'],
    timeWindow: 'Next 48 Hours (Peak 11:30 AM - 03:30 PM daily)',
    confidence: 88,
    source: 'NASA POWER Surface Energy Flux + IMD Agromet Advisory',
    affectedCrops: ['Tomato Transplants', 'Cabbage Seedlings'],
    summary: 'Daytime surface temperatures reaching 36.5°C with high vapor pressure deficit. Sapling transpirational shock possible.',
    actionChecklist: [
      'Apply light micro-sprinkler or furrow irrigation during late evening hours.',
      'Apply straw or dry grass mulching around vegetable roots to retain soil moisture.',
      'Delay open-sun transplanting until cloudy intervals.'
    ],
    broadcastStatus: {
      appSent: 680,
      smsSent: 980,
      ivrSent: 420,
      totalTargeted: 980
    },
    timestamp: '2026-09-05T14:00:00Z',
    isAcknowledged: true
  }
];
