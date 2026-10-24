import { ListChecks, MapPin, Clock, Activity, Tag, Droplet } from 'lucide-react'
import { severityTier } from '../utils/symptomParser'
import { PHASE_META } from '../utils/cycleEngine'

export default function SymptomTimeline({ symptomLog }) {
  const sorted = [...symptomLog].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

  return (
    <div className="ios-glass-card rounded-2xl p-4 flex flex-col min-h-0">
      <h3 className="text-sm font-semibold text-[#6A3D55] flex items-center gap-1.5 mb-3">
        <ListChecks size={14} className="text-[#D96B85]" />
        Symptom Log Timeline
        <span className="ml-auto text-[11px] font-semibold text-[#405A43] bg-[#E8EFE3] px-2.5 py-0.5 rounded-full border border-[#405A43]/20 flex items-center gap-1">
          <Activity size={10} className="text-[#405A43]" />
          {symptomLog.length} entries
        </span>
      </h3>

      <div className="space-y-2 overflow-y-auto pr-1 max-h-[420px]">
        {sorted.map((entry) => {
          const tier = severityTier(entry.severity)
          return (
            <div
              key={entry.id}
              className="border border-white/80 bg-white/65 backdrop-blur-md rounded-xl p-2.5 hover:bg-white/85 hover:border-[#D96B85]/40 transition-all shadow-2xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs text-[#2E2825] font-semibold">
                  <MapPin size={12} className="text-[#D96B85] shrink-0" />
                  {entry.location}
                </div>
                <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border ${tier.color} bg-white shadow-2xs`}>
                  {entry.severity}/10
                </span>
              </div>
              <p className="text-[11px] text-[#7A726D] mt-1 line-clamp-2 italic font-serif">&ldquo;{entry.rawText}&rdquo;</p>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {entry.modifiers.map((m) => (
                  <span key={m} className="bg-[#F8F0E8] text-[#6A3D55] border border-[#E8DFD8] text-[10px] rounded-full px-2 py-0.5 font-medium flex items-center gap-1">
                    <Tag size={9} className="text-[#D9A84E]" />
                    {m}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#F8F0E8] text-[10px] text-[#7A726D]">
                <span className="flex items-center gap-1">
                  <Clock size={10} className="text-[#938A84]" />
                  Day {entry.day}
                </span>
                <span className="font-semibold flex items-center gap-1" style={{ color: PHASE_META[entry.phase]?.color || '#405A43' }}>
                  <Droplet size={10} />
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
