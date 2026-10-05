import { lazy, useLayoutEffect, useMemo, useRef, type ReactNode } from 'react'
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { useFrame } from '@react-three/fiber'
import type { FacilityGroup } from '../../data/facility3d'
import { models } from '../../data/models'

const UNIT_BOX = new THREE.BoxGeometry(1, 1, 1)
const UNIT_CYLINDER = new THREE.CylinderGeometry(1, 1, 1, 20)
const UNIT_CONE = new THREE.ConeGeometry(1, 1, 20)
const GRAY = new THREE.Color('#7d858c')

export const FACILITY_GROUPS: FacilityGroup[] = ['structure', 'roof', 'skylights', 'electrical', 'mechanical', 'utilities', 'reservoir', 'confined']

type Mat = 'steel' | 'dark' | 'graphite' | 'glass' | 'accent' | 'concrete' | 'lamp' | 'pipe'

function makeMaterials(): Record<Mat, THREE.MeshStandardMaterial> {
  return {
    steel: new THREE.MeshStandardMaterial({ color: '#b8c0c7', metalness: 0.85, roughness: 0.3 }),
    dark: new THREE.MeshStandardMaterial({ color: '#6c747c', metalness: 0.8, roughness: 0.4 }),
    graphite: new THREE.MeshStandardMaterial({ color: '#3a4147', metalness: 0.5, roughness: 0.55 }),
    glass: new THREE.MeshStandardMaterial({ color: '#c3dbeb', metalness: 0.15, roughness: 0.08, transparent: true, opacity: 0.55 }),
    accent: new THREE.MeshStandardMaterial({ color: '#ff5a1f', metalness: 0.3, roughness: 0.45, emissive: '#ff5a1f', emissiveIntensity: 0.12 }),
    concrete: new THREE.MeshStandardMaterial({ color: '#6b737a', metalness: 0.05, roughness: 0.9 }),
    lamp: new THREE.MeshStandardMaterial({ color: '#f1f3f4', emissive: '#f1f3f4', emissiveIntensity: 0.35, roughness: 0.4 }),
    pipe: new THREE.MeshStandardMaterial({ color: '#7f97a8', metalness: 0.78, roughness: 0.38 }),
  }
}

type Part = { mat: Mat; pos: [number, number, number]; size: [number, number, number]; rot?: [number, number, number]; shape?: 'box' | 'cyl' | 'cone' }

function mergeByMaterial(parts: Part[]) {
  const buckets = new Map<Mat, THREE.BufferGeometry[]>()
  const matrix = new THREE.Matrix4()
  const quaternion = new THREE.Quaternion()
  for (const p of parts) {
    const base = p.shape === 'cyl' ? UNIT_CYLINDER : p.shape === 'cone' ? UNIT_CONE : UNIT_BOX
    quaternion.setFromEuler(new THREE.Euler(...(p.rot ?? [0, 0, 0])))
    matrix.compose(new THREE.Vector3(...p.pos), quaternion, new THREE.Vector3(...p.size))
    const geometry = base.clone().applyMatrix4(matrix)
    buckets.set(p.mat, [...(buckets.get(p.mat) ?? []), geometry])
  }
  return [...buckets].map(([mat, list]) => ({ mat, geometry: mergeGeometries(list)! }))
}

function Parts({ parts, mats }: { parts: Part[]; mats: Record<Mat, THREE.MeshStandardMaterial> }) {
  const merged = useMemo(() => mergeByMaterial(parts), [parts])
  return (
    <>
      {merged.map(({ mat, geometry }) => (
        <mesh key={mat} geometry={geometry} material={mats[mat]} castShadow receiveShadow />
      ))}
    </>
  )
}

const COLUMN_X = [-6, -3, 0, 3, 6]
const COLUMN_Z = [-3.5, 0, 3.5]
const TEETH = [-6, -3, 0, 3]
const H = 3.2
const RISE = 1.1
const SLOPE = Math.atan2(RISE, 3)
const SLOPE_LEN = Math.hypot(3, RISE)
const BRACE = Math.atan2(H, 3)
const BRACE_LEN = Math.hypot(3, H)

const STRUCTURE: Part[] = [
  { mat: 'concrete', pos: [0, -0.13, 0], size: [13, 0.26, 8] },
  ...COLUMN_X.flatMap((x) => COLUMN_Z.map((z): Part => ({ mat: 'steel', pos: [x, H / 2, z], size: [0.22, H, 0.22] }))),
  ...COLUMN_Z.map((z): Part => ({ mat: 'steel', pos: [0, H, z], size: [12.2, 0.24, 0.18] })),
  ...COLUMN_X.map((x): Part => ({ mat: 'steel', pos: [x, H, 0], size: [0.18, 0.24, 7] })),
  ...[-4.5, 4.5].flatMap((x): Part[] => [
    { mat: 'dark', pos: [x, H / 2, -3.5], size: [BRACE_LEN, 0.06, 0.06], rot: [0, 0, BRACE] },
    { mat: 'dark', pos: [x, H / 2, -3.5], size: [BRACE_LEN, 0.06, 0.06], rot: [0, 0, -BRACE] },
  ]),
  ...TEETH.map((x): Part => ({ mat: 'dark', pos: [x + 1.5, H + 0.16, 0], size: [3, 0.08, 0.08] })),
]

