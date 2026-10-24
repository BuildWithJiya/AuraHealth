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
  Volume2,
  Languages,
  Info,
} from 'lucide-react'
import {
  parseSymptomText,
  severityTier,
  generateRegionalAudioSummary,
} from '../utils/symptomParser'
import { getCyclePhase, PHASE_META } from '../utils/cycleEngine'

export const REGIONAL_LANGUAGES = [
  {
    code: 'hi-IN',
    label: 'Hindi',
    native: 'हिंदी',
    flag: '🇮🇳',
    placeholder: 'बोलें: "आज पेट में बहुत दर्द है, कल से ज्यादा..."',
    sample: 'आज पेट में बहुत दर्द है, कल से ज्यादा',
  },
  {
    code: 'en-IN',
    label: 'Hinglish',
    native: 'Hinglish',
    flag: '🇮🇳',
    placeholder: 'Speak: "Aaj pet me bahut dard hai, kal se zyada aur ulti..."',
    sample: 'Aaj pet me bahut dard hai, kal se zyada',
  },
  {
    code: 'bn-IN',
    label: 'Bengali',
    native: 'বাংলা',
    flag: '🇮🇳',
    placeholder: 'বলুন: "আজ পেটে খুব তীব্র যন্ত্রণা ও মাথা ঘোরা..."',
    sample: 'আজ পেটে খুব তীব্র যন্ত্রণা ও বমি ভাব',
  },
  {
    code: 'ta-IN',
    label: 'Tamil',
    native: 'தமிழ்',
    flag: '🇮🇳',
    placeholder: 'பேசுங்கள்: "இன்று அடிவயிற்றில் கடுமையான வலி மற்றும் சோர்வு..."',
    sample: 'இன்று அடிவயிற்றில் கடுமையான வலி',
  },
  {
    code: 'te-IN',
    label: 'Telugu',
    native: 'తెలుగు',
    flag: '🇮🇳',
    placeholder: 'చెప్పండి: "ఈ రోజు కడుపులో చాలా నొప్పిగా ఉంది, అలసట..."',
    sample: 'ఈ రోజు కడుపులో చాలా నొప్పిగా ఉంది',
  },
  {
    code: 'mr-IN',
    label: 'Marathi',
    native: 'मराठी',
    flag: '🇮🇳',
    placeholder: 'बोला: "आज पोटात खूप दुखत आहे, कालपेक्षा जास्त..."',
    sample: 'आज पोटात खूप दुखत आहे, कालपेक्षा जास्त',
  },
  {
    code: 'en-US',
    label: 'English',
    native: 'Global',
    flag: '🌐',
    placeholder: 'e.g. "Woke up with sharp lower-left pelvic pain, 8 out of 10..."',
    sample: 'Sharp lower pelvic cramps, 8 out of 10, intense fatigue',
  },
]

