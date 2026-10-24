import { X, Printer, Activity } from 'lucide-react'

export default function SoapDossier({ open, onClose, dossier, phase, day }) {
  if (!open || !dossier) return null
  const { patient, subjective, objective, assessment, plan, generatedAt } = dossier

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-xs overflow-y-auto py-6 px-3 no-print-bg">
      <div className="no-print sticky top-0 z-10 flex items-center justify-end gap-2 w-full max-w-3xl mb-[-48px] pr-2 pt-2">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 text-xs font-semibold bg-[#526E5B] hover:bg-[#435B4A] text-white rounded-full px-4 py-2 shadow-md transition-all hover:shadow-lg"
        >
          <Printer size={14} /> Print / Download PDF
        </button>
        <button
          onClick={onClose}
          className="flex items-center justify-center h-8 w-8 rounded-full bg-white hover:bg-[#FDF2F0] text-[#2E2825] border border-[#E2DAD1] shadow-md transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div id="print-dossier" className="relative w-full max-w-3xl bg-white text-[#2E2825] rounded-2xl shadow-xl mt-12 p-8 sm:p-10 border border-[#E8DFD8]">
        <div className="flex items-center justify-between border-b-2 border-[#526E5B] pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-[#526E5B] flex items-center justify-center shadow-xs">
              <Activity size={18} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-lg leading-none text-[#2E2825]">HerHealth &middot; AuraHealth</p>
              <p className="text-[11px] text-[#7A726D] leading-none mt-0.5">Clinical Diagnostic Co-Pilot Dossier</p>
            </div>
          </div>
          <div className="text-right text-[11px] text-[#7A726D]">
            <p>Generated: {new Date(generatedAt).toLocaleString()}</p>
            <p>Cycle Day {day} &middot; {phase} Phase</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-6 bg-[#FAF7F2] rounded-xl p-3 border border-[#E8DFD8]">
          <InfoBlock label="Patient" value={`${patient.name}, ${patient.age}`} />
          <InfoBlock label="Cycle Length" value={`${patient.cycleLength} days`} />
          <InfoBlock label="Suspected Conditions" value={patient.suspected.join(', ')} />
          <InfoBlock label="Review Window" value="60-day symptom log" />
        </div>

        <Section letter="S" title="Subjective">
          <p className="text-sm mb-2"><span className="font-semibold text-[#2E2825]">Chief Complaint:</span> {subjective.chiefComplaint}</p>
          <p className="text-xs text-[#7A726D] mb-2">{subjective.frequencyWindow}</p>
          <ul className="list-disc list-inside text-sm space-y-1 text-[#3E3834]">
            {subjective.topFindings.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </Section>

        <Section letter="O" title="Objective">
          <p className="text-sm mb-2">{objective.cycleContext}</p>
          <p className="text-sm font-semibold mb-1 text-[#2E2825]">Biomarker &amp; Correlation Findings:</p>
          <ul className="list-disc list-inside text-sm space-y-1 mb-2 text-[#3E3834]">
            {objective.biomarkerFlags.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
          <p className="text-sm bg-[#FAF7F2] border border-[#E8DFD8] rounded-xl p-2.5 text-[#3E3834]">{objective.correlationInsight}</p>
        </Section>

        <Section letter="A" title="Assessment — Differential Diagnostic Leads">
          <ul className="list-disc list-inside text-sm space-y-1.5 text-[#3E3834]">
            {assessment.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </Section>

        <Section letter="P" title="Plan — Pre-Consultation Discussion Prompts">
          <p className="text-xs text-[#7A726D] mb-2">Three evidence-based questions to raise during a time-limited visit:</p>
          <ol className="list-decimal list-inside text-sm space-y-2 text-[#3E3834]">
            {plan.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ol>
        </Section>

        <div className="mt-6 pt-4 border-t border-[#E8DFD8] text-[10px] text-[#7A726D] leading-relaxed">
          AuraHealth Clinical Decision Support System. Grounded in ACOG &amp; Rotterdam Consensus criteria. This
          dossier structures patient-reported data and lab values to support &mdash; not replace &mdash; a licensed clinician&apos;s
          diagnosis. Not a substitute for primary medical diagnosis.
        </div>
      </div>
    </div>
  )
}

function InfoBlock({ label, value }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide text-[#7A726D] font-medium">{label}</div>
      <div className="font-semibold text-[#2E2825]">{value}</div>
    </div>
  )
}

function Section({ letter, title, children }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-2">
        <span className="h-6 w-6 rounded-lg bg-[#526E5B] text-white text-xs font-bold flex items-center justify-center shadow-2xs">{letter}</span>
        <h4 className="font-bold text-sm uppercase tracking-wide text-[#2E2825]">{title}</h4>
      </div>
      <div className="pl-1">{children}</div>
    </div>
  )
}
