import { useState, useMemo, useRef } from 'react'
import {
  Calendar,
  Droplet,
  UserCheck,
  BookOpen,
  Sparkles,
  Heart,
  Flower2,
  Sun,
  Moon,
  ShieldCheck,
  Shield,
  EyeOff,
  Lock,
  HeartHandshake,
  ArrowRight,
  Search,
  Activity,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  X,
  Stethoscope,
  Smile,
  Compass,
  Wand2,
  Plus,
  TrendingUp,
} from 'lucide-react'
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'
import { useReveal } from '../hooks/useReveal'
import { getCyclePhase, getPhaseBoundaries, getPhaseSubLabel, PHASE_META, generateHormoneCurve, pearsonCorrelation } from '../utils/cycleEngine'
import { parseSymptomText } from '../utils/symptomParser'
import { runExplainableScreening } from '../utils/explainableRiskEngine'
import { MOCK_PATIENTS, getPatientById } from '../data/mockPatients'
import { LIFE_STAGES, LIFE_STAGE_LIST } from '../data/lifeStageData'
import UnderstandYourBodyModal from './UnderstandYourBodyModal'
import ExplainableRiskModal from './ExplainableRiskModal'
import PrivacyModal from './PrivacyModal'
import LifeStageModal from './LifeStageModal'

