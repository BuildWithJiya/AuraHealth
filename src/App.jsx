import { useEffect, useMemo, useState, useRef } from 'react'
import { Calendar, Maximize2 } from 'lucide-react'
import AuraBackground from './components/AuraBackground'
import Header from './components/Header'
import Footer from './components/Footer'
import LandingPage from './components/LandingPage'
import OnboardingForm from './components/OnboardingForm'
import CycleTimeline from './components/CycleTimeline'
import VoiceLogger from './components/VoiceLogger'
import DailyBiomarkerTracker from './components/DailyBiomarkerTracker'
import SymptomTimeline from './components/SymptomTimeline'
import BiomarkerPanel from './components/BiomarkerPanel'
import CorrelationDashboard from './components/CorrelationDashboard'
import DiagnosticInsights from './components/DiagnosticInsights'
import SoapDossier from './components/SoapDossier'
import UnderstandYourBodyModal from './components/UnderstandYourBodyModal'
import PrivacyModal from './components/PrivacyModal'
import LifeStageModal from './components/LifeStageModal'
import { MOCK_PATIENTS, getPatientById, registerCustomPatient } from './data/mockPatients'
import { LAB_PRESETS } from './data/labPresets'
import { LIFE_STAGES, getStoredLifeStage, saveLifeStage } from './data/lifeStageData'
import {
  loadPrivacySettings,
  savePrivacySettings,
  setCamouflageInBrowser,
  getSanitizedPatient,
} from './utils/privacyManager'
import { getCyclePhase, generateHormoneCurve, pearsonCorrelation } from './utils/cycleEngine'
import { evaluateLabPanel } from './utils/biomarkerEngine'
import { buildSoapDossier } from './utils/soapGenerator'
import {
  getStoredActivePatientId,
  saveActivePatientId,
  loadPatientState,
  savePatientState,
  resetAllStorage,
  checkHasCustomStorage,
  loadOnboardingProfile,
  saveOnboardingProfile,
} from './utils/storage'

