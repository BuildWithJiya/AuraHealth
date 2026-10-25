/**
 * api.js
 * Frontend API client connecting to the AuraHealth Clinical Backend Server
 */

const API_BASE = '/api'

async function fetchJson(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.error || `HTTP error ${res.status}`)
    }
    return data
  } catch (err) {
    console.warn(`[AuraHealth API] Call failed for ${endpoint}:`, err.message)
    throw err
  }
}

export const api = {
  // 1. Health check
  async checkHealth() {
    return fetchJson('/health')
  },

  // 2. Patients & User Profiles
  async getPatients() {
    const res = await fetchJson('/patients')
    return res.data
  },

  async getPatient(patientId) {
    const res = await fetchJson(`/patients/${patientId}`)
    return res.data
  },

  async savePatient(profile) {
    const res = await fetchJson('/patients', {
      method: 'POST',
      body: JSON.stringify(profile),
    })
    return res.data
  },

  // 3. Symptoms
  async getSymptoms(patientId) {
    const res = await fetchJson(`/symptoms/${patientId}`)
    return res.data
  },

  async addSymptom(symptomData) {
    const res = await fetchJson('/symptoms', {
      method: 'POST',
      body: JSON.stringify(symptomData),
    })
    return res.data
  },

  async deleteSymptom(patientId, symptomId) {
    return fetchJson(`/symptoms/${patientId}/${symptomId}`, {
      method: 'DELETE',
    })
  },

  // 4. Biomarkers / Labs
  async getBiomarkers(patientId) {
    const res = await fetchJson(`/biomarkers/${patientId}`)
    return res.data
  },

  async saveBiomarkers(payload) {
    const res = await fetchJson('/biomarkers', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    return res.data
  },

  // 5. Full Clinical Analysis
  async analyzePatient(patientId, day) {
    const res = await fetchJson(`/analyze/${patientId}`, {
      method: 'POST',
      body: JSON.stringify({ day }),
    })
    return res.data
  },

  // 6. Regional Multilingual Voice / Text NLP Parsing
  async parseSymptomText(text, day, cycleLength) {
    const res = await fetchJson('/parse-symptom', {
      method: 'POST',
      body: JSON.stringify({ text, day, cycleLength }),
    })
    return res.data
  },
}

export default api
