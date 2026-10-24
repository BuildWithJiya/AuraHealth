import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'
import { TrendingUp, Activity } from 'lucide-react'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="font-semibold text-slate-200 mb-1">Day {label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  )
}

export default function CorrelationDashboard({ data, currentDay, correlation }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
      <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5 mb-3">
        <TrendingUp size={14} className="text-rose-400" />
        Longitudinal Correlation &amp; Pattern Recognition
      </h3>

      {correlation && (
        <div className="mb-3 flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2.5">
          <Activity size={15} className="text-rose-300 shrink-0 mt-0.5" />
          <p className="text-xs text-rose-100">
            <span className="font-bold">{Math.round(Math.abs(correlation.value) * 100)}% {correlation.direction} correlation</span>{' '}
            detected between {correlation.hormoneLabel} trajectory and logged symptom severity.{' '}
            <span className="text-rose-300/90">Diagnostic relevance: {correlation.narrative}</span>
          </p>
        </div>
      )}

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 6, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
            <XAxis dataKey="day" stroke="#64748B" tick={{ fontSize: 11 }} label={{ value: 'Cycle Day', position: 'insideBottom', offset: -2, fontSize: 11, fill: '#64748B' }} />
            <YAxis
              yAxisId="left"
              domain={[0, 10]}
              stroke="#F43F5E"
              tick={{ fontSize: 11 }}
              label={{ value: 'Symptom Severity', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#F43F5E' }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 100]}
              stroke="#6366F1"
              tick={{ fontSize: 11 }}
              label={{ value: 'Hormonal Index (AU)', angle: 90, position: 'insideRight', fontSize: 11, fill: '#6366F1' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Area yAxisId="left" type="monotone" dataKey="severity" name="Symptom Severity" fill="#F43F5E" stroke="#F43F5E" fillOpacity={0.15} strokeWidth={2} isAnimationActive={false} />
            <Line yAxisId="right" type="monotone" dataKey="estrogen" name="Estrogen Index" stroke="#6366F1" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line yAxisId="right" type="monotone" dataKey="progesterone" name="Progesterone Index" stroke="#10B981" strokeWidth={2} dot={false} isAnimationActive={false} />
            <ReferenceLine yAxisId="left" x={currentDay} stroke="#F8FAFC" strokeDasharray="4 4" label={{ value: 'Today', fontSize: 10, fill: '#F8FAFC', position: 'top' }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
