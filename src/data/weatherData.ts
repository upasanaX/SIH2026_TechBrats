import { WeatherReading, HourlyForecast, DailyForecast, DistrictVsPanchayatComparison } from '../types';

export const PANCHAYAT_WEATHER: Record<string, WeatherReading> = {
  'panchayat-bhangar-1': {
    temp: 29.4,
    feelsLike: 34.2,
    humidity: 82,
    windSpeed: 24,
    windDirection: 'SSE (165°)',
    rainProbability: 85,
    rainfallMm: 42.5,
    pressure: 1004.2,
    uvIndex: 4,
    soilMoisture: 78,
    condition: 'Heavy Localized Showers with Gusty Winds',
    conditionBengali: 'দমকা হাওয়া সহ ভারী স্থানীয় বৃষ্টিপাত',
    conditionHindi: 'तेज हवाओं के साथ भारी स्थानीय वर्षा',
    icon: 'cloud-rain',
    riskConfidence: 91,
    lastUpdated: 'Today at 08:30 PM IST',
    dataSource: 'IMD AWS Radar + KrishiKavach Downscaled Micro-Grid Model',
    validityPeriod: 'Next 12 Hours (Valid till 08:30 AM Tomorrow)',
    isDownscaled: true
  },
  'panchayat-canning-2': {
    temp: 28.1,
    feelsLike: 33.8,
    humidity: 89,
    windSpeed: 38,
    windDirection: 'S (180°)',
    rainProbability: 95,
    rainfallMm: 68.0,
    pressure: 998.6,
    uvIndex: 3,
    soilMoisture: 92,
    condition: 'Severe Coastal Squall & Flash Inundation Alert',
    conditionBengali: 'তীব্র উপকূলীয় ঝড় ও আকস্মিক প্লাবনের সতর্কতা',
    conditionHindi: 'गंभीर तटीय तूफान और अचानक बाढ़ की चेतावनी',
    icon: 'cloud-lightning',
    riskConfidence: 94,
    lastUpdated: 'Today at 08:30 PM IST',
    dataSource: 'IMD Doppler Radar Kolkata + KrishiKavach Coastal Micro-Grid',
    validityPeriod: 'Next 18 Hours',
    isDownscaled: true
  },
  'panchayat-singur': {
    temp: 31.0,
    feelsLike: 35.0,
    humidity: 71,
    windSpeed: 14,
    windDirection: 'E (90°)',
    rainProbability: 45,
    rainfallMm: 8.5,
    pressure: 1008.1,
    uvIndex: 7,
    soilMoisture: 54,
    condition: 'Intermittent Thunderhead Formations',
    conditionBengali: 'মাঝে মাঝে বজ্রগর্ভ মেঘ ও হালকা বৃষ্টি',
    conditionHindi: 'रुक-रुक कर गरज के साथ बौछारें',
    icon: 'cloud-sun-rain',
    riskConfidence: 87,
    lastUpdated: 'Today at 08:15 PM IST',
    dataSource: 'IMD Regional Station + Topographical DEM Downscaling',
    validityPeriod: 'Next 24 Hours',
    isDownscaled: true
  },
  'panchayat-barasat-1': {
    temp: 32.2,
    feelsLike: 36.4,
    humidity: 65,
    windSpeed: 11,
    windDirection: 'SE (135°)',
    rainProbability: 20,
    rainfallMm: 1.2,
    pressure: 1010.4,
    uvIndex: 8,
    soilMoisture: 42,
    condition: 'Partly Cloudy, Favorable for Spraying',
    conditionBengali: 'আংশিক মেঘলা, কীটনাশক প্রয়োগের উপযুক্ত',
    conditionHindi: 'आंशिक रूप से बादल, छिड़काव के लिए अनुकूल',
    icon: 'sun',
    riskConfidence: 89,
    lastUpdated: 'Today at 08:30 PM IST',
    dataSource: 'NASA POWER Satellite Grid + KrishiKavach Interpolation',
    validityPeriod: 'Next 24 Hours',
    isDownscaled: true
  },
  'panchayat-memari-1': {
    temp: 30.5,
    feelsLike: 34.0,
    humidity: 74,
    windSpeed: 18,
    windDirection: 'NE (45°)',
    rainProbability: 55,
    rainfallMm: 14.0,
    pressure: 1006.8,
    uvIndex: 6,
    soilMoisture: 60,
    condition: 'Moderate Rain Squall Expected Late Night',
    conditionBengali: 'মধ্যরাতে মাঝারি বৃষ্টির সম্ভাবনা',
    conditionHindi: 'देर रात मध्यम बारिश की संभावना',
    icon: 'cloud-drizzle',
    riskConfidence: 86,
    lastUpdated: 'Today at 08:00 PM IST',
    dataSource: 'IMD Doppler Station + Crop Moisture Index',
    validityPeriod: 'Next 16 Hours',
    isDownscaled: true
  },
  'panchayat-digha-coastal': {
    temp: 27.8,
    feelsLike: 32.5,
    humidity: 91,
    windSpeed: 42,
    windDirection: 'SW (225°)',
    rainProbability: 88,
    rainfallMm: 52.0,
    pressure: 1000.2,
    uvIndex: 3,
    soilMoisture: 88,
    condition: 'High Wind Velocity & Marine Surge Warning',
    conditionBengali: 'উচ্চ বাতাসের গতিবেগ ও সামুদ্রিক জলোচ্ছ্বাস সতর্কতা',
    conditionHindi: 'तेज हवा और समुद्री लहरों की चेतावनी',
    icon: 'wind',
    riskConfidence: 93,
    lastUpdated: 'Today at 08:30 PM IST',
    dataSource: 'INCOIS Ocean Met + IMD Radar Digha',
    validityPeriod: 'Next 12 Hours',
    isDownscaled: true
  }
};

