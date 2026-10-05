export type ComparisonRow = {
  id: string
  criterion: string
  fragmented: string
  unified: string
}

export const comparisonRows: ComparisonRow[] = [
  { id: 'contratos', criterion: 'Contratos', fragmented: 'Um contrato por especialidade', unified: 'Um contrato para o conjunto das frentes' },
  { id: 'integracoes', criterion: 'Integrações', fragmented: 'O cliente integra as equipes entre si', unified: 'Integração entre especialidades resolvida pelo parceiro' },
  { id: 'cronograma', criterion: 'Cronograma', fragmented: 'Frentes disputando a mesma janela e o mesmo acesso', unified: 'Sequência planejada entre as especialidades' },
  { id: 'documentacao', criterion: 'Documentação', fragmented: 'Formatos diferentes por fornecedor', unified: 'Documentação centralizada em um padrão' },
  { id: 'responsavel', criterion: 'Responsável', fragmented: 'Diluído entre contratos', unified: 'Um responsável técnico pelo conjunto' },
  { id: 'comunicacao', criterion: 'Comunicação', fragmented: 'Vários canais e versões da informação', unified: 'Um canal, uma versão da informação' },
]
