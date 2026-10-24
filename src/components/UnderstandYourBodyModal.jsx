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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-3 sm:p-6 overflow-hidden">
      <div
        className="relative w-full max-w-5xl h-[90vh] bg-[#FAF7F2]/90 backdrop-blur-2xl border border-white/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-[#2E2825]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="education-modal-title"
      >
        {/* Header Bar */}
        <div className="border-b border-[#E8DFD8]/80 bg-white/75 backdrop-blur-md px-6 py-4 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#D96B85] to-[#405A43] flex items-center justify-center shadow-xs">
              <HeartPulse size={20} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="education-modal-title" className="font-serif font-bold text-xl text-[#2E2825]">
                  Understand Your Body
                </h2>
                <span className="text-[10px] font-bold tracking-wider uppercase bg-[#FCE7E8]/85 text-[#D96B85] border border-white/80 rounded-full px-2.5 py-0.5 shadow-2xs backdrop-blur-xs">
                  Clinical Literacy Guide
                </span>
              </div>
              <p className="text-xs text-[#7A726D]">
                Evidence-based physiology, diagnostic criteria, and self-advocacy tools for women&apos;s healthcare.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-white/75 hover:bg-[#FCE7E8] text-[#7A726D] hover:text-[#2E2825] border border-white/80 flex items-center justify-center transition-colors shadow-2xs backdrop-blur-sm"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="px-6 py-3 border-b border-[#E8DFD8]/80 bg-white/60 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs font-semibold px-3 py-1 rounded-full border transition-all whitespace-nowrap shadow-2xs ${
                  activeCategory === cat
                    ? 'bg-[#405A43] border-[#405A43] text-white shadow-xs'
                    : 'bg-white/75 border-white/80 text-[#7A726D] hover:text-[#405A43] hover:bg-[#E8EFE3]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#938A84]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics, symptoms, tests..."
              className="w-full text-xs bg-white/70 backdrop-blur-md border border-white/80 rounded-full pl-8 pr-3 py-1.5 text-[#2E2825] placeholder:text-[#938A84] focus:outline-none focus:border-[#D96B85] focus:ring-1 focus:ring-[#D96B85]/20 transition-colors shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#938A84] hover:text-[#2E2825]"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Main Content Area: Master-Detail Layout */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 min-h-0 overflow-hidden">
          {/* Sidebar Navigation */}
          <div className="md:col-span-4 border-r border-[#E8DFD8]/80 bg-[#F8F0E8]/50 backdrop-blur-md overflow-y-auto p-3.5 space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#6A3D55] px-2 py-1">
              Topics ({filteredTopics.length})
            </p>

            {filteredTopics.map((topic) => {
              const isSelected = activeTopic?.id === topic.id
              return (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopicId(topic.id)}
                  className={`w-full text-left p-3 rounded-2xl border transition-all flex items-start justify-between gap-2 shadow-2xs ${
                    isSelected
                      ? 'bg-white/95 backdrop-blur-md border-[#D96B85] text-[#2E2825] shadow-xs ring-1 ring-[#D96B85]/30'
                      : 'bg-white/60 backdrop-blur-md border border-white/80 text-[#5C5552] hover:bg-white/85 hover:border-[#D96B85]/30'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-bold text-[#405A43] bg-[#E8EFE3] rounded-full px-2 py-0.5">
                        {topic.category}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-[#2E2825] truncate">{topic.title}</h3>
                    <p className="text-[11px] text-[#7A726D] line-clamp-1 mt-0.5">{topic.subtitle}</p>
                  </div>
                  <ChevronRight
                    size={14}
                    className={`shrink-0 mt-1 transition-transform ${
                      isSelected ? 'text-[#D96B85] translate-x-0.5' : 'text-[#938A84]'
                    }`}
                  />
                </button>
              )
            })}

            {filteredTopics.length === 0 && (
              <div className="text-center py-10 px-4">
                <HelpCircle size={24} className="mx-auto text-[#938A84] mb-2" />
                <p className="text-xs text-[#7A726D]">No matching topics found.</p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setActiveCategory('All')
                  }}
                  className="mt-2 text-xs font-semibold text-[#D96B85] hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>

          {/* Detail View */}
          <div className="md:col-span-8 overflow-y-auto p-6 sm:p-8 space-y-6 bg-white/75 backdrop-blur-xl">
            {activeTopic && (
              <>
                {/* Topic Header */}
                <div className="border-b border-[#E8DFD8]/80 pb-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-[#405A43]">{activeTopic.category}</span>
                    <span className="text-[#938A84]">&bull;</span>
                    <span className="text-[11px] font-semibold bg-[#FCE7E8]/85 text-[#D96B85] border border-white/80 rounded-full px-2.5 py-0.5 shadow-2xs backdrop-blur-xs">
                      {activeTopic.badge}
                    </span>
                  </div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2E2825] tracking-tight">
                    {activeTopic.title}
                  </h1>
                  <p className="text-sm text-[#7A726D] mt-1 font-medium">{activeTopic.subtitle}</p>

                  <div className="mt-4 p-4 bg-[#E8EFE3]/80 backdrop-blur-md border border-white/80 rounded-2xl text-xs sm:text-sm text-[#2E2825] leading-relaxed shadow-2xs">
                    {activeTopic.summary}
                  </div>
                </div>

                {/* Topic Sections */}
                <div className="space-y-5">
                  {activeTopic.sections.map((section, idx) => (
                    <div key={idx} className="bg-white/65 backdrop-blur-md border border-white/80 rounded-2xl p-4 sm:p-5 space-y-3 shadow-2xs">
                      <h4 className="text-sm font-bold text-[#2E2825] flex items-center gap-2">
                        <Sparkles size={14} className="text-[#D96B85] shrink-0" />
                        {section.heading}
                      </h4>

                      {section.text && (
                        <p className="text-xs sm:text-sm text-[#5C5552] leading-relaxed">{section.text}</p>
                      )}

                      {section.bullets && (
                        <ul className="space-y-2 text-xs sm:text-sm text-[#5C5552] pl-1">
                          {section.bullets.map((bullet, bIdx) => (
                            <li key={bIdx} className="flex items-start gap-2">
                              <CheckCircle2 size={13} className="text-[#405A43] shrink-0 mt-1" />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {section.clinicalTip && (
                        <div className="mt-3 flex items-start gap-2.5 bg-[#FDF8EE]/80 backdrop-blur-sm border border-white/80 rounded-xl p-3 text-xs text-[#5C5552] shadow-2xs">
                          <Stethoscope size={14} className="text-[#D9A84E] shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-[#D9A84E]">Clinical Tip / Patient Action:</span>{' '}
                            {section.clinicalTip}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Footer Insight Box */}
                <div className="bg-[#E8EFE3]/80 backdrop-blur-md border border-white/80 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={20} className="text-[#405A43] shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-[#2E2825]">Empower Your Next Visit</p>
                      <p className="text-[11px] text-[#7A726D]">
                        Combine these insights with your customized SOAP Dossier to present a structured case to your doctor.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="shrink-0 text-xs font-semibold bg-[#405A43] hover:bg-[#344a37] text-white rounded-full px-4 py-2 shadow-2xs transition-colors"
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
