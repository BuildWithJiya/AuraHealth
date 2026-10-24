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
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 shadow-[0_8px_30px_-12px_rgba(244,63,94,0.2)]">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5 mb-3">
          <Stethoscope size={14} className="text-rose-400" />
          Diagnostic Insights
        </h3>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {patient.suspected.map((s) => (
            <span key={s} className="text-[11px] font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 rounded-full px-2.5 py-1">
              {s}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3">
          <StatChip icon={AlertOctagon} label="Critical" value={counts.critical} color="text-rose-300" bg="bg-rose-500/10" border="border-rose-500/30" />
          <StatChip icon={AlertTriangle} label="Warning" value={counts.warning} color="text-amber-300" bg="bg-amber-500/10" border="border-amber-500/30" />
          <StatChip icon={Info} label="Info" value={counts.info} color="text-indigo-300" bg="bg-indigo-500/10" border="border-indigo-500/30" />
        </div>

        {correlation && (
          <div className="text-xs text-slate-400 bg-slate-800/50 border border-slate-700 rounded-lg p-2.5 mb-3">
            <span className="font-bold text-rose-300">{Math.round(Math.abs(correlation.value) * 100)}%</span> {correlation.direction}{' '}
            correlation: symptom severity vs. {correlation.hormoneLabel}.
          </div>
        )}

        <button
          onClick={onOpenSoap}
          className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold bg-rose-500 hover:bg-rose-600 text-white rounded-lg py-2.5 transition-colors shadow-sm"
        >
          Open Full SOAP Dossier <ArrowRight size={13} />
        </button>

        {onOpenEducation && (
          <button
            onClick={onOpenEducation}
            className="w-full mt-2 flex items-center justify-center gap-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 rounded-lg py-2 transition-colors"
          >
            Understand Your Body Guide
          </button>
        )}
      </div>

      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 shadow-[0_8px_30px_-12px_rgba(244,63,94,0.2)]">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5 mb-3">
          <FileSearch size={14} className="text-emerald-400" />
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
    <div className={`rounded-lg border ${border} ${bg} p-2 text-center`}>
      <Icon size={14} className={`${color} mx-auto mb-0.5`} />
      <p className={`text-sm font-bold ${color}`}>{value}</p>
      <p className="text-[10px] text-slate-500">{label}</p>
    </div>
  )
}

function PreviewRow({ letter, text }) {
  return (
    <div className="flex items-start gap-2 mb-2.5 last:mb-0">
      <span className="h-5 w-5 shrink-0 rounded bg-slate-800 border border-slate-700 text-[11px] font-bold text-slate-300 flex items-center justify-center">
        {letter}
      </span>
      <p className="text-[11px] text-slate-400 line-clamp-2">{text}</p>
    </div>
  )
}
