import { m } from 'framer-motion'
import { hero } from '../data/content'
import { Screen, titleId } from '../components/layout/Screen'
import { HeroMedia } from '../components/technical/HeroMedia'
import { Headline } from '../components/ui/Headline'
import { usePresentationMode } from '../hooks/usePresentationMode'
import { DURATION, EASE_OUT } from '../lib/motion'

export function HeroSection() {
  const deck = usePresentationMode() === 'deck'
  const background = (
    <>
      <HeroMedia />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-paper via-paper/55 to-transparent" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-paper/85 via-paper/10 to-transparent" />
    </>
  )

  return (
    <Screen id="inicio" background={background} tone="none">
      <div className="flex flex-1 flex-col justify-end">
        <Headline id={titleId('inicio')} as="h2" size="xl" text={hero.headline} className="max-w-[13ch]" delay={0.2} />
        <m.p
          className="display-md mt-5 max-w-[22ch] text-muted lg:mt-7"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.slow, ease: EASE_OUT, delay: 0.8 }}
        >
          {hero.subheadline}
        </m.p>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5 lg:mt-14">
          <p className="flex items-center gap-4 text-fg">
            <span aria-hidden="true" className="relative block h-10 w-px overflow-hidden bg-line-strong">
              <span className="absolute inset-x-0 top-0 h-1/2 bg-accent motion-safe:animate-[drop_1.8s_cubic-bezier(0.65,0,0.35,1)_infinite]" />
            </span>
            <span className="label-mono">{deck ? hero.deckHint : hero.scrollHint}</span>
          </p>
          {!hero.media.videoSrc && (
            <p className="label-mono border border-dashed border-line-strong px-2 py-1 text-faint">{hero.media.placeholderLabel}</p>
          )}
        </div>
      </div>
    </Screen>
  )
}
