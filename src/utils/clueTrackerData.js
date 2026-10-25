import {
  Droplet,
  Droplets,
  Cloud,
  Sun,
  Moon,
  Smile,
  Frown,
  Zap,
  Flame,
  Activity,
  Sparkles,
  Umbrella,
  Ban,
  Heart,
  Stethoscope,
  Syringe,
  Pill,
  TestTube,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Gauge,
  Wand2,
  Brain,
  Eye,
  AlertCircle,
  CircleDot,
  Circle,
  Wind,
  CloudRain,
  HeartHandshake,
  MinusCircle,
  AlignCenter,
  Compass,
  Waves,
  ShieldOff,
  AlertTriangle,
  Minus,
  Plus,
  UserCheck,
} from 'lucide-react'

export const CLUE_CATEGORIES = [
  {
    id: 'period',
    title: 'Period',
    color: '#E02E49',
    bgColor: '#3B151E',
    activeBg: '#E02E49',
    learnMore: 'Menstrual flow reflects endometrial shedding influenced by progesterone withdrawal.',
    pills: [
      { id: 'period_light', label: 'Light', icon: Droplet, severity: 2, location: 'Pelvic — General', modifier: 'Light Menstrual Flow', desc: 'Minimal pad or tampon saturation' },
      { id: 'period_medium', label: 'Medium', icon: Droplet, severity: 4, location: 'Pelvic — General', modifier: 'Medium Menstrual Flow', desc: 'Regular flow, changing every 3-4 hours' },
      { id: 'period_heavy', label: 'Heavy', icon: Droplets, severity: 6, location: 'Pelvic — General', modifier: 'Heavy Menstrual Flow', desc: 'Soaking through pad/tampon in 2-3 hours' },
      { id: 'period_super_heavy', label: 'Super heavy', icon: AlertCircle, severity: 8, location: 'Pelvic — General', modifier: 'Heavy Menstrual Flow', desc: 'Severe flooding or large blood clots' },
    ],
  },
  {
    id: 'spotting',
    title: 'Spotting',
    color: '#B91C1C',
    bgColor: '#331518',
    activeBg: '#991B1B',
    learnMore: 'Mid-cycle or premenstrual spotting can indicate ovulatory estrogen dips or luteal phase defect.',
    pills: [
      { id: 'spotting_red', label: 'Red', icon: CircleDot, severity: 2, location: 'Pelvic — General', modifier: 'Fresh Spotting', desc: 'Bright red active spotting between periods' },
      { id: 'spotting_brown', label: 'Brown', icon: Circle, severity: 2, location: 'Pelvic — General', modifier: 'Brown Spotting', desc: 'Oxidized dark discharge or delayed flow' },
    ],
  },
  {
    id: 'feelings',
    title: 'Feelings',
    color: '#D97706',
    bgColor: '#382211',
    activeBg: '#D97706',
    learnMore: 'Neurosteroid allopregnanolone fluctuations across the luteal window directly modulate GABA-A mood receptors.',
    pills: [
      { id: 'feel_mood_swings', label: 'Mood swings', icon: Sun, severity: 5, location: 'Systemic / Emotional', modifier: 'Mood Swings', desc: 'Rapid emotional shifts' },
      { id: 'feel_not_in_control', label: 'Not in control', icon: Wind, severity: 6, location: 'Systemic / Emotional', modifier: 'Emotional Dysregulation', desc: 'Feeling overwhelmed and helpless' },
      { id: 'feel_fine', label: 'Fine', icon: Smile, severity: 1, location: 'Systemic / Emotional', modifier: 'Stable Mood', desc: 'Emotionally steady and content' },
      { id: 'feel_happy', label: 'Happy', icon: Sun, severity: 1, location: 'Systemic / Emotional', modifier: 'High Vitality', desc: 'Optimistic, radiant and energized' },
      { id: 'feel_sad', label: 'Sad', icon: CloudRain, severity: 4, location: 'Systemic / Emotional', modifier: 'Depressed Mood', desc: 'Low spirits or crying spells' },
      { id: 'feel_sensitive', label: 'Sensitive', icon: HeartHandshake, severity: 3, location: 'Systemic / Emotional', modifier: 'Emotional Sensitivity', desc: 'Heightened empathy or tearfulness' },
      { id: 'feel_angry', label: 'Angry', icon: Flame, severity: 6, location: 'Systemic / Emotional', modifier: 'Anger Spikes', desc: 'Intense short-fused frustration' },
      { id: 'feel_irritable', label: 'Irritable', icon: Zap, severity: 5, location: 'Systemic / Emotional', modifier: 'Irritability', desc: 'Sensory overload and low patience' },
      { id: 'feel_anxious', label: 'Anxious', icon: Activity, severity: 5, location: 'Systemic / Emotional', modifier: 'Anxiety', desc: 'Nervous tension or racing thoughts' },
      { id: 'feel_insecure', label: 'Insecure', icon: ShieldAlert, severity: 4, location: 'Systemic / Emotional', modifier: 'Self-Doubt', desc: 'Body dysphoria or vulnerability' },
      { id: 'feel_grateful', label: 'Grateful', icon: Sparkles, severity: 1, location: 'Systemic / Emotional', modifier: 'Grounding Calm', desc: 'Grounded and peaceful' },
      { id: 'feel_indifferent', label: 'Indifferent', icon: MinusCircle, severity: 2, location: 'Systemic / Emotional', modifier: 'Emotional Blunting', desc: 'Apathy or flat emotional state' },
    ],
  },
  {
    id: 'pain',
    title: 'Pain',
    color: '#2563EB',
    bgColor: '#162238',
    activeBg: '#2563EB',
    learnMore: 'Endometrial prostaglandins (PGF2a) cause uterine muscle contraction; cyclical pain maps to inflammation stages.',
    pills: [
      { id: 'pain_free', label: 'Pain free', icon: Smile, severity: 0, location: 'Systemic', modifier: 'No Pain', desc: 'Completely pain-free day' },
      { id: 'pain_cramps', label: 'Cramps', icon: Activity, severity: 6, location: 'Pelvic — General', modifier: 'Cramping', desc: 'Uterine prostaglandin cramping' },
      { id: 'pain_ovulation', label: 'Ovulation', icon: Sparkles, severity: 4, location: 'Pelvic — General', modifier: 'Ovulation Pain', desc: 'Mittelschmerz mid-cycle twinge' },
      { id: 'pain_breast', label: 'Breast tenderness', icon: Heart, severity: 5, location: 'Breast / Chest', modifier: 'Breast Tenderness', desc: 'Mastalgia and swelling' },
      { id: 'pain_headache', label: 'Headache', icon: Brain, severity: 4, location: 'Cranial / Head', modifier: 'Headache', desc: 'Tension or vascular cephalalgia' },
      { id: 'pain_migraine', label: 'Migraine', icon: Zap, severity: 7, location: 'Cranial / Head', modifier: 'Migraine', desc: 'Throbbing hemicranial migraine' },
      { id: 'pain_migraine_aura', label: 'Migraine with aura', icon: Eye, severity: 8, location: 'Cranial / Head', modifier: 'Migraine with Aura', desc: 'Visual scintillating aura' },
      { id: 'pain_lower_back', label: 'Lower back', icon: AlignCenter, severity: 5, location: 'Musculoskeletal', modifier: 'Lower Back Ache', desc: 'Sacral and lumbar ache' },
      { id: 'pain_leg', label: 'Leg', icon: Compass, severity: 4, location: 'Musculoskeletal', modifier: 'Leg Pain', desc: 'Sciatic or femoral radiating ache' },
      { id: 'pain_joint', label: 'Joint', icon: Shield, severity: 4, location: 'Musculoskeletal', modifier: 'Joint Pain', desc: 'Estrogen withdrawal arthralgia' },
      { id: 'pain_vulvar', label: 'Vulvar', icon: AlertCircle, severity: 5, location: 'Pelvic — General', modifier: 'Vulvar Pain', desc: 'Localized burning or hypersensitivity' },
    ],
  },
  {
    id: 'pms',
    title: 'PMS',
    color: '#D9A84E',
    bgColor: '#382D16',
    activeBg: '#D9A84E',
    learnMore: 'Premenstrual symptoms correlate with luteal progesterone decline and cellular fluid redistribution.',
    pills: [
      { id: 'pms_active', label: 'PMS', icon: Cloud, severity: 5, location: 'Systemic / Neuroendocrine', modifier: 'PMS Flare', desc: 'Cluster of bloating, fatigue, and premenstrual mood changes' },
    ],
  },
  {
    id: 'sleep_quality',
    title: 'Sleep quality',
    color: '#9333EA',
    bgColor: '#2E1A3D',
    activeBg: '#9333EA',
    learnMore: 'Progesterone promotes GABAergic deep sleep; sudden drops trigger fragmented sleep and night sweats.',
    pills: [
      { id: 'sleep_trouble_falling', label: 'Trouble falling asleep', icon: Moon, severity: 4, location: 'Lifestyle / Sleep', modifier: 'Sleep Latency', desc: 'Taking >45 mins to fall asleep' },
      { id: 'sleep_woke_refreshed', label: 'Woke up refreshed', icon: Sun, severity: 1, location: 'Lifestyle / Sleep', modifier: 'Restorative Sleep', desc: 'Deep rest, natural morning wake' },
      { id: 'sleep_woke_tired', label: 'Woke up tired', icon: Frown, severity: 5, location: 'Lifestyle / Sleep', modifier: 'Unrefreshing Sleep', desc: 'Lethargy upon waking' },
      { id: 'sleep_restless', label: 'Restless sleep', icon: Waves, severity: 4, location: 'Lifestyle / Sleep', modifier: 'Fragmented Sleep', desc: 'Frequent night awakenings' },
      { id: 'sleep_vivid_dreams', label: 'Vivid dreams', icon: Sparkles, severity: 2, location: 'Lifestyle / Sleep', modifier: 'Vivid Dreams', desc: 'Intense or memorable REM dreams' },
      { id: 'sleep_night_sweats', label: 'Night sweats', icon: Flame, severity: 6, location: 'Lifestyle / Sleep', modifier: 'Night Sweats', desc: 'Vasomotor nocturnal hot flashes' },
    ],
  },
  {
    id: 'sleep_duration',
    title: 'Sleep duration',
    color: '#8B5CF6',
    bgColor: '#261C38',
    activeBg: '#8B5CF6',
    learnMore: '7-9 hours of consolidated sleep preserves the hypothalamic-pituitary-ovarian (HPO) axis.',
    isDuration: true,
  },
  {
    id: 'sex_life',
    title: 'Sex life',
    color: '#059669',
    bgColor: '#133327',
    activeBg: '#059669',
    learnMore: 'Libido peaks near ovulation with follicular estradiol surges and slight testosterone elevation.',
    pills: [
      { id: 'sex_protected', label: 'Protected', icon: Umbrella, severity: 0, location: 'Lifestyle / Reproductive', modifier: 'Protected Intercourse', desc: 'Barrier method or contraception used' },
      { id: 'sex_unprotected', label: 'Unprotected', icon: ShieldOff, severity: 0, location: 'Lifestyle / Reproductive', modifier: 'Unprotected Intercourse', desc: 'No barrier contraception used' },
      { id: 'sex_withdrawal', label: 'Withdrawal', icon: Droplets, severity: 0, location: 'Lifestyle / Reproductive', modifier: 'Withdrawal Method', desc: 'Coitus interruptus' },
      { id: 'sex_no_sex', label: 'No sex today', icon: Ban, severity: 0, location: 'Lifestyle / Reproductive', modifier: 'Abstinence', desc: 'No sexual activity logged' },
      { id: 'sex_high_drive', label: 'High sex drive', icon: Gauge, severity: 1, location: 'Lifestyle / Reproductive', modifier: 'High Libido', desc: 'Ovulatory peak arousal' },
      { id: 'sex_low_drive', label: 'Low sex drive', icon: Compass, severity: 1, location: 'Lifestyle / Reproductive', modifier: 'Low Libido', desc: 'Reduced desire or fatigue' },
      { id: 'sex_masturbation', label: 'Masturbation', icon: Sparkles, severity: 0, location: 'Lifestyle / Reproductive', modifier: 'Solo Sexual Activity', desc: 'Solo arousal and pelvic relief' },
      { id: 'sex_toys', label: 'Sex toys', icon: Wand2, severity: 0, location: 'Lifestyle / Reproductive', modifier: 'Intimacy Devices', desc: 'Intimacy toys utilized' },
      { id: 'sex_fantasies', label: 'Fantasies', icon: Heart, severity: 0, location: 'Lifestyle / Reproductive', modifier: 'Sexual Fantasies', desc: 'Daydreaming and romantic desire' },
      { id: 'sex_painful', label: 'Painful intercourse', icon: AlertTriangle, severity: 7, location: 'Pelvic — General', modifier: 'Dyspareunia', desc: 'Deep or superficial pelvic discomfort' },
    ],
  },
  {
    id: 'tests',
    title: 'Tests',
    color: '#BE185D',
    bgColor: '#3B1728',
    activeBg: '#BE185D',
    learnMore: 'Urinary luteinizing hormone (LH) strips confirm ovulatory trigger; hCG verifies embryonic implantation.',
    pills: [
      { id: 'test_lh_negative', label: 'Ovulation test negative', icon: Minus, severity: 0, location: 'Diagnostic / Testing', modifier: 'LH Negative', desc: 'LH < 25 mIU/mL (baseline)' },
      { id: 'test_lh_positive', label: 'Ovulation test positive', icon: Plus, severity: 1, location: 'Diagnostic / Testing', modifier: 'LH Surge Positive', desc: 'LH surge peak detected (ovulation in 24-36h)' },
      { id: 'test_hcg_negative', label: 'Pregnancy test negative', icon: Minus, severity: 0, location: 'Diagnostic / Testing', modifier: 'hCG Negative', desc: 'Negative hCG pregnancy strip' },
      { id: 'test_hcg_positive', label: 'Pregnancy test positive', icon: Plus, severity: 2, location: 'Diagnostic / Testing', modifier: 'hCG Positive', desc: 'Positive urinary hCG detection' },
    ],
  },
  {
    id: 'appointments',
    title: 'Appointments',
    color: '#831843',
    bgColor: '#331320',
    activeBg: '#831843',
    learnMore: 'Document medical visits to synchronize physician findings with your biomarker timelines.',
    pills: [
      { id: 'app_obgyn', label: 'OB/GYN', icon: Stethoscope, severity: 0, location: 'Clinical Care', modifier: 'OB/GYN Visit', desc: 'Gynecological evaluation or pelvic exam' },
      { id: 'app_pap_smear', label: 'PAP smear', icon: TestTube, severity: 0, location: 'Clinical Care', modifier: 'Pap Cytology', desc: 'Cervical cytology screening' },
      { id: 'app_sti', label: 'STI check-up', icon: ShieldCheck, severity: 0, location: 'Clinical Care', modifier: 'STI Screening', desc: 'Sexual health diagnostic testing' },
      { id: 'app_checkup', label: 'General check-up', icon: UserCheck, severity: 0, location: 'Clinical Care', modifier: 'Physician Check-up', desc: 'Annual preventive physical exam' },
      { id: 'app_vaccine', label: 'Vaccination', icon: Syringe, severity: 0, location: 'Clinical Care', modifier: 'Immunization', desc: 'HPV, Tdap, or annual immunization' },
    ],
  },
  {
    id: 'medications',
    title: 'Medications',
    color: '#701A75',
    bgColor: '#2E1430',
    activeBg: '#701A75',
    learnMore: 'Tracking pharmacological interventions helps delineate natural cycle biology from drug effects.',
    pills: [
      { id: 'med_hrt', label: 'Hormone therapy (HRT)', icon: Syringe, severity: 1, location: 'Pharmacotherapy', modifier: 'Hormone Replacement', desc: 'Estrogen or bioidentical progesterone therapy' },
      { id: 'med_birth_control', label: 'Birth control pill', icon: Pill, severity: 0, location: 'Pharmacotherapy', modifier: 'Oral Contraceptive', desc: 'Daily oral contraceptive dose' },
      { id: 'med_pain_relief', label: 'Pain reliever', icon: Pill, severity: 2, location: 'Pharmacotherapy', modifier: 'NSAID / Analgesic', desc: 'Ibuprofen, naproxen or paracetamol' },
      { id: 'med_supplements', label: 'Supplements', icon: Sparkles, severity: 0, location: 'Pharmacotherapy', modifier: 'Micronutrient Therapy', desc: 'Inositol, magnesium, iron, or vitamin D' },
    ],
  },
]

