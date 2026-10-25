import { getCyclePhase } from '../utils/cycleEngine.js'

function seededNoise(day, salt = 1) {
  return (Math.sin(day * 12.9898 * salt) * 43758.5453) % 1
}

function buildSeveritySeries(cycleLength, shapeFn) {
  const series = []
  for (let day = 1; day <= cycleLength; day++) {
    const noise = Math.abs(seededNoise(day)) * 0.8
    const value = Math.min(Math.max(shapeFn(day) + noise, 0), 10)
    series.push({ day, severity: Math.round(value * 10) / 10 })
  }
  return series
}

function mkSymptom({ day, cycleLength, rawText, location, severity, modifiers, offsetDaysAgo }) {
  return {
    id: `seed-${location}-${day}-${offsetDaysAgo}`,
    rawText,
    location,
    severity,
    modifiers,
    phase: getCyclePhase(day, cycleLength),
    day,
    timestamp: new Date(Date.now() - offsetDaysAgo * 86400000).toISOString(),
  }
}

// ---------------------------------------------------------------------------
// Patient 1 — Maya, 27 — Suspected PCOS & Luteal PMDD
// ---------------------------------------------------------------------------
const mayaCycleLength = 34
const mayaCurrentDay = 24

const mayaSeverity = buildSeveritySeries(mayaCycleLength, (day) => {
  const phase = getCyclePhase(day, mayaCycleLength)
  if (phase === 'Luteal') {
    const lutealStart = 19
    const t = (day - lutealStart) / (mayaCycleLength - lutealStart)
    return 4.5 + 4 * Math.sin(Math.PI * Math.min(t * 1.1, 1))
  }
  if (phase === 'Follicular') return 2.2
  if (phase === 'Ovulatory') return 1.8
  return 3.2 // Menstrual
})

const mayaSymptomLog = [
  mkSymptom({ day: 3, cycleLength: mayaCycleLength, rawText: 'Heavy, clotted bleeding on day 3, soaking through a pad in under 2 hours, cramping around a 6 out of 10.', location: 'Pelvic — General', severity: 6, modifiers: ['Heavy Menstrual Flow', 'Cramping'], offsetDaysAgo: 54 })
  ,
  mkSymptom({ day: 9, cycleLength: mayaCycleLength, rawText: 'New cystic acne along the jawline this week, plus some oily skin, nothing painful.', location: 'Dermatological', severity: 3, modifiers: ['Acne Flare'], offsetDaysAgo: 48 }),
  mkSymptom({ day: 16, cycleLength: mayaCycleLength, rawText: 'Expected to feel an ovulation twinge around now but nothing, cycle feels like it is dragging on longer than usual.', location: 'Pelvic — General', severity: 2, modifiers: ['Gradual Onset'], offsetDaysAgo: 41 }),
  mkSymptom({ day: 20, cycleLength: mayaCycleLength, rawText: 'Started feeling bloated and irritable out of nowhere, snapped at my coworker for no reason, 5 out of 10 mood crash.', location: 'Abdominal — General', severity: 5, modifiers: ['Bloating', 'Irritability', 'Mood Swings'], offsetDaysAgo: 37 }),
  mkSymptom({ day: 22, cycleLength: mayaCycleLength, rawText: 'Woke up with intense brain fog, could not focus on anything at work, severe fatigue, 7 out of 10.', location: 'Cranial / Head', severity: 7, modifiers: ['Brain Fog', 'Fatigue', 'Morning Onset'], offsetDaysAgo: 35 }),
  mkSymptom({ day: 23, cycleLength: mayaCycleLength, rawText: 'Intense sugar and carb cravings all day, binged on snacks, felt out of control, bloating 6 out of 10.', location: 'Abdominal — General', severity: 6, modifiers: ['Food Cravings', 'Bloating'], offsetDaysAgo: 34 }),
  mkSymptom({ day: 24, cycleLength: mayaCycleLength, rawText: 'Sudden crying spell for no clear reason, hopeless mood, breast tenderness, this feels like an 8 out of 10 emotionally.', location: 'Breast / Chest', severity: 8, modifiers: ['Mood Swings', 'Tenderness', 'Sudden Onset'], offsetDaysAgo: 33 }),
  mkSymptom({ day: 25, cycleLength: mayaCycleLength, rawText: 'Rage and irritability spiked again today, anxious for no reason, could not sleep, insomnia, 7 out of 10.', location: 'Unspecified / Systemic', severity: 7, modifiers: ['Irritability', 'Anxiety', 'Insomnia'], offsetDaysAgo: 32 }),
  mkSymptom({ day: 27, cycleLength: mayaCycleLength, rawText: 'Noticed more hair in the shower drain than usual over the past week, also some new hair growth on my chin.', location: 'Dermatological', severity: 4, modifiers: ['Hair Thinning'], offsetDaysAgo: 30 }),
  mkSymptom({ day: 29, cycleLength: mayaCycleLength, rawText: 'Weight feels stuck no matter what I eat, constant low energy, bloated every evening, 6 out of 10.', location: 'Abdominal — General', severity: 6, modifiers: ['Weight Gain', 'Low Energy', 'Bloating'], offsetDaysAgo: 28 }),
  mkSymptom({ day: 31, cycleLength: mayaCycleLength, rawText: 'Severe mood crash again, irritable with everyone, brain fog so bad I missed a meeting, 8 out of 10.', location: 'Cranial / Head', severity: 8, modifiers: ['Mood Swings', 'Brain Fog', 'Irritability'], offsetDaysAgo: 26 }),
  mkSymptom({ day: 33, cycleLength: mayaCycleLength, rawText: 'Period still has not started, cramping building up, bloating, breast tenderness worse at night.', location: 'Pelvic — General', severity: 6, modifiers: ['Cramping', 'Bloating', 'Tenderness', 'Night Onset'], offsetDaysAgo: 24 }),
]

