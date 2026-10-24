const CONDITION_QUESTIONS = {
  'Suspected PCOS': [
    'Given my LH:FSH ratio and irregular cycle length, could we evaluate me against the full Rotterdam criteria (ovulatory dysfunction, hyperandrogenism, and a pelvic ultrasound for polycystic morphology)?',
    'Should we check fasting insulin and a glucose tolerance test to rule out insulin resistance as a driver of my cycle irregularity and weight changes?',
    'If PCOS is confirmed, what are the evidence-based first-line options (lifestyle, metformin, or combined hormonal contraceptives) for my specific phenotype?',
  ],
  'Luteal PMDD': [
    'My mood symptoms are heavily concentrated in the two weeks before my period — could we track this prospectively with a daily rating scale to formally evaluate for PMDD per DSM-5 criteria?',
    'Would an SSRI dosed only during the luteal phase (symptom-onset dosing) be appropriate for me, versus continuous dosing?',
    'Could my luteal symptom pattern also be explained by an underlying mood disorder, and how would we differentiate that from PMDD?',
  ],
  'Suspected Endometriosis': [
    'Given my cyclical pelvic pain that worsens premenstrually, plus pain with bowel movements and intercourse, could we discuss a transvaginal ultrasound or MRI to screen for endometriomas or deep infiltrating disease?',
    'If imaging is inconclusive, what is your threshold for recommending a diagnostic laparoscopy given my symptom severity and duration?',
    'What pain-management and hormonal suppression options (GnRH agonists, progestin therapy) would you consider while we pursue a definitive diagnosis?',
  ],
  'Latent Iron Deficiency': [
    'My ferritin is below 30 ng/mL even though my hemoglobin looks normal — could this still be contributing to my fatigue, and should we start iron repletion now rather than waiting for overt anemia?',
    'Should we investigate why my iron stores are low — specifically, could my menstrual blood loss or an absorption issue be the underlying cause?',
    'What ferritin target should we repeat labs against, and should I take oral iron with a cofactor like vitamin C, or consider IV iron given how low my stores are?',
  ],
  'General Wellness Tracking': [
    'Based on what I\'ve been logging, is there anything about my cycle or symptom pattern that looks worth investigating further?',
    'What baseline labs would you recommend for someone my age to establish a healthy reference point?',
    'Are there specific symptoms I should flag to you right away versus continue monitoring on my own?',
  ],
}

function frequencyTable(log, pickKey) {
  const counts = {}
  log.forEach((entry) => {
    const items = pickKey(entry)
    const list = Array.isArray(items) ? items : [items]
    list.forEach((item) => {
      if (!item) return
      counts[item] = (counts[item] || 0) + 1
    })
  })
  return Object.entries(counts).sort((a, b) => b[1] - a[1])
}

