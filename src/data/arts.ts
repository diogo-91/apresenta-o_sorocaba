import { TBC } from '../lib/placeholder'

// Estrutura pronta para receber ARTs reais. Nenhum registro abaixo é documento existente:
// todos são slots com `placeholder: true` até a substituição pelos dados verificados.

export type ArtCategory =
  | 'Cobertura'
  | 'Elétrica'
  | 'Mecânica'
  | 'Movimentação'
  | 'Reservatórios'
  | 'Pintura industrial'

export type ArtRecord = {
  id: string
  number: string
  category: ArtCategory
  period: string
  serviceType: string
  engineer: string
  crea: string
  verificationUrl: string | null
  placeholder: boolean
}

export const artCategories: ArtCategory[] = [
  'Cobertura',
  'Elétrica',
  'Mecânica',
  'Movimentação',
  'Reservatórios',
  'Pintura industrial',
]

export const artRecords: ArtRecord[] = artCategories.map((category, i) => ({
  id: `art-slot-${i + 1}`,
  number: '[Nº DA ART]',
  category,
  period: '[MM/AAAA]',
  serviceType: TBC,
  engineer: '[RESPONSÁVEL TÉCNICO]',
  crea: '[CREA]',
  verificationUrl: null,
  placeholder: true,
}))

export const artIndicators = [
  { id: 'total', label: 'ARTs registradas', value: TBC },
  { id: 'responsaveis', label: 'Responsáveis técnicos', value: TBC },
  { id: 'periodo', label: 'Período coberto', value: TBC },
  { id: 'categorias', label: 'Categorias técnicas', value: TBC },
]

export const artLifecycle = ['Registro', 'Execução', 'Baixa']
