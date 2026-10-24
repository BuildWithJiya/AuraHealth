/**
 * lifeStageData.js
 * 
 * Life-Stage Adaptive Architecture for Aura Health:
 * 1. Teen / Puberty (Ages 12-19)
 * 2. Reproductive & Cyclical Health (Ages 20-39)
 * 3. Pregnancy & Postpartum (Trimesters 1-3 & Months 0-12 PP)
 * 4. Perimenopause & Menopause Transition (Ages 40-55+)
 */

export const LIFE_STAGES = {
  teen: {
    id: 'teen',
    title: 'Teen & Puberty Transition',
    shortName: 'Teen / Puberty',
    ageRange: 'Ages 12–19',
    badge: 'Puberty & Menarche',
    color: '#D96B85',
    bg: '#FCE7E8',
    icon: '🌸',
    summary: 'Tailored for menarche onset, physiological cycle irregularity, academic/exam stress, and adolescent dysmenorrhea without premature PCOS mislabeling.',
    clinicalFocus: [
      {
        title: 'HPA Axis Immaturity',
        detail: 'The hypothalamic-pituitary-ovarian axis typically requires 2 to 3 years post-menarche to fully mature. Skipped cycles and anovulatory intervals are common and physiologically normal.',
      },
      {
        title: 'Dysmenorrhea vs. School Absenteeism',
        detail: 'Severe cramping that prevents school or sport attendance is screened for early primary dysmenorrhea management rather than ignored.',
      },
      {
        title: 'Adolescent Iron Depletion',
        detail: 'Rapid adolescent growth spurts combined with monthly menses significantly increase the risk of latent iron deficiency and fatigue.',
      },
    ],
    diagnosticQuestions: [
      'Did severe cramps or pelvic pain force you to stay home from school or miss sports?',
      'How many weeks or months elapsed between your last two cycles? (Gaps under 90 days are common in early puberty)',
      'Are you experiencing high school/exam stress or chronic sleep deprivation?',
      'Have you noticed sudden inflammatory acne flares concentrated along the T-zone or forehead?',
    ],
    symptomChips: [
      { label: 'School Cramp Flare', location: 'Pelvic — General', severity: 6, modifiers: ['Cramping', 'School Absenteeism'] },
      { label: 'Exam Stress Fatigue', location: 'Cranial / Head', severity: 5, modifiers: ['Fatigue', 'Stress Flare', 'Morning Onset'] },
      { label: 'Skipped Month (Pubertal)', location: 'Pelvic — General', severity: 2, modifiers: ['Irregular Cycle', 'Gradual Onset'] },
      { label: 'T-Zone Puberty Acne', location: 'Dermatological', severity: 4, modifiers: ['Acne Flare'] },
      { label: 'Adolescent Iron Dizziness', location: 'Unspecified / Systemic', severity: 5, modifiers: ['Fatigue', 'Dizziness'] },
    ],
    doctorQuestions: [
      'Given my age and that my period started within the last 3 years, are my cycle gaps part of normal HPA axis maturation?',
      'Can we screen my ferritin and iron levels to ensure my fatigue is not from latent iron deficiency during my growth years?',
      'What are safe, first-line non-hormonal anti-inflammatory options for cramps so I do not have to miss classes?',
    ],
  },

  reproductive: {
    id: 'reproductive',
    title: 'Reproductive & Cyclical Health',
    shortName: 'Reproductive',
    ageRange: 'Ages 20–39',
    badge: 'Ovulatory & Luteal',
    color: '#405A43',
    bg: '#E8EFE3',
    icon: '🌿',
    summary: 'Standard ovulatory tracking, luteal phase defect, fertility windows, PMDD vs. PMS differentiation, Endometriosis pain mapping, and Rotterdam PCOS criteria.',
    clinicalFocus: [
      {
        title: 'Biphasic Hormone Rhythm',
        detail: 'Tracks the interplay of follicular estrogen surges, mid-cycle LH spikes, and luteal progesterone maintenance across the 4 canonical cycle phases.',
      },
      {
        title: 'Endometriosis vs. Dysmenorrhea',
        detail: 'Screens for cyclical pelvic pain, dyschezia (bowel pain), and dyspareunia (pain with intercourse) that worsen before menses.',
      },
      {
        title: 'PMDD Luteal Neurosteroids',
        detail: 'DSM-5 evaluation for luteal phase affective crashes (rage, crying spells, severe brain fog) with near-complete follicular resolution.',
      },
    ],
    diagnosticQuestions: [
      'Did you observe mid-cycle fertile cervical mucus or an ovulatory twinge (mittelschmerz)?',
      'Are severe mood crashes, irritability, or crying spells clustering strictly within the 7–10 days before your period?',
      'Do you experience deep pelvic, bowel, or sexual discomfort during or immediately before bleeding?',
      'Has your cycle length varied by more than 7 days cycle-to-cycle over the past 6 months?',
    ],
    symptomChips: [
      { label: 'Ovulation Twinge (Day 14)', location: 'Pelvic — Lower Right', severity: 3, modifiers: ['Sudden Onset'] },
      { label: 'Luteal Dysphoria (PMDD)', location: 'Unspecified / Systemic', severity: 8, modifiers: ['Mood Swings', 'Irritability', 'Luteal Phase'] },
      { label: 'Deep Pelvic Ache (Endo)', location: 'Pelvic — Lower Left', severity: 8, modifiers: ['Sharp', 'Stabbing', 'Dyspareunia'] },
      { label: 'Cystic Jawline Acne', location: 'Dermatological', severity: 4, modifiers: ['Acne Flare', 'Hyperandrogenism'] },
      { label: 'Insulin Resistance Craving', location: 'Abdominal — General', severity: 6, modifiers: ['Food Cravings', 'Bloating'] },
    ],
    doctorQuestions: [
      'Given my symptom clustering in the luteal window, could we evaluate for PMDD per DSM-5 criteria?',
      'Would a high-resolution transvaginal ultrasound or pelvic MRI help screen for endometriosis or adenomyosis?',
      'Should we check a Day-3 FSH, LH, and Total Testosterone panel to rule out PCOS phenotype variations?',
    ],
  },

  pregnancy_postpartum: {
    id: 'pregnancy_postpartum',
    title: 'Pregnancy & Postpartum Care',
    shortName: 'Pregnancy / Postpartum',
    ageRange: 'Perinatal to 12m Postpartum',
    badge: 'Perinatal & Maternal',
    color: '#6A3D55',
    bg: '#E8DDF0',
    icon: '🤱',
    summary: 'Trimester physiological adaptations, postpartum lochia evolution, prolactin lactational amenorrhea, pelvic floor recovery, and Edinburgh PPD screening.',
    clinicalFocus: [
      {
        title: 'Lochia Progression & Healing',
        detail: 'Monitors the normal postpartum discharge progression (Lochia Rubra -> Lochia Serosa -> Lochia Alba) over 4 to 6 weeks to catch secondary hemorrhage or endometritis early.',
      },
      {
        title: 'Lactational Prolactin & Amenorrhea',
        detail: 'High prolactin levels suppress ovarian folliculogenesis. Explains delayed menstrual return while breastfeeding without endocrine alarm.',
      },
      {
        title: 'Edinburgh Postnatal Depression (EPDS)',
        detail: 'Screens for postpartum mood disorders beyond transient "baby blues" at 2, 6, and 12 weeks postpartum for timely clinical intervention.',
      },
    ],
    diagnosticQuestions: [
      'Lochia discharge status: Is bleeding bright red with clots (Rubra), brownish-pink (Serosa), or yellowish-white (Alba)?',
      'Edinburgh Screen: In the past 7 days, have you felt overwhelmed, anxious, or unable to look forward to things with enjoyment?',
      'Breast & lactation status: Any localized heat, redness, hard lumps, or severe nipple cracking (mastitis screen)?',
      'Pelvic floor: Any sensation of vaginal heaviness, urine leakage with coughing, or perineal healing pain?',
    ],
    symptomChips: [
      { label: 'Lochia Serosa Discharge', location: 'Pelvic — General', severity: 4, modifiers: ['Postpartum Bleeding', 'Lochia Serosa'] },
      { label: 'Overwhelmed / Tearful (EPDS)', location: 'Unspecified / Systemic', severity: 7, modifiers: ['Mood Swings', 'Postpartum Exhaustion', 'Anxiety'] },
      { label: 'Breast Engorgement', location: 'Breast / Chest', severity: 6, modifiers: ['Tenderness', 'Mastitis Screen'] },
      { label: 'Pelvic Floor Heaviness', location: 'Pelvic — General', severity: 5, modifiers: ['Pelvic Pressure', 'Dull'] },
      { label: 'Night Sweats (Hormone Drop)', location: 'Unspecified / Systemic', severity: 5, modifiers: ['Night Onset', 'Postpartum Diaphoresis'] },
    ],
    doctorQuestions: [
      'Is my lochia color and volume progression normal for my current week postpartum?',
      'Could we review my Edinburgh Postnatal Depression Scale score to ensure I have postpartum emotional support?',
      'What pelvic floor physical therapy or recovery milestones should I target before resuming high-impact exercise?',
    ],
  },

  perimenopause: {
    id: 'perimenopause',
    title: 'Perimenopause & Menopause Transition',
    shortName: 'Perimenopause',
    ageRange: 'Ages 40–55+',
    badge: 'Endocrine Transition',
    color: '#D9A84E',
    bg: '#F8F0E8',
    icon: '🍂',
    summary: 'Addresses follicular depletion, compensatory FSH elevation (>30 mIU/mL), erratic estrogen surges & crashes, vasomotor hot flashes, sleep disruption, and HRT readiness.',
    clinicalFocus: [
      {
        title: 'Erratic Estrogen Volatility',
        detail: 'Perimenopause is characterized by unpredictably high estrogen spikes followed by steep drop-offs rather than a smooth decline, triggering vasomotor instability.',
      },
      {
        title: 'Vasomotor & Sleep Architecture',
        detail: 'Night sweats and daytime hot flashes disrupt REM and slow-wave sleep, causing secondary cognitive fatigue, brain fog, and mood shifts.',
      },
      {
        title: 'Cardiometabolic & Bone Preservation',
        detail: 'Estrogen withdrawal alters lipid profiles and accelerates bone mineral density loss. Prepares users for Menopause Hormone Therapy (MHT/HRT) discussions.',
      },
    ],
    diagnosticQuestions: [
      'How many vasomotor episodes (daytime hot flashes or waking night sweats) did you experience today?',
      'Did you awaken at 2:00–4:00 AM with a racing heartbeat, chills, or sudden drenched sheets?',
      'Has your cycle length extended beyond 60 days (late transition) or have you experienced heavy, flooding bleeding?',
      'Are you experiencing joint stiffness, sudden cognitive brain fog, or genitourinary dryness?',
    ],
    symptomChips: [
      { label: 'Vasomotor Hot Flash', location: 'Breast / Chest', severity: 7, modifiers: ['Sudden Onset', 'Vasomotor Flush', 'Flushing'] },
      { label: '3:00 AM Night Sweats', location: 'Unspecified / Systemic', severity: 7, modifiers: ['Night Onset', 'Insomnia', 'Diaphoresis'] },
      { label: '60+ Day Cycle Gap', location: 'Pelvic — General', severity: 2, modifiers: ['Late Perimenopause', 'Irregular Cycle'] },
      { label: 'Cognitive Brain Fog', location: 'Cranial / Head', severity: 6, modifiers: ['Brain Fog', 'Fatigue'] },
      { label: 'Joint Aches & Dryness', location: 'Unspecified / Systemic', severity: 5, modifiers: ['Joint Stiffness', 'Aching'] },
    ],
    doctorQuestions: [
      'Given my hot flashes and sleep disruption, am I a candidate for Menopause Hormone Therapy (MHT/HRT)?',
      'Should we check baseline bone mineral density (DEXA scan) and a comprehensive lipid panel?',
      'How should we manage my irregular, heavy transitional bleeding episodes to protect against endometrial hyperplasia?',
    ],
  },
}

export const LIFE_STAGE_LIST = Object.values(LIFE_STAGES)

const LIFE_STAGE_STORAGE_KEY = 'auradx_v1_active_life_stage'

export function getStoredLifeStage() {
  try {
    const saved = localStorage.getItem(LIFE_STAGE_STORAGE_KEY)
    if (saved && LIFE_STAGES[saved]) {
      return saved
    }
  } catch (err) {
    console.warn('Could not read stored life stage:', err)
  }
  return 'reproductive'
}

export function saveLifeStage(stageId) {
  try {
    if (LIFE_STAGES[stageId]) {
      localStorage.setItem(LIFE_STAGE_STORAGE_KEY, stageId)
    }
  } catch (err) {
    console.warn('Could not save life stage:', err)
  }
}
