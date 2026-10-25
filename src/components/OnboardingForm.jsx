import { useState, useMemo } from 'react'
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Loader2,
  Check,
  Droplet,
  Compass,
  Activity,
  Stethoscope,
  Heart,
  Baby,
  Sun,
  Shield,
  Calendar,
  Cake,
  ChevronRight,
  CheckCircle2,
  Moon,
  Info,
} from 'lucide-react'
import {
  GOAL_OPTIONS,
  PERIOD_FREQUENCY_OPTIONS,
  CONCERN_OPTIONS,
  createPatientFromOnboarding,
} from '../utils/onboarding'
import { calculateGestationalInfo } from '../utils/pregnancyUtils'

const ICON_MAP = {
  Droplet,
  Compass,
  Activity,
  Stethoscope,
  Heart,
  Baby,
  Sun,
  Shield,
  CheckCircle2,
  Moon,
  Sparkles,
}

export default function OnboardingForm({ onComplete, onSkip, onBack }) {
  const resolveInitialStep = () => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash
      if (hash.includes('step=goals')) return 'goals'
      if (hash.includes('step=pregnancy')) return 'pregnancy'
      if (hash.includes('step=frequency')) return 'frequency'
      if (hash.includes('step=cycle')) return 'cycle_details'
    }
    return 'login'
  }

  // Step state: 'login' -> 'goals' -> ('pregnancy' or 'frequency') -> ('cycle_details')
  const [currentStep, setCurrentStep] = useState(resolveInitialStep)
  const [submitting, setSubmitting] = useState(false)
  const [touched, setTouched] = useState(false)

  // Form State
  const [authMode, setAuthMode] = useState('profile') // 'profile' | 'signin' | 'guest'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [age, setAge] = useState('27')

  // Goals (Multiple Selection)
  const [selectedGoals, setSelectedGoals] = useState(['period', 'body'])

  // Period Frequency
  const [frequency, setFrequency] = useState('regular')
  const [cycleLength, setCycleLength] = useState(28)

  // Cycle Details
  const [lastPeriodStart, setLastPeriodStart] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() - 14)
    return d.toISOString().slice(0, 10)
  })
  const [dontRememberPeriod, setDontRememberPeriod] = useState(false)
  const [concernId, setConcernId] = useState('general')

  // Pregnancy details
  const [pregnancyMode, setPregnancyMode] = useState('calc') // 'calc' | 'manual'
  const [pregnancyLmp, setPregnancyLmp] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() - 70)
    return d.toISOString().slice(0, 10)
  })
  const [pregnancyDueDate, setPregnancyDueDate] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 210)
    return d.toISOString().slice(0, 10)
  })

  const isPregnancySelected = useMemo(
    () => selectedGoals.includes('pregnancy'),
    [selectedGoals]
  )

  // Live calculated pregnancy info
  const pregnancyInfo = useMemo(() => {
    if (pregnancyMode === 'calc') {
      return calculateGestationalInfo({ lmp: pregnancyLmp })
    }
    return calculateGestationalInfo({ dueDate: pregnancyDueDate })
  }, [pregnancyMode, pregnancyLmp, pregnancyDueDate])

  const toggleGoal = (id) => {
    setSelectedGoals((prev) => {
      if (id === 'general') {
        return prev.includes('general') ? [] : ['general']
      }
      const filtered = prev.filter((g) => g !== 'general')
      if (filtered.includes(id)) {
        return filtered.filter((g) => g !== id)
      }
      return [...filtered, id]
    })
  }

  // Navigation handlers
  const handleLoginContinue = () => {
    if (authMode !== 'guest' && !name.trim()) {
      setTouched(true)
      return
    }
    setTouched(false)
    setCurrentStep('goals')
  }

  const handleGoalsContinue = () => {
    if (selectedGoals.length === 0) {
      setTouched(true)
      return
    }
    setTouched(false)
    if (isPregnancySelected) {
      setCurrentStep('pregnancy')
    } else {
      setCurrentStep('frequency')
    }
  }

  const handleFrequencyContinue = () => {
    setCurrentStep('cycle_details')
  }

  const handleFinish = () => {
    setSubmitting(true)
    window.setTimeout(() => {
      const patient = createPatientFromOnboarding({
        name: authMode === 'guest' ? 'Anonymous User' : name,
        age,
        cycleLength: frequency === 'regular' ? cycleLength : 32,
        lastPeriodStart: dontRememberPeriod ? '' : (isPregnancySelected ? pregnancyInfo.lmp : lastPeriodStart),
        concernId,
        goals: selectedGoals,
        periodFrequency: frequency,
        pregnancyInfo: isPregnancySelected
          ? {
              isPregnant: true,
              mode: pregnancyMode,
              dueDate: pregnancyInfo.dueDate,
              lmp: pregnancyInfo.lmp,
              weeks: pregnancyInfo.weeks,
              days: pregnancyInfo.days,
              trimester: pregnancyInfo.trimester,
              size: pregnancyInfo.size,
              highlight: pregnancyInfo.highlight,
            }
          : null,
      })
      onComplete(patient)
    }, 700)
  }

  // Back step router
  const handleStepBack = () => {
    setTouched(false)
    if (currentStep === 'cycle_details') {
      setCurrentStep('frequency')
    } else if (currentStep === 'frequency' || currentStep === 'pregnancy') {
      setCurrentStep('goals')
    } else if (currentStep === 'goals') {
      setCurrentStep('login')
    } else {
      if (onBack) onBack()
      else if (onSkip) onSkip()
    }
  }

  // Step indicator count
  const stepNumber =
    currentStep === 'login'
      ? 1
      : currentStep === 'goals'
      ? 2
      : currentStep === 'pregnancy'
      ? 3
      : currentStep === 'frequency'
      ? 3
      : 4
  const totalSteps = isPregnancySelected ? 3 : 4

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-xl">
        {/* Top Step Progress Bar */}
        <div className="flex items-center justify-between gap-2 mb-4 px-2">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((n) => (
              <div
                key={n}
                className={`h-2 rounded-full transition-all duration-500 ${
                  n === stepNumber
                    ? 'w-8 sm:w-10 bg-[#D96B85]'
                    : n < stepNumber
                    ? 'w-5 sm:w-6 bg-[#405A43]'
                    : 'w-5 sm:w-6 bg-[#E8EFE3]'
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-bold text-[#6A3D55] uppercase tracking-wider">
            Step {stepNumber} of {totalSteps}
          </span>
        </div>

        {/* Glassmorphic Container Card with High Contrast */}
        <div className="rounded-3xl p-6 sm:p-9 relative overflow-hidden shadow-[0_20px_50px_rgba(106,61,85,0.12)] border border-white bg-white/95 backdrop-blur-2xl">
          {submitting ? (
            /* Loading State */
            <div className="flex flex-col items-center justify-center py-16 animate-landing-fade-up text-center">
              <Loader2 size={38} className="text-[#D96B85] animate-spin mb-4" />
              <h3 className="text-xl font-serif font-bold text-[#3A1F2D]">
                Setting up your personalized Aura dashboard...
              </h3>
              <p className="text-xs sm:text-sm text-[#4A3E45] mt-2 max-w-sm">
                Calibrating your cycle models, symptom correlators, and clinical screening baseline.
              </p>
            </div>
          ) : currentStep === 'login' ? (
            /* ------------------------------------------------------------- */
            /* STEP 1: WELCOME & SIGN IN / PROFILE CREATION                  */
            /* ------------------------------------------------------------- */
            <div key="step-login">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E8DFD8]">
                <button
                  type="button"
                  onClick={handleStepBack}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5E5259] hover:text-[#D96B85] transition-colors cursor-pointer group"
                >
                  <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform text-[#D96B85]" />
                  <span>Back to Landing Page</span>
                </button>
                <div className="flex items-center gap-1 text-xs font-bold text-[#405A43] bg-[#E8EFE3] px-3 py-1 rounded-full border border-[#405A43]/20">
                  <Shield size={12} />
                  <span>100% Private</span>
                </div>
              </div>

              {/* Aura Brand Icon & Title */}
              <div className="flex items-center gap-3.5 mb-5">
                <div className="h-12 w-12 rounded-2xl bg-[#FCE7E8] border border-[#D96B85]/30 flex items-center justify-center shadow-xs text-[#D96B85] shrink-0">
                  <Sparkles size={24} />
                </div>
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#3A1F2D]">
                    Welcome to Aura
                  </h2>
                  <p className="text-xs sm:text-sm text-[#52464D] mt-0.5">
                    Log in or create your personalized women&apos;s health space.
                  </p>
                </div>
              </div>

              {/* Auth Mode Toggle Tabs */}
              <div className="flex p-1 bg-[#FAF7F2] rounded-2xl border border-[#E8DFD8] mb-5">
                {[
                  { id: 'profile', label: 'Create Profile' },
                  { id: 'signin', label: 'Sign In' },
                  { id: 'guest', label: 'Guest Mode' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setAuthMode(tab.id)
                      setTouched(false)
                    }}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      authMode === tab.id
                        ? 'bg-white text-[#D96B85] shadow-xs'
                        : 'text-[#7A726D] hover:text-[#31232B]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {authMode === 'guest' ? (
                <div className="p-4 rounded-2xl bg-[#E8EFE3]/90 border border-[#405A43]/30 mb-6 text-xs text-[#405A43] space-y-1.5 shadow-2xs">
                  <p className="font-bold flex items-center gap-1.5 text-sm">
                    <Shield size={15} /> Anonymous Zero-Identity Mode
                  </p>
                  <p className="text-xs text-[#52464D] leading-relaxed">
                    No name, no email, and no account required. Your health records and cycle patterns stay strictly local in your device&apos;s memory.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-[#4A3E45] mb-1.5">
                      What should we call you?
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Priya"
                      className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF7F2] border border-[#DDD3CB] focus:border-[#D96B85] focus:bg-white focus:outline-none text-sm font-semibold text-[#2B2327] placeholder:text-[#9C8F8B] shadow-2xs transition-all"
                    />
                    {touched && !name.trim() && (
                      <p className="text-xs text-[#D96B85] mt-1 font-semibold">Please enter your name or use Guest Mode.</p>
                    )}
                  </div>

                  {authMode === 'signin' && (
                    <div>
                      <label className="block text-xs font-bold text-[#4A3E45] mb-1.5">
                        Email or Username (Optional)
                      </label>
                      <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@aurahealth.app"
                        className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF7F2] border border-[#DDD3CB] focus:border-[#D96B85] focus:bg-white focus:outline-none text-sm font-semibold text-[#2B2327] placeholder:text-[#9C8F8B] shadow-2xs transition-all"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-[#4A3E45] mb-1.5">
                      Your age
                    </label>
                    <input
                      type="number"
                      min={10}
                      max={75}
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF7F2] border border-[#DDD3CB] focus:border-[#D96B85] focus:bg-white focus:outline-none text-sm font-semibold text-[#2B2327] shadow-2xs transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={onSkip}
                  className="text-xs text-[#7A726D] hover:text-[#31232B] font-medium transition-colors cursor-pointer"
                >
                  Skip &mdash; view demo
                </button>
                <button
                  type="button"
                  onClick={handleLoginContinue}
                  className="inline-flex items-center gap-1.5 bg-[#D96B85] hover:bg-[#B8526B] active:scale-95 text-white text-xs sm:text-sm font-semibold rounded-full px-6 py-2.5 shadow-sm transition-all cursor-pointer"
                >
                  <span>Continue to Goals</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ) : currentStep === 'goals' ? (
            /* ------------------------------------------------------------- */
            /* STEP 2: "WHAT WOULD YOU LIKE TO DO WITH AURA?"                */
            /* (Multiple goal cards matching user screenshots 1 & 3)         */
            /* ------------------------------------------------------------- */
            <div key="step-goals">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#E8DFD8]">
                <button
                  type="button"
                  onClick={handleStepBack}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5E5259] hover:text-[#D96B85] transition-colors cursor-pointer group"
                >
                  <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform text-[#D96B85]" />
                  <span>Back</span>
                </button>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-[#D96B85] uppercase tracking-wide">
                  <Sparkles size={12} />
                  <span>Select Goals</span>
                </div>
              </div>

              <div className="mb-4">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#3A1F2D] leading-tight">
                  What would you like to do with Aura?
                </h2>
                <p className="text-xs sm:text-sm font-medium text-[#4A3E45] mt-1">
                  You can select multiple goals.
                </p>
              </div>

              {/* 8 Goals in 2-Column Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 max-h-[50vh] overflow-y-auto pr-1">
                {GOAL_OPTIONS.map((g) => {
                  const IconComp = ICON_MAP[g.icon] || Droplet
                  const isSelected = selectedGoals.includes(g.id)
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => toggleGoal(g.id)}
                      className={`relative text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-2 border-[#D96B85] bg-[#FCE7E8]/90 shadow-sm scale-[1.01]'
                          : 'border-[#E8DFD8] bg-[#FAF7F2]/90 hover:bg-white hover:border-[#D96B85]/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div
                          className="h-8 w-8 rounded-full flex items-center justify-center shrink-0 shadow-2xs"
                          style={{ backgroundColor: g.bg, color: g.color }}
                        >
                          <IconComp size={16} />
                        </div>
                        {isSelected && (
                          <span className="h-5 w-5 rounded-full bg-[#D96B85] text-white flex items-center justify-center text-xs shrink-0 shadow-xs">
                            <Check size={12} />
                          </span>
                        )}
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-[#2B2327] leading-snug">
                          {g.label}
                        </h4>
                        <p className="text-[11px] text-[#52464D] leading-tight mt-1 line-clamp-2">
                          {g.desc}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>

              {touched && selectedGoals.length === 0 && (
                <p className="text-xs text-[#D96B85] font-medium mt-2">
                  Please select at least one goal to personalize your experience.
                </p>
              )}

              <div className="flex items-center justify-between pt-4 mt-2 border-t border-[#E8DFD8]">
                <button
                  type="button"
                  onClick={onSkip}
                  className="text-xs text-[#7A726D] hover:text-[#31232B] font-medium transition-colors"
                >
                  Skip
                </button>
                <button
                  type="button"
                  onClick={handleGoalsContinue}
                  className="inline-flex items-center gap-1.5 bg-[#D96B85] hover:bg-[#B8526B] active:scale-95 text-white text-xs sm:text-sm font-semibold rounded-full px-6 py-2.5 shadow-sm transition-all cursor-pointer"
                >
                  <span>Next</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ) : currentStep === 'pregnancy' ? (
            /* ------------------------------------------------------------- */
            /* STEP 3A: "YOU'RE PREGNANT" (Due Date Setup, Screenshot 5)     */
            /* ------------------------------------------------------------- */
            <div key="step-pregnancy">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#E8DFD8]">
                <button
                  type="button"
                  onClick={handleStepBack}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5E5259] hover:text-[#D96B85] transition-colors cursor-pointer group"
                >
                  <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform text-[#D96B85]" />
                  <span>Back to Goals</span>
                </button>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-[#6A3D55] bg-[#E8DDF0] px-2.5 py-0.5 rounded-full">
                  <Baby size={12} />
                  <span>Pregnancy Mode</span>
                </div>
              </div>

              {/* Cute Maternal Badge & Heading */}
              <div className="flex flex-col items-center text-center mb-5">
                <div className="h-14 w-14 rounded-full bg-[#E8DDF0] border-2 border-white flex items-center justify-center text-[#6A3D55] shadow-sm mb-2.5">
                  <Baby size={28} />
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#6A3D55]">
                  You&apos;re pregnant
                </h2>
                <p className="text-xs text-[#5E5259] mt-1 max-w-md">
                  Set your due date using one of the options below. You can change this later anytime.
                </p>
              </div>

              {/* Two Option Cards: Calculate vs Manual */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                {/* Option 1: Calculate due date via LMP */}
                <button
                  type="button"
                  onClick={() => setPregnancyMode('calc')}
                  className={`text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    pregnancyMode === 'calc'
                      ? 'border-[#6A3D55] bg-[#E8DDF0]/70 shadow-sm'
                      : 'border-white/80 bg-white/70 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-9 w-9 rounded-full bg-white text-[#6A3D55] flex items-center justify-center shadow-2xs">
                      <Droplet size={18} />
                    </div>
                    {pregnancyMode === 'calc' && (
                      <span className="h-5 w-5 rounded-full bg-[#6A3D55] text-white flex items-center justify-center text-xs">
                        <Check size={12} />
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#31232B]">
                      Calculate my due date*
                    </h4>
                    <p className="text-[10px] text-[#5E5259] mt-1 leading-snug">
                      *Let Aura calculate your estimated due date by entering the start date of your last period.
                    </p>
                  </div>
                </button>

                {/* Option 2: Enter due date manually */}
                <button
                  type="button"
                  onClick={() => setPregnancyMode('manual')}
                  className={`text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    pregnancyMode === 'manual'
                      ? 'border-[#6A3D55] bg-[#E8DDF0]/70 shadow-sm'
                      : 'border-white/80 bg-white/70 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-9 w-9 rounded-full bg-white text-[#6A3D55] flex items-center justify-center shadow-2xs">
                      <Cake size={18} />
                    </div>
                    {pregnancyMode === 'manual' && (
                      <span className="h-5 w-5 rounded-full bg-[#6A3D55] text-white flex items-center justify-center text-xs">
                        <Check size={12} />
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#31232B]">
                      Enter my due date manually
                    </h4>
                    <p className="text-[10px] text-[#5E5259] mt-1 leading-snug">
                      Enter your physician-confirmed Estimated Due Date (EDD).
                    </p>
                  </div>
                </button>
              </div>

              {/* Dynamic Input Panel based on chosen method */}
              <div className="p-4 rounded-2xl bg-white/90 border border-[#E8DFD8] shadow-2xs mb-5">
                {pregnancyMode === 'calc' ? (
                  <div>
                    <label className="block text-xs font-bold text-[#6A3D55] mb-1.5 flex items-center gap-1.5">
                      <Calendar size={13} />
                      First day of your last menstrual period (LMP):
                    </label>
                    <input
                      type="date"
                      value={pregnancyLmp}
                      max={new Date().toISOString().slice(0, 10)}
                      onChange={(e) => setPregnancyLmp(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E8DFD8] bg-[#FAF7F2] text-xs font-semibold text-[#31232B] focus:border-[#6A3D55] focus:outline-none"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-[#6A3D55] mb-1.5 flex items-center gap-1.5">
                      <Calendar size={13} />
                      Estimated Due Date (EDD):
                    </label>
                    <input
                      type="date"
                      value={pregnancyDueDate}
                      min={new Date().toISOString().slice(0, 10)}
                      onChange={(e) => setPregnancyDueDate(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E8DFD8] bg-[#FAF7F2] text-xs font-semibold text-[#31232B] focus:border-[#6A3D55] focus:outline-none"
                    />
                  </div>
                )}

                {/* Live Gestational Age Result Box */}
                <div className="mt-3 pt-3 border-t border-[#E8DFD8] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[#7A726D]">Estimated Due Date: </span>
                    <strong className="text-[#6A3D55]">{pregnancyInfo.dueDate || 'Calculated'}</strong>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#405A43] bg-[#E8EFE3] px-2.5 py-0.5 rounded-full">
                      Week {pregnancyInfo.weeks} &middot; {pregnancyInfo.trimester}
                    </span>
                  </div>
                </div>

                <div className="mt-2 text-[11px] text-[#5E5259] italic flex items-center gap-1">
                  <span>🌱 Baby is about the size of a:</span>
                  <strong className="text-[#6A3D55] not-italic">{pregnancyInfo.size}</strong>
                  <span className="text-[#8C8087]">({pregnancyInfo.highlight})</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleStepBack}
                  className="text-xs text-[#7A726D] hover:text-[#31232B] font-medium"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleFinish}
                  className="inline-flex items-center gap-1.5 bg-[#6A3D55] hover:bg-[#522e42] active:scale-95 text-white text-xs sm:text-sm font-semibold rounded-full px-6 py-2.5 shadow-sm transition-all cursor-pointer"
                >
                  <span>Launch Pregnancy Dashboard</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ) : currentStep === 'frequency' ? (
            /* ------------------------------------------------------------- */
            /* STEP 3B: "HOW FREQUENT ARE YOUR PERIODS?" (Screenshots 2 & 4) */
            /* ------------------------------------------------------------- */
            <div key="step-frequency">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#E8DFD8]">
                <button
                  type="button"
                  onClick={handleStepBack}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5E5259] hover:text-[#D96B85] transition-colors cursor-pointer group"
                >
                  <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform text-[#D96B85]" />
                  <span>Back to Goals</span>
                </button>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-[#D96B85] uppercase tracking-wide">
                  <Sparkles size={12} />
                  <span>Cycle Pattern</span>
                </div>
              </div>

              <div className="mb-5">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#3A1F2D]">
                  How frequent are your periods?
                </h2>
                <p className="text-xs sm:text-sm font-medium text-[#4A3E45] mt-1">
                  This calibrates phase forecasting, symptom windows, and endocrine screening.
                </p>
              </div>

              {/* 4 Options from Screenshot 2 & 4 */}
              <div className="space-y-2.5 mb-5">
                {PERIOD_FREQUENCY_OPTIONS.map((opt) => {
                  const isSelected = frequency === opt.id
                  return (
                    <div key={opt.id} className="space-y-2">
                      <button
                        type="button"
                        onClick={() => setFrequency(opt.id)}
                        className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'border-2 border-[#D96B85] bg-[#FCE7E8]/90 shadow-xs'
                            : 'border-[#E8DFD8] bg-[#FAF7F2]/90 hover:bg-white hover:border-[#D96B85]/50'
                        }`}
                      >
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-[#2B2327]">{opt.label}</h4>
                          <p className="text-[11px] text-[#52464D] mt-0.5">{opt.desc}</p>
                        </div>
                        <div
                          className={`h-7 w-7 rounded-full flex items-center justify-center transition-all shrink-0 ${
                            isSelected
                              ? 'bg-[#D96B85] text-white shadow-2xs'
                              : 'bg-white/80 text-[#7A726D] border border-[#E8DFD8]'
                          }`}
                        >
                          <ChevronRight size={15} />
                        </div>
                      </button>

                      {/* If "Regular" is selected, show cycle length slider/stepper */}
                      {isSelected && opt.id === 'regular' && (
                        <div className="p-3.5 rounded-2xl bg-white border border-[#D96B85]/40 shadow-xs">
                          <div className="flex items-center justify-between text-xs font-semibold text-[#5E5259] mb-1.5">
                            <span>Average cycle length:</span>
                            <span className="font-bold text-[#D96B85] text-sm">
                              {cycleLength} days
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => setCycleLength((l) => Math.max(18, l - 1))}
                              className="h-8 w-8 rounded-full bg-[#FAF7F2] border border-[#E8DFD8] text-xs font-bold text-[#6A3D55] hover:bg-[#FCE7E8]"
                            >
                              -
                            </button>
                            <input
                              type="range"
                              min={18}
                              max={45}
                              value={cycleLength}
                              onChange={(e) => setCycleLength(Number(e.target.value))}
                              className="w-full accent-[#D96B85] cursor-pointer"
                            />
                            <button
                              type="button"
                              onClick={() => setCycleLength((l) => Math.min(60, l + 1))}
                              className="h-8 w-8 rounded-full bg-[#FAF7F2] border border-[#E8DFD8] text-xs font-bold text-[#6A3D55] hover:bg-[#FCE7E8]"
                            >
                              +
                            </button>
                          </div>
                          <p className="text-[10px] text-[#7A726D] mt-1 text-center">
                            Typical adult menstrual cycles range between 21 and 35 days.
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#E8DFD8]">
                <button
                  type="button"
                  onClick={handleStepBack}
                  className="text-xs text-[#7A726D] hover:text-[#31232B] font-medium"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleFrequencyContinue}
                  className="inline-flex items-center gap-1.5 bg-[#D96B85] hover:bg-[#B8526B] active:scale-95 text-white text-xs sm:text-sm font-semibold rounded-full px-6 py-2.5 shadow-sm transition-all cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ) : (
            /* ------------------------------------------------------------- */
            /* STEP 4: LAST PERIOD & FINAL PERSONALIZATION                   */
            /* ------------------------------------------------------------- */
            <div key="step-cycle-details">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#E8DFD8]">
                <button
                  type="button"
                  onClick={handleStepBack}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5E5259] hover:text-[#D96B85] transition-colors cursor-pointer group"
                >
                  <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform text-[#D96B85]" />
                  <span>Back to Frequency</span>
                </button>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-[#405A43] bg-[#E8EFE3] px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 size={12} />
                  <span>Final Step</span>
                </div>
              </div>

              <div className="mb-4">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#6A3D55]">
                  When did your last period start?
                </h2>
                <p className="text-xs sm:text-sm text-[#5E5259] mt-1">
                  We use this to calculate your current cycle day and active hormone phase.
                </p>
              </div>

              <div className="space-y-4 mb-6">
                {!dontRememberPeriod ? (
                  <div>
                    <label className="block text-xs font-semibold text-[#5E5259] mb-1.5">
                      First day of your last period:
                    </label>
                    <input
                      type="date"
                      value={lastPeriodStart}
                      max={new Date().toISOString().slice(0, 10)}
                      onChange={(e) => setLastPeriodStart(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-white/90 border border-[#E8DFD8] focus:border-[#D96B85] focus:outline-none text-sm text-[#31232B] shadow-2xs"
                    />
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD8] text-xs text-[#5E5259]">
                    No problem! Aura will start your tracking baseline from today (Day 1) and calibrate as you log symptoms.
                  </div>
                )}

                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#5E5259]">
                  <input
                    type="checkbox"
                    checked={dontRememberPeriod}
                    onChange={(e) => setDontRememberPeriod(e.target.checked)}
                    className="accent-[#D96B85] rounded cursor-pointer"
                  />
                  <span>I don&apos;t remember or I&apos;m not sure</span>
                </label>

                {/* Primary Symptom Concern */}
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-[#5E5259] mb-2">
                    Primary focus area (Optional):
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {CONCERN_OPTIONS.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setConcernId(c.id)}
                        className={`text-left p-2.5 rounded-xl border transition-all text-xs ${
                          concernId === c.id
                            ? 'border-[#D96B85] bg-[#FCE7E8]/80 font-bold text-[#31232B]'
                            : 'border-white/80 bg-white/60 text-[#5E5259] hover:bg-white'
                        }`}
                      >
                        <div className="font-semibold">{c.label}</div>
                        <div className="text-[10px] text-[#7A726D] font-normal">{c.hint}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#E8DFD8]">
                <button
                  type="button"
                  onClick={handleStepBack}
                  className="text-xs text-[#7A726D] hover:text-[#31232B] font-medium"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleFinish}
                  className="inline-flex items-center gap-1.5 bg-[#D96B85] hover:bg-[#B8526B] active:scale-95 text-white text-xs sm:text-sm font-semibold rounded-full px-6 py-2.5 shadow-sm transition-all cursor-pointer"
                >
                  <span>Create My Dashboard</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
