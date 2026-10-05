import type { FrontId } from './services'

export type MapZone = {
  id: string
  code: string
  label: string
  level: string
  front: FrontId
  services: string[]
  x: number
  y: number
}

export const facilityZones: MapZone[] = [
  { id: 'cobertura', code: 'Z-01', label: 'Cobertura', level: 'Nível cobertura', front: 'envoltoria', services: ['Telhados', 'Calhas e vedações', 'Pintura industrial'], x: 590, y: 228 },
  { id: 'claraboias', code: 'Z-02', label: 'Claraboias', level: 'Nível cobertura', front: 'envoltoria', services: ['Substituição e vedação de claraboias'], x: 305, y: 214 },
  { id: 'fachada', code: 'Z-03', label: 'Fachada', level: 'Envoltória', front: 'envoltoria', services: ['Pintura industrial', 'Manutenção geral'], x: 120, y: 410 },
  { id: 'estrutura', code: 'Z-04', label: 'Estrutura', level: 'Estrutura', front: 'envoltoria', services: ['Pintura de estruturas metálicas', 'Manutenção geral'], x: 760, y: 400 },
  { id: 'utilidades', code: 'Z-05', label: 'Utilidades', level: 'Redes aéreas', front: 'sistemas', services: ['Elétrica', 'Mecânica'], x: 470, y: 305 },
  { id: 'reservatorios', code: 'Z-06', label: 'Reservatórios', level: 'Elevado', front: 'utilidades', services: ['Reforma de caixas d’água', 'Pintura de caixas d’água'], x: 1090, y: 200 },
  { id: 'casa-de-maquinas', code: 'Z-07', label: 'Casa de máquinas', level: 'Térreo · anexo', front: 'sistemas', services: ['Elétrica', 'Mecânica', 'Manutenção geral'], x: 920, y: 478 },
  { id: 'area-produtiva', code: 'Z-08', label: 'Área produtiva', level: 'Térreo', front: 'ativos-pesados', services: ['Mudança de máquinas', 'Movimentação', 'Instalação', 'Apoio mecânico'], x: 470, y: 500 },
  { id: 'espacos-confinados', code: 'Z-09', label: 'Espaços confinados', level: 'Subsolo', front: 'utilidades', services: ['Serviços técnicos especiais', 'Manutenção de reservatórios enterrados'], x: 420, y: 622 },
]
