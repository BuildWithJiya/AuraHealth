export const HEALTH_EDUCATION_TOPICS = [
  {
    id: 'cycle-phases',
    category: 'Cycle Physiology',
    title: 'The 4 Menstrual Phases & Hormonal Waves',
    subtitle: 'Why mood, pain, and energy shift week-to-week',
    badge: 'Physiological Foundation',
    badgeColor: 'indigo',
    summary:
      'Female physiology operates on an infradian rhythm dictated by the rise and fall of follicle-stimulating hormone (FSH), luteinizing hormone (LH), estradiol (estrogen), and progesterone. Understanding which phase you are in explains why symptoms flare.',
    sections: [
      {
        heading: '1. Menstrual Phase (Days 1–5)',
        text: 'The cycle begins on Day 1 of full menstrual bleeding. Progesterone and estrogen crash to baseline levels, causing the uterine lining (endometrium) to shed. Prostaglandins release into pelvic tissue to stimulate uterine muscle contractions, which cause primary cramps.',
        clinicalTip: 'Severe pain radiating down the thighs or bowel symptoms during menses should not be dismissed as normal cramping.',
      },
      {
        heading: '2. Follicular Phase (Days 6–13)',
        text: 'The pituitary gland pulses FSH, stimulating several ovarian follicles to mature. One dominant follicle surges in estradiol production, rebuilding the uterine lining. High estrogen increases serotonin and dopamine synthesis, commonly resulting in higher energy, mental clarity, and resilience.',
        clinicalTip: 'Day 3 of this phase is the clinical benchmark window for baseline hormonal testing (FSH, LH, Estradiol).',
      },
      {
        heading: '3. Ovulatory Phase (Days 14–16)',
        text: 'Sustained high estrogen triggers a rapid spike in Luteinizing Hormone (LH surge), causing the mature follicle to rupture and release an oocyte (egg). Some women experience "Mittelschmerz" — brief, one-sided pelvic pain as the follicle ruptures.',
        clinicalTip: 'Biomarkers like LH spike 5- to 10-fold during this brief 24–48 hour window.',
      },
      {
        heading: '4. Luteal Phase (Days 17–28+)',
        text: 'The ruptured follicle transforms into the corpus luteum, which manufactures progesterone. Progesterone calms the central nervous system and thickens the endometrium. If fertilization does not occur, the corpus luteum degenerates, causing hormone levels to precipitously drop 3–5 days before menses.',
        clinicalTip: 'This premenstrual withdrawal phase is when PMDD, migraine, and inflammatory flares occur.',
      },
    ],
  },
  {
    id: 'pcos',
    category: 'Hormonal Conditions',
    title: 'PCOS & Rotterdam Diagnostic Criteria',
    subtitle: 'Demystifying irregular cycles and hyperandrogenism',
    badge: 'Diagnostic Standard',
    badgeColor: 'rose',
    summary:
      'Polycystic Ovary Syndrome (PCOS) affects 1 in 10 women of reproductive age. It is primarily an endocrine and metabolic condition rather than an ovarian disease. Many women spend years undiagnosed because they do not match the outdated stereotype.',
    sections: [
      {
        heading: 'The Rotterdam Diagnostic Criteria',
        text: 'Per international clinical consensus, a definitive PCOS diagnosis requires at least 2 of the following 3 features (with secondary causes excluded):',
        bullets: [
          'Oligo- or Anovulation: Irregular, infrequent (cycles > 35 days), or completely absent menstrual periods.',
          'Hyperandrogenism: Either clinical signs (cystic acne along jawline, hirsutism/excess facial hair, androgenic alopecia/scalp thinning) or biochemical elevated androgens (total testosterone, free testosterone, DHEA-S).',
          'Polycystic Ovarian Morphology: Transvaginal ultrasound showing >= 20 follicles per ovary or ovarian volume > 10 mL.',
        ],
        clinicalTip: 'You can have PCOS without visible ovarian cysts if you have irregular cycles and elevated androgens.',
      },
      {
        heading: 'The LH:FSH Ratio Marker',
        text: 'In a healthy follicular phase, LH and FSH levels are roughly 1:1. In women with PCOS, pituitary pulses of LH are abnormally frequent, often producing an LH to FSH ratio of 2:1 or 3:1. This halts follicle maturation and causes anovulatory cycles.',
      },
      {
        heading: 'Insulin Resistance Connection',
        text: 'Up to 70% of women with PCOS have underlying hyperinsulinemia. High circulating insulin stimulates the ovarian theca cells to overproduce testosterone and reduces sex hormone-binding globulin (SHBG).',
        clinicalTip: 'Ask your doctor for a fasting insulin test or 2-hour oral glucose tolerance test, not just fasting glucose.',
      },
    ],
  },
  {
    id: 'pmdd',
    category: 'Neuroendocrine',
    title: 'PMDD vs. Standard PMS (DSM-5)',
    subtitle: 'Why it is an abnormal cellular sensitivity, not a hormone deficiency',
    badge: 'Neurosteroid Impact',
    badgeColor: 'amber',
    summary:
      'Premenstrual Dysphoric Disorder (PMDD) is a severe, disabling neuroendocrine disorder affecting 3–8% of menstruating women. Unlike normal PMS, PMDD significantly disrupts relationships, work, and personal safety.',
    sections: [
      {
        heading: 'The Mechanism: Neurosteroid Sensitivity',
        text: 'Women with PMDD do NOT have abnormal estrogen or progesterone levels. Brain imaging reveals that their GABA-A receptors have an abnormal molecular sensitivity to allopregnanolone (a natural neurosteroid breakdown product of progesterone). When progesterone rises and falls during the luteal phase, it triggers paradoxical anxiety, rage, and profound depression.',
        clinicalTip: 'Routine hormone tests will come back "normal" because the pathology is receptor sensitivity, not low hormone levels.',
      },
      {
        heading: 'DSM-5 Diagnostic Criteria',
        text: 'Requires at least 5 symptoms present in the final week before menses, starting to improve within a few days after onset, and minimal in the week postmenses. Must include at least 1 core emotional symptom:',
        bullets: [
          'Marked affective lability (sudden sadness, crying spells, increased sensitivity to rejection)',
          'Marked irritability, anger, or increased interpersonal conflicts',
          'Markedly depressed mood, feelings of hopelessness, or self-deprecating thoughts',
          'Marked anxiety, tension, or feelings of being "keyed up" or on edge',
        ],
      },
      {
        heading: 'Evidence-Based Treatments',
        text: 'Because symptoms are triggered by luteal hormonal shifts, clinical guidelines support: (1) Luteal-phase dosing of SSRIs (taken only from ovulation to menses onset, working within hours due to neurosteroid modulation), (2) Ovulation suppression via continuous oral contraceptives (e.g. drospirenone/ethinyl estradiol), or (3) GnRH agonists in refractory cases.',
      },
    ],
  },
  {
    id: 'endometriosis',
    category: 'Chronic Inflammation',
    title: 'Endometriosis & Peritoneal Inflammation',
    subtitle: 'Why standard ultrasound misses it and why delay averages 7–10 years',
    badge: 'Surgical & Imaging Reality',
    badgeColor: 'rose',
    summary:
      'Endometriosis occurs when tissue resembling the lining of the uterus implants outside the uterine cavity—most commonly on the ovaries, fallopian tubes, pelvic peritoneum, bowel, and bladder. Every month, these implants bleed and trigger chronic inflammatory scarring.',
    sections: [
      {
        heading: 'The 4 Cardinal Pain Signs',
        bullets: [
          'Severe Dysmenorrhea: Debilitating period pain unresponsive to over-the-counter NSAIDs.',
          'Dyspareunia: Deep pelvic pain during or after sexual intercourse.',
          'Dyschezia: Painful bowel movements, cyclical rectal bleeding, or digestive pain during menses.',
          'Dysuria: Cyclical bladder pain or burning without a bacterial urinary tract infection.',
        ],
      },
      {
        heading: 'The "Clear Ultrasound" Myth',
        text: 'A clean pelvic ultrasound does NOT rule out endometriosis. Standard transvaginal ultrasound only detects endometriomas ("chocolate cysts" on the ovaries) and severe deep infiltrating nodules. Superficial peritoneal lesions—which cause excruciating pain—are completely invisible on routine ultrasound.',
        clinicalTip: 'If your ultrasound is normal but pain is disabling, advocate for a specialized pelvic MRI or consult a minimally invasive gynecologic surgeon (MIGS) for diagnostic laparoscopy.',
      },
    ],
  },
  {
    id: 'iron-deficiency',
    category: 'Metabolic & Hematology',
    title: 'Latent Iron Deficiency Without Anemia',
    subtitle: 'The critical difference between Serum Ferritin and Hemoglobin',
    badge: 'Clinical Blind Spot',
    badgeColor: 'emerald',
    summary:
      'Millions of women suffer from debilitating chronic fatigue, brain fog, and hair loss because their doctors only order a Complete Blood Count (CBC) and check Hemoglobin, completely overlooking depleted intracellular iron storage (Ferritin).',
    sections: [
      {
        heading: 'Hemoglobin vs. Ferritin: The Wallet vs. Bank Analogy',
        text: 'Hemoglobin is like cash in your wallet—the iron actively circulating in red blood cells. Serum Ferritin is your savings account—the deep iron reserves stored in your liver, bone marrow, and hair follicles. You can have empty savings (Ferritin < 20 ng/mL) while your wallet still has just enough cash (Hemoglobin 12.5 g/dL). You will feel exhausted long before you develop full-blown anemia.',
      },
      {
        heading: 'The Flawed Reference Range',
        text: 'Commercial lab reports often state normal ferritin is 10–200 ng/mL. However, hematology and sports medicine consensus states that ferritin below 30 ng/mL is diagnostic of absolute iron deficiency. Ferritin below 50 ng/mL impairs mitochondrial enzyme function, thyroid hormone conversion, and hair follicle anagen phase.',
        clinicalTip: 'Always request a copy of your lab values: look at the exact number for Serum Ferritin, not just the "Normal" flag.',
      },
    ],
  },
  {
    id: 'self-advocacy',
    category: 'Patient Empowerment',
    title: 'Doctor Visit Scripts & Self-Advocacy',
    subtitle: 'Exact phrases to use when told "everything looks normal"',
    badge: 'Actionable Tool',
    badgeColor: 'indigo',
    summary:
      'When living with chronic gynecological or endocrine symptoms, navigating medical appointments can feel exhausting. Use these evidence-backed conversational frameworks to guide your consultation productively.',
    sections: [
      {
        heading: 'Script 1: When told "Your hormone blood test is normal"',
        text: '"Could we review what cycle day this blood draw occurred on? Because hormones like progesterone, LH, and estradiol vary 10-fold between the follicular, ovulatory, and luteal phases, I want to ensure my levels were evaluated against phase-specific reference intervals rather than a generic range."',
      },
      {
        heading: 'Script 2: When told "Your blood count is fine, your fatigue is stress"',
        text: '"Did my panel include a Serum Ferritin and Total Iron Binding Capacity, or just Hemoglobin? I understand that latent iron deficiency can occur with normal hemoglobin when ferritin is under 30 ng/mL. Could we check my ferritin stores?"',
      },
      {
        heading: 'Script 3: When told "Period pain is normal"',
        text: '"My pain reaches an 8 to 9 out of 10, prevents me from working, and occurs alongside bowel pain and deep pain during intercourse. These symptoms align with peritoneal endometriosis. Since routine ultrasound misses superficial disease, can we discuss a specialized pelvic MRI or referral to an excision specialist?"',
      },
      {
        heading: 'Script 4: When discussing cyclical luteal mood crashes',
        text: '"My depressive symptoms, rage, and brain fog remit within 48 hours of my period starting every month. I have logged these prospectively. Could we evaluate me for PMDD per DSM-5 criteria and discuss luteal-phase SSRI dosing?"',
      },
    ],
  },
]
