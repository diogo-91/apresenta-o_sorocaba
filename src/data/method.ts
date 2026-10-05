export type MethodStep = {
  id: string
  title: string
  text: string
  output: string
  frame: { x: number; y: number; zoom: number }
}

export const methodSteps: MethodStep[] = [
  { id: 'levantamento', title: 'Levantamento técnico', text: 'Visita, registro das condições existentes e das restrições da operação.', output: 'Relatório de levantamento', frame: { x: 35, y: 45, zoom: 1 } },
  { id: 'escopo', title: 'Escopo e cronograma', text: 'Escopo fechado e cronograma alinhado às janelas operacionais.', output: 'Escopo + cronograma', frame: { x: 44, y: 62, zoom: 1.7 } },
  { id: 'risco', title: 'Análise de risco e permissões', text: 'Riscos, bloqueios e permissões definidos antes da mobilização.', output: 'Análise de risco + permissões', frame: { x: 12, y: 4, zoom: 1.7 } },
  { id: 'execucao', title: 'Execução supervisionada', text: 'Equipe em campo sob supervisão técnica e registro de cada etapa.', output: 'Registros de execução', frame: { x: 62, y: 55, zoom: 1.3 } },
  { id: 'inspecao', title: 'Inspeção e testes', text: 'Verificação do serviço executado antes da liberação da área.', output: 'Checklist de inspeção', frame: { x: 76, y: 18, zoom: 1.9 } },
  { id: 'relatorio', title: 'Relatório + documentação técnica', text: 'Entrega formal com evidências e responsabilidade técnica vinculada.', output: 'Relatório final + ART', frame: { x: 50, y: 50, zoom: 1.05 } },
]
