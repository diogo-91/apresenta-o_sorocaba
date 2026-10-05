import { Fragment } from 'react'
import { m, type Variants } from 'framer-motion'
import { DURATION, EASE_OUT, VIEWPORT_ONCE } from '../../lib/motion'

const container: Variants = {
  hidden: {},
  visible: (delay: number) => ({ transition: { staggerChildren: 0.035, delayChildren: delay } }),
}

const word: Variants = {
  hidden: { y: '105%', opacity: 0 },
  visible: { y: '0%', opacity: 1, transition: { duration: DURATION.slow, ease: EASE_OUT } },
}

export function WordReveal({ text, delay = 0 }: { text: string; delay?: number }) {
  const words = text.split(' ')
  return (
    <m.span
      className="block"
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_ONCE}
      custom={delay}
    >
      {words.map((w, i) => (
        <Fragment key={`${w}-${i}`}>
          <span className="-mb-[0.1em] -mt-[0.14em] inline-block overflow-hidden pb-[0.1em] pt-[0.14em] align-top">
            <m.span className="inline-block" variants={word}>
              {w}
            </m.span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </m.span>
  )
}
