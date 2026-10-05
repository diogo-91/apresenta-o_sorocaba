import { useEffect, useState } from 'react'
import { useDeckPosition } from '../../hooks/useDeckPosition'
import { useDeviceCapabilities } from '../../hooks/useDeviceCapabilities'
import { usePointerParallax } from '../../hooks/usePointerParallax'
import { shotFor, type Shot } from '../../lib/three/shots'
import { setFacilitySelection, useFacilitySelection } from '../../lib/three/selection'
import { IndustrialScene } from './IndustrialScene'
import { SceneCanvas } from './SceneCanvas'

const PAUSE_AFTER_HIDE = 1000
const CLIP = { hero: 'inset(96px 0 64px 49%)', facility: 'inset(96px 34% 64px 0)' }

export default function Stage3DLayer() {
  const { id, step } = useDeckPosition()
  const caps = useDeviceCapabilities()
  const pointer = usePointerParallax(!caps.reduced)
  const selected = useFacilitySelection()
  const shot = shotFor(id, step)
  const [lastShot, setLastShot] = useState<Shot | null>(shot)
  const [running, setRunning] = useState(shot !== null)

  useEffect(() => setFacilitySelection(null), [id, step])

  useEffect(() => {
    if (shot) {
      setLastShot(shot)
      setRunning(true)
      return
    }
    const timer = window.setTimeout(() => setRunning(false), PAUSE_AFTER_HIDE)
    return () => window.clearTimeout(timer)
  }, [shot?.scene, shot?.focus])

  if (!lastShot) return null
  return (
    <div
      aria-hidden={!shot}
      className={`pointer-events-none absolute inset-0 z-10 transition-[opacity,clip-path] duration-1000 ease-mech ${shot ? 'opacity-100' : 'opacity-0'} ${lastShot.scene === 'hero' ? 'theme-dark' : ''}`}
      style={{ clipPath: CLIP[lastShot.scene] }}
    >
      <SceneCanvas dpr={caps.dpr} active={running} shadows={!caps.lowPower} className="absolute inset-0" label="Instalação industrial em 3D">
        <IndustrialScene shot={lastShot} pointer={pointer} reduced={caps.reduced} lowPower={caps.lowPower} selected={selected} />
      </SceneCanvas>
    </div>
  )
}
