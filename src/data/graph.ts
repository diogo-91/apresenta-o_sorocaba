export type Point = { x: number; y: number }

export type GraphNode = {
  id: string
  specialty: string
  supplier: string
  fragmented: Point
}

export const GRAPH_SIZE = 800

export const graphNodes: GraphNode[] = [
  { id: 'cobertura', specialty: 'Cobertura', supplier: 'Fornecedor A', fragmented: { x: 150, y: 150 } },
  { id: 'eletrica', specialty: 'Elétrica', supplier: 'Fornecedor B', fragmented: { x: 600, y: 105 } },
  { id: 'mecanica', specialty: 'Mecânica', supplier: 'Fornecedor C', fragmented: { x: 690, y: 395 } },
  { id: 'pintura', specialty: 'Pintura industrial', supplier: 'Fornecedor D', fragmented: { x: 575, y: 670 } },
  { id: 'movimentacao', specialty: 'Movimentação', supplier: 'Fornecedor E', fragmented: { x: 205, y: 680 } },
  { id: 'reservatorios', specialty: 'Reservatórios', supplier: 'Fornecedor F', fragmented: { x: 95, y: 430 } },
  { id: 'manutencao', specialty: 'Manutenção geral', supplier: 'Fornecedor G', fragmented: { x: 395, y: 235 } },
]

export const clientNode = {
  label: 'Sua operação',
  fragmented: { x: 400, y: 455 },
  unified: { x: 400, y: 715 },
}

export const coreNode = {
  label: 'Sorocaba Motores',
  position: { x: 400, y: 345 },
  ringRadius: 205,
}

export function ringPosition(index: number, total: number): Point {
  const angle = -Math.PI / 2 + (index / total) * Math.PI * 2
  return {
    x: Math.round(coreNode.position.x + Math.cos(angle) * coreNode.ringRadius),
    y: Math.round(coreNode.position.y + Math.sin(angle) * coreNode.ringRadius),
  }
}

export function interfaceCount(suppliers: number) {
  return suppliers + (suppliers * (suppliers - 1)) / 2
}

export function supplierPairs<T>(items: T[]): [T, T][] {
  const pairs: [T, T][] = []
  items.forEach((a, i) => items.slice(i + 1).forEach((b) => pairs.push([a, b])))
  return pairs
}
