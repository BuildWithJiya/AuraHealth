# AuraHealth 

A clinical diagnostic co-pilot for women's reproductive health. AuraHealth tracks symptoms, normalizes lab values based on menstrual cycle phases, and generates structured medical summaries to speed up diagnosis for conditions like PCOS, Endometriosis, and PMDD.

---

## What It Does

- **Voice & Text Symptom Logging**: Log symptoms via voice or text in multiple regional languages (English, Hindi, Hinglish, Bengali, Tamil, etc.).
- **Phase-Adjusted Lab Interpretation**: Analyzes blood lab results against cycle-specific intervals (Follicular, Ovulatory, Luteal) rather than static averages.
- **Longitudinal Cycle Correlation**: Uses Pearson correlation ($r$) and Recharts to map symptom flares against hormone phases over multiple cycles.
- **Evidence-Based Screening**: Screens for risk indicators following clinical consensus guidelines:
  - **Rotterdam (2003)** for PCOS
  - **ESHRE** for Endometriosis
  - **DSM-5** for PMDD
- **Physician SOAP Dossier**: Exports clean **S**ubjective, **O**bjective, **A**ssessment, **P**lan notes ready for clinical consultations.
- **Offline & Private**: Built local-first with zero tracking. Works with an integrated Express API and falls back to local storage if offline.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 5, Tailwind CSS, Recharts, Lucide Icons |
| **Voice & Speech** | Web Speech API (`webkitSpeechRecognition`) |
| **Backend** | Node.js (ESM), Express 5, Concurrently, CORS |
| **Data Storage** | Persistent JSON store (`server/data/`) with LocalStorage fallback |
| **Clinical Logic** | Custom rule engines for cycle modeling, NLP parsing, and clinical screening |

---

## Project Structure

```
AuraHealth/
├── server/
│   ├── data/                 # JSON database (patients, symptoms, labs)
│   ├── db.js                 # Database helper functions
│   └── index.js              # Express API server (Port 5001)
├── src/
│   ├── components/           # UI components (Dashboard, Logger, Dossier, Charts)
│   ├── services/api.js       # API client with offline fallback
│   └── utils/
│       ├── biomarkerEngine.js     # Cycle-phase lab normalizer
│       ├── cycleEngine.js         # Menstrual cycle & Pearson correlation
│       ├── explainableRiskEngine.js # Rotterdam, ESHRE & DSM-5 screening
│       ├── soapGenerator.js       # SOAP note builder
│       └── symptomParser.js       # Multilingual NLP text & voice parser
└── package.json
```

---

## Key Modules & Functions

- **`src/utils/cycleEngine.js`**
  - `calculateCyclePhase(dayOfCycle, cycleLength)`: Returns current menstrual phase.
  - `computePearsonCorrelation(cycleDays, severities)`: Quantifies how closely symptoms match cycle phases.
- **`src/utils/symptomParser.js`**
  - `parseSymptomText(text)`: Converts spoken or typed text into structured symptom objects with severity (0–10).
- **`src/utils/biomarkerEngine.js`**
  - `evaluateBiomarker(name, value, cycleDay)`: Flags hormone values against day-of-cycle ranges (LH, FSH, Estradiol, Progesterone).
- **`src/utils/explainableRiskEngine.js`**
  - `screenPCOS()`, `screenEndometriosis()`, `screenPMDD()`: Evaluates patient data against clinical criteria with clear reasoning.
- **`src/utils/soapGenerator.js`**
  - `buildSoapDossier()`: Compiles patient history, lab flags, and assessments into a doctor-ready SOAP note.

---

## API Endpoints

The backend runs on `http://localhost:5001`:

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/health` | Server status and active clinical engines |
| `GET/POST` | `/api/patients` | Fetch or save patient profile and cycle baselines |
| `GET/POST` | `/api/symptoms` | Fetch or record daily symptoms (text/voice) |
| `GET/POST` | `/api/biomarkers` | Fetch or evaluate blood test results |
| `POST` | `/api/analyze/:patientId` | Run diagnostic screening and generate SOAP dossier |
| `POST` | `/api/parse-symptom` | Real-time NLP parsing for raw text/speech |

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation & Run

```bash
# Clone the repository
git clone https://github.com/BuildWithJiya/AuraHealth.git
cd AuraHealth

# Install dependencies
npm install

# Run frontend and backend concurrently
npm run dev
```

- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:5001`

### Other Commands
```bash
npm run client     # Starts only Vite frontend
npm run server     # Starts only Express API
npm run build      # Builds for production
```

---

## License

MIT
