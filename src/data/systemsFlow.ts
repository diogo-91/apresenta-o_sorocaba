export type FlowDomain = 'eletrica' | 'conversao' | 'mecanica'

export type FlowStep = {
  id: string
  number: string
  title: string
  description: string
  domain: FlowDomain
  file: string
  image: string | null
  frame: 'tall' | 'short' | 'mid'
}

export const SYSTEMS_IMAGE_DIR = '/images/systems/'

export const systemsFlow: FlowStep[] = [
  { id: 'power', number: '01', title: 'Entrada de energia', description: 'Alimentação que chega à instalação.', domain: 'eletrica', file: 'power.webp', image: null, frame: 'tall' },
  { id: 'panel', number: '02', title: 'Quadro e painel', description: 'Distribui a energia para cada circuito.', domain: 'eletrica', file: 'panel.webp', image: null, frame: 'short' },
  { id: 'control', number: '03', title: 'Comando e proteção', description: 'Partida, parada e proteção dos circuitos.', domain: 'eletrica', file: 'control.webp', image: null, frame: 'mid' },
  { id: 'lighting', number: '04', title: 'Iluminação e sistemas', description: 'Circuitos de apoio à operação.', domain: 'eletrica', file: 'lighting.webp', image: null, frame: 'short' },
  { id: 'motor', number: '05', title: 'Motor elétrico', description: 'Converte energia elétrica em movimento.', domain: 'conversao', file: 'motor.webp', image: null, frame: 'tall' },
  { id: 'drive', number: '06', title: 'Acionamento', description: 'Acopla o motor ao conjunto mecânico.', domain: 'mecanica', file: 'drive.webp', image: null, frame: 'short' },
  { id: 'transmission', number: '07', title: 'Transmissão mecânica', description: 'Polias, correias, engrenagens e redutores.', domain: 'mecanica', file: 'transmission.webp', image: null, frame: 'mid' },
  { id: 'machine', number: '08', title: 'Máquina e equipamento', description: 'Onde o movimento vira produção.', domain: 'mecanica', file: 'machine.webp', image: null, frame: 'tall' },
]

export const SYSTEMS_STEPS = systemsFlow.length + 2

export const systemsDisciplines = [
  { id: 'eletrica', title: 'Elétrica', items: ['Instalações', 'Painéis', 'Alimentação', 'Iluminação', 'Comandos'] },
  { id: 'mecanica', title: 'Mecânica', items: ['Motores', 'Acionamentos', 'Transmissão', 'Conjuntos mecânicos', 'Equipamentos'] },
]

export const systemsCopy = {
  headline: ['Energia e movimento', 'sob o mesmo comando técnico.'],
  conversion: { label: 'Conversão', from: 'Energia elétrica', to: 'Movimento mecânico' },
  domains: { eletrica: 'Elétrica', conversao: 'Conversão', mecanica: 'Mecânica' } satisfies Record<FlowDomain, string>,
  closing: ['Da energia ao movimento.', 'Um único sistema.'],
}
