// Phase-aware cycle engine.
// Menstrual length and the ovulatory window are held clinically fixed; the
// follicular/luteal split is scaled around them so irregular (e.g. PCOS)
// cycle lengths still produce a sane phase map.
const MENSTRUAL_LEN = 5
const OVULATORY_LEN = 3
const DEFAULT_FOLLICULAR = 8
const DEFAULT_LUTEAL = 12

export function getPhaseBoundaries(cycleLength) {
  if (cycleLength === 28) {
    return {
      menstrual: [1, 5],
      follicular: [6, 13],
      ovulatory: [14, 16],
      luteal: [17, 28],
    }
  }
  const remaining = Math.max(cycleLength - MENSTRUAL_LEN - OVULATORY_LEN, 6)
  const ratio = DEFAULT_FOLLICULAR / (DEFAULT_FOLLICULAR + DEFAULT_LUTEAL)
  const follicularLen = Math.max(Math.round(remaining * ratio), 3)
  const lutealLen = remaining - follicularLen
  const follicularStart = MENSTRUAL_LEN + 1
  const follicularEnd = follicularStart + follicularLen - 1
  const ovulatoryStart = follicularEnd + 1
  const ovulatoryEnd = ovulatoryStart + OVULATORY_LEN - 1
  const lutealStart = ovulatoryEnd + 1
  return {
    menstrual: [1, MENSTRUAL_LEN],
    follicular: [follicularStart, follicularEnd],
    ovulatory: [ovulatoryStart, ovulatoryEnd],
    luteal: [lutealStart, cycleLength],
    _lutealLen: lutealLen,
  }
}

export const PHASE_META = {
  Menstrual: {
    color: '#D96B85',
    description: 'Uterine lining shedding. Estrogen and progesterone at cycle low.',
  },
  Follicular: {
    color: '#405A43',
    description: 'Follicle maturation. Estrogen rising steadily toward ovulatory peak.',
  },
  Ovulatory: {
    color: '#D9A84E',
    description: 'LH surge triggers ovulation. Peak estrogen, fertile window.',
  },
  Luteal: {
    color: '#6A3D55',
    description: 'Corpus luteum secretes progesterone. Estrogen dips then has a smaller secondary rise.',
  },
}

export function getCyclePhase(day, cycleLength = 28) {
  const b = getPhaseBoundaries(cycleLength)
  if (day >= b.menstrual[0] && day <= b.menstrual[1]) return 'Menstrual'
  if (day >= b.follicular[0] && day <= b.follicular[1]) return 'Follicular'
  if (day >= b.ovulatory[0] && day <= b.ovulatory[1]) return 'Ovulatory'
  return 'Luteal'
}

export function getPhaseSubLabel(day, cycleLength = 28) {
  const phase = getCyclePhase(day, cycleLength)
  const b = getPhaseBoundaries(cycleLength)
  if (phase === 'Luteal') {
    const [start, end] = b.luteal
    const progress = (day - start) / Math.max(end - start, 1)
    if (progress < 0.33) return 'Early Luteal — Progesterone rising'
    if (progress < 0.66) return 'Mid-Luteal — High Progesterone, Estrogen secondary dip'
    return 'Late Luteal — Progesterone & Estrogen withdrawal'
  }
  if (phase === 'Follicular') {
    const [start, end] = b.follicular
    const progress = (day - start) / Math.max(end - start, 1)
    return progress < 0.5 ? 'Early Follicular — Low estrogen, FSH recruiting follicles' : 'Late Follicular — Estrogen climbing toward LH surge'
  }
  if (phase === 'Ovulatory') return 'LH surge — peak fertility window'
  return 'Menstrual flow — prostaglandin-mediated cramping likely'
}

export function describeDayLabel(day, cycleLength = 28) {
  const phase = getCyclePhase(day, cycleLength)
  return `Day ${day}: ${getPhaseSubLabel(day, cycleLength).split(' — ')[0] || phase}`
}

// Generates a synthetic, physiologically-inspired relative hormonal index
// (arbitrary units, 0-100) across the full cycle for charting purposes only.
// This is NOT a substitute for serum lab values.
export function generateHormoneCurve(cycleLength = 28, opts = {}) {
  const { anovulatory = false } = opts
  const b = getPhaseBoundaries(cycleLength)
  const ovulationDay = (b.ovulatory[0] + b.ovulatory[1]) / 2
  const lutealLen = Math.max(cycleLength - ovulationDay, 6)

  const curve = []
  for (let day = 1; day <= cycleLength; day++) {
    let estrogen
    if (day <= ovulationDay) {
      const t = day / ovulationDay
      estrogen = 18 + 72 * Math.pow(t, 1.6)
    } else {
      const t = (day - ovulationDay) / lutealLen
      const secondaryRise = 38 + 28 * Math.sin(Math.PI * Math.min(t * 1.3, 1))
      const lateWithdrawal = t > 0.78 ? (t - 0.78) * 140 : 0
      estrogen = Math.max(secondaryRise - lateWithdrawal, 12)
    }

    let progesterone
    if (day <= ovulationDay) {
      progesterone = 3 + Math.sin(day * 0.4) * 1.2
    } else if (anovulatory) {
      const t = (day - ovulationDay) / lutealLen
      progesterone = 3 + 2.5 * Math.sin(Math.PI * t)
    } else {
      const t = (day - ovulationDay) / lutealLen
      progesterone = 6 + 66 * Math.sin(Math.PI * Math.min(t * 1.05, 1))
    }

    curve.push({
      day,
      estrogen: Math.round(Math.max(estrogen, 10) * 10) / 10,
      progesterone: Math.round(Math.max(progesterone, 1) * 10) / 10,
    })
  }
  return curve
}

export function pearsonCorrelation(x, y) {
  const n = Math.min(x.length, y.length)
  if (n === 0) return 0
  const meanX = x.slice(0, n).reduce((a, b) => a + b, 0) / n
  const meanY = y.slice(0, n).reduce((a, b) => a + b, 0) / n
  let num = 0
  let denX = 0
  let denY = 0
  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX
    const dy = y[i] - meanY
    num += dx * dy
    denX += dx * dx
    denY += dy * dy
  }
  const den = Math.sqrt(denX * denY)
  if (den === 0) return 0
  return num / den
}
