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
  { id: 'abertura', label: 'Abertura', act: 'Ato I · Abertura' },
  { id: 'operacoes', label: 'Operações', act: 'Ato II · Operações' },
  { id: 'qualidade', label: 'Qualidade', act: 'Ato III · Qualidade' },
  { id: 'contato', label: 'Contato', act: 'Ato IV · Contato' },
]

export const screens: ScreenDef[] = [
  { id: 'capa', label: 'Capa', group: 'abertura' },
  { id: 'processo', label: 'Processo', group: 'abertura' },
  { id: 'corte', label: 'Corte', group: 'operacoes' },
  { id: 'dobra', label: 'Dobra', group: 'operacoes' },
  { id: 'usinagem', label: 'Usinagem', group: 'operacoes' },
  { id: 'montagem', label: 'Montagem', group: 'operacoes' },
  { id: 'solda', label: 'Solda', group: 'operacoes' },
  { id: 'acabamento', label: 'Acabamento', group: 'operacoes' },
  { id: 'pintura', label: 'Pintura', group: 'operacoes' },
  { id: 'qualidade', label: 'Qualidade', group: 'qualidade' },
  { id: 'contato', label: 'Próximo passo', group: 'contato' },
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
