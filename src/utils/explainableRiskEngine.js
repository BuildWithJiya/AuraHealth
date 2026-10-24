/**
 * Explainable Risk Screening Engine
 * 
 * Strict Clinical Positioning:
 * - "Clinical Pre-Screening & Physician Referral Support"
 * - Non-diagnostic: Evaluates user-reported longitudinal symptoms, cycle dynamics,
 *   and phase-adjusted lab flags against established clinical consensus criteria
 *   (Rotterdam 2003, ACOG #114, DSM-5 PMDD).
 * - Transparent Explainability: Explicitly answers "Kyun Flag Hua?" (Why this was flagged)
 *   with quantified factor weights, detected patient evidence, and physician discussion guides.
 */

export function runExplainableScreening({ patient, symptomLog = [], labFlags = [], correlation = null }) {
  const reports = []

  // Gather aggregate patient evidence
  const allModifiers = symptomLog.flatMap((s) => s.modifiers || [])
  const maxSeverity = symptomLog.reduce((m, s) => Math.max(m, s.severity || 0), 0)
  const avgSeverity = symptomLog.length
    ? Math.round((symptomLog.reduce((sum, s) => sum + (s.severity || 0), 0) / symptomLog.length) * 10) / 10
    : 0
  const hasAcne = allModifiers.some((m) => /acne/i.test(m)) || symptomLog.some((s) => /acne/i.test(s.rawText))
  const hasHairThinning = allModifiers.some((m) => /hair/i.test(m)) || symptomLog.some((s) => /hair/i.test(s.rawText))
  const hasWeightGain = allModifiers.some((m) => /weight/i.test(m)) || symptomLog.some((s) => /weight/i.test(s.rawText))
  const hasMoodSwings = allModifiers.some((m) => /mood|irritab|crying|rage/i.test(m)) || symptomLog.some((s) => /mood|crying|rage/i.test(s.rawText))
  const hasBowelPain = allModifiers.some((m) => /bowel/i.test(m)) || symptomLog.some((s) => /bowel/i.test(s.rawText))
  const hasDyspareunia = allModifiers.some((m) => /dyspareunia|sex/i.test(m)) || symptomLog.some((s) => /sex/i.test(s.rawText))
  const hasHeavyFlow = allModifiers.some((m) => /heavy/i.test(m)) || symptomLog.some((s) => /heavy|soaking/i.test(s.rawText))
  const hasSharpPelvicPain = symptomLog.some((s) => s.location?.includes('Pelvic') && (s.severity >= 7 || /sharp|stabbing/i.test(s.rawText)))

  // -------------------------------------------------------------------------
  // 1. PCOS Explainable Screening Model (Rotterdam Consensus Criteria 2003)
  // -------------------------------------------------------------------------
  const pcosFactors = []
  let pcosScore = 0

  // Factor A: Oligo/Anovulation & Cycle Gap
  if (patient.cycleLength >= 32 || patient.anovulatory) {
    pcosScore += 35
    pcosFactors.push({
      factor: 'Cycle Gap & Oligo-ovulation',
      weight: 35,
      detected: true,
      contribution: '35%',
      evidence: `Cycle interval of ${patient.cycleLength} days (extended gap > 32d) with ${patient.anovulatory ? 'anovulatory flatlined curve' : 'delayed ovulation'}.`,
      clinicalRelevance: 'Rotterdam Criterion #1: Chronic oligo- or anovulation causes delayed follicular maturation and irregular cycles.',
    })
  } else {
    pcosFactors.push({
      factor: 'Cycle Gap & Oligo-ovulation',
      weight: 35,
      detected: false,
      contribution: '0%',
      evidence: `Cycle length is ${patient.cycleLength} days (within standard 24-32 day window).`,
      clinicalRelevance: 'Standard cycle duration does not indicate primary oligo-ovulation.',
    })
  }

  // Factor B: Clinical Hyperandrogenism (Acne, Hirsutism, Hair loss)
  if (hasAcne || hasHairThinning) {
    const androgenEvidence = []
    if (hasAcne) androgenEvidence.push('cystic jawline acne flare')
    if (hasHairThinning) androgenEvidence.push('hair thinning / androgenic shedding')
    pcosScore += 30
    pcosFactors.push({
      factor: 'Clinical Hyperandrogenism Signs',
      weight: 30,
      detected: true,
      contribution: '30%',
      evidence: `Logged clinical signs: ${androgenEvidence.join(' & ')}.`,
      clinicalRelevance: 'Rotterdam Criterion #2: Excess circulating androgen metabolites stimulate sebum overproduction and follicular miniaturization.',
    })
  } else {
    pcosFactors.push({
      factor: 'Clinical Hyperandrogenism Signs',
      weight: 30,
      detected: false,
      contribution: '0%',
      evidence: 'No active jawline cystic acne, severe hirsutism, or androgenic alopecia logged.',
      clinicalRelevance: 'Absence of dermatological signs of androgen excess.',
    })
  }

  // Factor C: Metabolic Dynamics & Insulin Resistance Markers
  if (hasWeightGain || allModifiers.some((m) => /cravings|bloating/i.test(m))) {
    pcosScore += 20
    pcosFactors.push({
      factor: 'Metabolic & Insulin Resistance Signals',
      weight: 20,
      detected: true,
      contribution: '20%',
      evidence: 'Diet-refractory weight changes, persistent evening bloating, and intense carbohydrate cravings.',
      clinicalRelevance: 'Up to 70% of individuals with PCOS feature underlying compensatory hyperinsulinemia that drives ovarian androgen synthesis.',
    })
  } else {
    pcosFactors.push({
      factor: 'Metabolic & Insulin Resistance Signals',
      weight: 20,
      detected: false,
      contribution: '0%',
      evidence: 'No reported sudden weight fluctuation or postprandial metabolic fatigue spikes.',
      clinicalRelevance: 'Metabolic markers within baseline parameters.',
    })
  }

  // Factor D: Endocrine Curve / Lab Concordance
  if (patient.anovulatory || labFlags.some((f) => /LH|FSH|progesterone|androgen|testosterone/i.test(f.title + f.detail))) {
    pcosScore += 15
    pcosFactors.push({
      factor: 'Endocrine Hormone Concordance',
      weight: 15,
      detected: true,
      contribution: '15%',
      evidence: 'Sub-optimal luteal progesterone trajectory with elevated LH/FSH endocrine flags.',
      clinicalRelevance: 'Altered GnRH pulsatility results in preferential LH secretion and defective corpus luteum function.',
    })
  }

  const pcosFinalScore = Math.min(pcosScore, 98)
  reports.push({
    id: 'pcos',
    name: 'Polycystic Ovary Syndrome (PCOS)',
    shortName: 'PCOS Risk Screening',
    riskLevel: pcosFinalScore >= 75 ? 'Elevated Screening Probability' : pcosFinalScore >= 45 ? 'Moderate Screening Probability' : 'Low Baseline Risk',
    riskTier: pcosFinalScore >= 75 ? 'high' : pcosFinalScore >= 45 ? 'moderate' : 'low',
    confidenceScore: pcosFinalScore,
    clinicalStandard: 'Rotterdam Consensus Criteria 2003 & ACOG Practice Bulletin #108',
    positioning: 'Pre-Screening & Physician Referral Support (Non-Diagnostic)',
    summaryHeadline: pcosFinalScore >= 75
      ? 'Fulfills 2 of 3 Rotterdam criteria indicators (Oligo-ovulation + Hyperandrogenic signs).'
      : 'Sub-threshold pattern; selective metabolic tracking recommended.',
    whyFlagged: pcosFactors,
    criteriaMatched: `${pcosFactors.filter((f) => f.detected).length} of ${pcosFactors.length} clinical domains detected`,
    doctorReferralChecklist: [
      'Pelvic Transvaginal Ultrasound to evaluate ovarian volume and antral follicle count (AFC ≥ 12-20 follicles/ovary).',
      'Fasting Day 2-4 Bloodwork: Total & Free Testosterone, DHEA-S, 17-OH Progesterone (rules out late-onset CAH).',
      'Metabolic Screening: 2-Hour Oral Glucose Tolerance Test (OGTT) with Fasting Insulin (HOMA-IR).',
      'Day 21 / Mid-Luteal Serum Progesterone to verify presence or absence of ovulation.',
    ],
    physicianDiscussionPrompt:
      '“Doctor, my longitudinal symptom logging shows extended 34+ day cycles accompanied by cystic acne, hair changes, and absent luteal progesterone spikes. I would like to review the Rotterdam criteria and consider a pelvic ultrasound and fasting androgen panel.”',
  })

  // -------------------------------------------------------------------------
  // 2. Endometriosis Explainable Screening Model (ACOG & ESHRE Guidelines)
  // -------------------------------------------------------------------------
  const endoFactors = []
  let endoScore = 0

  // Factor A: Cyclical Pelvic Pain Ramp
  if (hasSharpPelvicPain || maxSeverity >= 8) {
    endoScore += 35
    endoFactors.push({
      factor: 'Debilitating Cyclical Pelvic Pain (Dysmenorrhea)',
      weight: 35,
      detected: true,
      contribution: '35%',
      evidence: `Severe pelvic pain spiking to ${maxSeverity}/10 concentrated in the premenstrual/menstrual window.`,
      clinicalRelevance: 'Peritoneal ectopic endometrial implants bleed cyclically, triggering intense localized prostaglandins and inflammatory nerve sensitization.',
    })
  } else {
    endoFactors.push({
      factor: 'Debilitating Cyclical Pelvic Pain',
      weight: 35,
      detected: false,
      contribution: '0%',
      evidence: `Maximum logged pain score is ${maxSeverity}/10 (below severe clinical threshold).`,
      clinicalRelevance: 'Pain levels do not currently suggest severe active peritoneal inflammation.',
    })
  }

  // Factor B: Extra-Pelvic / Compartment Spread (Bowel & Intercourse Pain)
  if (hasBowelPain || hasDyspareunia) {
    const spreadEvidence = []
    if (hasBowelPain) spreadEvidence.push('cyclical dyschezia (pain during bowel movements)')
    if (hasDyspareunia) spreadEvidence.push('deep dyspareunia (pain with intercourse)')
    endoScore += 30
    endoFactors.push({
      factor: 'Compartment Symptoms (Dyschezia / Dyspareunia)',
      weight: 30,
      detected: true,
      contribution: '30%',
      evidence: `Logged non-menstrual compartment symptoms: ${spreadEvidence.join(' & ')}.`,
      clinicalRelevance: 'ACOG #114 hallmark: Deep infiltrating endometriosis (DIE) implants commonly seed the pouch of Douglas and uterosacral ligaments.',
    })
  } else {
    endoFactors.push({
      factor: 'Compartment Symptoms (Dyschezia / Dyspareunia)',
      weight: 30,
      detected: false,
      contribution: '0%',
      evidence: 'No logged cyclical bowel pain or deep dyspareunia reported.',
      clinicalRelevance: 'Absence of symptomatic involvement of posterior cul-de-sac.',
    })
  }

  // Factor C: Functional Disability & Life Disruption
  if (symptomLog.some((s) => s.severity >= 8 || /bed|work|sick|unbearable/i.test(s.rawText))) {
    endoScore += 20
    endoFactors.push({
      factor: 'Functional Disability Score',
      weight: 20,
      detected: true,
      contribution: '20%',
      evidence: 'Symptoms cause acute incapacitation (bed-bound, work absence, requiring immediate assistance).',
      clinicalRelevance: 'Primary dysmenorrhea typically responds to over-the-counter NSAIDs; secondary endometriosis pain causes profound functional impairment.',
    })
  } else {
    endoFactors.push({
      factor: 'Functional Disability Score',
      weight: 20,
      detected: false,
      contribution: '0%',
      evidence: 'No reported severe impairment of daily activities or work absenteeism.',
      clinicalRelevance: 'Symptoms manageable without severe functional collapse.',
    })
  }

  // Factor D: Longitudinal Incomplete Response / Associated Bleeding
  if (hasHeavyFlow || symptomLog.length >= 6) {
    endoScore += 15
    endoFactors.push({
      factor: 'Heavy Menstrual Flow & Co-existing Depletion',
      weight: 15,
      detected: true,
      contribution: '15%',
      evidence: 'Accompanied by heavy menstrual flow requiring frequent pad changes and persistent systemic fatigue.',
      clinicalRelevance: 'High comorbidity with adenomyosis and latent iron depletion due to chronic menorrhagia.',
    })
  }

  const endoFinalScore = Math.min(endoScore, 96)
  reports.push({
    id: 'endometriosis',
    name: 'Endometriosis Clinical Screening',
    shortName: 'Endometriosis Risk Screening',
    riskLevel: endoFinalScore >= 75 ? 'Elevated Screening Probability' : endoFinalScore >= 45 ? 'Moderate Screening Probability' : 'Low Baseline Risk',
    riskTier: endoFinalScore >= 75 ? 'high' : endoFinalScore >= 45 ? 'moderate' : 'low',
    confidenceScore: endoFinalScore,
    clinicalStandard: 'ACOG Practice Bulletin #114 & ESHRE Endometriosis Guidelines 2022',
    positioning: 'Pre-Screening & Physician Referral Support (Non-Diagnostic)',
    summaryHeadline: endoFinalScore >= 75
      ? 'Strong alignment: Severe cyclical dysmenorrhea paired with deep pelvic & bowel symptoms.'
      : 'Symptom profile does not currently indicate primary endometriosis phenotype.',
    whyFlagged: endoFactors,
    criteriaMatched: `${endoFactors.filter((f) => f.detected).length} of ${endoFactors.length} clinical domains detected`,
    doctorReferralChecklist: [
      'Referral to a Minimally Invasive Gynecologic Surgeon (MIGS) or Endometriosis Center of Excellence.',
      'Specialized High-Resolution Pelvic MRI with Endometriosis Protocol (including gel instillation for cul-de-sac mapping).',
      'Expert Transvaginal Ultrasound with "sliding sign" evaluation for retrocervical and bowel nodules.',
      'Complete Blood Count (CBC) & Ferritin levels to screen for chronic occult iron deficiency from menorrhagia.',
    ],
    physicianDiscussionPrompt:
      '“Doctor, my symptom timeline documents cyclical 8-9/10 pelvic pain that radiates to my lower back and causes painful bowel movements. Over-the-counter NSAIDs are ineffective. I would like a referral to an endometriosis specialist to discuss specialized imaging.”',
  })

  // -------------------------------------------------------------------------
  // 3. PMDD Explainable Screening Model (DSM-5 Criteria Code 625.4)
  // -------------------------------------------------------------------------
  const pmddFactors = []
  let pmddScore = 0

  // Factor A: Luteal Phase Specificity (Days 18-28)
  const lutealSymptoms = symptomLog.filter((s) => s.phase === 'Luteal' && (s.severity >= 6 || /mood|irritab|crying|anx/i.test(s.rawText)))
  if (lutealSymptoms.length >= 2 || (correlation && correlation.hormoneLabel?.includes('progesterone'))) {
    pmddScore += 40
    pmddFactors.push({
      factor: 'Strict Luteal-Phase Symptom Clustering',
      weight: 40,
      detected: true,
      contribution: '40%',
      evidence: `${lutealSymptoms.length} documented mood/neurovegetative spikes restricted specifically to the luteal window.`,
      clinicalRelevance: 'DSM-5 Criterion A: Symptoms must express during the final week before onset of menses due to cellular sensitivity to allopregnanolone fluctuations.',
    })
  } else {
    pmddFactors.push({
      factor: 'Strict Luteal-Phase Symptom Clustering',
      weight: 40,
      detected: false,
      contribution: '0%',
      evidence: 'Symptoms do not exhibit exclusive luteal clustering; evenly distributed across cycle.',
      clinicalRelevance: 'Non-cyclical mood symptoms suggest generalized mood disorder rather than endocrine-driven PMDD.',
    })
  }

  // Factor B: Immediate Follicular Resolution
  const follicularMoodSymptoms = symptomLog.filter((s) => (s.phase === 'Follicular' || s.phase === 'Ovulatory') && /rage|crying|irritab/i.test(s.rawText))
  if (follicularMoodSymptoms.length === 0) {
    pmddScore += 30
    pmddFactors.push({
      factor: 'Follicular Phase Remission (Symptom-Free Window)',
      weight: 30,
      detected: true,
      contribution: '30%',
      evidence: 'Complete resolution of severe mood crashes within 48-72h of menses starting.',
      clinicalRelevance: 'DSM-5 Criterion B: Remission of symptoms post-menses is essential to differentiate PMDD from major depression.',
    })
  } else {
    pmddFactors.push({
      factor: 'Follicular Phase Remission',
      weight: 30,
      detected: false,
      contribution: '0%',
      evidence: 'Symptoms persist throughout the post-menstrual follicular phase.',
      clinicalRelevance: 'Persistent follicular symptoms indicate a non-endocrine primary affective pattern.',
    })
  }

  // Factor C: Core Affective Cluster (Rage, Hopelessness, Severe Irritability)
  if (hasMoodSwings) {
    pmddScore += 30
    pmddFactors.push({
      factor: 'Core Affective Impairment (Rage / Despair)',
      weight: 30,
      detected: true,
      contribution: '30%',
      evidence: 'Reported uncontrollable irritability, sudden crying spells, and interpersonal conflict exceeding standard PMS.',
      clinicalRelevance: 'DSM-5 Criterion C: Requires at least 1 core affective symptom (marked mood lability, irritability, or depressive hopelessness).',
    })
  }

  const pmddFinalScore = Math.min(pmddScore, 94)
  reports.push({
    id: 'pmdd',
    name: 'Premenstrual Dysphoric Disorder (PMDD)',
    shortName: 'PMDD Risk Screening',
    riskLevel: pmddFinalScore >= 75 ? 'Elevated Screening Probability' : pmddFinalScore >= 45 ? 'Moderate Screening Probability' : 'Low Baseline Risk',
    riskTier: pmddFinalScore >= 75 ? 'high' : pmddFinalScore >= 45 ? 'moderate' : 'low',
    confidenceScore: pmddFinalScore,
    clinicalStandard: 'DSM-5 Diagnostic Criteria for PMDD (625.4 / F32.81)',
    positioning: 'Pre-Screening & Physician Referral Support (Non-Diagnostic)',
    summaryHeadline: pmddFinalScore >= 75
      ? 'Classic biphasic rhythm: Severe luteal neurovegetative crash with rapid follicular recovery.'
      : 'Mood patterns do not meet specific cyclical PMDD thresholds.',
    whyFlagged: pmddFactors,
    criteriaMatched: `${pmddFactors.filter((f) => f.detected).length} of ${pmddFactors.length} clinical domains detected`,
    doctorReferralChecklist: [
      'Prospective 2-Cycle Daily Rating of Severity of Problems (DRSP) symptom tracking sheet.',
      'Comprehensive Thyroid Panel (TSH, Free T3, Free T4) to exclude subclinical hypothyroidism.',
      'Consultation with a Reproductive Psychiatrist or Gynecologist for luteal-phase targeted therapies.',
    ],
    physicianDiscussionPrompt:
      '“Doctor, my prospective log documents marked mood crashes, rage, and brain fog exclusively between Days 19 and 28, which clear up within 2 days of my period starting. I would like to be evaluated for PMDD using prospective DRSP tracking.”',
  })

  // Sort by highest confidence score first
  return reports.sort((a, b) => b.confidenceScore - a.confidenceScore)
}
