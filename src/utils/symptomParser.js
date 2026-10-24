import { getCyclePhase } from './cycleEngine'

// Longest-match-first anatomical location dictionary.
const LOCATION_PATTERNS = [
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

const MODIFIER_PATTERNS = [
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
  ['insomnia', "Insomnia"],
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
  ['woke up', 'Morning Onset'],
  ['this morning', 'Morning Onset'],
  ['morning', 'Morning Onset'],
  ['afternoon', 'Afternoon Onset'],
  ['evening', 'Evening Onset'],
  ['night', 'Night Onset'],
]

export function extractSeverity(text) {
  const match = text.match(/(\d{1,2})\s*(?:\/|out of)\s*10/i)
  if (match) {
    const n = parseInt(match[1], 10)
    return Math.min(Math.max(n, 0), 10)
  }
  if (/severe|excruciating|unbearable|debilitating/i.test(text)) return 8
  if (/moderate/i.test(text)) return 5
  if (/mild|slight/i.test(text)) return 3
  return 5
}

export function severityTier(score) {
  if (score >= 7) return { label: 'High', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' }
  if (score >= 4) return { label: 'Moderate', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' }
  return { label: 'Low', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' }
}

export function parseSymptomText(rawText, currentDay, cycleLength) {
  const text = rawText.toLowerCase()

  const severity = extractSeverity(text)

  let location = 'Unspecified / Systemic'
  for (const [key, label] of LOCATION_PATTERNS) {
    if (text.includes(key)) {
      location = label
      break
    }
  }

  const modifiers = []
  for (const [key, label] of MODIFIER_PATTERNS) {
    if (text.includes(key) && !modifiers.includes(label)) modifiers.push(label)
  }
  for (const [key, label] of ONSET_PATTERNS) {
    if (text.includes(key) && !modifiers.includes(label)) modifiers.push(label)
  }
  if (modifiers.length === 0) modifiers.push('General / Unspecified')

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
