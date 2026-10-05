import { useContext, useEffect, useMemo, useRef, type MutableRefObject } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import type { PointerState } from '../../hooks/usePointerParallax'
import { heroCamera } from '../../lib/three/heroRig'
import { HERO_TILT, tiltFromPointer } from '../../lib/three/tilt'
import { HeroObject3D } from './HeroObject3D'
import { SlowModeContext } from './SceneCanvas'

export type HeroProgress = { value: number; notify: () => void }

const FOG = '#07090b'
const WEIGHT = 0.9

function useStudioEnvironment() {
  const gl = useThree((s) => s.gl)
  const scene = useThree((s) => s.scene)
  useEffect(() => {
    const studio = new THREE.Scene()
    const panel = (color: string, intensity: number, size: [number, number], pos: [number, number, number]) => {
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(...size), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity), side: THREE.DoubleSide }))
      mesh.position.set(...pos)
      mesh.lookAt(0, 0, 0)
      studio.add(mesh)
    }
    panel('#fff4ea', 9, [4, 12], [8, 2, 3])
    panel('#b9d4ec', 3.2, [10, 1.2], [-5, 3, -7])
    panel('#ffffff', 0.15, [8, 8], [0, 9, 0])
    const pmrem = new THREE.PMREMGenerator(gl)
    const env = pmrem.fromScene(studio, 0.02).texture
    scene.environment = env
    scene.environmentIntensity = 0.6
    scene.fog = new THREE.Fog(FOG, 6.5, 17)
    return () => {
      scene.environment = null
      scene.fog = null
      env.dispose()
      pmrem.dispose()
      studio.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose()
          o.material.dispose()
        }
      })
    }
  }, [gl, scene])
}

function dotTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 32
  const ctx = canvas.getContext('2d')!
  const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 32, 32)
  return new THREE.CanvasTexture(canvas)
}

function Dust({ count, reduced }: { count: number; reduced: boolean }) {
  const points = useRef<THREE.Points>(null)
  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = -3 + Math.random() * 7
      positions[i * 3 + 1] = -1 + Math.random() * 5.5
      positions[i * 3 + 2] = -1.5 + Math.random() * 4
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const material = new THREE.PointsMaterial({ size: 0.014, map: dotTexture(), color: '#cdd6dd', transparent: true, opacity: 0.4, depthWrite: false, sizeAttenuation: true })
    return { geometry, material }
  }, [count])
  useEffect(() => () => {
    geometry.dispose()
    material.map?.dispose()
    material.dispose()
  }, [geometry, material])
  useFrame((state, delta) => {
    if (reduced || !points.current) return
    const pos = geometry.attributes.position as THREE.BufferAttribute
    const t = state.clock.elapsedTime
    for (let i = 0; i < count; i++) {
      let y = pos.getY(i) + delta * (0.025 + (i % 7) * 0.004)
      if (y > 4.5) y = -1
      pos.setY(i, y)
      pos.setX(i, pos.getX(i) + Math.sin(t * 0.2 + i) * delta * 0.01)
    }
    pos.needsUpdate = true
  })
  return <points ref={points} geometry={geometry} material={material} />
}

function TechnicalLines({ reduced }: { reduced: boolean }) {
  const lines = useMemo(() => {
    const make = (points: number[], color: string, dashed = false) => {
      const geometry = new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(points, 3))
      const material = dashed
        ? new THREE.LineDashedMaterial({ color, dashSize: 0.12, gapSize: 0.08, transparent: true, opacity: 0, depthWrite: false })
        : new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0, depthWrite: false })
      const line = new THREE.LineSegments(geometry, material)
      if (dashed) line.computeLineDistances()
      return line
    }
    const y = 1.45
    return [
      { line: make([-4.2, y, 0.2, -0.3, y, 0.2, -4.2, y - 0.08, 0.2, -4.2, y + 0.08, 0.2, -0.3, y - 0.08, 0.2, -0.3, y + 0.08, 0.2], '#a9bccb'), phase: 0 },
      { line: make([-9, 0.72, 0.78, 9, 0.72, 0.78], '#a9bccb', true), phase: 2.1 },
      { line: make([0.62, -1, 0.3, 0.62, 4.6, 0.3, 0.55, 2.2, 0.3, 0.75, 2.2, 0.3], '#ff5a1f'), phase: 4.3 },
    ]
  }, [])
  useEffect(() => () => lines.forEach(({ line }) => {
    line.geometry.dispose()
    ;(line.material as THREE.Material).dispose()
  }), [lines])
  useFrame((state) => {
    const t = state.clock.elapsedTime
    for (const { line, phase } of lines) {
      const m = line.material as THREE.LineBasicMaterial
      m.opacity = reduced ? 0.18 : Math.max(0, Math.sin(t * 0.32 + phase)) ** 3 * 0.4
    }
  })
  return (
    <>
      {lines.map(({ line }, i) => (
        <primitive key={i} object={line} />
      ))}
    </>
  )
}

