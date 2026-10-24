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
  const phaseColor = PHASE_META[phase]?.color || '#D96B85'

  return (
    <header className="sticky top-0 z-40 border-b border-[#E8EFE3] bg-[#F8F0E8]/90 backdrop-blur-xl no-print shadow-[0_2px_12px_-2px_rgba(106,61,85,0.06)]">
      <div className="mx-auto max-w-[1600px] px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-[#FCE7E8] border border-[#D96B85]/30 flex items-center justify-center shadow-xs">
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
              <span className="font-serif text-xl font-bold tracking-tight text-[#6A3D55]">Aura Health</span>
              <span className="text-[10px] font-semibold text-[#405A43] bg-[#E8EFE3] border border-[#405A43]/25 rounded-full px-2 py-0.5">
                AuraDx
              </span>
            </div>
            <p className="text-[9px] tracking-wider text-[#405A43] leading-none mt-0.5 font-semibold uppercase">
              HEALTH &middot; BALANCE &middot; YOU
            </p>
          </div>
        </div>

        {/* Phase Pill Indicator */}
        <div className="hidden md:flex items-center gap-2 text-xs text-[#5E5259] bg-white/80 border border-[#E8EFE3] rounded-full px-3.5 py-1.5 shadow-xs">
          <span className="h-2.5 w-2.5 rounded-full shadow-xs" style={{ backgroundColor: phaseColor }} />
          Day {day} of {cycleLength} &middot;{' '}
          <span className="font-semibold text-[#6A3D55]">{phase}</span>
          {isCustomized && (
            <span className="ml-1 text-[10px] text-[#405A43] bg-[#E8EFE3] border border-[#405A43]/30 rounded-full px-2 py-0.5 font-medium">
              Saved locally
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Understand Your Body Button */}
          <button
            onClick={onOpenEducation}
            className="flex items-center gap-1.5 text-xs font-semibold bg-white hover:bg-[#FCE7E8] text-[#D96B85] border border-[#D96B85]/30 rounded-full px-3.5 py-2 transition-all hover:border-[#D96B85] shadow-xs"
          >
            <BookOpen size={14} className="text-[#D96B85]" />
            <span className="hidden sm:inline">Understand Your Body</span>
            <span className="sm:hidden">Guide</span>
          </button>

          {/* Patient Switcher */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 bg-white hover:bg-[#F8F0E8] border border-[#E8EFE3] rounded-full pl-1.5 pr-3 py-1.5 transition-colors shadow-xs"
            >
              <span
                className="h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white shadow-xs"
                style={{ backgroundColor: activePatient.avatarColor || '#D96B85' }}
              >
                {activePatient.name.charAt(0)}
              </span>
              <span className="text-sm text-[#31232B] font-medium">{activePatient.name}</span>
              <ChevronDown size={14} className="text-[#8C8087]" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-[#E8EFE3] rounded-2xl shadow-xl overflow-hidden z-50">
                <div className="p-2.5 border-b border-[#E8EFE3] text-[10px] font-bold text-[#8C8087] uppercase tracking-wider bg-[#F8F0E8]">
                  Select Clinical Case Study
                </div>
                {patients.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSwitchPatient(p.id)
                      setMenuOpen(false)
                    }}
                    className={`w-full text-left px-3 py-2.5 flex items-center gap-2.5 hover:bg-[#FCE7E8] transition-colors ${
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

                {onResetData && (
                  <div className="p-2 border-t border-[#E8EFE3] bg-[#F8F0E8]">
                    <button
                      onClick={() => {
                        onResetData()
                        setMenuOpen(false)
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-[#D96B85] hover:text-[#B8526B] hover:bg-[#FCE7E8] rounded-lg flex items-center gap-2 transition-colors font-medium"
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
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold bg-[#D96B85] hover:bg-[#B8526B] text-white rounded-full px-3.5 py-2 transition-colors shadow-sm"
          >
            <ShieldCheck size={14} />
            SOAP Dossier
          </button>
        </div>
      </div>
    </header>
  )
}
