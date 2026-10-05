export type MenuGroup = {
  id: string
  label: string
  act: string
}

export type ScreenDef = {
  id: string
  label: string
  group: MenuGroup['id']
}

export const menuGroups: MenuGroup[] = [
  { id: 'inicio', label: 'Início', act: 'Ato I · Abertura' },
  { id: 'quem-somos', label: 'Quem somos', act: 'Ato I · Abertura' },
  { id: 'desafio', label: 'O desafio', act: 'Ato II · O desafio' },
  { id: 'modelo', label: 'O modelo', act: 'Ato III · O modelo' },
  { id: 'frentes', label: 'Frentes técnicas', act: 'Ato IV · Frentes técnicas' },
  { id: 'seguranca', label: 'Segurança', act: 'Ato V · Segurança e método' },
  { id: 'provas', label: 'Provas', act: 'Ato VI · Provas' },
  { id: 'grandes-operacoes', label: 'Grandes operações', act: 'Ato VII · Grandes operações' },
  { id: 'parceria', label: 'Parceria', act: 'Ato VIII · Parceria' },
]

export const screens: ScreenDef[] = [
  { id: 'capa', label: 'Capa', group: 'inicio' },
  { id: 'inicio', label: 'Abertura', group: 'inicio' },
  { id: 'quem-somos', label: 'Quem somos', group: 'quem-somos' },
  { id: 'desafio', label: 'Fragmentação', group: 'desafio' },
  { id: 'modelo', label: 'Modelo centralizado', group: 'modelo' },
  { id: 'envoltoria', label: 'Envoltória', group: 'frentes' },
  { id: 'sistemas', label: 'Sistemas', group: 'frentes' },
  { id: 'ativos-pesados', label: 'Ativos pesados', group: 'frentes' },
  { id: 'utilidades', label: 'Utilidades e serviços especiais', group: 'frentes' },
  { id: 'seguranca', label: 'Segurança', group: 'seguranca' },
  { id: 'metodo', label: 'Método', group: 'seguranca' },
  { id: 'arts', label: 'ARTs', group: 'provas' },
  { id: 'cases', label: 'Cases', group: 'provas' },
  { id: 'grandes-operacoes', label: 'Grandes operações', group: 'grandes-operacoes' },
  { id: 'diferenciais', label: 'Diferenciais', group: 'parceria' },
  { id: 'parceria', label: 'Próximo passo', group: 'parceria' },
]

export const TOTAL_SCREENS = screens.length

export function screenMeta(id: string) {
  const index = screens.findIndex((s) => s.id === id)
  if (index === -1) throw new Error(`Tela não registrada: ${id}`)
  const screen = screens[index]
  const group = menuGroups.find((g) => g.id === screen.group)!
  return { ...screen, number: index + 1, act: group.act, groupLabel: group.label }
}

export function firstScreenOfGroup(groupId: string) {
  return screens.find((s) => s.group === groupId)!.id
}

export function pad2(n: number) {
  return String(n).padStart(2, '0')
}