const ROOF: Part[] = [
  ...TEETH.map((x): Part => ({ mat: 'steel', pos: [x + 1.5, H + RISE / 2, 0], size: [SLOPE_LEN, 0.07, 7.4], rot: [0, 0, -SLOPE] })),
  ...TEETH.map((x): Part => ({ mat: 'graphite', pos: [x + 1.5, H + RISE / 2 + 0.05, 3.72], size: [SLOPE_LEN, 0.12, 0.06], rot: [0, 0, -SLOPE] })),
  { mat: 'graphite', pos: [6.04, H + 0.05, 0], size: [0.1, 0.18, 7.4] },
]

const SKYLIGHTS: Part[] = [
  ...TEETH.map((x): Part => ({ mat: 'glass', pos: [x + 0.02, H + RISE / 2, 0], size: [0.05, RISE - 0.08, 7.2] })),
  ...TEETH.flatMap((x) => [-2.4, 0, 2.4].map((z): Part => ({ mat: 'dark', pos: [x + 0.04, H + RISE / 2, z], size: [0.07, RISE, 0.06] }))),
]

const ELECTRICAL: Part[] = [
  ...[2.4, 3.4, 4.4].flatMap((x): Part[] => [
    { mat: 'graphite', pos: [x, 0.95, -3.05], size: [0.82, 1.9, 0.5] },
    { mat: 'accent', pos: [x + 0.25, 1.6, -2.79], size: [0.08, 0.08, 0.02] },
    { mat: 'dark', pos: [x, 2.35, -3.1], size: [0.06, 0.9, 0.06] },
  ]),
  { mat: 'steel', pos: [0, 2.8, -3.05], size: [11, 0.06, 0.34] },
  ...[-4.5, -1.5, 1.5, 4.5].flatMap((x) => [-1.75, 1.75].map((z): Part => ({ mat: 'lamp', pos: [x, H - 0.2, z], size: [1.2, 0.05, 0.16] }))),
]

const MECHANICAL: Part[] = [
  { mat: 'dark', pos: [-3, 0.2, 1.1], size: [2.4, 0.4, 1.3] },
  { mat: 'steel', pos: [-3.2, 0.85, 1.1], size: [1.3, 0.9, 0.95] },
  { mat: 'graphite', pos: [-2.15, 0.8, 1.1], size: [0.32, 0.8, 0.32], rot: [0, 0, Math.PI / 2], shape: 'cyl' },
  { mat: 'dark', pos: [-1.7, 0.8, 1.1], size: [0.52, 0.16, 0.52], rot: [0, 0, Math.PI / 2], shape: 'cyl' },
  { mat: 'dark', pos: [1.6, 0.25, 1.2], size: [3.2, 0.5, 1] },
  { mat: 'steel', pos: [1.6, 0.85, 1.2], size: [2.6, 0.7, 0.7] },
  { mat: 'graphite', pos: [0.15, 0.95, 1.2], size: [0.5, 0.9, 0.9] },
  { mat: 'steel', pos: [0, 2.85, -2.6], size: [12, 0.16, 0.14] },
  { mat: 'steel', pos: [0, 2.85, 2.6], size: [12, 0.16, 0.14] },
  { mat: 'dark', pos: [-1, 2.72, 0], size: [0.26, 0.26, 5.4] },
  { mat: 'graphite', pos: [-1, 2.45, 0.6], size: [0.4, 0.3, 0.4] },
  { mat: 'accent', pos: [-1, 1.95, 0.6], size: [0.06, 0.6, 0.06] },
]

const UTILITIES: Part[] = [
  ...[-2.25, -2.45].map((z): Part => ({ mat: 'pipe', pos: [0.5, 2.35, z], size: [0.07, 11, 0.07], rot: [0, 0, Math.PI / 2], shape: 'cyl' })),
  { mat: 'pipe', pos: [7.2, 0.12, -2.3], size: [0.07, 2.4, 0.07], rot: [0, 0, Math.PI / 2], shape: 'cyl' },
  { mat: 'graphite', pos: [7.1, 0.3, -2.8], size: [0.9, 0.6, 0.6] },
  { mat: 'accent', pos: [7.1, 0.7, -2.8], size: [0.12, 0.12, 0.12] },
]

const LEGS: [number, number][] = [
  [-0.8, -0.8],
  [0.8, -0.8],
  [-0.8, 0.8],
  [0.8, 0.8],
]

