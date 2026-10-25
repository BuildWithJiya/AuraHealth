import { getCyclePhase } from './cycleEngine'

export const GOAL_OPTIONS = [
  {
    id: 'period',
    label: 'Know when my period is coming',
    desc: 'Predict upcoming cycle days, fertile window, and PMS timing.',
    icon: 'Droplet',
    color: '#D96B85',
    bg: '#FCE7E8',
  },
  {
    id: 'body',
    label: 'Understand my body more',
    desc: 'Decode natural estrogen, progesterone & LH hormone curves.',
    icon: 'Compass',
    color: '#405A43',
    bg: '#E8EFE3',
  },
  {
    id: 'symptoms',
    label: 'Track symptoms and discover',
    desc: 'Correlate mood swings, pelvic pain, skin, and daily energy.',
    icon: 'Activity',
    color: '#6A3D55',
    bg: '#E8DDF0',
  },
  {
    id: 'doctor',
    label: 'Gather symptoms for doctors',
    desc: 'Generate physician-ready clinical SOAP notes with evidence.',
    icon: 'Stethoscope',
    color: '#D9A84E',
    bg: '#FDF8EE',
  },
  {
    id: 'fertility',
    label: 'Get pregnant',
    desc: 'Pinpoint peak ovulatory window and fertile cervical mucus cues.',
    icon: 'Heart',
    color: '#D96B85',
    bg: '#FCE7E8',
  },
  {
    id: 'pregnancy',
    label: 'Follow my pregnancy',
    desc: 'Track gestational milestones, due date countdown & trimesters.',
    icon: 'Baby',
    color: '#6A3D55',
    bg: '#E8DDF0',
  },
  {
    id: 'perimenopause',
    label: 'Manage perimenopause',
    desc: 'Navigate vasomotor hot flashes, cycle spacing & sleep changes.',
    icon: 'Sun',
    color: '#D9A84E',
    bg: '#F8F0E8',
  },
  {
    id: 'general',
    label: 'None of the above',
    desc: 'Private, baseline wellness tracking and personal cycle health.',
    icon: 'Shield',
    color: '#5E5259',
    bg: '#FAF7F2',
  },
]

export const TRACKING_CATEGORY_OPTIONS = [
  {
    id: 'flow',
    label: 'Period flow',
    desc: 'Light, medium, heavy flow, spotting & clots',
    icon: 'Droplet',
    color: '#D96B85',
    bg: '#FCE7E8',
  },
  {
    id: 'pms',
    label: 'PMS',
    desc: 'Bloating, breast tenderness, mood swings & cravings',
    icon: 'Cloud',
    color: '#D9A84E',
    bg: '#FDF8EE',
  },
  {
    id: 'feelings',
    label: 'My feelings',
    desc: 'Calm, radiant, anxious, sensitive or brain fog',
    icon: 'Smile',
    color: '#D96B85',
    bg: '#FCE7E8',
  },
  {
    id: 'energy',
    label: 'Energy levels',
    desc: 'Peak stamina, afternoon slumps & chronic fatigue',
    icon: 'Zap',
    color: '#405A43',
    bg: '#E8EFE3',
  },
  {
    id: 'sex',
    label: 'Sex life',
    desc: 'Libido surges, intimacy timing & discomfort',
    icon: 'Flame',
    color: '#6A3D55',
    bg: '#E8DDF0',
  },
  {
    id: 'skin',
    label: 'Skin',
    desc: 'Hormonal jawline breakouts, oiliness & glow',
    icon: 'Sparkles',
    color: '#405A43',
    bg: '#E8EFE3',
  },
  {
    id: 'pain',
    label: 'Cramps and pain',
    desc: 'Pelvic cramping, lower back ache & headaches',
    icon: 'Activity',
    color: '#6A3D55',
    bg: '#E8DDF0',
  },
]

export const PERIOD_FREQUENCY_OPTIONS = [
  {
    id: 'regular',
    label: "They're regular",
    desc: 'Usually predictable every 21–35 days',
    icon: 'CheckCircle2',
  },
  {
    id: 'irregular',
    label: "They're irregular or unpredictable",
    desc: 'Cycle lengths vary by >7 days or skip months (helps screen for PCOS)',
    icon: 'Activity',
  },
  {
    id: 'none',
    label: "I don't have periods",
    desc: 'Amenorrhea, hormonal IUD / pill, post-menopause, or surgical',
    icon: 'Moon',
  },
  {
    id: 'unknown',
    label: "I don't know",
    desc: "Just starting to track — Aura will calculate your rhythm over time",
    icon: 'Sparkles',
  },
]

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
 * Builds a patient object from enhanced onboarding answers.
 */
export function createPatientFromOnboarding({
  name,
  age,
  cycleLength,
  lastPeriodStart,
  concernId,
  goals = [],
  periodFrequency = 'regular',
  pregnancyInfo = null,
  categories = [],
}) {
  const concern = CONCERN_OPTIONS.find((c) => c.id === concernId) || CONCERN_OPTIONS[CONCERN_OPTIONS.length - 1]
  const safeCycleLength = Math.min(Math.max(Number(cycleLength) || 28, 18), 60)

  let currentDay = 1
  if (lastPeriodStart) {
    const elapsed = daysBetween(lastPeriodStart)
    currentDay = ((elapsed % safeCycleLength) + safeCycleLength) % safeCycleLength + 1
  }

  const trimmedName = (name || 'You').trim() || 'You'
  const isIrregular = periodFrequency === 'irregular' || periodFrequency === 'none'

  // Determine adaptive life stage and clinical focus
  let lifeStage = 'reproductive'
  const suspectedList = [...concern.suspected]

  if (pregnancyInfo?.isPregnant || goals.includes('pregnancy')) {
    lifeStage = 'pregnancy_postpartum'
    suspectedList.unshift('Prenatal Gestational Progression')
  } else if (goals.includes('perimenopause')) {
    lifeStage = 'perimenopause'
    suspectedList.unshift('Perimenopausal Transition')
  } else if (isIrregular) {
    suspectedList.unshift('Irregular Cycle Rhythm')
  }

  if (goals.includes('doctor') && !suspectedList.includes('Clinical Referral Preparation')) {
    suspectedList.push('Clinical Referral Preparation')
  }

  let chiefComplaint = concern.chiefComplaintHint
  if (pregnancyInfo?.isPregnant) {
    chiefComplaint = `Active pregnancy tracking. Gestational age: ${pregnancyInfo.weeks}w ${pregnancyInfo.days}d. Estimated Due Date: ${pregnancyInfo.dueDate}.`
  } else if (goals.includes('doctor')) {
    chiefComplaint = `Patient is logging cycle symptoms to prepare a structured clinical summary for physician consultation.`
  }

  return {
    id: 'you',
    name: trimmedName,
    age: Number(age) || undefined,
    avatarColor: AVATAR_COLORS[trimmedName.length % AVATAR_COLORS.length],
    suspected: suspectedList,
    cycleLength: safeCycleLength,
    currentDay,
    anovulatory: isIrregular,
    defaultPreset: concern.defaultPreset,
    severitySeries: buildFlatSeveritySeries(safeCycleLength),
    symptomLog: [],
    chiefComplaintHint: chiefComplaint,
    isSelfProfile: true,
    goals,
    periodFrequency,
    pregnancyInfo,
    lifeStage,
    trackingCategories: categories,
  }
}

export function describeCurrentPhase(patient) {
  return getCyclePhase(patient.currentDay, patient.cycleLength)
}

