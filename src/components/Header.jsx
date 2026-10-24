import { Activity, ChevronDown, ShieldCheck, BookOpen, RotateCcw, Shield, EyeOff, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { PHASE_META, getCyclePhase } from '../utils/cycleEngine'
import { LIFE_STAGES } from '../data/lifeStageData'

export default function Header({
  patients,
  activePatient,
  onSwitchPatient,
  day,
  cycleLength,
  onOpenSoap,
  onOpenEducation,
  isCustomized,
  onResetData,
  onGoHome,
  activeLifeStageId = 'reproductive',
  onOpenLifeStage,
  onOpenPrivacy,
  onTriggerPanic,
  isAnonymous = false,
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const phase = getCyclePhase(day, cycleLength)
  const phaseColor = PHASE_META[phase]?.color || '#D96B85'

  const currentStage = LIFE_STAGES[activeLifeStageId] || LIFE_STAGES.reproductive
  const displayName = isAnonymous ? 'Aura-Anonymous-User' : activePatient.name

  return (
    <header className="sticky top-0 z-40 border-b border-[#E8EFE3] bg-[#F8F0E8]/90 backdrop-blur-xl no-print shadow-[0_2px_12px_-2px_rgba(106,61,85,0.06)]">
      <div className="mx-auto max-w-[1600px] px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo & Tagline (Clickable to return Home) */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-2.5 text-left group cursor-pointer"
          title="Return to Home Overview"
        >
          <div className="h-9 w-9 rounded-xl bg-[#FCE7E8] border border-[#D96B85]/30 flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
            <svg viewBox="0 0 44 44" className="w-6 h-6">
              <path
                d="M22 36 C12 30, 6 22, 10 14 C15 14, 19 20, 22 28 C25 20, 29 14, 34 14 C38 22, 32 30, 22 36 Z"
                fill="#E8EFE3"
                stroke="#405A43"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <path
                d="M22 36 C16 28, 14 18, 18 10 C22 10, 22 18, 22 26 C22 18, 22 10, 26 10 C30 18, 28 28, 22 36 Z"
                fill="#FCE7E8"
                stroke="#D96B85"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <circle cx="22" cy="18" r="3.2" fill="#D9A84E" stroke="#6A3D55" strokeWidth="1" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl font-bold tracking-tight text-[#6A3D55] group-hover:text-[#D96B85] transition-colors">Aura Health</span>
              <span className="text-[10px] font-semibold text-[#405A43] bg-[#E8EFE3] border border-[#405A43]/25 rounded-full px-2 py-0.5">
                AuraDx
              </span>
            </div>
            <p className="text-[9px] tracking-wider text-[#405A43] leading-none mt-0.5 font-semibold uppercase">
              HEALTH &middot; BALANCE &middot; YOU
            </p>
          </div>
        </button>

        {/* Center Indicators: Phase Pill + Life-Stage Pill */}
        <div className="hidden lg:flex items-center gap-2.5">
          {/* Phase Pill Indicator */}
          <div className="flex items-center gap-2 text-xs text-[#5E5259] bg-white/70 backdrop-blur-md border border-white/80 rounded-full px-3.5 py-1.5 shadow-xs">
            <span className="h-2.5 w-2.5 rounded-full shadow-xs" style={{ backgroundColor: phaseColor }} />
            Day {day} of {cycleLength} &middot;{' '}
            <span className="font-semibold text-[#6A3D55]">{phase}</span>
            {isCustomized && (
              <span className="ml-1 text-[10px] text-[#405A43] bg-[#E8EFE3]/80 border border-[#405A43]/30 rounded-full px-2 py-0.5 font-medium">
                Saved locally
              </span>
            )}
          </div>

          {/* Life-Stage Pill Indicator & Switcher */}
          <button
            onClick={onOpenLifeStage}
            className="flex items-center gap-1.5 text-xs text-[#31232B] hover:text-[#D96B85] bg-white/75 backdrop-blur-md border border-white/80 hover:border-[#D96B85]/40 rounded-full px-3.5 py-1.5 shadow-xs transition-all cursor-pointer"
            title="Click to view or switch Life-Stage Adaptive Mode"
          >
            <span>{currentStage.icon}</span>
            <span className="font-semibold">{currentStage.shortName}</span>
            <span className="text-[10px] text-[#7A726D] bg-[#FAF7F2] px-1.5 py-0.2 rounded-full border border-[#E8DFD8]">
              {currentStage.ageRange}
            </span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {onGoHome && (
            <button
              onClick={onGoHome}
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold bg-white/75 backdrop-blur-md hover:bg-[#FCE7E8] text-[#5E5259] hover:text-[#D96B85] border border-white/80 rounded-full px-3.5 py-2 transition-all shadow-xs cursor-pointer"
            >
              Overview
            </button>
          )}

          {/* Privacy & Discretion Hub Button */}
          <button
            onClick={onOpenPrivacy}
            className="flex items-center gap-1.5 text-xs font-semibold bg-white/75 backdrop-blur-md hover:bg-[#E8EFE3] text-[#405A43] border border-white/80 rounded-full px-3 py-2 transition-all hover:border-[#405A43] shadow-xs cursor-pointer"
            title="Privacy-First Settings & Discretion Controls"
          >
            <Shield size={14} className="text-[#405A43]" />
            <span className="hidden md:inline">Privacy</span>
            {isAnonymous && (
              <span className="h-2 w-2 rounded-full bg-[#D96B85]" title="Anonymous Ghost Mode Active" />
            )}
          </button>

          {/* Quick Screen Camouflage / Panic Button */}
          <button
            onClick={onTriggerPanic}
            className="flex items-center gap-1 text-xs font-semibold bg-white/75 backdrop-blur-md hover:bg-[#FAF7F2] text-[#6A3D55] border border-white/80 rounded-full px-2.5 py-2 transition-all shadow-xs cursor-pointer"
            title="Quick Screen Camouflage / Panic Curtain (Press Esc)"
          >
            <EyeOff size={13} />
            <span className="hidden xl:inline text-[11px]">Discreet</span>
          </button>

          {/* Understand Your Body Button */}
          <button
            onClick={onOpenEducation}
            className="flex items-center gap-1.5 text-xs font-semibold bg-white/75 backdrop-blur-md hover:bg-[#FCE7E8] text-[#D96B85] border border-white/80 rounded-full px-3 py-2 transition-all hover:border-[#D96B85] shadow-xs cursor-pointer"
          >
            <BookOpen size={14} className="text-[#D96B85]" />
            <span className="hidden sm:inline">Understand Body</span>
            <span className="sm:hidden">Guide</span>
          </button>

          {/* Patient Switcher */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 bg-white/75 backdrop-blur-md hover:bg-[#F8F0E8] border border-white/80 rounded-full pl-1.5 pr-3 py-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <span
                className="h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white shadow-xs"
                style={{ backgroundColor: activePatient.avatarColor || '#D96B85' }}
              >
                {displayName.charAt(0)}
              </span>
              <span className="text-sm text-[#31232B] font-medium max-w-[100px] sm:max-w-[130px] truncate">
                {displayName}
              </span>
              <ChevronDown size={14} className="text-[#8C8087]" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white/95 backdrop-blur-2xl border border-white/80 rounded-2xl shadow-xl overflow-hidden z-50">
                <div className="p-2.5 border-b border-[#E8EFE3] text-[10px] font-bold text-[#8C8087] uppercase tracking-wider bg-[#F8F0E8] flex items-center justify-between">
                  <span>Select Clinical Profile</span>
                  {isAnonymous && <span className="text-[9px] text-[#D96B85] font-bold">Anonymous</span>}
                </div>
                {patients.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSwitchPatient(p.id)
                      setMenuOpen(false)
                    }}
                    className={`w-full text-left px-3 py-2.5 flex items-center gap-2.5 hover:bg-[#FCE7E8] transition-colors cursor-pointer ${
                      p.id === activePatient.id ? 'bg-[#FCE7E8]/60' : ''
                    }`}
                  >
                    <span
                      className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-xs"
                      style={{ backgroundColor: p.avatarColor || '#D96B85' }}
                    >
                      {p.name.charAt(0)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-[#31232B] truncate">{p.name}, {p.age}</div>
                      <div className="text-[11px] text-[#8C8087] truncate">{p.suspected.join(' · ')}</div>
                    </span>
                  </button>
                ))}

                {/* Stage switcher link inside dropdown */}
                <div className="p-2 border-t border-[#E8EFE3] bg-[#FAF7F2]">
                  <button
                    onClick={() => {
                      onOpenLifeStage()
                      setMenuOpen(false)
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-[#6A3D55] hover:bg-[#E8DDF0]/60 rounded-lg flex items-center gap-2 transition-colors font-medium cursor-pointer"
                  >
                    <Sparkles size={12} className="text-[#6A3D55]" />
                    Life Stage: {currentStage.shortName}
                  </button>
                </div>

                {onResetData && (
                  <div className="p-2 border-t border-[#E8EFE3] bg-[#F8F0E8]">
                    <button
                      onClick={() => {
                        onResetData()
                        setMenuOpen(false)
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-[#D96B85] hover:text-[#B8526B] hover:bg-[#FCE7E8] rounded-lg flex items-center gap-2 transition-colors font-medium cursor-pointer"
                    >
                      <RotateCcw size={12} />
                      Reset to Default Demo Data
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SOAP Dossier Button */}
          <button
            onClick={onOpenSoap}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold bg-[#D96B85] hover:bg-[#B8526B] text-white rounded-full px-3.5 py-2 transition-colors shadow-sm cursor-pointer"
          >
            <ShieldCheck size={14} />
            SOAP Dossier
          </button>
        </div>
      </div>
    </header>
  )
}
