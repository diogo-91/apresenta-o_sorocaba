import { TBC } from '../lib/placeholder'

export const cover = {
  eyebrow: 'Apresentação técnica · Caldeiraria',
  headline: ['Do aço bruto', 'à peça pronta.'],
  subtitle: 'Corte, dobra, usinagem, montagem, solda, acabamento e pintura sob uma única responsabilidade técnica.',
  disciplines: ['Caldeiraria', 'Usinagem', 'Pintura industrial'],
  drawingLabel: 'TQ-01 · vaso vertical · esc. ilustrativa',
}

export const processCopy = {
  eyebrow: 'Processo de fabricação',
  headline: ['Sete operações.', 'Uma peça.'],
  entry: { label: 'Entrada', text: 'Desenho técnico e matéria-prima.' },
  exit: { label: 'Saída', text: 'Peça pronta, do corte à pintura, sob uma única responsabilidade técnica.' },
  partNote: 'Peça ilustrativa · cantoneira com reforço',
}

export const quality = {
  eyebrow: 'Qualidade',
  headline: 'Nenhuma etapa passa adiante sem conferência.',
  subheadline: 'Cada operação entrega para a próxima um resultado verificado.',
  planNote: 'Plano de inspeção a validar com a engenharia',
  records: [
    { label: 'Ensaios não destrutivos', value: TBC },
    { label: 'Relatórios e data book', value: TBC },
    { label: 'Rastreabilidade de material', value: TBC },
  ],
  norms: [
    { code: 'AWS D1.1', validated: false },
    { code: 'ASME IX', validated: false },
    { code: 'ISO 12944', validated: false },
  ],
  normsNote: '* Referências normativas a validar · não representam certificação',
}

export const contact = {
  headline: 'Vamos fabricar o seu projeto?',
  subheadline: 'Envie o desenho técnico para uma análise da nossa engenharia.',
}
