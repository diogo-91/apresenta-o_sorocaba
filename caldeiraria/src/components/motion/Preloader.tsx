import { useEffect, useState } from 'react'
import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import logoSrc from '../../assets/logo-srcb.png'
import { EASE_MECH } from '../../lib/motion'

const FONTS = ['700 1em "Archivo Variable"', '400 1em "Inter Variable"', '400 1em "IBM Plex Mono"']
const SKIP_IF_FASTER_THAN = 180
const GIVE_UP_AFTER = 3500

function loadImage(src: string) {
  return new Promise<void>((resolve) => {
    const img = new Image()
    img.onload = img.onerror = () => resolve()
    img.src = src
  })
}

export function usePreload() {
  const [progress, setProgress] = useState(0)
  const [ready, setReady] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const tasks = [...FONTS.map((f) => document.fonts.load(f).then(() => undefined)), loadImage(logoSrc)]
    let done = 0
    const show = window.setTimeout(() => setVisible(true), SKIP_IF_FASTER_THAN)
    const finish = () => {
      window.clearTimeout(show)
      setProgress(1)
      setReady(true)
    }
    const giveUp = window.setTimeout(finish, GIVE_UP_AFTER)
    tasks.forEach((t) =>
      t.catch(() => undefined).then(() => {
        done += 1
        setProgress(done / tasks.length)
      }),
    )
    Promise.allSettled(tasks).then(() => {
      window.clearTimeout(giveUp)
      finish()
    })
    return () => {
      window.clearTimeout(show)
      window.clearTimeout(giveUp)
    }
  }, [])

  return { progress, ready, visible }
}

export function Preloader({ progress, done, visible }: { progress: number; done: boolean; visible: boolean }) {
  const reduced = useReducedMotion()
  return (
    <AnimatePresence>
      {visible && !done && (
        <m.div
          key="preloader"
          role="status"
          aria-label="Carregando apresentação"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-[#07090b] text-[#f1f3f4]"
          exit={reduced ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.8, ease: EASE_MECH }}
        >
          <p className="font-mono text-xs tracking-[0.32em]">SOROCABA MOTORES</p>
          <div className="relative h-px w-56 bg-white/15">
            <span className="absolute inset-y-0 left-0 w-full origin-left bg-[#ff5a1f] transition-transform duration-500 ease-mech" style={{ transform: `scaleX(${progress})` }} />
          </div>
          <p className="font-mono text-[0.625rem] tracking-[0.2em] text-white/50 tabular-nums">{String(Math.round(progress * 100)).padStart(3, '0')}%</p>
        </m.div>
      )}
    </AnimatePresence>
  )
}
