import { getCyclePhase } from './cycleEngine'

// Multi-lingual anatomical location dictionary (English, Hinglish, Hindi, Bengali, Tamil, Telugu, Marathi).
// Sorted longest-match-first to prevent partial collisions.
const LOCATION_PATTERNS = [
  // Compound English locations
  ['lower left pelvic', 'Pelvic — Lower Left'],
  ['lower right pelvic', 'Pelvic — Lower Right'],
  ['left pelvic', 'Pelvic — Lower Left'],
  ['right pelvic', 'Pelvic — Lower Right'],
  ['lower left abdomen', 'Abdominal — Lower Left'],
  ['lower right abdomen', 'Abdominal — Lower Right'],
  ['lower back', 'Lumbar / Lower Back'],
  ['lower abdomen', 'Abdominal — Lower'],
  ['pelvic', 'Pelvic — General'],
  ['abdomen', 'Abdominal — General'],
  ['abdominal', 'Abdominal — General'],

  // Hindi / Hinglish locations
  ['niche pet', 'Pelvic / Lower Abdominal (निचला पेट)'],
  ['pet ke niche', 'Pelvic / Lower Abdominal (निचला पेट)'],
  ['baye pet', 'Abdominal — Lower Left (बायां पेट)'],
  ['daye pet', 'Abdominal — Lower Right (दायां पेट)'],
  ['kamar dard', 'Lumbar / Lower Back (कमर दर्द)'],
  ['kamar me', 'Lumbar / Lower Back (कमर में)'],
  ['kamar', 'Lumbar / Lower Back (कमर)'],
  ['sir dard', 'Cranial / Head (सिरदर्द)'],
  ['sar dard', 'Cranial / Head (सरदर्द)'],
  ['sir me', 'Cranial / Head (सिर में)'],
  ['sar me', 'Cranial / Head (सर में)'],
  ['pet me', 'Abdominal — General (पेट में)'],
  ['pet dard', 'Abdominal — General (पेट दर्द)'],
  ['pet', 'Abdominal — General (पेट)'],
  ['chhati', 'Breast / Chest (छाती)'],
  ['stan', 'Breast / Chest (स्तन)'],
  ['jodon', 'Joints (जोड़ों का दर्द)'],
  ['jodo', 'Joints (जोड़ों का दर्द)'],
  ['gardan', 'Cervical / Neck (गर्दन)'],
  ['pair', 'Lower Limb (पैरों में दर्द)'],
  ['tang', 'Lower Limb (टांगों में दर्द)'],
  ['pith', 'Lumbar / Back (पीठ)'],

  // Devanagari Hindi locations
  ['निचले पेट', 'Pelvic / Lower Abdominal (निचला पेट)'],
  ['पेट में', 'Abdominal — General (पेट में)'],
  ['पेट दर्द', 'Abdominal — General (पेट दर्द)'],
  ['पेट', 'Abdominal — General (पेट)'],
  ['कमर दर्द', 'Lumbar / Lower Back (कमर दर्द)'],
  ['कमर में', 'Lumbar / Lower Back (कमर में)'],
  ['कमर', 'Lumbar / Lower Back (कमर)'],
  ['सिरदर्द', 'Cranial / Head (सिरदर्द)'],
  ['सिर दर्द', 'Cranial / Head (सिर दर्द)'],
  ['सिर में', 'Cranial / Head (सिर में)'],
  ['सिर', 'Cranial / Head (सिर)'],
  ['छाती', 'Breast / Chest (छाती)'],
  ['स्तन', 'Breast / Chest (स्तन)'],
  ['जोड़ों में', 'Joints (जोड़ों में)'],
  ['जोड़ों', 'Joints (जोड़ों)'],
  ['पैरों में', 'Lower Limb (पैरों में)'],
  ['पैरों', 'Lower Limb (पैरों)'],
  ['पीठ में', 'Lumbar / Back (पीठ में)'],

  // Bengali (বাংলা) locations
  ['তলপেটে', 'Pelvic / Lower Abdominal (তলপেট)'],
  ['তলপেট', 'Pelvic / Lower Abdominal (তলপেট)'],
  ['পেটে', 'Abdominal — General (পেটে)'],
  ['পেট', 'Abdominal — General (পেট)'],
  ['কোমরে ব্যথা', 'Lumbar / Lower Back (কোমর ব্যথা)'],
  ['কোমরে', 'Lumbar / Lower Back (কোমরে)'],
  ['কোমর', 'Lumbar / Lower Back (কোমর)'],
  ['মাথা ব্যথা', 'Cranial / Head (মাথা ব্যথা)'],
  ['মাথাব্যথা', 'Cranial / Head (মাথাব্যথা)'],
  ['মাথায়', 'Cranial / Head (মাথায়)'],
  ['বুকে', 'Breast / Chest (বুকে)'],
  ['পায়ে', 'Lower Limb (পায়ে)'],
  ['জরায়ু', 'Pelvic / Uterine (জরায়ু)'],

  // Tamil (தமிழ்) locations
  ['அடிவயிற்றில்', 'Pelvic / Lower Abdominal (அடிவயிறு)'],
  ['அடிவயிறு', 'Pelvic / Lower Abdominal (அடிவயிறு)'],
  ['வயிற்றில்', 'Abdominal — General (வயிறு)'],
  ['வயிறு வலி', 'Abdominal — General (வயிறு வலி)'],
  ['வயிறு', 'Abdominal — General (வயிறு)'],
  ['இடுப்பு வலி', 'Lumbar / Lower Back (இடுப்பு வலி)'],
  ['இடுப்பில்', 'Lumbar / Lower Back (இடுப்பு)'],
  ['இடுப்பு', 'Lumbar / Lower Back (இடுப்பு)'],
  ['தலைவலி', 'Cranial / Head (தலைவலி)'],
  ['தலையில்', 'Cranial / Head (தலை)'],
  ['மார்பில்', 'Breast / Chest (மார்பு)'],
  ['கால் வலி', 'Lower Limb (கால் வலி)'],
  ['மூட்டு வலி', 'Joints (மூட்டு வலி)'],

  // Telugu (తెలుగు) locations
  ['అడి కడుపు', 'Pelvic / Lower Abdominal (అడి కడుపు)'],
  ['కడుపులో', 'Abdominal — General (కడుపులో)'],
  ['కడుపు నొప్పి', 'Abdominal — General (కడుపు నొప్పి)'],
  ['కడుపు', 'Abdominal — General (కడుపు)'],
  ['నడుము నొప్పి', 'Lumbar / Lower Back (నడుము నొప్పి)'],
  ['తలనొప్పి', 'Cranial / Head (తలనొప్పి)'],

  // Marathi (मराठी) locations
  ['खालच्या पोटात', 'Pelvic / Lower Abdominal (खालचे पोट)'],
  ['पोटात', 'Abdominal — General (पोटात)'],
  ['पोटदुखी', 'Abdominal — General (पोटदुखी)'],
  ['कंबरदुखी', 'Lumbar / Lower Back (कंबरदुखी)'],
  ['डोकेदुखी', 'Cranial / Head (डोकेदुखी)'],

  // Standard General organs
  ['bowel', 'Bowel / GI'],
  ['rectal', 'Rectal'],
  ['headache', 'Cranial / Head'],
  ['migraine', 'Cranial / Head'],
  ['head', 'Cranial / Head'],
  ['breast', 'Breast / Chest'],
  ['chest', 'Breast / Chest'],
  ['joint', 'Joints'],
  ['back', 'Lumbar / Lower Back'],
  ['ovary', 'Pelvic — Ovarian'],
  ['ovaries', 'Pelvic — Ovarian'],
  ['leg', 'Lower Limb'],
  ['skin', 'Dermatological'],
]

