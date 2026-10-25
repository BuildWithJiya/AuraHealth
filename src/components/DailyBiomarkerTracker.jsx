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
  CheckCircle2,
  Droplet,
} from 'lucide-react'
import {
  DAILY_TRACKING_CATEGORIES,
  loadDailyBiomarkerLogs,
  saveDailyBiomarkerLog,
  loadEnabledCategories,
  saveEnabledCategories,
  convertPillsToSymptoms,
} from '../utils/dailyTrackerData'
import { getCyclePhase, PHASE_META } from '../utils/cycleEngine'

function formatDateHeader(date) {
  const isToday = new Date().toDateString() === date.toDateString()
  const weekday = date.toLocaleDateString('en-US', { weekday: 'long' })
  const day = date.getDate()
  const month = date.toLocaleDateString('en-US', { month: 'short' })
  const year = date.getFullYear()
  return {
    full: `${weekday}, ${day} ${month} ${year}`,
    isToday,
    day,
    month,
  }
}

function toDateKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export default function DailyBiomarkerTracker({
  open = true,
  onClose,
  isModal = false,
  day = 24,
  cycleLength = 28,
  onDayChange,
  onAddSymptom,
  activeLifeStageId = 'reproductive',
  onOpenFullTracker,
}) {
  const [selectedDate, setSelectedDate] = useState(() => new Date())
  const [weekOffset, setWeekOffset] = useState(0)

  // Loaded daily logs index
  const [allLogs, setAllLogs] = useState(() => loadDailyBiomarkerLogs())

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

  // Learn more drawer state
  const [activeLearnMore, setActiveLearnMore] = useState(null)

  // Save feedback state
  const [justSaved, setJustSaved] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  // Inline month picker open state
  const [showDatePicker, setShowDatePicker] = useState(false)

  // Sync state with storage when dateKey changes
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
    base.setDate(base.getDate() + weekOffset * 7)
    const dayOfWeek = base.getDay() // 0 = Sun
    const sunday = new Date(base)
    sunday.setDate(base.getDate() - dayOfWeek)

    const days = []
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

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

    saveDailyBiomarkerLog(dateKey, logData)
    setAllLogs((prev) => ({ ...prev, [dateKey]: logData }))

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
    setSaveMessage(`Recorded ${activePills.length} biomarkers for ${selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`)

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

  const toggleCategoryEnabled = (id) => {
    setEnabledCategoryIds((prev) => {
      const next = prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
      saveEnabledCategories(next)
      return next
    })
  }

  const resetCategories = () => {
    const all = DAILY_TRACKING_CATEGORIES.map((c) => c.id)
    setEnabledCategoryIds(all)
    saveEnabledCategories(all)
  }

  const visibleCategories = useMemo(() => {
    return DAILY_TRACKING_CATEGORIES.filter((c) => enabledCategoryIds.includes(c.id))
  }, [enabledCategoryIds])

  if (!open && isModal) return null

  const dateMeta = formatDateHeader(selectedDate)
  const currentPredictedDay = (((day + Math.round((selectedDate - new Date()) / 86400000) - 1) % cycleLength) + cycleLength) % cycleLength + 1
  const currentPhase = getCyclePhase(currentPredictedDay, cycleLength)

  // Card Content
  const trackerContent = (
    <div className="relative flex flex-col h-full bg-[#FAF7F2] text-[#2E2825] rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(106,61,85,0.08)] border border-[#E8DFD8]">
      {/* ------------------------------------------------------------- */}
      {/* TOP HEADER BAR (Aura Soft Porcelain Header)                   */}
      {/* ------------------------------------------------------------- */}
      <div className="px-5 py-4 border-b border-[#E8DFD8] flex items-center justify-between bg-white/95">
        <div className="flex items-center gap-3">
          {isModal && onClose ? (
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-full flex items-center justify-center text-[#5E5259] hover:text-[#D96B85] hover:bg-[#FCE7E8]/60 transition-colors cursor-pointer"
              title="Close Tracker"
            >
              <X size={18} />
            </button>
          ) : (
            <div className="h-8 w-8 rounded-full bg-[#FCE7E8] text-[#D96B85] flex items-center justify-center shadow-2xs shrink-0">
              <CalendarIcon size={16} />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-base sm:text-lg font-bold text-[#3A1F2D] leading-tight">
                {dateMeta.full}
              </h3>
              {dateMeta.isToday && (
                <span className="text-[10px] font-bold text-[#405A43] bg-[#E8EFE3] px-2 py-0.5 rounded-full border border-[#405A43]/20">
                  Today
                </span>
              )}
            </div>
            <p className="text-xs text-[#6A3D55] font-medium mt-0.5">
              Cycle Day {currentPredictedDay} &middot; <span style={{ color: PHASE_META[currentPhase]?.color }}>{currentPhase} Phase</span>
            </p>
          </div>
        </div>

        {/* Action Buttons: Pick Date & Customize */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowDatePicker((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-[#FAF7F2] border border-[#E8DFD8] text-xs font-semibold text-[#5E5259] hover:text-[#6A3D55] transition-all shadow-2xs cursor-pointer"
            title="Jump to date"
          >
            <CalendarIcon size={12} className="text-[#D96B85]" />
            <span>Select Date</span>
          </button>

          <button
            type="button"
            onClick={() => setCustomizingCategories(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-[#FCE7E8] border border-[#E8DFD8] hover:border-[#D96B85]/40 text-xs font-semibold text-[#6A3D55] hover:text-[#D96B85] transition-all shadow-2xs cursor-pointer"
            title="Customize tracking categories"
          >
            <Sliders size={12} className="text-[#6A3D55]" />
            <span className="hidden sm:inline">Customize Focus</span>
          </button>
        </div>
      </div>

      {/* Date Picker Popover */}
      {showDatePicker && (
        <div className="bg-white border-b border-[#E8DFD8] px-4 py-3 flex items-center justify-between text-xs gap-3">
          <button
            onClick={() => {
              const d = new Date(selectedDate)
              d.setDate(d.getDate() - 7)
              setSelectedDate(d)
              setWeekOffset((w) => w - 1)
            }}
            className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#FCE7E8] border border-[#E8DFD8] text-[#5E5259] font-semibold transition-colors"
          >
            &larr; Prev Week
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-[#6A3D55]">Select Date:</span>
            <input
              type="date"
              value={dateKey}
              onChange={(e) => {
                if (e.target.value) {
                  const parts = e.target.value.split('-').map(Number)
                  const newD = new Date(parts[0], parts[1] - 1, parts[2])
                  setSelectedDate(newD)
                  setShowDatePicker(false)
                }
              }}
              className="bg-[#FAF7F2] text-[#3A1F2D] px-3 py-1 rounded-xl border border-[#E8DFD8] text-xs font-bold focus:border-[#D96B85] focus:outline-none"
            />
          </div>
          <button
            onClick={() => {
              const d = new Date(selectedDate)
              d.setDate(d.getDate() + 7)
              setSelectedDate(d)
              setWeekOffset((w) => w + 1)
            }}
            className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#FCE7E8] border border-[#E8DFD8] text-[#5E5259] font-semibold transition-colors"
          >
            Next Week &rarr;
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* CLEAN PORCELAIN CALENDAR STRIP (Sun - Sat)                    */}
      {/* ------------------------------------------------------------- */}
      <div className="px-4 py-3 bg-[#FAF7F2] border-b border-[#E8DFD8]">
        <div className="flex items-center justify-between mb-2 px-1">
          <button
            onClick={() => setWeekOffset((w) => w - 1)}
            className="h-7 w-7 rounded-full bg-white hover:bg-[#FCE7E8] border border-[#E8DFD8] text-[#5E5259] hover:text-[#D96B85] flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
            title="Previous Week"
          >
            <ChevronLeft size={15} />
          </button>
          <span className="text-[11px] font-semibold text-[#6A3D55] uppercase tracking-wide">
            Menstrual & Biomarker Calendar Strip
          </span>
          <button
            onClick={() => setWeekOffset((w) => w + 1)}
            className="h-7 w-7 rounded-full bg-white hover:bg-[#FCE7E8] border border-[#E8DFD8] text-[#5E5259] hover:text-[#D96B85] flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
            title="Next Week"
          >
            <ChevronRight size={15} />
          </button>
        </div>

        {/* 7-Day Porcelain Cards */}
        <div className="grid grid-cols-7 gap-2">
          {dateStrip.map((item) => {
            const phaseColor = PHASE_META[item.phase]?.color || '#D96B85'
            return (
              <button
                key={item.dateKey}
                type="button"
                onClick={() => {
                  setSelectedDate(item.date)
                  if (onDayChange && item.predictedCycleDay) {
                    onDayChange(item.predictedCycleDay)
                  }
                }}
                className={`relative flex flex-col items-center py-2 px-1 rounded-2xl transition-all cursor-pointer ${
                  item.isSelected
                    ? 'bg-white border-2 border-[#D96B85] shadow-xs scale-[1.02] ring-2 ring-[#D96B85]/20'
                    : 'bg-white/80 hover:bg-white border border-[#E8DFD8] hover:border-[#D96B85]/40'
                }`}
              >
                {/* Day name */}
                <span className="text-[10px] font-semibold text-[#7A726D] mb-1">
                  {item.dayName}
                </span>

                {/* Day number */}
                <span className={`text-sm font-bold ${item.isSelected ? 'text-[#3A1F2D]' : 'text-[#5E5259]'}`}>
                  {item.dayNumber}
                </span>

                {/* Phase indicator dot or badge */}
                <div className="mt-1 flex items-center gap-0.5">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: phaseColor }}
                    title={`${item.phase} Phase (Day ${item.predictedCycleDay})`}
                  />
                  {item.isOvulationDay && (
                    <Sparkles size={9} className="text-[#D9A84E]" title="Predicted Ovulation Window" />
                  )}
                </div>

                {/* Logged indicator marker */}
                {item.hasLog && (
                  <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-[#D96B85]" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SCROLLABLE CATEGORY LIST (Soft Porcelain Botanical Cards)     */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6 pb-24">
        {visibleCategories.map((cat) => {
          const isLearnOpen = activeLearnMore === cat.id

          // Special rendering for Sleep Duration
          if (cat.isDuration) {
            return (
              <div key={cat.id} className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E8DFD8] shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-[#E8EFE3] text-[#405A43] flex items-center justify-center shadow-2xs">
                      <Clock size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#3A1F2D]">{cat.title}</h4>
                      <p className="text-[11px] text-[#7A726D]">{cat.subtitle}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveLearnMore(isLearnOpen ? null : cat.id)}
                    className="text-xs text-[#6A3D55] hover:text-[#D96B85] font-semibold transition-colors"
                  >
                    Learn more &gt;
                  </button>
                </div>

                {isLearnOpen && (
                  <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFD8] text-xs text-[#52464D]">
                    <p>{cat.learnMore}</p>
                  </div>
                )}

                {/* Digital Sleep Display in soft botanical styling */}
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8DFD8] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                  <div className="flex items-baseline gap-1 text-[#3A1F2D]">
                    <span className="text-3xl sm:text-4xl font-serif font-bold tracking-tight">
                      {String(sleepHours).padStart(2, '0')}
                    </span>
                    <span className="text-xs font-semibold text-[#7A726D] mr-2">hours</span>
                    <span className="text-3xl sm:text-4xl font-serif font-bold tracking-tight">
                      {String(sleepMinutes).padStart(2, '0')}
                    </span>
                    <span className="text-xs font-semibold text-[#7A726D]">minutes</span>
                  </div>

                  {/* Stepper buttons */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => adjustSleep(-1, 0)}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#FCE7E8] border border-[#E8DFD8] text-xs font-semibold text-[#5E5259] transition-colors"
                    >
                      -1h
                    </button>
                    <button
                      type="button"
                      onClick={() => adjustSleep(0, -15)}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#FCE7E8] border border-[#E8DFD8] text-xs font-semibold text-[#5E5259] transition-colors"
                    >
                      -15m
                    </button>
                    <button
                      type="button"
                      onClick={() => adjustSleep(0, 15)}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#E8EFE3] border border-[#E8DFD8] text-xs font-semibold text-[#405A43] transition-colors"
                    >
                      +15m
                    </button>
                    <button
                      type="button"
                      onClick={() => adjustSleep(1, 0)}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#E8EFE3] border border-[#E8DFD8] text-xs font-semibold text-[#405A43] transition-colors"
                    >
                      +1h
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSleepHours(8)
                        setSleepMinutes(0)
                        setJustSaved(false)
                      }}
                      className="px-3 py-1 rounded-lg bg-[#E8EFE3] hover:bg-[#457B5A] hover:text-white border border-[#457B5A]/20 text-xs font-bold text-[#457B5A] transition-colors"
                    >
                      Reset 8h
                    </button>
                  </div>
                </div>
              </div>
            )
          }

          // Standard Category with Soft Pastel Pills
          return (
            <div key={cat.id} className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E8DFD8] shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-[#3A1F2D]">{cat.title}</h4>
                    <p className="text-[11px] text-[#7A726D]">{cat.subtitle}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveLearnMore(isLearnOpen ? null : cat.id)}
                  className="text-xs text-[#6A3D55] hover:text-[#D96B85] font-semibold transition-colors cursor-pointer"
                >
                  Learn more &gt;
                </button>
              </div>

              {isLearnOpen && (
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFD8] text-xs text-[#52464D]">
                  <p>{cat.learnMore}</p>
                </div>
              )}

              {/* Soft Pastel Pills Grid */}
              <div className="flex flex-wrap gap-2">
                {cat.pills?.map((pill) => {
                  const IconComp = pill.icon || Sparkles
                  const isSelected = activePills.includes(pill.id)
                  return (
                    <button
                      key={pill.id}
                      type="button"
                      onClick={() => togglePill(pill.id)}
                      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer select-none ${
                        isSelected
                          ? 'border-2 border-[#D96B85] bg-[#FCE7E8] text-[#3A1F2D] shadow-xs font-bold scale-[1.02]'
                          : 'border border-[#E8DFD8] bg-[#FAF7F2] hover:bg-white hover:border-[#D96B85]/40 text-[#52464D]'
                      }`}
                      title={pill.desc}
                    >
                      <IconComp
                        size={15}
                        className={isSelected ? 'text-[#D96B85]' : 'text-[#7A726D]'}
                      />
                      <span>{pill.label}</span>
                      {isSelected && (
                        <Check size={12} className="text-[#D96B85] stroke-[3]" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* BOTTOM ACTION BAR (Save Button with Live Feedback)            */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/95 to-transparent flex items-center justify-between border-t border-[#E8DFD8]/60">
        <div className="text-xs font-semibold text-[#6A3D55]">
          {justSaved ? (
            <span className="text-[#457B5A] flex items-center gap-1.5 font-bold">
              <CheckCircle2 size={14} />
              <span>{saveMessage}</span>
            </span>
          ) : activePills.length > 0 ? (
            <span>{activePills.length} biomarker{activePills.length > 1 ? 's' : ''} selected</span>
          ) : (
            <span className="text-[#7A726D]">Select symptoms to log</span>
          )}
        </div>

        <button
          type="button"
          onClick={handleSave}
          className={`inline-flex items-center gap-2 px-7 py-2.5 rounded-full text-xs sm:text-sm font-semibold shadow-sm transition-all cursor-pointer active:scale-95 ${
            justSaved
              ? 'bg-[#457B5A] text-white'
              : 'bg-[#D96B85] hover:bg-[#B8526B] text-white'
          }`}
        >
          {justSaved ? (
            <>
              <Check size={14} className="stroke-[3]" />
              <span>Saved</span>
            </>
          ) : (
            <span>Save Log {activePills.length > 0 ? `(${activePills.length})` : ''}</span>
          )}
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* CUSTOMIZE CATEGORIES MODAL (Porcelain Soft Dialog)            */}
      {/* ------------------------------------------------------------- */}
      {customizingCategories && (
        <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-md p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E8DFD8]">
              <div className="flex items-center gap-2">
                <Sliders size={18} className="text-[#D96B85]" />
                <h3 className="font-serif text-lg font-bold text-[#3A1F2D]">
                  Customize Tracking Focus
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCustomizingCategories(false)}
                className="h-8 w-8 rounded-full flex items-center justify-center text-[#5E5259] hover:text-[#D96B85] bg-[#FAF7F2] hover:bg-[#FCE7E8]"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-[#5E5259] mb-4">
              Choose which health biomarker categories you want displayed in your daily tracking timeline.
            </p>

            <div className="space-y-2.5 max-h-[55vh] overflow-y-auto pr-1">
              {DAILY_TRACKING_CATEGORIES.map((cat) => {
                const isEnabled = enabledCategoryIds.includes(cat.id)
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategoryEnabled(cat.id)}
                    className={`w-full p-3.5 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${
                      isEnabled
                        ? 'bg-[#FAF7F2] border-[#D96B85]/60 text-[#3A1F2D] shadow-2xs'
                        : 'bg-white border-[#E8DFD8] text-[#8C8087]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="h-3.5 w-3.5 rounded-full"
                        style={{ backgroundColor: isEnabled ? cat.color : '#D1D5DB' }}
                      />
                      <div className="text-left">
                        <span className="text-xs sm:text-sm font-bold block">{cat.title}</span>
                        <span className="text-[11px] text-[#7A726D] block">{cat.subtitle}</span>
                      </div>
                    </div>
                    <span
                      className={`h-5 w-5 rounded-full flex items-center justify-center text-xs ${
                        isEnabled ? 'bg-[#D96B85] text-white shadow-2xs' : 'border border-[#D1D5DB]'
                      }`}
                    >
                      {isEnabled && <Check size={12} className="stroke-[3]" />}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#E8DFD8]">
            <button
              type="button"
              onClick={resetCategories}
              className="text-xs text-[#7A726D] hover:text-[#3A1F2D] font-semibold flex items-center gap-1.5"
            >
              <RotateCcw size={12} />
              <span>Reset all</span>
            </button>
            <button
              type="button"
              onClick={() => setCustomizingCategories(false)}
              className="px-6 py-2 rounded-full bg-[#D96B85] hover:bg-[#B8526B] text-white text-xs font-semibold shadow-sm"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )

  // If in Modal Mode: Render with soft translucent backdrop
  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/45 backdrop-blur-sm">
        <div className="w-full max-w-xl h-[90vh] max-h-[820px] shadow-2xl">
          {trackerContent}
        </div>
      </div>
    )
  }

  // Embedded Dashboard Card Mode (Compact & Clean, perfectly balanced with dashboard)
  return (
    <div className="ios-glass-card rounded-2xl p-3.5 space-y-3">
      {/* Header with Date, Cycle Day & Phase */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-[#FCE7E8] text-[#D96B85] flex items-center justify-center shrink-0 shadow-2xs">
            <CalendarIcon size={15} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-bold text-[#3A1F2D] leading-tight">
                {dateMeta.full}
              </span>
              {dateMeta.isToday && (
                <span className="text-[9px] font-bold text-[#457B5A] bg-[#E8EFE3] px-1.5 py-0.5 rounded-full border border-[#457B5A]/20">
                  Today
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#6A3D55] font-medium">
              Cycle Day {currentPredictedDay} &middot;{' '}
              <span style={{ color: PHASE_META[currentPhase]?.color }}>{currentPhase} Phase</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenFullTracker}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white hover:bg-[#FCE7E8] text-[11px] font-semibold text-[#D96B85] border border-[#D96B85]/30 shadow-2xs transition-colors cursor-pointer"
          title="Open Full 11-Category Log"
        >
          <span>Full Log</span>
          <Maximize2 size={11} />
        </button>
      </div>

      {/* 7-Day Mini Calendar Strip */}
      <div className="flex items-center justify-between bg-white/70 rounded-xl p-1.5 border border-[#E8DFD8]">
        <button
          type="button"
          onClick={() => setWeekOffset((w) => w - 1)}
          className="h-6 w-6 rounded-full flex items-center justify-center text-[#5E5259] hover:bg-[#FCE7E8] hover:text-[#D96B85] transition-colors cursor-pointer"
          title="Previous Week"
        >
          <ChevronLeft size={13} />
        </button>

        <div className="grid grid-cols-7 gap-1 flex-1 px-1">
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
              className={`py-1 rounded-lg text-center transition-all cursor-pointer ${
                item.isSelected
                  ? 'bg-[#FCE7E8] text-[#3A1F2D] font-bold border border-[#D96B85]/60 shadow-2xs'
                  : 'hover:bg-[#FAF7F2] text-[#6A3D55]'
              }`}
            >
              <span className="block text-[9px] uppercase text-[#8C8087] font-medium leading-tight">
                {item.dayName.slice(0, 2)}
              </span>
              <span className="block text-xs font-bold leading-tight">{item.dayNumber}</span>
              <span
                className="block mx-auto h-1.5 w-1.5 rounded-full mt-0.5"
                style={{ backgroundColor: PHASE_META[item.phase]?.color || '#D96B85' }}
              />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setWeekOffset((w) => w + 1)}
          className="h-6 w-6 rounded-full flex items-center justify-center text-[#5E5259] hover:bg-[#FCE7E8] hover:text-[#D96B85] transition-colors cursor-pointer"
          title="Next Week"
        >
          <ChevronRight size={13} />
        </button>
      </div>

      {/* Quick Logged Summary or Quick-Pill Adders */}
      <div className="bg-white/75 rounded-xl p-2.5 border border-[#E8DFD8] text-xs">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A726D]">
            Day {currentPredictedDay} Logged Biomarkers ({activePills.length})
          </span>
          <button
            type="button"
            onClick={onOpenFullTracker}
            className="text-[10px] font-bold text-[#D96B85] hover:underline cursor-pointer"
          >
            + Add / Edit
          </button>
        </div>

        {activePills.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {activePills.slice(0, 4).map((pid) => (
              <span
                key={pid}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FCE7E8] text-[#6A3D55] border border-[#D96B85]/30"
              >
                <Check size={9} className="text-[#D96B85] stroke-[3]" />
                {pid.replace(/_/g, ' ')}
              </span>
            ))}
            {activePills.length > 4 && (
              <span className="text-[10px] font-bold text-[#8C8087] px-1 py-0.5">
                +{activePills.length - 4} more
              </span>
            )}
          </div>
        ) : (
          <div className="space-y-1.5">
            <p className="text-[11px] text-[#7A726D] italic">
              No manual markers recorded for this date.
            </p>
            <div className="flex flex-wrap gap-1">
              {[
                { id: 'flow_medium', label: 'Medium Flow' },
                { id: 'cramp_mild', label: 'Mild Cramps' },
                { id: 'energy_fatigue', label: 'Fatigue' },
                { id: 'mood_calm', label: 'Calm' },
              ].map((qp) => (
                <button
                  key={qp.id}
                  type="button"
                  onClick={() => togglePill(qp.id)}
                  className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FAF7F2] hover:bg-[#FCE7E8] text-[#6A3D55] hover:text-[#3A1F2D] border border-[#E8DFD8] transition-colors cursor-pointer"
                >
                  + {qp.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Button to open full tracker with all 11 categories */}
      <button
        type="button"
        onClick={onOpenFullTracker}
        className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-[#FCE7E8] to-[#FFF0F3] hover:from-[#fbd7dc] hover:to-[#ffe0e6] text-[#6A3D55] hover:text-[#3A1F2D] font-semibold text-xs border border-[#D96B85]/35 shadow-2xs transition-all cursor-pointer"
      >
        <Sparkles size={13} className="text-[#D96B85]" />
        <span>Open Full Daily Tracker (11 Categories)</span>
      </button>
    </div>
  )
}
