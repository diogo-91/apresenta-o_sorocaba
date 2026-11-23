import { TBC } from '../lib/placeholder'

export const company = {
  name: 'Sorocaba Motores',
  brandName: 'SRCB — Sorocaba Motores Elétricos e Serviços Industriais',
  slogan: 'Um parceiro. Toda a operação.',
  legalName: TBC,
  cnpj: TBC,
  documentRevision: 'REV. 00',
  contact: {
    whatsapp: null as string | null,
    phone: null as string | null,
    email: null as string | null,
    address: TBC,
  },
}

export function whatsappHref(): string | null {
  const digits = company.contact.whatsapp?.replace(/\D/g, '')
  return digits ? `https://wa.me/${digits}` : null
}
