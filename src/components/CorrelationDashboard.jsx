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
    <div className="bg-white/85 backdrop-blur-md border border-white/80 rounded-xl px-3 py-2 text-xs shadow-lg">
      <p className="font-bold text-[#2E2825] mb-1">Day {label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-medium">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  )
}

export default function CorrelationDashboard({ data, currentDay, correlation }) {
  return (
    <div className="ios-glass-card rounded-2xl p-4">
      <h3 className="text-sm font-semibold text-[#6A3D55] flex items-center gap-1.5 mb-3">
        <TrendingUp size={14} className="text-[#D96B85]" />
        Longitudinal Correlation &amp; Pattern Recognition
      </h3>

      {correlation && (
        <div className="mb-3 flex items-start gap-2.5 rounded-xl border border-white/80 bg-[#FCE7E8]/75 backdrop-blur-md px-3.5 py-2.5 shadow-2xs">
          <Activity size={15} className="text-[#D96B85] shrink-0 mt-0.5" />
          <p className="text-xs text-[#2E2825] leading-relaxed">
            <span className="font-bold text-[#6A3D55]">
              {Math.round(Math.abs(correlation.value) * 100)}% {correlation.direction} correlation
            </span>{' '}
            detected between {correlation.hormoneLabel} trajectory and logged symptom severity.{' '}
            <span className="text-[#7A726D]">Diagnostic relevance: {correlation.narrative}</span>
          </p>
        </div>
      )}

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 6, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3EAD3" />
            <XAxis
              dataKey="day"
              stroke="#7A726D"
              tick={{ fontSize: 11, fill: '#7A726D' }}
              label={{ value: 'Cycle Day', position: 'insideBottom', offset: -2, fontSize: 11, fill: '#7A726D' }}
            />
            <YAxis
              yAxisId="left"
              domain={[0, 10]}
              stroke="#D96B85"
              tick={{ fontSize: 11, fill: '#D96B85' }}
              label={{ value: 'Symptom Severity', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#D96B85' }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 100]}
              stroke="#405A43"
              tick={{ fontSize: 11, fill: '#405A43' }}
              label={{ value: 'Hormonal Index (AU)', angle: 90, position: 'insideRight', fontSize: 11, fill: '#405A43' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="severity"
              name="Symptom Severity"
              fill="#D96B85"
              stroke="#D96B85"
              fillOpacity={0.16}
              strokeWidth={2}
              isAnimationActive={false}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="estrogen"
              name="Estrogen Index"
              stroke="#405A43"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="progesterone"
              name="Progesterone Index"
              stroke="#D9A84E"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            <ReferenceLine
              yAxisId="left"
              x={currentDay}
              stroke="#6A3D55"
              strokeDasharray="4 4"
              label={{ value: 'Today', fontSize: 10, fill: '#6A3D55', position: 'top' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
