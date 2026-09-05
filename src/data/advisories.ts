import { CropAdvisory } from '../types';

export const CROP_ADVISORIES: CropAdvisory[] = [
  {
    id: 'adv-paddy-veg-01',
    cropId: 'crop-paddy',
    cropName: 'Aman Paddy (ধান)',
    hindiName: 'अमन धान',
    bengaliName: 'আমন ধান',
    growthStage: 'vegetative',
    stageLabel: {
      en: 'Vegetative / Active Tillering',
      hi: 'वानस्पतिक / कल्ले फूटने की अवस्था',
      bn: 'অঙ্গজ বৃদ্ধি / পাশকাটি বের হওয়ার দশা'
    },
    soilType: 'Clayey Alluvial',
    weatherConditionTrigger: 'Heavy Convective Showers (>35mm expected)',
    todayAction: {
      en: 'Open drainage outlets at field corners. Ensure water level does not exceed 5 cm above root zone to prevent tiller rot.',
      hi: 'खेत के कोनों पर जल निकासी के निकास खोलें। कल्ले गलने से रोकने के लिए सुनिश्चित करें कि पानी का स्तर 5 सेमी से अधिक न हो।',
      bn: 'জমির কোণে নিকাশি নালা খুলে দিন। পাশকাটি পচন রোধ করতে শিকড় স্তরে জল যাতে ৫ সেমির বেশি না জমে তা নিশ্চিত করুন।'
    },
    irrigationGuidance: {
      en: 'Strictly suspend canal and tube-well irrigation for the next 48 hours.',
      hi: 'अगले 48 घंटों के लिए नहर और नलकूप सिंचाई पूरी तरह से स्थगित रखें।',
      bn: 'আগামী ৪৮ ঘণ্টার জন্য খাল ও নলকূপের সেচ সম্পূর্ণরূপে বন্ধ রাখুন।'
    },
    pestDiseasePrecaution: {
      en: 'High atmospheric humidity (82%) favors Bacterial Leaf Blight (BLB). If yellowing leaves appear after rain, spray Streptocycline (1g in 10L water) during a dry sunny spell.',
      hi: 'उच्च वायुमंडलीय आर्द्रता (82%) जीवाणु पत्ती झुलसा (बीएलबी) को बढ़ावा देती है। बारिश के बाद पत्तियां पीली होने पर धूप निकलने पर स्ट्रेप्टोसाइक्लिन (1 ग्राम प्रति 10 लीटर पानी) का छिड़काव करें।',
      bn: 'উচ্চ আর্দ্রতা (৮২%) ব্যাকটিরিয়াল ব্লাইটের ঝুঁকি বাড়ায়। বৃষ্টির পর পাতা হলুদ হলে রোদ উঠলে স্ট্রেপ্টোসাইক্লিন (১ গ্রাম প্রতি ১০ লিটার জলে) স্প্রে করুন।'
    },
    fertilizerTiming: {
      en: 'Withhold second split application of Urea. Apply only when standing water recedes and sky clears.',
      hi: 'यूरिया की दूसरी खुराक रोकें। जब पानी निकल जाए और आसमान साफ हो तभी डालें।',
      bn: 'ইউরিয়ার দ্বিতীয় কিস্তি প্রয়োগ স্থগিত রাখুন। জল নামলে এবং আকাশ পরিষ্কার হলে প্রয়োগ করুন।'
    },
    harvestStorageAdvice: {
      en: 'Not applicable for vegetative stage. Keep bunds reinforced with vetiver grass.',
      hi: 'वानस्पतिक अवस्था के लिए लागू नहीं। मेड़ों को मजबूत रखें।',
      bn: 'অঙ্গজ দশার জন্য প্রযোজ্য নয়। জমির আল বা বাঁধ শক্ত রাখুন।'
    },
    priority: 'urgent',
    reason: 'Hyperlocal radar confirms 42.5mm rain cell converging over the Panchayat. Unregulated water retention causes premature tiller abortion.',
    validityPeriod: 'Valid for next 48 hours'
  },
  {
    id: 'adv-mustard-sow-02',
    cropId: 'crop-mustard',
    cropName: 'Yellow Mustard (সরিষা)',
    hindiName: 'पीली सरसों',
    bengaliName: 'হলুদ সরিষা',
    growthStage: 'sowing',
    stageLabel: {
      en: 'Land Preparation & Sowing',
      hi: 'खेत की तैयारी और बुवाई',
      bn: 'জমি তৈরি ও বীজ বপন'
    },
    soilType: 'Sandy Loam',
    weatherConditionTrigger: 'Intermittent Showers followed by Sunshine',
    todayAction: {
      en: 'Delay direct seed sowing until soil surface reaches "Joe" (optimum workable moisture condition). Wet sowing causes seed asphyxiation.',
      hi: 'जब तक मिट्टी में उचित नमी ("जो") न आ जाए, तब तक सीधी बुवाई टालें। अधिक गीली मिट्टी में बीज सड़ सकते हैं।',
      bn: 'মাটিতে উপযুক্ত রস ("জো") না আসা পর্যন্ত বীজ বোনা স্থগিত রাখুন। অতিরিক্ত ভেজা মাটিতে বীজ পচে যেতে পারে।'
    },
    irrigationGuidance: {
      en: 'No pre-sowing irrigation required as residual rain moisture is adequate.',
      hi: 'बुवाई से पहले सिंचाई की आवश्यकता नहीं है क्योंकि वर्षा की नमी पर्याप्त है।',
      bn: 'বপনের পূর্বে সেচের প্রয়োজন নেই, বৃষ্টির আর্দ্রতাই যথেষ্ট।'
    },
    pestDiseasePrecaution: {
      en: 'Treat seeds with Trichoderma viride @ 6g/kg or Carbendazim @ 2g/kg to shield against seedling damping-off in humid soil.',
      hi: 'आर्द्र मिट्टी में बीज सड़न से बचाव के लिए ट्राइकोडर्मा विरिडी (6 ग्राम/किग्रा) या कार्बेन्डाजिम (2 ग्राम/किग्रा) से बीज उपचारित करें।',
      bn: 'আর্দ্র মাটিতে চারার গোড়া পচা রোধ করতে ট্রাইকোডার্মা ভিরিডি (৬ গ্রাম/কেজি) দিয়ে বীজ শোধন করুন।'
    },
    fertilizerTiming: {
      en: 'Incorporate well-decomposed FYM (Farmyard Manure) @ 5 tonnes/ha with single super phosphate during final ploughing.',
      hi: 'अंतिम जुताई के दौरान सिंगल सुपर फॉस्फेट के साथ अच्छी सड़ी गोबर की खाद (5 टन/हेक्टेयर) मिलाएं।',
      bn: 'শেষ চাষের সময় সিঙ্গেল সুপার ফসফেটের সাথে ভালো পচা গোবর সার (৫ টন/হেক্টর) মিশিয়ে দিন।'
    },
    harvestStorageAdvice: {
      en: 'Store certified seeds in airtight moisture-proof metal bins or polylined bags off the ground.',
      hi: 'प्रमाणित बीजों को जमीन से ऊपर नमी-रोधी धातु की पेटियों में रखें।',
      bn: 'শোধন করা বীজ মাটির ওপর কাঠের তক্তার ওপর বায়ুরোধী পাত্রে রাখুন।'
    },
    priority: 'recommended',
    reason: 'Soil saturation index currently 74%; early sowing into saturated furrows cuts germination percentage by 35%.',
    validityPeriod: 'Valid for next 72 hours'
  },
  {
    id: 'adv-potato-tub-03',
    cropId: 'crop-potato',
    cropName: 'Potato Jyoti (আলু)',
    hindiName: 'आलू ज्योति',
    bengaliName: 'আলু জ্যোতি',
    growthStage: 'vegetative',
    stageLabel: {
      en: 'Tuber Initiation & Vegetative',
      hi: 'कंद बनना और वानस्पतिक वृद्धि',
      bn: 'কন্দ গঠন ও গাছের বৃদ্ধি'
    },
    soilType: 'Gangetic Loam',
    weatherConditionTrigger: 'Cloudy sky with nighttime relative humidity >85%',
    todayAction: {
      en: 'Inspect potato ridge furrows. If cloudy weather and mist persist for 48 hours, prophylactic spray of Mancozeb 75 WP @ 2.5g/L is advised against Late Blight.',
      hi: 'आलू की क्यारियों की जांच करें। यदि 48 घंटे बादल और कोहरा बना रहे, तो पिछेती झुलसा से बचाव के लिए मैनकोजेब 75 डब्ल्यूपी (2.5 ग्राम/लीटर) का छिड़काव करें।',
      bn: 'আলুর ভেলি পরীক্ষা করুন। মেঘলা আবহাওয়া ও কুয়াশা চললে নাবী ধসা রোগ দমনে ম্যানকোজেব ৭৫ ডব্লিউপি (২.৫ গ্রাম/লিটার) স্প্রে করুন।'
    },
    irrigationGuidance: {
      en: 'Light furrow irrigation only in alternate rows to prevent tuber rot.',
      hi: 'कंद सड़न रोकने के लिए केवल एक छोड़कर एक क्यारी में हल्की सिंचाई करें।',
      bn: 'কন্দ পচন রোধ করতে একটি অন্তর একটি ভেলিতে হালকা সেচ দিন।'
    },
    pestDiseasePrecaution: {
      en: 'Watch for green peach aphids under lower leaf surfaces. Yellow sticky traps (15 traps/ha) are recommended.',
      hi: 'निचली पत्तियों के नीचे माहू (एफिड) की निगरानी करें। पीले चिपचिपे जाल लगाएं।',
      bn: 'পাতার নিচের পিঠে শোষক পোকা লক্ষ্য করুন। জমিতে হলুদ স্টিকি ট্র্যাপ ব্যবহার করুন।'
    },
    fertilizerTiming: {
      en: 'Apply earthing-up top dressing of Potassium Sulphate (SOP) to boost tuber starch accumulation.',
      hi: 'कंदों के विकास के लिए मिट्टी चढ़ाते समय पोटेशियम सल्फेट डालें।',
      bn: 'গাছে মাটি তোলার সময় পটাশিয়াম সালফেট প্রয়োগ করুন।'
    },
    harvestStorageAdvice: {
      en: 'Keep previous harvest stored in clean cool ventilated storage at 10-12°C with CIPC sprout suppression.',
      hi: 'शीतगृहों में तापमान और नमी का समुचित प्रबंधन रखें।',
      bn: 'হিমাগারে যথাযথ তাপমাত্রা বজায় রেখে আলু সংরক্ষণ করুন।'
    },
    priority: 'urgent',
    reason: 'Downscaled micro-weather models predict dew duration exceeding 9.5 hours, crossing the critical Late Blight threshold.',
    validityPeriod: 'Valid for next 5 days'
  },
  {
    id: 'adv-tomato-flow-04',
    cropId: 'crop-tomato',
    cropName: 'Hybrid Tomato (টমেটো)',
    hindiName: 'टमाटर',
    bengaliName: 'টমেটো',
    growthStage: 'flowering',
    stageLabel: {
      en: 'Flowering & Early Fruit Set',
      hi: 'फूल आना और प्रारंभिक फल लगना',
      bn: 'ফুল আসা এবং প্রাথমিক ফল ধরা'
    },
    soilType: 'Sandy Loam',
    weatherConditionTrigger: 'Afternoon Heat (>34°C) with Gusty Wind',
    todayAction: {
      en: 'Spray Boron (Solubor 20%) @ 1g/L of water during morning hours to prevent blossom drop and improve fruit retention.',
      hi: 'फूलों को झड़ने से रोकने के लिए सुबह के समय बोरॉन (1 ग्राम/लीटर पानी) का छिड़काव करें।',
      bn: 'ফুল ঝরে পড়া আটকাতে এবং ভালো ফলন পেতে সকালে বোরন (১ গ্রাম/লিটার জলে) স্প্রে করুন।'
    },
    irrigationGuidance: {
      en: 'Maintain regular drip irrigation at 3-day intervals; sudden fluctuation in soil moisture causes fruit cracking.',
      hi: '3 दिन के अंतराल पर ड्रिप सिंचाई बनाए रखें; नमी में उतार-चढ़ाव से फल फटते हैं।',
      bn: 'নিয়মিত ড্রিপ সেচ দিন; মাটির রসে তারতম্য ঘটলে ফল ফেটে যেতে পারে।'
    },
    pestDiseasePrecaution: {
      en: 'Install pheromone traps for Tomato Pinworm (Tuta absoluta) and Fruit Borer @ 8 traps/acre.',
      hi: 'फल छेदक कीट के लिए फेरोमोन ट्रैप (8 ट्रैप प्रति एकड़) लगाएं।',
      bn: 'ফল ছিদ্রকারী পোকা দমনের জন্য জমিতে ফেরোমোন ফাঁদ লাগান।'
    },
    fertilizerTiming: {
      en: 'Fertigate with water-soluble 13:00:45 (Potassium Nitrate) @ 3 kg/acre once a week.',
      hi: 'ड्रिप के माध्यम से सप्ताह में एक बार 13:0:45 (पोटेशियम नाइट्रेट) 3 किग्रा/एकड़ दें।',
      bn: 'সপ্তাহে একবার ড্রিপের মাধ্যমে ১৩:০০:৪৫ সার প্রয়োগ করুন।'
    },
    harvestStorageAdvice: {
      en: 'Harvest fruits at "breaker stage" (pink tinge at blossom end) if heavy rain is forecasted in 3 days.',
      hi: 'यदि 3 दिनों में बारिश की संभावना हो तो फलों को थोड़ा पकने पर ही तोड़ लें।',
      bn: 'বৃষ্টির পূর্বাভাস থাকলে ফল পুরোপুরি লাল হওয়ার আগেই আধাপাকা অবস্থায় তুলুন।'
    },
    priority: 'recommended',
    reason: 'High wind velocity strips blossoms; Boron fortification strengthens pedicel attachment.',
    validityPeriod: 'Valid for next 4 days'
  }
];