// Storage helpers for daily tracked logs
const STORAGE_KEY = 'aura_clue_daily_logs'
const CUSTOM_CATEGORIES_KEY = 'aura_clue_enabled_categories'

export function loadClueDailyLogs() {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch (err) {
    console.error('Failed to load Clue daily logs', err)
    return {}
  }
}

export function saveClueDailyLog(dateKey, logData) {
  if (typeof window === 'undefined') return
  try {
    const all = loadClueDailyLogs()
    all[dateKey] = logData
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  } catch (err) {
    console.error('Failed to save Clue daily log', err)
  }
}

export function loadEnabledCategories() {
  if (typeof window === 'undefined') return CLUE_CATEGORIES.map((c) => c.id)
  try {
    const raw = localStorage.getItem(CUSTOM_CATEGORIES_KEY)
    if (raw) return JSON.parse(raw)
  } catch (err) {
    console.error('Failed to load category preferences', err)
  }
  return CLUE_CATEGORIES.map((c) => c.id)
}

export function saveEnabledCategories(categoryIds) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(CUSTOM_CATEGORIES_KEY, JSON.stringify(categoryIds))
  } catch (err) {
    console.error('Failed to save category preferences', err)
  }
}

// Map selected pills to Aura clinical symptom objects for symptomLog
export function convertPillsToSymptoms({ selectedPills, sleepDuration, dateKey, cycleDay, cycleLength, phase }) {
  const allPillsMap = {}
  CLUE_CATEGORIES.forEach((cat) => {
    if (cat.pills) {
      cat.pills.forEach((p) => {
        allPillsMap[p.id] = { ...p, categoryTitle: cat.title }
      })
    }
  })

  const symptoms = []
  const timestamp = new Date(dateKey + 'T12:00:00').toISOString()

  selectedPills.forEach((pillId) => {
    const meta = allPillsMap[pillId]
    if (meta) {
      symptoms.push({
        id: `clue-${dateKey}-${pillId}-${Date.now().toString(36)}`,
        rawText: `${meta.categoryTitle}: ${meta.label} — ${meta.desc}`,
        location: meta.location,
        severity: meta.severity,
        modifiers: [meta.modifier],
        phase: phase || 'Follicular',
        day: cycleDay || 1,
        timestamp,
      })
    }
  })

  if (sleepDuration && (sleepDuration.hours > 0 || sleepDuration.minutes > 0)) {
    symptoms.push({
      id: `clue-sleep-${dateKey}-${Date.now().toString(36)}`,
      rawText: `Sleep Duration: ${sleepDuration.hours}h ${sleepDuration.minutes}m logged`,
      location: 'Lifestyle / Sleep',
      severity: sleepDuration.hours < 6 ? 4 : 1,
      modifiers: ['Sleep Duration'],
      phase: phase || 'Follicular',
      day: cycleDay || 1,
      timestamp,
    })
  }

  return symptoms
}
