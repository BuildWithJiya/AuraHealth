import { useState } from 'react'
import {
  ShieldCheck,
  Calendar,
  Heart,
  Sparkles,
  Smartphone,
  UserCheck,
  Bell,
  HeartHandshake,
  Users,
  Clock,
  Feather,
  FileText,
  HelpCircle,
  ArrowRight,
  Flower2,
} from 'lucide-react'
import { useReveal } from '../hooks/useReveal'

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
  const [activeTab, setActiveTab] = useState('Home')
  const [hoveredCard, setHoveredCard] = useState(null)

  return (
    <div className="relative min-h-screen text-[#2E2825] font-sans selection:bg-[#FBEBE8] selection:text-[#C97A72] overflow-x-hidden">
      {/* ------------------------------------------------------------------ */}
      {/* Top Navigation Bar                                                */}
      {/* ------------------------------------------------------------------ */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#EADFD7]/60">
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="h-10 w-10 flex items-center justify-center relative">
              {/* Botanical intertwined heart & leaf logo */}
              <svg viewBox="0 0 48 48" className="w-9 h-9 fill-none">
                <path
                  d="M16 12 C10 12, 6 17, 6 23 C6 31, 16 38, 24 43 C32 38, 42 31, 42 23 C42 17, 38 12, 32 12 C28 12, 25 14, 24 17 C23 14, 20 12, 16 12 Z"
                  stroke="#C97A72"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-90"
                />
                <path
                  d="M24 19 C24 19, 21 27, 24 37"
                  stroke="#526E5B"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <path
                  d="M24 26 C28 24, 33 25, 34 29 C30 31, 26 29, 24 26 Z"
                  fill="#EEF4EC"
                  stroke="#526E5B"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M24 30 C19 28, 14 30, 13 34 C17 35, 21 33, 24 30 Z"
                  fill="#FDF2F0"
                  stroke="#C97A72"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-2xl font-bold tracking-tight text-[#2E2825]">HerHealth</span>
                <span className="text-[10px] font-semibold text-[#526E5B] bg-[#EEF4EC] border border-[#526E5B]/25 rounded-full px-2 py-0.5">
                  AuraHealth
                </span>
              </div>
              <p className="text-[10px] tracking-wider text-[#8A817C] uppercase font-medium">
                Understand &middot; Prevent &middot; Thrive
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#5C5552]">
            {['Home', 'About', 'Features', 'Resources', 'Contact'].map((item) => (
              <button
                key={item}
                onClick={() => {
                  setActiveTab(item)
                  if (item === 'Features' || item === 'About') {
                    document.getElementById('problem-section')?.scrollIntoView({ behavior: 'smooth' })
                  } else if (item === 'Resources') {
                    document.getElementById('help-section')?.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
                className={`relative py-1 transition-colors hover:text-[#2E2825] ${
                  activeTab === item ? 'text-[#C97A72] font-semibold' : ''
                }`}
              >
                {item}
                {activeTab === item && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C97A72] rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Top Right Action Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={onViewDemo}
              className="hidden sm:inline-block text-xs font-semibold text-[#526E5B] hover:text-[#435B4A] underline underline-offset-4 decoration-[#526E5B]/40 hover:decoration-[#526E5B] transition-colors"
            >
              Demo Case Studies
            </button>
            <button
              onClick={onGetStarted}
              className="flex items-center gap-2 bg-[#526E5B] hover:bg-[#435B4A] text-white text-xs sm:text-sm font-medium rounded-full px-5 py-2.5 shadow-sm transition-all hover:shadow-md"
            >
              Get Started <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* Hero Section                                                      */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative pt-12 pb-16 lg:pt-16 lg:pb-24 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="animate-landing-fade-up">
              <span className="font-script text-2xl sm:text-3xl text-[#C97A72] block mb-1">
                Your Health, Your Story &#9825;
              </span>
              <h1 className="font-serif text-4xl sm:text-6xl text-[#2E2825] font-normal leading-[1.12] tracking-tight">
                Better Care for
                <br />
                Every Stage of{' '}
                <span className="italic text-[#C97A72] relative font-serif">
                  You
                </span>{' '}
                <span className="font-script text-3xl text-[#C97A72] inline-block -translate-y-1">
                  &#9825;
                </span>
              </h1>
            </div>

            <p
              className="animate-landing-fade-up text-[#5C5552] text-base sm:text-lg leading-relaxed max-w-xl font-normal"
              style={{ animationDelay: '120ms' }}
            >
              A digital solution to help women understand, track and manage their health &mdash; with expert guidance, smart tools and compassionate support.
            </p>

            <div
              className="animate-landing-fade-up pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4"
              style={{ animationDelay: '200ms' }}
            >
              <button
                onClick={onGetStarted}
                className="group flex items-center gap-2.5 bg-[#526E5B] hover:bg-[#435B4A] text-white font-medium rounded-full px-7 py-3.5 text-sm sm:text-base shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                Start Your Health Journey
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onViewDemo}
                className="text-xs sm:text-sm font-medium text-[#7A726D] hover:text-[#2E2825] px-2 py-1 transition-colors"
              >
                or view interactive patient demo &rarr;
              </button>
            </div>

            {/* 4 Feature Badges Row (as shown in reference image) */}
            <div
              className="animate-landing-fade-up pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-[#E8DFD8]/70"
              style={{ animationDelay: '280ms' }}
            >
              {[
                { icon: ShieldCheck, title: 'Track Symptoms' },
                { icon: Calendar, title: 'Get Personalized Guidance' },
                { icon: Heart, title: 'Access Expert Support' },
                { icon: Flower2, title: 'Live Healthier, Happier' },
              ].map((f, idx) => {
                const Icon = f.icon
                return (
                  <div key={idx} className="flex flex-col items-center sm:items-start text-center sm:text-left group">
                    <div className="h-10 w-10 rounded-full bg-[#FDF2F0] border border-[#C97A72]/20 flex items-center justify-center text-[#C97A72] mb-2 shadow-xs group-hover:bg-[#FBE4E1] transition-colors">
                      <Icon size={18} />
                    </div>
                    <span className="text-xs font-semibold text-[#3E3834] leading-tight">
                      {f.title}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Column: Hero Visual Graphic (Clinical Consultation with Warm Aesthetics) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Watercolor wash background blob */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#FDF2F0] via-[#EEF4EC] to-[#FAF7F2] rounded-3xl -z-10 blur-xl opacity-80" />

              {/* Consultation Card Vignette */}
              <div className="relative rounded-3xl overflow-hidden border border-[#E4D8CE] shadow-lg shadow-[#E4D8CE]/50 bg-gradient-to-b from-[#FFFDF9] to-[#F7F2EC] p-3">
                {/* SVG Illustration depicting Warm Clinic consultation */}
                <svg viewBox="0 0 460 380" className="w-full h-auto rounded-2xl block bg-[#FDF9F5]">
                  <defs>
                    <linearGradient id="warmWall" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#FAF4EE" />
                      <stop offset="100%" stopColor="#F5ECE2" />
                    </linearGradient>
                    <linearGradient id="doctorCoat" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="100%" stopColor="#F0EFEA" />
                    </linearGradient>
                    <linearGradient id="patientSweater" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#ECAAA3" />
                      <stop offset="100%" stopColor="#D98A82" />
                    </linearGradient>
                    <linearGradient id="scrubGreen" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#678370" />
                      <stop offset="100%" stopColor="#4A6553" />
                    </linearGradient>
                  </defs>

                  {/* Warm Wall background */}
                  <rect width="460" height="380" fill="url(#warmWall)" />

                  {/* Warm wall art poster with script text */}
                  <rect x="290" y="30" width="130" height="90" rx="6" fill="#FFFDFB" stroke="#DECBC0" strokeWidth="1.5" />
                  <text x="355" y="58" textAnchor="middle" fill="#C97A72" fontFamily="'Cormorant Garamond', Georgia, serif" fontSize="13" fontStyle="italic" fontWeight="600">
                    Healthy Women
                  </text>
                  <text x="355" y="76" textAnchor="middle" fill="#526E5B" fontFamily="'Cormorant Garamond', Georgia, serif" fontSize="13" fontStyle="italic" fontWeight="600">
                    Stronger Futures
                  </text>
                  <text x="355" y="98" textAnchor="middle" fill="#C97A72" fontFamily="'Caveat', cursive" fontSize="15">
                    &#9825;
                  </text>

                  {/* Potted fiddle-leaf plant in corner */}
                  <path d="M420 180 Q435 150 425 120 Q405 135 415 175 Z" fill="#7E9A82" opacity="0.8" />
                  <path d="M400 170 Q380 140 400 115 Q415 135 405 165 Z" fill="#5A765E" opacity="0.85" />
                  <path d="M410 190 Q400 230 420 250" stroke="#7A685D" strokeWidth="2.5" />
                  <rect x="395" y="245" width="40" height="35" rx="4" fill="#D89D77" />

                  {/* Botanical eucalyptus spray in top left */}
                  <path d="M20 40 Q70 60 110 120" stroke="#A3B899" strokeWidth="1.5" fill="none" opacity="0.7" />
                  <ellipse cx="45" cy="50" rx="9" ry="5" transform="rotate(-20 45 50)" fill="#C5D8A4" opacity="0.6" />
                  <ellipse cx="75" cy="70" rx="10" ry="6" transform="rotate(30 75 70)" fill="#8FA98F" opacity="0.6" />
                  <ellipse cx="100" cy="100" rx="10" ry="6" transform="rotate(10 100 100)" fill="#C5D8A4" opacity="0.6" />

                  {/* Doctor Figure (Female, friendly clinician) */}
                  <g transform="translate(140, 60)">
                    {/* Hair */}
                    <path d="M40 50 C25 25, 85 15, 95 45 C105 75, 100 115, 95 125 C85 85, 35 85, 40 50 Z" fill="#2E2421" />
                    {/* Hair bun */}
                    <circle cx="95" cy="45" r="14" fill="#2E2421" />
                    {/* Neck */}
                    <rect x="58" y="90" width="18" height="24" rx="4" fill="#F4C7B8" />
                    {/* Face */}
                    <ellipse cx="68" cy="72" rx="22" ry="26" fill="#FBD5C8" />
                    {/* Smile and features */}
                    <path d="M72 82 Q80 88 88 82" stroke="#A75D53" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                    <ellipse cx="80" cy="68" rx="2.2" ry="2.2" fill="#3D2D29" />
                    <path d="M75 62 Q82 59 87 62" stroke="#3D2D29" strokeWidth="1.2" fill="none" />

                    {/* Scrub shirt beneath coat */}
                    <path d="M45 110 L90 110 L85 160 L50 160 Z" fill="url(#scrubGreen)" />

                    {/* Stethoscope */}
                    <path d="M52 115 Q42 165 65 185 Q75 195 82 175 Q92 145 84 115" stroke="#374151" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    <circle cx="65" cy="186" r="6" fill="#9CA3AF" stroke="#374151" strokeWidth="1.5" />

                    {/* White Lab Coat */}
                    <path d="M30 115 C20 160, 20 220, 18 310 L115 310 C115 220, 115 160, 105 115 L88 115 L68 150 L46 115 Z" fill="url(#doctorCoat)" stroke="#E4DFD7" strokeWidth="1" />
                    {/* Collar lapels */}
                    <path d="M46 115 L68 155 L68 220" stroke="#DDD6CC" strokeWidth="1.2" fill="none" />
                    <path d="M88 115 L68 155" stroke="#DDD6CC" strokeWidth="1.2" fill="none" />

                    {/* Arms holding tablet */}
                    <path d="M28 155 Q40 210 75 220" stroke="url(#doctorCoat)" strokeWidth="18" strokeLinecap="round" fill="none" />
                    <path d="M102 155 Q95 205 85 220" stroke="url(#doctorCoat)" strokeWidth="18" strokeLinecap="round" fill="none" />
                    {/* Hands */}
                    <circle cx="75" cy="220" r="7" fill="#FBD5C8" />
                    <circle cx="88" cy="220" r="7" fill="#FBD5C8" />

                    {/* Clinical Tablet */}
                    <rect x="68" y="200" width="46" height="32" rx="3" fill="#242B35" transform="rotate(-6 68 200)" />
                    <rect x="71" y="203" width="40" height="26" rx="2" fill="#E8F4F8" transform="rotate(-6 71 203)" />
                    <line x1="75" y1="210" x2="95" y2="208" stroke="#526E5B" strokeWidth="2" strokeLinecap="round" />
                    <line x1="75" y1="216" x2="102" y2="214" stroke="#C97A72" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="75" y1="221" x2="90" y2="219" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
                  </g>

                  {/* Patient Figure (Warm, smiling in blush sweater) */}
                  <g transform="translate(285, 75)">
                    {/* Hair */}
                    <path d="M25 50 C20 20, 70 20, 70 55 C70 95, 60 145, 65 170 C50 145, 20 120, 25 50 Z" fill="#3D2924" />
                    {/* Face */}
                    <ellipse cx="32" cy="72" rx="20" ry="24" fill="#FDE2D7" />
                    {/* Eyes and smile looking at doctor */}
                    <path d="M24 74 Q20 78 18 74" stroke="#A75D53" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                    <ellipse cx="23" cy="66" rx="2" ry="2" fill="#3D2D29" />
                    <path d="M21 60 Q26 58 30 61" stroke="#3D2D29" strokeWidth="1" fill="none" />

                    {/* Warm blush sweater */}
                    <path d="M12 110 C-5 155, -8 220, -10 295 L80 295 C82 220, 78 155, 60 110 Z" fill="url(#patientSweater)" />
                    {/* Arm in front */}
                    <path d="M18 145 Q0 190 -25 205" stroke="url(#patientSweater)" strokeWidth="18" strokeLinecap="round" fill="none" />
                    <circle cx="-25" cy="205" r="7" fill="#FDE2D7" />
                  </g>

                  {/* Soft bottom vignette curve */}
                  <path d="M0 340 Q230 310 460 340 L460 380 L0 380 Z" fill="#F9F4EE" />
                </svg>

                {/* Floating pill notification on image */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md rounded-2xl p-3 border border-[#E8DFD8] shadow-md flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#526E5B] animate-pulse" />
                    <div>
                      <p className="text-xs font-bold text-[#2E2825]">Compassionate Care Protocol</p>
                      <p className="text-[11px] text-[#7A726D]">Empowering women with verified clinical insight</p>
                    </div>
                  </div>
                  <span className="font-script text-lg text-[#C97A72]">&#9825;</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Curved Wave Transition into "The Problem" (Matcha / Sage Pastel)    */}
      {/* ------------------------------------------------------------------ */}
      <div className="relative w-full overflow-hidden leading-none text-[#F2F6F0]">
        <svg viewBox="0 0 1440 100" fill="currentColor" className="w-full h-12 sm:h-20 preserve-3d">
          <path d="M0,32L80,48C160,64,320,96,480,96C640,96,800,64,960,48C1120,32,1280,32,1360,32L1440,32L1440,100L1360,100C1280,100,1120,100,960,100C800,100,640,100,480,100C320,100,160,100,80,100L0,100Z" />
        </svg>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* "THE PROBLEM" Section                                              */}
      {/* ------------------------------------------------------------------ */}
      <section id="problem-section" className="bg-[#F2F6F0] py-14 lg:py-20 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left side: Serene woman profile with watercolor botanical leaves */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center">
              <RevealBlock className="relative">
                <div className="w-56 h-64 sm:w-64 sm:h-72 rounded-3xl bg-[#FDEEEB] border border-[#E9CBC4] p-4 flex flex-col items-center justify-center shadow-sm relative overflow-hidden">
                  {/* Subtle botanical leaves in background */}
                  <svg viewBox="0 0 200 240" className="w-full h-full">
                    {/* Eucalyptus leaves backdrop */}
                    <g opacity="0.6">
                      <path d="M30 180 Q10 130 35 90 Q45 130 30 180 Z" fill="#8FA98F" />
                      <path d="M170 190 Q190 140 165 95 Q155 140 170 190 Z" fill="#A3B899" />
                      <path d="M20 220 Q5 170 25 150" stroke="#7A937A" strokeWidth="2" fill="none" />
                      <path d="M180 220 Q195 175 175 150" stroke="#7A937A" strokeWidth="2" fill="none" />
                    </g>

                    {/* Silhouette illustration of woman with closed eyes, peace */}
                    <g transform="translate(45, 30)">
                      {/* Flowing hair */}
                      <path d="M15 50 C5 15, 60 5, 75 35 C85 65, 80 145, 90 170 C70 165, 10 150, 5 110 C0 85, 20 65, 15 50 Z" fill="#3D2924" />
                      {/* Face silhouette */}
                      <path d="M20 60 C15 55, 30 40, 48 44 C62 48, 65 65, 60 85 C55 105, 42 115, 32 110 C22 105, 18 80, 20 60 Z" fill="#F8DDD8" />
                      {/* Neck and shoulder */}
                      <path d="M38 108 L42 140 C35 150, 15 155, 0 160 L0 170 L80 170 L75 140 L50 108 Z" fill="#F8DDD8" />
                      {/* Soft blush pink top */}
                      <path d="M0 160 C15 155, 35 150, 42 140 C52 145, 68 152, 80 155 L85 200 L-10 200 Z" fill="#ECAAA3" />
                      {/* Eyelash resting */}
                      <path d="M26 66 Q30 70 34 66" stroke="#4A342F" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                      {/* Gentle lips */}
                      <path d="M20 84 Q24 88 28 84" stroke="#C97A72" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                    </g>
                  </svg>

                  {/* Handwritten script badge "You deserve care ♡" */}
                  <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-xs px-3 py-1 rounded-full border border-[#DECBC0]">
                    <span className="font-script text-base text-[#C97A72] block leading-tight">
                      You deserve care &#9825;
                    </span>
                  </div>
                </div>
              </RevealBlock>
            </div>

            {/* Center/Right: Problem headline and 4 stacked cards */}
            <div className="lg:col-span-8 space-y-6">
              <RevealBlock>
                <span className="text-[11px] font-bold text-[#C97A72] uppercase tracking-widest block mb-1">
                  The Problem
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-[#2E2825] font-normal leading-snug">
                  Women&apos;s Healthcare Needs a Smarter, Kinder Approach
                </h2>
                <p className="mt-3 text-sm sm:text-base text-[#5C5552] leading-relaxed max-w-2xl font-normal">
                  From diagnosis delays to symptom tracking, health awareness and access to meaningful clinical insights &mdash; women often face gaps in care. It&apos;s time for a solution that truly understands their unique needs.
                </p>
              </RevealBlock>

              {/* 4 Stacked Problem Cards (as shown in reference image) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {[
                  {
                    icon: Clock,
                    title: 'Late diagnosis & missed symptoms',
                    desc: 'Conditions like PCOS and Endometriosis take an average of 4-7 years to be correctly diagnosed.',
                  },
                  {
                    icon: Feather,
                    title: 'Lack of mental & emotional support',
                    desc: 'Hormonal fluctuations affect mood, cognition, and sleep without structured clinical validation.',
                  },
                  {
                    icon: FileText,
                    title: 'Limited access to trusted clinical insights',
                    desc: 'Generic medical search leads to anxiety; standard reference ranges ignore monthly cyclic phases.',
                  },
                  {
                    icon: HelpCircle,
                    title: 'No safe space to ask questions',
                    desc: 'Rushed appointments leave intimate health concerns unanswered and invalidated.',
                  },
                ].map((item, idx) => {
                  const Icon = item.icon
                  return (
                    <RevealBlock key={idx} delayMs={idx * 70}>
                      <div className="h-full bg-white/80 hover:bg-white rounded-2xl p-4 border border-[#E2DAD1] shadow-xs hover:shadow-sm transition-all flex items-start gap-3.5">
                        <div className="h-9 w-9 rounded-xl bg-[#FDF2F0] border border-[#C97A72]/20 flex items-center justify-center text-[#C97A72] shrink-0 mt-0.5">
                          <Icon size={17} />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-[#2E2825] leading-snug">
                            {item.title}
                          </h3>
                          <p className="text-xs text-[#7A726D] mt-1 leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    </RevealBlock>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Curved Wave Transition into "How We Help"                          */}
      {/* ------------------------------------------------------------------ */}
      <div className="relative w-full overflow-hidden leading-none text-[#F2F6F0]">
        <svg viewBox="0 0 1440 80" fill="currentColor" className="w-full h-10 sm:h-16 rotate-180 preserve-3d">
          <path d="M0,32L80,48C160,64,320,96,480,96C640,96,800,64,960,48C1120,32,1280,32,1360,32L1440,32L1440,100L1360,100C1280,100,1120,100,960,100C800,100,640,100,480,100C320,100,160,100,80,100L0,100Z" />
        </svg>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* "HOW WE HELP" Section (5 Soft Cards)                               */}
      {/* ------------------------------------------------------------------ */}
      <section id="help-section" className="py-16 lg:py-24 max-w-6xl mx-auto px-6">
        <RevealBlock className="text-center max-w-xl mx-auto mb-12">
          <span className="text-[11px] font-bold text-[#C97A72] uppercase tracking-widest block mb-1">
            How We Help
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#2E2825] font-normal tracking-tight">
            Your Health, in Your Hands{' '}
            <span className="font-script text-3xl text-[#C97A72] inline-block -translate-y-1">
              &#9825;
            </span>
          </h2>
        </RevealBlock>

        {/* 5 Soft Cards Grid matching the Reference Image */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              icon: Smartphone,
              title: 'Symptom Tracker',
              desc: 'Log your symptoms, spot patterns and get personalized insights.',
              bgBadge: '#FDF2F0',
              iconColor: '#C97A72',
            },
            {
              icon: UserCheck,
              title: 'Expert Guidance',
              desc: 'Access trusted advice from certified women&apos;s health specialists.',
              bgBadge: '#EEF4EC',
              iconColor: '#526E5B',
            },
            {
              icon: Bell,
              title: 'Health Reminders',
              desc: 'Stay on track with period cycles, check-ups, meds and more.',
              bgBadge: '#FDF7EE',
              iconColor: '#D4A373',
            },
            {
              icon: HeartHandshake,
              title: 'Mental Wellness Support',
              desc: 'Because your emotional health matters too.',
              bgBadge: '#FDF2F0',
              iconColor: '#C97A72',
            },
            {
              icon: Users,
              title: 'Safe & Supportive Space',
              desc: 'Ask questions, share experiences, and feel less alone.',
              bgBadge: '#EEF4EC',
              iconColor: '#526E5B',
            },
          ].map((card, idx) => {
            const Icon = card.icon
            const isHovered = hoveredCard === idx
            return (
              <RevealBlock key={idx} delayMs={idx * 60}>
                <div
                  onMouseEnter={() => setHoveredCard(idx)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className={`h-full rounded-2xl p-5 text-center flex flex-col items-center justify-between transition-all duration-300 border ${
                    isHovered
                      ? 'bg-white shadow-md -translate-y-1 border-[#C97A72]/40'
                      : 'bg-white/70 hover:bg-white shadow-xs border-[#E8DFD8]/80'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    {/* Circle icon pill */}
                    <div
                      className="h-12 w-12 rounded-full flex items-center justify-center mb-3.5 transition-transform duration-300"
                      style={{
                        backgroundColor: card.bgBadge,
                        color: card.iconColor,
                        transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                      }}
                    >
                      <Icon size={22} />
                    </div>
                    <h3 className="text-sm font-semibold text-[#2E2825] mb-2 leading-snug">
                      {card.title}
                    </h3>
                    <p className="text-xs text-[#7A726D] leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                </div>
              </RevealBlock>
            )
          })}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Bottom Signature & Emotional Quote                               */}
        {/* ---------------------------------------------------------------- */}
        <RevealBlock className="mt-16 text-center max-w-xl mx-auto space-y-3">
          <div className="flex items-center justify-center gap-4 text-[#DECBC0]">
            <span className="h-px w-12 bg-[#DECBC0]" />
            <Flower2 size={16} className="text-[#C97A72]" />
            <span className="h-px w-12 bg-[#DECBC0]" />
          </div>

          <p className="font-serif italic text-lg sm:text-xl text-[#5C5552] leading-relaxed">
            &ldquo;Because every woman deserves to be heard, understood and cared for.&rdquo;
          </p>

          <span className="font-script text-3xl text-[#C97A72] block">
            &#9825;
          </span>

          {/* Action triggers */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onGetStarted}
              className="flex items-center gap-2 bg-[#526E5B] hover:bg-[#435B4A] text-white font-medium rounded-full px-7 py-3 text-sm shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              Begin Your Journey <ArrowRight size={15} />
            </button>
            <button
              onClick={onViewDemo}
              className="text-xs font-semibold text-[#C97A72] hover:text-[#B4645C] underline underline-offset-4 decoration-[#C97A72]/40 transition-colors"
            >
              Explore Sample Clinical Dossier
            </button>
          </div>
        </RevealBlock>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Clinical Grounding Note                                            */}
      {/* ------------------------------------------------------------------ */}
      <footer className="border-t border-[#E8DFD8]/80 py-6 bg-[#FAF7F2] text-center text-[11px] text-[#938A84]">
        <div className="max-w-4xl mx-auto px-4">
          <p>
            <span className="font-semibold text-[#5C5552]">AuraHealth Clinical Decision Support System.</span>{' '}
            Grounded in ACOG &amp; Rotterdam Consensus criteria. Not a substitute for primary medical diagnosis. Always consult a licensed healthcare professional.
          </p>
        </div>
      </footer>
    </div>
  )
}
