import { lazy, Suspense } from 'react'
import { LazyMotion, MotionConfig, domAnimation } from 'framer-motion'
import { DESKTOP_QUERY, useMediaQuery } from './hooks/useMediaQuery'
import { PresentationModeContext } from './hooks/usePresentationMode'
import { CustomCursor } from './components/motion/CustomCursor'
import { Preloader, usePreload } from './components/motion/Preloader'
import { slides } from './slides'

const Deck = lazy(() => import('./components/deck/Deck').then((m) => ({ default: m.Deck })))
const Flow = lazy(() => import('./components/flow/Flow').then((m) => ({ default: m.Flow })))

export default function App() {
  const deck = useMediaQuery(DESKTOP_QUERY)
  const preload = usePreload()

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        <PresentationModeContext.Provider value={deck ? 'deck' : 'flow'}>
          <Preloader progress={preload.progress} done={preload.ready} visible={preload.visible} />
          {preload.ready && <Suspense fallback={null}>{deck ? <Deck slides={slides} /> : <Flow slides={slides} />}</Suspense>}
          <CustomCursor />
        </PresentationModeContext.Provider>
      </LazyMotion>
    </MotionConfig>
  )
}