// Multi-lingual symptom & modifier dictionary
const MODIFIER_PATTERNS = [
  // Escalating & Comparative Pain (e.g. "kal se zyada")
  ['kal se zyada', 'Escalating Severity (कल से ज्यादा)'],
  ['pehle se zyada', 'Escalating Severity (पहले से ज्यादा)'],
  ['kal se jyada', 'Escalating Severity (कल से ज्यादा)'],
  ['pehle se jyada', 'Escalating Severity (पहले से ज्यादा)'],
  ['kal se tez', 'Escalating Severity (कल से तेज़)'],
  ['kal ke cheye beshi', 'Escalating Severity (কালকের চেয়ে বেশি)'],
  ['কালকের চেয়ে বেশি', 'Escalating Severity (কালকের চেয়ে বেশি)'],
  ['நேற்றை விட அதிகம்', 'Escalating Severity (நேற்றை விட அதிகம்)'],
  ['kalakante ekkuva', 'Escalating Severity (గతరోజు కంటే ఎక్కువ)'],
  ['kalpeksha jast', 'Escalating Severity (कालपेक्षा जास्त)'],

  // Pain Types in Hindi / Hinglish
  ['bahut dard', 'Severe Pain (बहुत दर्द)'],
  ['bohot dard', 'Severe Pain (बहुत दर्द)'],
  ['tez dard', 'Sharp / Acute Pain (तेज़ दर्द)'],
  ['tez', 'Sharp'],
  ['marod', 'Cramping / Spasms (मरोड़)'],
  ['aithan', 'Cramping / Spasms (ऐंठन)'],
  ['chubhan', 'Stabbing Pain (चुभन)'],
  ['jalan', 'Burning Sensation (जलन)'],
  ['dard', 'Pain / Discomfort (दर्द)'],
  ['kasak', 'Aching Pain (कसक)'],

  // Devanagari Hindi
  ['बहुत दर्द', 'Severe Pain (बहुत दर्द)'],
  ['तेज़ दर्द', 'Sharp / Acute Pain (तेज़ दर्द)'],
  ['असहनीय दर्द', 'Excruciating Pain (असहनीय दर्द)'],
  ['मरोड़', 'Cramping / Spasms (मरोड़)'],
  ['ऐंठन', 'Cramping / Spasms (ऐंठन)'],
  ['चुभन', 'Stabbing Pain (चुभन)'],
  ['जलन', 'Burning Sensation (जलन)'],
  ['दर्द', 'Pain / Discomfort (दर्द)'],

  // Bengali (বাংলা)
  ['খুব তীব্র যন্ত্রণা', 'Severe Pain (খুব তীব্র যন্ত্রণা)'],
  ['তীব্র যন্ত্রণা', 'Severe Pain (তীব্র যন্ত্রণা)'],
  ['খুব ব্যথা', 'Severe Pain (খুব ব্যথা)'],
  ['কামড়ানো', 'Cramping / Spasms (কামড়ানো)'],
  ['যন্ত্রণা', 'Pain (যন্ত্রণা)'],
  ['ব্যথা', 'Pain (ব্যথা)'],
  ['জ্বালা পোড়া', 'Burning Sensation (জ্বালা পোড়া)'],

  // Tamil (தமிழ்)
  ['கடுமையான வலி', 'Severe Pain (கடுமையான வலி)'],
  ['தாங்க முடியாத வலி', 'Excruciating Pain (தாங்க முடியாத வலி)'],
  ['பிடிப்பு', 'Cramping (பிடிப்பு)'],
  ['குடைச்சல்', 'Aching / Throbbing (குடைச்சல்)'],
  ['எரிச்சல்', 'Burning Sensation (எரிச்சல்)'],
  ['வலி', 'Pain (வலி)'],

  // Nausea & GI in Regional Languages
  ['ulti jaisa', 'Nausea (उल्टी जैसा लगना)'],
  ['ulti lag rahi', 'Nausea (उल्टी लगना)'],
  ['ulti', 'Nausea / Vomiting (उल्टी)'],
  ['matli', 'Nausea (मतली)'],
  ['jee ghabrana', 'Nausea / Malaise (जी घबराना)'],
  ['gas banna', 'Bloating / Gas (गैस बनना)'],
  ['pet phoolna', 'Bloating (पेट फूलना)'],
  ['उल्टी', 'Nausea / Vomiting (उल्टी)'],
  ['जी मिचलाना', 'Nausea (जी मिचलाना)'],
  ['বমি ভাব', 'Nausea (বমি ভাব)'],
  ['বমি', 'Vomiting (বমি)'],
  ['வாந்தி உணர்வு', 'Nausea (வாந்தி உணர்வு)'],
  ['வாந்தி', 'Vomiting (வாந்தி)'],

  // Fatigue, Weakness & Mood
  ['bahut thakan', 'Severe Fatigue (बहुत थकान)'],
  ['thakan', 'Fatigue (थकान)'],
  ['kamzori', 'Weakness (कमज़ोरी)'],
  ['sust', 'Lethargy (सुस्ती)'],
  ['chiddchida', 'Irritability (चिड़चिड़ापन)'],
  ['ghabrahat', 'Anxiety (घबराहट)'],
  ['chakkar', 'Dizziness (चक्कर आना)'],
  ['mood kharab', 'Mood Changes (मूड खराब)'],
  ['neend nahi', 'Insomnia (नींद न आना)'],
  ['थकान', 'Fatigue (थकान)'],
  ['कमज़ोरी', 'Weakness (कमज़ोरी)'],
  ['चक्कर', 'Dizziness (चक्कर)'],
  ['चिड़चिड़ापन', 'Irritability (चिड़चिड़ापन)'],
  ['घबराहट', 'Anxiety (घबराहट)'],
  ['ক্লান্তি', 'Fatigue (ক্লান্তি)'],
  ['দুর্বলতা', 'Weakness (দুর্বলতা)'],
  ['মাথা ঘোরা', 'Dizziness (মাথা ঘোরা)'],
  ['சோர்வு', 'Fatigue (சோர்வு)'],
  ['மயக்கம்', 'Dizziness (மயக்கம்)'],

  // Bleeding & Flow
  ['bhaari bleeding', 'Heavy Menstrual Flow (भारी रक्तस्राव)'],
  ['zyada bleeding', 'Heavy Menstrual Flow (ज़्यादा रक्तस्राव)'],
  ['zyada khoon', 'Heavy Flow (ज़्यादा खून)'],
  ['khoon ke thakke', 'Blood Clots (खून के थक्के)'],
  ['daag', 'Intermenstrual Spotting (दाग/स्पॉटिंग)'],
  ['भारी रक्तस्राव', 'Heavy Menstrual Flow (भारी रक्तस्राव)'],
  ['रक्त के थक्के', 'Blood Clots (रक्त के थक्के)'],
  ['অতিরিক্ত রক্তপাত', 'Heavy Menstrual Flow (অতিরিক্ত রক্তপাত)'],
  ['அதிக இரத்தப்போக்கு', 'Heavy Menstrual Flow (அதிக இரத்தப்போக்கு)'],

  // English standard keywords
  ['sharp', 'Sharp'],
  ['dull', 'Dull'],
  ['stabbing', 'Stabbing'],
  ['throbbing', 'Throbbing'],
  ['cramping', 'Cramping'],
  ['cramps', 'Cramping'],
  ['burning', 'Burning'],
  ['radiating', 'Radiating'],
  ['nausea', 'Nausea'],
  ['nauseous', 'Nausea'],
  ['vomit', 'Vomiting'],
  ['brain fog', 'Brain Fog'],
  ['fatigue', 'Fatigue'],
  ['exhausted', 'Fatigue'],
  ['tired', 'Fatigue'],
  ['bloating', 'Bloating'],
  ['bloated', 'Bloating'],
  ['after coffee', 'Postprandial (Coffee)'],
  ['after eating', 'Postprandial (Meal)'],
  ['after meals', 'Postprandial (Meal)'],
  ['heavy bleeding', 'Heavy Menstrual Flow'],
  ['heavy flow', 'Heavy Menstrual Flow'],
  ['spotting', 'Intermenstrual Spotting'],
  ['acne', 'Acne Flare'],
  ['hot flash', 'Hot Flashes'],
  ['night sweat', 'Night Sweats'],
  ['insomnia', 'Insomnia'],
  ['cant sleep', 'Insomnia'],
  ["can't sleep", 'Insomnia'],
  ['mood swing', 'Mood Swings'],
  ['irritab', 'Irritability'],
  ['anxious', 'Anxiety'],
  ['anxiety', 'Anxiety'],
  ['dizzy', 'Dizziness'],
  ['dizziness', 'Dizziness'],
  ['constipat', 'Constipation'],
  ['diarrhea', 'Diarrhea'],
  ['tender', 'Tenderness'],
  ['craving', 'Food Cravings'],
  ['low energy', 'Low Energy'],
  ['painful periods', 'Dysmenorrhea'],
  ['pain during sex', 'Dyspareunia'],
  ['pain with bowel', 'Cyclical Bowel Pain'],
  ['hair loss', 'Hair Thinning'],
  ['weight gain', 'Weight Gain'],
  ['sudden', 'Sudden Onset'],
  ['gradual', 'Gradual Onset'],
]