export const HOURLY_FORECASTS: HourlyForecast[] = [
  { time: '09 PM', temp: 29.2, rainProb: 75, rainfallMm: 8.2, condition: 'Showers', icon: 'cloud-rain', windSpeed: 22 },
  { time: '11 PM', temp: 28.4, rainProb: 90, rainfallMm: 16.5, condition: 'Heavy Downpour', icon: 'cloud-rain', windSpeed: 28 },
  { time: '01 AM', temp: 27.8, rainProb: 85, rainfallMm: 12.0, condition: 'Thunderstorm', icon: 'cloud-lightning', windSpeed: 26 },
  { time: '03 AM', temp: 27.0, rainProb: 60, rainfallMm: 4.8, condition: 'Light Rain', icon: 'cloud-drizzle', windSpeed: 19 },
  { time: '05 AM', temp: 26.5, rainProb: 35, rainfallMm: 1.0, condition: 'Cloudy Dawn', icon: 'cloud', windSpeed: 14 },
  { time: '07 AM', temp: 27.8, rainProb: 20, rainfallMm: 0.0, condition: 'Morning Sun with Mist', icon: 'cloud-sun', windSpeed: 12 },
  { time: '09 AM', temp: 30.1, rainProb: 15, rainfallMm: 0.0, condition: 'Partly Sunny', icon: 'sun', windSpeed: 10 },
  { time: '11 AM', temp: 32.5, rainProb: 25, rainfallMm: 0.2, condition: 'Warm & Humid', icon: 'sun', windSpeed: 15 },
  { time: '01 PM', temp: 33.8, rainProb: 30, rainfallMm: 0.5, condition: 'Humid Convection', icon: 'cloud-sun', windSpeed: 17 },
  { time: '03 PM', temp: 32.2, rainProb: 50, rainfallMm: 3.4, condition: 'Afternoon Showers', icon: 'cloud-rain', windSpeed: 21 },
  { time: '05 PM', temp: 30.4, rainProb: 65, rainfallMm: 6.8, condition: 'Evening Storm Cell', icon: 'cloud-rain', windSpeed: 24 },
  { time: '07 PM', temp: 29.0, rainProb: 40, rainfallMm: 2.1, condition: 'Clearing Skies', icon: 'cloud', windSpeed: 16 }
];

