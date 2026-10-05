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
          className="pointer-events-none absolute bottom-[100px] right-24 top-[150px] z-10 flex w-[640px] items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DURATION.base }}
        >
          <SystemGraph target={keyframes[Math.min(step, keyframes.length - 1)]} className="mx-auto w-[470px]" />
        </m.div>
      )}
    </AnimatePresence>
  )
}
