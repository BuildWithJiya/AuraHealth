import { useState } from 'react'
import {
  Sparkles,
  Mic,
  FlaskConical,
  TrendingUp,
  ShieldCheck,
  BookOpen,
  Droplet,
  ArrowRight,
  HeartPulse,
  Flower2,
} from 'lucide-react'
import { useReveal } from '../hooks/useReveal'

const FEATURES = [
  {
    icon: Droplet,
    color: '#F43F5E',
    title: 'Real-Time Cycle Phase Engine',
    desc: 'See exactly which hormonal phase you\'re in today, and the gentle "why" behind how you feel.',
  },
  {
    icon: Mic,
    color: '#10B981',
    title: 'Voice-to-Clinical Symptom Logger',
    desc: 'Just talk it out. We quietly turn it into a structured, doctor-ready note — no typing required.',
  },
  {
    icon: FlaskConical,
    color: '#FDBA74',
    title: 'Phase-Adjusted Biomarker Reader',
    desc: 'Your labs, read against your actual hormonal phase — not a one-size-fits-all chart that misses things.',
  },
  {
    icon: TrendingUp,
    color: '#6366F1',
    title: 'Longitudinal Pattern Recognition',
    desc: 'Watch your symptoms and hormones move together over your cycle, so real patterns finally become visible.',
  },
  {
    icon: ShieldCheck,
    color: '#F43F5E',
    title: '1-Click SOAP Dossier',
    desc: 'Walk into your next appointment with a clear clinical summary — and the exact questions worth asking.',
  },
  {
    icon: BookOpen,
    color: '#A855F7',
    title: 'Understand Your Body Guide',
    desc: 'A warm, judgment-free library gently explaining PCOS, endometriosis, PMDD, perimenopause, and more.',
  },
]

const STEPS = [
  { title: 'Tell us a little about you', desc: 'Your name, your cycle, and what\'s been on your mind lately.' },
  { title: 'We build your dashboard', desc: 'A calm, personalized space — ready in seconds, not weeks.' },
  { title: 'Track, learn, and feel heard', desc: 'Log gently by voice, watch your patterns emerge, and walk into appointments prepared.' },
]

