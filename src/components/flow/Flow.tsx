import { Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
import type { Slide } from '../deck/Deck'
import { ScrollActiveScreenProvider } from '../../hooks/useActiveScreen'
import { MobileCTA } from '../navigation/MobileCTA'
import { ProgressBar } from '../navigation/ProgressBar'
import { TopBar } from '../navigation/TopBar'

const EAGER = 2

function refreshScrollScenes() {
  void import('../../lib/gsap').then(({ ScrollTrigger }) => ScrollTrigger.refresh())
}

function LazySlot({ id, eager, children }: { id: string; eager: boolean; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(eager)

  useEffect(() => {
    if (mounted || !ref.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setMounted(true)
      },
      { rootMargin: '120% 0px' },
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [mounted])

  useEffect(() => {
    if (mounted) requestAnimationFrame(refreshScrollScenes)
  }, [mounted])

  return (
    <div ref={ref} id={id} data-slot={id} className={mounted ? undefined : 'min-h-svh'}>
      {mounted && <Suspense fallback={<div className="min-h-svh" />}>{children}</Suspense>}
    </div>
  )
}

export function Flow({ slides }: { slides: Slide[] }) {
  useEffect(() => {
    const target = window.location.hash.slice(1)
    if (target) requestAnimationFrame(() => document.getElementById(target)?.scrollIntoView())
  }, [])

  return (
    <ScrollActiveScreenProvider>
      <a href="#inicio" className="label-mono fixed left-4 top-4 z-[60] -translate-y-24 bg-fg px-3 py-2 text-paper focus:translate-y-0">
        Pular para o conteúdo
      </a>
      <ProgressBar />
      <TopBar />
      <main className="pb-mobile-cta">
        {slides.map((slide, i) => (
          <LazySlot key={slide.id} id={slide.id} eager={i < EAGER}>
            {slide.node}
          </LazySlot>
        ))}
      </main>
      <MobileCTA />
    </ScrollActiveScreenProvider>
  )
}
