import { useCallback, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { useDeckPosition } from '../../hooks/useDeckPosition'
import { DURATION } from '../../lib/motion'
import { GRAPH_KEYFRAMES } from '../../lib/systemGraph'
import { SystemGraph } from '../technical/SystemGraph'

const DESAFIO_GRAPH_HEIGHT = 557

function useWidthStretch(height: number) {
  const [stretch, setStretch] = useState(1)
  const ref = useCallback(
    (el: HTMLDivElement | null) => {
      if (!el) return
      const observer = new ResizeObserver(() => setStretch(Math.min(2, Math.max(1, el.offsetWidth / height))))
      observer.observe(el)
      return () => observer.disconnect()
    },
    [height],
  )
  return [stretch, ref] as const
}

export function GraphLayer() {
  const { id, step } = useDeckPosition()
  const [stretch, measure] = useWidthStretch(DESAFIO_GRAPH_HEIGHT)
  const keyframes = id === 'desafio' || id === 'modelo' ? GRAPH_KEYFRAMES[id] : null
  const wide = id === 'desafio'
  return (
    <AnimatePresence>
      {keyframes && (
        <m.div
          key="system-graph"
          ref={wide ? measure : undefined}
          className={`pointer-events-none absolute right-24 z-10 flex items-center ${wide ? 'bottom-[64px] left-[47%] top-[118px]' : 'bottom-[100px] top-[150px] w-[640px]'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DURATION.base }}
        >
          <SystemGraph target={keyframes[Math.min(step, keyframes.length - 1)]} stretch={wide ? stretch : 1} large={wide} className={wide ? 'w-full' : 'mx-auto w-[470px]'} />
        </m.div>
      )}
    </AnimatePresence>
  )
}
