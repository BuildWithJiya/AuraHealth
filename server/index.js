import express from 'express'
import cors from 'cors'
import {
  initDatabase,
  getAllPatients,
  getPatientById,
  saveOrUpdatePatient,
  getSymptomsByPatient,
  addSymptomToPatient,
  deleteSymptomEntry,
  getLabsByPatient,
  saveLabsForPatient,
} from './db.js'

import { getCyclePhase, generateHormoneCurve, pearsonCorrelation } from '../src/utils/cycleEngine.js'
import { parseSymptomText } from '../src/utils/symptomParser.js'
import { evaluateLabPanel } from '../src/utils/biomarkerEngine.js'
import { runExplainableScreening } from '../src/utils/explainableRiskEngine.js'
import { buildSoapDossier } from '../src/utils/soapGenerator.js'

const app = express()
const PORT = process.env.PORT || 5001

// Middleware
app.use(cors())
app.use(express.json({ limit: '10mb' }))

// Initialize DB on boot
initDatabase()

// -----------------------------------------------------------------------------
// 1. System Health Check
// -----------------------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'AuraHealth Clinical Decision Support API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    supportedEngines: [
      'Multilingual Regional NLP',
      'Phase-Adjusted Biomarker Interpreter',
      'Explainable AI Risk Screening (Rotterdam, ESHRE, DSM-5)',
      'Clinical SOAP Generator',
    ],
  })
})