const RESERVOIR: Part[] = [
  ...LEGS.map(([dx, dz]): Part => ({ mat: 'steel', pos: [8.6 + dx, 2.5, -1.5 + dz], size: [0.08, 5, 0.08], shape: 'cyl' })),
  ...[1.6, 3.2].flatMap((y): Part[] => [
    { mat: 'dark', pos: [8.6, y, -2.3], size: [1.6, 0.05, 0.05] },
    { mat: 'dark', pos: [8.6, y, -0.7], size: [1.6, 0.05, 0.05] },
    { mat: 'dark', pos: [7.8, y, -1.5], size: [0.05, 0.05, 1.6] },
    { mat: 'dark', pos: [9.4, y, -1.5], size: [0.05, 0.05, 1.6] },
  ]),
  { mat: 'steel', pos: [8.6, 5.85, -1.5], size: [1.15, 1.6, 1.15], shape: 'cyl' },
  { mat: 'dark', pos: [8.6, 6.85, -1.5], size: [1.2, 0.4, 1.2], shape: 'cone' },
  { mat: 'pipe', pos: [8.6, 2.6, -1.5], size: [0.09, 5.2, 0.09], shape: 'cyl' },
]

const CONFINED: Part[] = [
  { mat: 'dark', pos: [-2.4, -1.35, 5.4], size: [0.75, 3.2, 0.75], rot: [0, 0, Math.PI / 2], shape: 'cyl' },
  { mat: 'graphite', pos: [-1.5, -0.35, 5.4], size: [0.32, 1.3, 0.32], shape: 'cyl' },
  { mat: 'accent', pos: [-1.5, 0.32, 5.4], size: [0.36, 0.04, 0.36], shape: 'cyl' },
  { mat: 'pipe', pos: [-4.1, -1.35, 5.4], size: [0.06, 1.2, 0.06], rot: [0, 0, Math.PI / 2], shape: 'cyl' },
]

const PROCEDURAL: Record<FacilityGroup, Part[]> = {
  structure: STRUCTURE,
  roof: ROOF,
  skylights: SKYLIGHTS,
  electrical: ELECTRICAL,
  mechanical: MECHANICAL,
  utilities: UTILITIES,
  reservoir: RESERVOIR,
  confined: CONFINED,
}

function ProceduralFacility() {
  const sets = useMemo(() => Object.fromEntries(FACILITY_GROUPS.map((g) => [g, makeMaterials()])) as Record<FacilityGroup, Record<Mat, THREE.MeshStandardMaterial>>, [])
  return (
    <>
      {FACILITY_GROUPS.map((g) => (
        <group key={g} name={g}>
          <Parts parts={PROCEDURAL[g]} mats={sets[g]} />
        </group>
      ))}
    </>
  )
}

const GLBFacility = lazy(() => import('./GLBFacility'))

type Tracked = { material: THREE.MeshStandardMaterial; color: THREE.Color; opacity: number }
type GroupState = { mats: Tracked[]; opacity: number; dim: number }

function useGroupHighlight(root: React.RefObject<THREE.Group | null>, active: FacilityGroup[] | null, ghost: boolean, reduced: boolean) {
  const state = useRef<Map<FacilityGroup, GroupState>>(new Map())

  useLayoutEffect(() => {
    const map = new Map<FacilityGroup, GroupState>()
    for (const name of FACILITY_GROUPS) {
      const group = root.current?.getObjectByName(name)
      if (!group) continue
      const mats: Tracked[] = []
      group.traverse((obj) => {
        const mesh = obj as THREE.Mesh
        if (!mesh.isMesh) return
        const material = (mesh.material as THREE.MeshStandardMaterial).clone()
        material.transparent = true
        material.needsUpdate = true
        mesh.material = material
        mats.push({ material, color: material.color.clone(), opacity: material.opacity })
      })
      map.set(name, { mats, opacity: 1, dim: 0 })
    }
    state.current = map
  }, [root])

  useFrame((_, delta) => {
    for (const [name, s] of state.current) {
      const isActive = active?.includes(name) ?? true
      const targetOpacity = isActive ? 1 : ghost ? 0.14 : 0.3
      const targetDim = isActive ? 0 : 0.65
      const k = reduced ? 1 : 1 - Math.exp(-3.2 * delta)
      s.opacity += (targetOpacity - s.opacity) * k
      s.dim += (targetDim - s.dim) * k
      for (const t of s.mats) {
        const m = t.material
        const o = t.opacity * s.opacity
        m.opacity = o
        m.depthWrite = o > 0.5
        m.color.copy(t.color).lerp(GRAY, s.dim)
      }
    }
  })
}

type Props = {
  active?: FacilityGroup[] | null
  ghost?: boolean
  reduced?: boolean
  children?: ReactNode
}

export function IndustrialSystem3D({ active = null, ghost = false, reduced = false, children }: Props) {
  const root = useRef<THREE.Group>(null)
  const url = models.facility
  useGroupHighlight(root, active, ghost, reduced)
  return (
    <group ref={root} name="industrial-system">
      {url ? <GLBFacility url={url} /> : <ProceduralFacility />}
      {children}
    </group>
  )
}
