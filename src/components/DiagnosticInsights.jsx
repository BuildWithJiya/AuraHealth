import { useState, useMemo } from 'react'
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
  ShieldCheck,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react'
import { runExplainableScreening } from '../utils/explainableRiskEngine'
import { LIFE_STAGES } from '../data/lifeStageData'
import ExplainableRiskModal from './ExplainableRiskModal'

const LETTER_THEMES = {
  S: { bg: 'bg-[#FCE7E8]', border: 'border-[#D96B85]/35', color: 'text-[#D96B85]' },
  O: { bg: 'bg-[#E8EFE3]', border: 'border-[#405A43]/35', color: 'text-[#405A43]' },
  A: { bg: 'bg-[#E8DDF0]', border: 'border-[#6A3D55]/35', color: 'text-[#6A3D55]' },
  P: { bg: 'bg-[#FDF8EE]', border: 'border-[#D9A84E]/40', color: 'text-[#D9A84E]' },
}

export default function DiagnosticInsights({
  patient,
  symptomLog = [],
  labFlags = [],
  correlation,
  dossier,
  onOpenSoap,
  onOpenEducation,
  activeLifeStageId = 'reproductive',
  onOpenLifeStage,
}) {
  const [screeningModalOpen, setScreeningModalOpen] = useState(false)
  const currentStage = LIFE_STAGES[activeLifeStageId] || LIFE_STAGES.reproductive

  const counts = labFlags.reduce(
    (acc, f) => {
      acc[f.severity] = (acc[f.severity] || 0) + 1
      return acc
    },
    { critical: 0, warning: 0, info: 0 }
  )

  // Run transparent Explainable AI Screening (Rotterdam, ACOG, DSM-5)
  const screeningReports = useMemo(() => {
    return runExplainableScreening({
      patient,
      symptomLog: symptomLog.length ? symptomLog : patient.symptomLog || [],
      labFlags,
      correlation,
    })
  }, [patient, symptomLog, labFlags, correlation])

  const topScreening = screeningReports[0]

  return (
    <div className="space-y-4">
      {/* 1. Diagnostic Overview Card */}
      <div className="ios-glass-card rounded-2xl p-4">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <h3 className="text-sm font-semibold text-[#6A3D55] flex items-center gap-1.5">
            <Stethoscope size={14} className="text-[#D96B85]" />
            Clinical Diagnostic Insights
          </h3>
          {onOpenLifeStage && (
            <button
              onClick={onOpenLifeStage}
              className="text-[10px] font-bold bg-[#FAF7F2] hover:bg-[#F8F0E8] text-[#405A43] border border-[#405A43]/20 rounded-full px-2 py-0.5 flex items-center gap-1 transition-colors cursor-pointer"
              title="Click to change life stage"
            >
              <span>{currentStage.icon}</span> {currentStage.shortName}
            </button>
          )}
        </div>

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
          className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold bg-[#D96B85] hover:bg-[#c45b74] text-white rounded-full py-2.5 shadow-sm transition-all hover:shadow cursor-pointer"
        >
          <FileText size={13} />
          Open Full SOAP Dossier <ArrowRight size={13} />
        </button>

        {onOpenEducation && (
          <button
            onClick={onOpenEducation}
            className="w-full mt-2 flex items-center justify-center gap-1.5 text-xs font-semibold bg-white/80 hover:bg-[#E8EFE3] text-[#405A43] border border-[#405A43]/30 rounded-full py-2 shadow-2xs transition-colors cursor-pointer"
          >
            <BookOpen size={13} />
            Understand Your Body Guide
          </button>
        )}
      </div>

      {/* 2. Explainable Risk Screening Card ("Why Was It Flagged?") */}
      <div className="ios-glass-card rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#6A3D55] flex items-center gap-1.5">
            <ShieldCheck size={15} className="text-[#405A43]" />
            Explainable Risk Screening
          </h3>
          <span className="text-[10px] font-bold text-[#405A43] bg-[#E8EFE3] px-2 py-0.5 rounded-full border border-[#405A43]/20">
            Referral Guide
          </span>
        </div>

        <p className="text-[11px] text-[#7A726D] leading-tight">
          Transparent clinical rationale based on international criteria &mdash; not a black-box AI.
        </p>

        {topScreening && (
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-3.5 border border-white/80 space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#31232B] truncate">{topScreening.name}</span>
              <span className="text-[10px] font-bold text-[#D96B85] bg-[#FCE7E8] px-2.5 py-0.5 rounded-full border border-[#D96B85]/30 shrink-0">
                {topScreening.confidenceScore}% Risk Match
              </span>
            </div>

            <p className="text-[11px] text-[#5E5259] leading-snug">
              {topScreening.summaryHeadline}
            </p>

            {/* Contributing Pattern Factors */}
            <div className="space-y-1 pt-1.5 border-t border-[#F8F0E8]">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#7A726D]">
                Contributing Pattern Factors:
              </div>
              <div className="space-y-1">
                {topScreening.whyFlagged.filter((f) => f.detected).map((f, i) => (
                  <div key={i} className="flex items-center justify-between text-[10px] bg-white/80 rounded-lg px-2 py-1 border border-[#E8DFD8]/70">
                    <span className="font-semibold text-[#31232B] flex items-center gap-1 truncate">
                      <CheckCircle2 size={11} className="text-[#D96B85] shrink-0" />
                      {f.factor}
                    </span>
                    <span className="font-bold text-[#405A43] shrink-0">+{f.contribution}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setScreeningModalOpen(true)}
              className="w-full mt-2 flex items-center justify-center gap-1.5 text-xs font-bold bg-[#405A43] hover:bg-[#344a37] text-white rounded-xl py-2.5 shadow-2xs transition-all cursor-pointer"
            >
              <HelpCircle size={13} />
              Why Was It Flagged? (View Factor Breakdown) &rarr;
            </button>
          </div>
        )}
      </div>

      {/* 3. SOAP Dossier Preview Card */}
      <div className="ios-glass-card rounded-2xl p-4">
        <h3 className="text-sm font-semibold text-[#6A3D55] flex items-center gap-1.5 mb-3">
          <FileSearch size={14} className="text-[#405A43]" />
          SOAP Dossier Preview
        </h3>
        <PreviewRow letter="S" text={dossier.subjective.chiefComplaint} />
        <PreviewRow letter="O" text={dossier.objective.biomarkerFlags[0]} />
        <PreviewRow letter="A" text={dossier.assessment[0]} />
        <PreviewRow letter="P" text={dossier.plan[0]} />

        {onOpenSoap && (
          <button
            onClick={onOpenSoap}
            className="w-full mt-3 flex items-center justify-center gap-1.5 text-xs font-semibold bg-[#D96B85] hover:bg-[#B8526B] text-white rounded-xl py-2 transition-colors shadow-2xs cursor-pointer"
          >
            <FileText size={13} />
            Open Full Consultation Dossier &rarr;
          </button>
        )}
      </div>

      {/* Explainable Risk Modal */}
      <ExplainableRiskModal
        open={screeningModalOpen}
        onClose={() => setScreeningModalOpen(false)}
        screeningReports={screeningReports}
        patient={patient}
        onOpenSoap={onOpenSoap}
      />
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
