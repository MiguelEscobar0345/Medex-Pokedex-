import { useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { toastStore, useStore } from '../lib/store'
import './Toast.css'

const DURATION_MS = 2600

export default function Toast() {
  const toast = useStore(toastStore)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => toastStore.set(current => (current?.id === toast.id ? null : current)), DURATION_MS)
    return () => clearTimeout(t)
  }, [toast])

  return (
    <div className="toast-region" role="status" aria-live="polite">
      <AnimatePresence mode="popLayout">
        {toast && (
          <motion.div
            key={toast.id}
            className="toast"
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 420, damping: 30 }}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
