export type ComparisonRow = {
  id: string
  criterion: string
  fragmented: string
  unified: string
}

export const comparisonRows: ComparisonRow[] = [
  { id: 'interfaces', criterion: 'Quantidade de interfaces', fragmented: 'Uma por fornecedor, somadas às interfaces entre eles', unified: 'Uma interface técnica para todas as frentes' },
  { id: 'seguranca', criterion: 'Integração de segurança', fragmented: 'Cada equipe com seu próprio planejamento de risco', unified: 'Análise de risco e permissões integradas' },
  { id: 'responsavel', criterion: 'Responsável pelo resultado', fragmented: 'Diluído entre contratos', unified: 'Um único responsável técnico pelo conjunto' },
  { id: 'cronograma', criterion: 'Conflitos de cronograma', fragmented: 'Frentes disputando a mesma janela e o mesmo acesso', unified: 'Sequenciamento planejado entre especialidades' },
  { id: 'documentacao', criterion: 'Documentação', fragmented: 'Formatos e padrões diferentes por fornecedor', unified: 'Padrão único, rastreável e vinculado ao serviço' },
  { id: 'gestao', criterion: 'Gestão', fragmented: 'Cliente coordena os fornecedores', unified: 'Coordenação técnica assumida pelo parceiro' },
  { id: 'comunicacao', criterion: 'Comunicação', fragmented: 'Múltiplos canais e versões da informação', unified: 'Um canal, uma versão da informação' },
]
