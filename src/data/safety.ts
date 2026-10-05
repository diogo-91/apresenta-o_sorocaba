// NÃO PUBLICAR CERTIFICAÇÃO SEM VALIDAÇÃO.
// As NRs abaixo são referências temáticas. Enquanto `validated` for false, a interface
// mostra a norma como "referência a validar" e nunca como certificação ou conformidade.

export type NormReference = { code: string; validated: boolean }

export type SafetyDomain = {
  id: string
  code: string
  title: string
  controls: string[]
  norm: NormReference | null
}

export const safetyDomains: SafetyDomain[] = [
  {
    id: 'altura',
    code: 'S-01',
    title: 'Trabalho em altura',
    controls: ['Pontos de ancoragem e linha de vida definidos', 'Plano de resgate antes do acesso', 'Isolamento da área abaixo'],
    norm: { code: 'NR-35', validated: false },
  },
  {
    id: 'confinado',
    code: 'S-02',
    title: 'Espaço confinado',
    controls: ['Avaliação de atmosfera antes da entrada', 'Vigia e comunicação contínua', 'Permissão de entrada emitida'],
    norm: { code: 'NR-33', validated: false },
  },
  {
    id: 'eletrica',
    code: 'S-03',
    title: 'Elétrica',
    controls: ['Desenergização e bloqueio', 'Verificação de ausência de tensão', 'Sinalização da área de intervenção'],
    norm: { code: 'NR-10', validated: false },
  },
  {
    id: 'maquinas',
    code: 'S-04',
    title: 'Máquinas e equipamentos',
    controls: ['Bloqueio de fontes de energia', 'Proteções restabelecidas antes da liberação', 'Teste funcional supervisionado'],
    norm: { code: 'NR-12', validated: false },
  },
  {
    id: 'permissoes',
    code: 'S-05',
    title: 'Permissões de trabalho',
    controls: ['Emissão vinculada à atividade e ao turno', 'Integração com a segurança do cliente', 'Encerramento formal da permissão'],
    norm: null,
  },
  {
    id: 'analise',
    code: 'S-06',
    title: 'Análise de risco',
    controls: ['Riscos levantados por etapa do serviço', 'Medidas de controle antes da mobilização', 'Revisão quando o cenário muda'],
    norm: null,
  },
]