// ---------------------------------------------------------------------------
// Patient 2 — Elena, 32 — Suspected Endometriosis & Latent Iron Deficiency
// ---------------------------------------------------------------------------
const elenaCycleLength = 28
const elenaCurrentDay = 3

const elenaSeverity = buildSeveritySeries(elenaCycleLength, (day) => {
  const phase = getCyclePhase(day, elenaCycleLength)
  const persistentFatigue = 2.6 // non-cyclical iron-deficiency fatigue floor
  if (phase === 'Menstrual') {
    const t = (day - 1) / 4
    return persistentFatigue + 6.5 * Math.sin(Math.PI * Math.min(t, 1))
  }
  if (day >= 24) {
    const t = (day - 24) / 4
    return persistentFatigue + 3.5 * t // premenstrual pain ramp
  }
  if (phase === 'Ovulatory') return persistentFatigue + 1.2
  return persistentFatigue + 0.5
})

const elenaSymptomLog = [
  mkSymptom({ day: 1, cycleLength: elenaCycleLength, rawText: 'Woke up with sharp lower left pelvic pain, 9 out of 10, had to call in sick, severe nausea after coffee.', location: 'Pelvic — Lower Left', severity: 9, modifiers: ['Sharp', 'Nausea', 'Postprandial (Coffee)', 'Morning Onset'], offsetDaysAgo: 57 }),
  mkSymptom({ day: 2, cycleLength: elenaCycleLength, rawText: 'Pain during bowel movements again this cycle, stabbing lower pelvic pain, 8 out of 10, also very fatigued.', location: 'Bowel / GI', severity: 8, modifiers: ['Stabbing', 'Cyclical Bowel Pain', 'Fatigue'], offsetDaysAgo: 56 }),
  mkSymptom({ day: 3, cycleLength: elenaCycleLength, rawText: 'Sharp lower-left pelvic pain, 8 out of 10, accompanied by intense brain fog and severe nausea after coffee.', location: 'Pelvic — Lower Left', severity: 8, modifiers: ['Sharp', 'Brain Fog', 'Nausea', 'Postprandial (Coffee)'], offsetDaysAgo: 55 }),
  mkSymptom({ day: 5, cycleLength: elenaCycleLength, rawText: 'Pain finally easing but still dull and aching lower abdomen, exhausted, low energy all week.', location: 'Abdominal — Lower', severity: 4, modifiers: ['Dull', 'Fatigue', 'Low Energy'], offsetDaysAgo: 53 }),
  mkSymptom({ day: 10, cycleLength: elenaCycleLength, rawText: 'Constant tiredness again today even after a full night of sleep, dizzy when standing up quickly.', location: 'Unspecified / Systemic', severity: 5, modifiers: ['Fatigue', 'Dizziness'], offsetDaysAgo: 48 }),
  mkSymptom({ day: 14, cycleLength: elenaCycleLength, rawText: 'Mild twinge on the right side around ovulation, nothing severe, maybe a 3 out of 10.', location: 'Pelvic — Lower Right', severity: 3, modifiers: ['Sudden Onset'], offsetDaysAgo: 44 }),
  mkSymptom({ day: 18, cycleLength: elenaCycleLength, rawText: 'Low energy and brain fog in the afternoon, craving red meat a lot this week, pale looking in the mirror.', location: 'Unspecified / Systemic', severity: 4, modifiers: ['Fatigue', 'Brain Fog', 'Food Cravings'], offsetDaysAgo: 40 }),
  mkSymptom({ day: 22, cycleLength: elenaCycleLength, rawText: 'Fatigue is relentless, climbing one flight of stairs leaves me breathless, hair seems to be thinning too.', location: 'Unspecified / Systemic', severity: 6, modifiers: ['Fatigue', 'Hair Thinning'], offsetDaysAgo: 36 }),
  mkSymptom({ day: 25, cycleLength: elenaCycleLength, rawText: 'Deep aching lower-left pelvic pain starting again before my period, pain during sex this week too, 6 out of 10.', location: 'Pelvic — Lower Left', severity: 6, modifiers: ['Dull', 'Dyspareunia'], offsetDaysAgo: 33 }),
  mkSymptom({ day: 26, cycleLength: elenaCycleLength, rawText: 'Pain building up sharply, radiating to my lower back, 7 out of 10, bowel pain again too.', location: 'Pelvic — Lower Left', severity: 7, modifiers: ['Sharp', 'Radiating', 'Cyclical Bowel Pain'], offsetDaysAgo: 32 }),
  mkSymptom({ day: 27, cycleLength: elenaCycleLength, rawText: 'Nauseous and exhausted, pelvic pain 8 out of 10, dreading my period starting tomorrow.', location: 'Pelvic — General', severity: 8, modifiers: ['Nausea', 'Fatigue'], offsetDaysAgo: 31 }),
  mkSymptom({ day: 28, cycleLength: elenaCycleLength, rawText: 'Pain is nearly unbearable now, 9 out of 10, sharp and stabbing, could barely get out of bed this morning.', location: 'Pelvic — Lower Left', severity: 9, modifiers: ['Sharp', 'Stabbing', 'Morning Onset'], offsetDaysAgo: 30 }),
]

