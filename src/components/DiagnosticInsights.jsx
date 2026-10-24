import {
  Stethoscope,
  FileSearch,
  AlertOctagon,
  AlertTriangle,
  Info,
  ArrowRight,
  BookOpen,
  FileText,
  Sparkles,
  Activity,
} from 'lucide-react'

const LETTER_THEMES = {
  S: { bg: 'bg-[#FCE7E8]', border: 'border-[#D96B85]/35', color: 'text-[#D96B85]' },
  O: { bg: 'bg-[#E8EFE3]', border: 'border-[#405A43]/35', color: 'text-[#405A43]' },
  A: { bg: 'bg-[#E8DDF0]', border: 'border-[#6A3D55]/35', color: 'text-[#6A3D55]' },
  P: { bg: 'bg-[#FDF8EE]', border: 'border-[#D9A84E]/40', color: 'text-[#D9A84E]' },
}

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
        <h3 className="text-sm font-semibold text-[#6A3D55] flex items-center gap-1.5 mb-3">
          <Stethoscope size={14} className="text-[#D96B85]" />
          Diagnostic Insights
        </h3>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {patient.suspected.map((s) => (
            <span
              key={s}
              className="text-[11px] font-semibold bg-[#FCE7E8] text-[#6A3D55] border border-[#D96B85]/30 rounded-full px-2.5 py-0.5 shadow-2xs flex items-center gap-1"
            >
              <Sparkles size={11} className="text-[#D96B85]" />
              {s}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3">
          <StatChip
            icon={AlertOctagon}
            label="Critical"
            value={counts.critical}
            color="text-[#D96B85]"
            bg="bg-[#FCE7E8]/75"
            border="border-white/80"
          />
          <StatChip
            icon={AlertTriangle}
            label="Warning"
            value={counts.warning}
            color="text-[#D9A84E]"
            bg="bg-[#FDF8EE]/80"
            border="border-white/80"
          />
          <StatChip
            icon={Info}
            label="Info"
            value={counts.info}
            color="text-[#405A43]"
            bg="bg-[#E8EFE3]/80"
            border="border-white/80"
          />
        </div>

        {correlation && (
          <div className="text-xs text-[#3E3834] bg-white/60 backdrop-blur-md border border-white/80 rounded-xl p-2.5 mb-3 leading-relaxed flex items-start gap-1.5 shadow-2xs">
            <Activity size={13} className="text-[#D96B85] shrink-0 mt-0.5" />
            <p>
              <span className="font-bold text-[#6A3D55]">{Math.round(Math.abs(correlation.value) * 100)}%</span>{' '}
              {correlation.direction} correlation: symptom severity vs. {correlation.hormoneLabel}.
            </p>
          </div>
        )}

        <button
          onClick={onOpenSoap}
          className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold bg-[#D96B85] hover:bg-[#c45b74] text-white rounded-full py-2.5 shadow-sm transition-all hover:shadow"
        >
          <FileText size={13} />
          Open Full SOAP Dossier <ArrowRight size={13} />
        </button>

        {onOpenEducation && (
          <button
            onClick={onOpenEducation}
            className="w-full mt-2 flex items-center justify-center gap-1.5 text-xs font-semibold bg-white hover:bg-[#E8EFE3] text-[#405A43] border border-[#405A43]/30 rounded-full py-2 shadow-2xs transition-colors"
          >
            <BookOpen size={13} />
            Understand Your Body Guide
          </button>
        )}
      </div>

      <div className="ios-glass-card rounded-2xl p-4">
        <h3 className="text-sm font-semibold text-[#6A3D55] flex items-center gap-1.5 mb-3">
          <FileSearch size={14} className="text-[#405A43]" />
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
    <div className={`rounded-xl border ${border} ${bg} backdrop-blur-sm p-2 text-center shadow-2xs`}>
      <Icon size={14} className={`${color} mx-auto mb-0.5`} />
      <p className={`text-sm font-bold ${color}`}>{value}</p>
      <p className="text-[10px] text-[#7A726D] font-medium">{label}</p>
    </div>
  )
}

function PreviewRow({ letter, text }) {
  const theme = LETTER_THEMES[letter] || { bg: 'bg-[#FAF7F2]', border: 'border-[#E8DFD8]', color: 'text-[#2E2825]' }
  return (
    <div className="flex items-start gap-2 mb-2.5 last:mb-0">
      <span className={`h-5 w-5 shrink-0 rounded-md ${theme.bg} border ${theme.border} text-[11px] font-bold ${theme.color} flex items-center justify-center shadow-2xs`}>
        {letter}
      </span>
      <p className="text-[11px] text-[#5C5552] line-clamp-2 leading-relaxed">{text}</p>
    </div>
  )
}
