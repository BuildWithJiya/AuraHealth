import { X, Printer, Activity } from 'lucide-react'

export default function SoapDossier({ open, onClose, dossier, phase, day }) {
  if (!open || !dossier) return null
  const { patient, subjective, objective, assessment, plan, generatedAt } = dossier

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 overflow-y-auto py-6 px-3 no-print-bg">
      <div className="no-print sticky top-0 z-10 flex items-center justify-end gap-2 w-full max-w-3xl mb-[-48px] pr-2 pt-2">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 text-xs font-semibold bg-indigo-500 hover:bg-indigo-600 text-white rounded-full px-3.5 py-2 shadow-lg"
        >
          <Printer size={14} /> Print / Download PDF
        </button>
        <button
          onClick={onClose}
          className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 shadow-lg"
        >
          <X size={16} />
        </button>
      </div>

      <div id="print-dossier" className="relative w-full max-w-3xl bg-white text-slate-900 rounded-xl shadow-2xl mt-12 p-8 sm:p-10">
        <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-slate-900 flex items-center justify-center">
              <Activity size={18} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-lg leading-none">AuraHealth · AuraDx</p>
              <p className="text-[11px] text-slate-500 leading-none mt-0.5">Clinical Diagnostic Co-Pilot Dossier</p>
            </div>
          </div>
          <div className="text-right text-[11px] text-slate-500">
            <p>Generated: {new Date(generatedAt).toLocaleString()}</p>
            <p>Cycle Day {day} · {phase} Phase</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-6 bg-slate-100 rounded-lg p-3">
          <InfoBlock label="Patient" value={`${patient.name}, ${patient.age}`} />
          <InfoBlock label="Cycle Length" value={`${patient.cycleLength} days`} />
          <InfoBlock label="Suspected Conditions" value={patient.suspected.join(', ')} />
          <InfoBlock label="Review Window" value="60-day symptom log" />
        </div>

        <Section letter="S" title="Subjective">
          <p className="text-sm mb-2"><span className="font-semibold">Chief Complaint:</span> {subjective.chiefComplaint}</p>
          <p className="text-xs text-slate-500 mb-2">{subjective.frequencyWindow}</p>
          <ul className="list-disc list-inside text-sm space-y-1">
            {subjective.topFindings.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </Section>

        <Section letter="O" title="Objective">
          <p className="text-sm mb-2">{objective.cycleContext}</p>
          <p className="text-sm font-semibold mb-1">Biomarker &amp; Correlation Findings:</p>
          <ul className="list-disc list-inside text-sm space-y-1 mb-2">
            {objective.biomarkerFlags.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
          <p className="text-sm bg-slate-50 border border-slate-200 rounded p-2">{objective.correlationInsight}</p>
        </Section>

        <Section letter="A" title="Assessment — Differential Diagnostic Leads">
          <ul className="list-disc list-inside text-sm space-y-1.5">
            {assessment.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </Section>

        <Section letter="P" title="Plan — Pre-Consultation Discussion Prompts">
          <p className="text-xs text-slate-500 mb-2">Three evidence-based questions to raise during a time-limited visit:</p>
          <ol className="list-decimal list-inside text-sm space-y-2">
            {plan.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ol>
        </Section>

        <div className="mt-6 pt-4 border-t border-slate-300 text-[10px] text-slate-500 leading-relaxed">
          AuraDx Clinical Decision Support System. Grounded in ACOG &amp; Rotterdam Consensus criteria. This
          dossier structures patient-reported data and lab values to support — not replace — a licensed clinician's
          diagnosis. Not a substitute for primary medical diagnosis.
        </div>
      </div>
    </div>
  )
}

function InfoBlock({ label, value }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  )
}

function Section({ letter, title, children }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-2">
        <span className="h-6 w-6 rounded bg-slate-900 text-white text-xs font-bold flex items-center justify-center">{letter}</span>
        <h4 className="font-bold text-sm uppercase tracking-wide">{title}</h4>
      </div>
      <div className="pl-1">{children}</div>
    </div>
  )
}
