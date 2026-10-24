import { useRef, useState } from 'react'
import { FlaskConical, Upload, AlertTriangle, Info, AlertOctagon, FileText } from 'lucide-react'
import { LAB_PRESETS } from '../data/labPresets'
import MedTooltip from './MedTooltip'

const SEVERITY_STYLES = {
  critical: { icon: AlertOctagon, color: 'text-rose-300', bg: 'bg-rose-500/10', border: 'border-rose-500/40' },
  warning: { icon: AlertTriangle, color: 'text-amber-300', bg: 'bg-amber-500/10', border: 'border-amber-500/40' },
  info: { icon: Info, color: 'text-indigo-300', bg: 'bg-indigo-500/10', border: 'border-indigo-500/40' },
}

function RangeBar({ label, range, value, scaleMax, accent }) {
  const [low, high] = range
  const pct = (n) => Math.min(Math.max((n / scaleMax) * 100, 0), 100)
  return (
    <div>
      <div className="flex justify-between text-[10px] text-slate-500 mb-0.5">
        <span>{label}</span>
        <span>
          {low}–{high}
        </span>
      </div>
      <div className="relative h-2.5 bg-slate-800 rounded-full">
        <div
          className="absolute h-full rounded-full"
          style={{ left: `${pct(low)}%`, width: `${pct(high) - pct(low)}%`, backgroundColor: accent, opacity: 0.35 }}
        />
        <div
          className="absolute top-[-3px] h-[11px] w-[3px] rounded-full bg-white shadow"
          style={{ left: `calc(${pct(value)}% - 1.5px)` }}
        />
      </div>
    </div>
  )
}

export default function BiomarkerPanel({ phase, day, presetKey, values, onApplyPreset, result }) {
  const [uploadedName, setUploadedName] = useState('')
  const fileInputRef = useRef(null)

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (file) setUploadedName(file.name)
  }

  return (
    <div className="ios-glass-card rounded-2xl p-4">
      <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5 mb-3">
        <FlaskConical size={14} className="text-amber-400" />
        Phase-Adjusted Biomarker Interpreter
      </h3>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        {Object.values(LAB_PRESETS).map((preset) => (
          <button
            key={preset.id}
            onClick={() => onApplyPreset(preset.id)}
            className={`text-xs font-semibold rounded-full px-3 py-1.5 border transition-colors ${
              presetKey === preset.id
                ? 'bg-indigo-500 border-indigo-500 text-white'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {preset.name}
          </button>
        ))}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 text-xs font-semibold rounded-full px-3 py-1.5 border border-dashed border-slate-600 text-slate-400 hover:text-slate-200 hover:border-slate-400 transition-colors"
        >
          <Upload size={12} /> Upload Lab PDF
        </button>
        <input ref={fileInputRef} type="file" accept=".pdf,.png,.jpg,.jpeg" className="hidden" onChange={handleFile} />
      </div>
      {uploadedName && (
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-800/60 border border-slate-700 rounded-lg px-2.5 py-1.5 mb-3">
          <FileText size={12} />
          Uploaded &ldquo;{uploadedName}&rdquo; — demo mode uses the preset panels above for structured analysis.
        </div>
      )}

      <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
        {result.rows.map((row) => {
          const scaleMax = Math.max(row.genericRange[1], row.secondaryRange[1], row.value) * 1.25
          const statusColor = row.status === 'normal' ? '#10B981' : row.status === 'high' ? '#F43F5E' : '#F59E0B'
          return (
            <div key={row.key} className="border border-slate-800 rounded-xl p-2.5 bg-slate-800/30">
              <div className="flex items-center justify-between mb-1.5">
                <MedTooltip term={`${row.label} — ${row.isPhaseVariant ? `phase-adjusted reference applied for ${phase} phase.` : 'compared against a functional/optimal threshold, not just the permissive lab-normal range.'}`}>
                  <span className="text-xs font-semibold text-slate-200">{row.label}</span>
                </MedTooltip>
                <span className="text-xs font-mono" style={{ color: statusColor }}>
                  {row.value} {row.unit}
                </span>
              </div>
              <div className="space-y-1.5">
                <RangeBar label="Generic Lab Normal Range" range={row.genericRange} value={row.value} scaleMax={scaleMax} accent="#64748b" />
                <RangeBar
                  label={row.secondaryLabel}
                  range={row.secondaryRange}
                  value={row.value}
                  scaleMax={scaleMax}
                  accent={row.status === 'normal' ? '#10B981' : '#F43F5E'}
                />
              </div>
            </div>
          )
        })}
        {result.rows.length === 0 && <p className="text-xs text-slate-500 text-center py-4">Select a demo panel to see phase-adjusted analysis.</p>}
      </div>

      {result.flags.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
          <p className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Clinical Flags · Day {day}</p>
          {result.flags.map((flag) => {
            const style = SEVERITY_STYLES[flag.severity]
            const Icon = style.icon
            return (
              <div key={flag.id} className={`rounded-lg border ${style.border} ${style.bg} p-2.5`}>
                <div className={`flex items-center gap-1.5 text-xs font-semibold ${style.color}`}>
                  <Icon size={13} />
                  {flag.title}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">{flag.detail}</p>
                <p className="text-[10px] text-slate-500 mt-1 italic">{flag.guideline}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
