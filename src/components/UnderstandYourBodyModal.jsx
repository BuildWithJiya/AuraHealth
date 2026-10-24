import { useState, useMemo, useEffect } from 'react'
import {
  X,
  BookOpen,
  Search,
  Sparkles,
  HeartPulse,
  Activity,
  CheckCircle2,
  ChevronRight,
  Info,
  HelpCircle,
  Stethoscope,
  ShieldCheck,
} from 'lucide-react'
import { HEALTH_EDUCATION_TOPICS } from '../data/healthEducationData'

export default function UnderstandYourBodyModal({ open, onClose }) {
  const [selectedTopicId, setSelectedTopicId] = useState('cycle-phases')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  // Keyboard shortcut to close on ESC
  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  const categories = useMemo(() => {
    const set = new Set(HEALTH_EDUCATION_TOPICS.map((t) => t.category))
    return ['All', ...Array.from(set)]
  }, [])

  const filteredTopics = useMemo(() => {
    return HEALTH_EDUCATION_TOPICS.filter((topic) => {
      const matchCat = activeCategory === 'All' || topic.category === activeCategory
      const query = searchQuery.toLowerCase().trim()
      if (!query) return matchCat

      const inTitle = topic.title.toLowerCase().includes(query)
      const inSubtitle = topic.subtitle.toLowerCase().includes(query)
      const inSummary = topic.summary.toLowerCase().includes(query)
      const inSections = topic.sections.some(
        (s) =>
          s.heading.toLowerCase().includes(query) ||
          s.text?.toLowerCase().includes(query) ||
          s.clinicalTip?.toLowerCase().includes(query) ||
          s.bullets?.some((b) => b.toLowerCase().includes(query))
      )
      return matchCat && (inTitle || inSubtitle || inSummary || inSections)
    })
  }, [activeCategory, searchQuery])

  // Automatically select the first visible topic if current is filtered out
  const activeTopic = useMemo(() => {
    return (
      filteredTopics.find((t) => t.id === selectedTopicId) ||
      filteredTopics[0] ||
      HEALTH_EDUCATION_TOPICS[0]
    )
  }, [filteredTopics, selectedTopicId])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-3 sm:p-6 overflow-hidden">
      <div
        className="relative w-full max-w-5xl h-[90vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="education-modal-title"
      >
        {/* Header Bar */}
        <div className="border-b border-slate-800 bg-slate-900/90 px-5 py-4 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center shadow-lg shadow-indigo-900/30">
              <HeartPulse size={20} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="education-modal-title" className="font-bold text-lg text-white">
                  Understand Your Body
                </h2>
                <span className="text-[10px] font-bold tracking-wider uppercase bg-rose-500/15 text-rose-300 border border-rose-500/30 rounded-full px-2 py-0.5">
                  Clinical Literacy Guide
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Evidence-based physiology, diagnostic criteria, and self-advocacy tools for women&apos;s healthcare.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="px-5 py-3 border-b border-slate-800/80 bg-slate-950/40 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs font-medium px-3 py-1 rounded-full border transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-indigo-500 border-indigo-400 text-white shadow-sm shadow-indigo-900/50'
                    : 'bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics, symptoms, tests..."
              className="w-full text-xs bg-slate-800/90 border border-slate-700 rounded-full pl-8 pr-3 py-1.5 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Main Content Area: Master-Detail Layout */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 min-h-0 overflow-hidden">
          {/* Sidebar Navigation */}
          <div className="md:col-span-4 border-r border-slate-800/80 bg-slate-950/20 overflow-y-auto p-3 space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-2 py-1">
              Topics ({filteredTopics.length})
            </p>

            {filteredTopics.map((topic) => {
              const isSelected = activeTopic?.id === topic.id
              return (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopicId(topic.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-start justify-between gap-2 ${
                    isSelected
                      ? 'bg-gradient-to-r from-indigo-950/60 to-slate-800/90 border-indigo-500/60 text-white shadow-md'
                      : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-semibold text-indigo-400 bg-indigo-500/10 rounded px-1.5 py-0.5">
                        {topic.category}
                      </span>
                    </div>
                    <h3 className="text-xs font-semibold text-slate-100 truncate">{topic.title}</h3>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{topic.subtitle}</p>
                  </div>
                  <ChevronRight
                    size={14}
                    className={`shrink-0 mt-1 transition-transform ${
                      isSelected ? 'text-indigo-400 translate-x-0.5' : 'text-slate-600'
                    }`}
                  />
                </button>
              )
            })}

            {filteredTopics.length === 0 && (
              <div className="text-center py-10 px-4">
                <HelpCircle size={24} className="mx-auto text-slate-600 mb-2" />
                <p className="text-xs text-slate-400">No matching topics found.</p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setActiveCategory('All')
                  }}
                  className="mt-2 text-xs text-indigo-400 hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>

          {/* Detail View */}
          <div className="md:col-span-8 overflow-y-auto p-5 sm:p-7 space-y-6">
            {activeTopic && (
              <>
                {/* Topic Header */}
                <div className="border-b border-slate-800 pb-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-indigo-400">{activeTopic.category}</span>
                    <span className="text-slate-600">&bull;</span>
                    <span className="text-[11px] font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30 rounded-full px-2.5 py-0.5">
                      {activeTopic.badge}
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {activeTopic.title}
                  </h1>
                  <p className="text-sm text-slate-400 mt-1 font-medium">{activeTopic.subtitle}</p>

                  <div className="mt-4 p-3.5 bg-indigo-950/20 border border-indigo-500/30 rounded-xl text-xs sm:text-sm text-indigo-200/90 leading-relaxed">
                    {activeTopic.summary}
                  </div>
                </div>

                {/* Topic Sections */}
                <div className="space-y-6">
                  {activeTopic.sections.map((section, idx) => (
                    <div key={idx} className="bg-slate-800/40 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-3">
                      <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                        <Sparkles size={14} className="text-amber-400 shrink-0" />
                        {section.heading}
                      </h4>

                      {section.text && (
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{section.text}</p>
                      )}

                      {section.bullets && (
                        <ul className="space-y-2 text-xs sm:text-sm text-slate-300 pl-1">
                          {section.bullets.map((bullet, bIdx) => (
                            <li key={bIdx} className="flex items-start gap-2">
                              <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-1" />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {section.clinicalTip && (
                        <div className="mt-3 flex items-start gap-2 bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-xs text-amber-200">
                          <Stethoscope size={14} className="text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-amber-300">Clinical Tip / Patient Action:</span>{' '}
                            {section.clinicalTip}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Footer Insight Box */}
                <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={20} className="text-emerald-400 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-slate-200">Empower Your Next Visit</p>
                      <p className="text-[11px] text-slate-400">
                        Combine these insights with your customized SOAP Dossier to present a structured case to your doctor.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="shrink-0 text-xs font-medium bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg px-3 py-1.5 transition-colors"
                  >
                    Back to Dashboard
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
