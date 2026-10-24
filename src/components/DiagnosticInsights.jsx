import { Stethoscope, FileSearch, AlertOctagon, AlertTriangle, Info, ArrowRight } from 'lucide-react'

export default function DiagnosticInsights({ patient, labFlags, correlation, dossier, onOpenSoap, onOpenEducation }) {
  const counts = labFlags.reduce(
    (acc, f) => {
      acc[f.severity] = (acc[f.severity] || 0) + 1
      return acc
    },
    { critical: 0, warning: 0, info: 0 }
  )

  return (
    <div className="space-y-4">
      <div className="ios-glass-card rounded-2xl p-4">
        <h3 className="text-sm font-semibold text-[#2E2825] flex items-center gap-1.5 mb-3">
          <Stethoscope size={14} className="text-[#C97A72]" />
          Diagnostic Insights
        </h3>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {patient.suspected.map((s) => (
            <span
              key={s}
              className="text-[11px] font-semibold bg-[#FDF2F0] text-[#C97A72] border border-[#C97A72]/25 rounded-full px-2.5 py-0.5 shadow-2xs"
            >
              {s}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3">
          <StatChip
            icon={AlertOctagon}
            label="Critical"
            value={counts.critical}
            color="text-[#C97A72]"
            bg="bg-[#FDF2F0]"
            border="border-[#C97A72]/25"
          />
          <StatChip
            icon={AlertTriangle}
            label="Warning"
            value={counts.warning}
            color="text-[#C88D58]"
            bg="bg-[#FDF7EE]"
            border="border-[#D4A373]/30"
          />
          <StatChip
            icon={Info}
            label="Info"
            value={counts.info}
            color="text-[#526E5B]"
            bg="bg-[#EEF4EC]"
            border="border-[#526E5B]/25"
          />
        </div>

        {correlation && (
          <div className="text-xs text-[#5C5552] bg-[#FAF7F2] border border-[#E8DFD8] rounded-xl p-2.5 mb-3 leading-relaxed">
            <span className="font-bold text-[#C97A72]">{Math.round(Math.abs(correlation.value) * 100)}%</span>{' '}
            {correlation.direction} correlation: symptom severity vs. {correlation.hormoneLabel}.
          </div>
        )}

        <button
          onClick={onOpenSoap}
          className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold bg-[#526E5B] hover:bg-[#435B4A] text-white rounded-full py-2.5 shadow-sm transition-all hover:shadow"
        >
          Open Full SOAP Dossier <ArrowRight size={13} />
        </button>

        {onOpenEducation && (
          <button
            onClick={onOpenEducation}
            className="w-full mt-2 flex items-center justify-center gap-1.5 text-xs font-semibold bg-white hover:bg-[#FDF2F0] text-[#C97A72] border border-[#C97A72]/30 rounded-full py-2 shadow-2xs transition-colors"
          >
            Understand Your Body Guide
          </button>
        )}
      </div>

      <div className="ios-glass-card rounded-2xl p-4">
        <h3 className="text-sm font-semibold text-[#2E2825] flex items-center gap-1.5 mb-3">
          <FileSearch size={14} className="text-[#526E5B]" />
          SOAP Dossier Preview
        </h3>
        <PreviewRow letter="S" text={dossier.subjective.chiefComplaint} />
        <PreviewRow letter="O" text={dossier.objective.biomarkerFlags[0]} />
        <PreviewRow letter="A" text={dossier.assessment[0]} />
        <PreviewRow letter="P" text={dossier.plan[0]} />
      </div>
    </div>
  )
}

function StatChip({ icon: Icon, label, value, color, bg, border }) {
  return (
    <div className={`rounded-xl border ${border} ${bg} p-2 text-center shadow-2xs`}>
      <Icon size={14} className={`${color} mx-auto mb-0.5`} />
      <p className={`text-sm font-bold ${color}`}>{value}</p>
      <p className="text-[10px] text-[#7A726D] font-medium">{label}</p>
    </div>
  )
}

function PreviewRow({ letter, text }) {
  return (
    <div className="flex items-start gap-2 mb-2.5 last:mb-0">
      <span className="h-5 w-5 shrink-0 rounded-md bg-[#FAF7F2] border border-[#E2DAD1] text-[11px] font-bold text-[#2E2825] flex items-center justify-center shadow-2xs">
        {letter}
      </span>
      <p className="text-[11px] text-[#5C5552] line-clamp-2 leading-relaxed">{text}</p>
    </div>
  )
}
