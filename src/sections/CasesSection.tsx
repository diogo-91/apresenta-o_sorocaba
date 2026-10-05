import { useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { cases } from '../data/content'
import { caseStudies } from '../data/cases'
import { Screen, titleId } from '../components/layout/Screen'
import { CaseStudyView } from '../components/cases/CaseStudyView'
import { Headline } from '../components/ui/Headline'
import { DURATION, EASE_OUT } from '../lib/motion'

export function CasesSection() {
  const [activeId, setActiveId] = useState(caseStudies[0].id)
  const study = caseStudies.find((c) => c.id === activeId)!

  return (
    <Screen id="cases" tone="deep">
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <Headline id={titleId('cases')} size="md" text={cases.headline} className="max-w-[24ch]" />
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

      <div id="case-panel" role="tabpanel" aria-labelledby={`tab-${activeId}`}>
        <AnimatePresence mode="wait">
          <m.div key={study.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: DURATION.fast, ease: EASE_OUT }}>
            <CaseStudyView study={study} />
          </m.div>
        </AnimatePresence>
      </div>
    </Screen>
  )
}
