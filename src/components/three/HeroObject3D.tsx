import { useEffect, useLayoutEffect, useMemo, useRef, type MutableRefObject } from 'react'
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { useFrame } from '@react-three/fiber'
import { heroSeparation } from '../../lib/three/heroRig'

type Mat = 'steel' | 'graphite' | 'pipe' | 'machined' | 'cable' | 'accent' | 'led'
type V3 = [number, number, number]

function brushedTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 512
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = 'rgb(118,118,118)'
  ctx.fillRect(0, 0, 128, 512)
  for (let i = 0; i < 900; i++) {
    const v = 100 + Math.random() * 45
    ctx.fillStyle = `rgba(${v},${v},${v},${0.2 + Math.random() * 0.3})`
    ctx.fillRect(Math.random() * 128, Math.random() * 512, 1, 40 + Math.random() * 260)
  }
  for (let i = 0; i < 14; i++) {
    const v = 80 + Math.random() * 90
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1)
    g.addColorStop(0, `rgba(${v},${v},${v},0.35)`)
    g.addColorStop(1, `rgba(${v},${v},${v},0)`)
    ctx.save()
    ctx.translate(Math.random() * 128, Math.random() * 512)
    ctx.scale(10 + Math.random() * 30, 30 + Math.random() * 90)
    ctx.fillStyle = g
    ctx.fillRect(-1, -1, 2, 2)
    ctx.restore()
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.anisotropy = 4
  return texture
}

function makeMaterials(brushed: THREE.Texture): Record<Mat, THREE.Material> {
  return {
    steel: new THREE.MeshPhysicalMaterial({ color: '#4c555d', metalness: 0.88, roughness: 0.58, roughnessMap: brushed, bumpMap: brushed, bumpScale: 0.35, anisotropy: 0.55 }),
    graphite: new THREE.MeshStandardMaterial({ color: '#1a1e22', metalness: 0.35, roughness: 0.78, roughnessMap: brushed }),
    pipe: new THREE.MeshStandardMaterial({ color: '#272d32', metalness: 0.7, roughness: 0.5, roughnessMap: brushed }),
    machined: new THREE.MeshStandardMaterial({ color: '#8b939b', metalness: 1, roughness: 0.24 }),
    cable: new THREE.MeshStandardMaterial({ color: '#101316', metalness: 0.1, roughness: 0.55 }),
    accent: new THREE.MeshStandardMaterial({ color: '#c8461a', metalness: 0.25, roughness: 0.55, emissive: '#ff5a1f', emissiveIntensity: 0.08 }),
    led: new THREE.MeshBasicMaterial({ color: new THREE.Color('#ff5a1f').multiplyScalar(2.2), toneMapped: false }),
  }
}

class Builder {
  buckets = new Map<Mat, THREE.BufferGeometry[]>()
  bolts: THREE.Matrix4[] = []

  add(mat: Mat, geometry: THREE.BufferGeometry, pos: V3 = [0, 0, 0], rot: V3 = [0, 0, 0]) {
    const g = geometry.index ? geometry.toNonIndexed() : geometry
    for (const name of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(name)) g.deleteAttribute(name)
    g.applyMatrix4(new THREE.Matrix4().compose(new THREE.Vector3(...pos), new THREE.Quaternion().setFromEuler(new THREE.Euler(...rot)), new THREE.Vector3(1, 1, 1)))
    this.buckets.set(mat, [...(this.buckets.get(mat) ?? []), g])
    return this
  }

  box(mat: Mat, size: V3, pos: V3, rot?: V3) {
    return this.add(mat, new THREE.BoxGeometry(...size), pos, rot)
  }

  bolt(pos: V3, axis: 'x' | 'y' | 'z') {
    const rot: V3 = axis === 'x' ? [0, 0, Math.PI / 2] : axis === 'z' ? [Math.PI / 2, 0, 0] : [0, 0, 0]
    this.bolts.push(new THREE.Matrix4().compose(new THREE.Vector3(...pos), new THREE.Quaternion().setFromEuler(new THREE.Euler(...rot)), new THREE.Vector3(1, 1, 1)))
    return this
  }

