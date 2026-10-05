import type { FrontId } from './services'

export const ambient = {
  audioSrc: null as string | null,
}

export const cover = {
  eyebrow: 'Apresentação técnica',
  subtitle: 'Manutenção, infraestrutura e serviços especiais para operações críticas.',
  documentLabel: 'Apresentação técnica',
  disciplines: ['Manutenção', 'Infraestrutura', 'Serviços especiais'],
}

export const hero = {
  eyebrow: ['Sorocaba Motores', 'Soluções técnicas integradas'],
  headline: 'Infraestrutura crítica não para.',
  headlineLead: 'Infraestrutura crítica',
  headlineAccent: 'não para.',
  subheadline: 'Manutenção integrada para operações que não podem falhar.',
  scrollHint: 'Role para explorar',
  deckHint: 'Avance com → ou espaço',
  media: {
    videoSrc: '/videos/hero.mp4',
    posterSrc: '/videos/hero-poster.jpg',
  },
}

export const about = {
  headline: 'Da cobertura ao chão de fábrica.',
  statement: 'Do ponto mais alto da cobertura ao coração da produção.',
  support: 'Empresa técnica multidisciplinar.',
  closing: ['Uma empresa técnica', 'em todas as camadas.'],
  drawingNote: 'Corte A-A · instalação genérica · cotas ilustrativas',
}

export type OperationLayerId = 'roof' | 'structure' | 'systems' | 'production' | 'reservoirs'

export const operationLayers: { id: OperationLayerId; title: string; short: string; elevation: string; front: FrontId; services: string[] }[] = [
  {
    id: 'roof',
    title: 'Cobertura e claraboias',
    short: 'Cobertura',
    elevation: 'EL. +12,00',
    front: 'envoltoria',
    services: ['Manutenção de cobertura', 'Troca de claraboias', 'Inspeção', 'Pintura', 'Recuperação'],
  },
  {
    id: 'structure',
    title: 'Estrutura e fachada',
    short: 'Estrutura',
    elevation: 'EL. +08,00',
    front: 'envoltoria',
    services: ['Manutenção', 'Recuperação', 'Pintura', 'Adequações'],
  },
  {
    id: 'systems',
    title: 'Utilidades e sistemas',
    short: 'Sistemas',
    elevation: 'EL. +04,00',
    front: 'sistemas',
    services: ['Elétrica', 'Mecânica', 'Manutenção técnica', 'Sistemas auxiliares'],
  },
  {
    id: 'production',
    title: 'Área produtiva e máquinas',
    short: 'Máquinas',
    elevation: 'EL. ±0,00',
    front: 'ativos-pesados',
    services: ['Mudança de máquinas', 'Movimentação', 'Instalação', 'Manutenção mecânica'],
  },
  {
    id: 'reservoirs',
    title: 'Reservatórios e espaços confinados',
    short: 'Reservatórios',
    elevation: 'EL. −3,00',
    front: 'utilidades',
    services: ['Reforma de caixas d’água', 'Pintura', 'Manutenção', 'Trabalho em espaço confinado'],
  },
]

export const fragmentation = {
  headline: 'Cada fornecedor a mais é uma interface a mais para falhar.',
  subheadline:
    'Telhado com um, elétrica com outro, mecânica com outro. Quando algo dá errado, a responsabilidade se fragmenta.',
  scenarioLabel: 'Cenário ilustrativo',
}

export const unified = {
  headline: 'Um parceiro. Uma responsabilidade.',
  subheadline: 'Três mecanismos substituem a coordenação entre fornecedores.',
  pillars: [
    {
      id: 'contato',
      title: 'Contato único',
      text: 'Um interlocutor técnico para o cliente, do levantamento à entrega.',
    },
    {
      id: 'planejamento',
      title: 'Planejamento integrado',
      text: 'Cronograma, acessos e permissões das especialidades definidos juntos.',
    },
    {
      id: 'responsabilidade',
      title: 'Responsabilidade técnica',
      text: 'Cada serviço com responsável técnico definido e documentado.',
    },
  ],
}

export const safety = {
  headline: 'Trabalhar no risco é nossa especialidade. Gerar risco, nunca.',
  subheadline: 'Pessoas, áreas e fontes de energia sob controle antes de qualquer intervenção.',
}

export const method = {
  headline: 'Nenhum serviço começa no improviso.',
  subheadline: 'Do diagnóstico à documentação final.',
  photo: {
    src: '/images/method/levantamento-tecnico.avif',
    alt: 'Técnico com EPI registrando dados de bomba e motor em um tablet durante levantamento em campo',
    caption: 'Levantamento técnico em campo',
  },
}

export const arts = {
  headline: 'Responsabilidade técnica que pode ser verificada.',
  subheadline: 'Documentação organizada, rastreável e vinculada ao serviço executado.',
}

export const cases = {
  headline: 'Antes, depois e o que aconteceu entre os dois.',
}

export const differentials = {
  headline: 'Menos interfaces. Mais controle.',
  subheadline: 'O que muda na rotina de quem contrata.',
  columns: { fragmented: 'Modelo fragmentado', unified: 'Sorocaba Motores' },
}

export const airport = {
  eyebrow: 'Competências aplicáveis a operações aeroportuárias',
  headline: 'Mesmas competências. Novas regras.',
  subheadline: 'Capacidades da indústria, preparadas para uma operação aeroportuária.',
  drawingLabel: 'Terminal · instalação crítica · esquema',
  disclaimer:
    'Competências aplicáveis a ambientes aeroportuários. Escopo definido após levantamento técnico local.',
  conditionsTitle: 'O que a operação exige',
  preparationLabel: 'Como nos preparamos',
}

export const cta = {
  headline: 'Vamos mapear sua operação?',
  subheadline: 'Agende um diagnóstico técnico com nossa equipe.',
  primary: 'Agendar diagnóstico',
  secondary: 'Baixar dossiê técnico',
  engineering: 'Falar com a engenharia',
}
