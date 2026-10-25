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

// Aura-themed health categories tailored for daily cycle & wellness tracking
export const DAILY_TRACKING_CATEGORIES = [
  {
    id: 'period',
    title: 'Menstrual Flow',
    subtitle: 'Flow volume and bleeding intensity',
    color: '#D96B85',
    softBg: '#FCE7E8',
    borderColor: '#D96B85',
    learnMore: 'Endometrial shedding reflects systemic progesterone withdrawal. Tracking flow density aids in diagnosing menorrhagia and anovulation.',
    pills: [
      { id: 'flow_light', label: 'Light Flow', icon: Droplet, severity: 2, location: 'Pelvic — General', modifier: 'Light Menstrual Flow', desc: 'Minimal pad or liner saturation' },
      { id: 'flow_medium', label: 'Medium Flow', icon: Droplet, severity: 4, location: 'Pelvic — General', modifier: 'Medium Menstrual Flow', desc: 'Normal regular flow every 3-4 hrs' },
      { id: 'flow_heavy', label: 'Heavy Flow', icon: Droplets, severity: 6, location: 'Pelvic — General', modifier: 'Heavy Menstrual Flow', desc: 'Soaking pad/tampon under 2-3 hours' },
      { id: 'flow_super_heavy', label: 'Super Heavy / Clots', icon: AlertCircle, severity: 8, location: 'Pelvic — General', modifier: 'Heavy Menstrual Flow', desc: 'Flooding or substantial blood clots' },
    ],
  },
  {
    id: 'spotting',
    title: 'Intermenstrual Spotting',
    subtitle: 'Mid-cycle or delayed brown discharge',
    color: '#B91C1C',
    softBg: '#FEE2E2',
    borderColor: '#EF4444',
    learnMore: 'Mid-cycle spotting can indicate ovulatory estrogen surges, follicular transition, or localized cervical sensitivity.',
    pills: [
      { id: 'spotting_red', label: 'Fresh Red Spotting', icon: CircleDot, severity: 2, location: 'Pelvic — General', modifier: 'Fresh Spotting', desc: 'Bright red discharge between cycles' },
      { id: 'spotting_brown', label: 'Brown Spotting', icon: Circle, severity: 2, location: 'Pelvic — General', modifier: 'Brown Spotting', desc: 'Oxidized dark discharge or delayed flow' },
    ],
  },
  {
    id: 'feelings',
    title: 'Mood & Emotional State',
    subtitle: 'Neuroendocrine emotional shifts',
    color: '#D9A84E',
    softBg: '#FDF8EE',
    borderColor: '#D9A84E',
    learnMore: 'Luteal allopregnanolone shifts directly regulate brain GABA receptors, influencing anxiety, patience, and emotional balance.',
    pills: [
      { id: 'feel_calm', label: 'Calm & Steady', icon: Smile, severity: 1, location: 'Systemic / Emotional', modifier: 'Stable Mood', desc: 'Balanced baseline, serene emotional state' },
      { id: 'feel_radiant', label: 'Radiant / Joyful', icon: Sun, severity: 1, location: 'Systemic / Emotional', modifier: 'High Vitality', desc: 'Energetic, optimistic and confident' },
      { id: 'feel_mood_swings', label: 'Mood Swings', icon: Wind, severity: 5, location: 'Systemic / Emotional', modifier: 'Mood Swings', desc: 'Rapid emotional fluctuations throughout day' },
      { id: 'feel_anxious', label: 'Anxious / Restless', icon: Activity, severity: 5, location: 'Systemic / Emotional', modifier: 'Anxiety', desc: 'Racing thoughts or internal nervous tension' },
      { id: 'feel_irritable', label: 'Irritable', icon: Zap, severity: 5, location: 'Systemic / Emotional', modifier: 'Irritability', desc: 'Sensory overload and short patience' },
      { id: 'feel_tearful', label: 'Tearful / Low', icon: CloudRain, severity: 5, location: 'Systemic / Emotional', modifier: 'Depressed Mood', desc: 'Sudden crying spells or feeling overwhelmed' },
      { id: 'feel_sensitive', label: 'Sensitive', icon: HeartHandshake, severity: 3, location: 'Systemic / Emotional', modifier: 'Emotional Sensitivity', desc: 'Heightened emotional empathy' },
      { id: 'feel_angry', label: 'Rage / Anger', icon: Flame, severity: 7, location: 'Systemic / Emotional', modifier: 'Anger Spikes', desc: 'Intense short-fused anger' },
      { id: 'feel_brain_fog', label: 'Brain Fog', icon: Brain, severity: 4, location: 'Cranial / Head', modifier: 'Brain Fog', desc: 'Forgetfulness, memory lapses or mental fatigue' },
      { id: 'feel_grateful', label: 'Grateful', icon: Sparkles, severity: 1, location: 'Systemic / Emotional', modifier: 'Grounding Calm', desc: 'Grounded and peaceful mindset' },
    ],
  },
  {
    id: 'pain',
    title: 'Pain & Physical Symptoms',
    subtitle: 'Prostaglandin cramping and inflammation',
    color: '#6A3D55',
    softBg: '#E8DDF0',
    borderColor: '#6A3D55',
    learnMore: 'Uterine prostaglandins (PGF2a) stimulate muscular contractions. Cycle-correlated pain patterns aid in screening for endometriosis and adenomyosis.',
    pills: [
      { id: 'pain_free', label: 'Pain Free', icon: Smile, severity: 0, location: 'Systemic', modifier: 'No Pain', desc: 'Comfortable, no pelvic or systemic pain' },
      { id: 'pain_cramps', label: 'Pelvic Cramping', icon: Activity, severity: 6, location: 'Pelvic — General', modifier: 'Cramping', desc: 'Uterine contraction aches' },
      { id: 'pain_ovulation', label: 'Mittelschmerz', icon: Sparkles, severity: 4, location: 'Pelvic — General', modifier: 'Ovulation Pain', desc: 'Mid-cycle unilateral ovulatory twinge' },
      { id: 'pain_breast', label: 'Breast Tenderness', icon: Heart, severity: 5, location: 'Breast / Chest', modifier: 'Breast Tenderness', desc: 'Hormonal mastalgia and swelling' },
      { id: 'pain_headache', label: 'Headache', icon: Brain, severity: 4, location: 'Cranial / Head', modifier: 'Headache', desc: 'Tension or dull cranial pressure' },
      { id: 'pain_migraine', label: 'Migraine', icon: Zap, severity: 7, location: 'Cranial / Head', modifier: 'Migraine', desc: 'Throbbing hemicranial migraine' },
      { id: 'pain_migraine_aura', label: 'Migraine with Aura', icon: Eye, severity: 8, location: 'Cranial / Head', modifier: 'Migraine with Aura', desc: 'Visual shimmering scotoma or dizziness' },
      { id: 'pain_lower_back', label: 'Lower Back Ache', icon: AlignCenter, severity: 5, location: 'Musculoskeletal', modifier: 'Lower Back Ache', desc: 'Sacral and lumbar referred ache' },
      { id: 'pain_joint', label: 'Joint & Muscle Pain', icon: Shield, severity: 4, location: 'Musculoskeletal', modifier: 'Joint Pain', desc: 'Estrogen withdrawal musculoskeletal aches' },
    ],
  },
  {
    id: 'pms',
    title: 'PMS Cluster',
    subtitle: 'Premenstrual symptoms & water retention',
    color: '#D9A84E',
    softBg: '#FDF8EE',
    borderColor: '#D9A84E',
    learnMore: 'Premenstrual symptoms correlate with secondary luteal progesterone fall and mineralocorticoid fluid shifts.',
    pills: [
      { id: 'pms_bloating', label: 'Abdominal Bloating', icon: Cloud, severity: 4, location: 'Abdominal — General', modifier: 'Bloating', desc: 'Fluid retention and digestive slowing' },
      { id: 'pms_cravings', label: 'Sugar & Carb Cravings', icon: Sparkles, severity: 3, location: 'Systemic / Neuroendocrine', modifier: 'Food Cravings', desc: 'Heightened luteal metabolic appetite' },
      { id: 'pms_fatigue', label: 'Sluggish / Low Stamina', icon: Moon, severity: 5, location: 'Systemic / Neuroendocrine', modifier: 'Fatigue', desc: 'Afternoon energy slump' },
    ],
  },
  {
    id: 'sleep_quality',
    title: 'Sleep Quality & Rest',
    subtitle: 'Restorative sleep patterns',
    color: '#405A43',
    softBg: '#E8EFE3',
    borderColor: '#405A43',
    learnMore: 'Progesterone naturally promotes deep slow-wave sleep. Luteal drops or night sweats can cause unrefreshing fragmented sleep.',
    pills: [
      { id: 'sleep_refreshed', label: 'Woke Up Refreshed', icon: Sun, severity: 1, location: 'Lifestyle / Sleep', modifier: 'Restorative Sleep', desc: 'Deep rest and clear morning mind' },
      { id: 'sleep_trouble_falling', label: 'Trouble Falling Asleep', icon: Moon, severity: 4, location: 'Lifestyle / Sleep', modifier: 'Sleep Latency', desc: 'Taking >45 mins to drift off' },
      { id: 'sleep_woke_tired', label: 'Woke Up Tired', icon: Frown, severity: 5, location: 'Lifestyle / Sleep', modifier: 'Unrefreshing Sleep', desc: 'Morning lethargy or sleep deficit' },
      { id: 'sleep_restless', label: 'Restless / Toss & Turn', icon: Waves, severity: 4, location: 'Lifestyle / Sleep', modifier: 'Fragmented Sleep', desc: 'Frequent night awakenings' },
      { id: 'sleep_vivid_dreams', label: 'Vivid Dreams', icon: Sparkles, severity: 2, location: 'Lifestyle / Sleep', modifier: 'Vivid Dreams', desc: 'High REM dream recall' },
      { id: 'sleep_night_sweats', label: 'Night Sweats / Heat', icon: Flame, severity: 6, location: 'Lifestyle / Sleep', modifier: 'Night Sweats', desc: 'Vasomotor temperature spikes at night' },
    ],
  },
  {
    id: 'sleep_duration',
    title: 'Sleep Duration',
    subtitle: 'Total hours slept',
    color: '#405A43',
    softBg: '#E8EFE3',
    borderColor: '#405A43',
    isDuration: true,
    learnMore: 'Consolidating 7 to 9 hours of sleep preserves endocrine homeostasis and reproductive axis rhythms.',
  },
  {
    id: 'intimacy',
    title: 'Intimacy & Sex Life',
    subtitle: 'Libido cues and barrier tracking',
    color: '#D96B85',
    softBg: '#FCE7E8',
    borderColor: '#D96B85',
    learnMore: 'Libido surges peak in the late follicular and ovulatory window in response to estradiol elevation.',
    pills: [
      { id: 'sex_protected', label: 'Protected Intercourse', icon: Umbrella, severity: 0, location: 'Lifestyle / Reproductive', modifier: 'Protected Intercourse', desc: 'Barrier method or contraception used' },
      { id: 'sex_unprotected', label: 'Unprotected', icon: ShieldOff, severity: 0, location: 'Lifestyle / Reproductive', modifier: 'Unprotected Intercourse', desc: 'No barrier method used' },
      { id: 'sex_high_drive', label: 'High Sex Drive', icon: Gauge, severity: 1, location: 'Lifestyle / Reproductive', modifier: 'High Libido', desc: 'Ovulatory peak arousal' },
      { id: 'sex_low_drive', label: 'Low Sex Drive', icon: Compass, severity: 1, location: 'Lifestyle / Reproductive', modifier: 'Low Libido', desc: 'Fatigue or reduced desire' },
      { id: 'sex_dyspareunia', label: 'Pain During Sex', icon: AlertTriangle, severity: 7, location: 'Pelvic — General', modifier: 'Dyspareunia', desc: 'Deep or superficial pelvic discomfort' },
      { id: 'sex_abstinence', label: 'No Sexual Activity', icon: Ban, severity: 0, location: 'Lifestyle / Reproductive', modifier: 'Abstinence', desc: 'Restful, non-active day' },
    ],
  },
  {
    id: 'health_tests',
    title: 'Clinical & Home Tests',
    subtitle: 'LH ovulation strips and pregnancy tests',
    color: '#6A3D55',
    softBg: '#E8DDF0',
    borderColor: '#6A3D55',
    learnMore: 'LH tests reveal ovulatory surges 24-36 hours before egg release. Urinary hCG verifies blastocyst implantation.',
    pills: [
      { id: 'test_lh_positive', label: 'LH Surge Positive (+)', icon: Plus, severity: 1, location: 'Diagnostic / Testing', modifier: 'LH Surge Positive', desc: 'Dark test line indicating peak fertility' },
      { id: 'test_lh_negative', label: 'LH Negative (-)', icon: Minus, severity: 0, location: 'Diagnostic / Testing', modifier: 'LH Negative', desc: 'Baseline LH levels' },
      { id: 'test_hcg_positive', label: 'Pregnancy Test (+)', icon: Plus, severity: 2, location: 'Diagnostic / Testing', modifier: 'hCG Positive', desc: 'Positive urinary hCG detection' },
      { id: 'test_hcg_negative', label: 'Pregnancy Test (-)', icon: Minus, severity: 0, location: 'Diagnostic / Testing', modifier: 'hCG Negative', desc: 'Negative hCG detection' },
    ],
  },
  {
    id: 'care_meds',
    title: 'Care & Medications',
    subtitle: 'Appointments, therapy and supplements',
    color: '#6A3D55',
    softBg: '#E8DDF0',
    borderColor: '#6A3D55',
    learnMore: 'Logging medical interventions helps differentiate innate cycle trends from pharmacological influences.',
    pills: [
      { id: 'app_obgyn', label: 'OB/GYN Consultation', icon: Stethoscope, severity: 0, location: 'Clinical Care', modifier: 'OB/GYN Visit', desc: 'Physician visit or pelvic exam' },
      { id: 'app_checkup', label: 'Annual Check-up', icon: UserCheck, severity: 0, location: 'Clinical Care', modifier: 'Physician Check-up', desc: 'Preventive healthcare review' },
      { id: 'med_hrt', label: 'Hormone Therapy', icon: Syringe, severity: 1, location: 'Pharmacotherapy', modifier: 'Hormone Replacement', desc: 'Progesterone or estrogen dose' },
      { id: 'med_pill', label: 'Birth Control Pill', icon: Pill, severity: 0, location: 'Pharmacotherapy', modifier: 'Oral Contraceptive', desc: 'Daily oral contraceptive' },
      { id: 'med_analgesic', label: 'Pain Reliever (NSAID)', icon: Pill, severity: 2, location: 'Pharmacotherapy', modifier: 'NSAID / Analgesic', desc: 'Ibuprofen or paracetamol' },
      { id: 'med_supplements', label: 'Supplements (Inositol / Iron)', icon: Sparkles, severity: 0, location: 'Pharmacotherapy', modifier: 'Micronutrient Therapy', desc: 'Vitamins, magnesium or minerals' },
    ],
  },
]

