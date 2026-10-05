import { TBC } from '../lib/placeholder'

export type CaseStudy = {
  id: string
  label: string
  segment: string
  title: string
  context: string
  constraint: string
  solution: string
  result: string
  sheet: { label: string; value: string }[]
  before: { src: string | null; alt: string }
  after: { src: string | null; alt: string }
}

function placeholderCase(n: number): CaseStudy {
  const label = `[CASE ${String(n).padStart(2, '0')}]`
  return {
    id: `case-${n}`,
    label,
    segment: '[CLIENTE/SEGMENTO]',
    title: '[TÍTULO DO CASE]',
    context: '[CONTEXTO]',
    constraint: '[RESTRIÇÃO]',
    solution: '[SOLUÇÃO]',
    result: '[RESULTADO]',
    sheet: [
      { label: 'Prazo', value: TBC },
      { label: 'Equipe', value: TBC },
      { label: 'Serviço', value: TBC },
      { label: 'Normas', value: TBC },
      { label: 'ART relacionada', value: TBC },
    ],
    before: { src: null, alt: `${label} — registro antes da intervenção` },
    after: { src: null, alt: `${label} — registro depois da intervenção` },
  }
}

export const caseStudies: CaseStudy[] = [
  {
    ...placeholderCase(1),
    segment: 'Planta industrial / galpão operacional',
    title: 'Recuperação de cobertura industrial e claraboias',
    context: 'Cobertura metálica com desgaste natural, perda de acabamento, pontos de oxidação e claraboias com redução de transparência e sinais de envelhecimento.',
    constraint: 'Intervenção em altura sobre área operacional, exigindo planejamento de acesso, controle de risco e execução com o mínimo de impacto na rotina da planta.',
    solution: 'Tratamento da cobertura, preparação das superfícies, pintura técnica, recuperação dos pontos críticos e substituição ou recuperação das claraboias, com revisão de vedação e acabamento.',
    result: 'Cobertura renovada, melhor proteção contra intempéries, claraboias recuperadas e aumento da entrada de luz natural, com melhoria visual e funcional da estrutura.',
    before: { src: '/images/cases/case-01-antes.webp', alt: 'Cobertura metálica de galpão industrial antes da intervenção, com telhas oxidadas e manchadas' },
    after: { src: '/images/cases/case-01-depois.webp', alt: 'A mesma cobertura depois da intervenção, com telhas recuperadas e revestimento claro' },
  },
  placeholderCase(2),
]
