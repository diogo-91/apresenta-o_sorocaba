import { TBC } from '../lib/placeholder'

export type OperationId = 'corte' | 'dobra' | 'usinagem' | 'montagem' | 'solda' | 'acabamento' | 'pintura'

export type Operation = {
  id: OperationId
  name: string
  line: string
  headline: string
  description: string
  input: string
  output: string
  processes: string[]
  specs: { label: string; value: string }[]
  checkpoint: string
  photo: { src: string | null; alt: string }
}

export const operations: Operation[] = [
  {
    id: 'corte',
    name: 'Corte',
    line: 'Matéria-prima no contorno do desenho.',
    headline: 'O desenho vira contorno.',
    description: 'Chapas, perfis e tubos cortados na geometria do projeto, prontos para conformar.',
    input: 'Chapa, perfil ou tubo',
    output: 'Peças no contorno',
    processes: ['Laser', 'Plasma', 'Oxicorte', 'Guilhotina', 'Serra'],
    specs: [
      { label: 'Espessura máxima', value: TBC },
      { label: 'Área útil de corte', value: TBC },
      { label: 'Materiais', value: TBC },
    ],
    checkpoint: 'Conferência dimensional',
    photo: { src: '/images/operacoes/corte.webp', alt: 'Operador acompanhando o corte a laser de chapa no painel da máquina' },
  },
  {
    id: 'dobra',
    name: 'Dobra',
    line: 'Ângulos e raios conforme o projeto.',
    headline: 'A chapa ganha forma.',
    description: 'Dobra e calandragem dão à peça os ângulos e os raios previstos no desenho.',
    input: 'Peças cortadas',
    output: 'Peças conformadas',
    processes: ['Dobradeira', 'Calandra', 'Prensa'],
    specs: [
      { label: 'Comprimento máximo de dobra', value: TBC },
      { label: 'Capacidade da prensa', value: TBC },
      { label: 'Espessura máxima', value: TBC },
    ],
    checkpoint: 'Ângulos e raios',
    photo: { src: '/images/operacoes/dobra.webp', alt: 'Operador posicionando uma chapa na dobradeira, com peças dobradas ao lado' },
  },
  {
    id: 'usinagem',
    name: 'Usinagem',
    line: 'Furos, faces e ajustes com tolerância.',
    headline: 'Onde o encaixe é decidido.',
    description: 'Torneamento, fresamento e furação garantem as faces, os furos e os ajustes que a montagem precisa.',
    input: 'Peças conformadas',
    output: 'Peças com furos, faces e ajustes',
    processes: ['Torneamento', 'Fresamento', 'Furação', 'Mandrilhamento'],
    specs: [
      { label: 'Dimensão máxima da peça', value: TBC },
      { label: 'Tolerância de trabalho', value: TBC },
      { label: 'Equipamentos', value: TBC },
    ],
    checkpoint: 'Medição de furos e faces',
    photo: { src: '/images/operacoes/usinagem.webp', alt: 'Operador no painel de um centro de usinagem, com a ferramenta trabalhando a peça e peças usinadas na bancada' },
  },
  {
    id: 'montagem',
    name: 'Montagem',
    line: 'Peças posicionadas, esquadrejadas e ponteadas.',
    headline: 'Cada peça no seu lugar.',
    description: 'Traçagem, gabaritos e ponteamento posicionam o conjunto conforme o desenho antes da solda definitiva.',
    input: 'Peças usinadas',
    output: 'Conjunto ponteado',
    processes: ['Traçagem', 'Gabaritos e dispositivos', 'Esquadrejamento', 'Ponteamento'],
    specs: [
      { label: 'Dimensão máxima de conjunto', value: TBC },
      { label: 'Capacidade de içamento', value: TBC },
      { label: 'Área de montagem', value: TBC },
    ],
    checkpoint: 'Esquadro e posição',
    photo: { src: '/images/operacoes/montagem.webp', alt: 'Soldador unindo chapas e reforços de um conjunto sobre a bancada de montagem' },
  },
  {
    id: 'solda',
    name: 'Solda',
    line: 'União definitiva do conjunto.',
    headline: 'A união que segura a estrutura.',
    description: 'O conjunto recebe a solda definitiva, no processo e na sequência definidos para o material e a espessura.',
    input: 'Conjunto ponteado',
    output: 'Conjunto soldado',
    processes: ['MIG/MAG', 'TIG', 'Eletrodo revestido', 'Arco submerso'],
    specs: [
      { label: 'Procedimentos qualificados', value: TBC },
      { label: 'Soldadores qualificados', value: TBC },
      { label: 'Materiais', value: TBC },
    ],
    checkpoint: 'Inspeção visual de solda',
    photo: { src: '/images/operacoes/solda.webp', alt: 'Soldador fazendo a solda definitiva de uma estrutura metálica de grande porte' },
  },
  {
    id: 'acabamento',
    name: 'Acabamento',
    line: 'Rebarbas, respingos e cordões tratados.',
    headline: 'O detalhe que prepara a superfície.',
    description: 'Esmerilhamento, lixamento e jateamento removem rebarbas e respingos e deixam a superfície pronta para a pintura.',
    input: 'Conjunto soldado',
    output: 'Superfície preparada',
    processes: ['Esmerilhamento', 'Lixamento', 'Jateamento abrasivo'],
    specs: [
      { label: 'Grau de limpeza de superfície', value: TBC },
      { label: 'Área de jateamento', value: TBC },
      { label: 'Equipamentos', value: TBC },
    ],
    checkpoint: 'Limpeza de superfície',
    photo: { src: '/images/operacoes/acabamento.webp', alt: 'Operador esmerilhando os cordões de solda de uma estrutura metálica' },
  },
  {
    id: 'pintura',
    name: 'Pintura',
    line: 'Proteção anticorrosiva e acabamento final.',
    headline: 'A última camada protege todas as outras.',
    description: 'Fundo, intermediária e acabamento aplicados conforme o esquema de pintura especificado no projeto.',
    input: 'Superfície preparada',
    output: 'Peça pronta',
    processes: ['Fundo anticorrosivo', 'Intermediária', 'Acabamento', 'Medição de espessura'],
    specs: [
      { label: 'Sistemas de pintura', value: TBC },
      { label: 'Cabine e cura', value: TBC },
      { label: 'Cores e padrões', value: TBC },
    ],
    checkpoint: 'Espessura de camada',
    photo: { src: '/images/operacoes/pintura.webp', alt: 'Pintor com macacão e máscara aplicando tinta azul com pistola em uma estrutura metálica dentro da cabine' },
  },
]

export const OPERATION_COUNT = operations.length
export const PROCESS_FINAL = OPERATION_COUNT + 1
export const PROCESS_STEPS = PROCESS_FINAL + 1

export function operationById(id: OperationId) {
  return operations.find((op) => op.id === id)!
}