// -----------------------------------------------------------------------------
// 2. Patients & Profiles (Real User Registration & Benchmarks)
// -----------------------------------------------------------------------------
app.get('/api/patients', (req, res) => {
  try {
    const patients = getAllPatients()
    res.json({ success: true, count: patients.length, data: patients })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

app.get('/api/patients/:id', (req, res) => {
  try {
    const patient = getPatientById(req.params.id)
    if (!patient) {
      return res.status(404).json({ success: false, error: 'Patient profile not found' })
    }

    const symptoms = getSymptomsByPatient(patient.id)
    const labs = getLabsByPatient(patient.id)

    res.json({
      success: true,
      data: {
        ...patient,
        symptomLog: symptoms,
        labPresetKey: labs.presetKey,
        labValues: labs.values,
      },
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

app.post('/api/patients', (req, res) => {
  try {
    const {
      id = 'you',
      name = 'Personal Profile',
      age = 26,
      cycleLength = 28,
      lutealLength = 14,
      lifeStage = 'reproductive',
      trackingPriorities = [],
      suspected = [],
    } = req.body

    const patientRecord = {
      id,
      name,
      age: Number(age) || 26,
      cycleLength: Number(cycleLength) || 28,
      lutealLength: Number(lutealLength) || 14,
      lifeStage,
      trackingPriorities,
      suspected,
      isCustomUser: true,
    }

    const saved = saveOrUpdatePatient(patientRecord)
    res.status(201).json({ success: true, data: saved })
  } catch (err) {
    res.status(400).json({ success: false, error: err.message })
  }
})

// -----------------------------------------------------------------------------
// 3. Symptoms (Live Voice & Manual Logging)
// -----------------------------------------------------------------------------
app.get('/api/symptoms/:patientId', (req, res) => {
  try {
    const symptoms = getSymptomsByPatient(req.params.patientId)
    res.json({ success: true, count: symptoms.length, data: symptoms })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

app.post('/api/symptoms', (req, res) => {
  try {
    const { patientId = 'you', text, day = 1, severity, location, modifiers, phase } = req.body

    const patient = getPatientById(patientId)
    const cycleLength = patient?.cycleLength || 28

    let symptomEntry

    if (text) {
      // Natural language input: parse via regional NLP parser
      const parsed = parseSymptomText(text, Number(day), cycleLength)
      symptomEntry = {
        ...parsed,
        severity: severity !== undefined ? Number(severity) : parsed.severity,
        location: location || parsed.location,
        modifiers: modifiers || parsed.modifiers,
      }
    } else {
      // Manual input
      const currentPhase = phase || getCyclePhase(Number(day), cycleLength)
      symptomEntry = {
        day: Number(day),
        severity: Number(severity) || 5,
        location: location || 'Pelvic — General',
        modifiers: modifiers || [],
        rawText: `${location || 'Pelvic'}: Severity ${severity || 5}/10`,
        phase: currentPhase,
      }
    }

    const saved = addSymptomToPatient(patientId, symptomEntry)
    res.status(201).json({ success: true, data: saved })
  } catch (err) {
    res.status(400).json({ success: false, error: err.message })
  }
})

app.delete('/api/symptoms/:patientId/:symptomId', (req, res) => {
  try {
    const { patientId, symptomId } = req.params
    const success = deleteSymptomEntry(patientId, symptomId)
    if (!success) {
      return res.status(404).json({ success: false, error: 'Symptom entry not found' })
    }
    res.json({ success: true, message: 'Symptom deleted successfully' })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// -----------------------------------------------------------------------------
// 4. Biomarkers / Lab Values
// -----------------------------------------------------------------------------
app.get('/api/biomarkers/:patientId', (req, res) => {
  try {
    const labs = getLabsByPatient(req.params.patientId)
    res.json({ success: true, data: labs })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

app.post('/api/biomarkers', (req, res) => {
  try {
    const { patientId = 'you', day = 3, presetKey = 'baseline_day3', values = {} } = req.body

    const patient = getPatientById(patientId)
    const cycleLength = patient?.cycleLength || 28
    const phase = getCyclePhase(Number(day), cycleLength)

    const evaluatedResult = evaluateLabPanel(values, phase)
    const saved = saveLabsForPatient(patientId, { presetKey, values })

    res.json({
      success: true,
      data: {
        ...saved,
        phase,
        evaluatedResult,
      },
    })
  } catch (err) {
    res.status(400).json({ success: false, error: err.message })
  }
})

// -----------------------------------------------------------------------------
// 5. Full Clinical Analysis Endpoint (Calculates & returns all diagnostic results)
// -----------------------------------------------------------------------------
app.post('/api/analyze/:patientId', (req, res) => {
  try {
    const { patientId } = req.params
    const { day: requestedDay } = req.body

    const patient = getPatientById(patientId)
    if (!patient) {
      return res.status(404).json({ success: false, error: 'Patient not found' })
    }

    const cycleLength = patient.cycleLength || 28
    const day = Number(requestedDay) || patient.day || 1
    const phase = getCyclePhase(day, cycleLength)

    const symptoms = getSymptomsByPatient(patientId)
    const labs = getLabsByPatient(patientId)

    // 1. Hormone curve calculation
    const hormoneCurve = generateHormoneCurve(cycleLength)

    // 2. Build chart data for correlation
    const severityMap = {}
    symptoms.forEach((s) => {
      if (!severityMap[s.day] || s.severity > severityMap[s.day]) {
        severityMap[s.day] = s.severity
      }
    })

    const chartData = []
    for (let d = 1; d <= cycleLength; d++) {
      const idx = d - 1
      chartData.push({
        day: d,
        severity: severityMap[d] !== undefined ? severityMap[d] : 0,
        estrogen: hormoneCurve[idx]?.estrogen ?? null,
        progesterone: hormoneCurve[idx]?.progesterone ?? null,
      })
    }

    // 3. Pearson Correlation calculation
    const sevArr = chartData.map((d) => d.severity)
    const progArr = chartData.map((d) => d.progesterone)
    const estArr = chartData.map((d) => d.estrogen)
    const rProg = pearsonCorrelation(sevArr, progArr)
    const rEst = pearsonCorrelation(sevArr, estArr)
    const useProg = Math.abs(rProg) >= Math.abs(rEst)
    const correlationValue = useProg ? rProg : rEst
    const hormoneLabel = useProg ? 'luteal progesterone' : 'estrogen'
    const direction = correlationValue >= 0 ? 'positive' : 'inverse'

    let narrative = 'Symptom trajectory shows cyclical hormone sensitivity.'
    if (correlationValue > 0.6 && useProg) {
      narrative = 'Luteal phase clustering aligns with PMDD symptom patterns.'
    } else if (patient.suspected?.includes('PCOS')) {
      narrative = 'Disrupted rhythm with hormone flatlining consistent with PCOS.'
    }

    const correlation = {
      value: correlationValue,
      hormoneLabel,
      direction,
      narrative,
    }

    // 4. Lab Evaluation
    const labResult = evaluateLabPanel(labs.values, phase)

    // 5. Explainable Risk Screenings (Rotterdam PCOS, ESHRE Endo, DSM-5 PMDD)
    const patientForScreening = {
      ...patient,
      suspected: patient.suspected && patient.suspected.length ? patient.suspected : ['General Wellness Tracking'],
      symptomLog: symptoms,
      labValues: labs.values,
    }
    const screeningReports = runExplainableScreening({
      patient: patientForScreening,
      symptomLog: symptoms,
      labFlags: labResult?.flags || [],
      correlation,
    })

    // 6. SOAP Dossier Generation
    const dossier = buildSoapDossier({
      patient: patientForScreening,
      day,
      phase,
      correlation,
      symptomLog: symptoms,
      labFlags: labResult?.flags || [],
    })

    res.json({
      success: true,
      data: {
        patientId,
        day,
        phase,
        cycleLength,
        chartData,
        correlation,
        labResult,
        screeningReports,
        dossier,
      },
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// -----------------------------------------------------------------------------
// 6. NLP Parser API (Live voice/text transcription parsing)
// -----------------------------------------------------------------------------
app.post('/api/parse-symptom', (req, res) => {
  try {
    const { text, day = 1, cycleLength = 28 } = req.body
    if (!text) {
      return res.status(400).json({ success: false, error: 'Text prompt is required' })
    }
    const parsed = parseSymptomText(text, Number(day), Number(cycleLength))
    res.json({ success: true, data: parsed })
  } catch (err) {
    res.status(400).json({ success: false, error: err.message })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 AuraHealth Clinical API Server running at http://localhost:${PORT}`)
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`)
  console.log(`👥 Patients API: http://localhost:${PORT}/api/patients`)
})
