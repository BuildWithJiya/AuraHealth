import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { MOCK_PATIENTS } from '../src/data/mockPatients.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DATA_DIR = path.join(__dirname, 'data')

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

const PATIENTS_FILE = path.join(DATA_DIR, 'patients.json')
const SYMPTOMS_FILE = path.join(DATA_DIR, 'symptoms.json')
const LABS_FILE = path.join(DATA_DIR, 'labs.json')

function readJson(filePath, defaultValue) {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8')
      return JSON.parse(data)
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err)
  }
  return defaultValue
}

function writeJson(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
    return true
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err)
    return false
  }
}

// Initialize seed data if not present
export function initDatabase() {
  const existingPatients = readJson(PATIENTS_FILE, null)
  if (!existingPatients || existingPatients.length === 0) {
    writeJson(PATIENTS_FILE, MOCK_PATIENTS)
  }

  const existingSymptoms = readJson(SYMPTOMS_FILE, null)
  if (!existingSymptoms) {
    const seedSymptoms = {}
    MOCK_PATIENTS.forEach((p) => {
      seedSymptoms[p.id] = p.symptomLog || []
    })
    writeJson(SYMPTOMS_FILE, seedSymptoms)
  }

  const existingLabs = readJson(LABS_FILE, null)
  if (!existingLabs) {
    const seedLabs = {}
    MOCK_PATIENTS.forEach((p) => {
      seedLabs[p.id] = {
        presetKey: p.labPresetKey || 'baseline_day3',
        values: p.labValues || {},
      }
    })
    writeJson(LABS_FILE, seedLabs)
  }

  console.log('📦 AuraHealth Persistent Database Initialized in:', DATA_DIR)
}

// -----------------------------------------------------------------------------
// Patients / Profiles CRUD
// -----------------------------------------------------------------------------
export function getAllPatients() {
  return readJson(PATIENTS_FILE, MOCK_PATIENTS)
}

export function getPatientById(id) {
  const patients = getAllPatients()
  return patients.find((p) => p.id === id) || null
}

export function saveOrUpdatePatient(patientData) {
  const patients = getAllPatients()
  const existingIndex = patients.findIndex((p) => p.id === patientData.id)

  const patientRecord = {
    ...patientData,
    updatedAt: new Date().toISOString(),
  }

  if (existingIndex >= 0) {
    patients[existingIndex] = { ...patients[existingIndex], ...patientRecord }
  } else {
    patientRecord.createdAt = new Date().toISOString()
    // Put custom user at the very beginning of list
    patients.unshift(patientRecord)
  }

  writeJson(PATIENTS_FILE, patients)
  return patientRecord
}

// -----------------------------------------------------------------------------
// Symptoms CRUD
// -----------------------------------------------------------------------------
export function getSymptomsByPatient(patientId) {
  const all = readJson(SYMPTOMS_FILE, {})
  return all[patientId] || []
}

export function addSymptomToPatient(patientId, symptomEntry) {
  const all = readJson(SYMPTOMS_FILE, {})
  if (!all[patientId]) {
    all[patientId] = []
  }

  const newEntry = {
    id: symptomEntry.id || `symp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    timestamp: symptomEntry.timestamp || new Date().toISOString(),
    day: Number(symptomEntry.day) || 1,
    severity: Number(symptomEntry.severity) || 5,
    location: symptomEntry.location || 'Pelvic — General',
    modifiers: symptomEntry.modifiers || [],
    rawText: symptomEntry.rawText || '',
    phase: symptomEntry.phase || 'Follicular',
  }

  // Prepend to list
  all[patientId].unshift(newEntry)
  writeJson(SYMPTOMS_FILE, all)
  return newEntry
}

export function deleteSymptomEntry(patientId, symptomId) {
  const all = readJson(SYMPTOMS_FILE, {})
  if (!all[patientId]) return false
  const initialLen = all[patientId].length
  all[patientId] = all[patientId].filter((s) => s.id !== symptomId)
  writeJson(SYMPTOMS_FILE, all)
  return all[patientId].length < initialLen
}

// -----------------------------------------------------------------------------
// Labs / Biomarkers CRUD
// -----------------------------------------------------------------------------
export function getLabsByPatient(patientId) {
  const all = readJson(LABS_FILE, {})
  return all[patientId] || { presetKey: 'baseline_day3', values: {} }
}

export function saveLabsForPatient(patientId, { presetKey, values }) {
  const all = readJson(LABS_FILE, {})
  all[patientId] = {
    presetKey: presetKey || 'baseline_day3',
    values: values || {},
    updatedAt: new Date().toISOString(),
  }
  writeJson(LABS_FILE, all)
  return all[patientId]
}