export default function VoiceLogger({ day, cycleLength, onAddSymptom }) {
  const [selectedLang, setSelectedLang] = useState(REGIONAL_LANGUAGES[0]) // Hindi by default for rural India accessibility
  const [supported, setSupported] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [draft, setDraft] = useState(null)
  const [error, setError] = useState('')
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
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
    recognition.lang = selectedLang.code

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
  }, [selectedLang])

  const startRecording = () => {
    setError('')
    setTranscript('')
    setDraft(null)
    if (!recognitionRef.current) return
    try {
      recognitionRef.current.lang = selectedLang.code
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

  // Speak clinical readout for low-literacy empowerment
  const handlePlayAudio = () => {
    if (!draft || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()

    const textToSpeak = generateRegionalAudioSummary(draft, selectedLang.code)
    const utterance = new SpeechSynthesisUtterance(textToSpeak)
    utterance.lang = selectedLang.code
    utterance.rate = 0.95

    utterance.onstart = () => setIsPlayingAudio(true)
    utterance.onend = () => setIsPlayingAudio(false)
    utterance.onerror = () => setIsPlayingAudio(false)

    window.speechSynthesis.speak(utterance)
  }

  const phase = getCyclePhase(day, cycleLength)
  const tier = draft ? severityTier(draft.severity) : null

  return (
    <div className="ios-glass-card rounded-2xl p-4">
      {/* Header with Title & Accessibility Flag */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <h3 className="text-sm font-semibold text-[#6A3D55] flex items-center gap-1.5">
            <Sparkles size={14} className="text-[#D96B85]" />
            Voice-First Regional Symptom Logger
          </h3>
          <p className="text-[11px] text-[#7A726D] mt-0.5">
            Designed for rural &amp; low-literacy users across India.
          </p>
        </div>
        <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8EFE3] text-[#405A43] border border-[#405A43]/20 flex items-center gap-1">
          <Languages size={10} /> {selectedLang.native}
        </span>
      </div>

      {/* Language Selector Pills */}
      <div className="mb-3 space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-[#5E5259] font-medium">
          <span>Choose spoken language:</span>
          <span className="text-[10px] text-[#D96B85] font-semibold">{selectedLang.flag} {selectedLang.code}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {REGIONAL_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setSelectedLang(lang)
                if (recognitionRef.current) recognitionRef.current.lang = lang.code
              }}
              className={`text-[11px] font-medium px-2.5 py-1 rounded-full border transition-all flex items-center gap-1 shadow-2xs ${
                selectedLang.code === lang.code
                  ? 'bg-[#405A43] border-[#405A43] text-white shadow-xs font-semibold'
                  : 'bg-white/70 border-white/80 text-[#5E5259] hover:bg-[#FCE7E8]/60 hover:text-[#6A3D55]'
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.native}</span>
              <span className="opacity-75 text-[9px]">({lang.label})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mic Action Bar */}
      <div className="flex items-center gap-3 mb-3 bg-white/55 backdrop-blur-md rounded-2xl p-2.5 border border-white/75">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={!supported}
          className={`relative h-12 w-12 rounded-full flex items-center justify-center shrink-0 transition-all shadow-sm cursor-pointer ${
            isRecording
              ? 'bg-[#D96B85] animate-pulseRing text-white'
              : 'bg-[#405A43] hover:bg-[#344a37] text-white hover:shadow-md'
          } ${!supported ? 'opacity-40 cursor-not-allowed' : ''}`}
          aria-label={isRecording ? 'Stop recording' : 'Start recording'}
          title={isRecording ? 'Click to finish' : `Speak in ${selectedLang.label}`}
        >
          {isRecording ? <Square size={16} className="text-white" /> : <Mic size={18} className="text-white" />}
        </button>

        <div className="flex-1 min-w-0">
          {isRecording ? (
            <div className="flex items-center gap-2">
              <div className="flex items-end gap-0.5 h-4">
                {['wave1', 'wave2', 'wave3', 'wave4', 'wave5'].map((anim, i) => (
                  <span
                    key={i}
                    className={`w-1 bg-[#D96B85] rounded-full animate-${anim}`}
                    style={{ height: '100%' }}
                  />
                ))}
              </div>
              <span className="text-xs text-[#D96B85] font-semibold animate-pulse">
                Listening in {selectedLang.native}&hellip;
              </span>
            </div>
          ) : (
            <div>
              <p className="text-xs font-semibold text-[#31232B]">
                Tap mic to speak freely in {selectedLang.native}
              </p>
              <p className="text-[11px] text-[#7A726D] truncate mt-0.5">
                {selectedLang.placeholder}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Tap-to-Speak Sample Chip (Instant Regional Demo) */}
      <div className="mb-2.5 flex items-center gap-1.5 flex-wrap">
        <span className="text-[10px] text-[#7A726D] font-medium">Quick regional test:</span>
        <button
          onClick={() => {
            setTranscript(selectedLang.sample)
            runParse(selectedLang.sample)
          }}
          className="text-[11px] font-medium bg-[#FCE7E8]/80 hover:bg-[#FCE7E8] text-[#D96B85] border border-white/80 rounded-full px-2.5 py-0.5 transition-colors shadow-2xs text-left"
          title="Click to auto-load sample sentence"
        >
          &ldquo;{selectedLang.sample}&rdquo; &rarr;
        </button>
      </div>

      {/* Textarea for Voice Output or Manual Review */}
      <div className="relative">
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder={selectedLang.placeholder}
          rows={3}
          className="w-full bg-white/70 backdrop-blur-md border border-white/80 rounded-xl px-3 py-2 text-xs sm:text-sm text-[#2E2825] placeholder:text-[#938A84] focus:outline-none focus:ring-2 focus:ring-[#D96B85]/20 focus:border-[#D96B85] resize-none shadow-2xs"
        />
        <Keyboard size={13} className="absolute bottom-2 right-2.5 text-[#938A84]" />
      </div>
      {error && <p className="text-[11px] text-[#D96B85] mt-1">{error}</p>}

      {/* Parse Symptom Button */}
      <button
        onClick={() => runParse(transcript)}
        disabled={!transcript.trim()}
        className="mt-2 w-full flex items-center justify-center gap-1.5 text-xs font-semibold bg-white/80 hover:bg-[#FCE7E8]/70 disabled:opacity-40 disabled:cursor-not-allowed border border-white/80 text-[#6A3D55] hover:border-[#D96B85]/40 rounded-xl py-2 shadow-2xs transition-colors backdrop-blur-sm cursor-pointer"
      >
        <Wand2 size={13} className="text-[#D96B85]" />
        Convert Speech to Clinical Note (Extract)
      </button>

      {/* Extracted Clinical Draft Card */}
      {draft && (
        <div className="mt-3 border border-white/80 bg-white/80 backdrop-blur-md rounded-2xl p-3.5 space-y-2.5 animate-[fadeIn_0.2s] shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-[#E8DFD8]">
            <span className="text-[11px] font-bold text-[#D96B85] uppercase tracking-wide flex items-center gap-1">
              <CheckCircle2 size={12} className="text-[#D96B85]" />
              Auto-Extracted Clinical Note
            </span>

            <div className="flex items-center gap-2">
              {/* Audio Listen Button for Low Literacy Empowerment */}
              <button
                onClick={handlePlayAudio}
                className={`flex items-center gap-1 text-[11px] font-bold rounded-full px-2.5 py-0.5 border transition-all ${
                  isPlayingAudio
                    ? 'bg-[#D96B85] text-white border-[#D96B85] animate-pulse'
                    : 'bg-[#FAF7F2] hover:bg-[#FCE7E8] text-[#405A43] border-[#405A43]/30'
                }`}
                title="Suno / Listen to confirmation in spoken language"
              >
                <Volume2 size={12} />
                {isPlayingAudio ? 'बोल रहा है...' : '🔊 सुनो / Listen'}
              </button>

              <button onClick={discardDraft} className="text-[#7A726D] hover:text-[#2E2825]" title="Discard">
                <X size={14} />
              </button>
            </div>
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
                label="Extracted Modifiers"
                value={
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {draft.modifiers.map((m) => (
                      <span key={m} className="bg-white text-[#3E3834] border border-[#E8DFD8] text-[10px] rounded-full px-2 py-0.5 shadow-2xs font-medium">
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
            className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold bg-[#405A43] hover:bg-[#344a37] text-white rounded-xl py-2.5 shadow-sm transition-colors cursor-pointer"
          >
            <Plus size={14} /> Add to Symptom Timeline &amp; SOAP Dossier
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
      <div className="text-[#2E2825] font-semibold mt-0.5">{value}</div>
    </div>
  )
}
