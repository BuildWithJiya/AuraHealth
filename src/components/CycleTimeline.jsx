import { ChevronLeft, ChevronRight, Droplet, Calendar, Sparkles, Sun, Moon } from 'lucide-react'
import { getPhaseBoundaries, getCyclePhase, getPhaseSubLabel, PHASE_META } from '../utils/cycleEngine'
import MedTooltip from './MedTooltip'

const PHASE_ICONS = {
  Menstrual: Droplet,
  Follicular: Sparkles,
  Ovulatory: Sun,
  Luteal: Moon,
}

export default function CycleTimeline({ day, cycleLength, onDayChange }) {
  const boundaries = getPhaseBoundaries(cycleLength)
  const phase = getCyclePhase(day, cycleLength)
  const subLabel = getPhaseSubLabel(day, cycleLength)
  const PhaseIcon = PHASE_ICONS[phase] || Droplet

  const segments = [
    { key: 'Menstrual', range: boundaries.menstrual },
    { key: 'Follicular', range: boundaries.follicular },
    { key: 'Ovulatory', range: boundaries.ovulatory },
    { key: 'Luteal', range: boundaries.luteal },
  ]

  const markerPct = ((day - 1) / (cycleLength - 1)) * 100

  return (
    <div className="ios-glass-card rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[#6A3D55] flex items-center gap-1.5">
          <Droplet size={14} className="text-[#D96B85]" />
          Cycle Phase Engine
        </h3>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onDayChange(Math.max(1, day - 1))}
            className="h-7 w-7 flex items-center justify-center rounded-full bg-white hover:bg-[#FCE7E8] border border-[#E8DFD8] text-[#405A43] shadow-2xs transition-colors"
            aria-label="Previous day"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="text-[11px] font-semibold text-[#6A3D55] px-2 py-0.5 rounded-full bg-[#FCE7E8]/60 border border-[#D96B85]/20 flex items-center gap-1">
            <Calendar size={11} className="text-[#D96B85]" />
            Day {day}
          </span>
          <button
            onClick={() => onDayChange(Math.min(cycleLength, day + 1))}
            className="h-7 w-7 flex items-center justify-center rounded-full bg-white hover:bg-[#FCE7E8] border border-[#E8DFD8] text-[#405A43] shadow-2xs transition-colors"
            aria-label="Next day"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="relative h-8 rounded-full overflow-hidden flex border border-[#E8DFD8] bg-[#F8F0E8] shadow-inner">
        {segments.map((seg) => {
          const width = ((seg.range[1] - seg.range[0] + 1) / cycleLength) * 100
          const SegIcon = PHASE_ICONS[seg.key] || Droplet
          return (
            <MedTooltip key={seg.key} term={PHASE_META[seg.key].description}>
              <div
                className="h-full flex items-center justify-center gap-1 text-[10px] font-semibold text-white cursor-help transition-opacity px-1"
                style={{
                  width: `${width}%`,
                  backgroundColor: PHASE_META[seg.key].color,
                  opacity: seg.key === phase ? 1 : 0.65,
                }}
              >
                {width > 12 && <SegIcon size={11} className="shrink-0" />}
                {width > 16 ? seg.key : ''}
              </div>
            </MedTooltip>
          )
        })}
        <div
          className="absolute top-[-4px] h-[40px] w-[3.5px] bg-[#6A3D55] rounded-full shadow-md"
          style={{ left: `calc(${markerPct}% - 1.75px)` }}
        />
      </div>

      <input
        type="range"
        min={1}
        max={cycleLength}
        value={day}
        onChange={(e) => onDayChange(Number(e.target.value))}
        className="w-full mt-3 accent-[#D96B85] cursor-pointer"
      />

      <div className="mt-2.5 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-[#2E2825] flex items-center gap-1.5">
            <PhaseIcon size={14} style={{ color: PHASE_META[phase].color }} />
            Day {day}: <span style={{ color: PHASE_META[phase].color }}>{phase} Phase</span>
          </p>
          <p className="text-xs text-[#7A726D] mt-0.5">{subLabel}</p>
        </div>
        <span className="text-[11px] text-[#405A43] font-medium bg-[#E8EFE3] px-2 py-0.5 rounded-full border border-[#405A43]/20">
          {cycleLength}-day cycle
        </span>
      </div>
    </div>
  )
}
