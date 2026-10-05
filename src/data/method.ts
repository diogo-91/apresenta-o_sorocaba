export type MethodStep = {
  id: string
  title: string
  text: string
  output: string
}

export const methodSteps: MethodStep[] = [
  { id: 'levantamento', title: 'Levantamento técnico', text: 'Visita, registro das condições existentes e das restrições da operação.', output: 'Relatório de levantamento' },
  { id: 'escopo', title: 'Escopo e cronograma', text: 'Escopo fechado e cronograma alinhado às janelas operacionais.', output: 'Escopo + cronograma' },
  { id: 'risco', title: 'Análise de risco e permissões', text: 'Riscos, bloqueios e permissões definidos antes da mobilização.', output: 'Análise de risco + permissões' },
  { id: 'execucao', title: 'Execução supervisionada', text: 'Equipe em campo sob supervisão técnica e registro de cada etapa.', output: 'Registros de execução' },
  { id: 'inspecao', title: 'Inspeção e testes', text: 'Verificação do serviço executado antes da liberação da área.', output: 'Checklist de inspeção' },
  { id: 'relatorio', title: 'Relatório + documentação técnica', text: 'Entrega formal com evidências e responsabilidade técnica vinculada.', output: 'Relatório final + ART' },
]
