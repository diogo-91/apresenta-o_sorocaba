export type RigStageId = 'power-source' | 'panel' | 'drive' | 'motor' | 'coupling' | 'transmission' | 'machine'

export type RigStage = {
  id: RigStageId
  number: string
  kicker: string
  name: string
}

export const rigStages: RigStage[] = [
  { id: 'power-source', number: '01', kicker: 'Alimentação', name: 'Rede elétrica' },
  { id: 'panel', number: '02', kicker: 'Distribuição', name: 'Painel elétrico' },
  { id: 'drive', number: '03', kicker: 'Controle', name: 'Comando / acionamento' },
  { id: 'motor', number: '04', kicker: 'Conversão', name: 'Motor elétrico' },
  { id: 'coupling', number: '05', kicker: 'Acoplamento', name: 'Acoplamento' },
  { id: 'transmission', number: '06', kicker: 'Transmissão', name: 'Polias e correia' },
  { id: 'machine', number: '07', kicker: 'Operação', name: 'Máquina em funcionamento' },
]

export const SYSTEMS_FINAL = rigStages.length + 1
export const SYSTEMS_STEPS = SYSTEMS_FINAL + 1

export type RigAssetId = 'power-source' | 'panel' | 'drive' | 'motor-body' | 'motor-shaft' | 'coupling' | 'transmission' | 'pulley-left' | 'pulley-right' | 'machine'

export const rigAssets: Record<RigAssetId, { file: string; image: string | null }> = {
  'power-source': { file: 'power-source.webp', image: null },
  panel: { file: 'panel.webp', image: null },
  drive: { file: 'drive.webp', image: null },
  'motor-body': { file: 'motor-body.webp', image: null },
  'motor-shaft': { file: 'motor-shaft.webp', image: null },
  coupling: { file: 'coupling.webp', image: null },
  transmission: { file: 'transmission.webp', image: null },
  'pulley-left': { file: 'pulley-left.svg', image: null },
  'pulley-right': { file: 'pulley-right.svg', image: null },
  machine: { file: 'machine.webp', image: null },
}

export const systemsDisciplines = [
  { id: 'eletrica', title: 'Elétrica', items: ['Instalações', 'Painéis', 'Alimentação', 'Iluminação', 'Comandos'] },
  { id: 'mecanica', title: 'Mecânica', items: ['Motores', 'Acionamentos', 'Transmissão', 'Conjuntos mecânicos', 'Equipamentos'] },
]

export const systemsCopy = {
  headline: ['Energia e movimento', 'sob o mesmo comando técnico.'],
  conversion: { label: 'Conversão', from: 'Energia elétrica', to: 'Movimento mecânico' },
  legend: { electric: 'Energia elétrica', mechanic: 'Movimento mecânico' },
  placeholderNote: 'Equipamentos em desenho provisório · imagens em /images/systems/',
  closing: ['Da energia ao movimento.', 'Um único sistema.'],
}
