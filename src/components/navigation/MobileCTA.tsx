import { AnimatePresence, m } from 'framer-motion'
import { useActiveScreen } from '../../hooks/useActiveScreen'
import { DURATION, EASE_MECH } from '../../lib/motion'
import { EngineeringButton } from './EngineeringButton'

export function MobileCTA() {
  const active = useActiveScreen()
  const visible = active !== 'parceria'

  return (
    <AnimatePresence>
      {visible && (
        <m.div
          className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-ink/95 px-5 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 lg:hidden"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ duration: DURATION.fast, ease: EASE_MECH }}
        >
          <EngineeringButton className="w-full justify-center" />
        </m.div>
      )}
    </AnimatePresence>
  )
}