function RevealBlock({ children, className = '', delayMs = 0 }) {
  const [ref, visible] = useReveal()
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'reveal-visible' : ''} ${className}`}
      style={{ transitionDelay: visible ? `${delayMs}ms` : '0ms' }}
    >
      {children}
    </div>
  )
}

const PHASE_ICONS = {
  Menstrual: Droplet,
  Follicular: Sparkles,
  Ovulatory: Sun,
  Luteal: Moon,
}

const TRUST_PILLARS = [
  {
    id: 'trusted',
    icon: ShieldCheck,
    title: 'Trusted & Verified Information',
    color: '#405A43',
    subtitle: 'Evidence-based clinical decision guidelines',
    details:
      'Grounded in clinical guidelines from the American College of Obstetricians and Gynecologists (ACOG), Rotterdam Consensus criteria for PCOS, and ESHRE endometriosis protocols. All educational content is verified by licensed women’s health professionals.',
  },
  {
    id: 'designed',
    icon: UserCheck,
    title: 'Designed for Women',
    color: '#D96B85',
    subtitle: 'Female-specific endocrinology & biomarker curves',
    details:
      'Medical research has historically neglected menstrual cycle fluctuations. Aura Health explicitly accounts for phase-specific reference intervals for Estradiol, Progesterone, LH, and FSH rather than static standard lab thresholds.',
  },
  {
    id: 'private',
    icon: Lock,
    title: 'Secure & Private',
    color: '#6A3D55',
    subtitle: 'Local-first architecture & zero ad-trackers',
    details:
      'Your cycle and symptom logs are kept directly on your device. We never sell your personal reproductive health data to third-party ad brokers or data aggregators. You retain full control to export or reset your data at any time.',
  },
  {
    id: 'support',
    icon: HeartHandshake,
    title: 'Always Here For You',
    color: '#D9A84E',
    subtitle: '24/7 empathetic self-advocacy companion',
    details:
      'Cycle tracking should never feel clinical, intimidating, or dismissive. Whether you need structured pre-appointment SOAP notes for your physician or a peaceful space to record daily check-ins, Aura Health is your steadfast ally.',
  },
]

export default function LandingPage({
  onGetStarted,
  onViewDemo,
  patient: initialPatient,
  day: parentDay,
  onDayChange: parentOnDayChange,
  onAddSymptom: parentOnAddSymptom,
  chartData: parentChartData,
  correlation: parentCorrelation,
  patients: parentPatients,
  onSwitchPatient: parentOnSwitchPatient,
  onOpenEducation,
  onOpenSoap,
  activeLifeStageId = 'reproductive',
  onSelectLifeStage,
  onOpenLifeStage,
  onOpenPrivacy,
  onTriggerPanic,
  isAnonymous = false,
  privacySettings,
  onUpdatePrivacy,
  onResetAllData,
}) {
  const [activeNav, setActiveNav] = useState('Home')
  const [localPrivacyOpen, setLocalPrivacyOpen] = useState(false)
  const [localLifeStageOpen, setLocalLifeStageOpen] = useState(false)

  const handleOpenPrivacy = () => {
    if (onOpenPrivacy) onOpenPrivacy()
    else setLocalPrivacyOpen(true)
  }

  const handleOpenLifeStage = () => {
    if (onOpenLifeStage) onOpenLifeStage()
    else setLocalLifeStageOpen(true)
  }

  // Patient selection for the interactive graph
  const patientsList = parentPatients || MOCK_PATIENTS
  const [selectedPatientId, setSelectedPatientId] = useState(initialPatient?.id || patientsList[0].id)
  const activePatient = useMemo(() => {
    return patientsList.find((p) => p.id === selectedPatientId) || getPatientById(selectedPatientId) || patientsList[0]
  }, [patientsList, selectedPatientId])

  // Internal day state when not synced from parent
  const [internalDay, setInternalDay] = useState(initialPatient?.currentDay || activePatient.currentDay || 14)
  const currentDay = parentDay !== undefined ? parentDay : internalDay
  const handleDayChange = (newDay) => {
    setInternalDay(newDay)
    if (parentOnDayChange) parentOnDayChange(newDay)
  }

  // Switch patient handler
  const handleSelectPatient = (id) => {
    setSelectedPatientId(id)
    if (parentOnSwitchPatient) parentOnSwitchPatient(id)
    const p = getPatientById(id)
    if (p) {
      setInternalDay(p.currentDay)
      if (parentOnDayChange) parentOnDayChange(p.currentDay)
    }
  }

  // Phase computation
  const cycleLength = activePatient.cycleLength || 28
  const phase = getCyclePhase(currentDay, cycleLength)
  const subLabel = getPhaseSubLabel(currentDay, cycleLength)
  const boundaries = getPhaseBoundaries(cycleLength)
  const PhaseIcon = PHASE_ICONS[phase] || Droplet

  // Chart curves computation
  const hormoneCurve = useMemo(
    () => generateHormoneCurve(cycleLength, { anovulatory: activePatient.anovulatory }),
    [cycleLength, activePatient.anovulatory]
  )

  // Dynamic local symptom adjustments for graphing
  const [localAddedSymptoms, setLocalAddedSymptoms] = useState([])

  const chartData = useMemo(() => {
    return activePatient.severitySeries.map((s, i) => {
      // Check if user logged an extra symptom on this day
      const extraOnDay = localAddedSymptoms.find((item) => item.day === s.day)
      const adjustedSeverity = extraOnDay ? extraOnDay.severity : s.severity
      return {
        day: s.day,
        severity: adjustedSeverity,
        estrogen: hormoneCurve[i]?.estrogen ?? null,
        progesterone: hormoneCurve[i]?.progesterone ?? null,
      }
    })
  }, [activePatient.severitySeries, hormoneCurve, localAddedSymptoms])

  // Correlation calculation
  const correlation = useMemo(() => {
    if (parentCorrelation && activePatient.id === initialPatient?.id) return parentCorrelation
    const sevArr = chartData.map((d) => d.severity)
    const progArr = chartData.map((d) => d.progesterone)
    const estArr = chartData.map((d) => d.estrogen)
    const rProg = pearsonCorrelation(sevArr, progArr)
    const rEst = pearsonCorrelation(sevArr, estArr)
    const useProg = Math.abs(rProg) >= Math.abs(rEst)
    const value = useProg ? rProg : rEst
    const hormoneLabel = useProg ? 'luteal progesterone' : 'estrogen'
    const direction = value >= 0 ? 'positive' : 'inverse'
    let narrative = 'hormone-sensitive symptom expression warranting clinical correlation.'
    if (activePatient.suspected?.some((s) => s.includes('PMDD'))) {
      narrative = 'PMDD — symptom flares cluster tightly in the luteal window, consistent with hormone-sensitivity mood patterns.'
    } else if (activePatient.suspected?.some((s) => s.includes('Endometriosis'))) {
      narrative = 'Endometriosis peritoneal inflammation triggered as hormone levels withdraw into menses.'
    } else if (activePatient.suspected?.some((s) => s.includes('PCOS'))) {
      narrative = 'anovulatory hormonal flatlining disrupting the expected cyclical symptom rhythm — consistent with PCOS.'
    }
    return { value, hormoneLabel, direction, narrative }
  }, [chartData, activePatient, parentCorrelation, initialPatient])

  // Chart series visibility toggles
  const [showEstrogen, setShowEstrogen] = useState(true)
  const [showProgesterone, setShowProgesterone] = useState(true)
  const [showSeverity, setShowSeverity] = useState(true)

  // Interactive Modals State
  const [educationModalOpen, setEducationModalOpen] = useState(false)
  const [wellnessModalOpen, setWellnessModalOpen] = useState(false)
  const [aboutModalOpen, setAboutModalOpen] = useState(false)
  const [selectedPillar, setSelectedPillar] = useState(null)
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [quickLogOpen, setQuickLogOpen] = useState(false)
  const [quickSymptomText, setQuickSymptomText] = useState('')
  const [quickSeverity, setQuickSeverity] = useState(6)
  const [screeningModalOpen, setScreeningModalOpen] = useState(false)

  // Explainable AI Risk Screening calculation
  const screeningReports = useMemo(() => {
    const combined = [...localAddedSymptoms, ...(activePatient.symptomLog || [])]
    return runExplainableScreening({
      patient: activePatient,
      symptomLog: combined,
      correlation,
    })
  }, [activePatient, localAddedSymptoms, correlation])
  const topScreening = screeningReports[0]

  // Wellness tools state inside modal
  const [selectedMood, setSelectedMood] = useState('Calm')
  const [waterCups, setWaterCups] = useState(4)
  const [breathingPhase, setBreathingPhase] = useState('Inhale')

  // Smooth scroll helper
  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  // Handle adding quick symptom with multi-lingual parser
  const handleQuickLogSubmit = (e) => {
    e.preventDefault()
    if (!quickSymptomText.trim()) return
    const parsed = parseSymptomText(quickSymptomText, currentDay, cycleLength)
    const newEntry = {
      ...parsed,
      severity: quickSeverity || parsed.severity,
    }
    setLocalAddedSymptoms((prev) => [newEntry, ...prev])
    if (parentOnAddSymptom) parentOnAddSymptom(newEntry)
    setQuickSymptomText('')
    setQuickLogOpen(false)
  }

  // Search suggestions
  const SEARCH_INDEX = [
    { title: 'Understanding Pelvic Pain & Dysmenorrhea', category: 'Cycle Health', desc: 'Differentiating primary cramps from endometriosis lesions.' },
    { title: 'PCOS & Androgen Imbalance Explained', category: 'Endocrine', desc: 'Rotterdam consensus diagnostic criteria, ultrasound markers, and insulin resistance.' },
    { title: 'PMDD Luteal Phase Shifts & Neurosteroids', category: 'Mood & PMDD', desc: 'Allopregnanolone sensitivity during the luteal hormone drop.' },
    { title: 'Estrogen Dominance vs. Estrogen Withdrawal', category: 'Hormones', desc: 'How sudden estradiol dips trigger migraines and cramping.' },
    { title: 'Biomarker Interpretations for Day 3 and Day 21', category: 'Lab Panels', desc: 'Why timing lab draws to exact cycle days is essential for diagnosis.' },
    { title: 'Iron Deficiency & Heavy Menstrual Bleeding', category: 'Nutrition', desc: 'Ferritin depletion thresholds and fatigue management.' },
  ]

  const filteredSearch = SEARCH_INDEX.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const segments = [
    { key: 'Menstrual', range: boundaries.menstrual },
    { key: 'Follicular', range: boundaries.follicular },
    { key: 'Ovulatory', range: boundaries.ovulatory },
    { key: 'Luteal', range: boundaries.luteal },
  ]
  const markerPct = ((currentDay - 1) / (cycleLength - 1)) * 100

  return (
    <div className="relative min-h-screen text-[#31232B] font-sans selection:bg-[#FCE7E8] selection:text-[#D96B85] overflow-x-hidden">
      {/* ------------------------------------------------------------------ */}
      {/* 1. TOP NAVIGATION BAR (matching user reference image)              */}
      {/* ------------------------------------------------------------------ */}
      <header className="sticky top-0 z-40 bg-[#FFFDF6]/92 backdrop-blur-md border-b border-[#F4E8C8] shadow-[0_2px_14px_-2px_rgba(180,130,50,0.06)]">
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between gap-4">
          {/* Brand Logo & Slogan */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => {
              setActiveNav('Home')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          >
            <div className="h-10 w-10 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 44 44" className="w-9 h-9">
                <path
                  d="M22 36 C12 30, 6 22, 10 14 C15 14, 19 20, 22 28 C25 20, 29 14, 34 14 C38 22, 32 30, 22 36 Z"
                  fill="#E8EFE3"
                  stroke="#405A43"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path
                  d="M22 36 C16 28, 14 18, 18 10 C22 10, 22 18, 22 26 C22 18, 22 10, 26 10 C30 18, 28 28, 22 36 Z"
                  fill="#FCE7E8"
                  stroke="#D96B85"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <circle cx="22" cy="18" r="3.2" fill="#D9A84E" stroke="#6A3D55" strokeWidth="1" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-2xl font-bold tracking-tight text-[#6A3D55]">Aura Health</span>
              </div>
              <p className="text-[10px] tracking-[0.2em] text-[#405A43] uppercase font-semibold">
                HEALTH &middot; BALANCE &middot; YOU
              </p>
            </div>
          </div>

          {/* Navigation Links: Home, Track, Learn, Resources, About */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#5E5259]">
            {[
              {
                name: 'Home',
                action: () => {
                  setActiveNav('Home')
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                },
              },
              {
                name: 'Track',
                action: () => {
                  setActiveNav('Track')
                  scrollTo('interactive-graph')
                },
              },
              {
                name: 'Learn',
                action: () => {
                  setActiveNav('Learn')
                  if (onOpenEducation) onOpenEducation()
                  else setEducationModalOpen(true)
                },
              },
              {
                name: 'Resources',
                action: () => {
                  setActiveNav('Resources')
                  if (onOpenSoap) onOpenSoap()
                  else setAboutModalOpen(true)
                },
              },
              {
                name: 'About',
                action: () => {
                  setActiveNav('About')
                  setAboutModalOpen(true)
                },
              },
            ].map((item) => (
              <button
                key={item.name}
                onClick={item.action}
                className={`relative py-1 transition-colors hover:text-[#D96B85] cursor-pointer ${
                  activeNav === item.name ? 'text-[#D96B85] font-semibold' : ''
                }`}
              >
                {item.name}
                {activeNav === item.name && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#D96B85] rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Right Actions: Life Stage Pill, Privacy Shield, Panic Button, Search, Get Started */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Life Stage Pill */}
            <button
              onClick={handleOpenLifeStage}
              className="hidden sm:flex items-center gap-1.5 bg-[#FAF7F2] hover:bg-[#FCE7E8] text-[#31232B] border border-[#E8DFD8] hover:border-[#D96B85]/40 text-xs font-semibold rounded-full px-3 py-1.5 transition-all shadow-2xs cursor-pointer"
              title="Click to view or switch Life-Stage Adaptive Mode"
            >
              <span>{LIFE_STAGES[activeLifeStageId]?.icon || '🌿'}</span>
              <span className="hidden md:inline">{LIFE_STAGES[activeLifeStageId]?.shortName || 'Reproductive'}</span>
            </button>

            {/* Privacy Shield Button */}
            <button
              onClick={handleOpenPrivacy}
              className="h-8 w-8 rounded-full flex items-center justify-center text-[#405A43] hover:text-[#D96B85] bg-[#E8EFE3]/80 hover:bg-[#E8EFE3] border border-[#405A43]/20 transition-colors shadow-2xs cursor-pointer"
              aria-label="Privacy & Discretion Hub"
              title="Privacy-First: 100% On-Device & Anonymous Mode"
            >
              <Shield size={15} />
            </button>

            {/* Discreet Camouflage Button */}
            {onTriggerPanic && (
              <button
                onClick={onTriggerPanic}
                className="h-8 w-8 rounded-full flex items-center justify-center text-[#6A3D55] hover:text-[#31232B] bg-[#E8DDF0]/80 hover:bg-[#E8DDF0] border border-[#6A3D55]/20 transition-colors shadow-2xs cursor-pointer"
                aria-label="Quick Screen Camouflage"
                title="Discreet Screen Camouflage (Press Esc to restore)"
              >
                <EyeOff size={14} />
              </button>
            )}

            <button
              onClick={() => setSearchModalOpen(true)}
              className="h-8 w-8 rounded-full flex items-center justify-center text-[#5E5259] hover:text-[#D96B85] hover:bg-[#FCE7E8]/50 transition-colors cursor-pointer"
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            <button
              onClick={onGetStarted}
              className="flex items-center gap-2 bg-[#D96B85] hover:bg-[#B8526B] text-white text-xs sm:text-sm font-semibold rounded-full px-4 sm:px-5 py-2.5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
            >
              Get Started <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* 2. HERO SECTION                                                    */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative pt-10 pb-12 lg:pt-14 lg:pb-16 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-6 space-y-6">
            <div className="animate-landing-fade-up">
              <span className="font-script text-2xl sm:text-3xl text-[#D96B85] block mb-1">
                Because your health matters &mdash; &#9825;
              </span>
              <h1 className="font-serif text-4xl sm:text-6xl text-[#6A3D55] font-normal leading-[1.1] tracking-tight">
                Your health,<br />
                your journey,<br />
                our support.
              </h1>
            </div>

            <p
              className="animate-landing-fade-up text-[#5E5259] text-base sm:text-lg leading-relaxed max-w-lg font-normal"
              style={{ animationDelay: '120ms' }}
            >
              Aura Health is your safe space for menstrual care, wellness tracking, and trusted guidance &mdash; designed for every stage of your journey.
            </p>

            <div
              className="animate-landing-fade-up pt-2 flex flex-wrap items-center gap-3.5"
              style={{ animationDelay: '200ms' }}
            >
              <button
                onClick={() => scrollTo('interactive-graph')}
                className="group flex items-center gap-2 bg-[#D96B85] hover:bg-[#B8526B] text-white font-medium rounded-full px-7 py-3 text-sm sm:text-base shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                Start Tracking
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => scrollTo('feature-cards')}
                className="flex items-center gap-2 rounded-full border border-[#D96B85]/40 hover:border-[#D96B85] bg-white/70 hover:bg-[#FCE7E8]/50 text-[#6A3D55] font-medium px-6 py-3 text-sm transition-all shadow-xs"
              >
                Explore Our Features
              </button>
            </div>
          </div>

          {/* Right Column: Hero Visual Graphic + Floating Badges */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Soft glow background */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#FEF3C7] via-[#FFFBEB] to-[#FDE68A] rounded-3xl -z-10 blur-xl opacity-90" />

              {/* Consultation Illustration Card with Light Frost Blur */}
              <div className="relative rounded-3xl overflow-hidden border border-[#FEF3C7]/80 shadow-xl shadow-[#D9A84E]/10 bg-white/75 backdrop-blur-xl p-3">
                <svg viewBox="0 0 520 380" className="w-full h-auto rounded-2xl block bg-[#FFFDF7]">
                  <defs>
                    <linearGradient id="warmWallAura" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#FFFDF7" />
                      <stop offset="100%" stopColor="#FEF9EA" />
                    </linearGradient>
                    <linearGradient id="sweaterPink" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#FCE7E8" />
                      <stop offset="100%" stopColor="#D96B85" />
                    </linearGradient>
                    <linearGradient id="scrubSage" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#E8EFE3" />
                      <stop offset="100%" stopColor="#405A43" />
                    </linearGradient>
                  </defs>

                  <rect width="520" height="380" fill="url(#warmWallAura)" />
                  <rect x="180" y="20" width="160" height="150" rx="4" fill="#FFFFFF" stroke="#E8EFE3" strokeWidth="2" />
                  <line x1="260" y1="20" x2="260" y2="170" stroke="#E8EFE3" strokeWidth="1.5" />
                  <line x1="180" y1="95" x2="340" y2="95" stroke="#E8EFE3" strokeWidth="1.5" />

                  {/* Framed Quote on wall */}
                  <g transform="translate(390, 40)">
                    <text x="35" y="15" textAnchor="middle" fill="#D96B85" fontFamily="'Caveat', cursive" fontSize="16" fontWeight="600">
                      Real care.
                    </text>
                    <text x="35" y="32" textAnchor="middle" fill="#6A3D55" fontFamily="'Caveat', cursive" fontSize="16" fontWeight="600">
                      Real women.
                    </text>
                    <text x="35" y="50" textAnchor="middle" fill="#405A43" fontFamily="'Caveat', cursive" fontSize="16" fontWeight="600">
                      Always. &#9825;
                    </text>
                  </g>

                  {/* Stacked books on side shelf */}
                  <g transform="translate(435, 175)">
                    <rect x="0" y="0" width="48" height="11" rx="2" fill="#D96B85" opacity="0.8" />
                    <text x="24" y="8" textAnchor="middle" fill="#FFFFFF" fontSize="6" fontWeight="bold">HEALTH</text>
                    <rect x="3" y="12" width="45" height="11" rx="2" fill="#E8EFE3" stroke="#405A43" strokeWidth="0.5" />
                    <text x="25" y="20" textAnchor="middle" fill="#405A43" fontSize="6" fontWeight="bold">WELLNESS</text>
                    <rect x="1" y="24" width="47" height="11" rx="2" fill="#D9A84E" opacity="0.85" />
                    <text x="24" y="32" textAnchor="middle" fill="#FFFFFF" fontSize="6" fontWeight="bold">CONFIDENCE</text>
                    <rect x="2" y="36" width="46" height="11" rx="2" fill="#6A3D55" opacity="0.9" />
                    <text x="25" y="44" textAnchor="middle" fill="#FFFFFF" fontSize="6" fontWeight="bold">YOU</text>
                  </g>

                  {/* Indoor eucalyptus & vase flowers */}
                  <g transform="translate(370, 110)">
                    <path d="M40 90 Q60 50 55 10 Q35 45 40 90 Z" fill="#D96B85" opacity="0.75" />
                    <path d="M50 90 Q30 50 35 15 Q55 45 50 90 Z" fill="#D9A84E" opacity="0.8" />
                    <ellipse cx="45" cy="88" rx="14" ry="24" fill="#FCE7E8" stroke="#D96B85" strokeWidth="1" />
                  </g>
                  <g transform="translate(140, 70)">
                    <path d="M20 120 Q5 70 25 20 Q45 65 20 120 Z" fill="#405A43" opacity="0.7" />
                    <path d="M30 120 Q55 80 45 35 Q25 75 30 120 Z" fill="#E8EFE3" stroke="#405A43" strokeWidth="1" />
                  </g>

                  {/* Female Patient in cozy blush sweater */}
                  <g transform="translate(180, 85)">
                    <path d="M30 65 C15 35, 75 25, 80 60 C85 95, 80 140, 85 165 C68 150, 20 135, 30 65 Z" fill="#36221D" />
                    <circle cx="55" cy="35" r="15" fill="#36221D" />
                    <ellipse cx="62" cy="80" rx="19" ry="23" fill="#FCE7E8" />
                    <path d="M68 88 Q74 93 80 88" stroke="#D96B85" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                    <ellipse cx="73" cy="76" rx="2" ry="2" fill="#31232B" />
                    <ellipse cx="72" cy="100" rx="6" ry="6" fill="#FCE7E8" />
                    <path d="M30 120 C10 160, 5 210, 0 280 L115 280 C115 210, 110 160, 85 120 Z" fill="url(#sweaterPink)" />
                    <path d="M68 135 Q75 190 72 230" stroke="url(#sweaterPink)" strokeWidth="18" strokeLinecap="round" fill="none" />
                  </g>

                  {/* Female Doctor in white coat */}
                  <g transform="translate(295, 70)">
                    <path d="M35 55 C20 25, 80 20, 88 50 C95 85, 90 125, 85 140 C75 110, 25 105, 35 55 Z" fill="#2E1F1A" />
                    <ellipse cx="65" cy="72" rx="20" ry="24" fill="#FDE2D7" />
                    <path d="M68 82 Q75 88 82 82" stroke="#405A43" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                    <ellipse cx="76" cy="68" rx="2" ry="2" fill="#31232B" />
                    <path d="M45 105 L85 105 L80 155 L50 155 Z" fill="url(#scrubSage)" />
                    <path d="M52 110 Q42 155 64 175 Q74 185 80 165 Q90 140 82 110" stroke="#31232B" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                    <circle cx="64" cy="176" r="5" fill="#D9A84E" />
                    <path d="M28 110 C18 160, 18 215, 15 295 L118 295 C118 215, 118 160, 105 110 L88 110 L68 145 L46 110 Z" fill="#FFFFFF" stroke="#E8EFE3" strokeWidth="1.5" />
                    <path d="M46 110 L68 148 L68 210" stroke="#E8EFE3" strokeWidth="1.2" fill="none" />
                    <rect x="55" y="195" width="48" height="34" rx="3" fill="#31232B" transform="rotate(-8 55 195)" />
                    <rect x="58" y="198" width="42" height="28" rx="2" fill="#E8DDF0" transform="rotate(-8 58 198)" />
                    <line x1="62" y1="206" x2="88" y2="202" stroke="#D96B85" strokeWidth="2" strokeLinecap="round" />
                    <line x1="62" y1="212" x2="94" y2="208" stroke="#405A43" strokeWidth="1.5" strokeLinecap="round" />
                  </g>
                </svg>

                {/* 4 Interactive Floating Badges with Light Frost Blur */}
                <div className="absolute top-6 right-6 flex flex-col gap-2">
                  <button
                    onClick={() => scrollTo('interactive-graph')}
                    className="flex items-center gap-1.5 bg-[#FCE7E8]/80 hover:bg-[#FCE7E8] backdrop-blur-md text-[#D96B85] border border-white/70 text-[11px] font-bold rounded-full px-3 py-1 shadow-xs transition-all hover:scale-105"
                  >
                    <Heart size={12} fill="#D96B85" /> Track
                  </button>
                  <button
                    onClick={() => {
                      if (onOpenEducation) onOpenEducation()
                      else setEducationModalOpen(true)
                    }}
                    className="flex items-center gap-1.5 bg-[#E8EFE3]/80 hover:bg-[#E8EFE3] backdrop-blur-md text-[#405A43] border border-white/70 text-[11px] font-bold rounded-full px-3 py-1 shadow-xs transition-all hover:scale-105"
                  >
                    <Compass size={12} /> Learn
                  </button>
                  <button
                    onClick={() => setWellnessModalOpen(true)}
                    className="flex items-center gap-1.5 bg-[#E8DDF0]/80 hover:bg-[#E8DDF0] backdrop-blur-md text-[#6A3D55] border border-white/70 text-[11px] font-bold rounded-full px-3 py-1 shadow-xs transition-all hover:scale-105"
                  >
                    <Sparkles size={12} /> Feel Better
                  </button>
                  <button
                    onClick={() => setAboutModalOpen(true)}
                    className="flex items-center gap-1.5 bg-[#F8F0E8]/85 hover:bg-[#F8F0E8] backdrop-blur-md text-[#D9A84E] border border-white/80 text-[11px] font-bold rounded-full px-3 py-1 shadow-xs transition-all hover:scale-105"
                  >
                    <Sun size={12} /> Grow
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 3. "AFTER THAT ADD THAT GRAPH" (Live Interactive Graph Section)     */}
      {/* ------------------------------------------------------------------ */}
      <section id="interactive-graph" className="py-12 max-w-6xl mx-auto px-6 scroll-mt-20">
        <RevealBlock>
          <div className="ios-glass-card rounded-3xl p-6 sm:p-8 space-y-6">
            {/* Graph Section Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E8EFE3] pb-5">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider bg-[#FCE7E8]/75 backdrop-blur-xs text-[#D96B85] border border-white/70 rounded-full px-3 py-0.5 flex items-center gap-1.5 shadow-2xs">
                    <TrendingUp size={12} /> Live Cycle &amp; Hormone Trajectory
                  </span>
                  <span className="text-xs text-[#7A726D] font-medium hidden sm:inline">&middot; Interactive Decision Engine</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#6A3D55]">
                  Track Your Rhythm in Real Time
                </h2>
                <p className="text-xs sm:text-sm text-[#5E5259] mt-0.5">
                  Drag the cycle slider below to watch hormone curves and symptom triggers interact dynamically.
                </p>
              </div>

              {/* Patient Case Study Switcher */}
              <div className="flex flex-wrap items-center gap-1.5 bg-white/60 backdrop-blur-md p-1.5 rounded-2xl border border-white/70 shadow-2xs">
                {patientsList.slice(0, 4).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPatient(p.id)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all ${
                      activePatient.id === p.id
                        ? 'bg-[#405A43] text-white shadow-xs'
                        : 'text-[#5E5259] hover:bg-white/80 hover:text-[#31232B]'
                    }`}
                  >
                    {p.name} <span className="opacity-70 text-[10px]">({p.cycleLength}d)</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Cycle Phase Engine Slider */}
            <div className="bg-white/55 backdrop-blur-md rounded-2xl p-4 border border-white/75 shadow-inner space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <PhaseIcon size={16} style={{ color: PHASE_META[phase]?.color || '#D96B85' }} />
                  <span className="text-sm font-bold text-[#31232B]">
                    Day {currentDay} of {cycleLength}:{' '}
                    <span style={{ color: PHASE_META[phase]?.color || '#D96B85' }}>{phase} Phase</span>
                  </span>
                  <span className="text-xs text-[#7A726D] hidden sm:inline">&mdash; {subLabel}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleDayChange(Math.max(1, currentDay - 1))}
                    className="h-7 w-7 rounded-full bg-white hover:bg-[#FCE7E8] text-[#405A43] border border-[#E8DFD8] flex items-center justify-center transition-colors shadow-2xs"
                    aria-label="Previous Day"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <span className="text-[11px] font-semibold text-[#6A3D55] px-2.5 py-0.5 rounded-full bg-[#FCE7E8]/60 border border-[#D96B85]/20 flex items-center gap-1">
                    <Calendar size={11} className="text-[#D96B85]" />
                    Day {currentDay}
                  </span>
                  <button
                    onClick={() => handleDayChange(Math.min(cycleLength, currentDay + 1))}
                    className="h-7 w-7 rounded-full bg-white hover:bg-[#FCE7E8] text-[#405A43] border border-[#E8DFD8] flex items-center justify-center transition-colors shadow-2xs"
                    aria-label="Next Day"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              {/* Segmented Phase Bar */}
              <div className="relative h-7 rounded-full overflow-hidden flex border border-[#E8DFD8] bg-[#F8F0E8] shadow-inner">
                {segments.map((seg) => {
                  const width = ((seg.range[1] - seg.range[0] + 1) / cycleLength) * 100
                  const SegIcon = PHASE_ICONS[seg.key] || Droplet
                  return (
                    <div
                      key={seg.key}
                      onClick={() => handleDayChange(seg.range[0])}
                      className="h-full flex items-center justify-center gap-1 text-[10px] font-semibold text-white cursor-pointer transition-opacity px-1"
                      style={{
                        width: `${width}%`,
                        backgroundColor: PHASE_META[seg.key]?.color,
                        opacity: seg.key === phase ? 1 : 0.65,
                      }}
                      title={`${seg.key} Phase (Days ${seg.range[0]}–${seg.range[1]})`}
                    >
                      {width > 12 && <SegIcon size={11} className="shrink-0" />}
                      {width > 18 ? seg.key : ''}
                    </div>
                  )
                })}
                {/* Marker for current day */}
                <div
                  className="absolute top-[-3px] h-[34px] w-[3.5px] bg-[#6A3D55] rounded-full shadow-md pointer-events-none"
                  style={{ left: `calc(${markerPct}% - 1.75px)` }}
                />
              </div>

              {/* Range input slider */}
              <input
                type="range"
                min={1}
                max={cycleLength}
                value={currentDay}
                onChange={(e) => handleDayChange(Number(e.target.value))}
                className="w-full accent-[#D96B85] cursor-pointer"
              />
            </div>

            {/* Live Correlation & Explainable AI Risk Screening Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {correlation && (
                <div className={`${topScreening ? 'md:col-span-7' : 'md:col-span-12'} flex items-start gap-2.5 rounded-2xl border border-[#D96B85]/30 bg-[#FCE7E8]/70 px-4 py-3 shadow-2xs`}>
                  <Activity size={16} className="text-[#D96B85] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#31232B] leading-relaxed">
                    <span className="font-bold text-[#6A3D55]">
                      {Math.round(Math.abs(correlation.value) * 100)}% {correlation.direction} correlation
                    </span>{' '}
                    detected between {correlation.hormoneLabel} trajectory and logged symptom severity.{' '}
                    <span className="text-[#7A726D]">Clinical context: {correlation.narrative}</span>
                  </p>
                </div>
              )}

              {topScreening && (
                <div className={`${correlation ? 'md:col-span-5' : 'md:col-span-12'} flex flex-col justify-between rounded-2xl border border-white/80 bg-white/75 backdrop-blur-md px-4 py-2.5 shadow-2xs`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#405A43] flex items-center gap-1">
                      <ShieldCheck size={12} /> Explainable Screening:
                    </span>
                    <span className="text-[10px] font-bold text-[#D96B85] bg-[#FCE7E8] px-2 py-0.5 rounded-full border border-[#D96B85]/30">
                      {topScreening.confidenceScore}% Risk Match
                    </span>
                  </div>
                  <div className="text-xs font-bold text-[#31232B] mt-0.5 truncate">
                    {topScreening.name}
                  </div>
                  <button
                    onClick={() => setScreeningModalOpen(true)}
                    className="mt-1 text-[11px] font-semibold text-[#D96B85] hover:text-[#B8526B] flex items-center gap-1 cursor-pointer transition-colors text-left"
                  >
                    Why Was It Flagged? (Factor Breakdown) &rarr;
                  </button>
                </div>
              )}
            </div>

            {/* Recharts Composed Chart */}
            <div className="h-[300px] sm:h-[340px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 6, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3EAD3" />
                  <XAxis
                    dataKey="day"
                    stroke="#7A726D"
                    tick={{ fontSize: 11, fill: '#7A726D' }}
                    label={{ value: 'Cycle Day', position: 'insideBottom', offset: -2, fontSize: 11, fill: '#7A726D' }}
                  />
                  <YAxis
                    yAxisId="left"
                    domain={[0, 10]}
                    stroke="#D96B85"
                    tick={{ fontSize: 11, fill: '#D96B85' }}
                    label={{ value: 'Symptom Severity (0-10)', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#D96B85' }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[0, 100]}
                    stroke="#405A43"
                    tick={{ fontSize: 11, fill: '#405A43' }}
                    label={{ value: 'Hormonal Index (AU)', angle: 90, position: 'insideRight', fontSize: 10, fill: '#405A43' }}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null
                      const dayPhase = getCyclePhase(label, cycleLength)
                      return (
                        <div className="bg-white border border-[#E8DFD8] rounded-xl px-3.5 py-2.5 text-xs shadow-lg space-y-1">
                          <p className="font-bold text-[#6A3D55]">
                            Day {label} &middot; <span style={{ color: PHASE_META[dayPhase]?.color }}>{dayPhase} Phase</span>
                          </p>
                          {payload.map((p) => (
                            <p key={p.dataKey} style={{ color: p.color }} className="font-medium">
                              {p.name}: <span className="font-bold">{p.value}</span>
                            </p>
                          ))}
                        </div>
                      )
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />

                  {showSeverity && (
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="severity"
                      name="Symptom Severity"
                      fill="#D96B85"
                      stroke="#D96B85"
                      fillOpacity={0.16}
                      strokeWidth={2}
                      isAnimationActive={false}
                    />
                  )}
                  {showEstrogen && (
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="estrogen"
                      name="Estrogen Curve"
                      stroke="#405A43"
                      strokeWidth={2.2}
                      dot={false}
                      isAnimationActive={false}
                    />
                  )}
                  {showProgesterone && (
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="progesterone"
                      name="Progesterone Curve"
                      stroke="#D9A84E"
                      strokeWidth={2.2}
                      dot={false}
                      isAnimationActive={false}
                    />
                  )}
                  <ReferenceLine
                    yAxisId="left"
                    x={currentDay}
                    stroke="#6A3D55"
                    strokeDasharray="4 4"
                    label={{ value: `Day ${currentDay}`, fontSize: 10, fill: '#6A3D55', position: 'top' }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Interactive Graph Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E8EFE3]">
              {/* Curve toggles */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-[#7A726D] font-medium mr-1">Toggles:</span>
                <button
                  onClick={() => setShowEstrogen((v) => !v)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-colors ${
                    showEstrogen
                      ? 'bg-[#E8EFE3] text-[#405A43] border-[#405A43]/30'
                      : 'bg-white text-[#938A84] border-[#E8DFD8] line-through'
                  }`}
                >
                  Estrogen
                </button>
                <button
                  onClick={() => setShowProgesterone((v) => !v)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-colors ${
                    showProgesterone
                      ? 'bg-[#FDF8EE] text-[#D9A84E] border-[#D9A84E]/35'
                      : 'bg-white text-[#938A84] border-[#E8DFD8] line-through'
                  }`}
                >
                  Progesterone
                </button>
                <button
                  onClick={() => setShowSeverity((v) => !v)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-colors ${
                    showSeverity
                      ? 'bg-[#FCE7E8] text-[#D96B85] border-[#D96B85]/30'
                      : 'bg-white text-[#938A84] border-[#E8DFD8] line-through'
                  }`}
                >
                  Symptom Severity
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setScreeningModalOpen(true)}
                  className="flex items-center gap-1.5 text-xs font-semibold bg-[#E8EFE3] hover:bg-[#d6e4ce] text-[#405A43] border border-[#405A43]/30 rounded-full px-3.5 py-2 transition-colors shadow-2xs cursor-pointer"
                >
                  <ShieldCheck size={13} /> Why Was It Flagged? (Screening)
                </button>
                <button
                  onClick={() => setQuickLogOpen(true)}
                  className="flex items-center gap-1.5 text-xs font-semibold bg-white hover:bg-[#FCE7E8] text-[#D96B85] border border-[#D96B85]/35 rounded-full px-4 py-2 transition-colors shadow-2xs cursor-pointer"
                >
                  <Plus size={13} /> Log Today&apos;s Symptom
                </button>
                <button
                  onClick={onViewDemo}
                  className="flex items-center gap-1.5 text-xs font-semibold bg-[#405A43] hover:bg-[#344a37] text-white rounded-full px-4 py-2 transition-colors shadow-sm cursor-pointer"
                >
                  Full Clinical Dossier <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>
        </RevealBlock>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 4. FOUR PASTEL FEATURE CARDS (with Light Frost Blur)               */}
      {/* ------------------------------------------------------------------ */}
      <section id="feature-cards" className="py-12 max-w-6xl mx-auto px-6 scroll-mt-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Track Your Cycle (Blush Frost) */}
          <RevealBlock delayMs={0}>
            <div
              onClick={() => scrollTo('interactive-graph')}
              className="frost-card-blush group cursor-pointer h-full rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="h-12 w-12 rounded-2xl bg-white/80 backdrop-blur-md border border-white/90 flex items-center justify-center text-[#D96B85] mb-4 shadow-2xs group-hover:scale-105 transition-transform">
                  <div className="relative">
                    <Calendar size={22} />
                    <Droplet size={11} className="absolute -bottom-1 -right-1 text-[#D96B85] fill-[#D96B85]" />
                  </div>
                </div>
                <h3 className="font-serif text-xl font-bold text-[#6A3D55] mb-2">Track Your Cycle</h3>
                <p className="text-xs text-[#5E5259] leading-relaxed">
                  Log your periods, predict your next cycle, and stay in sync with your body.
                </p>
              </div>

              <div className="mt-6 flex justify-end">
                <span className="h-8 w-8 rounded-full bg-[#D96B85]/20 group-hover:bg-[#D96B85] text-[#D96B85] group-hover:text-white flex items-center justify-center transition-colors">
                  <ArrowRight size={14} />
                </span>
              </div>

              <Flower2 size={68} className="absolute -bottom-4 -right-4 text-[#D96B85]/10 pointer-events-none" />
            </div>
          </RevealBlock>

          {/* Card 2: Understand Your Body (Sage Light Frost) */}
          <RevealBlock delayMs={80}>
            <div
              onClick={() => {
                if (onOpenEducation) onOpenEducation()
                else setEducationModalOpen(true)
              }}
              className="frost-card-sage group cursor-pointer h-full rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="h-12 w-12 rounded-2xl bg-white/80 backdrop-blur-md border border-white/90 flex items-center justify-center text-[#405A43] mb-4 shadow-2xs group-hover:scale-105 transition-transform">
                  <UserCheck size={22} />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#405A43] mb-2">Understand Your Body</h3>
                <p className="text-xs text-[#5E5259] leading-relaxed">
                  Get personalized insights about your health, hormones, and symptoms.
                </p>
              </div>

              <div className="mt-6 flex justify-end">
                <span className="h-8 w-8 rounded-full bg-[#405A43]/20 group-hover:bg-[#405A43] text-[#405A43] group-hover:text-white flex items-center justify-center transition-colors">
                  <ArrowRight size={14} />
                </span>
              </div>

              <Activity size={68} className="absolute -bottom-4 -right-4 text-[#405A43]/10 pointer-events-none" />
            </div>
          </RevealBlock>

          {/* Card 3: Learn & Explore (Lavender Frost) */}
          <RevealBlock delayMs={160}>
            <div
              onClick={() => {
                if (onOpenEducation) onOpenEducation()
                else setEducationModalOpen(true)
              }}
              className="frost-card-lavender group cursor-pointer h-full rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="h-12 w-12 rounded-2xl bg-white/80 backdrop-blur-md border border-white/90 flex items-center justify-center text-[#6A3D55] mb-4 shadow-2xs group-hover:scale-105 transition-transform">
                  <BookOpen size={22} />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#6A3D55] mb-2">Learn &amp; Explore</h3>
                <p className="text-xs text-[#5E5259] leading-relaxed">
                  Access trusted articles, expert guides, and practical tips from healthcare professionals.
                </p>
              </div>

              <div className="mt-6 flex justify-end">
                <span className="h-8 w-8 rounded-full bg-[#6A3D55]/20 group-hover:bg-[#6A3D55] text-[#6A3D55] group-hover:text-white flex items-center justify-center transition-colors">
                  <ArrowRight size={14} />
                </span>
              </div>

              <Sparkles size={68} className="absolute -bottom-4 -right-4 text-[#6A3D55]/10 pointer-events-none" />
            </div>
          </RevealBlock>

          {/* Card 4: Wellness Tools (Cream / Gold Frost) */}
          <RevealBlock delayMs={240}>
            <div
              onClick={() => setWellnessModalOpen(true)}
              className="frost-card-gold group cursor-pointer h-full rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="h-12 w-12 rounded-2xl bg-white/80 backdrop-blur-md border border-white/90 flex items-center justify-center text-[#D9A84E] mb-4 shadow-2xs group-hover:scale-105 transition-transform">
                  <Flower2 size={22} />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#405A43] mb-2">Wellness Tools</h3>
                <p className="text-xs text-[#5E5259] leading-relaxed">
                  Mood tracker, symptom check-ins, reminders and more &mdash; for a healthier, happier you.
                </p>
              </div>

              <div className="mt-6 flex justify-end">
                <span className="h-8 w-8 rounded-full bg-[#D9A84E]/25 group-hover:bg-[#D9A84E] text-[#D9A84E] group-hover:text-white flex items-center justify-center transition-colors">
                  <ArrowRight size={14} />
                </span>
              </div>

              <Sun size={68} className="absolute -bottom-4 -right-4 text-[#D9A84E]/10 pointer-events-none" />
            </div>
          </RevealBlock>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* FOOTER                                                             */}
      {/* ------------------------------------------------------------------ */}
      <footer className="border-t border-[#F4E8C8] py-6 bg-[#FFFDF6]/92 text-center text-[11px] text-[#8C8087]">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            <span className="font-semibold text-[#405A43]">Aura Health Clinical Decision Support System.</span>{' '}
            Grounded in ACOG &amp; Rotterdam Consensus criteria.
          </p>
          <div className="flex items-center gap-4 text-[#5E5259]">
            <button onClick={onViewDemo} className="hover:text-[#D96B85] transition-colors">Case Studies</button>
            <span>&middot;</span>
            <button onClick={onGetStarted} className="hover:text-[#D96B85] transition-colors">Get Started</button>
            <span>&middot;</span>
            <button onClick={() => setAboutModalOpen(true)} className="hover:text-[#D96B85] transition-colors">About Us</button>
          </div>
        </div>
      </footer>

      {/* ------------------------------------------------------------------ */}
      {/* MODAL 1: Understand Your Body / Clinical Literacy                  */}
      {/* ------------------------------------------------------------------ */}
      <UnderstandYourBodyModal
        open={educationModalOpen}
        onClose={() => setEducationModalOpen(false)}
      />

      {/* ------------------------------------------------------------------ */}
      {/* MODAL 2: Interactive Wellness Tools                                */}
      {/* ------------------------------------------------------------------ */}
      {/* ------------------------------------------------------------------ */}
      {/* MODAL 2: Interactive Wellness Tools                                */}
      {/* ------------------------------------------------------------------ */}
      {wellnessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4 overflow-y-auto animate-[fadeIn_0.2s]">
          <div className="relative w-full max-w-xl bg-white/85 backdrop-blur-2xl border border-white/80 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 text-[#31232B]">
            <div className="flex items-center justify-between border-b border-[#E8DFD8]/80 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-2xl bg-[#F8F0E8]/85 border border-white/80 flex items-center justify-center text-[#D9A84E] shadow-2xs">
                  <Flower2 size={20} />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#6A3D55]">Daily Wellness Companion</h3>
                  <p className="text-xs text-[#7A726D]">Gentle tools to stay grounded and in tune with your rhythm.</p>
                </div>
              </div>
              <button
                onClick={() => setWellnessModalOpen(false)}
                className="h-8 w-8 rounded-full bg-white/75 hover:bg-[#FCE7E8] text-[#7A726D] hover:text-[#2E2825] border border-white/80 flex items-center justify-center transition-colors shadow-2xs"
              >
                <X size={16} />
              </button>
            </div>

            {/* Tool 1: Mood Check-in */}
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wide text-[#6A3D55]">1. How are you feeling today?</p>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {[
                  { label: 'Radiant', emoji: '☀️', color: '#D9A84E' },
                  { label: 'Calm', emoji: '🌿', color: '#405A43' },
                  { label: 'Tender', emoji: '🌸', color: '#D96B85' },
                  { label: 'Sensitive', emoji: '🌧️', color: '#6A3D55' },
                  { label: 'Exhausted', emoji: '🌙', color: '#7A726D' },
                ].map((m) => (
                  <button
                    key={m.label}
                    onClick={() => setSelectedMood(m.label)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                      selectedMood === m.label
                        ? 'border-[#D96B85] bg-[#FCE7E8]/90 shadow-xs scale-105 backdrop-blur-md'
                        : 'border-white/80 bg-white/60 hover:bg-white/90 backdrop-blur-md'
                    }`}
                  >
                    <span className="text-xl mb-1">{m.emoji}</span>
                    <span className="text-[11px] font-semibold text-[#31232B]">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tool 2: Hydration Companion */}
            <div className="bg-[#E8EFE3]/80 backdrop-blur-md rounded-2xl p-4 border border-white/80 flex items-center justify-between shadow-2xs">
              <div>
                <p className="text-xs font-bold text-[#405A43] flex items-center gap-1.5">
                  <Droplet size={14} className="fill-[#405A43]" /> Daily Hydration Goal
                </p>
                <p className="text-[11px] text-[#5E5259] mt-0.5">
                  {waterCups} of 8 glasses logged ({(waterCups * 0.25).toFixed(1)}L)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setWaterCups((c) => Math.max(0, c - 1))}
                  className="h-8 w-8 rounded-full bg-white/85 text-[#405A43] border border-white/80 font-bold flex items-center justify-center hover:bg-[#F8F0E8] shadow-2xs"
                >
                  -
                </button>
                <button
                  onClick={() => setWaterCups((c) => Math.min(12, c + 1))}
                  className="h-8 w-8 rounded-full bg-[#405A43] text-white font-bold flex items-center justify-center hover:bg-[#344a37] shadow-xs"
                >
                  +
                </button>
              </div>
            </div>

            {/* Tool 3: Calming Box-Breathing Timer */}
            <div className="bg-white/65 backdrop-blur-md rounded-2xl p-4 border border-white/80 text-center space-y-3 shadow-2xs">
              <p className="text-xs font-bold text-[#6A3D55] uppercase tracking-wide">
                2-Minute Calming Breath
              </p>
              <div className="flex items-center justify-center gap-3">
                {['Inhale (4s)', 'Hold (4s)', 'Exhale (4s)', 'Rest (4s)'].map((p) => {
                  const isCurrent = breathingPhase.startsWith(p.slice(0, 3))
                  return (
                    <button
                      key={p}
                      onClick={() => setBreathingPhase(p)}
                      className={`text-[10px] font-bold px-3 py-1 rounded-full transition-all ${
                        isCurrent
                          ? 'bg-[#D96B85] text-white shadow-2xs'
                          : 'bg-white/75 text-[#7A726D] border border-white/80 hover:bg-white'
                      }`}
                    >
                      {p}
                    </button>
                  )
                })}
              </div>
              <p className="text-[11px] text-[#7A726D] italic">
                &ldquo;Give yourself permission to pause and breathe &mdash; your nervous system thanks you.&rdquo;
              </p>
            </div>

            <button
              onClick={() => setWellnessModalOpen(false)}
              className="w-full bg-[#D96B85] hover:bg-[#B8526B] text-white font-semibold text-xs py-3 rounded-full transition-colors shadow-sm"
            >
              Done &amp; Save Today&apos;s Check-in
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* MODAL 3: Trust Pillar Details                                      */}
      {/* ------------------------------------------------------------------ */}
      {selectedPillar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4 overflow-y-auto animate-[fadeIn_0.2s]">
          <div className="relative w-full max-w-lg bg-white/85 backdrop-blur-2xl border border-white/80 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-4 text-[#31232B]">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 border border-current/20 shadow-xs"
                  style={{ color: selectedPillar.color, backgroundColor: `${selectedPillar.color}18` }}
                >
                  <selectedPillar.icon size={20} />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#31232B]">{selectedPillar.title}</h3>
                  <p className="text-xs font-semibold" style={{ color: selectedPillar.color }}>
                    {selectedPillar.subtitle}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPillar(null)}
                className="h-8 w-8 rounded-full bg-white/75 hover:bg-[#FCE7E8] text-[#7A726D] hover:text-[#2E2825] border border-white/80 flex items-center justify-center transition-colors shadow-2xs"
              >
                <X size={16} />
              </button>
            </div>

            <div className="bg-white/65 backdrop-blur-md p-4 rounded-2xl border border-white/80 text-xs sm:text-sm text-[#5E5259] leading-relaxed shadow-2xs">
              {selectedPillar.details}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedPillar(null)}
                className="px-5 py-2 text-xs font-semibold text-white bg-[#405A43] hover:bg-[#344a37] rounded-full transition-colors shadow-xs"
              >
                Understood &amp; Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* MODAL 4: About Aura Health / "You're Not Alone" Modal               */}
      {/* ------------------------------------------------------------------ */}
      {aboutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4 overflow-y-auto animate-[fadeIn_0.2s]">
          <div className="relative w-full max-w-xl bg-white/85 backdrop-blur-2xl border border-white/80 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5 text-[#31232B]">
            <div className="flex items-center justify-between border-b border-[#E8DFD8]/80 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-2xl bg-[#FCE7E8]/85 border border-white/80 flex items-center justify-center text-[#D96B85] shadow-2xs">
                  <Heart size={20} className="fill-[#D96B85]" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#6A3D55]">About Aura Health</h3>
                  <p className="text-xs text-[#7A726D]">Real care. Real women. Always.</p>
                </div>
              </div>
              <button
                onClick={() => setAboutModalOpen(false)}
                className="h-8 w-8 rounded-full bg-white/75 hover:bg-[#FCE7E8] text-[#7A726D] hover:text-[#2E2825] border border-white/80 flex items-center justify-center transition-colors shadow-2xs"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm text-[#5E5259] leading-relaxed">
              <p>
                Women spend an average of <strong className="text-[#6A3D55]">7 to 10 years</strong> seeking diagnosis for complex conditions like Endometriosis, PCOS, and PMDD. Symptoms are too often dismissed as &ldquo;just normal cramps&rdquo; or &ldquo;stress.&rdquo;
              </p>
              <p>
                Aura Health bridges this gap with an evidence-based clinical decision co-pilot that correlates cyclical hormone fluctuations against patient-reported symptoms.
              </p>
              <div className="bg-[#E8EFE3]/80 backdrop-blur-md rounded-2xl p-4 border border-white/80 space-y-2 shadow-2xs">
                <p className="font-bold text-[#405A43] flex items-center gap-1.5">
                  <CheckCircle2 size={14} /> Our 3 Commitments:
                </p>
                <ul className="list-disc list-inside space-y-1 text-xs text-[#31232B]">
                  <li>Validate your lived experience with objective endocrine science.</li>
                  <li>Prepare structured SOAP consultation dossiers for your medical provider.</li>
                  <li>Preserve absolute privacy with local-first, zero-broker data storage.</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  setAboutModalOpen(false)
                  scrollTo('interactive-graph')
                }}
                className="text-xs font-semibold text-[#D96B85] hover:underline"
              >
                Try the Interactive Tracker &rarr;
              </button>
              <button
                onClick={() => setAboutModalOpen(false)}
                className="px-5 py-2 text-xs font-semibold text-white bg-[#D96B85] hover:bg-[#B8526B] rounded-full transition-colors shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* MODAL 5: Interactive Search Modal                                  */}
      {/* ------------------------------------------------------------------ */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-md p-4 pt-16 overflow-y-auto animate-[fadeIn_0.2s]">
          <div className="relative w-full max-w-xl bg-white/85 backdrop-blur-2xl border border-white/80 rounded-3xl shadow-2xl p-6 space-y-4 text-[#31232B]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D96B85]">
                <Search size={14} /> Clinical Knowledge Search
              </div>
              <button
                onClick={() => setSearchModalOpen(false)}
                className="h-7 w-7 rounded-full bg-white/75 hover:bg-[#FCE7E8] text-[#7A726D] border border-white/80 flex items-center justify-center transition-colors shadow-2xs"
              >
                <X size={14} />
              </button>
            </div>

            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#938A84]" />
              <input
                type="text"
                autoFocus
                placeholder="Search cramps, PCOS, estrogen, progesterone, fatigue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm bg-white/70 backdrop-blur-md border border-white/80 rounded-2xl pl-10 pr-4 py-2.5 text-[#31232B] placeholder:text-[#938A84] focus:outline-none focus:border-[#D96B85] transition-colors shadow-2xs"
              />
            </div>

            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
              {filteredSearch.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setSearchModalOpen(false)
                    if (onOpenEducation) onOpenEducation()
                    else setEducationModalOpen(true)
                  }}
                  className="p-3 rounded-2xl border border-white/80 bg-white/60 backdrop-blur-md hover:border-[#D96B85]/50 hover:bg-[#FCE7E8]/40 transition-all cursor-pointer group shadow-2xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-[#405A43] bg-[#E8EFE3] rounded-full px-2 py-0.5">
                      {item.category}
                    </span>
                    <ArrowRight size={12} className="text-[#938A84] group-hover:text-[#D96B85] transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <h4 className="text-xs font-bold text-[#31232B] group-hover:text-[#6A3D55]">{item.title}</h4>
                  <p className="text-[11px] text-[#7A726D] mt-0.5 leading-snug">{item.desc}</p>
                </div>
              ))}
              {filteredSearch.length === 0 && (
                <div className="text-center py-6 text-xs text-[#7A726D]">
                  No direct matches. Try searching &ldquo;PCOS&rdquo;, &ldquo;cramps&rdquo;, or &ldquo;hormones&rdquo;.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* MODAL 6: Quick Symptom Logger Modal (Directly on Graph)            */}
      {/* ------------------------------------------------------------------ */}
      {quickLogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4 overflow-y-auto animate-[fadeIn_0.2s]">
          <div className="relative w-full max-w-md bg-white/85 backdrop-blur-2xl border border-white/80 rounded-3xl shadow-2xl p-6 space-y-4 text-[#31232B]">
            <div className="flex items-center justify-between border-b border-[#E8DFD8]/80 pb-3">
              <div className="flex items-center gap-2">
                <Wand2 size={16} className="text-[#D96B85]" />
                <h3 className="font-serif text-lg font-bold text-[#6A3D55]">Log Symptom on Day {currentDay}</h3>
              </div>
              <button
                onClick={() => setQuickLogOpen(false)}
                className="h-7 w-7 rounded-full bg-white/75 hover:bg-[#FCE7E8] text-[#7A726D] border border-white/80 flex items-center justify-center transition-colors shadow-2xs"
              >
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleQuickLogSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#5E5259] mb-1">Describe what you are experiencing:</label>
                <textarea
                  rows={3}
                  value={quickSymptomText}
                  onChange={(e) => setQuickSymptomText(e.target.value)}
                  placeholder='e.g. "आज पेट में बहुत दर्द है, कल से ज्यादा" or "Sharp lower pelvic cramps, 8/10"'
                  className="w-full text-xs bg-white/70 backdrop-blur-md border border-white/80 rounded-xl p-3 text-[#31232B] placeholder:text-[#938A84] focus:outline-none focus:border-[#D96B85] resize-none shadow-2xs"
                  autoFocus
                />

                {/* Regional Language Quick Voice Chips */}
                <div className="mt-2 space-y-1">
                  <span className="text-[10px] font-semibold text-[#6A3D55] uppercase tracking-wide flex items-center gap-1">
                    🇮🇳 Voice-First Regional Presets (Hindi, Hinglish, Bengali, Tamil):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: 'Hindi', text: 'आज पेट में बहुत दर्द है, कल से ज्यादा', severity: 8 },
                      { label: 'Hinglish', text: 'Aaj pet me bahut dard hai, kal se zyada', severity: 8 },
                      { label: 'Bengali', text: 'আজ পেটে খুব তীব্র যন্ত্রণা ও বমি ভাব', severity: 8 },
                      { label: 'Tamil', text: 'இன்று அடிவயிற்றில் கடுமையான வலி', severity: 8 },
                    ].map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => {
                          setQuickSymptomText(p.text)
                          setQuickSeverity(p.severity)
                        }}
                        className="text-[10px] font-medium px-2.5 py-0.5 rounded-full border border-white/80 bg-white/75 hover:bg-[#FCE7E8] text-[#405A43] hover:text-[#D96B85] transition-all shadow-2xs cursor-pointer"
                      >
                        {p.label}: &ldquo;{p.text}&rdquo;
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-[#5E5259] mb-1">
                  <span>Severity Score:</span>
                  <span className="font-bold text-[#D96B85]">{quickSeverity} / 10</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={quickSeverity}
                  onChange={(e) => setQuickSeverity(Number(e.target.value))}
                  className="w-full accent-[#D96B85] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setQuickLogOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#7A726D] hover:bg-white/80 rounded-full transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!quickSymptomText.trim()}
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#D96B85] hover:bg-[#B8526B] disabled:opacity-40 rounded-full transition-colors shadow-xs"
                >
                  Plot on Cycle Graph
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* MODAL 7: Explainable Risk Screening & Referral ("Why Was It Flagged") */}
      {/* ------------------------------------------------------------------ */}
      <ExplainableRiskModal
        open={screeningModalOpen}
        onClose={() => setScreeningModalOpen(false)}
        screeningReports={screeningReports}
        patient={activePatient}
        onOpenSoap={onOpenSoap}
      />

      {/* ------------------------------------------------------------------ */}
      {/* MODAL 8: Privacy-First & Stigma Protection Hub                     */}
      {/* ------------------------------------------------------------------ */}
      <PrivacyModal
        open={localPrivacyOpen}
        onClose={() => setLocalPrivacyOpen(false)}
        privacySettings={privacySettings || { anonymousMode: isAnonymous, camouflageMode: false }}
        onUpdatePrivacy={(newSettings) => {
          if (onUpdatePrivacy) onUpdatePrivacy(newSettings)
        }}
        onTriggerPanic={() => {
          if (onTriggerPanic) onTriggerPanic()
        }}
        onResetAllData={() => {
          if (onResetAllData) onResetAllData()
        }}
      />

      {/* ------------------------------------------------------------------ */}
      {/* MODAL 9: Life-Stage Adaptive Mode Explorer                         */}
      {/* ------------------------------------------------------------------ */}
      <LifeStageModal
        open={localLifeStageOpen}
        onClose={() => setLocalLifeStageOpen(false)}
        activeLifeStageId={activeLifeStageId}
        onSelectLifeStage={(stageId) => {
          if (onSelectLifeStage) onSelectLifeStage(stageId)
        }}
      />
    </div>
  )
}
