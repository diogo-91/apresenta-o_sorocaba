import { useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { cases } from '../data/content'
import { caseStudies } from '../data/cases'
import { Screen, titleId } from '../components/layout/Screen'
import { CaseStudyView } from '../components/cases/CaseStudyView'
import { DURATION, EASE_OUT } from '../lib/motion'

export function CasesSection() {
  const [activeId, setActiveId] = useState(caseStudies[0].id)
  const study = caseStudies.find((c) => c.id === activeId)!

  return (
    <Screen id="cases" tone="deep">
      <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex items-end gap-6">
          <span aria-hidden="true" className="font-display text-[4.5rem] font-bold leading-[0.8] tracking-tighter text-accent [font-stretch:75%] lg:text-[7rem]">
            {study.label.replace(/[[\]]/g, '')}
          </span>
          <h2 id={titleId('cases')} className="display-md max-w-[22ch] pb-1 lg:text-[2.25rem]">
            {cases.headline}
          </h2>
        </div>
        <div role="tablist" aria-label="Cases" className="flex shrink-0 border border-line-strong">
          {caseStudies.map((c) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              id={`tab-${c.id}`}
              aria-selected={c.id === activeId}
              aria-controls="case-panel"
              onClick={() => setActiveId(c.id)}
              className={`label-mono px-4 py-3 transition-colors duration-300 ease-mech ${c.id === activeId ? 'bg-fg text-paper' : 'text-muted hover:text-fg'}`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div id="case-panel" role="tabpanel" aria-labelledby={`tab-${activeId}`} className="flex min-h-0 flex-1 flex-col">
        <AnimatePresence mode="wait">
          <m.div key={study.id} className="flex min-h-0 flex-1 flex-col" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: DURATION.fast, ease: EASE_OUT }}>
            <CaseStudyView study={study} />
          </m.div>
        </AnimatePresence>
      </div>
    </Screen>
  )
}
