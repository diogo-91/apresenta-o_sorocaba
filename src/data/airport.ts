import type { FrontId } from './services'

export type Box = { x: number; y: number; w: number; h: number }

export type CriticalSystem = {
  id: string
  label: string
  competence: string
  front: FrontId
  x: number
  y: number
  focus: Box
}

export const TERMINAL_SIZE = { width: 1600, height: 720 }

export const airportSystems: CriticalSystem[] = [
  { id: 'cobertura', label: 'Cobertura', competence: 'Manutenção de telhados, claraboias e vedações de grandes vãos', front: 'envoltoria', x: 720, y: 150, focus: { x: 300, y: 90, w: 860, h: 230 } },
  { id: 'eletrica', label: 'Sistemas elétricos', competence: 'Elétrica de instalações, painéis e alimentação de sistemas', front: 'sistemas', x: 205, y: 450, focus: { x: 120, y: 330, w: 260, h: 260 } },
  { id: 'reservatorios', label: 'Reservatórios', competence: 'Reforma e pintura de reservatórios elevados e enterrados', front: 'utilidades', x: 80, y: 250, focus: { x: 10, y: 120, w: 240, h: 440 } },
  { id: 'equipamentos', label: 'Equipamentos', competence: 'Mecânica, movimentação e instalação de equipamentos', front: 'ativos-pesados', x: 1220, y: 395, focus: { x: 1020, y: 300, w: 420, h: 260 } },
  { id: 'confinados', label: 'Espaços confinados', competence: 'Serviços técnicos em galerias, poços e reservatórios enterrados', front: 'utilidades', x: 700, y: 610, focus: { x: 380, y: 540, w: 780, h: 160 } },
  { id: 'estruturas', label: 'Estruturas', competence: 'Pintura e manutenção de estruturas metálicas', front: 'envoltoria', x: 560, y: 330, focus: { x: 300, y: 180, w: 860, h: 360 } },
  { id: 'iluminacao', label: 'Iluminação', competence: 'Manutenção de iluminação externa e alimentação', front: 'sistemas', x: 1440, y: 200, focus: { x: 1280, y: 110, w: 220, h: 450 } },
  { id: 'manutencao', label: 'Áreas de manutenção', competence: 'Manutenção geral e apoio mecânico', front: 'utilidades', x: 1200, y: 505, focus: { x: 1120, y: 420, w: 240, h: 160 } },
]

export const airportTour = ['cobertura', 'eletrica', 'reservatorios', 'equipamentos', 'confinados']

export const preparationSteps = [
  { id: 'levantamento', title: 'Levantamento técnico', text: 'Leitura do ambiente, das restrições e dos sistemas envolvidos.' },
  { id: 'seguranca', title: 'Integração com a segurança local', text: 'Procedimentos alinhados às regras e às equipes do site.' },
  { id: 'janelas', title: 'Cronograma por janelas operacionais', text: 'Intervenções encaixadas nos horários em que a operação permite.' },
  { id: 'documentacao', title: 'Documentação', text: 'Registros e responsabilidade técnica desde a mobilização.' },
  { id: 'mobilizacao', title: 'Planejamento de mobilização', text: 'Equipe, materiais e equipamentos dimensionados antes do acesso.' },
  { id: 'acesso', title: 'Controle de acesso', text: 'Credenciamento e circulação conforme as áreas restritas.' },
  { id: 'execucao', title: 'Execução supervisionada', text: 'Supervisão técnica contínua durante toda a intervenção.' },
]