const ONSET_PATTERNS = [
  ['subah se', 'Morning Onset (सुबह से)'],
  ['aaj subah', 'Morning Onset (आज सुबह)'],
  ['dopahar', 'Afternoon Onset (दोपहर)'],
  ['shaam', 'Evening Onset (शाम)'],
  ['raat', 'Night Onset (रात)'],
  ['सुबह से', 'Morning Onset (सुबह से)'],
  ['সকাল থেকে', 'Morning Onset (সকাল থেকে)'],
  ['காலை முதல்', 'Morning Onset (காலை முதல்)'],
  ['woke up', 'Morning Onset'],
  ['this morning', 'Morning Onset'],
  ['morning', 'Morning Onset'],
  ['afternoon', 'Afternoon Onset'],
  ['evening', 'Evening Onset'],
  ['night', 'Night Onset'],
]

/**
 * Extracts a clinical 0-10 severity score across languages, including
 * colloquial escalation expressions like "kal se zyada", "bahut dard",
 * "খুব ব্যথা", or "கடுமையான வலி".
 */
export function extractSeverity(text) {
  // Check for explicit standard numbers: "8/10", "8 out of 10", "8 mein se 10"
  const match = text.match(/(\d{1,2})\s*(?:\/|out of|mein se|মে|இல்)\s*10/i)
  if (match) {
    const n = parseInt(match[1], 10)
    return Math.min(Math.max(n, 0), 10)
  }

  // Devanagari numerals: e.g. ८/१० or 8/10
  const devaMatch = text.match(/([०-९]{1,2})\s*\/\s*[०-९]{1,2}/)
  if (devaMatch) {
    const map = { '०': 0, '१': 1, '२': 2, '३': 3, '४': 4, '५': 5, '६': 6, '७': 7, '८': 8, '९': 9 }
    const num = devaMatch[1].split('').reduce((acc, c) => acc * 10 + (map[c] || 0), 0)
    return Math.min(Math.max(num, 0), 10)
  }

  // Escalating comparative pain: "kal se zyada" / "pehle se zyada" = high distress (8)
  if (
    /kal se zyada|kal se jyada|pehle se zyada|pehle se jyada|kal se tez|kalakante ekkuva|kalpeksha jast/i.test(text) ||
    /কালকের চেয়ে বেশি|நேற்றை விட அதிகம்/i.test(text)
  ) {
    return 8
  }

  // Severe qualifiers in English, Hindi/Hinglish, Bengali, Tamil, Telugu, Marathi
  if (
    /severe|excruciating|unbearable|debilitating/i.test(text) ||
    /bahut dard|bohot dard|sehn nahi|ashahniya|asahy|behad dard|jaan nikal rahi/i.test(text) ||
    /बहुत दर्द|तेज़ दर्द|असहनीय दर्द/i.test(text) ||
    /খুব তীব্র যন্ত্রণা|তীব্র যন্ত্রণা|খুব ব্যথা|অসহ্য/i.test(text) ||
    /கடுமையான வலி|தாங்க முடியாத வலி|கொடும் வலி/i.test(text) ||
    /చాలా నొప్పి|తీవ్రమైన నొప్పి/i.test(text) ||
    /खूप दुखत|असह्य वेदना/i.test(text)
  ) {
    return 8
  }

  // Mild qualifiers
  if (
    /mild|slight|minimal/i.test(text) ||
    /thoda dard|thoda sa|halka|halka dard/i.test(text) ||
    /थोड़ा दर्द|हल्का दर्द|हल्का/i.test(text) ||
    /একটু ব্যথা|সামান্য/i.test(text) ||
    /சிறிது வலி|லேசான வலி/i.test(text) ||
    /కొద్దిగా నొప్పి|స్వల్ప/i.test(text) ||
    /थोडे दुखणे/i.test(text)
  ) {
    return 3
  }

  // Moderate qualifiers
  if (
    /moderate/i.test(text) ||
    /madhyam|beech ka|thik thak|sahan ho raha/i.test(text) ||
    /मध्यम|ठीक-ठाक/i.test(text) ||
    /মাঝারি/i.test(text) ||
    /மிதமான/i.test(text) ||
    /మధ్యస్థ/i.test(text)
  ) {
    return 5
  }

  // Default clinical moderate baseline
  return 5
}

