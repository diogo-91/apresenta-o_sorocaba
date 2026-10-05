export type UtilityShot = {
  id: 'reservatorio' | 'confinado'
  number: string
  title: string
  keys: string
  file: string
  src: string | null
  position: string
  alt: string
}

export const utilityShots: UtilityShot[] = [
  {
    id: 'reservatorio',
    number: '01',
    title: 'Reservatório',
    keys: 'Inspeção · recuperação · pintura',
    file: '/images/utilities/reservatorio.jpg',
    src: '/images/utilities/reservatorio.jpg',
    position: '50% 72%',
    alt: 'Registro de campo: pintura externa de reservatório com plataforma suspensa',
  },
  {
    id: 'confinado',
    number: '02',
    title: 'Espaço confinado',
    keys: 'Acesso · inspeção · manutenção',
    file: '/images/utilities/espaco-confinado.jpg',
    src: '/images/utilities/espaco-confinado.jpg',
    position: '40% 55%',
    alt: 'Registro de campo: técnico com EPI em limpeza interna de reservatório',
  },
]

export const UTILITIES_STEPS = utilityShots.length

export const utilitiesCopy = {
  headline: ['Onde a operação', 'depende do que', 'quase ninguém vê.'],
}
