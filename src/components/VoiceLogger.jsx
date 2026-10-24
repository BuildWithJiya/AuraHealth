import { useEffect, useRef, useState } from 'react'
import { Mic, Square, Sparkles, Plus, X, Keyboard } from 'lucide-react'
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
    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 shadow-[0_8px_30px_-12px_rgba(16,185,129,0.2)]">
      <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5 mb-3">
        <Sparkles size={14} className="text-emerald-400" />
        Voice-to-Clinical Symptom Logger
      </h3>

      <div className="flex items-center gap-3 mb-3">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={!supported}
          className={`relative h-14 w-14 rounded-full flex items-center justify-center shrink-0 transition-colors ${
            isRecording ? 'bg-rose-500 animate-pulseRing' : 'bg-indigo-500 hover:bg-indigo-600'
          } ${!supported ? 'opacity-40 cursor-not-allowed' : ''}`}
          aria-label={isRecording ? 'Stop recording' : 'Start recording'}
        >
          {isRecording ? <Square size={18} className="text-white" /> : <Mic size={20} className="text-white" />}
        </button>

        <div className="flex-1">
          {isRecording ? (
            <div className="flex items-center gap-2">
              <div className="flex items-end gap-0.5 h-6">
                {['wave1', 'wave2', 'wave3', 'wave4', 'wave5'].map((anim, i) => (
                  <span
                    key={i}
                    className={`w-1 bg-rose-400 rounded-full animate-${anim}`}
                    style={{ height: '100%' }}
                  />
                ))}
              </div>
              <span className="text-xs text-rose-300 font-medium">Listening…</span>
            </div>
          ) : (
            <p className="text-xs text-slate-500">
              {supported ? 'Tap the mic and describe how you feel.' : 'Voice input unsupported in this browser — use text below.'}
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
          className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
        />
        <Keyboard size={13} className="absolute bottom-2 right-2.5 text-slate-600" />
      </div>
      {error && <p className="text-[11px] text-rose-400 mt-1">{error}</p>}

      <button
        onClick={() => runParse(transcript)}
        disabled={!transcript.trim()}
        className="mt-2 w-full text-xs font-semibold bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700 text-slate-200 rounded-lg py-2 transition-colors"
      >
        Parse Symptom Entry
      </button>

      {draft && (
        <div className="mt-3 border border-indigo-500/40 bg-indigo-500/5 rounded-xl p-3 space-y-2 animate-[fadeIn_0.2s]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-indigo-300 uppercase tracking-wide">Auto-Extracted</span>
            <button onClick={discardDraft} className="text-slate-500 hover:text-slate-300">
              <X size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <Field label="Location" value={draft.location} />
            <Field
              label="Severity"
              value={
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded border text-[11px] font-semibold ${tier.color}`}>
                  {draft.severity}/10 · {tier.label}
                </span>
              }
            />
            <div className="col-span-2">
              <Field
                label="Modifiers"
                value={
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {draft.modifiers.map((m) => (
                      <span key={m} className="bg-slate-700/60 text-slate-200 text-[10px] rounded-full px-2 py-0.5">
                        {m}
                      </span>
                    ))}
                  </div>
                }
              />
            </div>
            <Field
              label="Cycle Phase"
              value={
                <span className="text-[11px] font-semibold" style={{ color: PHASE_META[phase].color }}>
                  {draft.phase} (Day {day})
                </span>
              }
            />
            <Field label="Timestamp" value={new Date(draft.timestamp).toLocaleTimeString()} />
          </div>
          <button
            onClick={confirmDraft}
            className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg py-2 transition-colors"
          >
            <Plus size={14} /> Add to Symptom Timeline
          </button>
        </div>
      )}
    </div>
  )
}

function Field({ label, value }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
      <div className="text-slate-100 font-medium">{value}</div>
    </div>
  )
}
