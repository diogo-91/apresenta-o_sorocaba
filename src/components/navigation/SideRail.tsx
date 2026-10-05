import { firstScreenOfGroup, menuGroups, pad2, screenMeta, TOTAL_SCREENS } from '../../data/screens'
import { useActiveScreen } from '../../hooks/useActiveScreen'
import { scrollToScreen } from '../../lib/scroll'

export function SideRail() {
  const active = useActiveScreen()
  const meta = screenMeta(active)

  return (
    <nav aria-label="Seções da apresentação" className="group/rail fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 lg:block">
      <div aria-hidden="true" className="pointer-events-none absolute -inset-y-4 -left-6 -right-6 bg-ink/90 opacity-0 transition-opacity duration-300 group-hover/rail:opacity-100 group-focus-within/rail:opacity-100" />
      <ol className="relative flex flex-col items-end gap-1">
        {menuGroups.map((group, i) => {
          const isActive = group.id === meta.group
          const target = firstScreenOfGroup(group.id)
          return (
            <li key={group.id}>
              <a
                href={`#${target}`}
                onClick={(e) => {
                  e.preventDefault()
                  scrollToScreen(target)
                }}
                aria-current={isActive ? 'step' : undefined}
                className="group flex h-7 items-center justify-end gap-3"
              >
                <span
                  className={`label-mono translate-x-2 whitespace-nowrap opacity-0 transition-all duration-300 ease-mech group-hover/rail:translate-x-0 group-hover/rail:opacity-100 group-focus-within/rail:translate-x-0 group-focus-within/rail:opacity-100 ${
                    isActive ? 'text-fg' : 'text-muted group-hover:text-fg'
                  }`}
                >
                  {group.label}
                </span>
                <span className={`label-mono w-5 text-right ${isActive ? 'text-accent' : 'text-faint'}`}>{pad2(i + 1)}</span>
                <span
                  className={`h-px transition-all duration-500 ease-mech ${isActive ? 'w-8 bg-accent' : 'w-4 bg-line-strong group-hover:w-6 group-hover:bg-fg'}`}
                />
              </a>
            </li>
          )
        })}
      </ol>
      <div className="relative mt-8 flex items-baseline justify-end gap-1 border-t border-line pt-4" aria-hidden="true">
        <span className="font-mono text-2xl leading-none text-fg tabular-nums">{pad2(meta.number)}</span>
        <span className="label-mono text-faint">/{TOTAL_SCREENS}</span>
      </div>
    </nav>
  )
}
