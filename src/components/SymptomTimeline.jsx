import { ListChecks, MapPin, Clock } from 'lucide-react'
import { severityTier } from '../utils/symptomParser'
import { PHASE_META } from '../utils/cycleEngine'

export default function SymptomTimeline({ symptomLog }) {
  const sorted = [...symptomLog].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 flex flex-col min-h-0 shadow-[0_8px_30px_-12px_rgba(99,102,241,0.25)]">
      <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5 mb-3">
        <ListChecks size={14} className="text-indigo-400" />
        Symptom Log Timeline
        <span className="ml-auto text-[11px] font-normal text-slate-500">{symptomLog.length} entries</span>
      </h3>

      <div className="space-y-2 overflow-y-auto pr-1 max-h-[420px]">
        {sorted.map((entry) => {
          const tier = severityTier(entry.severity)
          return (
            <div key={entry.id} className="border border-slate-800 bg-slate-800/40 rounded-xl p-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-200 font-medium">
                  <MapPin size={12} className="text-slate-500 shrink-0" />
                  {entry.location}
                </div>
                <span className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded border ${tier.color}`}>
                  {entry.severity}/10
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 italic">&ldquo;{entry.rawText}&rdquo;</p>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {entry.modifiers.map((m) => (
                  <span key={m} className="bg-slate-700/50 text-slate-300 text-[10px] rounded-full px-1.5 py-0.5">
                    {m}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between mt-1.5 text-[10px] text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock size={10} />
                  Day {entry.day}
                </span>
                <span className="font-semibold" style={{ color: PHASE_META[entry.phase]?.color }}>
                  {entry.phase}
                </span>
              </div>
            </div>
          )
        })}
        {sorted.length === 0 && <p className="text-xs text-slate-500 text-center py-6">No symptoms logged yet.</p>}
      </div>
    </div>
  )
}
