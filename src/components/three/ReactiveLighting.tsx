import { useEffect, useRef, type MutableRefObject } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import type { PointerState } from '../../hooks/usePointerParallax'
import type { Vec3 } from '../../data/facility3d'

type Props = {
  pointer: MutableRefObject<PointerState>
  focus: Vec3 | null
  lowPower: boolean
  reduced: boolean
}

export function ReactiveLighting({ pointer, focus, lowPower, reduced }: Props) {
  const key = useRef<THREE.DirectionalLight>(null)
  const spot = useRef<THREE.SpotLight>(null)
  const spotTarget = useRef(new THREE.Object3D())
  const gl = useThree((s) => s.gl)
  const scene = useThree((s) => s.scene)

  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl)
    const room = new RoomEnvironment()
    const env = pmrem.fromScene(room, 0.04).texture
    scene.environment = env
    scene.environmentIntensity = 0.55
    return () => {
      scene.environment = null
      env.dispose()
      room.dispose()
      pmrem.dispose()
    }
  }, [gl, scene])

  useFrame((_, delta) => {
    const p = reduced ? { x: 0, y: 0 } : pointer.current
    if (key.current) {
      key.current.position.x = THREE.MathUtils.damp(key.current.position.x, 8 + p.x * 2.5, 1.2, delta)
      key.current.position.y = THREE.MathUtils.damp(key.current.position.y, 12 - p.y * 1.5, 1.2, delta)
    }
    if (spot.current) {
      const [fx, fy, fz] = focus ?? [0, 0, 0]
      const t = spotTarget.current.position
      t.set(THREE.MathUtils.damp(t.x, fx, 2, delta), THREE.MathUtils.damp(t.y, fy, 2, delta), THREE.MathUtils.damp(t.z, fz, 2, delta))
      spot.current.intensity = THREE.MathUtils.damp(spot.current.intensity, focus ? 60 : 0, 2.5, delta)
    }
  })

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight ref={key} position={[8, 12, 7]} intensity={3} castShadow={!lowPower} shadow-mapSize={[1024, 1024]} shadow-bias={-0.0004}>
        <orthographicCamera attach="shadow-camera" args={[-12, 12, 12, -12, 1, 40]} />
      </directionalLight>
      <directionalLight position={[-9, 5, -10]} intensity={1.3} color="#9cc7ea" />
      {!lowPower && (
        <>
          <primitive object={spotTarget.current} />
          <spotLight ref={spot} position={[2, 14, 8]} angle={0.32} penumbra={0.9} intensity={0} color="#ffe2cf" target={spotTarget.current} />
        </>
      )}
    </>
  )
}
