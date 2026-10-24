import { useState } from 'react'
import {
  ShieldCheck,
  Eye,
  EyeOff,
  Lock,
  Download,
  Trash2,
  X,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  FileText,
  AlertTriangle,
} from 'lucide-react'
import { exportLocalVaultBackup } from '../utils/privacyManager'

export default function PrivacyModal({
  open,
  onClose,
  privacySettings,
  onUpdatePrivacy,
  onTriggerPanic,
  onResetAllData,
}) {
  const [copiedStatus, setCopiedStatus] = useState(false)
  const [showWipeConfirm, setShowWipeConfirm] = useState(false)

  if (!open) return null

  const handleToggleAnonymous = () => {
    onUpdatePrivacy({
      ...privacySettings,
      anonymousMode: !privacySettings.anonymousMode,
    })
  }

  const handleToggleCamouflage = () => {
    onUpdatePrivacy({
      ...privacySettings,
      camouflageMode: !privacySettings.camouflageMode,
    })
  }

  const handleExportBackup = () => {
    const success = exportLocalVaultBackup()
    if (success) {
      setCopiedStatus(true)
      setTimeout(() => setCopiedStatus(false), 3000)
    }
  }

  const handleConfirmWipe = () => {
    onResetAllData()
    setShowWipeConfirm(false)
    onClose()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#31232B]/55 backdrop-blur-md animate-fade-in"
    >
      <div className="ios-glass-card max-w-2xl w-full rounded-3xl overflow-hidden shadow-2xl border border-white/80 max-h-[90vh] flex flex-col bg-white/95">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#E8DFD8] flex items-center justify-between bg-[#F8F0E8]/70">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[#E8EFE3] text-[#405A43] flex items-center justify-center border border-[#405A43]/20 shadow-xs">
              <ShieldCheck size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="privacy-modal-title" className="font-serif font-bold text-xl text-[#31232B]">
                  Privacy-First &amp; Discretion Hub
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#E8EFE3] text-[#405A43] border border-[#405A43]/20 rounded-full px-2 py-0.5">
                  100% On-Device
                </span>
              </div>
              <p className="text-xs text-[#7A726D]">
                Zero cloud transmission &middot; Anonymous Ghost Mode &middot; Stigma Protection Camouflage
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-white/80 hover:bg-[#FCE7E8] text-[#7A726D] hover:text-[#2E2825] border border-white/80 flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
            aria-label="Close privacy settings"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-[#31232B]">
          {/* Section 1: 100% On-Device Storage */}
          <div className="rounded-2xl p-4.5 bg-[#FAF7F2] border border-[#E8DFD8] space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-xl bg-white border border-[#405A43]/20 text-[#405A43] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <Lock size={16} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-[#31232B] flex items-center gap-2">
                    On-Device Storage Vault
                    <span className="text-[10px] bg-[#E8EFE3] text-[#405A43] font-bold px-2 py-0.2 rounded-full border border-[#405A43]/20">
                      Active
                    </span>
                  </h3>
                  <p className="text-xs text-[#5E5259] mt-0.5 leading-relaxed">
                    All your cycles, symptoms, voice logs, and lab panels stay strictly inside your browser&apos;s local storage. No health data is ever transmitted to external servers, ad trackers, or third parties.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                onClick={handleExportBackup}
                className="text-xs font-semibold bg-white hover:bg-[#F8F0E8] text-[#405A43] border border-[#405A43]/30 rounded-xl px-3.5 py-2 flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
              >
                <Download size={13} />
                {copiedStatus ? 'Export Downloaded!' : 'Export Encrypted Backup (.json)'}
              </button>
              <button
                onClick={() => setShowWipeConfirm(true)}
                className="text-xs font-semibold bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 rounded-xl px-3.5 py-2 flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
              >
                <Trash2 size={13} />
                Purge On-Device Vault
              </button>
            </div>

            {showWipeConfirm && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs space-y-2 mt-2">
                <p className="font-semibold text-rose-800 flex items-center gap-1.5">
                  <AlertTriangle size={14} /> Wipe all stored health logs from this browser?
                </p>
                <p className="text-rose-700">
                  This cannot be undone unless you have exported a JSON backup.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleConfirmWipe}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs"
                  >
                    Confirm Permanent Purge
                  </button>
                  <button
                    onClick={() => setShowWipeConfirm(false)}
                    className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-lg text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Anonymous Mode (Ghost Profile) */}
          <div className="rounded-2xl p-4.5 bg-white border border-[#E8DFD8] space-y-2.5 shadow-xs">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-xl bg-[#FCE7E8] text-[#D96B85] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  {privacySettings.anonymousMode ? <EyeOff size={16} /> : <Eye size={16} />}
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-[#31232B] flex items-center gap-2">
                    Anonymous Mode (Ghost Profile)
                    {privacySettings.anonymousMode && (
                      <span className="text-[10px] bg-[#FCE7E8] text-[#D96B85] font-bold px-2 py-0.2 rounded-full border border-[#D96B85]/20">
                        Shield ON
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-[#5E5259] mt-0.5 leading-relaxed">
                    Strips personal names, demographic identifiers, and contact details from the screen and medical exports. Displays an anonymous ID (<code className="bg-[#FAF7F2] px-1 rounded text-[#6A3D55] font-mono text-[11px]">Aura-User-Anonymous</code>) while maintaining 100% of the diagnostic and screening calculations.
                  </p>
                </div>
              </div>

              {/* Toggle switch */}
              <button
                onClick={handleToggleAnonymous}
                role="switch"
                aria-checked={privacySettings.anonymousMode}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  privacySettings.anonymousMode ? 'bg-[#D96B85]' : 'bg-[#D1D5DB]'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    privacySettings.anonymousMode ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Section 3: Discreet App Camouflage & Panic Curtain */}
          <div className="rounded-2xl p-4.5 bg-[#F8F0E8]/70 border border-[#D9A84E]/30 space-y-3 shadow-xs">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-xl bg-[#F8F0E8] text-[#D9A84E] border border-[#D9A84E]/30 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-[#31232B] flex items-center gap-2">
                    Discreet Camouflage &amp; Stigma Protection
                    {privacySettings.camouflageMode && (
                      <span className="text-[10px] bg-[#E8EFE3] text-[#405A43] font-bold px-2 py-0.2 rounded-full border border-[#405A43]/20">
                        Camouflage Armed
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-[#5E5259] mt-0.5 leading-relaxed">
                    Designed specifically for shared devices, conservative families, or shared living contexts where menstrual/reproductive apps carry stigma.
                  </p>
                </div>
              </div>

              {/* Toggle switch */}
              <button
                onClick={handleToggleCamouflage}
                role="switch"
                aria-checked={privacySettings.camouflageMode}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  privacySettings.camouflageMode ? 'bg-[#405A43]' : 'bg-[#D1D5DB]'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    privacySettings.camouflageMode ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="bg-white/80 rounded-xl p-3 border border-[#E8DFD8] text-xs text-[#5E5259] space-y-1.5">
              <div className="flex items-center gap-2 text-[#31232B] font-semibold">
                <CheckCircle2 size={13} className="text-[#405A43]" /> What Camouflage Mode does:
              </div>
              <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] text-[#5E5259]">
                <li>Changes browser tab title to &ldquo;Daily Calculator &amp; Study Notes&rdquo;.</li>
                <li>Replaces browser tab icon with a neutral calculator/memo icon.</li>
                <li>Enables the one-click Emergency Panic Shield if someone walks in.</li>
              </ul>
            </div>

            {/* Emergency Panic Shield Trigger */}
            <div className="pt-1 flex items-center justify-between">
              <button
                onClick={() => {
                  onTriggerPanic()
                  onClose()
                }}
                className="text-xs font-bold bg-[#6A3D55] hover:bg-[#522e42] text-white rounded-xl px-4 py-2 flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <EyeOff size={13} />
                Activate Screen Camouflage Now (Press Esc to restore)
              </button>
              <span className="text-[11px] text-[#7A726D] font-mono">Shortcut: Esc</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E8DFD8] bg-[#FAF7F2] flex items-center justify-between text-xs text-[#7A726D]">
          <span>Protected under Client-Side Cryptographic Isolation</span>
          <button
            onClick={onClose}
            className="font-semibold bg-[#405A43] hover:bg-[#324734] text-white rounded-full px-5 py-1.5 transition-colors shadow-xs cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
