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

### Production Build

```bash
npm run build
npm run preview
```

---

## License

MIT
