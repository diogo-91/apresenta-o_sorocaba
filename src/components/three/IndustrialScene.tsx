import { useContext, useEffect, useRef, type MutableRefObject } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Html } from '@react-three/drei'
import { facility3DSteps, type FacilityGroup } from '../../data/facility3d'
import type { PointerState } from '../../hooks/usePointerParallax'
import { tiltFromPointer } from '../../lib/three/tilt'
import type { Shot } from '../../lib/three/shots'
import { setFacilitySelection } from '../../lib/three/selection'
import { IndustrialSystem3D } from './IndustrialSystem3D'
import { ReactiveCamera } from './ReactiveCamera'
import { ReactiveLighting } from './ReactiveLighting'
import { TechnicalHotspot } from './TechnicalHotspot'
import { SlowModeContext } from './SceneCanvas'

const OBJECT_LAMBDA = 1.5
const BASE_YAW = { hero: -0.18, facility: 0 }
const TILT_SCALE = { hero: 1, facility: 0.4 }
const HERO_HIDDEN: FacilityGroup[] = ['confined']

type Props = {
  shot: Shot
  pointer: MutableRefObject<PointerState>
  reduced: boolean
  lowPower: boolean
  selected: string | null
  scroll?: MutableRefObject<number>
}

function ObjectRig({ shot, pointer, reduced, children, grid }: Pick<Props, 'shot' | 'pointer' | 'reduced'> & { children: React.ReactNode; grid: React.RefObject<THREE.Group | null> }) {
  const group = useRef<THREE.Group>(null)
  useFrame((state, delta) => {
    if (!group.current) return
    const scene = shot.scene
    const tilt = reduced ? { x: 0, y: 0 } : tiltFromPointer(pointer.current.x, pointer.current.y)
    const sway = reduced ? 0 : Math.sin(state.clock.elapsedTime * 0.22) * 0.012
    const goalY = BASE_YAW[scene] + tilt.y * TILT_SCALE[scene] + sway
    const goalX = tilt.x * TILT_SCALE[scene]
    const k = reduced ? 1 : 1 - Math.exp(-OBJECT_LAMBDA * delta)
    group.current.rotation.y += (goalY - group.current.rotation.y) * k
    group.current.rotation.x += (goalX - group.current.rotation.x) * k
    if (grid.current) {
      grid.current.rotation.y = group.current.rotation.y * 0.55
      grid.current.rotation.x = group.current.rotation.x * 0.4
    }
  })
  return <group ref={group}>{children}</group>
}

function HeroLabels({ visible }: { visible: boolean }) {
  const labels: { position: [number, number, number]; text: string; sub: string }[] = [
    { position: [-6, 4.5, 3.6], text: 'Cobertura', sub: 'EL. +4,30' },
    { position: [6, 2.2, 3.6], text: 'Estrutura metálica', sub: 'Eixo F' },
    { position: [8.6, 7.3, -1.5], text: 'Reservatório', sub: 'Elevado' },
  ]
  return (
    <>
      {labels.map((l) => (
        <Html key={l.text} position={l.position} zIndexRange={[10, 0]} style={{ pointerEvents: 'none' }}>
          <div className={`flex -translate-y-1/2 items-center gap-2 transition-opacity duration-700 ${visible ? 'opacity-100' : 'opacity-0'}`}>
            <span className="size-1.5 rounded-full bg-accent" />
            <span className="h-px w-10 bg-fg/40" />
            <span className="label-mono whitespace-nowrap text-[0.5625rem] text-fg/70">
              {l.text} <span className="text-faint">· {l.sub}</span>
            </span>
          </div>
        </Html>
      ))}
    </>
  )
}

export function IndustrialScene({ shot, pointer, reduced: prefersReduced, lowPower, selected, scroll }: Props) {
  const slow = useContext(SlowModeContext)
  const reduced = prefersReduced || slow
  const invalidate = useThree((s) => s.invalidate)
  useEffect(() => invalidate(3), [invalidate, shot, selected, slow])
  const grid = useRef<THREE.Group>(null)
  const facility = shot.scene === 'facility'
  const currentIndex = facility3DSteps.findIndex((s) => s.id === shot.focus)
  const shownId = selected ?? (facility ? shot.focus : null)
  const shown = facility3DSteps.find((s) => s.id === shownId) ?? null
  const gridColor = facility ? '#2672b0' : '#5fb0e6'

  return (
    <>
      <ReactiveCamera shot={shot} pointer={pointer} reduced={reduced} scroll={scroll} />
      <ReactiveLighting pointer={pointer} focus={shown?.focus ?? null} lowPower={lowPower} reduced={reduced} />
      <group ref={grid}>
        <gridHelper args={[44, 44, gridColor, gridColor]} position={[0, -0.02, 0]} material-transparent material-opacity={facility ? 0.18 : 0.14} material-depthWrite={false} />
      </group>
      <ObjectRig shot={shot} pointer={pointer} reduced={reduced} grid={grid}>
        <IndustrialSystem3D scene={shot.scene} active={shown ? shown.groups : null} ghost={facility && currentIndex === 0 && !selected} hidden={facility ? [] : HERO_HIDDEN} reduced={reduced}>
          {facility3DSteps.map((step, i) => (
              <TechnicalHotspot
                key={step.id}
                position={step.anchor}
                index={i + 1}
                label={step.label}
                kicker={step.kicker}
                active={step.id === shownId}
                side={step.anchor[0] > 5 ? 'left' : 'right'}
                visible={facility}
                onSelect={() => setFacilitySelection(step.id === selected ? null : step.id)}
              />
            ))}
          <HeroLabels visible={!facility} />
        </IndustrialSystem3D>
      </ObjectRig>
      {!lowPower && <ContactShadows position={[0, -0.01, 0]} scale={34} blur={2.4} opacity={facility ? 0.35 : 0.55} far={8} frames={1} />}
    </>
  )
}
