# AuraHealth (AuraDx) — AI Diagnostic Co-Pilot

> **Phase-Aware Clinical Dossier & Longitudinal Hormone Correlation Engine for Women's Healthcare.**

AuraDx bridges the multi-year diagnostic gap in women's health conditions (such as PCOS, Endometriosis, PMDD, and Latent Iron Deficiency) by providing menstrual cycle phase-adjusted lab interpretation, longitudinal correlation tracking, voice-enabled symptom logging, and automated clinical SOAP dossiers.

---

## Key Features

- **Phase-Adjusted Biomarker Interpreter**: Evaluates endocrine and metabolic biomarkers against cycle-phase-specific reference intervals (ACOG & Rotterdam consensus aligned) to flag hidden anomalies that static lab ranges overlook.
- **Longitudinal Hormone-Symptom Correlation**: Dual-axis tracking correlating patient-reported symptom flares with simulated physiological estradiol and progesterone curves (calculates Pearson's *r*).
- **Voice & NLP Symptom Logger**: Uses the Web Speech API with natural language entity extraction to parse anatomical locations, symptom modifiers, onset timing, and severity (0–10).
- **Interactive Cycle Scrubber**: Dynamic menstrual phase modeling (Menstrual, Follicular, Ovulatory, Luteal) responsive to customized cycle lengths (e.g., 28 to 35+ days).
- **Automated SOAP Dossier**: Synthesizes Subjective logs, Objective findings, differential Assessments, and evidence-based physician discussion Plans with print/PDF export readiness.

---

## Tech Stack

- **Framework**: [React 18](https://react.dev/) + [Vite 5](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Charts & Data Viz**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Speech & Audio**: Browser Web Speech API (`webkitSpeechRecognition`)

---

## Getting Started

### Prerequisites

- Node.js `>= 18.x`
- npm `>= 9.x`

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/auradx.git

# Navigate into the project directory
cd auradx

# Install dependencies
npm install

# Start the local development server
npm run dev
```

### Development (Frontend + Backend Server)

```bash
# Starts both the React Vite frontend (port 5173) and the Express Clinical API (port 5001) concurrently
npm run dev
```

- **Frontend Application**: `http://localhost:5173`
- **Clinical API Server**: `http://localhost:5001`

### Running Server Independently

```bash
npm run server
```

### Production Build

```bash
npm run build
npm run preview
```

---

## 📡 Backend API Endpoints & Architecture

AuraHealth features an integrated Node/Express REST API with persistent storage in `server/data/`:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status and supported clinical diagnostic engines |
| `GET` | `/api/patients` | Retrieve all registered real users and clinical benchmark cases |
| `GET` | `/api/patients/:id` | Retrieve complete patient history, symptoms, and lab values |
| `POST` | `/api/patients` | Register or update a real user profile with custom cycle lengths |
| `GET` | `/api/symptoms/:patientId` | Retrieve logged symptoms for a specific patient |
| `POST` | `/api/symptoms` | Log symptom via Natural Language voice transcription or manual form |
| `DELETE` | `/api/symptoms/:patientId/:symptomId` | Remove a logged symptom entry |
| `GET` | `/api/biomarkers/:patientId` | Retrieve biomarker panel and lab presets |
| `POST` | `/api/biomarkers` | Save and evaluate blood lab values against phase-adjusted intervals |
| `POST` | `/api/analyze/:patientId` | Complete clinical analysis: cycle phase, Pearson correlation, explainable screening (Rotterdam, ESHRE, DSM-5), and SOAP dossier |
| `POST` | `/api/parse-symptom` | Live multilingual regional NLP parser for speech/text |

---

## License

MIT
