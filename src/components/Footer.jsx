import { ShieldAlert } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="no-print border-t border-[#E8DFD8] bg-[#FAF7F2]/80 backdrop-blur-xl mt-6 py-4">
      <div className="mx-auto max-w-[1600px] px-4 flex flex-col sm:flex-row items-start sm:items-center gap-2.5 text-[11px] text-[#7A726D]">
        <ShieldAlert size={14} className="text-[#C97A72] shrink-0 mt-0.5 sm:mt-0" />
        <p>
          <span className="font-semibold text-[#3E3834]">AuraHealth Clinical Decision Support System.</span>{' '}
          Grounded in ACOG &amp; Rotterdam Consensus criteria. This tool structures and contextualizes
          patient-reported data for a clinical conversation &mdash; it is{' '}
          <span className="font-semibold text-[#3E3834]">not a substitute for primary medical diagnosis.</span>{' '}
          Always consult a licensed clinician.
        </p>
      </div>
    </footer>
  )
}
