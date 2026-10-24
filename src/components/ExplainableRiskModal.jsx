import { useState } from 'react'
import {
  X,
  ShieldCheck,
  Stethoscope,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Activity,
  FileText,
  Printer,
  Sparkles,
  Info,
} from 'lucide-react'

export default function ExplainableRiskModal({ open, onClose, screeningReports = [], patient, onOpenSoap }) {
  const [selectedConditionId, setSelectedConditionId] = useState(
    screeningReports[0]?.id || 'pcos'
  )

  if (!open || !screeningReports.length) return null

  const activeReport =
    screeningReports.find((r) => r.id === selectedConditionId) || screeningReports[0]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-md p-3 sm:p-6 overflow-y-auto animate-[fadeIn_0.2s]">
      <div
        className="relative w-full max-w-4xl max-h-[92vh] bg-white/90 backdrop-blur-2xl border border-white/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-[#31232B]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="explainable-screening-title"
      >
        {/* Header Bar */}
        <div className="border-b border-[#E8DFD8]/80 bg-white/75 backdrop-blur-md px-6 py-4 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#D96B85] to-[#405A43] flex items-center justify-center text-white shadow-xs">
              <Stethoscope size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="explainable-screening-title" className="font-serif font-bold text-xl text-[#31232B]">
                  Explainable Risk Screening &amp; Referral
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#E8EFE3] text-[#405A43] border border-[#405A43]/20 rounded-full px-2.5 py-0.5 shadow-2xs">
                  Screening + Referral Guide
                </span>
              </div>
              <p className="text-xs text-[#7A726D]">
                Transparent clinical rationale (&ldquo;Why Was It Flagged?&rdquo;) based on objective international consensus criteria.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-white/80 hover:bg-[#FCE7E8] text-[#7A726D] hover:text-[#2E2825] border border-white/80 flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Clinical Disclaimer Banner (Non-Diagnostic Positioning) */}
        <div className="bg-[#FAF7F2] border-b border-[#E8DFD8]/80 px-6 py-2.5 flex items-center gap-2 text-xs text-[#5E5259] shrink-0">
          <ShieldCheck size={15} className="text-[#405A43] shrink-0" />
          <p>
            <strong className="text-[#31232B]">Physician Pre-Screening Support:</strong> This model screens longitudinal cycle patterns to prepare you for your medical visit. It provides decision support and referral guidelines &mdash;{' '}
            <span className="text-[#D96B85] font-semibold">not a definitive diagnosis</span>.
          </p>
        </div>

        {/* Main Content: Condition Tabs + Explainability Breakdown */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 min-h-0 overflow-hidden">
          {/* Left Column: Screened Conditions List */}
          <div className="md:col-span-4 border-r border-[#E8DFD8]/80 bg-[#F8F0E8]/50 backdrop-blur-md p-4 space-y-2.5 overflow-y-auto">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#6A3D55] px-1">
              Screened Conditions ({screeningReports.length})
            </p>

            {screeningReports.map((report) => {
              const isSelected = activeReport.id === report.id
              const isHigh = report.riskTier === 'high'
              return (
                <button
                  key={report.id}
                  onClick={() => setSelectedConditionId(report.id)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all shadow-2xs flex flex-col gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-white border-[#D96B85] shadow-xs ring-1 ring-[#D96B85]/30'
                      : 'bg-white/65 border-white/80 hover:bg-white/90'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#31232B] truncate">{report.name}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isHigh
                          ? 'bg-[#FCE7E8] text-[#D96B85] border-[#D96B85]/30'
                          : 'bg-[#FDF8EE] text-[#D9A84E] border-[#D9A84E]/30'
                      }`}
                    >
                      {report.confidenceScore}% Risk Match
                    </span>
                  </div>

                  <p className="text-[11px] text-[#7A726D] line-clamp-2 leading-snug">
                    {report.summaryHeadline}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[10px] text-[#405A43] font-semibold border-t border-[#F8F0E8]">
                    <span>{report.criteriaMatched}</span>
                    <ChevronRight size={12} className={isSelected ? 'text-[#D96B85]' : 'text-[#8C8087]'} />
                  </div>
                </button>
              )
            })}
          </div>

          {/* Right Column: Deep Explainability ("Why Was It Flagged") */}
          <div className="md:col-span-8 overflow-y-auto p-6 space-y-5 bg-white/70 backdrop-blur-xl">
            {/* Condition Header & Confidence Bar */}
            <div className="border-b border-[#E8DFD8]/80 pb-4">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D96B85] flex items-center gap-1.5">
                  <Activity size={13} /> {activeReport.shortName}
                </span>
                <span className="text-xs font-mono font-bold text-[#405A43] bg-[#E8EFE3] px-2.5 py-0.5 rounded-full border border-[#405A43]/20">
                  {activeReport.confidenceScore}% Confidence Level
                </span>
              </div>

              <h3 className="font-serif text-2xl font-bold text-[#31232B] mb-1">
                {activeReport.name}
              </h3>
              <p className="text-xs text-[#7A726D]">
                Clinical Evaluation Standard: <strong className="text-[#405A43]">{activeReport.clinicalStandard}</strong>
              </p>

              {/* Confidence Progress Meter */}
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-[11px] font-semibold text-[#5E5259]">
                  <span>Algorithmic Screening Probability:</span>
                  <span className="font-bold text-[#D96B85]">{activeReport.riskLevel}</span>
                </div>
                <div className="h-2.5 bg-[#FAF7F2] rounded-full overflow-hidden border border-white/80 shadow-inner">
                  <div
                    className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-[#D9A84E] via-[#D96B85] to-[#6A3D55]"
                    style={{ width: `${activeReport.confidenceScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* "WHY WAS IT FLAGGED" — Factor by Factor Explainable Breakdown */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#6A3D55] flex items-center gap-1.5">
                  <Sparkles size={13} className="text-[#D96B85]" />
                  Why Was It Flagged? (Transparent Factor Breakdown)
                </h4>
                <span className="text-[11px] text-[#7A726D] font-medium">
                  Explainable AI &middot; No black box
                </span>
              </div>

              <div className="space-y-2.5">
                {activeReport.whyFlagged.map((f, idx) => (
                  <div
                    key={idx}
                    className={`rounded-2xl p-3.5 border transition-all ${
                      f.detected
                        ? 'bg-white/80 border-[#D96B85]/25 shadow-2xs'
                        : 'bg-[#FAF7F2]/60 border-white/80 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-[#31232B] flex items-center gap-1.5">
                        {f.detected ? (
                          <CheckCircle2 size={14} className="text-[#D96B85] shrink-0" />
                        ) : (
                          <AlertCircle size={14} className="text-[#8C8087] shrink-0" />
                        )}
                        {f.factor}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          f.detected ? 'bg-[#FCE7E8] text-[#D96B85]' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        +{f.contribution} weight
                      </span>
                    </div>

                    <div className="text-xs text-[#5E5259] bg-[#FAF7F2] rounded-xl p-2.5 border border-[#E8DFD8]/60 space-y-1">
                      <p>
                        <strong className="text-[#31232B]">Patient Evidence:</strong> {f.evidence}
                      </p>
                      <p className="text-[11px] text-[#7A726D] italic">
                        <strong className="not-italic text-[#405A43]">Clinical Rationale:</strong> {f.clinicalRelevance}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Physician Referral Checklist */}
            <div className="bg-[#E8EFE3]/80 backdrop-blur-md rounded-2xl p-4 border border-white/80 space-y-2.5 shadow-2xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#405A43] flex items-center gap-1.5">
                <Stethoscope size={13} />
                Doctor Referral &amp; Confirmatory Tests Checklist
              </h4>
              <ul className="space-y-1.5 text-xs text-[#31232B]">
                {activeReport.doctorReferralChecklist.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="h-4 w-4 rounded-full bg-white text-[#405A43] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 border border-[#405A43]/20 shadow-2xs">
                      {i + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Doctor Discussion Script */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-white/80 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between text-xs font-bold text-[#6A3D55]">
                <span className="flex items-center gap-1.5">
                  <Info size={13} className="text-[#D96B85]" /> What to Say at Your Appointment
                </span>
                <span className="text-[10px] text-[#7A726D] font-normal">Copy or read directly</span>
              </div>
              <p className="text-xs text-[#5E5259] italic bg-[#FAF7F2] p-3 rounded-xl border border-[#E8DFD8]/70 leading-relaxed font-serif">
                {activeReport.physicianDiscussionPrompt}
              </p>
            </div>

            {/* Actions: Open SOAP Dossier */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={onClose}
                className="text-xs font-semibold text-[#7A726D] hover:text-[#2E2825] px-4 py-2 rounded-full hover:bg-white transition-colors"
              >
                Close Window
              </button>

              <button
                onClick={() => {
                  onClose()
                  if (onOpenSoap) onOpenSoap()
                }}
                className="flex items-center gap-1.5 text-xs font-semibold bg-[#D96B85] hover:bg-[#B8526B] text-white rounded-full px-5 py-2.5 shadow-sm transition-all hover:shadow cursor-pointer"
              >
                <FileText size={14} /> View Structured SOAP Dossier &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