export function buildSoapDossier({ patient, symptomLog, labFlags, correlation, phase, day }) {
  const locationFreq = frequencyTable(symptomLog, (e) => e.location)
  const modifierFreq = frequencyTable(symptomLog, (e) => e.modifiers)
  const phaseFreq = frequencyTable(symptomLog, (e) => e.phase)

  const avgByPhase = {}
  symptomLog.forEach((e) => {
    avgByPhase[e.phase] = avgByPhase[e.phase] || { sum: 0, n: 0 }
    avgByPhase[e.phase].sum += e.severity
    avgByPhase[e.phase].n += 1
  })
  const worstPhase = Object.entries(avgByPhase)
    .map(([ph, v]) => [ph, v.sum / v.n])
    .sort((a, b) => b[1] - a[1])[0]

  const topLocation = locationFreq[0]?.[0] || 'Unspecified'
  const topModifiers = modifierFreq.slice(0, 5).map(([m, n]) => `${m} (${n}x)`)

  const subjective = {
    chiefComplaint: patient.chiefComplaintHint,
    frequencyWindow: `${symptomLog.length} logged symptom entries over the review period (patient-reported, voice & text logged)`,
    topFindings: [
      `Most frequently reported location: ${topLocation} (${locationFreq[0]?.[1] || 0}x)`,
      `Most common symptom qualifiers: ${topModifiers.join(', ')}`,
      `Phase most associated with flares: ${worstPhase ? `${worstPhase[0]} (avg severity ${worstPhase[1].toFixed(1)}/10)` : 'Insufficient data'}`,
      `Dominant logged cycle phase of entries: ${phaseFreq[0]?.[0] || 'N/A'} (${phaseFreq[0]?.[1] || 0} entries)`,
    ],
  }

  const objective = {
    cycleContext: `Currently Day ${day} of a ${patient.cycleLength}-day cycle — ${phase} phase.`,
    biomarkerFlags: labFlags.length
      ? labFlags.map((f) => `${f.title} — ${f.detail} [${f.guideline}]`)
      : ['No biomarker panel loaded yet, or no phase-adjusted anomalies flagged.'],
    correlationInsight: correlation
      ? `${Math.round(Math.abs(correlation.value) * 100)}% ${correlation.direction} correlation detected between luteal progesterone trajectory and logged symptom severity. ${correlation.narrative}`
      : 'Insufficient longitudinal data for correlation analysis.',
  }

  const assessmentLines = []
  patient.suspected.forEach((condition) => {
    if (condition.includes('PCOS')) {
      const ratioFlag = labFlags.find((f) => f.id === 'lh-fsh-ratio')
      const androgenFlag = labFlags.find((f) => f.id === 'elevated-testosterone')
      assessmentLines.push(
        `Rule out PCOS, Rotterdam Phenotype B (ovulatory dysfunction + biochemical hyperandrogenism)${ratioFlag ? ' — supported by elevated LH:FSH ratio' : ''}${androgenFlag ? ' and elevated total testosterone' : ''}; polycystic ovarian morphology on ultrasound not yet assessed.`
      )
    } else if (condition.includes('PMDD')) {
      assessmentLines.push(
        `Evaluate for Luteal-Phase PMDD — symptom log shows mood, cognitive (brain fog), and somatic (bloating, tenderness) symptom clustering tightly within the luteal phase with near-full resolution after menses onset, consistent with DSM-5 PMDD temporal pattern.`
      )
    } else if (condition.includes('Endometriosis')) {
      assessmentLines.push(
        `Evaluate Endometriosis, Stage I/II clinical suspicion — cyclical, progressively intensifying lower pelvic pain with dyschezia (bowel pain) and dyspareunia, worsening in the premenstrual-to-menstrual window, a pattern poorly explained by primary dysmenorrhea alone.`
      )
    } else if (condition.includes('Iron')) {
      const latentFlag = labFlags.find((f) => f.id === 'latent-iron')
      assessmentLines.push(
        `${latentFlag ? 'Confirm' : 'Evaluate'} Latent Iron Deficiency — ferritin below the 30 ng/mL functional threshold${latentFlag && latentFlag.severity === 'warning' ? ' despite grossly normal hemoglobin, masking early depletion' : ''}; correlates with persistent non-cyclical fatigue reported independent of cycle phase.`
      )
    } else if (condition.includes('General Wellness')) {
      assessmentLines.push(
        `No specific condition flagged yet — establishing a baseline of cycle phase, symptom pattern, and lab markers for ongoing wellness tracking. Continue logging to surface patterns worth discussing.`
      )
    } else {
      assessmentLines.push(`Further evaluate: ${condition}.`)
    }
  })

  const questionPool = []
  patient.suspected.forEach((c) => {
    const key = Object.keys(CONDITION_QUESTIONS).find((k) => c.includes(k.replace('Suspected ', '').split(' ')[0]) || c === k)
    const qs = CONDITION_QUESTIONS[c] || CONDITION_QUESTIONS[key]
    if (qs) questionPool.push(...qs)
  })
  const seen = new Set()
  const dedupedQuestions = questionPool.filter((q) => {
    if (seen.has(q)) return false
    seen.add(q)
    return true
  })
  const planQuestions = []
  const conditions = Object.keys(CONDITION_QUESTIONS).filter((k) => patient.suspected.includes(k))
  for (let i = 0; i < 3; i++) {
    const condKey = conditions[i % conditions.length]
    const qs = CONDITION_QUESTIONS[condKey] || []
    const q = qs[Math.floor(i / conditions.length)] || dedupedQuestions[i]
    if (q && !planQuestions.includes(q)) planQuestions.push(q)
  }
  while (planQuestions.length < 3 && dedupedQuestions.length) {
    const q = dedupedQuestions[planQuestions.length]
    if (q && !planQuestions.includes(q)) planQuestions.push(q)
    else break
  }

  return {
    generatedAt: new Date().toISOString(),
    patient,
    subjective,
    objective,
    assessment: assessmentLines,
    plan: planQuestions.slice(0, 3),
  }
}
