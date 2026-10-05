export type UtilityShot = {
  id: 'reservatorio' | 'confinado'
  number: string
  title: string
  keys: string
  file: string
  src: string | null
  alt: string
}

export const utilityShots: UtilityShot[] = [
  {
    id: 'reservatorio',
    number: '01',
    title: 'Reservatório',
    keys: 'Inspeção · recuperação · pintura',
    file: '/images/utilities/reservatorio.jpg',
    src: null,
    alt: 'Registro de campo: manutenção de reservatório elevado em estrutura metálica',
  },
  {
    id: 'confinado',
    number: '02',
    title: 'Espaço confinado',
    keys: 'Acesso · inspeção · manutenção',
    file: '/images/utilities/espaco-confinado.jpg',
    src: null,
    alt: 'Registro de campo: entrada controlada em espaço confinado com EPI e detector de gases',
  },
]

export const UTILITIES_STEPS = utilityShots.length

export const utilitiesCopy = {
  headline: ['Onde a operação', 'depende do que', 'quase ninguém vê.'],
}
