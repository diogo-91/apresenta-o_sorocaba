import { FacilityDrawing } from '../technical/FacilityDrawing'

export function WebGLFallback({ scene }: { scene: 'hero' | 'facility' }) {
  if (scene === 'hero') return null
  return <FacilityDrawing />
}