export function severityTier(score) {
  if (score >= 7) return { label: 'High (उच्च)', color: 'bg-[#FCE7E8] text-[#D96B85] border-[#D96B85]/40' }
  if (score >= 4) return { label: 'Moderate (मध्यम)', color: 'bg-[#FDF8EE] text-[#D9A84E] border-[#D9A84E]/40' }
  return { label: 'Low (हल्का)', color: 'bg-[#E8EFE3] text-[#405A43] border-[#405A43]/30' }
}

/**
 * Main parser that translates natural spoken input in English, Hindi,
 * Bengali, Tamil, Telugu, Marathi, or Hinglish into structured clinical fields.
 */
export function parseSymptomText(rawText, currentDay, cycleLength) {
  const text = rawText.toLowerCase()

  const severity = extractSeverity(text)

  let location = 'Unspecified / Systemic (सामान्य)'
  for (const [key, label] of LOCATION_PATTERNS) {
    if (text.includes(key.toLowerCase())) {
      location = label
      break
    }
  }

  const modifiers = []
  for (const [key, label] of MODIFIER_PATTERNS) {
    if (text.includes(key.toLowerCase()) && !modifiers.includes(label)) {
      modifiers.push(label)
    }
  }
  for (const [key, label] of ONSET_PATTERNS) {
    if (text.includes(key.toLowerCase()) && !modifiers.includes(label)) {
      modifiers.push(label)
    }
  }
  if (modifiers.length === 0) modifiers.push('General / Cyclical Pattern')

  const phase = getCyclePhase(currentDay, cycleLength)

  return {
    id: `sym-${Date.now()}-${Math.round(Math.random() * 1000)}`,
    rawText,
    location,
    severity,
    modifiers,
    phase,
    day: currentDay,
    timestamp: new Date().toISOString(),
  }
}

