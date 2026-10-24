import { ListChecks, MapPin, Clock } from 'lucide-react'
import { severityTier } from '../utils/symptomParser'
import { PHASE_META } from '../utils/cycleEngine'

export default function SymptomTimeline({ symptomLog }) {
  const sorted = [...symptomLog].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

  return (
    <div className="ios-glass-card rounded-2xl p-4 flex flex-col min-h-0">
      <h3 className="text-sm font-semibold text-[#2E2825] flex items-center gap-1.5 mb-3">
        <ListChecks size={14} className="text-[#C97A72]" />
        Symptom Log Timeline
        <span className="ml-auto text-[11px] font-medium text-[#7A726D] bg-[#F7F2EC] px-2 py-0.5 rounded-full border border-[#E2DAD1]">
          {symptomLog.length} entries
        </span>
      </h3>

      <div className="space-y-2 overflow-y-auto pr-1 max-h-[420px]">
        {sorted.map((entry) => {
          const tier = severityTier(entry.severity)
          return (
            <div
              key={entry.id}
              className="border border-[#E8DFD8] bg-white/80 rounded-xl p-2.5 hover:bg-white hover:border-[#C97A72]/30 transition-all shadow-2xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs text-[#2E2825] font-semibold">
                  <MapPin size={12} className="text-[#C97A72] shrink-0" />
                  {entry.location}
                </div>
                <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border ${tier.color} bg-white shadow-2xs`}>
                  {entry.severity}/10
                </span>
              </div>
              <p className="text-[11px] text-[#7A726D] mt-1 line-clamp-2 italic font-serif">&ldquo;{entry.rawText}&rdquo;</p>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {entry.modifiers.map((m) => (
                  <span key={m} className="bg-[#FAF7F2] text-[#5C5552] border border-[#E8DFD8] text-[10px] rounded-full px-2 py-0.5 font-medium">
                    {m}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#F2ECE6] text-[10px] text-[#938A84]">
                <span className="flex items-center gap-1">
                  <Clock size={10} />
                  Day {entry.day}
                </span>
                <span className="font-semibold" style={{ color: PHASE_META[entry.phase]?.color || '#526E5B' }}>
                  {entry.phase} Phase
                </span>
              </div>
            </div>
          )
        })}
        {sorted.length === 0 && <p className="text-xs text-[#938A84] text-center py-6">No symptoms logged yet.</p>}
      </div>
    </div>
  )
}
