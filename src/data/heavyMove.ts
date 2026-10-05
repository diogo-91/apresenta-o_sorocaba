export const heavyStages = [
  { number: '01', title: 'Planejar', keys: 'rota · carga · pontos críticos' },
  { number: '02', title: 'Içar', keys: 'preparação · elevação' },
  { number: '03', title: 'Mover', keys: 'deslocamento controlado' },
  { number: '04', title: 'Posicionar', keys: 'alinhamento · nivelamento' },
  { number: '05', title: 'Instalar', keys: 'fixação · retomada' },
]

export const HEAVY_FINAL = heavyStages.length + 1
export const HEAVY_STEPS = HEAVY_FINAL + 1

export const heavyCopy = {
  headlineLines: ['Mover uma', 'máquina'],
  headlineAccent: 'é um projeto.',
  headlineTail: 'Não um frete.',
  subheadline: 'Planejamento, içamento, deslocamento e instalação sob controle técnico.',
  videoSrc: '/videos/ativos-pesados.mp4',
  posterSrc: '/videos/ativos-pesados-poster.jpg',
  videoLabel: ['Registro de campo', 'Movimentação de ativo pesado'],
  closing: ['Do ponto A ao ponto B.', 'Com planejamento.'],
  closingSub: 'Movimentação controlada do início à retomada.',
  risks: { label: 'Riscos controlados', items: ['Dano ao equipamento', 'Atraso', 'Exposição', 'Posicionamento'] },
  norms: { label: 'Normas', value: '[A CONFIRMAR]' },
  caseStudy: { label: 'Case técnico', value: '[EM VALIDAÇÃO]' },
}
