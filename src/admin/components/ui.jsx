import { AnimatePresence, motion } from 'framer-motion'
import { createContext, useCallback, useContext, useState } from 'react'

export const EASE = [0.16, 1, 0.3, 1]

export function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-eyebrow text-teal-deep">{label}</span>
      <div className="mt-2">{children}</div>
      {hint && <span className="mt-1.5 block text-xs text-muted">{hint}</span>}
    </label>
  )
}

export const inputClass =
  'w-full rounded-xl border border-teal-deep/20 bg-white px-4 py-2.5 text-[15px] text-ink placeholder:text-muted/60 focus:border-teal-deep focus:outline-none focus:ring-2 focus:ring-teal-deep/20 disabled:opacity-60'

export function Btn({ variant = 'solid', className = '', busy = false, children, ...rest }) {
  const v = {
    solid: 'bg-teal-deep text-white hover:bg-teal-deeper',
    ghost: 'border border-teal-deep/30 text-teal-deep hover:bg-teal-tint',
    danger: 'border border-red-200 text-red-700 hover:bg-red-50',
    quiet: 'text-teal-deep hover:bg-teal-tint',
  }[variant]
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${v} ${className}`}
      disabled={busy || rest.disabled}
      {...rest}
    >
      {busy && <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />}
      {children}
    </motion.button>
  )
}

/* Toasts */
const ToastCtx = createContext(() => {})
export const useToast = () => useContext(ToastCtx)

export function ToastProvider({ children }) {
  const [items, setItems] = useState([])
  const push = useCallback((message, kind = 'info') => {
    const id = Date.now() + Math.random()
    setItems((t) => [...t, { id, message, kind }])
    setTimeout(() => setItems((t) => t.filter((i) => i.id !== id)), kind === 'error' ? 6000 : 3500)
  }, [])
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex w-80 flex-col gap-2">
        <AnimatePresence>
          {items.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.3, ease: EASE }}
              className={`pointer-events-auto rounded-2xl px-4 py-3 text-sm shadow-lg ${
                t.kind === 'error' ? 'bg-red-600 text-white' : t.kind === 'success' ? 'bg-teal-deep text-white' : 'bg-ink text-white'
              }`}
              role="status"
            >
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  )
}

export function Modal({ open, onClose, title, children, wide = false }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[90] flex items-center justify-center bg-teal-deeper/60 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={`max-h-[90vh] w-full overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl ${wide ? 'max-w-4xl' : 'max-w-lg'}`}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.3, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-teal-deep">{title}</h2>
              <button type="button" onClick={onClose} className="rounded-full p-2 text-muted hover:bg-teal-tint" aria-label="Close">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 3l10 10M13 3L3 13" /></svg>
              </button>
            </div>
            <div className="mt-4">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
