import type { FrontId } from './services'

export type Vec3 = [number, number, number]

export type FacilityGroup = 'structure' | 'roof' | 'skylights' | 'electrical' | 'mechanical' | 'utilities' | 'reservoir' | 'confined'

export type Facility3DStep = {
  id: string
  label: string
  kicker: string
  services: string[]
  groups: FacilityGroup[]
  anchor: Vec3
  focus: Vec3
  front: FrontId
}

export const facility3DSteps: Facility3DStep[] = [
  { id: 'estrutura', label: 'Estrutura', kicker: 'Estrutura metálica', services: ['Pintura industrial', 'Manutenção geral'], groups: ['structure'], anchor: [-6, 2.4, 3.5], focus: [0, 1.6, 0], front: 'envoltoria' },
  { id: 'cobertura', label: 'Cobertura', kicker: 'Manutenção de cobertura', services: ['Telhados', 'Calhas e vedações', 'Pintura industrial'], groups: ['roof'], anchor: [2.6, 4.1, 2.2], focus: [0, 3.2, 0], front: 'envoltoria' },
  { id: 'claraboias', label: 'Claraboias', kicker: 'Inspeção · troca · vedação', services: ['Substituição de claraboias', 'Vedação de iluminação zenital'], groups: ['skylights'], anchor: [-3, 4.3, 0.6], focus: [-1, 3.6, 0], front: 'envoltoria' },
  { id: 'eletrica', label: 'Elétrica', kicker: 'Instalação e manutenção', services: ['Painéis', 'Alimentação', 'Iluminação'], groups: ['electrical'], anchor: [5.2, 1.9, -3.2], focus: [3, 1.4, -2], front: 'sistemas' },
  { id: 'mecanica', label: 'Mecânica', kicker: 'Movimentação e manutenção', services: ['Mudança de máquinas', 'Instalação', 'Apoio mecânico'], groups: ['mechanical', 'utilities'], anchor: [-0.6, 1.5, 1.2], focus: [0, 0.8, 0.8], front: 'ativos-pesados' },
  { id: 'reservatorios', label: 'Reservatórios', kicker: 'Reforma e pintura', services: ['Reforma de caixas d’água', 'Pintura de caixas d’água'], groups: ['reservoir'], anchor: [8.6, 6.9, -1.5], focus: [6.5, 4, -1.2], front: 'utilidades' },
  { id: 'confinados', label: 'Espaços confinados', kicker: 'Serviços técnicos especiais', services: ['Reservatórios enterrados', 'Galerias técnicas'], groups: ['confined'], anchor: [-2.4, -0.9, 5.4], focus: [-2, -0.5, 4.4], front: 'utilidades' },
]
