import { m } from 'framer-motion'
import { hero } from '../data/content'
import { Screen, titleId } from '../components/layout/Screen'
import { HeroScene } from '../components/technical/HeroScene'
import { usePresentationMode } from '../hooks/usePresentationMode'
import { DURATION, EASE_OUT } from '../lib/motion'

const mask = (delay: number) => ({
  initial: { y: '108%' },
  animate: { y: '0%' },
  transition: { duration: 1.1, ease: EASE_OUT, delay },
})

const fadeIn = (delay: number) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: DURATION.slow, ease: EASE_OUT, delay },
})

function MediaBackground() {
  const { videoSrc, posterSrc } = hero.media
  if (!videoSrc) return <HeroScene />
  return (
    <div className="grain absolute inset-0 overflow-hidden" aria-hidden="true">
      <video
        className="absolute inset-0 size-full object-cover motion-safe:animate-[kenburns_36s_ease-in-out_infinite_alternate]"
        src={videoSrc}
        poster={posterSrc ?? undefined}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#080b0e] via-[#080b0e]/50 to-[#080b0e]/20" />
    </div>
  )
}

export function HeroSection() {
  const deck = usePresentationMode() === 'deck'

  return (
    <Screen id="inicio" theme="dark" tone="none" background={<MediaBackground />}>
      <div className="flex flex-1 flex-col justify-end">
        <m.div className="mb-8 flex items-start gap-4 lg:mb-8" {...fadeIn(0.6)}>
          <span aria-hidden="true" className="mt-1 h-9 w-[3px] bg-accent" />
          <p className="label-mono flex flex-col gap-1 text-fg">
            <span>{hero.eyebrow[0]}</span>
            <span className="text-muted">{hero.eyebrow[1]}</span>
          </p>
        </m.div>

        <h2 id={titleId('inicio')} aria-label={hero.headline} className="font-display font-bold leading-[0.86] tracking-[-0.04em] [font-stretch:78%] text-[clamp(3.25rem,14vw,5.5rem)] lg:text-[8.75rem]">
          {hero.headlineLines.map((line, i) => (
            <span key={line} aria-hidden="true" className="block overflow-hidden pb-[0.04em]">
              <m.span className="block" {...mask(0.8 + i * 0.14)}>
                {line}
              </m.span>
            </span>
          ))}
          <span aria-hidden="true" className="relative block overflow-hidden pb-[0.12em]">
            <m.span className="relative inline-block text-accent" {...mask(1.1)}>
              {hero.headlineAccent}
              <span className="absolute -bottom-[0.02em] left-0 h-[0.06em] w-full overflow-hidden bg-accent/25">
                <span className="block h-full w-1/4 bg-accent motion-safe:animate-[run_2.4s_cubic-bezier(0.65,0,0.35,1)_infinite]" />
              </span>
            </m.span>
          </span>
        </h2>

        <m.p className="display-md mt-6 max-w-[24ch] font-semibold text-muted lg:mt-8" {...fadeIn(1.7)}>
          {hero.subheadline}
        </m.p>

        <m.div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-4 lg:mt-9" {...fadeIn(2.2)}>
          <p className="flex items-center gap-4 text-fg">
            {deck ? (
              <span aria-hidden="true" className="relative flex h-9 w-6 justify-center rounded-full border border-line-strong">
                <span className="mt-1.5 h-2 w-px bg-accent motion-safe:animate-[wheel_1.8s_cubic-bezier(0.65,0,0.35,1)_infinite]" />
              </span>
            ) : (
              <span aria-hidden="true" className="relative block h-10 w-px overflow-hidden bg-line-strong">
                <span className="absolute inset-x-0 top-0 h-1/2 bg-accent motion-safe:animate-[drop_1.8s_cubic-bezier(0.65,0,0.35,1)_infinite]" />
              </span>
            )}
            <span className="label-mono">{deck ? hero.deckHint : hero.scrollHint}</span>
          </p>
          {!hero.media.videoSrc && <p className="label-mono border border-dashed border-line-strong px-2 py-1 text-faint">{hero.media.placeholderLabel}</p>}
        </m.div>
      </div>
    </Screen>
  )
}
