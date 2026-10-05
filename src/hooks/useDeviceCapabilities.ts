import { useMemo } from 'react'
import { useReducedMotion } from 'framer-motion'
import { DESKTOP_QUERY, useMediaQuery } from './useMediaQuery'

const SOFTWARE_RENDERER = /swiftshader|llvmpipe|software|basic render/i

let webglSupport: boolean | null = null

function forced() {
  return new URLSearchParams(window.location.search).has('force3d')
}

export function hasWebGL() {
  if (webglSupport !== null) return webglSupport
  try {
    const canvas = document.createElement('canvas')
    const gl = (canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: true }) ??
      canvas.getContext('webgl', { failIfMajorPerformanceCaveat: true })) as WebGLRenderingContext | null
    if (!gl) {
      webglSupport = forced()
      return webglSupport
    }
    const debug = gl.getExtension('WEBGL_debug_renderer_info')
    const renderer = String(gl.getParameter(debug ? debug.UNMASKED_RENDERER_WEBGL : gl.RENDERER))
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    webglSupport = !SOFTWARE_RENDERER.test(renderer) || forced()
  } catch {
    webglSupport = false
  }
  return webglSupport
}

export function useDeviceCapabilities() {
  const desktop = useMediaQuery(DESKTOP_QUERY)
  const reduced = useReducedMotion() ?? false
  return useMemo(() => {
    const cores = navigator.hardwareConcurrency ?? 4
    const lowPower = !desktop || cores <= 4
    return {
      webgl: hasWebGL(),
      desktop,
      reduced,
      lowPower,
      dpr: (desktop ? [1, cores <= 4 ? 1.5 : 1.75] : [1, 1.25]) as [number, number],
    }
  }, [desktop, reduced])
}
