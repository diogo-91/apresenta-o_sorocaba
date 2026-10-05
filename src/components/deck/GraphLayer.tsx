import { AnimatePresence, m } from 'framer-motion'
import { DURATION } from '../../lib/motion'
import { SystemGraph } from '../technical/SystemGraph'

const STATES: Record<string, 'fragmented' | 'unified'> = { desafio: 'fragmented', modelo: 'unified' }

export function GraphLayer({ activeId }: { activeId: string }) {
  const state = STATES[activeId]
  return (
    <AnimatePresence>
      {state && (
        <m.div
          key="system-graph"
          className="pointer-events-none absolute bottom-[76px] right-24 top-[118px] flex w-[620px] items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DURATION.base }}
        >
          <SystemGraph state={state} className="mx-auto w-[560px]" />
        </m.div>
      )}
    </AnimatePresence>
  )
}
