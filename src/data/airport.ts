import type { FrontId } from './services'

export type Box = { x: number; y: number; w: number; h: number }

export type CriticalSystem = {
  id: string
  label: string
  preparation: string
  front: FrontId
  x: number
  y: number
  focus: Box
}

export const TERMINAL_SIZE = { width: 1600, height: 720 }

export const airportSystems: CriticalSystem[] = [
  { id: 'cobertura', label: 'Cobertura', preparation: 'Grandes vãos sobre áreas em uso: intervenção por janela, com isolamento abaixo', front: 'envoltoria', x: 720, y: 150, focus: { x: 300, y: 90, w: 860, h: 230 } },
  { id: 'eletrica', label: 'Sistemas elétricos', preparation: 'Bloqueios combinados com a operação antes de qualquer desligamento', front: 'sistemas', x: 205, y: 450, focus: { x: 120, y: 330, w: 260, h: 260 } },
  { id: 'reservatorios', label: 'Reservatórios', preparation: 'Parada programada do abastecimento e retorno validado antes da liberação', front: 'utilidades', x: 80, y: 250, focus: { x: 10, y: 120, w: 240, h: 440 } },
  { id: 'equipamentos', label: 'Equipamentos', preparation: 'Movimentação com rota, horário e área isolada definidos antes', front: 'ativos-pesados', x: 1220, y: 395, focus: { x: 1020, y: 300, w: 420, h: 260 } },
  { id: 'confinados', label: 'Espaços confinados', preparation: 'Permissão de entrada, vigia e comunicação integradas à segurança do site', front: 'utilidades', x: 700, y: 610, focus: { x: 380, y: 540, w: 780, h: 160 } },
  { id: 'estruturas', label: 'Estruturas', preparation: 'Pintura e manutenção por setores, sem fechar o terminal inteiro', front: 'envoltoria', x: 560, y: 330, focus: { x: 300, y: 180, w: 860, h: 360 } },
  { id: 'iluminacao', label: 'Iluminação', preparation: 'Manutenção em horários de menor movimento, com a área sinalizada', front: 'sistemas', x: 1440, y: 200, focus: { x: 1280, y: 110, w: 220, h: 450 } },
  { id: 'manutencao', label: 'Áreas de manutenção', preparation: 'Apoio técnico alinhado à rotina das equipes do site', front: 'utilidades', x: 1200, y: 505, focus: { x: 1120, y: 420, w: 240, h: 160 } },
]

export const airportTour = ['cobertura', 'eletrica', 'reservatorios', 'equipamentos', 'confinados']

export const airportConditions = [
  { id: 'continua', title: 'Operação contínua', text: 'Intervenção sem interromper o fluxo de passageiros e cargas.' },
  { id: 'janelas', title: 'Janelas de intervenção', text: 'Serviços encaixados nos horários que a operação libera.' },
  { id: 'seguranca', title: 'Segurança do site', text: 'Procedimentos alinhados às regras e às equipes locais.' },
  { id: 'acesso', title: 'Controle de acesso', text: 'Credenciamento e circulação conforme as áreas restritas.' },
  { id: 'mobilizacao', title: 'Mobilização planejada', text: 'Equipe, materiais e equipamentos dimensionados antes do acesso.' },
  { id: 'documentacao', title: 'Documentação desde o início', text: 'Registros e responsabilidade técnica desde a mobilização.' },
]