export const MOCK_PATIENTS = [
  {
    id: 'maya',
    name: 'Maya Chen',
    age: 27,
    avatarColor: '#6366F1',
    suspected: ['Suspected PCOS', 'Luteal PMDD'],
    cycleLength: mayaCycleLength,
    currentDay: mayaCurrentDay,
    anovulatory: true,
    defaultPreset: 'pcos',
    severitySeries: mayaSeverity,
    symptomLog: mayaSymptomLog,
    chiefComplaintHint: 'Severe mood instability and brain fog concentrated in the luteal phase, alongside signs of hyperandrogenism (acne, hair thinning) and irregular, lengthened cycles.',
  },
  {
    id: 'elena',
    name: 'Elena Rodriguez',
    age: 32,
    avatarColor: '#F43F5E',
    suspected: ['Suspected Endometriosis', 'Latent Iron Deficiency'],
    cycleLength: elenaCycleLength,
    currentDay: elenaCurrentDay,
    anovulatory: false,
    defaultPreset: 'thyroid',
    severitySeries: elenaSeverity,
    symptomLog: elenaSymptomLog,
    chiefComplaintHint: 'Debilitating, sharp lower-left pelvic pain that escalates premenstrually and peaks at menses, with bowel and intercourse pain, layered on relentless non-cyclical fatigue.',
  },
]

// In-memory registry for a self-onboarded user profile (persisted separately
// via utils/storage.js's onboarding-profile helpers and re-registered on load).
let customPatients = []

export function registerCustomPatient(patient) {
  customPatients = customPatients.filter((p) => p.id !== patient.id)
  customPatients.push(patient)
}

export function unregisterCustomPatient(id) {
  customPatients = customPatients.filter((p) => p.id !== id)
}

export function getPatientById(id) {
  const custom = customPatients.find((p) => p.id === id)
  if (custom) return custom
  return MOCK_PATIENTS.find((p) => p.id === id) || MOCK_PATIENTS[0]
}
