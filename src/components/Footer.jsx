import { ShieldAlert } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="no-print border-t border-slate-800/70 bg-slate-900/70 backdrop-blur-xl mt-6">
      <div className="mx-auto max-w-[1600px] px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-2 text-[11px] text-slate-400">
        <ShieldAlert size={14} className="text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
        <p>
          <span className="font-semibold text-slate-300">AuraDx Clinical Decision Support System.</span>{' '}
          Grounded in ACOG &amp; Rotterdam Consensus criteria. This tool structures and contextualizes
          patient-reported data for a clinical conversation — it is{' '}
          <span className="font-semibold text-slate-300">not a substitute for primary medical diagnosis.</span>{' '}
          Always consult a licensed clinician.
        </p>
      </div>
    </footer>
  )
}
