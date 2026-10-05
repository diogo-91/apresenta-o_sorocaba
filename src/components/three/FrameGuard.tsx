import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

const MIN_FRAMES = 30
const MAX_WINDOW_MS = 3000
const SLOW_FRAME_MS = 45

export function FrameGuard({ onSlow }: { onSlow: () => void }) {
  const samples = useRef<number[]>([])
  const elapsed = useRef(0)
  const done = useRef(false)
  useFrame((_, delta) => {
    if (done.current) return
    samples.current.push(delta * 1000)
    elapsed.current += delta * 1000
    if (samples.current.length < MIN_FRAMES && elapsed.current < MAX_WINDOW_MS) return
    done.current = true
    const sorted = [...samples.current].sort((a, b) => a - b)
    if (sorted[Math.floor(sorted.length / 2)] > SLOW_FRAME_MS) onSlow()
  })
  return null
}
