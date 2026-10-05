import { Fragment } from 'react'
import { LazyMotion, MotionConfig, domAnimation } from 'framer-motion'
import { ScrollActiveScreenProvider } from './hooks/useActiveScreen'
import { DESKTOP_QUERY, useMediaQuery } from './hooks/useMediaQuery'
import { PresentationModeContext } from './hooks/usePresentationMode'
import { Deck } from './components/deck/Deck'
import { MobileCTA } from './components/navigation/MobileCTA'
import { ProgressBar } from './components/navigation/ProgressBar'
import { TopBar } from './components/navigation/TopBar'
import { slides } from './slides'
import { CustomCursor } from './components/motion/CustomCursor'
import { Preloader, usePreload } from './components/motion/Preloader'

function Flow() {
  return (
    <ScrollActiveScreenProvider>
      <a href="#inicio" className="label-mono fixed left-4 top-4 z-[60] -translate-y-24 bg-fg px-3 py-2 text-paper focus:translate-y-0">
        Pular para o conteúdo
      </a>
      <ProgressBar />
      <TopBar />
      <main className="pb-mobile-cta">
        {slides.map((slide) => (
          <Fragment key={slide.id}>{slide.node}</Fragment>
        ))}
      </main>
      <MobileCTA />
    </ScrollActiveScreenProvider>
  )
}

export default function App() {
  const deck = useMediaQuery(DESKTOP_QUERY)
  const preload = usePreload()

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        <PresentationModeContext.Provider value={deck ? 'deck' : 'flow'}>
          <Preloader progress={preload.progress} done={preload.ready} visible={preload.visible} />
          {preload.ready && (deck ? <Deck slides={slides} /> : <Flow />)}
          <CustomCursor />
        </PresentationModeContext.Provider>
      </LazyMotion>
    </MotionConfig>
  )
}
