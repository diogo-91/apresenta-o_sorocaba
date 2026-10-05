import { useContext, useEffect, useRef, type MutableRefObject } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import { facility3DSteps } from '../../data/facility3d'
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
const TILT_SCALE = 0.4

type Props = {
  shot: Shot
  pointer: MutableRefObject<PointerState>
  reduced: boolean
  lowPower: boolean
  selected: string | null
}

function ObjectRig({ pointer, reduced, children, grid }: Pick<Props, 'pointer' | 'reduced'> & { children: React.ReactNode; grid: React.RefObject<THREE.Group | null> }) {
  const group = useRef<THREE.Group>(null)
  useFrame((state, delta) => {
    if (!group.current) return
    const tilt = reduced ? { x: 0, y: 0 } : tiltFromPointer(pointer.current.x, pointer.current.y)
    const sway = reduced ? 0 : Math.sin(state.clock.elapsedTime * 0.22) * 0.012
    const goalY = tilt.y * TILT_SCALE + sway
    const goalX = tilt.x * TILT_SCALE
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

export function IndustrialScene({ shot, pointer, reduced: prefersReduced, lowPower, selected }: Props) {
  const slow = useContext(SlowModeContext)
  const reduced = prefersReduced || slow
  const invalidate = useThree((s) => s.invalidate)
  useEffect(() => invalidate(3), [invalidate, shot, selected, slow])
  const grid = useRef<THREE.Group>(null)
  const currentIndex = facility3DSteps.findIndex((s) => s.id === shot.focus)
  const shownId = selected ?? shot.focus
  const shown = facility3DSteps.find((s) => s.id === shownId) ?? null

  return (
    <>
      <ReactiveCamera shot={shot} pointer={pointer} reduced={reduced} />
      <ReactiveLighting pointer={pointer} focus={shown?.focus ?? null} lowPower={lowPower} reduced={reduced} />
      <group ref={grid}>
        <gridHelper args={[44, 44, '#2672b0', '#2672b0']} position={[0, -0.02, 0]} material-transparent material-opacity={0.18} material-depthWrite={false} />
      </group>
      <ObjectRig pointer={pointer} reduced={reduced} grid={grid}>
        <IndustrialSystem3D active={shown ? shown.groups : null} ghost={currentIndex === 0 && !selected} reduced={reduced}>
          {facility3DSteps.map((step, i) => (
              <TechnicalHotspot
                key={step.id}
                position={step.anchor}
                index={i + 1}
                label={step.label}
                kicker={step.kicker}
                active={step.id === shownId}
                side={step.anchor[0] > 5 ? 'left' : 'right'}
                onSelect={() => setFacilitySelection(step.id === selected ? null : step.id)}
              />
            ))}
        </IndustrialSystem3D>
      </ObjectRig>
      {!lowPower && <ContactShadows position={[0, -0.01, 0]} scale={34} blur={2.4} opacity={0.35} far={8} frames={1} />}
    </>
  )
}
