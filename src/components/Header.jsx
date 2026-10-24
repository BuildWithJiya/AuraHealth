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
  const phaseColor = PHASE_META[phase].color

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/70 bg-slate-900/80 backdrop-blur-lg no-print">
      <div className="mx-auto max-w-[1600px] px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center shadow-lg shadow-indigo-900/40">
            <Activity size={18} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-lg leading-none">AuraHealth</span>
              <span className="text-xs font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 rounded-full px-2 py-0.5">AuraDx</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-none mt-0.5">AI Diagnostic Co-Pilot &amp; Phase-Aware Clinical Dossier</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs text-slate-300 bg-slate-800/60 border border-slate-700 rounded-full px-3 py-1.5">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: phaseColor }} />
          Day {day} of {cycleLength} &middot; <span className="font-semibold text-white">{phase}</span>
          {isCustomized && (
            <span className="ml-1 text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-2 py-0.5 font-medium">
              Saved locally
            </span>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          {/* Understand Your Body Button */}
          <button
            onClick={onOpenEducation}
            className="flex items-center gap-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 rounded-full px-3.5 py-2 transition-all hover:border-indigo-400 shadow-sm"
          >
            <BookOpen size={14} className="text-indigo-400" />
            <span className="hidden sm:inline">Understand Your Body</span>
            <span className="sm:hidden">Guide</span>
          </button>

          {/* Patient Switcher */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full pl-1.5 pr-3 py-1.5 transition-colors"
            >
              <span
                className="h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
                style={{ backgroundColor: activePatient.avatarColor }}
              >
                {activePatient.name.charAt(0)}
              </span>
              <span className="text-sm text-slate-100 font-medium">{activePatient.name}</span>
              <ChevronDown size={14} className="text-slate-400" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50">
                <div className="p-2 border-b border-slate-700/60 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Select Clinical Case Study
                </div>
                {patients.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSwitchPatient(p.id)
                      setMenuOpen(false)
                    }}
                    className={`w-full text-left px-3 py-2.5 flex items-center gap-2.5 hover:bg-slate-700/70 transition-colors ${
                      p.id === activePatient.id ? 'bg-slate-700/50' : ''
                    }`}
                  >
                    <span
                      className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{ backgroundColor: p.avatarColor }}
                    >
                      {p.name.charAt(0)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-slate-100 truncate">{p.name}, {p.age}</div>
                      <div className="text-[11px] text-slate-400 truncate">{p.suspected.join(' · ')}</div>
                    </span>
                  </button>
                ))}

                {onResetData && (
                  <div className="p-2 border-t border-slate-700/60 bg-slate-850">
                    <button
                      onClick={() => {
                        onResetData()
                        setMenuOpen(false)
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-rose-300 hover:text-rose-200 hover:bg-rose-500/10 rounded-lg flex items-center gap-2 transition-colors"
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
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold bg-rose-500 hover:bg-rose-600 text-white rounded-full px-3.5 py-2 transition-colors shadow shadow-rose-900/40"
          >
            <ShieldCheck size={14} />
            SOAP Dossier
          </button>
        </div>
      </div>
    </header>
  )
}
