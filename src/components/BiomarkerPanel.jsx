import { useRef, useState } from 'react'
import { FlaskConical, Upload, AlertTriangle, Info, AlertOctagon, FileText } from 'lucide-react'
import { LAB_PRESETS } from '../data/labPresets'
import MedTooltip from './MedTooltip'

const SEVERITY_STYLES = {
  critical: { icon: AlertOctagon, color: 'text-[#C97A72]', bg: 'bg-[#FDF2F0]', border: 'border-[#C97A72]/30' },
  warning: { icon: AlertTriangle, color: 'text-[#C88D58]', bg: 'bg-[#FDF7EE]', border: 'border-[#D4A373]/35' },
  info: { icon: Info, color: 'text-[#526E5B]', bg: 'bg-[#EEF4EC]', border: 'border-[#526E5B]/30' },
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
      <div className="relative h-2.5 bg-[#EAE2D9] rounded-full">
        <div
          className="absolute h-full rounded-full"
          style={{ left: `${pct(low)}%`, width: `${pct(high) - pct(low)}%`, backgroundColor: accent, opacity: 0.4 }}
        />
        <div
          className="absolute top-[-2px] h-[10px] w-[3px] rounded-full bg-[#2E2825] shadow"
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
      <h3 className="text-sm font-semibold text-[#2E2825] flex items-center gap-1.5 mb-3">
        <FlaskConical size={14} className="text-[#526E5B]" />
        Phase-Adjusted Biomarker Interpreter
      </h3>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        {Object.values(LAB_PRESETS).map((preset) => (
          <button
            key={preset.id}
            onClick={() => onApplyPreset(preset.id)}
            className={`text-xs font-semibold rounded-full px-3 py-1.5 border transition-all shadow-2xs ${
              presetKey === preset.id
                ? 'bg-[#526E5B] border-[#526E5B] text-white shadow-xs'
                : 'bg-white border-[#E2DAD1] text-[#5C5552] hover:bg-[#FDF2F0]'
            }`}
          >
            {preset.name}
          </button>
        ))}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 text-xs font-semibold rounded-full px-3 py-1.5 border border-dashed border-[#C97A72]/40 text-[#7A726D] hover:text-[#2E2825] hover:border-[#C97A72] transition-colors"
        >
          <Upload size={12} /> Upload Lab PDF
        </button>
        <input ref={fileInputRef} type="file" accept=".pdf,.png,.jpg,.jpeg" className="hidden" onChange={handleFile} />
      </div>
      {uploadedName && (
        <div className="flex items-center gap-1.5 text-[11px] text-[#5C5552] bg-[#FAF7F2] border border-[#E2DAD1] rounded-xl px-2.5 py-1.5 mb-3">
          <FileText size={12} className="text-[#C97A72]" />
          Uploaded &ldquo;{uploadedName}&rdquo; &mdash; demo mode uses the preset panels above for structured analysis.
        </div>
      )}

      <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
        {result.rows.map((row) => {
          const scaleMax = Math.max(row.genericRange[1], row.secondaryRange[1], row.value) * 1.25
          const statusColor = row.status === 'normal' ? '#526E5B' : row.status === 'high' ? '#C97A72' : '#C88D58'
          return (
            <div key={row.key} className="border border-[#E8DFD8] rounded-xl p-2.5 bg-white/70 shadow-2xs">
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
                  accent={row.status === 'normal' ? '#526E5B' : '#C97A72'}
                />
              </div>
            </div>
          )
        })}
        {result.rows.length === 0 && <p className="text-xs text-[#938A84] text-center py-4">Select a demo panel to see phase-adjusted analysis.</p>}
      </div>

      {result.flags.length > 0 && (
        <div className="mt-3 pt-3 border-t border-[#E8DFD8] space-y-2">
          <p className="text-[11px] uppercase tracking-wide text-[#7A726D] font-bold">Clinical Flags &middot; Day {day}</p>
          {result.flags.map((flag) => {
            const style = SEVERITY_STYLES[flag.severity]
            const Icon = style.icon
            return (
              <div key={flag.id} className={`rounded-xl border ${style.border} ${style.bg} p-2.5 shadow-2xs`}>
                <div className={`flex items-center gap-1.5 text-xs font-bold ${style.color}`}>
                  <Icon size={13} />
                  {flag.title}
                </div>
                <p className="text-[11px] text-[#5C5552] mt-1 leading-relaxed">{flag.detail}</p>
                <p className="text-[10px] text-[#7A726D] mt-1 italic">{flag.guideline}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
