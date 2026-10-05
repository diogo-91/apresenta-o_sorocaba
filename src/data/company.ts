import { TBC } from '../lib/placeholder'

export type Metric = { id: string; label: string; value: string; unit?: string }

export const company = {
  name: 'Sorocaba Motores',
  slogan: 'Um parceiro. Toda a operação.',
  concept: 'Sem fragmentação.',
  positioning:
    'A Sorocaba Motores é o parceiro técnico que assume, sob uma única responsabilidade, as frentes de manutenção, infraestrutura e serviços especiais que operações críticas costumam dividir entre vários fornecedores.',
  logoSrc: null as string | null,
  legalName: TBC,
  cnpj: TBC,
  documentRevision: 'REV. 00',
  preparedFor: TBC,
  contact: {
    whatsapp: null as string | null,
    phone: null as string | null,
    email: null as string | null,
    address: TBC,
    scheduleUrl: null as string | null,
    dossierUrl: null as string | null,
  },
  metrics: [
    { id: 'anos', label: 'Anos de operação', value: TBC },
    { id: 'servicos', label: 'Serviços executados', value: TBC },
    { id: 'arts', label: 'ARTs emitidas', value: TBC },
    { id: 'frentes', label: 'Frentes técnicas', value: TBC },
  ] satisfies Metric[],
}

export function whatsappHref(): string | null {
  const digits = company.contact.whatsapp?.replace(/\D/g, '')
  return digits ? `https://wa.me/${digits}` : null
}
