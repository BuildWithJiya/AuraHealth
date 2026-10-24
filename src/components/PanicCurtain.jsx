import { useState } from 'react'
import { Calculator, CheckSquare, BookOpen, EyeOff, X, ArrowRight } from 'lucide-react'

/**
 * PanicCurtain.jsx
 * 
 * Instant Stigma Protection & Screen Disguise:
 * If family, roommates, or coworkers walk in unexpectedly, this component instantly
 * covers the screen with an innocent, neutral "Daily Study Notes & Calculus Desk"
 * or "Daily Task List".
 */
export default function PanicCurtain({ active, onExit }) {
  const [tab, setTab] = useState('notes')
  const [calcInput, setCalcInput] = useState('142.50 + 89.20')
  const [calcResult, setCalcResult] = useState('231.70')

  if (!active) return null

  return (
    <div className="fixed inset-0 z-50 bg-[#F4F5F7] text-[#1F2937] font-sans overflow-y-auto select-none">
      {/* Neutral disguised toolbar */}
      <div className="border-b border-[#E5E7EB] bg-white px-4 py-2.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded bg-[#4B5563] text-white flex items-center justify-center font-mono font-bold text-xs">
            ∑
          </div>
          <div>
            <h1 className="text-xs font-bold text-[#111827] uppercase tracking-wide">
              Daily Study Desk &middot; Engineering Physics &amp; Mathematics
            </h1>
            <p className="text-[10px] text-[#6B7280]">Doc ID: PHY-2024-SEM2 &middot; Autosaved locally</p>
          </div>
        </div>

        {/* Camouflage Navigation */}
        <div className="flex items-center gap-1.5 bg-[#F3F4F6] p-1 rounded-lg text-xs">
          <button
            onClick={() => setTab('notes')}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              tab === 'notes' ? 'bg-white text-[#111827] shadow-2xs' : 'text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            <BookOpen size={12} className="inline mr-1" /> Lecture Notes
          </button>
          <button
            onClick={() => setTab('calc')}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              tab === 'calc' ? 'bg-white text-[#111827] shadow-2xs' : 'text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            <Calculator size={12} className="inline mr-1" /> Calculator
          </button>
          <button
            onClick={() => setTab('tasks')}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              tab === 'tasks' ? 'bg-white text-[#111827] shadow-2xs' : 'text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            <CheckSquare size={12} className="inline mr-1" /> To-Do List
          </button>
        </div>

        {/* Subtle Disguised Exit Trigger */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#9CA3AF] hidden sm:inline">Camouflage Active (Press Esc to restore)</span>
          <button
            onClick={onExit}
            className="text-xs font-medium text-[#4B5563] hover:text-[#111827] bg-[#E5E7EB] hover:bg-[#D1D5DB] px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Restore Aura Health"
          >
            <EyeOff size={13} />
            <span>Resume Aura</span>
          </button>
        </div>
      </div>

      {/* Disguised Main Workspace */}
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {tab === 'notes' && (
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-xs space-y-4 font-mono text-xs leading-relaxed text-[#374151]">
            <div className="flex items-center justify-between border-b border-[#F3F4F6] pb-3">
              <span className="text-[#6B7280]">MODULE 4: MULTIVARIATE CALCULUS &amp; THERMODYNAMICS</span>
              <span className="text-[#9CA3AF]">PAGE 3 OF 12</span>
            </div>

            <div className="space-y-3 font-sans text-sm">
              <h2 className="font-bold text-base text-[#111827]">Section 4.2 &mdash; Partial Derivatives and Gradient Vectors</h2>
              <p className="text-[#4B5563]">
                Given a function <code className="bg-[#F3F4F6] px-1.5 py-0.5 rounded font-mono text-xs">f(x, y, z)</code>, the directional derivative along unit vector <code className="bg-[#F3F4F6] px-1.5 py-0.5 rounded font-mono text-xs">u</code> represents the instantaneous rate of change of the scalar field in the direction of <code className="bg-[#F3F4F6] px-1.5 py-0.5 rounded font-mono text-xs">u</code>.
              </p>

              <div className="bg-[#F9FAFB] p-4 rounded-lg border border-[#E5E7EB] font-mono text-xs space-y-1">
                <p className="text-[#1F2937]">∇f(x, y) = [ ∂f/∂x, ∂f/∂y ]</p>
                <p className="text-[#6B7280]">Du f(x, y) = ∇f(x, y) · u = |∇f| cos(θ)</p>
                <p className="text-[#059669]">Status: Verified convergent on boundary domain [0, 2π]</p>
              </div>

              <p className="text-[#4B5563]">
                Recall from earlier problem sets that maximum rate of increase occurs precisely when the direction vector aligns parallel with the gradient field vector.
              </p>
            </div>
          </div>
        )}

        {tab === 'calc' && (
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-xs max-w-md mx-auto space-y-4">
            <h3 className="font-bold text-sm text-[#111827]">Standard Scientific Quick Calc</h3>
            <div className="bg-[#111827] text-green-400 p-4 rounded-lg font-mono text-right text-lg">
              <div className="text-xs text-gray-400">{calcInput} =</div>
              <div className="text-xl font-bold">{calcResult}</div>
            </div>
            <div className="grid grid-cols-4 gap-2 text-sm font-mono">
              {['7', '8', '9', '÷', '4', '5', '6', '×', '1', '2', '3', '-', '0', '.', '=', '+'].map((btn) => (
                <button
                  key={btn}
                  onClick={() => {
                    if (btn === '=') setCalcResult('342.15')
                    else setCalcInput((prev) => prev + btn)
                  }}
                  className="p-3 bg-[#F3F4F6] hover:bg-[#E5E7EB] rounded font-bold text-center transition-colors"
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>
        )}

        {tab === 'tasks' && (
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-[#111827]">Weekly Academic &amp; Personal Errands</h3>
            {[
              { done: true, text: 'Submit chapter 4 problem set before Thursday 5 PM' },
              { done: true, text: 'Renew library card and return analytical chemistry reference book' },
              { done: false, text: 'Pick up groceries: oats, almond milk, tea, olive oil' },
              { done: false, text: 'Clean study desk and backup project notes to external flash drive' },
              { done: false, text: 'Review lecture recordings for thermal physics review quiz' },
            ].map((t, idx) => (
              <label key={idx} className="flex items-center gap-3 p-2 hover:bg-[#F9FAFB] rounded cursor-pointer">
                <input type="checkbox" defaultChecked={t.done} className="rounded text-[#4B5563]" />
                <span className={`text-sm ${t.done ? 'line-through text-[#9CA3AF]' : 'text-[#374151]'}`}>{t.text}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
