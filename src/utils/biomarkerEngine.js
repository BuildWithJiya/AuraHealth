// Phase-adjusted biomarker interpretation engine.
// Reference ranges are illustrative, consensus-informed approximations
// (ACOG / Rotterdam-aligned) for demo purposes — not a diagnostic device.

export const BIOMARKER_DEFS = {
  lh: {
    label: 'LH (Luteinizing Hormone)',
    unit: 'mIU/mL',
    panel: 'pcos',
    generic: [1.9, 12.5],
    phase: { Menstrual: [2.4, 12.6], Follicular: [2.4, 12.6], Ovulatory: [14, 96], Luteal: [1, 11.4] },
  },
  fsh: {
    label: 'FSH (Follicle-Stimulating Hormone)',
    unit: 'mIU/mL',
    panel: 'pcos',
    generic: [3.5, 12.5],
    phase: { Menstrual: [3.5, 12.5], Follicular: [3.5, 12.5], Ovulatory: [4.7, 21.5], Luteal: [1.7, 7.7] },
  },
  estradiol: {
    label: 'Estradiol (E2)',
    unit: 'pg/mL',
    panel: 'pcos',
    generic: [19, 357],
    phase: { Menstrual: [19, 144], Follicular: [19, 144], Ovulatory: [64, 357], Luteal: [56, 214] },
  },
  progesterone: {
    label: 'Progesterone',
    unit: 'ng/mL',
    panel: 'pcos',
    generic: [0.1, 21.5],
    phase: { Menstrual: [0.1, 0.3], Follicular: [0.1, 0.3], Ovulatory: [0.3, 1.5], Luteal: [2.6, 21.5] },
  },
  testosterone: {
    label: 'Total Testosterone',
    unit: 'ng/dL',
    panel: 'pcos',
    generic: [8, 60],
  },
  amh: {
    label: 'AMH (Anti-Müllerian Hormone)',
    unit: 'ng/mL',
    panel: 'pcos',
    generic: [1.0, 4.5],
  },
  ferritin: {
    label: 'Serum Ferritin',
    unit: 'ng/mL',
    panel: 'thyroid',
    generic: [10, 200],
    optimal: [30, 150],
    optimalMin: 30,
  },
  hemoglobin: {
    label: 'Hemoglobin',
    unit: 'g/dL',
    panel: 'thyroid',
    generic: [12.0, 15.5],
  },
  tsh: {
    label: 'TSH',
    unit: 'µIU/mL',
    panel: 'thyroid',
    generic: [0.4, 4.0],
    optimal: [0.4, 2.5],
  },
  freeT3: {
    label: 'Free T3',
    unit: 'pg/mL',
    panel: 'thyroid',
    generic: [2.0, 4.4],
  },
  freeT4: {
    label: 'Free T4',
    unit: 'ng/dL',
    panel: 'thyroid',
    generic: [0.8, 1.8],
  },
  vitaminB12: {
    label: 'Vitamin B12',
    unit: 'pg/mL',
    panel: 'thyroid',
    generic: [200, 900],
    optimal: [400, 900],
  },
  vitaminD: {
    label: 'Vitamin D (25-OH)',
    unit: 'ng/mL',
    panel: 'thyroid',
    generic: [30, 100],
  },
}

// Returns { range, label } for the secondary comparison bar, or null when a
// biomarker has neither real phase variance nor a distinct functional/optimal
// threshold — in that case a single reference bar is sufficient.
export function getPhaseAdjustedRange(key, phase) {
  const def = BIOMARKER_DEFS[key]
  if (!def) return null
  if (def.phase && def.phase[phase]) {
    return { range: def.phase[phase], label: `Phase-Adjusted Range (${phase})` }
  }
  if (def.optimal) {
    return { range: def.optimal, label: 'Optimal / Functional Range' }
  }
  return null
}

function statusFor(value, [low, high]) {
  if (value < low) return 'low'
  if (value > high) return 'high'
  return 'normal'
}

