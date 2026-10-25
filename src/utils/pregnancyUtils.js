/**
 * pregnancyUtils.js
 * Clinical pregnancy calculation utilities using standard obstetrics rules (Naegele's rule).
 */

export function calculateDueDateFromLmp(lmpDateStr) {
  if (!lmpDateStr) return ''
  const lmp = new Date(lmpDateStr)
  if (Number.isNaN(lmp.getTime())) return ''
  // Naegele's rule: LMP + 280 days (40 gestational weeks)
  const edd = new Date(lmp.getTime() + 280 * 86400000)
  return edd.toISOString().slice(0, 10)
}

export function calculateGestationalInfo({ lmp, dueDate }) {
  const now = new Date()
  now.setHours(0, 0, 0, 0)

  let gestDays = 0
  let targetEdd = dueDate || ''
  let targetLmp = lmp || ''

  if (lmp) {
    const lmpDate = new Date(lmp)
    lmpDate.setHours(0, 0, 0, 0)
    if (!Number.isNaN(lmpDate.getTime())) {
      gestDays = Math.max(0, Math.round((now - lmpDate) / 86400000))
      if (!targetEdd) {
        targetEdd = new Date(lmpDate.getTime() + 280 * 86400000).toISOString().slice(0, 10)
      }
    }
  } else if (dueDate) {
    const eddDate = new Date(dueDate)
    eddDate.setHours(0, 0, 0, 0)
    if (!Number.isNaN(eddDate.getTime())) {
      const remainingDays = Math.round((eddDate - now) / 86400000)
      gestDays = Math.max(0, 280 - remainingDays)
      if (!targetLmp) {
        targetLmp = new Date(eddDate.getTime() - 280 * 86400000).toISOString().slice(0, 10)
      }
    }
  }

  const weeks = Math.floor(gestDays / 7)
  const days = gestDays % 7
  let trimester = '1st Trimester'
  if (weeks >= 28) trimester = '3rd Trimester'
  else if (weeks >= 14) trimester = '2nd Trimester'

  const milestones = [
    { maxWeek: 5, size: 'Sesame seed', highlight: 'Neural tube and embryonic disc forming' },
    { maxWeek: 8, size: 'Raspberry', highlight: 'Heartbeat detectable on ultrasound' },
    { maxWeek: 12, size: 'Plum', highlight: 'All essential organs and limbs developed' },
    { maxWeek: 16, size: 'Avocado', highlight: 'Baby can move joints and make facial expressions' },
    { maxWeek: 20, size: 'Banana', highlight: 'Halfway mark! Senses developing, can hear voice' },
    { maxWeek: 24, size: 'Ear of corn', highlight: 'Lungs practicing subtle breathing movements' },
    { maxWeek: 28, size: 'Eggplant', highlight: 'Third trimester begins; eyes open, active sleep' },
    { maxWeek: 32, size: 'Squash', highlight: 'Rapid brain connectivity and fat layer accumulation' },
    { maxWeek: 36, size: 'Papaya', highlight: 'Full term near, lungs preparing for birth' },
    { maxWeek: 42, size: 'Watermelon', highlight: 'Full term milestone! Ready to meet your baby' },
  ]
  const currentMilestone = milestones.find((m) => weeks <= m.maxWeek) || milestones[milestones.length - 1]

  return {
    gestationalDays: gestDays,
    weeks: Math.min(weeks, 42),
    days,
    trimester,
    dueDate: targetEdd,
    lmp: targetLmp,
    size: currentMilestone.size,
    highlight: currentMilestone.highlight,
  }
}