  build() {
    return [...this.buckets].map(([mat, list]) => ({ mat, geometry: mergeGeometries(list)! }))
  }
}

function iProfile(depth: number, width: number, flange: number, web: number) {
  const d = depth / 2
  const w = width / 2
  const t = web / 2
  const r = Math.min(0.02, web)
  const s = new THREE.Shape()
  s.moveTo(-w, -d)
  s.lineTo(w, -d)
  s.lineTo(w, -d + flange)
  s.lineTo(t + r, -d + flange)
  s.quadraticCurveTo(t, -d + flange, t, -d + flange + r)
  s.lineTo(t, d - flange - r)
  s.quadraticCurveTo(t, d - flange, t + r, d - flange)
  s.lineTo(w, d - flange)
  s.lineTo(w, d)
  s.lineTo(-w, d)
  s.lineTo(-w, d - flange)
  s.lineTo(-t - r, d - flange)
  s.quadraticCurveTo(-t, d - flange, -t, d - flange - r)
  s.lineTo(-t, -d + flange + r)
  s.quadraticCurveTo(-t, -d + flange, -t - r, -d + flange)
  s.lineTo(-w, -d + flange)
  s.closePath()
  return s
}

function extrude(shape: THREE.Shape, length: number) {
  const g = new THREE.ExtrudeGeometry(shape, { depth: length, bevelEnabled: true, bevelThickness: 0.004, bevelSize: 0.004, bevelSegments: 1, curveSegments: 3 })
  g.translate(0, 0, -length / 2)
  return g
}

const beamAlongX = (depth: number, width: number, length: number, flange = 0.03, web = 0.018) => extrude(iProfile(depth, width, flange, web), length).rotateY(Math.PI / 2)
const beamAlongY = (depth: number, width: number, length: number, flange = 0.032, web = 0.02) => extrude(iProfile(depth, width, flange, web), length).rotateX(-Math.PI / 2).rotateY(Math.PI / 2)

function boxTube(size: number, wall: number, length: number) {
  const h = size / 2
  const s = new THREE.Shape([new THREE.Vector2(-h, -h), new THREE.Vector2(h, -h), new THREE.Vector2(h, h), new THREE.Vector2(-h, h)])
  const i = h - wall
  s.holes.push(new THREE.Path([new THREE.Vector2(-i, -i), new THREE.Vector2(-i, i), new THREE.Vector2(i, i), new THREE.Vector2(i, -i)]))
  return extrude(s, length)
}

function cylinderX(radius: number, length: number, segments = 40) {
  return new THREE.CylinderGeometry(radius, radius, length, segments).rotateZ(Math.PI / 2)
}

function tube(points: V3[], radius: number, segments = 64) {
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p))), segments, radius, 10)
}

const GIRDER_Y = 2.2
const PIPE = { y: 0.72, z: 0.78, r: 0.2 }
const TRAY = { y: 3.45, z: 0.5 }
const MOTOR = { x: 1.45, y: 2.82 }

function structure(b: Builder) {
  b.add('steel', beamAlongY(0.5, 0.42, 11), [0, 2, 0])
  b.add('steel', beamAlongX(0.62, 0.3, 14), [-7.28, GIRDER_Y, 0])
  b.add('steel', beamAlongX(0.5, 0.28, 7), [3.78, GIRDER_Y, 0])
  b.box('steel', [0.03, 0.82, 0.38], [-0.265, GIRDER_Y, 0])
  b.box('steel', [0.03, 0.7, 0.36], [0.265, GIRDER_Y, 0])
  for (const y of [GIRDER_Y - 0.31, GIRDER_Y + 0.31]) for (const z of [-0.11, 0.11]) b.box('steel', [0.44, 0.02, 0.18], [0, y, z])
  for (const y of [-0.3, -0.12, 0.12, 0.3]) for (const z of [-0.1, 0.1]) b.bolt([-0.3, GIRDER_Y + y, z], 'x').bolt([0.3, GIRDER_Y + y * 0.8, z], 'x')

  const gusset = new THREE.Shape([new THREE.Vector2(0, 0), new THREE.Vector2(-0.85, 0), new THREE.Vector2(0, -0.7)])
  b.add('steel', new THREE.ExtrudeGeometry(gusset, { depth: 0.02, bevelEnabled: false }).translate(0, 0, -0.01), [-0.28, GIRDER_Y - 0.31, 0])

  b.add('steel', beamAlongY(0.36, 0.3, 9), [-3.6, 1.5, -0.05])
  b.box('steel', [0.03, 0.72, 0.34], [-3.6 + 0.195, GIRDER_Y, 0])

  b.add('graphite', boxTube(0.22, 0.012, 9.2).rotateX(Math.PI / 2).rotateZ(-0.72), [-1.6, 3.2, -0.95])

  b.add('steel', beamAlongX(0.4, 0.22, 0.7).rotateY(Math.PI / 2), [0, PIPE.y - PIPE.r - 0.2, 0.55])
  b.box('steel', [0.32, 0.02, 0.26], [0, PIPE.y - PIPE.r - 0.01, PIPE.z])
}