function RevealBlock({ children, className = '', delayMs = 0 }) {
  const [ref, visible] = useReveal()
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'reveal-visible' : ''} ${className}`}
      style={{ transitionDelay: visible ? `${delayMs}ms` : '0ms' }}
    >
      {children}
    </div>
  )
}

export default function LandingPage({ onGetStarted, onViewDemo }) {
  const [hoveredFeature, setHoveredFeature] = useState(null)

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* ---------------------------------------------------------------- */}
      {/* Hero                                                              */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative max-w-5xl mx-auto px-6 pt-20 pb-24 text-center">
        <div className="animate-landing-fade-up inline-flex items-center gap-2 text-xs font-semibold text-rose-200 bg-rose-500/10 border border-rose-400/30 rounded-full px-4 py-1.5 mb-8 shadow-[0_0_30px_-8px_rgba(244,63,94,0.5)]">
          <Sparkles size={13} className="animate-soft-bob" />
          AI Diagnostic Co-Pilot for Women&apos;s Health
        </div>

        <h1
          className="animate-landing-fade-up text-4xl sm:text-6xl font-bold leading-[1.1] tracking-tight text-white"
          style={{ animationDelay: '100ms' }}
        >
          Your body has patterns.
          <br />
          <span className="text-gradient-warm">Let&apos;s finally see them.</span>
        </h1>

        <p
          className="animate-landing-fade-up mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed"
          style={{ animationDelay: '220ms' }}
        >
          AuraDx turns scattered symptoms into clear patterns, phase-aware lab insights, and a doctor-ready
          dossier — built to feel as gentle as it is precise. No judgment, no cold spreadsheets. Just you,
          finally understood.
        </p>

        <div
          className="animate-landing-fade-up mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          style={{ animationDelay: '340ms' }}
        >
          <button
            onClick={onGetStarted}
            className="animate-breathe-glow group flex items-center gap-2 bg-gradient-to-r from-rose-500 to-indigo-500 hover:from-rose-400 hover:to-indigo-400 text-white font-semibold rounded-full px-7 py-3.5 text-sm transition-all"
          >
            Create My Dashboard
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </button>
          <button
            onClick={onViewDemo}
            className="text-sm font-medium text-slate-400 hover:text-slate-200 underline underline-offset-4 decoration-slate-600 hover:decoration-slate-400 transition-colors"
          >
            or explore a demo patient case study
          </button>
        </div>

        <p
          className="animate-landing-fade-up mt-8 text-[11px] text-slate-500 max-w-md mx-auto"
          style={{ animationDelay: '440ms' }}
        >
          Grounded in ACOG &amp; Rotterdam Consensus criteria — a decision-support companion, not a diagnosis.
        </p>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Features                                                          */}
      {/* ---------------------------------------------------------------- */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <RevealBlock className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Everything you need, nothing that overwhelms</h2>
          <p className="text-sm text-slate-400 mt-2">Six quiet modules, working together behind one calm dashboard.</p>
        </RevealBlock>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => {
            const Icon = f.icon
            const isHovered = hoveredFeature === i
            return (
              <RevealBlock key={f.title} delayMs={i * 80}>
                <div
                  onMouseEnter={() => setHoveredFeature(i)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  className="h-full ios-glass-card rounded-2xl p-5 transition-transform duration-300"
                  style={{
                    transform: isHovered ? 'translateY(-4px)' : 'none',
                    boxShadow: isHovered ? `0 16px 40px -12px ${f.color}55` : undefined,
                  }}
                >
                  <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center mb-3"
                    style={{ backgroundColor: `${f.color}1A`, border: `1px solid ${f.color}40` }}
                  >
                    <Icon size={18} style={{ color: f.color }} />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-100 mb-1.5">{f.title}</h3>
                  <p className="text-[13px] text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              </RevealBlock>
            )
          })}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* How it works                                                      */}
      {/* ---------------------------------------------------------------- */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <RevealBlock className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Getting started takes about a minute</h2>
        </RevealBlock>

        <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-4">
          <div className="hidden sm:block absolute top-6 left-[16%] right-[16%] h-px bg-gradient-to-r from-rose-500/40 via-indigo-500/40 to-emerald-500/40" />
          {STEPS.map((s, i) => (
            <RevealBlock key={s.title} delayMs={i * 120} className="text-center relative">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-sm font-bold text-white relative z-10 shadow-[0_0_20px_-4px_rgba(244,63,94,0.5)]">
                {i + 1}
              </div>
              <h3 className="text-sm font-semibold text-slate-100 mb-1.5">{s.title}</h3>
              <p className="text-[13px] text-slate-400 leading-relaxed">{s.desc}</p>
            </RevealBlock>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Closing CTA                                                       */}
      {/* ---------------------------------------------------------------- */}
      <section className="max-w-3xl mx-auto px-6 pb-20 text-center">
        <RevealBlock>
          <div className="ios-glass-card rounded-3xl p-10 relative overflow-hidden">
            <Flower2 size={22} className="absolute top-5 left-5 text-rose-400/40 animate-soft-bob" />
            <HeartPulse size={22} className="absolute top-5 right-5 text-indigo-400/40 animate-soft-bob" style={{ animationDelay: '1.5s' }} />
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Ready to feel a little more understood?</h2>
            <p className="text-sm text-slate-400 mb-6 max-w-md mx-auto">
              Your dashboard is personal, private to this browser, and ready in under a minute.
            </p>
            <button
              onClick={onGetStarted}
              className="animate-breathe-glow inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-indigo-500 hover:from-rose-400 hover:to-indigo-400 text-white font-semibold rounded-full px-7 py-3.5 text-sm transition-all"
            >
              Create My Dashboard
              <ArrowRight size={16} />
            </button>
          </div>
        </RevealBlock>

        <p className="mt-8 text-[11px] text-slate-500">
          <span className="font-semibold text-slate-400">AuraDx Clinical Decision Support System.</span>{' '}
          Grounded in ACOG &amp; Rotterdam Consensus criteria. Not a substitute for primary medical diagnosis.
        </p>
      </section>
    </div>
  )
}
