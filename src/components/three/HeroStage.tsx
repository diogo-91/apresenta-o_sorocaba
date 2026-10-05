import { useEffect, useRef, useState, type MutableRefObject } from 'react'
import { useDeviceCapabilities } from '../../hooks/useDeviceCapabilities'
import { usePointerParallax } from '../../hooks/usePointerParallax'
import { HeroScene3D, type HeroProgress } from './HeroScene3D'
import { SceneCanvas } from './SceneCanvas'

type Props = { progress: MutableRefObject<HeroProgress>; compact: boolean; className?: string }

export default function HeroStage({ progress, compact, className = '' }: Props) {
  const caps = useDeviceCapabilities()
  const pointer = usePointerParallax(!caps.reduced && !compact)
  const wrapper = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (!wrapper.current) return
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting))
    observer.observe(wrapper.current)
    const timer = window.setTimeout(() => setShown(true), 120)
    return () => {
      observer.disconnect()
      window.clearTimeout(timer)
    }
  }, [])

  return (
    <div ref={wrapper} className={`transition-opacity duration-[1800ms] ease-out ${shown ? 'opacity-100' : 'opacity-0'} ${className}`}>
      <SceneCanvas dpr={caps.dpr} active={visible} shadows={!caps.lowPower} className="size-full" label="Peça de engenharia: estrutura metálica, tubulação, motor e cabeamento">
        <HeroScene3D pointer={pointer} progress={progress} reduced={caps.reduced} lowPower={caps.lowPower} compact={compact} />
      </SceneCanvas>
    </div>
  )
}
