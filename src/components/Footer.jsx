import { ShieldCheck, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="no-print border-t border-[#E8DFD8] bg-[#F8F0E8]/85 backdrop-blur-xl mt-6 py-4">
      <div className="mx-auto max-w-[1600px] px-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-[11px] text-[#7A726D]">
        <div className="flex items-center gap-2">
          <ShieldCheck size={15} className="text-[#D96B85] shrink-0" />
          <p>
            <span className="font-semibold text-[#6A3D55]">AuraHealth Clinical Decision Support System.</span>{' '}
            Grounded in ACOG &amp; Rotterdam Consensus criteria. This tool structures and contextualizes
            patient-reported data for a clinical conversation &mdash; it is{' '}
            <span className="font-semibold text-[#405A43]">not a substitute for primary medical diagnosis.</span>{' '}
            Always consult a licensed clinician.
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 text-[#6A3D55] font-medium text-[10px]">
          <span>HerHealth</span>
          <Heart size={10} className="text-[#D96B85] fill-[#D96B85]" />
          <span>Care &middot; Balance &middot; Science</span>
        </div>
      </div>
    </footer>
  )
}
