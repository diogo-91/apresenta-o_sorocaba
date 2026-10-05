import { TBC } from '../lib/placeholder'

export const heavyStages = [
  { number: '01', title: 'Planejamento', text: 'Levantamento técnico, rota, carga e pontos de içamento.' },
  { number: '02', title: 'Preparação', text: 'Equipamento preparado para movimentação controlada.' },
  { number: '03', title: 'Içamento', text: 'Içamento controlado: lento, nivelado e acompanhado.' },
  { number: '04', title: 'Movimentação', text: 'Deslocamento controlado conforme rota e plano de carga.' },
  { number: '05', title: 'Posicionamento', text: 'Alinhamento, nivelamento e fixação.' },
  { number: '06', title: 'Instalação', text: 'Base, fixação e conexões técnicas conferidas.' },
]

export const HEAVY_FINAL = heavyStages.length + 1
export const HEAVY_STEPS = HEAVY_FINAL + 1

export const heavyAsset = { file: 'machine.webp', image: null as string | null }

export const heavyCopy = {
  headline: ['Mover uma máquina é um projeto.', 'Não um frete.'],
  pointA: 'Ponto A',
  pointB: 'Ponto B',
  weight: TBC.replace('A CONFIRMAR', 'PESO A CONFIRMAR'),
  route: TBC.replace('A CONFIRMAR', 'ROTA A CONFIRMAR'),
  cg: 'Centro de gravidade',
  lifting: 'Pontos de içamento',
  destination: 'Área de destino',
  hoist: 'Içamento controlado',
  installed: 'Instalada',
  closing: 'Mover uma máquina é um projeto.',
  closingSub: 'Planejar. Içar. Mover. Posicionar.',
  placeholderNote: 'Máquina em desenho provisório · imagem em /images/heavy/machine.webp',
}