function background(b: Builder) {
  for (const [x, z] of [[-6.5, -5], [3.5, -5.5], [-2, -10], [8, -11]] as const) b.add('steel', beamAlongY(0.6, 0.45, 16), [x, 3, z])
  b.add('steel', beamAlongX(0.7, 0.34, 26), [0, 5.6, -5.2])
  b.add('steel', beamAlongX(0.7, 0.34, 30), [0, 7.4, -10.3])
  b.add('graphite', boxTube(0.26, 0.014, 12).rotateX(Math.PI / 2).rotateZ(0.9), [-1.5, 3.6, -5.2])
}

function pipeLine(b: Builder) {
  b.add('pipe', cylinderX(PIPE.r, 15.2, 48), [-6.0, PIPE.y, PIPE.z])
  b.add('pipe', cylinderX(PIPE.r * 1.5, 0.05, 48), [-2.15, PIPE.y, PIPE.z]).add('pipe', cylinderX(PIPE.r * 1.5, 0.05, 48), [1.58, PIPE.y, PIPE.z])
  b.add('machined', new THREE.TorusGeometry(PIPE.r + 0.016, 0.012, 8, 32, Math.PI).rotateY(Math.PI / 2), [0.0, PIPE.y, PIPE.z])
  b.add('machined', new THREE.TorusGeometry(PIPE.r + 0.016, 0.012, 8, 32, Math.PI).rotateY(Math.PI / 2), [0.06, PIPE.y, PIPE.z])
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2
    b.bolt([-2.185, PIPE.y + Math.cos(a) * 0.255, PIPE.z + Math.sin(a) * 0.255], 'x').bolt([1.545, PIPE.y + Math.cos(a) * 0.255, PIPE.z + Math.sin(a) * 0.255], 'x')
  }
}

function pipeLineRight(b: Builder) {
  b.add('pipe', cylinderX(PIPE.r, 8, 48), [5.65, PIPE.y, PIPE.z])
  b.add('pipe', cylinderX(PIPE.r * 1.5, 0.05, 48), [1.64, PIPE.y, PIPE.z])
  b.box('accent', [0.02, 0.11, 0.06], [1.67, PIPE.y + 0.3, PIPE.z])
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2
    b.bolt([1.675, PIPE.y + Math.cos(a) * 0.255, PIPE.z + Math.sin(a) * 0.255], 'x')
  }
}

function tray(b: Builder) {
  const from = -15
  const to = 6
  const len = to - from
  const cx = (from + to) / 2
  for (const dz of [-0.2, 0.2]) {
    b.box('pipe', [len, 0.09, 0.008], [cx, TRAY.y + 0.045, TRAY.z + dz])
    b.box('pipe', [len, 0.008, 0.03], [cx, TRAY.y, TRAY.z + dz - Math.sign(dz) * 0.015])
  }
  for (let x = from + 0.15; x < to; x += 0.3) b.box('pipe', [0.025, 0.012, 0.4], [x, TRAY.y + 0.006, TRAY.z])
  b.box('pipe', [0.05, 0.05, 0.7], [0, TRAY.y - 0.03, 0.32])
  b.box('pipe', [0.05, 0.05, 0.7], [-3.6, TRAY.y - 0.03, 0.32])
  const radii = [0.03, 0.022, 0.026, 0.018]
  radii.forEach((r, i) => {
    const z = TRAY.z - 0.14 + i * 0.09
    b.add('cable', tube([[from, TRAY.y + 0.012 + r, z], [-7, TRAY.y + 0.012 + r + 0.003, z - 0.01], [-4, TRAY.y + 0.012 + r + 0.004, z + 0.01], [1, TRAY.y + 0.012 + r, z - 0.01], [to, TRAY.y + 0.012 + r, z]], r, 80))
  })
}