type Props = {
  pointer: MutableRefObject<PointerState>
  progress: MutableRefObject<HeroProgress>
  reduced: boolean
  lowPower: boolean
  compact: boolean
}

export function HeroScene3D({ pointer, progress, reduced: prefersReduced, lowPower, compact }: Props) {
  const slow = useContext(SlowModeContext)
  const reduced = prefersReduced || slow
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera
  const invalidate = useThree((s) => s.invalidate)
  const rig = useRef<THREE.Group>(null)
  const key = useRef<THREE.DirectionalLight>(null)
  const sweep = useRef<THREE.SpotLight>(null)
  const sweepTarget = useMemo(() => new THREE.Object3D(), [])
  const lean = useRef({ x: 0, y: 0 })
  const look = useMemo(() => new THREE.Vector3(), [])
  const offset = useMemo(() => new THREE.Vector3(), [])
  useStudioEnvironment()

  useEffect(() => {
    progress.current.notify = () => invalidate()
    invalidate(3)
    return () => {
      progress.current.notify = () => {}
    }
  }, [invalidate, progress, slow])

  useFrame((state, delta) => {
    const t = reduced ? 0 : state.clock.elapsedTime
    const p = reduced ? { x: 0, y: 0 } : pointer.current
    lean.current.x = THREE.MathUtils.damp(lean.current.x, p.x, WEIGHT, delta)
    lean.current.y = THREE.MathUtils.damp(lean.current.y, p.y, WEIGHT, delta)
    const { x: lx, y: ly } = lean.current

    const shot = heroCamera(progress.current.value, compact)
    camera.position.set(...shot.position)
    camera.fov = shot.fov
    camera.filmOffset = shot.filmOffset
    offset.set(lx * 0.16 + Math.sin(t * 0.07) * 0.05, -ly * 0.09 + Math.cos(t * 0.05) * 0.03, 0).applyQuaternion(camera.quaternion)
    camera.position.add(offset)
    camera.lookAt(look.set(...shot.target))
    camera.updateProjectionMatrix()

    if (rig.current) {
      const tilt = tiltFromPointer(lx, ly, HERO_TILT)
      rig.current.rotation.set(-0.05 + tilt.x * 0.6, -0.42 + tilt.y + Math.sin(t * 0.09) * 0.006, Math.sin(t * 0.11) * 0.003)
      rig.current.position.y = Math.sin(t * 0.18) * 0.025
    }
    if (key.current) {
      key.current.position.set(6 + lx * 0.8 + Math.sin(t * 0.06) * 0.6, 4 - ly * 0.5, 3)
    }
    if (sweep.current) {
      sweepTarget.position.set(Math.sin(t * 0.045) * 3.2 - 1, 2.2, 0)
      sweep.current.position.set(sweepTarget.position.x + 2.5, 6.5, 4)
    }
  })

  return (
    <>
      <ambientLight intensity={0.03} />
      <hemisphereLight args={['#9fb4c6', '#000000', 0.06]} />
      <directionalLight
        ref={key}
        position={[6, 4, 3]}
        intensity={6.5}
        color="#fff1e4"
        castShadow={!lowPower}
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0003}
        shadow-normalBias={0.02}
      >
        <orthographicCamera attach="shadow-camera" args={[-5, 5, 5, -5, 0.5, 20]} />
      </directionalLight>
      <directionalLight position={[-3, 3.5, -6]} intensity={3.4} color="#b9d4ec" />
      <pointLight position={[0.35, 1.4, 0.9]} intensity={0.5} distance={2.2} color="#ff5a1f" />
      <primitive object={sweepTarget} />
      <spotLight ref={sweep} position={[2, 6.5, 4]} angle={0.22} penumbra={1} intensity={110} distance={16} color="#ffe9d6" target={sweepTarget} />
      <group ref={rig}>
        <HeroObject3D progress={progress} pointer={lean} reduced={reduced} />
        <TechnicalLines reduced={reduced} />
      </group>
      <Dust count={lowPower ? 50 : 140} reduced={reduced} />
    </>
  )
}
