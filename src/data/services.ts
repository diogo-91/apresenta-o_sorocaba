import { TBC } from '../lib/placeholder'

export type FrontId = 'envoltoria' | 'sistemas' | 'ativos-pesados' | 'utilidades'

export type TechnicalFront = {
  id: FrontId
  code: string
  name: string
  headline: string
  description: string
  risks: string[]
  services: { name: string; detail: string }[]
  norms: string[]
  photo: { src: string | null; alt: string; caption: string; position?: string }
  miniCase: { title: string; summary: string; caseId: string | null }
}

export const fronts: TechnicalFront[] = [
  {
    id: 'envoltoria',
    code: 'F-01',
    name: 'Envoltória',
    headline: 'A primeira linha de defesa da operação está no teto.',
    description:
      'Cobertura, claraboias e pintura industrial tratadas como um sistema de proteção da operação, não como reparos isolados.',
    risks: [
      'Infiltração sobre área produtiva e equipamentos',
      'Parada não planejada por intervenção emergencial',
      'Degradação acelerada de estrutura exposta',
    ],
    services: [
      { name: 'Claraboias', detail: 'Substituição, vedação e recuperação de pontos de iluminação zenital.' },
      { name: 'Telhados', detail: 'Manutenção, troca de telhas, calhas e vedações de cobertura.' },
      { name: 'Pintura industrial', detail: 'Preparação de superfície e proteção de estruturas e fachadas.' },
    ],
    norms: [],
    photo: { src: '/images/envoltoria/cobertura.jpg', alt: 'Técnico com EPI fazendo anotações em prancheta sobre cobertura industrial, com equipe ao fundo', caption: 'Registro de campo · cobertura', position: '100% 50%' },
    miniCase: { title: '[CASE A CONFIRMAR]', summary: TBC, caseId: null },
  },
  {
    id: 'sistemas',
    code: 'F-02',
    name: 'Sistemas',
    headline: 'Energia e movimento sob o mesmo comando técnico.',
    description:
      'Elétrica e mecânica planejadas em conjunto, porque uma falha raramente respeita a fronteira entre as duas.',
    risks: [
      'Conflito de bloqueios entre equipes de disciplinas diferentes',
      'Diagnóstico parcial de falhas eletromecânicas',
      'Retrabalho por interfaces mal definidas',
    ],
    services: [
      { name: 'Elétrica', detail: 'Manutenção de instalações, painéis, alimentação e iluminação.' },
      { name: 'Mecânica', detail: 'Manutenção de conjuntos, acionamentos e componentes mecânicos.' },
    ],
    norms: [],
    photo: { src: null, alt: 'Registro de campo: manutenção elétrica e mecânica', caption: 'Registro de campo · sistemas' },
    miniCase: { title: '[CASE A CONFIRMAR]', summary: TBC, caseId: null },
  },
  {
    id: 'ativos-pesados',
    code: 'F-03',
    name: 'Ativos pesados',
    headline: 'Mover uma máquina é um projeto. Não um frete.',
    description:
      'Planejamento de rota, içamento, posicionamento e reinstalação de equipamentos com apoio mecânico do início ao fim.',
    risks: [
      'Dano ao equipamento durante desmontagem e transporte',
      'Atraso na retomada produtiva após a mudança',
      'Exposição da equipe durante o içamento',
      'Falha de posicionamento no novo ponto',
    ],
    services: [
      { name: 'Mudança de máquinas', detail: 'Desmontagem, transferência e remontagem planejadas.' },
      { name: 'Movimentação', detail: 'Deslocamento interno de equipamentos com plano de rota e carga.' },
      { name: 'Instalação', detail: 'Posicionamento, nivelamento e fixação no novo local.' },
      { name: 'Apoio mecânico', detail: 'Suporte técnico na retomada e ajustes pós-instalação.' },
    ],
    norms: [],
    photo: { src: null, alt: 'Registro de campo: movimentação de máquina industrial', caption: 'Registro de campo · movimentação' },
    miniCase: { title: '[CASE A CONFIRMAR]', summary: TBC, caseId: null },
  },
  {
    id: 'utilidades',
    code: 'F-04',
    name: 'Utilidades e serviços especiais',
    headline: 'Onde a operação depende do que quase ninguém vê.',
    description:
      'Reservatórios, manutenção geral e serviços técnicos que sustentam a operação longe da vista e perto do risco.',
    risks: [
      'Contaminação ou perda de capacidade de reservatórios',
      'Falha em sistemas de apoio sem dono definido',
      'Intervenção em espaço confinado sem controle adequado',
    ],
    services: [
      { name: 'Reforma de caixas d’água', detail: 'Recuperação estrutural e vedação de reservatórios.' },
      { name: 'Pintura de caixas d’água', detail: 'Preparação e revestimento interno e externo.' },
      { name: 'Manutenção geral', detail: 'Frentes de manutenção predial e industrial de apoio.' },
      { name: 'Serviços técnicos especiais', detail: 'Demandas específicas avaliadas em levantamento técnico.' },
    ],
    norms: [],
    photo: { src: null, alt: 'Registro de campo: reforma de reservatório', caption: 'Registro de campo · reservatórios' },
    miniCase: { title: '[CASE A CONFIRMAR]', summary: TBC, caseId: null },
  },
]

export function frontById(id: FrontId) {
  return fronts.find((f) => f.id === id)!
}
