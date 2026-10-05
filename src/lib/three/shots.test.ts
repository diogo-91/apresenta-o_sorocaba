import { describe, expect, it } from 'vitest'
import { facility3DSteps } from '../../data/facility3d'
import { shotFor } from './shots'

describe('roteiro de câmera', () => {
  it('a capa 3D aparece na abertura', () => {
    expect(shotFor('inicio', 0)?.scene).toBe('hero')
  })

  it('o mapa da operação tem um enquadramento por etapa', () => {
    const shots = facility3DSteps.map((_, i) => shotFor('mapa', i))
    expect(shots.every((s) => s?.scene === 'facility')).toBe(true)
    expect(new Set(shots.map((s) => s?.focus)).size).toBe(facility3DSteps.length)
  })

  it('passo além do último mantém o enquadramento final', () => {
    expect(shotFor('mapa', 99)).toEqual(shotFor('mapa', facility3DSteps.length - 1))
  })

  it('no celular o objeto fica centralizado no quadro', () => {
    expect(shotFor('mapa', 3, true)?.target).toEqual(facility3DSteps[3].focus)
  })

  it('slides sem 3D não têm enquadramento', () => {
    expect(shotFor('metodo', 0)).toBeNull()
  })
})
