import { getCyclePhase } from './cycleEngine'

export const CONCERN_OPTIONS = [
  {
    id: 'pcos',
    label: 'Irregular or missed periods',
    hint: 'Possible PCOS pattern',
    suspected: ['Suspected PCOS'],
    defaultPreset: 'pcos',
    chiefComplaintHint: 'Irregular or infrequent cycles, with possible signs of hormonal imbalance (acne, hair changes, weight shifts) that haven\'t been formally worked up.',
  },
  {
    id: 'pmdd',
    label: 'Mood crashes before my period',
    hint: 'Possible Luteal PMDD pattern',
    suspected: ['Luteal PMDD'],
    defaultPreset: 'pcos',
    chiefComplaintHint: 'Significant mood, anxiety, or irritability changes concentrated in the days before menstruation, affecting daily functioning.',
  },
  {
    id: 'endometriosis',
    label: 'Severe period or pelvic pain',
    hint: 'Possible Endometriosis pattern',
    suspected: ['Suspected Endometriosis'],
    defaultPreset: 'thyroid',
    chiefComplaintHint: 'Pelvic pain that is more severe than typical cramps, possibly with pain during bowel movements or intercourse, worsening around menstruation.',
  },
  {
    id: 'fatigue',
    label: 'Constant fatigue or low energy',
    hint: 'Possible iron / thyroid pattern',
    suspected: ['Latent Iron Deficiency'],
    defaultPreset: 'thyroid',
    chiefComplaintHint: 'Persistent, non-cyclical fatigue and low energy that doesn\'t fully resolve with rest, not yet explained by a formal diagnosis.',
  },
  {
    id: 'general',
    label: "Just want to understand my body better",
    hint: 'General wellness tracking',
    suspected: ['General Wellness Tracking'],
    defaultPreset: 'thyroid',
    chiefComplaintHint: 'No specific diagnosis suspected yet — building a baseline understanding of cycle patterns, symptoms, and overall wellness.',
  },
]

const AVATAR_COLORS = ['#F43F5E', '#6366F1', '#10B981', '#FDBA74', '#A855F7']

function buildFlatSeveritySeries(cycleLength) {
  const series = []
  for (let day = 1; day <= cycleLength; day++) {
    const noise = Math.abs(Math.sin(day * 7.13)) * 1.2
    series.push({ day, severity: Math.round((1.5 + noise) * 10) / 10 })
  }
  return series
}

function daysBetween(dateStr) {
  const start = new Date(dateStr)
  if (Number.isNaN(start.getTime())) return 0
  const now = new Date()
  start.setHours(0, 0, 0, 0)
  now.setHours(0, 0, 0, 0)
  return Math.round((now - start) / 86400000)
}

/**
 * Builds a patient object (same shape consumed across the app: App.jsx,
 * biomarkerEngine, soapGenerator, cycleEngine) from onboarding form answers.
 */
export function createPatientFromOnboarding({ name, age, cycleLength, lastPeriodStart, concernId }) {
  const concern = CONCERN_OPTIONS.find((c) => c.id === concernId) || CONCERN_OPTIONS[CONCERN_OPTIONS.length - 1]
  const safeCycleLength = Math.min(Math.max(Number(cycleLength) || 28, 18), 60)

  let currentDay = 1
  if (lastPeriodStart) {
    const elapsed = daysBetween(lastPeriodStart)
    currentDay = ((elapsed % safeCycleLength) + safeCycleLength) % safeCycleLength + 1
  }

  const trimmedName = (name || 'You').trim() || 'You'

  return {
    id: 'you',
    name: trimmedName,
    age: Number(age) || undefined,
    avatarColor: AVATAR_COLORS[trimmedName.length % AVATAR_COLORS.length],
    suspected: concern.suspected,
    cycleLength: safeCycleLength,
    currentDay,
    anovulatory: false,
    defaultPreset: concern.defaultPreset,
    severitySeries: buildFlatSeveritySeries(safeCycleLength),
    symptomLog: [],
    chiefComplaintHint: concern.chiefComplaintHint,
    isSelfProfile: true,
  }
}

export function describeCurrentPhase(patient) {
  return getCyclePhase(patient.currentDay, patient.cycleLength)
}
