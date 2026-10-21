import { TBC } from '../lib/placeholder'

export const company = {
  name: 'Sorocaba Motores',
  brandName: 'SRCB — Sorocaba Motores Elétricos e Serviços Industriais',
  slogan: 'Um parceiro. Toda a operação.',
  legalName: TBC,
  cnpj: TBC,
  documentRevision: 'REV. 00',
  contact: {
    whatsapp: '+55 (15) 99696-8450' as string | null,
    phone: null as string | null,
    email: 'info@sorocabamotores.com.br' as string | null,
    address: 'Av. Conde Zeppelin, 3300 - Jardim Eden Ville, Sorocaba - SP, 18103-008, Brasil',
  },
}

export function whatsappHref(): string | null {
  const digits = company.contact.whatsapp?.replace(/\D/g, '')
  return digits ? `https://wa.me/${digits}` : null
}