export const DAILY_FORECASTS: DailyForecast[] = [
  { day: 'Today', date: '05 Sep', minTemp: 26, maxTemp: 32, rainProb: 85, rainfallMm: 42.5, condition: 'Heavy Rain & Squall', icon: 'cloud-rain', severity: 'high', advisorySummary: 'Delay field irrigation; secure unthreshed crops under tarpaulins.' },
  { day: 'Tomorrow', date: '06 Sep', minTemp: 25, maxTemp: 31, rainProb: 70, rainfallMm: 24.0, condition: 'Scattered Thunderstorms', icon: 'cloud-lightning', severity: 'moderate', advisorySummary: 'Drain excess water from nursery seedbeds and low-lying vegetable plots.' },
  { day: 'Sunday', date: '07 Sep', minTemp: 26, maxTemp: 33, rainProb: 35, rainfallMm: 3.2, condition: 'Partly Cloudy & Humid', icon: 'cloud-sun', severity: 'info', advisorySummary: 'Safe window for post-rain soil assessment; avoid nitrogen fertilizer.' },
  { day: 'Monday', date: '08 Sep', minTemp: 27, maxTemp: 34, rainProb: 20, rainfallMm: 0.5, condition: 'Clear Sunshine', icon: 'sun', severity: 'info', advisorySummary: 'Ideal day for foliar pesticide application and solar drying of paddy grain.' },
  { day: 'Tuesday', date: '09 Sep', minTemp: 27, maxTemp: 35, rainProb: 15, rainfallMm: 0.0, condition: 'Bright & Dry', icon: 'sun', severity: 'info', advisorySummary: 'Resume scheduled drip/sprinkler irrigation for vegetable saplings.' },
  { day: 'Wednesday', date: '10 Sep', minTemp: 28, maxTemp: 35, rainProb: 25, rainfallMm: 1.1, condition: 'Warm with Light Breeze', icon: 'cloud-sun', severity: 'info', advisorySummary: 'Favorable conditions for mustard bed preparation.' },
  { day: 'Thursday', date: '11 Sep', minTemp: 26, maxTemp: 33, rainProb: 45, rainfallMm: 7.8, condition: 'Isolated Light Showers', icon: 'cloud-drizzle', severity: 'moderate', advisorySummary: 'Keep drainage ditches clear ahead of localized weekend drizzle.' }
];

export const DISTRICT_VS_PANCHAYAT_COMPARISONS: Record<string, DistrictVsPanchayatComparison> = {
  'panchayat-bhangar-1': {
    districtName: 'South 24 Parganas District (IMD District Forecast)',
    panchayatName: 'Bhangar-I Gram Panchayat (KrishiKavach Hyperlocal)',
    districtForecast: {
      condition: 'Generally Cloudy with Light Rain (10-15mm)',
      rainProb: 35,
      temp: '27°C - 33°C',
      resolution: 'District Grid Cell (~25 km x 25 km)',
      warning: 'No district-level alert issued'
    },
    panchayatForecast: {
      condition: 'Intense Localized Convective Cell (42.5mm)',
      rainProb: 85,
      temp: '26°C - 29°C',
      resolution: 'Panchayat Micro-Grid (~2.5 km x 2.5 km)',
      warning: 'High Risk Alert: Waterlogging in Low-lying Aman Paddy',
      localizedFeature: 'Wetland depression & micro-convective storm line'
    },
    downscalingReason: 'Regional meteorological station at Alipore captures aggregate district weather, failing to detect the high surface humidity and topographic drainage basin of the Bhangar wetland corridor which triggers intense afternoon convective cells.'
  },
  'panchayat-canning-2': {
    districtName: 'South 24 Parganas District (IMD District Forecast)',
    panchayatName: 'Canning-II Gram Panchayat (KrishiKavach Hyperlocal)',
    districtForecast: {
      condition: 'Moderate Rain over Coast',
      rainProb: 55,
      temp: '28°C - 32°C',
      resolution: 'District Average',
      warning: 'Fishermen cautionary advisory'
    },
    panchayatForecast: {
      condition: 'Critical Marine Surge & 68mm Torrential Rain',
      rainProb: 95,
      temp: '26°C - 28°C',
      resolution: 'Estuary Catchment Hyperlocal Grid',
      warning: 'Critical Alert: River Matla High Tide Inundation Risk',
      localizedFeature: 'Matla river tidal confluence & delta mangrove buffer'
    },
    downscalingReason: 'KrishiKavach incorporates lunar tidal schedules with local GIS contour elevation (4.2m above sea level) to warn of dyke overflow, which district-wide averages omit.'
  }
};
