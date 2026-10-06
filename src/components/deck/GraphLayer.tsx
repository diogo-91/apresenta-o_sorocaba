import { AnimatePresence, m } from 'framer-motion'
import { useDeckPosition } from '../../hooks/useDeckPosition'
import { DURATION } from '../../lib/motion'
import { GRAPH_KEYFRAMES } from '../../lib/systemGraph'
import { SystemGraph } from '../technical/SystemGraph'

export function GraphLayer() {
  const { id, step } = useDeckPosition()
  const keyframes = id === 'desafio' || id === 'modelo' ? GRAPH_KEYFRAMES[id] : null
  return (
    <AnimatePresence>
      {keyframes && (
        <m.div
          key="system-graph"
          className={`pointer-events-none absolute right-24 z-10 flex items-center ${id === 'desafio' ? 'bottom-[64px] left-[52%] top-[118px]' : 'bottom-[100px] top-[150px] w-[640px]'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DURATION.base }}
        >
          <SystemGraph target={keyframes[Math.min(step, keyframes.length - 1)]} className={`mx-auto ${id === 'desafio' ? 'max-w-[570px]' : 'w-[470px]'}`} />
        </m.div>
      )}
    </AnimatePresence>
  )
}
