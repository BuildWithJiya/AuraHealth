import { useEffect, useRef, useState } from 'react'
import {
  Mic,
  Square,
  Sparkles,
  Plus,
  X,
  Keyboard,
  MapPin,
  Gauge,
  Tag,
  Calendar,
  Clock,
  Wand2,
  CheckCircle2,
} from 'lucide-react'
import { parseSymptomText, severityTier } from '../utils/symptomParser'
import { getCyclePhase, PHASE_META } from '../utils/cycleEngine'

const EXAMPLE_PROMPT =
  'e.g. "Woke up with sharp lower-left pelvic pain, 8 out of 10, accompanied by intense brain fog and severe nausea after coffee."'

export default function VoiceLogger({ day, cycleLength, onAddSymptom }) {
  const [supported, setSupported] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [draft, setDraft] = useState(null)
  const [error, setError] = useState('')
  const recognitionRef = useRef(null)

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setSupported(false)
      return
    }
    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event) => {
      let text = ''
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript
      }
      setTranscript(text)
    }
    recognition.onerror = (event) => {
      setError(event.error === 'not-allowed' ? 'Microphone access denied.' : `Recognition error: ${event.error}`)
      setIsRecording(false)
    }
    recognition.onend = () => {
      setIsRecording(false)
    }
    recognitionRef.current = recognition
    return () => recognition.abort()
  }, [])

  const startRecording = () => {
    setError('')
    setTranscript('')
    setDraft(null)
    if (!recognitionRef.current) return
    try {
      recognitionRef.current.start()
      setIsRecording(true)
    } catch {
      setError('Could not start microphone.')
    }
  }

  const stopRecording = () => {
    recognitionRef.current?.stop()
    setIsRecording(false)
  }

  const runParse = (text) => {
    if (!text.trim()) return
    const parsed = parseSymptomText(text, day, cycleLength)
    setDraft(parsed)
  }

  const confirmDraft = () => {
    if (!draft) return
    onAddSymptom(draft)
    setDraft(null)
    setTranscript('')
  }

  const discardDraft = () => {
    setDraft(null)
  }

  const phase = getCyclePhase(day, cycleLength)
  const tier = draft ? severityTier(draft.severity) : null

  return (
    <div className="ios-glass-card rounded-2xl p-4">
      <h3 className="text-sm font-semibold text-[#6A3D55] flex items-center gap-1.5 mb-3">
        <Sparkles size={14} className="text-[#D96B85]" />
        Voice-to-Clinical Symptom Logger
      </h3>

      <div className="flex items-center gap-3 mb-3">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={!supported}
          className={`relative h-13 w-13 rounded-full flex items-center justify-center shrink-0 transition-all shadow-sm ${
            isRecording
              ? 'bg-[#D96B85] animate-pulseRing text-white'
              : 'bg-[#405A43] hover:bg-[#344a37] text-white hover:shadow-md'
          } ${!supported ? 'opacity-40 cursor-not-allowed' : ''}`}
          aria-label={isRecording ? 'Stop recording' : 'Start recording'}
        >
          {isRecording ? <Square size={17} className="text-white" /> : <Mic size={19} className="text-white" />}
        </button>

        <div className="flex-1">
          {isRecording ? (
            <div className="flex items-center gap-2">
              <div className="flex items-end gap-0.5 h-5">
                {['wave1', 'wave2', 'wave3', 'wave4', 'wave5'].map((anim, i) => (
                  <span
                    key={i}
                    className={`w-1 bg-[#D96B85] rounded-full animate-${anim}`}
                    style={{ height: '100%' }}
                  />
                ))}
              </div>
              <span className="text-xs text-[#D96B85] font-semibold">Listening&hellip;</span>
            </div>
          ) : (
            <p className="text-xs text-[#7A726D]">
              {supported
                ? 'Tap the mic and speak freely in your own words.'
                : 'Voice input unsupported in this browser — type below.'}
            </p>
          )}
        </div>
      </div>

      <div className="relative">
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder={EXAMPLE_PROMPT}
          rows={3}
          className="w-full bg-white/95 border border-[#E8DFD8] rounded-xl px-3 py-2 text-sm text-[#2E2825] placeholder:text-[#938A84] focus:outline-none focus:ring-2 focus:ring-[#D96B85]/20 focus:border-[#D96B85] resize-none shadow-2xs"
        />
        <Keyboard size={13} className="absolute bottom-2 right-2.5 text-[#938A84]" />
      </div>
      {error && <p className="text-[11px] text-[#D96B85] mt-1">{error}</p>}

      <button
        onClick={() => runParse(transcript)}
        disabled={!transcript.trim()}
        className="mt-2 w-full flex items-center justify-center gap-1.5 text-xs font-semibold bg-white hover:bg-[#FCE7E8]/70 disabled:opacity-40 disabled:cursor-not-allowed border border-[#E8DFD8] text-[#6A3D55] hover:border-[#D96B85]/40 rounded-xl py-2 shadow-2xs transition-colors"
      >
        <Wand2 size={13} className="text-[#D96B85]" />
        Parse Symptom Entry
      </button>

      {draft && (
        <div className="mt-3 border border-[#D96B85]/35 bg-[#FCE7E8]/50 rounded-xl p-3 space-y-2 animate-[fadeIn_0.2s]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#D96B85] uppercase tracking-wide flex items-center gap-1">
              <CheckCircle2 size={12} className="text-[#D96B85]" />
              Auto-Extracted Note
            </span>
            <button onClick={discardDraft} className="text-[#7A726D] hover:text-[#2E2825]">
              <X size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <Field
              icon={MapPin}
              iconColor="text-[#D96B85]"
              label="Location"
              value={draft.location}
            />
            <Field
              icon={Gauge}
              iconColor="text-[#D9A84E]"
              label="Severity"
              value={
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[11px] font-semibold bg-white ${tier.color}`}>
                  {draft.severity}/10 &middot; {tier.label}
                </span>
              }
            />
            <div className="col-span-2">
              <Field
                icon={Tag}
                iconColor="text-[#6A3D55]"
                label="Modifiers"
                value={
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {draft.modifiers.map((m) => (
                      <span key={m} className="bg-white text-[#3E3834] border border-[#E8DFD8] text-[10px] rounded-full px-2 py-0.5 shadow-2xs">
                        {m}
                      </span>
                    ))}
                  </div>
                }
              />
            </div>
            <Field
              icon={Calendar}
              iconColor="text-[#405A43]"
              label="Cycle Phase"
              value={
                <span className="text-[11px] font-semibold" style={{ color: PHASE_META[phase].color }}>
                  {draft.phase} (Day {day})
                </span>
              }
            />
            <Field
              icon={Clock}
              iconColor="text-[#7A726D]"
              label="Timestamp"
              value={new Date(draft.timestamp).toLocaleTimeString()}
            />
          </div>
          <button
            onClick={confirmDraft}
            className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold bg-[#405A43] hover:bg-[#344a37] text-white rounded-xl py-2 shadow-sm transition-colors"
          >
            <Plus size={14} /> Add to Symptom Timeline
          </button>
        </div>
      )}
    </div>
  )
}

function Field({ icon: Icon, iconColor = 'text-[#7A726D]', label, value }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide text-[#7A726D] font-medium flex items-center gap-1">
        {Icon && <Icon size={10} className={iconColor} />}
        {label}
      </div>
      <div className="text-[#2E2825] font-semibold">{value}</div>
    </div>
  )
}
