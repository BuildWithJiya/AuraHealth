import { useState } from 'react'
import { ArrowRight, ArrowLeft, Sparkles, Loader2, Check } from 'lucide-react'
import { CONCERN_OPTIONS, createPatientFromOnboarding } from '../utils/onboarding'

const TOTAL_STEPS = 2

export default function OnboardingForm({ onComplete, onSkip }) {
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [touched, setTouched] = useState(false)
  const [form, setForm] = useState({
    name: '',
    age: '',
    cycleLength: 28,
    lastPeriodStart: '',
    concernId: '',
  })

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const step1Valid = form.name.trim().length > 0 && Number(form.age) >= 10 && Number(form.age) <= 70 && Number(form.cycleLength) >= 18 && Number(form.cycleLength) <= 60 && !!form.lastPeriodStart
  const step2Valid = !!form.concernId

  const handleNext = () => {
    if (!step1Valid) {
      setTouched(true)
      return
    }
    setTouched(false)
    setStep(2)
  }

  const handleSubmit = () => {
    if (!step2Valid) {
      setTouched(true)
      return
    }
    setSubmitting(true)
    window.setTimeout(() => {
      const patient = createPatientFromOnboarding(form)
      onComplete(patient)
    }, 650)
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-center gap-2 mb-6">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((n) => (
            <div
              key={n}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                n === step ? 'w-10 bg-rose-400' : n < step ? 'w-6 bg-emerald-400' : 'w-6 bg-slate-700'
              }`}
            />
          ))}
        </div>

        <div className="ios-glass-card rounded-3xl p-7 sm:p-9 relative overflow-hidden">
          {submitting ? (
            <div className="flex flex-col items-center justify-center py-16 animate-landing-fade-up">
              <Loader2 size={32} className="text-rose-400 animate-spin mb-4" />
              <p className="text-sm text-slate-300 font-medium">Creating your dashboard…</p>
              <p className="text-xs text-slate-500 mt-1">Just a moment while we set up your calm, personal space.</p>
            </div>
          ) : step === 1 ? (
            <div key="step1" className="animate-landing-fade-up">
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles size={15} className="text-rose-400" />
                <span className="text-xs font-semibold text-rose-300 uppercase tracking-wide">Step 1 of 2</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-1">Let&apos;s personalize this for you</h2>
              <p className="text-sm text-slate-400 mb-6">Just the essentials — this stays private to your browser.</p>

              <div className="space-y-4">
                <Field label="What should we call you?" error={touched && !form.name.trim() ? 'Please share your name.' : null}>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    placeholder="e.g. Priya"
                    className="onboarding-input"
                  />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Your age" error={touched && !(Number(form.age) >= 10 && Number(form.age) <= 70) ? 'Age 10–70' : null}>
                    <input
                      type="number"
                      value={form.age}
                      onChange={(e) => update('age', e.target.value)}
                      placeholder="27"
                      className="onboarding-input"
                    />
                  </Field>
                  <Field label="Avg. cycle length (days)" error={touched && !(Number(form.cycleLength) >= 18 && Number(form.cycleLength) <= 60) ? '18–60 days' : null}>
                    <input
                      type="number"
                      value={form.cycleLength}
                      onChange={(e) => update('cycleLength', e.target.value)}
                      placeholder="28"
                      className="onboarding-input"
                    />
                  </Field>
                </div>

                <Field label="First day of your last period" error={touched && !form.lastPeriodStart ? 'Please pick a date.' : null}>
                  <input
                    type="date"
                    value={form.lastPeriodStart}
                    max={new Date().toISOString().slice(0, 10)}
                    onChange={(e) => update('lastPeriodStart', e.target.value)}
                    className="onboarding-input"
                  />
                </Field>
              </div>

              <div className="flex items-center justify-between mt-7">
                <button onClick={onSkip} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                  Skip — view a demo case instead
                </button>
                <button
                  onClick={handleNext}
                  className="flex items-center gap-1.5 text-sm font-semibold bg-gradient-to-r from-rose-500 to-indigo-500 hover:from-rose-400 hover:to-indigo-400 text-white rounded-full px-5 py-2.5 transition-all"
                >
                  Continue <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ) : (
            <div key="step2" className="animate-landing-fade-up">
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles size={15} className="text-rose-400" />
                <span className="text-xs font-semibold text-rose-300 uppercase tracking-wide">Step 2 of 2</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-1">What brings you here today?</h2>
              <p className="text-sm text-slate-400 mb-6">Pick whatever feels closest — you can always explore the rest later.</p>

              <div className="space-y-2.5">
                {CONCERN_OPTIONS.map((c) => {
                  const selected = form.concernId === c.id
                  return (
                    <button
                      key={c.id}
                      onClick={() => update('concernId', c.id)}
                      className={`w-full text-left flex items-center justify-between gap-3 rounded-xl border px-4 py-3 transition-all ${
                        selected
                          ? 'border-rose-400/60 bg-rose-500/10 shadow-[0_0_24px_-8px_rgba(244,63,94,0.6)]'
                          : 'border-slate-700 bg-slate-800/40 hover:border-slate-600 hover:bg-slate-800/70'
                      }`}
                    >
                      <span>
                        <div className="text-sm font-medium text-slate-100">{c.label}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{c.hint}</div>
                      </span>
                      {selected && (
                        <span className="h-5 w-5 rounded-full bg-rose-500 flex items-center justify-center shrink-0">
                          <Check size={12} className="text-white" />
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
              {touched && !step2Valid && <p className="text-[11px] text-rose-400 mt-2">Please choose one option to continue.</p>}

              <div className="flex items-center justify-between mt-7">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
                >
                  <ArrowLeft size={13} /> Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="animate-breathe-glow flex items-center gap-1.5 text-sm font-semibold bg-gradient-to-r from-rose-500 to-indigo-500 hover:from-rose-400 hover:to-indigo-400 text-white rounded-full px-5 py-2.5 transition-all"
                >
                  Create My Dashboard <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-slate-400 mb-1.5">{label}</span>
      {children}
      {error && <span className="block text-[11px] text-rose-400 mt-1">{error}</span>}
    </label>
  )
}