const STORAGE_KEY = 'aura_daily_biomarker_logs'
const ENABLED_CATEGORIES_KEY = 'aura_daily_tracker_categories'

export function loadDailyBiomarkerLogs() {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch (err) {
    console.error('Failed to load daily biomarker logs', err)
    return {}
  }
}

export function saveDailyBiomarkerLog(dateKey, logData) {
  if (typeof window === 'undefined') return
  try {
    const all = loadDailyBiomarkerLogs()
    all[dateKey] = logData
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  } catch (err) {
    console.error('Failed to save daily biomarker log', err)
  }
}

export function loadEnabledCategories() {
  if (typeof window === 'undefined') return DAILY_TRACKING_CATEGORIES.map((c) => c.id)
  try {
    const raw = localStorage.getItem(ENABLED_CATEGORIES_KEY)
    if (raw) return JSON.parse(raw)
  } catch (err) {
    console.error('Failed to load category preferences', err)
  }
  return DAILY_TRACKING_CATEGORIES.map((c) => c.id)
}

export function saveEnabledCategories(categoryIds) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(ENABLED_CATEGORIES_KEY, JSON.stringify(categoryIds))
  } catch (err) {
    console.error('Failed to save category preferences', err)
  }
}

// Map selected pills to Aura clinical symptom objects
export function convertPillsToSymptoms({ selectedPills, sleepDuration, dateKey, cycleDay, cycleLength, phase }) {
  const allPillsMap = {}
  DAILY_TRACKING_CATEGORIES.forEach((cat) => {
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
        id: `daily-${dateKey}-${pillId}-${Date.now().toString(36)}`,
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
      id: `daily-sleep-${dateKey}-${Date.now().toString(36)}`,
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
