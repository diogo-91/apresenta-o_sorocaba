import { createContext, Suspense, useState, type ReactNode } from 'react'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { FrameGuard } from './FrameGuard'

export const SlowModeContext = createContext(false)

type Props = {
  children: ReactNode
  dpr: [number, number]
  active: boolean
  shadows: boolean
  className?: string
  label: string
}

export function SceneCanvas({ children, dpr, active, shadows, className = '', label }: Props) {
  const [slow, setSlow] = useState(false)
  return (
    <div className={className} role="img" aria-label={label} data-render-mode={slow ? "static" : "live"}>
      <Canvas
        dpr={slow ? 1 : dpr}
        shadows={shadows && !slow}
        frameloop={!active ? 'never' : slow ? 'demand' : 'always'}
        resize={{ offsetSize: true }}
        camera={{ fov: 30, near: 0.5, far: 120, position: [12, 7, 14] }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
        style={{ pointerEvents: 'none' }}
        onCreated={(state) => {
          if (import.meta.env.DEV) Object.assign(window, { __r3f: state })
        }}
      >
        <SlowModeContext.Provider value={slow}>
          <Suspense fallback={null}>{children}</Suspense>
        </SlowModeContext.Provider>
        {!slow && <FrameGuard onSlow={() => setSlow(true)} />}
      </Canvas>
    </div>
  )
}
