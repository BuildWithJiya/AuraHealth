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
    <div className="ios-glass-card rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[#2E2825] flex items-center gap-1.5">
          <Droplet size={14} className="text-[#C97A72]" />
          Cycle Phase Engine
        </h3>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onDayChange(Math.max(1, day - 1))}
            className="h-7 w-7 flex items-center justify-center rounded-full bg-white hover:bg-[#FDF2F0] border border-[#E2DAD1] text-[#5C5552] shadow-2xs transition-colors"
            aria-label="Previous day"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={() => onDayChange(Math.min(cycleLength, day + 1))}
            className="h-7 w-7 flex items-center justify-center rounded-full bg-white hover:bg-[#FDF2F0] border border-[#E2DAD1] text-[#5C5552] shadow-2xs transition-colors"
            aria-label="Next day"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="relative h-8 rounded-full overflow-hidden flex border border-[#E2DAD1] bg-[#F7F2EC] shadow-inner">
        {segments.map((seg) => {
          const width = ((seg.range[1] - seg.range[0] + 1) / cycleLength) * 100
          return (
            <MedTooltip key={seg.key} term={PHASE_META[seg.key].description}>
              <div
                className="h-full flex items-center justify-center text-[10px] font-semibold text-white cursor-help transition-opacity"
                style={{
                  width: `${width}%`,
                  backgroundColor: PHASE_META[seg.key].color,
                  opacity: seg.key === phase ? 1 : 0.5,
                }}
              >
                {width > 10 ? seg.key : ''}
              </div>
            </MedTooltip>
          )
        })}
        <div
          className="absolute top-[-4px] h-[40px] w-[3.5px] bg-[#2E2825] rounded-full shadow-md"
          style={{ left: `calc(${markerPct}% - 1.75px)` }}
        />
      </div>

      <input
        type="range"
        min={1}
        max={cycleLength}
        value={day}
        onChange={(e) => onDayChange(Number(e.target.value))}
        className="w-full mt-3 accent-[#C97A72] cursor-pointer"
      />

      <div className="mt-2 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-[#2E2825]">
            Day {day}: <span style={{ color: PHASE_META[phase].color }}>{phase} Phase</span>
          </p>
          <p className="text-xs text-[#7A726D] mt-0.5">{subLabel}</p>
        </div>
        <span className="text-[11px] text-[#938A84] font-mono">{cycleLength}-day cycle</span>
      </div>
    </div>
  )
}
