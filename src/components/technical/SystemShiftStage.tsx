import type { ReactNode } from 'react'
import { screenMeta } from '../../data/screens'
import { useActiveScreen } from '../../hooks/useActiveScreen'
import { SystemGraph } from './SystemGraph'

export function SystemShiftStage({ children }: { children: ReactNode }) {
  const active = useActiveScreen()
  const state = screenMeta(active).number <= screenMeta('desafio').number ? 'fragmented' : 'unified'

  return (
    <div className="relative bg-ink">
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="absolute inset-0 hidden lg:block">
        <div className="sticky top-0 h-svh">
          <div className="mx-auto grid h-full max-w-[1520px] grid-cols-12 gap-10 pl-16 pr-32">
            <div className="col-span-6 col-start-7 flex items-center pb-10 pt-28">
              <SystemGraph state={state} className="mx-auto max-w-[min(100%,72svh)]" />
            </div>
          </div>
        </div>
      </div>
      {children}
    </div>
  )
}
