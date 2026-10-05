import type { FrontId } from './services'

export type CriticalSystem = {
  id: string
  label: string
  competence: string
  front: FrontId
  x: number
  y: number
}

export const airportSystems: CriticalSystem[] = [
  { id: 'cobertura', label: 'Cobertura', competence: 'Manutenção de telhados, claraboias e vedações', front: 'envoltoria', x: 520, y: 128 },
  { id: 'estruturas', label: 'Estruturas', competence: 'Pintura e manutenção de estruturas metálicas', front: 'envoltoria', x: 330, y: 250 },
  { id: 'iluminacao', label: 'Iluminação', competence: 'Manutenção de iluminação e alimentação', front: 'sistemas', x: 1080, y: 150 },
  { id: 'eletrica', label: 'Sistemas elétricos', competence: 'Elétrica de instalações e painéis', front: 'sistemas', x: 130, y: 380 },
  { id: 'equipamentos', label: 'Equipamentos', competence: 'Mecânica, movimentação e instalação de equipamentos', front: 'ativos-pesados', x: 760, y: 360 },
  { id: 'reservatorios', label: 'Reservatórios', competence: 'Reforma e pintura de reservatórios', front: 'utilidades', x: 1150, y: 300 },
  { id: 'confinados', label: 'Espaços confinados', competence: 'Serviços técnicos em galerias e reservatórios enterrados', front: 'utilidades', x: 560, y: 505 },
  { id: 'manutencao', label: 'Áreas de manutenção', competence: 'Manutenção geral e apoio mecânico', front: 'utilidades', x: 1050, y: 412 },
]

export const preparationSteps = [
  { id: 'levantamento', title: 'Levantamento técnico', text: 'Leitura do ambiente, das restrições e dos sistemas envolvidos.' },
  { id: 'seguranca', title: 'Integração com a segurança local', text: 'Procedimentos alinhados às regras e às equipes do site.' },
  { id: 'janelas', title: 'Cronograma por janelas operacionais', text: 'Intervenções encaixadas nos horários em que a operação permite.' },
  { id: 'documentacao', title: 'Documentação', text: 'Registros e responsabilidade técnica desde a mobilização.' },
  { id: 'mobilizacao', title: 'Planejamento de mobilização', text: 'Equipe, materiais e equipamentos dimensionados antes do acesso.' },
  { id: 'acesso', title: 'Controle de acesso', text: 'Credenciamento e circulação conforme as áreas restritas.' },
  { id: 'execucao', title: 'Execução supervisionada', text: 'Supervisão técnica contínua durante toda a intervenção.' },
]
