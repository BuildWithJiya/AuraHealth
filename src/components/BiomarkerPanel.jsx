import { useRef, useState } from 'react'
import { FlaskConical, Upload, AlertTriangle, Info, AlertOctagon, FileText, CheckCircle2 } from 'lucide-react'
import { LAB_PRESETS } from '../data/labPresets'
import MedTooltip from './MedTooltip'

const SEVERITY_STYLES = {
  critical: { icon: AlertOctagon, color: 'text-[#D96B85]', bg: 'bg-[#FCE7E8]/80', border: 'border-[#D96B85]/35' },
  warning: { icon: AlertTriangle, color: 'text-[#D9A84E]', bg: 'bg-[#FDF8EE]', border: 'border-[#D9A84E]/35' },
  info: { icon: Info, color: 'text-[#405A43]', bg: 'bg-[#E8EFE3]', border: 'border-[#405A43]/30' },
}

function RangeBar({ label, range, value, scaleMax, accent }) {
  const [low, high] = range
  const pct = (n) => Math.min(Math.max((n / scaleMax) * 100, 0), 100)
  return (
    <div>
      <div className="flex justify-between text-[10px] text-[#7A726D] mb-0.5">
        <span>{label}</span>
        <span>
          {low}–{high}
        </span>
      </div>
      <div className="relative h-2.5 bg-[#F8F0E8] rounded-full border border-[#E8DFD8]">
        <div
          className="absolute h-full rounded-full"
          style={{ left: `${pct(low)}%`, width: `${pct(high) - pct(low)}%`, backgroundColor: accent, opacity: 0.45 }}
        />
        <div
          className="absolute top-[-2px] h-[10px] w-[3px] rounded-full bg-[#6A3D55] shadow"
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
      <h3 className="text-sm font-semibold text-[#6A3D55] flex items-center gap-1.5 mb-3">
        <FlaskConical size={14} className="text-[#405A43]" />
        Phase-Adjusted Biomarker Interpreter
      </h3>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        {Object.values(LAB_PRESETS).map((preset) => (
          <button
            key={preset.id}
            onClick={() => onApplyPreset(preset.id)}
            className={`text-xs font-semibold rounded-full px-3 py-1.5 border transition-all shadow-2xs ${
              presetKey === preset.id
                ? 'bg-[#405A43] border-[#405A43] text-white shadow-xs'
                : 'bg-white border-[#E8DFD8] text-[#5C5552] hover:bg-[#FCE7E8]/50 hover:text-[#6A3D55]'
            }`}
          >
            {preset.name}
          </button>
        ))}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 text-xs font-semibold rounded-full px-3 py-1.5 border border-dashed border-[#D96B85]/40 text-[#D96B85] hover:bg-[#FCE7E8]/30 transition-colors"
        >
          <Upload size={12} /> Upload Lab PDF
        </button>
        <input ref={fileInputRef} type="file" accept=".pdf,.png,.jpg,.jpeg" className="hidden" onChange={handleFile} />
      </div>
      {uploadedName && (
        <div className="flex items-center gap-1.5 text-[11px] text-[#405A43] bg-[#E8EFE3] border border-[#405A43]/20 rounded-xl px-2.5 py-1.5 mb-3">
          <FileText size={12} className="text-[#D96B85]" />
          Uploaded &ldquo;{uploadedName}&rdquo; &mdash; demo mode uses the preset panels above for structured analysis.
        </div>
      )}

      <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
        {result.rows.map((row) => {
          const scaleMax = Math.max(row.genericRange[1], row.secondaryRange[1], row.value) * 1.25
          const statusColor = row.status === 'normal' ? '#405A43' : row.status === 'high' ? '#D96B85' : '#D9A84E'
          return (
            <div key={row.key} className="border border-white/80 rounded-xl p-2.5 bg-white/60 backdrop-blur-md shadow-2xs">
              <div className="flex items-center justify-between mb-1.5">
                <MedTooltip term={`${row.label} — ${row.isPhaseVariant ? `phase-adjusted reference applied for ${phase} phase.` : 'compared against a functional/optimal threshold, not just the permissive lab-normal range.'}`}>
                  <span className="text-xs font-semibold text-[#2E2825]">{row.label}</span>
                </MedTooltip>
                <span className="text-xs font-bold font-mono" style={{ color: statusColor }}>
                  {row.value} {row.unit}
                </span>
              </div>
              <div className="space-y-1.5">
                <RangeBar label="Generic Lab Normal Range" range={row.genericRange} value={row.value} scaleMax={scaleMax} accent="#938A84" />
                <RangeBar
                  label={row.secondaryLabel}
                  range={row.secondaryRange}
                  value={row.value}
                  scaleMax={scaleMax}
                  accent={row.status === 'normal' ? '#405A43' : row.status === 'high' ? '#D96B85' : '#D9A84E'}
                />
              </div>
            </div>
          )
        })}
        {result.rows.length === 0 && <p className="text-xs text-[#938A84] text-center py-4">Select a demo panel to see phase-adjusted analysis.</p>}
      </div>

      {result.flags.length > 0 && (
        <div className="mt-3 pt-3 border-t border-[#E8DFD8] space-y-2">
          <p className="text-[11px] uppercase tracking-wide text-[#6A3D55] font-bold flex items-center gap-1.5">
            <CheckCircle2 size={12} className="text-[#405A43]" />
            Clinical Flags &middot; Day {day}
          </p>
          {result.flags.map((flag) => {
            const style = SEVERITY_STYLES[flag.severity]
            const Icon = style.icon
            return (
              <div key={flag.id} className={`rounded-xl border ${style.border} ${style.bg} backdrop-blur-sm p-2.5 shadow-2xs`}>
                <div className={`flex items-center gap-1.5 text-xs font-bold ${style.color}`}>
                  <Icon size={13} />
                  {flag.title}
                </div>
                <p className="text-[11px] text-[#3E3834] mt-1 leading-relaxed">{flag.detail}</p>
                <p className="text-[10px] text-[#7A726D] mt-1 italic">{flag.guideline}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