function conduit(b: Builder) {
  b.add('cable', tube([[0.12, TRAY.y + 0.04, TRAY.z - 0.05], [0.14, TRAY.y - 0.2, 0.4], [0.15, 2.9, 0.34], [0.15, 1.75, 0.34], [0.1, 1.6, 0.33]], 0.022, 48))
  b.add('graphite', tube([[-0.12, TRAY.y + 0.04, TRAY.z], [-0.13, TRAY.y - 0.25, 0.42], [-0.14, 2.9, 0.38], [-0.14, 1.75, 0.38], [-0.1, 1.6, 0.36]], 0.016, 48))
  for (const y of [3.0, 2.55, 1.95]) b.box('machined', [0.32, 0.012, 0.03], [0, y, 0.36])
}

function junctionBox(b: Builder) {
  b.box('graphite', [0.36, 0.44, 0.16], [0, 1.36, 0.32])
  b.box('graphite', [0.38, 0.02, 0.18], [0, 1.59, 0.32])
  b.box('led', [0.18, 0.008, 0.004], [-0.04, 1.52, 0.402])
  b.box('accent', [0.05, 0.05, 0.004], [0.11, 1.52, 0.402])
  for (const x of [-0.1, 0, 0.1]) b.add('machined', new THREE.CylinderGeometry(0.018, 0.018, 0.05, 12), [x, 1.115, 0.32])
}

function motor(b: Builder) {
  const { x, y } = MOTOR
  b.box('graphite', [1.0, 0.04, 0.62], [x + 0.25, GIRDER_Y + 0.27, 0])
  for (const dx of [-0.25, 0.25]) b.box('graphite', [0.12, 0.2, 0.5], [x + dx, GIRDER_Y + 0.39, 0])
  b.add('pipe', cylinderX(0.26, 0.72, 48), [x, y, 0])
  for (let i = 0; i < 22; i++) {
    const a = (i / 22) * Math.PI * 2
    if (Math.sin(a) < -0.55) continue
    b.box('pipe', [0.62, 0.05, 0.012], [x, y + Math.sin(a) * 0.285, Math.cos(a) * 0.285], [-a + Math.PI / 2, 0, 0])
  }
  b.add('graphite', cylinderX(0.25, 0.09, 48), [x - 0.4, y, 0]).add('graphite', cylinderX(0.255, 0.2, 48), [x - 0.54, y, 0])
  b.add('graphite', cylinderX(0.24, 0.08, 48), [x + 0.4, y, 0])
  b.add('machined', cylinderX(0.06, 0.04, 24), [x + 0.46, y, 0])
  b.box('graphite', [0.24, 0.12, 0.24], [x - 0.05, y + 0.33, 0])
  b.box('accent', [0.12, 0.05, 0.004], [x - 0.05, y + 0.33, 0.122])
  b.box('graphite', [0.5, 0.52, 0.46], [x + 1.1, y - 0.02, 0])
  b.add('machined', cylinderX(0.05, 0.06, 24), [x + 0.82, y, 0])
}

function Merged({ builder, mats, castShadow = true }: { builder: Builder; mats: Record<Mat, THREE.Material>; castShadow?: boolean }) {
  const merged = useMemo(() => builder.build(), [builder])
  const boltGeometry = useMemo(() => new THREE.CylinderGeometry(0.022, 0.022, 0.03, 6), [])
  const bolts = useRef<THREE.InstancedMesh>(null)
  useLayoutEffect(() => {
    if (!bolts.current) return
    builder.bolts.forEach((m, i) => bolts.current!.setMatrixAt(i, m))
    bolts.current.instanceMatrix.needsUpdate = true
  }, [builder])
  useEffect(() => () => merged.forEach((m) => m.geometry.dispose()), [merged])
  useEffect(() => () => boltGeometry.dispose(), [boltGeometry])
  return (
    <>
      {merged.map(({ mat, geometry }) => (
        <mesh key={mat} geometry={geometry} material={mats[mat]} castShadow={castShadow && mat !== 'led'} receiveShadow />
      ))}
      {builder.bolts.length > 0 && <instancedMesh ref={bolts} args={[boltGeometry, mats.machined, builder.bolts.length]} castShadow />}
    </>
  )
}

