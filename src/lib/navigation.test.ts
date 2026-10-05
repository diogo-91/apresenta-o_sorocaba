import { describe, expect, it } from 'vitest'
import { nextScrollTarget } from './navigation'

const vh = 800
const screens = [
  { top: 0, height: 800 },
  { top: 800, height: 1600 },
  { top: 2400, height: 800 },
]

describe('nextScrollTarget', () => {
  it('avança para o topo da próxima tela quando a atual cabe no viewport', () => {
    expect(nextScrollTarget('down', screens, 0, vh)).toBe(800)
  })

  it('rola dentro de uma tela mais alta que o viewport antes de trocar de tela', () => {
    expect(nextScrollTarget('down', screens, 800, vh)).toBe(1480)
  })

  it('não ultrapassa o fim da tela alta ao rolar dentro dela', () => {
    expect(nextScrollTarget('down', screens, 1500, vh)).toBe(1600)
  })

  it('troca de tela quando o fim da tela alta já está visível', () => {
    expect(nextScrollTarget('down', screens, 1600, vh)).toBe(2400)
  })

  it('permanece na última tela ao descer no fim', () => {
    expect(nextScrollTarget('down', screens, 2400, vh)).toBeNull()
  })

  it('volta ao topo da tela atual quando está no meio dela', () => {
    expect(nextScrollTarget('up', screens, 1000, vh)).toBe(800)
  })

  it('ao subir para uma tela alta, chega ao trecho final dela', () => {
    expect(nextScrollTarget('up', screens, 2400, vh)).toBe(1600)
  })

  it('sobe para a tela anterior quando já está no topo da atual', () => {
    expect(nextScrollTarget('up', screens, 800, vh)).toBe(0)
  })

  it('permanece na primeira tela ao subir no início', () => {
    expect(nextScrollTarget('up', screens, 0, vh)).toBeNull()
  })

  it('pula direto para a próxima tela quando a sobra da tela atual é pequena', () => {
    const almostFit = [
      { top: 0, height: 840 },
      { top: 840, height: 800 },
    ]
    expect(nextScrollTarget('down', almostFit, 0, vh)).toBe(840)
  })

  it('ao subir, ignora a pequena sobra da tela anterior e vai ao seu topo', () => {
    const almostFit = [
      { top: 0, height: 840 },
      { top: 840, height: 800 },
    ]
    expect(nextScrollTarget('up', almostFit, 840, vh)).toBe(0)
  })

  it('tolera posições fracionadas próximas ao topo de uma tela', () => {
    expect(nextScrollTarget('down', screens, 799.4, vh)).toBe(1480)
  })
})
