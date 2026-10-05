export const heavyStages = [
  { number: '01', title: 'Planejamento', text: 'Levantamento técnico, rota, carga e pontos críticos.' },
  { number: '02', title: 'Içamento', text: 'Preparação e elevação controlada do equipamento.' },
  { number: '03', title: 'Movimentação', text: 'Deslocamento conforme plano, rota e restrições da operação.' },
  { number: '04', title: 'Posicionamento', text: 'Alinhamento, nivelamento e ajuste no novo ponto.' },
  { number: '05', title: 'Instalação', text: 'Fixação, ajustes e liberação técnica para retomada.' },
]

export const HEAVY_FINAL = heavyStages.length + 1
export const HEAVY_STEPS = HEAVY_FINAL + 1

export const heavyCopy = {
  headlineLead: 'Mover uma máquina é um',
  headlineAccent: 'projeto.',
  headlineTail: 'Não um frete.',
  subheadline: 'Planejamento, içamento, deslocamento e instalação sob controle técnico.',
  videoSrc: '/videos/ativos-pesados.mp4',
  posterSrc: '/videos/ativos-pesados-poster.jpg',
  videoLabel: 'Registro de campo · Movimentação de ativo pesado',
  closing: ['Do ponto A ao ponto B.', 'Com planejamento.'],
  closingSub: 'Movimentação controlada do início à retomada.',
}
