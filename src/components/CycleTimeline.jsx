import { ChevronLeft, ChevronRight, Droplet } from 'lucide-react'
import { getPhaseBoundaries, getCyclePhase, getPhaseSubLabel, PHASE_META } from '../utils/cycleEngine'
import MedTooltip from './MedTooltip'

export default function CycleTimeline({ day, cycleLength, onDayChange }) {
  const boundaries = getPhaseBoundaries(cycleLength)
  const phase = getCyclePhase(day, cycleLength)
  const subLabel = getPhaseSubLabel(day, cycleLength)

  const segments = [
    { key: 'Menstrual', range: boundaries.menstrual },
    { key: 'Follicular', range: boundaries.follicular },
    { key: 'Ovulatory', range: boundaries.ovulatory },
    { key: 'Luteal', range: boundaries.luteal },
  ]

  const markerPct = ((day - 1) / (cycleLength - 1)) * 100

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
          <Droplet size={14} className="text-rose-400" />
          Cycle Phase Engine
        </h3>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onDayChange(Math.max(1, day - 1))}
            className="h-7 w-7 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300"
            aria-label="Previous day"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={() => onDayChange(Math.min(cycleLength, day + 1))}
            className="h-7 w-7 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300"
            aria-label="Next day"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="relative h-8 rounded-full overflow-hidden flex border border-slate-800">
        {segments.map((seg) => {
          const width = ((seg.range[1] - seg.range[0] + 1) / cycleLength) * 100
          return (
            <MedTooltip key={seg.key} term={PHASE_META[seg.key].description}>
              <div
                className="h-full flex items-center justify-center text-[10px] font-semibold text-white/90 cursor-help"
                style={{ width: `${width}%`, backgroundColor: PHASE_META[seg.key].color, opacity: seg.key === phase ? 1 : 0.45 }}
              >
                {width > 10 ? seg.key : ''}
              </div>
            </MedTooltip>
          )
        })}
        <div
          className="absolute top-[-4px] h-[40px] w-[3px] bg-white rounded-full shadow-lg"
          style={{ left: `calc(${markerPct}% - 1.5px)` }}
        />
      </div>

      <input
        type="range"
        min={1}
        max={cycleLength}
        value={day}
        onChange={(e) => onDayChange(Number(e.target.value))}
        className="w-full mt-3 accent-rose-500"
      />

      <div className="mt-2 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-white">
            Day {day}: <span style={{ color: PHASE_META[phase].color }}>{phase} Phase</span>
          </p>
          <p className="text-xs text-slate-400 mt-0.5">{subLabel}</p>
        </div>
        <span className="text-[11px] text-slate-500 font-mono">{cycleLength}-day cycle</span>
      </div>
    </div>
  )
}