export default function App() {
  // A self-onboarded user profile (if one exists in this browser) — kept
  // registered with mockPatients' lookup so getPatientById('you') resolves
  // everywhere else in the app exactly like the built-in demo patients do.
  const [onboardingProfile, setOnboardingProfile] = useState(() => loadOnboardingProfile())
  if (onboardingProfile) registerCustomPatient(onboardingProfile)

  // The website must always start from the landing page followed by login page then dashboard
  const [view, setView] = useState('landing')

  const [activePatientId, setActivePatientId] = useState(() =>
    onboardingProfile ? onboardingProfile.id : getStoredActivePatientId()
  )
  const rawPatient = getPatientById(activePatientId)

  // Privacy-First Architecture State
  const [privacySettings, setPrivacySettings] = useState(() => loadPrivacySettings())
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false)

  // Life-Stage Adaptive State (Teen, Reproductive, Pregnancy/Postpartum, Perimenopause)
  const [activeLifeStageId, setActiveLifeStageId] = useState(() => getStoredLifeStage())
  const [lifeStageModalOpen, setLifeStageModalOpen] = useState(false)

  // Mask patient details if Anonymous Mode is enabled
  const patient = useMemo(() => {
    return getSanitizedPatient(rawPatient, privacySettings.anonymousMode)
  }, [rawPatient, privacySettings.anonymousMode])

  const patientsForSwitcher = useMemo(() => {
    const list = onboardingProfile ? [onboardingProfile, ...MOCK_PATIENTS] : MOCK_PATIENTS
    if (!privacySettings.anonymousMode) return list
    return list.map((p) => getSanitizedPatient(p, true))
  }, [onboardingProfile, privacySettings.anonymousMode])

  // Initialize patient state from localStorage or mock defaults
  const initialPatientData = useMemo(() => loadPatientState(activePatientId), [activePatientId])
  const [day, setDay] = useState(initialPatientData.day)
  const [symptomLog, setSymptomLog] = useState(initialPatientData.symptomLog)
  const [labPresetKey, setLabPresetKey] = useState(initialPatientData.labPresetKey)
  const [labValues, setLabValues] = useState(initialPatientData.labValues)
  const [isCustomized, setIsCustomized] = useState(() => checkHasCustomStorage())

  const [soapOpen, setSoapOpen] = useState(false)
  const [educationOpen, setEducationOpen] = useState(false)
  const [dailyTrackerModalOpen, setDailyTrackerModalOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.hash.includes('tracker=open')
    }
    return false
  })

  // Track if initial load is done so we don't prematurely trigger save
  const isFirstRender = useRef(true)

  // When active patient changes, hydrate their specific saved data
  useEffect(() => {
    saveActivePatientId(activePatientId)
    const stored = loadPatientState(activePatientId)
    setDay(stored.day)
    setSymptomLog(stored.symptomLog)
    setLabPresetKey(stored.labPresetKey)
    setLabValues(stored.labValues)
    setIsCustomized(checkHasCustomStorage())
  }, [activePatientId])

  // Save changes to localStorage whenever patient state changes
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    savePatientState(activePatientId, {
      day,
      symptomLog,
      labPresetKey,
      labValues,
    })
    setIsCustomized(true)
  }, [activePatientId, day, symptomLog, labPresetKey, labValues])

  // Apply browser title & favicon camouflage based on privacy settings
  useEffect(() => {
    setCamouflageInBrowser(privacySettings.camouflageMode)
    savePrivacySettings(privacySettings)
  }, [privacySettings])


  const handleUpdatePrivacy = (newSettings) => {
    setPrivacySettings(newSettings)
  }

  const handleSelectLifeStage = (stageId) => {
    setActiveLifeStageId(stageId)
    saveLifeStage(stageId)
  }

  const phase = getCyclePhase(day, patient.cycleLength)

  const hormoneCurve = useMemo(
    () => generateHormoneCurve(patient.cycleLength, { anovulatory: patient.anovulatory }),
    [patient]
  )

  const chartData = useMemo(
    () =>
      patient.severitySeries.map((s, i) => ({
        day: s.day,
        severity: s.severity,
        estrogen: hormoneCurve[i]?.estrogen ?? null,
        progesterone: hormoneCurve[i]?.progesterone ?? null,
      })),
    [patient, hormoneCurve]
  )

  const correlation = useMemo(() => {
    const sevArr = chartData.map((d) => d.severity)
    const progArr = chartData.map((d) => d.progesterone)
    const estArr = chartData.map((d) => d.estrogen)
    const rProg = pearsonCorrelation(sevArr, progArr)
    const rEst = pearsonCorrelation(sevArr, estArr)
    const useProg = Math.abs(rProg) >= Math.abs(rEst)
    const value = useProg ? rProg : rEst
    const hormoneLabel = useProg ? 'luteal progesterone' : 'estrogen'
    const direction = value >= 0 ? 'positive' : 'inverse'

    let narrative = 'hormone-sensitive symptom expression warranting further endocrine evaluation.'
    if (patient.suspected.some((s) => s.includes('PMDD'))) {
      narrative = 'PMDD — symptom flares cluster tightly in the luteal window, consistent with hormone-sensitivity mood pattern.'
    } else if (patient.suspected.some((s) => s.includes('Endometriosis'))) {
      narrative = 'Endometriosis peritoneal inflammation triggered as hormone levels withdraw into menses.'
    } else if (patient.suspected.some((s) => s.includes('PCOS'))) {
      narrative = 'anovulatory hormonal flatlining disrupting the expected cyclical symptom rhythm — consistent with PCOS.'
    }
    return { value, hormoneLabel, direction, narrative }
  }, [chartData, patient])

  const labResult = useMemo(() => evaluateLabPanel(labValues, phase, day), [labValues, phase, day])

  const dossier = useMemo(
    () => buildSoapDossier({ patient, symptomLog, labFlags: labResult.flags, correlation, phase, day }),
    [patient, symptomLog, labResult, correlation, phase, day]
  )

  const handleAddSymptom = (symptom) => setSymptomLog((prev) => [symptom, ...prev])
  const handleApplyPreset = (key) => {
    setLabPresetKey(key)
    setLabValues(LAB_PRESETS[key].values)
  }

  const handleResetData = () => {
    resetAllStorage()
    const def = getPatientById(activePatientId)
    setDay(def.currentDay)
    setSymptomLog(def.symptomLog)
    setLabPresetKey(def.defaultPreset)
    setLabValues(LAB_PRESETS[def.defaultPreset].values)
    setIsCustomized(false)
  }

  // Centralized navigation that keeps React state and browser history in perfect sync
  const navigateTo = (nextView, replace = false) => {
    setView(nextView)
    if (typeof window !== 'undefined') {
      const hash = '#' + (nextView === 'onboarding' ? 'login' : nextView)
      if (replace) {
        window.history.replaceState({ view: nextView }, '', hash)
      } else {
        window.history.pushState({ view: nextView }, '', hash)
      }
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Handle browser back and forward buttons seamlessly
  useEffect(() => {
    if (typeof window === 'undefined') return

    const validViews = {
      landing: 'landing',
      home: 'landing',
      login: 'onboarding',
      onboarding: 'onboarding',
      dashboard: 'dashboard',
      demo: 'dashboard',
    }

    // Always start at landing page when the website opens or reloads
    window.history.replaceState({ view: 'landing' }, '', '#landing')

    const handlePopState = (event) => {
      if (event.state && event.state.view) {
        setView(event.state.view)
      } else {
        const hash = window.location.hash.replace('#', '').split('?')[0].toLowerCase()
        const target = validViews[hash] || 'landing'
        setView(target)
      }
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Smart Back function for in-app back arrow buttons and browser fallbacks
  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.state && window.history.length > 1) {
      window.history.back()
    } else {
      if (view === 'dashboard') {
        navigateTo('onboarding')
      } else if (view === 'onboarding') {
        navigateTo('landing')
      } else {
        navigateTo('landing')
      }
    }
  }

  const handleGetStarted = () => navigateTo('onboarding')
  const handleViewDemo = () => navigateTo('dashboard') // Used by login page skip to reach dashboard
  const handleGoHome = () => navigateTo('landing')
  const handleGoOnboarding = () => navigateTo('onboarding')
  const handleOnboardingComplete = (newPatient) => {
    registerCustomPatient(newPatient)
    saveOnboardingProfile(newPatient)
    setOnboardingProfile(newPatient)
    setActivePatientId(newPatient.id)
    if (newPatient.lifeStage) {
      handleSelectLifeStage(newPatient.lifeStage)
    }
    navigateTo('dashboard')
  }

  return (
    <>
      {view === 'landing' && (
        <div className="relative min-h-screen flex flex-col">
          <AuraBackground />
          <div className="relative z-10">
            <LandingPage
              onGetStarted={handleGetStarted}
              onViewDemo={handleGetStarted}
              patient={patient}
              day={day}
              onDayChange={setDay}
              onAddSymptom={handleAddSymptom}
              symptomLog={symptomLog}
              chartData={chartData}
              correlation={correlation}
              patients={patientsForSwitcher}
              onSwitchPatient={setActivePatientId}
              onOpenSoap={() => setSoapOpen(true)}
              onOpenEducation={() => setEducationOpen(true)}
              activeLifeStageId={activeLifeStageId}
              onSelectLifeStage={handleSelectLifeStage}
              onOpenLifeStage={() => setLifeStageModalOpen(true)}
              onOpenPrivacy={() => setPrivacyModalOpen(true)}
              isAnonymous={privacySettings.anonymousMode}
              privacySettings={privacySettings}
              onUpdatePrivacy={handleUpdatePrivacy}
              onResetAllData={handleResetData}
            />
          </div>
        </div>
      )}

      {view === 'onboarding' && (
        <div className="relative min-h-screen flex flex-col">
          <AuraBackground />
          <div className="relative z-10">
            <OnboardingForm
              onComplete={handleOnboardingComplete}
              onSkip={handleViewDemo}
              onBack={() => navigateTo('landing')}
            />
          </div>
        </div>
      )}

      {view === 'dashboard' && (
        <div className="relative min-h-screen flex flex-col">
          <AuraBackground />
          <div className="relative z-10 flex flex-col min-h-screen">
            <Header
              patients={patientsForSwitcher}
              activePatient={patient}
              onSwitchPatient={setActivePatientId}
              day={day}
              cycleLength={patient.cycleLength}
              onOpenSoap={() => setSoapOpen(true)}
              onOpenEducation={() => setEducationOpen(true)}
              onOpenDailyTracker={() => setDailyTrackerModalOpen(true)}
              isCustomized={isCustomized}
              onResetData={handleResetData}
              onGoHome={handleGoHome}
              onGoOnboarding={handleGoOnboarding}
              onBack={handleBack}
              activeLifeStageId={activeLifeStageId}
              onOpenLifeStage={() => setLifeStageModalOpen(true)}
              onOpenPrivacy={() => setPrivacyModalOpen(true)}
              isAnonymous={privacySettings.anonymousMode}
            />

            <main className="flex-1 mx-auto max-w-[1600px] w-full px-4 py-5">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-3 space-y-4">
                  <CycleTimeline day={day} cycleLength={patient.cycleLength} onDayChange={setDay} />

                  {/* 1. Voice & NLP Logger First (Accessible & primary) */}
                  <VoiceLogger
                    day={day}
                    cycleLength={patient.cycleLength}
                    onAddSymptom={handleAddSymptom}
                    activeLifeStageId={activeLifeStageId}
                  />

                  {/* 2. Daily Calendar & Symptom Tracker (below VoiceLogger) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-[11px] font-bold text-[#6A3D55] uppercase tracking-wide">
                        Daily Calendar & Symptom Log
                      </span>
                      <button
                        type="button"
                        onClick={() => setDailyTrackerModalOpen(true)}
                        className="text-[11px] font-semibold text-[#D96B85] hover:text-[#B8526B] flex items-center gap-1 cursor-pointer transition-colors"
                        title="Expand Full Tracker"
                      >
                        <span>Expand View</span>
                        <Maximize2 size={11} />
                      </button>
                    </div>
                    <DailyBiomarkerTracker
                      isModal={false}
                      day={day}
                      cycleLength={patient.cycleLength}
                      onDayChange={setDay}
                      onAddSymptom={handleAddSymptom}
                      activeLifeStageId={activeLifeStageId}
                      onOpenFullTracker={() => setDailyTrackerModalOpen(true)}
                    />
                  </div>

                  {/* 3. Symptom Timeline History */}
                  <SymptomTimeline symptomLog={symptomLog} />
                </div>

                <div className="lg:col-span-6 space-y-4">
                  <CorrelationDashboard data={chartData} currentDay={day} correlation={correlation} />
                  <BiomarkerPanel
                    phase={phase}
                    day={day}
                    presetKey={labPresetKey}
                    values={labValues}
                    onApplyPreset={handleApplyPreset}
                    result={labResult}
                  />
                </div>

                <div className="lg:col-span-3">
                  <DiagnosticInsights
                    patient={patient}
                    symptomLog={symptomLog}
                    labFlags={labResult.flags}
                    correlation={correlation}
                    dossier={dossier}
                    onOpenSoap={() => setSoapOpen(true)}
                    onOpenEducation={() => setEducationOpen(true)}
                    activeLifeStageId={activeLifeStageId}
                    onOpenLifeStage={() => setLifeStageModalOpen(true)}
                  />
                </div>
              </div>
            </main>

            <Footer />
          </div>
        </div>
      )}

      {/* Global Modals */}
      <SoapDossier
        open={soapOpen}
        onClose={() => setSoapOpen(false)}
        dossier={dossier}
        phase={phase}
        day={day}
        isAnonymous={privacySettings.anonymousMode}
        activeLifeStageId={activeLifeStageId}
      />
      <UnderstandYourBodyModal open={educationOpen} onClose={() => setEducationOpen(false)} />
      <PrivacyModal
        open={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
        privacySettings={privacySettings}
        onUpdatePrivacy={handleUpdatePrivacy}
        onResetAllData={handleResetData}
      />
      <LifeStageModal
        open={lifeStageModalOpen}
        onClose={() => setLifeStageModalOpen(false)}
        activeLifeStageId={activeLifeStageId}
        onSelectLifeStage={handleSelectLifeStage}
      />
      <DailyBiomarkerTracker
        open={dailyTrackerModalOpen}
        onClose={() => setDailyTrackerModalOpen(false)}
        isModal={true}
        day={day}
        cycleLength={patient.cycleLength}
        onDayChange={setDay}
        onAddSymptom={handleAddSymptom}
        activeLifeStageId={activeLifeStageId}
      />
    </>
  )
}
