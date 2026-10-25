import { useState, useMemo, useEffect } from 'react'
import {
  X,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Sliders,
  Check,
  Info,
  Clock,
  Sparkles,
  Maximize2,
  Minimize2,
  RotateCcw,
} from 'lucide-react'
import {
  CLUE_CATEGORIES,
  loadClueDailyLogs,
  saveClueDailyLog,
  loadEnabledCategories,
  saveEnabledCategories,
  convertPillsToSymptoms,
} from '../utils/clueTrackerData'
import { getCyclePhase, PHASE_META } from '../utils/cycleEngine'

// Format date helper: "25 Oct, 2026"
function formatDateHeader(date) {
  const day = date.getDate()
  const month = date.toLocaleDateString('en-US', { month: 'short' })
  const year = date.getFullYear()
  const isToday = new Date().toDateString() === date.toDateString()
  return `${isToday ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' })}: ${day} ${month}, ${year}`
}

function toDateKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export default function ClueDailyTracker({
  open = true,
  onClose,
  isModal = false,
  day = 24,
  cycleLength = 28,
  onDayChange,
  onAddSymptom,
  activeLifeStageId = 'reproductive',
}) {
  // Current selected calendar date
  const [selectedDate, setSelectedDate] = useState(() => {
    // Default to current date (e.g. Oct 25, 2026)
    return new Date()
  })

  // Date strip window offset (0 = current week)
  const [weekOffset, setWeekOffset] = useState(0)

  // Loaded daily logs index: { [dateKey]: { pills: [], sleep: { hours, minutes } } }
  const [allLogs, setAllLogs] = useState(() => loadClueDailyLogs())

  // Visible category settings
  const [enabledCategoryIds, setEnabledCategoryIds] = useState(() => loadEnabledCategories())
  const [customizingCategories, setCustomizingCategories] = useState(false)

  // Currently selected pills for the active date
  const dateKey = useMemo(() => toDateKey(selectedDate), [selectedDate])
  const [activePills, setActivePills] = useState(() => {
    const existing = allLogs[dateKey]
    return existing?.pills || []
  })

  // Sleep duration state
  const [sleepHours, setSleepHours] = useState(() => {
    const existing = allLogs[dateKey]
    return existing?.sleep?.hours ?? 7
  })
  const [sleepMinutes, setSleepMinutes] = useState(() => {
    const existing = allLogs[dateKey]
    return existing?.sleep?.minutes ?? 30
  })

  // Active learn-more category accordion
  const [activeLearnMore, setActiveLearnMore] = useState(null)

  // Save feedback state
  const [justSaved, setJustSaved] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  // Inline month picker open state
  const [showMonthPicker, setShowMonthPicker] = useState(false)

  // When selectedDate changes, sync local state with saved data for that date
  useEffect(() => {
    const savedForDate = allLogs[dateKey]
    if (savedForDate) {
      setActivePills(savedForDate.pills || [])
      setSleepHours(savedForDate.sleep?.hours ?? 7)
      setSleepMinutes(savedForDate.sleep?.minutes ?? 0)
    } else {
      setActivePills([])
      setSleepHours(7)
      setSleepMinutes(0)
    }
    setJustSaved(false)
  }, [dateKey, allLogs])

  // Generate 7-day strip centered on weekOffset
  const dateStrip = useMemo(() => {
    const base = new Date()
    // Move base by weekOffset * 7 days
    base.setDate(base.getDate() + weekOffset * 7)
    // Find Sunday of this week
    const dayOfWeek = base.getDay() // 0 = Sun
    const sunday = new Date(base)
    sunday.setDate(base.getDate() - dayOfWeek)

    const days = []
    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

    for (let i = 0; i < 7; i++) {
      const d = new Date(sunday)
      d.setDate(sunday.getDate() + i)
      const dKey = toDateKey(d)
      const isSelected = d.toDateString() === selectedDate.toDateString()
      const isToday = d.toDateString() === new Date().toDateString()
      const hasLog = allLogs[dKey]?.pills?.length > 0

      // Map day to cycle phase prediction
      const diffFromToday = Math.round((d - new Date()) / 86400000)
      const predictedCycleDay = (((day + diffFromToday - 1) % cycleLength) + cycleLength) % cycleLength + 1
      const phase = getCyclePhase(predictedCycleDay, cycleLength)

      days.push({
        date: d,
        dateKey: dKey,
        dayNumber: d.getDate(),
        dayName: dayNames[i],
        isSelected,
        isToday,
        hasLog,
        phase,
        predictedCycleDay,
        isOvulationDay: predictedCycleDay === Math.round(cycleLength / 2) || predictedCycleDay === 14,
        isPeriodDay: predictedCycleDay <= 5,
      })
    }
    return days
  }, [selectedDate, weekOffset, allLogs, day, cycleLength])

  // Toggle pill
  const togglePill = (pillId) => {
    setActivePills((prev) => {
      const next = prev.includes(pillId) ? prev.filter((id) => id !== pillId) : [...prev, pillId]
      setJustSaved(false)
      return next
    })
  }

  // Handle Save
  const handleSave = () => {
    const logData = {
      pills: activePills,
      sleep: { hours: sleepHours, minutes: sleepMinutes },
      timestamp: new Date().toISOString(),
    }

    // 1. Save to local storage for this date
    saveClueDailyLog(dateKey, logData)
    setAllLogs((prev) => ({ ...prev, [dateKey]: logData }))

    // 2. Convert to Aura clinical symptom objects and append to symptomLog
    if (onAddSymptom) {
      const calculatedCycleDay = (((day + Math.round((selectedDate - new Date()) / 86400000) - 1) % cycleLength) + cycleLength) % cycleLength + 1
      const phase = getCyclePhase(calculatedCycleDay, cycleLength)
      const symptoms = convertPillsToSymptoms({
        selectedPills: activePills,
        sleepDuration: { hours: sleepHours, minutes: sleepMinutes },
        dateKey,
        cycleDay: calculatedCycleDay,
        cycleLength,
        phase,
      })

      symptoms.forEach((s) => onAddSymptom(s))
    }

    setJustSaved(true)
    setSaveMessage(`Saved ${activePills.length} biomarkers for ${selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`)

    window.setTimeout(() => {
      setJustSaved(false)
    }, 3000)
  }

  // Quick adjust sleep
  const adjustSleep = (deltaHours, deltaMins) => {
    setSleepHours((h) => {
      let newH = h + deltaHours
      if (newH < 0) newH = 0
      if (newH > 24) newH = 24
      return newH
    })
    setSleepMinutes((m) => {
      let newM = m + deltaMins
      if (newM < 0) newM = 0
      if (newM >= 60) newM = 0
      return newM
    })
    setJustSaved(false)
  }

  // Toggle category visibility
  const toggleCategoryEnabled = (id) => {
    setEnabledCategoryIds((prev) => {
      const next = prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
      saveEnabledCategories(next)
      return next
    })
  }

  // Reset categories to default
  const resetCategories = () => {
    const all = CLUE_CATEGORIES.map((c) => c.id)
    setEnabledCategoryIds(all)
    saveEnabledCategories(all)
  }

  const visibleCategories = useMemo(() => {
    return CLUE_CATEGORIES.filter((c) => enabledCategoryIds.includes(c.id))
  }, [enabledCategoryIds])

  if (!open && isModal) return null

  // Card Content
  const trackerContent = (
    <div className="relative flex flex-col h-full bg-[#161618] text-white rounded-3xl overflow-hidden shadow-2xl border border-white/10 select-none">
      {/* ------------------------------------------------------------- */}
      {/* TOP HEADER BAR (Clue Style: Close, Date, Calendar quick jump)  */}
      {/* ------------------------------------------------------------- */}
      <div className="px-4 py-3.5 border-b border-white/10 flex items-center justify-between bg-[#1D1D21]">
        <div className="flex items-center gap-2">
          {isModal && onClose ? (
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Close Tracker"
            >
              <X size={18} />
            </button>
          ) : (
            <div className="h-2.5 w-2.5 rounded-full bg-[#20B2AA] animate-pulse" />
          )}
          <span className="text-sm sm:text-base font-semibold tracking-tight text-white/95">
            {formatDateHeader(selectedDate)}
          </span>
        </div>

        {/* Quick Month Date Picker Trigger */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowMonthPicker((v) => !v)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#28282E] hover:bg-[#34343C] border border-white/15 text-xs font-bold text-[#4DEEEA] transition-colors cursor-pointer"
            title="Pick a date"
          >
            <CalendarIcon size={13} />
            <span>{selectedDate.getDate()}</span>
          </button>
        </div>
      </div>

      {/* Month Date Jump Dropdown */}
      {showMonthPicker && (
        <div className="bg-[#232328] border-b border-white/10 p-3 flex items-center justify-between text-xs animate-landing-fade-up">
          <button
            onClick={() => {
              const d = new Date(selectedDate)
              d.setDate(d.getDate() - 7)
              setSelectedDate(d)
              setWeekOffset((w) => w - 1)
            }}
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium"
          >
            &larr; Prev Week
          </button>
          <input
            type="date"
            value={dateKey}
            onChange={(e) => {
              if (e.target.value) {
                const parts = e.target.value.split('-').map(Number)
                const newD = new Date(parts[0], parts[1] - 1, parts[2])
                setSelectedDate(newD)
                setShowMonthPicker(false)
              }
            }}
            className="bg-[#18181B] text-white px-3 py-1 rounded-lg border border-white/20 text-xs font-semibold focus:outline-none"
          />
          <button
            onClick={() => {
              const d = new Date(selectedDate)
              d.setDate(d.getDate() + 7)
              setSelectedDate(d)
              setWeekOffset((w) => w + 1)
            }}
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium"
          >
            Next Week &rarr;
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* HORIZONTAL CALENDAR DATE STRIP (S M T W T F S with Day blocks) */}
      {/* ------------------------------------------------------------- */}
      <div className="px-3 pt-3 pb-2.5 bg-[#18181A] border-b border-white/5">
        <div className="flex items-center justify-between mb-1.5 px-1">
          <button
            onClick={() => setWeekOffset((w) => w - 1)}
            className="h-6 w-6 rounded-md hover:bg-white/10 text-white/50 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Previous Week"
          >
            <ChevronLeft size={15} />
          </button>
          <span className="text-[11px] font-semibold text-white/60 tracking-wider uppercase">
            Cycle Day {day} &middot; {getCyclePhase(day, cycleLength)}
          </span>
          <button
            onClick={() => setWeekOffset((w) => w + 1)}
            className="h-6 w-6 rounded-md hover:bg-white/10 text-white/50 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Next Week"
          >
            <ChevronRight size={15} />
          </button>
        </div>

        {/* 7-Day Grid */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {dateStrip.map((item) => (
            <button
              key={item.dateKey}
              type="button"
              onClick={() => {
                setSelectedDate(item.date)
                if (onDayChange && item.predictedCycleDay) {
                  onDayChange(item.predictedCycleDay)
                }
              }}
              className={`relative flex flex-col items-center py-1.5 sm:py-2 rounded-xl transition-all cursor-pointer ${
                item.isSelected
                  ? 'border-2 border-[#4DEEEA] bg-[#22333B] shadow-[0_0_12px_rgba(77,238,234,0.25)]'
                  : 'border border-white/10 bg-[#202024] hover:bg-[#28282E]'
              }`}
            >
              {/* Day of week letter */}
              <span className="text-[10px] font-medium text-white/50 mb-1">
                {item.dayName}
              </span>

              {/* Day number with Cycle Phase bar/badge */}
              <div
                className={`w-full py-1 text-center rounded-lg text-xs font-bold transition-colors ${
                  item.isPeriodDay
                    ? 'bg-[#B91C1C]/40 text-[#FFA8B8]'
                    : item.isOvulationDay
                    ? 'bg-[#007A87]/50 text-[#80F4FF]'
                    : 'bg-white/5 text-white/90'
                }`}
              >
                <div className="flex items-center justify-center gap-1">
                  {item.isOvulationDay && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#4DEEEA]" />
                  )}
                  <span>{item.dayNumber}</span>
                </div>
              </div>

              {/* Logged indicator dot */}
              {item.hasLog && (
                <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-[#E02E49]" />
              )}
            </button>
          ))}
        </div>

        {/* Customize Button Bar */}
        <div className="flex items-center justify-center mt-3">
          <button
            type="button"
            onClick={() => setCustomizingCategories(true)}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-[#007A87] hover:bg-[#008f9e] active:scale-95 text-white shadow-xs transition-all cursor-pointer"
          >
            <Sliders size={13} />
            <span>Customize ⥯</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SCROLLABLE CATEGORY SECTIONS (Clue Pills)                     */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 pb-24">
        {visibleCategories.map((cat) => {
          const isLearnOpen = activeLearnMore === cat.id

          // Special rendering for Sleep Duration module (Image 2)
          if (cat.isDuration) {
            return (
              <div key={cat.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                    {cat.title}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveLearnMore(isLearnOpen ? null : cat.id)}
                    className="text-xs text-white/50 hover:text-white transition-colors cursor-pointer"
                  >
                    Learn more &gt;
                  </button>
                </div>

                {isLearnOpen && (
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white/80 animate-landing-fade-up">
                    <p>{cat.learnMore}</p>
                  </div>
                )}

                {/* Digital Sleep Display Card */}
                <div className="p-5 rounded-2xl bg-[#202024] border border-white/10 text-center">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <div className="text-3xl sm:text-4xl font-mono font-bold tracking-tight text-white/90">
                      <span>{String(sleepHours).padStart(2, '0')}</span>
                      <span className="text-base sm:text-lg font-sans font-medium text-white/50 ml-1 mr-3">h</span>
                      <span>{String(sleepMinutes).padStart(2, '0')}</span>
                      <span className="text-base sm:text-lg font-sans font-medium text-white/50 ml-1">min</span>
                    </div>
                  </div>

                  {/* Steppers & Quick Presets */}
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => adjustSleep(-1, 0)}
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
                    >
                      -1 hr
                    </button>
                    <button
                      type="button"
                      onClick={() => adjustSleep(0, -15)}
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
                    >
                      -15m
                    </button>
                    <button
                      type="button"
                      onClick={() => adjustSleep(0, 15)}
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
                    >
                      +15m
                    </button>
                    <button
                      type="button"
                      onClick={() => adjustSleep(1, 0)}
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
                    >
                      +1 hr
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSleepHours(8)
                        setSleepMinutes(0)
                        setJustSaved(false)
                      }}
                      className="px-3 py-1 rounded-lg bg-[#8B5CF6]/40 hover:bg-[#8B5CF6]/60 text-xs font-bold text-[#E9D5FF] transition-colors"
                    >
                      Reset (8h)
                    </button>
                  </div>
                </div>
              </div>
            )
          }

          // Standard Category with Pills
          return (
            <div key={cat.id} className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                    {cat.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveLearnMore(isLearnOpen ? null : cat.id)}
                  className="text-xs text-white/50 hover:text-white transition-colors cursor-pointer"
                >
                  Learn more &gt;
                </button>
              </div>

              {isLearnOpen && (
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white/80 animate-landing-fade-up">
                  <p>{cat.learnMore}</p>
                </div>
              )}

              {/* Pills Wrap Grid */}
              <div className="flex flex-wrap gap-2">
                {cat.pills?.map((pill) => {
                  const IconComp = pill.icon || Sparkles
                  const isSelected = activePills.includes(pill.id)
                  return (
                    <button
                      key={pill.id}
                      type="button"
                      onClick={() => togglePill(pill.id)}
                      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer select-none active:scale-95 ${
                        isSelected
                          ? 'shadow-sm text-white scale-[1.02]'
                          : 'bg-[#222228] text-white/80 hover:bg-[#2C2C34] hover:text-white border border-white/5'
                      }`}
                      style={{
                        backgroundColor: isSelected ? cat.activeBg : undefined,
                        borderColor: isSelected ? cat.color : undefined,
                      }}
                      title={pill.desc}
                    >
                      <IconComp
                        size={15}
                        className={isSelected ? 'text-white' : 'text-white/70'}
                        style={{ color: !isSelected ? cat.color : undefined }}
                      />
                      <span>{pill.label}</span>
                      {isSelected && <Check size={12} className="stroke-[3]" />}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* BOTTOM FLOATING SAVE BAR (Sticky pill button)                  */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#161618] via-[#161618]/95 to-transparent flex items-center justify-center pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            className={`px-12 py-3 rounded-full text-sm font-bold shadow-lg transition-all cursor-pointer active:scale-95 flex items-center gap-2 ${
              justSaved
                ? 'bg-[#10B981] text-white shadow-[#10B981]/30'
                : activePills.length > 0
                ? 'bg-[#E02E49] hover:bg-[#CC203C] text-white shadow-[#E02E49]/30 scale-[1.02]'
                : 'bg-[#3A3A42] hover:bg-[#454550] text-white/80'
            }`}
          >
            {justSaved ? (
              <>
                <Check size={16} className="stroke-[3]" />
                <span>Saved to Day {day}</span>
              </>
            ) : (
              <span>Save {activePills.length > 0 ? `(${activePills.length})` : ''}</span>
            )}
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* CUSTOMIZE CATEGORIES MODAL (Filter which cards are shown)      */}
      {/* ------------------------------------------------------------- */}
      {customizingCategories && (
        <div className="absolute inset-0 z-50 bg-[#161618]/95 backdrop-blur-md p-5 flex flex-col justify-between animate-landing-fade-up">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sliders size={18} className="text-[#4DEEEA]" />
                <h3 className="font-serif text-lg font-bold text-white">
                  Customize Tracking Categories
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCustomizingCategories(false)}
                className="h-8 w-8 rounded-full flex items-center justify-center text-white/70 hover:text-white bg-white/10"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-white/70 mb-4">
              Toggle categories to show or hide them in your daily Clue tracking timeline.
            </p>

            <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-1">
              {CLUE_CATEGORIES.map((cat) => {
                const isEnabled = enabledCategoryIds.includes(cat.id)
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategoryEnabled(cat.id)}
                    className={`w-full p-3 rounded-xl border flex items-center justify-between transition-colors cursor-pointer ${
                      isEnabled
                        ? 'bg-[#222228] border-white/20 text-white'
                        : 'bg-white/5 border-white/5 text-white/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: isEnabled ? cat.color : '#555' }}
                      />
                      <span className="text-sm font-semibold">{cat.title}</span>
                    </div>
                    <span
                      className={`h-5 w-5 rounded-full flex items-center justify-center text-xs ${
                        isEnabled ? 'bg-[#007A87] text-white' : 'border border-white/20'
                      }`}
                    >
                      {isEnabled && <Check size={12} className="stroke-[3]" />}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={resetCategories}
              className="text-xs text-white/60 hover:text-white font-medium flex items-center gap-1"
            >
              <RotateCcw size={12} />
              <span>Reset all</span>
            </button>
            <button
              type="button"
              onClick={() => setCustomizingCategories(false)}
              className="px-6 py-2 rounded-full bg-[#007A87] hover:bg-[#008f9e] text-white text-xs font-bold shadow-sm"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )

  // If in Modal Mode: Render with dark glass backdrop
  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md">
        <div className="w-full max-w-xl h-[90vh] max-h-[820px] shadow-2xl">
          {trackerContent}
        </div>
      </div>
    )
  }

  // Embedded Dashboard card mode
  return (
    <div className="h-[620px] w-full">
      {trackerContent}
    </div>
  )
}
