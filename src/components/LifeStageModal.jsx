import { useState } from 'react'
import { Check, Compass, Sparkles, Stethoscope, ChevronRight, X, Heart, ShieldAlert, Baby, Calendar } from 'lucide-react'
import { LIFE_STAGES, LIFE_STAGE_LIST } from '../data/lifeStageData'

export default function LifeStageModal({ open, onClose, activeLifeStageId, onSelectLifeStage }) {
  const [selectedStageId, setSelectedStageId] = useState(activeLifeStageId || 'reproductive')

  if (!open) return null

  const activeStage = LIFE_STAGES[selectedStageId] || LIFE_STAGES.reproductive

  const handleApply = (stageId) => {
    setSelectedStageId(stageId)
    onSelectLifeStage(stageId)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lifestage-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#31232B]/55 backdrop-blur-md animate-fade-in"
    >
      <div className="ios-glass-card max-w-4xl w-full rounded-3xl overflow-hidden shadow-2xl border border-white/80 max-h-[92vh] flex flex-col bg-white/95">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#E8DFD8] flex items-center justify-between bg-[#F8F0E8]/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[#E8DDF0] text-[#6A3D55] flex items-center justify-center border border-[#6A3D55]/20 shadow-xs text-xl">
              🌱
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="lifestage-modal-title" className="font-serif font-bold text-xl text-[#31232B]">
                  Life-Stage Adaptive Health Mode
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#E8DDF0] text-[#6A3D55] border border-[#6A3D55]/20 rounded-full px-2.5 py-0.5">
                  4 Adaptive Stages
                </span>
              </div>
              <p className="text-xs text-[#7A726D]">
                Teen &middot; Reproductive &middot; Pregnancy &amp; Postpartum &middot; Perimenopause
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

        {/* Clinical Rationale Banner */}
        <div className="bg-[#FAF7F2] border-b border-[#E8DFD8]/80 px-6 py-2.5 flex items-center gap-2 text-xs text-[#5E5259] shrink-0">
          <Sparkles size={14} className="text-[#D96B85] shrink-0" />
          <p>
            <strong className="text-[#31232B]">Beyond Reproductive Age:</strong> Most cycle trackers stop at pregnancy or simple ovulation. Aura Health adapts questions, hormonal models, and screening criteria across your entire lifespan.
          </p>
        </div>

        {/* Content Body */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 min-h-0 overflow-hidden">
          {/* Left Column: 4 Life Stages Selection */}
          <div className="md:col-span-5 border-r border-[#E8DFD8]/80 bg-[#F8F0E8]/40 p-4 space-y-2.5 overflow-y-auto">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#6A3D55] px-1">
              Select Your Current Chapter
            </p>

            {LIFE_STAGE_LIST.map((stage) => {
              const isCurrent = stage.id === selectedStageId
              const isActiveInApp = stage.id === activeLifeStageId

              return (
                <button
                  key={stage.id}
                  onClick={() => handleApply(stage.id)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer relative ${
                    isCurrent
                      ? 'bg-white shadow-md border-[#D96B85]/40 ring-1 ring-[#D96B85]/30'
                      : 'bg-white/60 hover:bg-white border-[#E8DFD8] shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl p-1.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD8]">
                        {stage.icon}
                      </span>
                      <div>
                        <div className="font-serif font-bold text-sm text-[#31232B] flex items-center gap-1.5">
                          {stage.title}
                        </div>
                        <span className="text-[11px] text-[#7A726D] font-medium">{stage.ageRange}</span>
                      </div>
                    </div>

                    {isActiveInApp && (
                      <span className="text-[10px] font-bold text-white bg-[#405A43] px-2 py-0.5 rounded-full shadow-2xs shrink-0">
                        Active in App
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-[#5E5259] mt-2 line-clamp-2 leading-relaxed">
                    {stage.summary}
                  </p>
                </button>
              )
            })}
          </div>

          {/* Right Column: Deep Stage Intelligence */}
          <div className="md:col-span-7 p-6 overflow-y-auto space-y-5 bg-white/70">
            {/* Stage Title & Badge */}
            <div className="border-b border-[#E8DFD8] pb-4">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D96B85] flex items-center gap-1.5">
                  <span className="text-base">{activeStage.icon}</span> {activeStage.badge}
                </span>
                <span className="text-xs font-mono font-semibold text-[#405A43] bg-[#E8EFE3] px-2.5 py-0.5 rounded-full border border-[#405A43]/20">
                  {activeStage.ageRange}
                </span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#31232B]">
                {activeStage.title}
              </h3>
              <p className="text-xs text-[#5E5259] mt-1 leading-relaxed">
                {activeStage.summary}
              </p>
            </div>

            {/* Clinical Focus Domains */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#6A3D55] flex items-center gap-1.5">
                <Stethoscope size={13} className="text-[#D96B85]" />
                Stage-Specific Clinical Focus
              </h4>
              <div className="grid grid-cols-1 gap-2.5">
                {activeStage.clinicalFocus.map((f, idx) => (
                  <div key={idx} className="rounded-xl p-3 bg-[#FAF7F2] border border-[#E8DFD8] text-xs">
                    <p className="font-semibold text-[#31232B]">{f.title}</p>
                    <p className="text-[#5E5259] mt-0.5 leading-relaxed">{f.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Stage Tailored Diagnostic Questions */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#6A3D55] flex items-center gap-1.5">
                <Compass size={13} className="text-[#405A43]" />
                Adaptive Screening Questions for this Stage
              </h4>
              <div className="space-y-1.5">
                {activeStage.diagnosticQuestions.map((q, idx) => (
                  <div key={idx} className="rounded-xl p-2.5 bg-white border border-[#E8DFD8] text-xs text-[#31232B] flex items-start gap-2 shadow-2xs">
                    <span className="h-5 w-5 rounded-full bg-[#E8EFE3] text-[#405A43] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="leading-relaxed">{q}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Symptom Chips */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#6A3D55] flex items-center gap-1.5">
                <Heart size={13} className="text-[#D96B85]" />
                Common Stage Symptom Presets
              </h4>
              <div className="flex flex-wrap gap-2">
                {activeStage.symptomChips.map((chip, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-[#FAF7F2] text-[#405A43] font-medium px-3 py-1 rounded-full border border-[#405A43]/20 shadow-2xs"
                  >
                    {chip.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Doctor Discussion Guide for this stage */}
            <div className="space-y-2.5 bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8DFD8]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#405A43] flex items-center gap-1.5">
                <ShieldAlert size={13} />
                Doctor Discussion Guide for this Stage
              </h4>
              <ul className="space-y-1.5 list-disc list-inside text-xs text-[#5E5259]">
                {activeStage.doctorQuestions.map((dq, idx) => (
                  <li key={idx} className="leading-relaxed text-[#31232B]">
                    &ldquo;{dq}&rdquo;
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E8DFD8] bg-[#FAF7F2] flex items-center justify-between text-xs text-[#7A726D] shrink-0">
          <span>Active Chapter: <strong className="text-[#31232B]">{activeStage.title}</strong></span>
          <button
            onClick={() => {
              onSelectLifeStage(selectedStageId)
              onClose()
            }}
            className="font-semibold bg-[#D96B85] hover:bg-[#B8526B] text-white rounded-full px-6 py-2 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Check size={14} />
            Apply This Life Stage
          </button>
        </div>
      </div>
    </div>
  )
}
