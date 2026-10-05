import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'

export default function GLBFacility({ url }: { url: string }) {
  const { scene } = useGLTF(url, '/draco/', true)
  const clone = useMemo(() => scene.clone(true), [scene])
  return <primitive object={clone} />
}
