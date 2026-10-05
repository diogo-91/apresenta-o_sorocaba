import { useCallback, useEffect, useRef, useState } from 'react'
import { useDeviceCapabilities } from '../../hooks/useDeviceCapabilities'
import { usePointerParallax } from '../../hooks/usePointerParallax'
import { useScrollProgress } from '../../hooks/useScene'
import { facility3DSteps } from '../../data/facility3d'
import { shotFor } from '../../lib/three/shots'
import { useFacilitySelection } from '../../lib/three/selection'
import { IndustrialScene } from './IndustrialScene'
import { SceneCanvas } from './SceneCanvas'
import { WebGLFallback } from './WebGLFallback'

export default function InlineScene({ scene, className = '' }: { scene: 'hero' | 'facility'; className?: string }) {
  const caps = useDeviceCapabilities()
  const wrapper = useRef<HTMLDivElement>(null)
  const scroll = useRef(0)
  const [visible, setVisible] = useState(false)
  const [step, setStep] = useState(0)
  const pointer = usePointerParallax(!caps.reduced)
  const selected = useFacilitySelection()

  useEffect(() => {
    if (!wrapper.current) return
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '10% 0px' })
    observer.observe(wrapper.current)
    return () => observer.disconnect()
  }, [])

  const render = useCallback(
    (p: number) => {
      scroll.current = scene === 'hero' ? p : 0
      if (scene === 'facility') setStep(Math.min(facility3DSteps.length - 1, Math.floor(p * facility3DSteps.length)))
    },
    [scene],
  )
  useScrollProgress(wrapper, render, caps.webgl)

  const shot = shotFor(scene === 'hero' ? 'inicio' : 'mapa', step, true)!
  const canvas = caps.webgl ? (
    <SceneCanvas dpr={caps.dpr} active={visible} shadows={false} className="size-full" label={scene === 'hero' ? 'Estrutura industrial em 3D' : 'Instalação industrial em 3D por etapas'}>
      <IndustrialScene shot={shot} pointer={pointer} reduced={caps.reduced} lowPower selected={selected} scroll={scroll} />
    </SceneCanvas>
  ) : (
    <WebGLFallback scene={scene} />
  )

  if (scene === 'hero') {
    return (
      <div ref={wrapper} className={className}>
        {canvas}
      </div>
    )
  }

  const current = facility3DSteps.find((s) => s.id === selected) ?? facility3DSteps[step]
  return (
    <div ref={wrapper} className={className} style={{ height: `${facility3DSteps.length * 42}svh` }}>
      <div className="sticky top-16 h-[68svh]">
        {canvas}
        <div className="absolute inset-x-5 bottom-3 border-t border-line bg-paper-2/90 pt-3 backdrop-blur-[2px]" aria-live="polite">
          <p className="label-mono text-accent-ink">
            Etapa {String(facility3DSteps.indexOf(current) + 1).padStart(2, '0')} / {String(facility3DSteps.length).padStart(2, '0')}
          </p>
          <p className="mt-1 font-display text-2xl font-bold tracking-tight">{current.label}</p>
          <p className="text-sm text-muted">{current.services.join(' · ')}</p>
        </div>
      </div>
    </div>
  )
}
