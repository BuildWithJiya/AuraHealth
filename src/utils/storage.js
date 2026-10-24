import { MOCK_PATIENTS, getPatientById } from '../data/mockPatients'
import { LAB_PRESETS } from '../data/labPresets'

const STORAGE_PREFIX = 'auradx_v1_'

export function getStoredActivePatientId() {
  try {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}active_patient`)
    if (saved && MOCK_PATIENTS.some((p) => p.id === saved)) {
      return saved
    }
  } catch (err) {
    console.warn('Storage read error:', err)
  }
  return 'maya'
}

export function saveActivePatientId(id) {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}active_patient`, id)
  } catch (err) {
    console.warn('Storage write error:', err)
  }
}

export function loadPatientState(patientId) {
  const defaultPatient = getPatientById(patientId)
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}patient_${patientId}`)
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        day: typeof parsed.day === 'number' ? parsed.day : defaultPatient.currentDay,
        symptomLog: Array.isArray(parsed.symptomLog) ? parsed.symptomLog : defaultPatient.symptomLog,
        labPresetKey: parsed.labPresetKey || defaultPatient.defaultPreset,
        labValues: parsed.labValues || LAB_PRESETS[defaultPatient.defaultPreset].values,
        isCustomized: true,
      }
    }
  } catch (err) {
    console.warn('Failed to parse stored patient state:', err)
  }

  return {
    day: defaultPatient.currentDay,
    symptomLog: defaultPatient.symptomLog,
    labPresetKey: defaultPatient.defaultPreset,
    labValues: LAB_PRESETS[defaultPatient.defaultPreset].values,
    isCustomized: false,
  }
}

export function savePatientState(patientId, state) {
  try {
    localStorage.setItem(
      `${STORAGE_PREFIX}patient_${patientId}`,
      JSON.stringify({
        day: state.day,
        symptomLog: state.symptomLog,
        labPresetKey: state.labPresetKey,
        labValues: state.labValues,
        lastUpdated: new Date().toISOString(),
      })
    )
  } catch (err) {
    console.warn('Failed to save patient state to localStorage:', err)
  }
}

export function resetAllStorage() {
  try {
    const keysToRemove = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(STORAGE_PREFIX)) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k))
    return true
  } catch (err) {
    console.warn('Failed to reset storage:', err)
    return false
  }
}

const ONBOARDING_PROFILE_KEY = `${STORAGE_PREFIX}onboarding_profile`

export function saveOnboardingProfile(patient) {
  try {
    localStorage.setItem(ONBOARDING_PROFILE_KEY, JSON.stringify(patient))
  } catch (err) {
    console.warn('Failed to save onboarding profile:', err)
  }
}

export function loadOnboardingProfile() {
  try {
    const raw = localStorage.getItem(ONBOARDING_PROFILE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (err) {
    console.warn('Failed to parse stored onboarding profile:', err)
  }
  return null
}

export function clearOnboardingProfile() {
  try {
    localStorage.removeItem(ONBOARDING_PROFILE_KEY)
  } catch (err) {
    console.warn('Failed to clear onboarding profile:', err)
  }
}

export function checkHasCustomStorage() {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(STORAGE_PREFIX)) {
        return true
      }
    }
  } catch {
    return false
  }
  return false
}
