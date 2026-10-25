# AuraHealth (AuraDx) — AI Clinical Diagnostic Co-Pilot

> **Turning years of silent suffering into weeks of clinical clarity.**  
> *Phase-Aware Clinical Dossier & Longitudinal Hormone Correlation Engine for Women's Healthcare.*

[![GitHub](https://img.shields.io/badge/GitHub-BuildWithJiya%2FAuraHealth-4A2E35?style=flat&logo=github)](https://github.com/BuildWithJiya/AuraHealth.git)
[![React 18](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat&logo=react)](https://react.dev/)
[![Vite 5](https://img.shields.io/badge/Vite-5.4.11-646C99?style=flat&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.15-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-ESM-339933?style=flat&logo=node.js)](https://nodejs.org/)
[![Express 5](https://img.shields.io/badge/Express-5.3.0-000000?style=flat&logo=express)](https://expressjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-8FA89B.svg)](LICENSE)

---

## 🌸 Overview

**AuraHealth** bridges the devastating **7–10 year diagnostic delay** in women's health conditions (such as Polycystic Ovary Syndrome [PCOS], Endometriosis, and Premenstrual Dysphoric Disorder [PMDD]). 

Traditional diagnostic paths fail because women’s biological markers fluctuate dynamically across the menstrual cycle, while conventional clinical labs evaluate them against static population averages. Furthermore, clinical consultations rely heavily on vague retrospective patient memory rather than objective chronological data.

AuraHealth replaces guesswork with an **explainable clinical intelligence co-pilot**:
1. **Multilingual Regional Voice Logging**: Captures symptoms in everyday dialects (Hindi, Hinglish, Bengali, Tamil, etc.) and maps them to SNOMED-CT clinical standards.
2. **Phase-Adjusted Biomarker Normalization**: Re-evaluates endocrine blood labs (LH, FSH, Estradiol, Progesterone) against day-of-cycle reference ranges.
3. **Longitudinal Cycle Correlation Engine**: Quantifies symptom-cycle dependency via Pearson correlation coefficients over multi-cycle curves.
4. **Consensus-Based Screening**: Implements official medical consensus guidelines (Rotterdam 2003 for PCOS, ESHRE for Endometriosis, DSM-5 for PMDD).
5. **Physician-Ready SOAP Dossiers**: Assembles chronological, structured consultation notes ready for doctor review in under 30 seconds.

---

## 🛠️ Verified Technology Stack

The architecture is 100% grounded in code present within the repository:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        AURAHEALTH TECH STACK                           │
├───────────────────┬────────────────────────────────────────────────────┤
│ Frontend / Client │ React 18 • Vite 5 • Tailwind CSS • Recharts        │
│ Voice & Speech    │ Web Speech API (Hands-Free Multilingual Dictation) │
│ Backend & API     │ Node.js (ESM) • Express 5 REST API • Vite Proxy    │
│ Clinical Engines  │ Multilingual NLP • Phase Normalizer • SOAP Builder │
│ Clinical Standards│ Rotterdam (PCOS) • ESHRE (Endo) • DSM-5 (PMDD)    │
│ Data & Privacy    │ Atomic Server DB • Zero-Knowledge Local Storage   │
└───────────────────┴────────────────────────────────────────────────────┘
```

### 1. Presentation & Client Layer
* **React 18.3.1**: Single Page Application (SPA) architecture utilizing declarative reactive hooks and component modularity.
* **Vite 5.4.11**: Next-generation frontend build tooling offering sub-second Hot Module Replacement (HMR) and optimized tree-shaking.
* **Tailwind CSS 3.4.15**: Custom design tokens engineered for an empathetic, clinical aesthetic (*Porcelain `#FCFBF7`*, *Blush `#E8B4B8`*, *Plum `#4A2E35`*, *Sage `#8FA89B`*).
* **Recharts 2.13.3**: Interactive SVG charting library rendering dynamic hormone curves and Pearson cycle-symptom cross-correlation graphs.
* **Lucide React 0.462.0**: Accessible clinical glyphs and diagnostic iconography.
* **Web Speech API**: In-browser speech recognition (`webkitSpeechRecognition`) enabling zero-latency voice transcription without third-party audio transmission.

### 2. Backend API & Middleware Layer
* **Node.js (ES Modules)**: Modern server runtime configured with native ECMAScript module imports.
* **Express 5.3.0 REST API**: Modular RESTful microservices managing profiles, symptom logs, blood labs, and analytical screening.
* **Vite Reverse Proxy**: Development proxy routing `/api` requests from port `5173` to `5001`.
* **CORS Middleware**: Secure Cross-Origin Resource Sharing control.
* **Concurrently 10.0.6**: Orchestrates client and backend microservices concurrently via a single CLI command (`npm run dev`).

### 3. Clinical Intelligence & Rule Engines
* **Multilingual Regional NLP (`symptomParser.js`)**: Real-time tokenization and colloquial dictionary parsing (English, Hindi, Hinglish, Bengali, Tamil, Telugu, Marathi, Gujarati) mapped to clinical concepts.
* **Phase-Adjusted Biomarker Engine (`biomarkerEngine.js`)**: Evaluates blood labs relative to Follicular, Ovulatory, and Luteal intervals (ACOG & Rotterdam aligned).
* **Diagnostic Screening Engine (`explainableRiskEngine.js`)**: Encodes Rotterdam 2003 (PCOS), ESHRE (Endometriosis), and DSM-5 (PMDD) screening criteria with transparent evidence trails.
* **Longitudinal Correlation Engine (`cycleEngine.js`)**: Mathematical Pearson correlation ($r$) aligning symptom flares with biological cycle phases.
* **Automated SOAP Dossier Builder (`soapGenerator.js`)**: Synthesizes clinical evidence into **S**ubjective, **O**bjective, **A**ssessment, and **P**lan notes.

### 4. Data Storage & Privacy Architecture
* **Atomic Persistent Server Database (`server/db.js`)**: Thread-safe file database storing structured collections (`patients.json`, `symptoms.json`, `labs.json`) in `server/data/`.
* **Zero-Knowledge Local Storage Vault (`src/services/api.js`)**: Offline-first client cache ensuring complete patient data sovereignty even when disconnected.
* **Privacy-By-Design**: No third-party ad beacons, no tracking pixels, and no commercial data-broker SDKs.

---

## 🔄 End-to-End Clinical Workflow

AuraHealth structures patient data across a 6-stage clinical pipeline:

```
[1. Input Collection] ──> [2. NLP & Normalization] ──> [3. Phase-Adjusted Labs]
                                                               │
[6. Physician SOAP Dossier] <── [5. Trend & Pattern Audit] <── [4. Clinical Screening]
```

1. **Input Collection**: Ingests menstrual cycle dates, daily pain/mood logs via voice or text, and laboratory blood biomarker entries.
2. **NLP & Normalization**: Translates informal regional vernacular (*"pet dard"*, *"heavy flow"*, *"cramps"*) into standardized medical classifications with severity tags (0–10).
3. **Phase-Adjusted Labs**: Automatically correlates hormone levels (LH, FSH, LH/FSH ratio, Estradiol, Progesterone, Testosterone) against exact day-of-cycle reference ranges.
4. **Clinical Screening**: Cross-references patient evidence against international clinical guidelines (Rotterdam, ESHRE, DSM-5).
5. **Trend & Pattern Audit**: Computes Pearson correlation coefficients to verify cycle-dependency and eliminate false positives.
6. **Physician SOAP Dossier**: Generates an exportable clinical consultation document featuring interactive Recharts hormone curves and physician-ready SOAP notes.

---

## 🧬 Core Modules & Key Functions

### 1. Cycle & Longitudinal Correlation Engine (`src/utils/cycleEngine.js`)
* `calculateCyclePhase(dayOfCycle, cycleLength)`: Accurately maps any calendar day into its biological phase (Menstrual, Follicular, Ovulatory, Luteal) responsive to non-standard cycles (21–45+ days).
* `computePearsonCorrelation(cycleDays, severities)`: Computes Pearson's $r$ correlation coefficient between symptom severity spikes and cycle progression to mathematically prove phase-dependency.
* `getPhaseAdjustedHormoneCurves(cycleLength)`: Generates simulated 28–35 day physiological curves for Estradiol, Progesterone, LH, and FSH for chart overlays.

### 2. Multilingual Symptom Parser (`src/utils/symptomParser.js`)
* `parseSymptomText(rawText)`: Parses informal voice transcriptions or typed complaints into structured symptom objects with severity, anatomical location, and temporal markers.
* `extractSeverity(text)`: Extracts 0–10 clinical pain/discomfort scales from natural speech (*e.g., "very severe", "unbearable", "mild", "8 out of 10"*).
* `REGIONAL_SYMPTOM_DICTIONARY`: Multi-dialect lexicon supporting Hindi (*"pet dard"*, *"chakkar"*), Bengali (*"peetey byatha"*), Tamil (*"vayiru vali"*), and Hinglish.

### 3. Phase-Adjusted Biomarker Engine (`src/utils/biomarkerEngine.js`)
* `evaluateBiomarker(name, value, cycleDay, cycleLength)`: Re-evaluates hormone metrics against phase-specific reference intervals rather than static lab normal ranges.
* `computeLhFshRatio(lhValue, fshValue)`: Calculates LH/FSH ratios; flags values $> 2.0$ or $> 2.5$ characteristic of polycystic endocrine disruption.
* `BIOMARKER_REFERENCE_RANGES`: Comprehensive reference table covering Follicular, Mid-cycle Peak, and Luteal intervals for Estradiol, Progesterone, LH, FSH, Total Testosterone, DHEA-S, and Ferritin.

### 4. Explainable Diagnostic Screening Engine (`src/utils/explainableRiskEngine.js`)
* `screenPCOS(patient, labFlags, symptoms)`: Evaluates the **Rotterdam 2003 Criteria** (Oligo/Anovulation, Hyperandrogenism, Polycystic Ovaries on ultrasound).
* `screenEndometriosis(symptoms, history)`: Evaluates **ESHRE Guidelines** focusing on cyclic dysmenorrhea, deep dyspareunia, non-menstrual pelvic pain, and analgesia-refractory pain.
* `screenPMDD(symptoms, cycleCorrelation)`: Evaluates **DSM-5 Criteria** verifying luteal-phase emergence and post-menstrual remittance of mood and somatic symptoms.
* `runExplainableScreening(patientData)`: Aggregates risk tiers (Low, Moderate, High), clinical rationale, and recommended diagnostic next steps.

### 5. Automated SOAP Dossier Generator (`src/utils/soapGenerator.js`)
* `buildSoapDossier(patient, symptoms, labFlags, suspected)`: Synthesizes patient logs into a standardized medical record:
  * **S (Subjective)**: Chief complaints, menstrual history, symptom chronology, and patient goals.
  * **O (Objective)**: Day-of-cycle adjusted lab flags, vitals, ultrasound findings, and Pearson correlation coefficients.
  * **A (Assessment)**: Differential diagnosis screening aligned with Rotterdam, ESHRE, and DSM-5 criteria.
  * **P (Plan)**: Suggested confirmatory lab work, imaging protocols, and targeted lifestyle/therapeutic discussions for the physician.

### 6. Atomic Persistent Database (`server/db.js`)
* `getPatients()`, `savePatient(patientData)`: Atomic read/write operations for patient profiles.
* `getSymptoms(patientId)`, `saveSymptom(symptomData)`: Chronological symptom log storage.
* `getBiomarkers(patientId)`, `saveBiomarker(labData)`: Lab record persistence in `server/data/`.

---

## 📡 Backend REST API Reference

The Node.js Express server runs on port `5001` with dev proxy routing from `5173`:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status and active clinical engines |
| `GET` | `/api/patients` | Retrieve all registered users and clinical benchmark cases |
| `GET` | `/api/patients/:id` | Retrieve patient record with complete symptom and lab history |
| `POST` | `/api/patients` | Register or update user profile with baseline cycle parameters |
| `GET` | `/api/symptoms/:patientId` | Retrieve logged symptoms for a specific patient |
| `POST` | `/api/symptoms` | Ingest new symptom entry via voice transcription or form |
| `DELETE` | `/api/symptoms/:patientId/:symptomId` | Remove a logged symptom entry |
| `GET` | `/api/biomarkers/:patientId` | Retrieve saved lab reports and biomarker metrics |
| `POST` | `/api/biomarkers` | Save blood lab values and evaluate against phase intervals |
| `POST` | `/api/analyze/:patientId` | Trigger full diagnostic screening pipeline and generate SOAP dossier |
| `POST` | `/api/parse-symptom` | Multilingual NLP parsing endpoint for voice/text transcription |

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: `>= 18.x` (LTS recommended)
* **npm**: `>= 9.x`

### Installation
```bash
# Clone the repository
git clone https://github.com/BuildWithJiya/AuraHealth.git

# Navigate into the project directory
cd AuraHealth

# Install dependencies
npm install
```

### Development (Frontend + Backend Server)
Run both the React client (`port 5173`) and Express API server (`port 5001`) simultaneously:
```bash
npm run dev
```

* **Frontend UI**: `http://localhost:5173`
* **Clinical REST API**: `http://localhost:5001`
* **API Health Check**: `http://localhost:5001/api/health`

### Individual Service Scripts
```bash
# Run only the Vite frontend
npm run client

# Run only the Express backend server
npm run server

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## 📁 Repository Directory Structure

```
AuraHealth/
├── public/                     # Static assets and icons
├── server/                     # Backend microservices & persistent DB
│   ├── data/                   # Atomic persistent JSON databases
│   │   ├── patients.json       # User profiles & cycle baselines
│   │   ├── symptoms.json       # Symptom logs & severity indices
│   │   └── labs.json           # Blood lab biomarker panels
│   ├── db.js                   # Atomic file I/O transactions
│   └── index.js                # Express 5 REST API server (Port 5001)
├── src/
│   ├── assets/                 # Brand artwork, vector graphics & logos
│   ├── components/             # Modular React UI components
│   │   ├── Charts/             # Recharts hormone curves & correlation graphs
│   │   ├── BiomarkerPanel.jsx  # Phase-adjusted blood lab interpreter
│   │   ├── ClinicalDossier.jsx # Physician SOAP dossier export & viewer
│   │   ├── LandingPage.jsx     # High-fidelity aesthetic landing page
│   │   ├── PatientDashboard.jsx# Main clinical analytics command center
│   │   ├── SymptomLogger.jsx   # Text & quick symptom logger
│   │   └── VoiceLogger.jsx     # Web Speech API voice dictation module
│   ├── data/                   # Clinical presets and benchmark profiles
│   ├── services/
│   │   └── api.js              # REST client with offline LocalStorage fallback
│   ├── utils/                  # Proprietary Clinical Intelligence Engines
│   │   ├── biomarkerEngine.js  # Day-of-cycle biomarker normalizer
│   │   ├── cycleEngine.js      # Menstrual phase & Pearson correlation logic
│   │   ├── explainableRiskEngine.js # Rotterdam, ESHRE & DSM-5 screening
│   │   ├── onboarding.js       # Profile initialization & cycle baselines
│   │   ├── soapGenerator.js    # Automated SOAP consultation report builder
│   │   ├── storage.js          # Client-side vault management
│   │   └── symptomParser.js    # Multilingual regional NLP parser
│   ├── App.jsx                 # Application root & view state router
│   ├── index.css               # Tailwind design system & animations
│   └── main.jsx                # React DOM entrypoint
├── package.json                # Project dependencies & scripts
├── tailwind.config.js          # Aura porcelain, blush, plum & sage theme
└── vite.config.js              # Vite configuration & dev API proxy
```

---

## ⚖️ Clinical Standards & Disclaimer

AuraHealth is an **assistive diagnostic co-pilot** designed to empower patients with objective clinical evidence and assist healthcare providers during clinical evaluation. 

* Screening algorithms follow peer-reviewed international guidelines: **Rotterdam Consensus (2003)** for PCOS, **European Society of Human Reproduction and Embryology (ESHRE)** for Endometriosis, and the **American Psychiatric Association DSM-5** for PMDD.
* AuraHealth does not replace formal clinical diagnosis, medical advice, or physician judgment.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