/**
 * Generates natural spoken spoken-audio confirmation for low-literacy users
 * in their selected regional language using browser SpeechSynthesis.
 */
export function generateRegionalAudioSummary(parsed, langCode = 'hi-IN') {
  const loc = parsed.location.split('(')[0].trim()
  const mods = parsed.modifiers.slice(0, 2).map((m) => m.split('(')[0].trim()).join(', ')

  if (langCode.startsWith('hi')) {
    return `लक्षण दर्ज किया गया: जगह ${loc}, दर्द का स्तर १० में से ${parsed.severity}, लक्षण: ${mods}। चक्र दिवस ${parsed.day}।`
  }
  if (langCode.startsWith('bn')) {
    return `লক্ষণ নথিভুক্ত হয়েছে: স্থান ${loc}, তীব্রতা ১০ এর মধ্যে ${parsed.severity}, লক্ষণ: ${mods}। চক্র দিবস ${parsed.day}।`
  }
  if (langCode.startsWith('ta')) {
    return `அறிகுறி பதிவு செய்யப்பட்டது: இடம் ${loc}, வலி அளவு ۱۰ இல் ${parsed.severity}, நிலைகள்: ${mods}। சுழற்சி நாள் ${parsed.day}।`
  }
  if (langCode.startsWith('te')) {
    return `లక్షణం నమోదు చేయబడింది: ప్రదేశం ${loc}, నొప్పి స్థాయి ۱۰ లో ${parsed.severity}। రోజు ${parsed.day}।`
  }
  if (langCode.startsWith('mr')) {
    return `लक्षण नोंदवले गेले: जागा ${loc}, वेदना पातळी १० पैकी ${parsed.severity}। दिवस ${parsed.day}।`
  }
  return `Symptom logged: Location ${loc}, Severity score ${parsed.severity} out of 10, Modifiers: ${mods}. Cycle Day ${parsed.day}.`
}
