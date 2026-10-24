import { useMemo } from 'react'

const PARTICLE_COLORS = [
  { bg: '#FDA4AF', glow: 'rgba(244, 63, 94, 0.55)' }, // blush rose
  { bg: '#A5B4FC', glow: 'rgba(99, 102, 241, 0.55)' }, // soft lavender
  { bg: '#6EE7B7', glow: 'rgba(16, 185, 129, 0.5)' }, // gentle mint
  { bg: '#FCD9A6', glow: 'rgba(253, 186, 116, 0.5)' }, // warm peach
]

function seededRandom(seed) {
  const x = Math.sin(seed * 9999) * 10000
  return x - Math.floor(x)
}

function buildParticles(count) {
  return Array.from({ length: count }, (_, i) => {
    const r1 = seededRandom(i + 1)
    const r2 = seededRandom(i + 41)
    const r3 = seededRandom(i + 97)
    const r4 = seededRandom(i + 153)
    const color = PARTICLE_COLORS[i % PARTICLE_COLORS.length]
    const size = 3 + r1 * 7
    return {
      id: i,
      left: `${r2 * 100}%`,
      size,
      duration: 22 + r3 * 26,
      delay: -1 * r4 * 40,
      drift: `${(r1 - 0.5) * 60}px`,
      color,
    }
  })
}

/**
 * Purely decorative, self-contained ambient background: slow drifting
 * colour-matched gradient "aura" blobs plus gently floating glow particles.
 * Fixed behind all content (z-0) and hidden from print/assistive tech.
 */
export default function AuraBackground() {
  const particles = useMemo(() => buildParticles(28), [])

  return (
    <div id="aura-bg" aria-hidden="true" className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="aura-blob aura-blob-1" />
      <div className="aura-blob aura-blob-2" />
      <div className="aura-blob aura-blob-3" />
      <div className="aura-blob aura-blob-4" />

      {particles.map((p) => (
        <span
          key={p.id}
          className="aura-particle"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            backgroundColor: p.color.bg,
            boxShadow: `0 0 ${p.size * 2.5}px ${p.color.glow}`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            '--drift': p.drift,
          }}
        />
      ))}

      <div className="aura-vignette" />
    </div>
  )
}