function make(fn: (b: Builder) => void) {
  const b = new Builder()
  fn(b)
  return b
}


type Props = {
  progress: MutableRefObject<{ value: number }>
  pointer: MutableRefObject<{ x: number; y: number }>
  reduced: boolean
}

export function HeroObject3D({ progress, pointer, reduced }: Props) {
  const brushed = useMemo(brushedTexture, [])
  const mats = useMemo(() => makeMaterials(brushed), [brushed])
  const parts = useMemo(
    () => ({
      structure: make(structure),
      background: make(background),
      pipe: make(pipeLine),
      pipeRight: make(pipeLineRight),
      tray: make((b) => (tray(b), conduit(b))),
      box: make(junctionBox),
      motor: make(motor),
    }),
    [],
  )
  useEffect(() => () => {
    brushed.dispose()
    Object.values(mats).forEach((m) => m.dispose())
  }, [brushed, mats])

  const fore = useRef<THREE.Group>(null)
  const back = useRef<THREE.Group>(null)
  const motorRef = useRef<THREE.Group>(null)
  const boxRef = useRef<THREE.Group>(null)
  const trayRef = useRef<THREE.Group>(null)
  const pipeRightRef = useRef<THREE.Group>(null)
  const coupling = useRef<THREE.Group>(null)
  const lean = useRef({ x: 0, y: 0 })

  useFrame((_, delta) => {
    const sep = heroSeparation(progress.current.value)
    const p = reduced ? { x: 0, y: 0 } : pointer.current
    lean.current.x = THREE.MathUtils.damp(lean.current.x, p.x, 0.9, delta)
    lean.current.y = THREE.MathUtils.damp(lean.current.y, p.y, 0.9, delta)
    const { x: lx, y: ly } = lean.current
    if (fore.current) fore.current.position.set(lx * 0.035, -ly * 0.02, 0)
    if (back.current) back.current.position.set(-lx * 0.06, ly * 0.03, 0)
    if (motorRef.current) motorRef.current.position.set(sep * 1.1 + lx * 0.012, sep * 0.5, 0)
    if (boxRef.current) boxRef.current.position.set(0, 0, sep * 0.9)
    if (trayRef.current) trayRef.current.position.set(0, sep * 0.6, 0)
    if (pipeRightRef.current) pipeRightRef.current.position.set(sep * 0.8, 0, 0)
    if (coupling.current && !reduced) coupling.current.rotation.x += delta * 0.9
  })

  return (
    <group>
      <group ref={back}>
        <Merged builder={parts.background} mats={mats} castShadow={false} />
      </group>
      <Merged builder={parts.structure} mats={mats} />
      <group ref={trayRef}>
        <Merged builder={parts.tray} mats={mats} />
      </group>
      <group ref={boxRef}>
        <Merged builder={parts.box} mats={mats} />
      </group>
      <group ref={motorRef}>
        <Merged builder={parts.motor} mats={mats} />
        <group ref={coupling} position={[MOTOR.x + 0.66, MOTOR.y, 0]}>
          <mesh material={mats.machined} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.11, 0.11, 0.1, 6]} />
          </mesh>
          <mesh material={mats.accent} rotation={[0, 0, Math.PI / 2]} position={[0, 0.0, 0]}>
            <cylinderGeometry args={[0.112, 0.112, 0.012, 6]} />
          </mesh>
        </group>
      </group>
      <group ref={fore}>
        <Merged builder={parts.pipe} mats={mats} />
        <group ref={pipeRightRef}>
          <Merged builder={parts.pipeRight} mats={mats} />
        </group>
      </group>
    </group>
  )
}
