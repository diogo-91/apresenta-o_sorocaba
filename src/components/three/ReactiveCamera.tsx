import { useRef, type MutableRefObject } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import type { Shot } from '../../lib/three/shots'
import type { PointerState } from '../../hooks/usePointerParallax'

const CAMERA_LAMBDA = 1.8
const POINTER_LAMBDA = 1.4
const POINTER_REACH = { x: 0.35, y: 0.2 }

type Props = {
  shot: Shot
  pointer: MutableRefObject<PointerState>
  reduced: boolean
  scroll?: MutableRefObject<number>
}

export function ReactiveCamera({ shot, pointer, reduced, scroll }: Props) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera
  const target = useRef(new THREE.Vector3(...shot.target))
  const lean = useRef({ x: 0, y: 0 })
  const goalPos = useRef(new THREE.Vector3())
  const goalTarget = useRef(new THREE.Vector3())
  const offset = useRef(new THREE.Vector3())
  const first = useRef(true)

  useFrame((_, delta) => {
    const dolly = scroll ? scroll.current : 0
    goalPos.current.set(...shot.position).lerp(goalTarget.current.set(...shot.target), dolly * 0.18)
    goalTarget.current.set(...shot.target)

    if (reduced || first.current) {
      camera.position.copy(goalPos.current)
      target.current.copy(goalTarget.current)
      camera.fov = shot.fov
      camera.filmOffset = shot.filmOffset
      first.current = false
    } else {
      const p = pointer.current
      lean.current.x = THREE.MathUtils.damp(lean.current.x, p.x, POINTER_LAMBDA, delta)
      lean.current.y = THREE.MathUtils.damp(lean.current.y, p.y, POINTER_LAMBDA, delta)
      camera.position.x = THREE.MathUtils.damp(camera.position.x, goalPos.current.x, CAMERA_LAMBDA, delta)
      camera.position.y = THREE.MathUtils.damp(camera.position.y, goalPos.current.y, CAMERA_LAMBDA, delta)
      camera.position.z = THREE.MathUtils.damp(camera.position.z, goalPos.current.z, CAMERA_LAMBDA, delta)
      target.current.x = THREE.MathUtils.damp(target.current.x, goalTarget.current.x, CAMERA_LAMBDA, delta)
      target.current.y = THREE.MathUtils.damp(target.current.y, goalTarget.current.y, CAMERA_LAMBDA, delta)
      target.current.z = THREE.MathUtils.damp(target.current.z, goalTarget.current.z, CAMERA_LAMBDA, delta)
      camera.fov = THREE.MathUtils.damp(camera.fov, shot.fov, CAMERA_LAMBDA, delta)
      camera.filmOffset = THREE.MathUtils.damp(camera.filmOffset, shot.filmOffset, CAMERA_LAMBDA, delta)
    }

    offset.current.set(lean.current.x * POINTER_REACH.x, -lean.current.y * POINTER_REACH.y, 0).applyQuaternion(camera.quaternion)
    camera.position.add(offset.current)
    camera.lookAt(target.current)
    camera.position.sub(offset.current)
    camera.updateProjectionMatrix()
  })

  return null
}