export function evaluateLabPanel(values, phase, day) {
  const rows = []
  const flags = []

  Object.entries(values).forEach(([key, value]) => {
    const def = BIOMARKER_DEFS[key]
    if (!def || value === undefined || value === null || value === '') return
    const secondary = getPhaseAdjustedRange(key, phase)
    const comparisonRange = secondary ? secondary.range : def.generic
    const status = statusFor(value, comparisonRange)
    rows.push({
      key,
      label: def.label,
      unit: def.unit,
      value,
      genericRange: def.generic,
      secondaryRange: secondary ? secondary.range : def.generic,
      secondaryLabel: secondary ? secondary.label : 'Standard Lab Reference Range',
      status,
      isPhaseVariant: !!def.phase,
    })
  })

  // Rule 1: LH:FSH ratio — Rotterdam-aligned PCOS indicator
  if (values.lh != null && values.fsh != null && values.fsh > 0) {
    const ratio = values.lh / values.fsh
    if (ratio > 2.0) {
      flags.push({
        id: 'lh-fsh-ratio',
        severity: 'critical',
        title: `Elevated LH:FSH Ratio (${ratio.toFixed(2)} : 1)`,
        detail: `LH (${values.lh} mIU/mL) to FSH (${values.fsh} mIU/mL) ratio exceeds 2.0, a classic Rotterdam-criteria-adjacent indicator associated with PCOS (reduced FSH-driven follicle selection, elevated LH pulsatility).`,
        guideline: 'Rotterdam Consensus (2003), ESHRE/ASRM-endorsed',
      })
    }
  }

  // Rule 2: Latent iron deficiency — ferritin low even with normal Hb
  if (values.ferritin != null) {
    if (values.ferritin < BIOMARKER_DEFS.ferritin.optimalMin) {
      const hbNormal = values.hemoglobin != null && values.hemoglobin >= BIOMARKER_DEFS.hemoglobin.generic[0]
      flags.push({
        id: 'latent-iron',
        severity: hbNormal ? 'warning' : 'critical',
        title: `Latent Iron Deficiency (Ferritin ${values.ferritin} ng/mL)`,
        detail: hbNormal
          ? `Ferritin is below the 30 ng/mL functional-depletion threshold while Hemoglobin (${values.hemoglobin} g/dL) still reads "normal." This masks early iron-deficiency — Hb is a late-stage marker; ferritin depletes first.`
          : `Ferritin (${values.ferritin} ng/mL) is below the functional threshold of 30 ng/mL, consistent with iron-deficiency anemia.`,
        guideline: 'WHO / ACOG iron deficiency screening guidance',
      })
    }
  }
  if (values.hemoglobin != null && values.hemoglobin < BIOMARKER_DEFS.hemoglobin.generic[0]) {
    flags.push({
      id: 'low-hb',
      severity: 'critical',
      title: `Anemia Range Hemoglobin (${values.hemoglobin} g/dL)`,
      detail: `Hemoglobin is below the generic female reference floor of ${BIOMARKER_DEFS.hemoglobin.generic[0]} g/dL.`,
      guideline: 'WHO anemia thresholds',
    })
  }

  // Rule 3: Thyroid
  if (values.tsh != null) {
    if (values.tsh > 4.0 && values.tsh <= 10.0) {
      flags.push({
        id: 'subclinical-hypothyroid',
        severity: 'warning',
        title: `Subclinical Hypothyroid Range TSH (${values.tsh} µIU/mL)`,
        detail: `TSH is above the 4.0 µIU/mL upper reference but below 10 — the subclinical hypothyroid band. Often asymptomatic-appearing but linked to cycle irregularity, fatigue, and fertility impact.`,
        guideline: 'ATA subclinical hypothyroidism criteria',
      })
    } else if (values.tsh > 10.0) {
      flags.push({
        id: 'overt-hypothyroid',
        severity: 'critical',
        title: `Overt Hypothyroid Range TSH (${values.tsh} µIU/mL)`,
        detail: `TSH exceeds 10 µIU/mL, consistent with overt primary hypothyroidism.`,
        guideline: 'ATA hypothyroidism criteria',
      })
    }
  }

  // Rule 4: Mid-luteal progesterone / anovulation check
  if (values.progesterone != null) {
    const inLutealWindow = phase === 'Luteal'
    if (inLutealWindow && values.progesterone < 3) {
      flags.push({
        id: 'anovulatory-cycle',
        severity: 'critical',
        title: `Low Mid-Luteal Progesterone (${values.progesterone} ng/mL) — Possible Anovulation`,
        detail: `Day ${day} falls within the luteal phase, where progesterone should typically exceed 3 ng/mL if ovulation occurred. A value this low suggests an anovulatory cycle or corpus luteum insufficiency.`,
        guideline: 'ACOG ovulatory dysfunction evaluation',
      })
    }
  }

  // Supporting: elevated AMH pattern
  if (values.amh != null && values.amh > 4.5) {
    flags.push({
      id: 'elevated-amh',
      severity: 'info',
      title: `Elevated AMH (${values.amh} ng/mL)`,
      detail: `AMH above 4.5 ng/mL reflects a high antral follicle count — a supportive (non-diagnostic) marker frequently elevated in PCOS phenotypes.`,
      guideline: 'Rotterdam Consensus supportive marker',
    })
  }

  // Supporting: elevated testosterone
  if (values.testosterone != null && values.testosterone > BIOMARKER_DEFS.testosterone.generic[1]) {
    flags.push({
      id: 'elevated-testosterone',
      severity: 'warning',
      title: `Elevated Total Testosterone (${values.testosterone} ng/dL)`,
      detail: `Total testosterone above ${BIOMARKER_DEFS.testosterone.generic[1]} ng/dL supports a biochemical hyperandrogenism component (Rotterdam criterion 2 of 3).`,
      guideline: 'Rotterdam Consensus (2003)',
    })
  }

  // Vitamin D
  if (values.vitaminD != null && values.vitaminD < 30) {
    flags.push({
      id: 'vitamin-d',
      severity: values.vitaminD < 20 ? 'warning' : 'info',
      title: `${values.vitaminD < 20 ? 'Deficient' : 'Insufficient'} Vitamin D (${values.vitaminD} ng/mL)`,
      detail: `Vitamin D below 30 ng/mL is common in fatigue-presenting patients and can compound menstrual and mood symptoms.`,
      guideline: 'Endocrine Society Vitamin D guideline',
    })
  }

  return { rows, flags }
}
