import { Activity, ChevronDown, ShieldCheck, BookOpen, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { PHASE_META, getCyclePhase } from '../utils/cycleEngine'

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
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const phase = getCyclePhase(day, cycleLength)
  const phaseColor = PHASE_META[phase]?.color || '#C97A72'

  return (
    <header className="sticky top-0 z-40 border-b border-[#E8DFD8] bg-[#FAF7F2]/90 backdrop-blur-xl no-print shadow-[0_2px_12px_-2px_rgba(180,150,140,0.06)]">
      <div className="mx-auto max-w-[1600px] px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#C97A72] to-[#526E5B] flex items-center justify-center shadow-sm">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-white stroke-2">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl font-bold tracking-tight text-[#2E2825]">HerHealth</span>
              <span className="text-[10px] font-semibold text-[#526E5B] bg-[#EEF4EC] border border-[#526E5B]/25 rounded-full px-2 py-0.5">
                AuraHealth
              </span>
            </div>
            <p className="text-[10px] text-[#7A726D] leading-none mt-0.5 font-medium">
              Understand &middot; Prevent &middot; Thrive
            </p>
          </div>
        </div>

        {/* Phase Pill Indicator */}
        <div className="hidden md:flex items-center gap-2 text-xs text-[#5C5552] bg-white/80 border border-[#E2DAD1] rounded-full px-3.5 py-1.5 shadow-xs">
          <span className="h-2.5 w-2.5 rounded-full shadow-xs" style={{ backgroundColor: phaseColor }} />
          Day {day} of {cycleLength} &middot;{' '}
          <span className="font-semibold text-[#2E2825]">{phase}</span>
          {isCustomized && (
            <span className="ml-1 text-[10px] text-[#526E5B] bg-[#EEF4EC] border border-[#526E5B]/30 rounded-full px-2 py-0.5 font-medium">
              Saved locally
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Understand Your Body Button */}
          <button
            onClick={onOpenEducation}
            className="flex items-center gap-1.5 text-xs font-semibold bg-white hover:bg-[#FDF2F0] text-[#C97A72] border border-[#C97A72]/30 rounded-full px-3.5 py-2 transition-all hover:border-[#C97A72] shadow-xs"
          >
            <BookOpen size={14} className="text-[#C97A72]" />
            <span className="hidden sm:inline">Understand Your Body</span>
            <span className="sm:hidden">Guide</span>
          </button>

          {/* Patient Switcher */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 bg-white hover:bg-[#FAF7F2] border border-[#E2DAD1] rounded-full pl-1.5 pr-3 py-1.5 transition-colors shadow-xs"
            >
              <span
                className="h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white shadow-xs"
                style={{ backgroundColor: activePatient.avatarColor || '#C97A72' }}
              >
                {activePatient.name.charAt(0)}
              </span>
              <span className="text-sm text-[#2E2825] font-medium">{activePatient.name}</span>
              <ChevronDown size={14} className="text-[#7A726D]" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-[#E2DAD1] rounded-2xl shadow-xl overflow-hidden z-50">
                <div className="p-2.5 border-b border-[#EAE2D9] text-[10px] font-bold text-[#7A726D] uppercase tracking-wider bg-[#FAF7F2]">
                  Select Clinical Case Study
                </div>
                {patients.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSwitchPatient(p.id)
                      setMenuOpen(false)
                    }}
                    className={`w-full text-left px-3 py-2.5 flex items-center gap-2.5 hover:bg-[#FDF2F0] transition-colors ${
                      p.id === activePatient.id ? 'bg-[#FDF2F0]/60' : ''
                    }`}
                  >
                    <span
                      className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-xs"
                      style={{ backgroundColor: p.avatarColor || '#C97A72' }}
                    >
                      {p.name.charAt(0)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-[#2E2825] truncate">{p.name}, {p.age}</div>
                      <div className="text-[11px] text-[#7A726D] truncate">{p.suspected.join(' · ')}</div>
                    </span>
                  </button>
                ))}

                {onResetData && (
                  <div className="p-2 border-t border-[#EAE2D9] bg-[#FAF7F2]">
                    <button
                      onClick={() => {
                        onResetData()
                        setMenuOpen(false)
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-[#C97A72] hover:text-[#B4645C] hover:bg-[#FDF2F0] rounded-lg flex items-center gap-2 transition-colors font-medium"
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
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold bg-[#526E5B] hover:bg-[#435B4A] text-white rounded-full px-3.5 py-2 transition-colors shadow-sm"
          >
            <ShieldCheck size={14} />
            SOAP Dossier
          </button>
        </div>
      </div>
    </header>
  )
}
