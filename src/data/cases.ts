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

export const caseStudies: CaseStudy[] = [placeholderCase(1), placeholderCase(2)]
