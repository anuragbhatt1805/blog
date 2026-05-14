'use client'

import { createContext, useContext, useState, useCallback } from 'react'
import { X, Info, AlertTriangle, AlertCircle } from 'lucide-react'

type ToastType = 'info' | 'warn' | 'error'

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void
  info: (message: string) => void
  warn: (message: string) => void
  error: (message: string) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

const TOAST_DURATION = 4000

const icons: Record<ToastType, React.ReactNode> = {
  info:  <Info size={18} />,
  warn:  <AlertTriangle size={18} />,
  error: <AlertCircle size={18} />,
}

const colors: Record<ToastType, { bg: string; border: string; icon: string }> = {
  info: {
    bg: 'rgba(20, 184, 166, 0.08)',
    border: 'rgba(20, 184, 166, 0.25)',
    icon: 'var(--primary)',
  },
  warn: {
    bg: 'rgba(245, 158, 11, 0.08)',
    border: 'rgba(245, 158, 11, 0.25)',
    icon: '#f59e0b',
  },
  error: {
    bg: 'rgba(239, 68, 68, 0.08)',
    border: 'rgba(239, 68, 68, 0.25)',
    icon: '#ef4444',
  },
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, removing: true } as any : t))
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 300)
  }, [])

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => removeToast(id), TOAST_DURATION)
  }, [removeToast])

  const value: ToastContextType = {
    toast: addToast,
    info:  (msg) => addToast(msg, 'info'),
    warn:  (msg) => addToast(msg, 'warn'),
    error: (msg) => addToast(msg, 'error'),
  }

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* Toast Container */}
      <div
        aria-live="polite"
        aria-label="Notifications"
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column-reverse',
          gap: '0.625rem',
          maxWidth: '420px',
          width: '100%',
          pointerEvents: 'none',
        }}
      >
        {toasts.map((t: any) => {
          const c = colors[t.type as ToastType]
          return (
            <div
              key={t.id}
              role="alert"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                padding: '0.875rem 1rem',
                borderRadius: 'var(--radius-lg)',
                background: c.bg,
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: `1px solid ${c.border}`,
                boxShadow: 'var(--shadow-lg)',
                animation: t.removing
                  ? 'toastOut 0.3s ease forwards'
                  : 'toastIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                pointerEvents: 'auto',
                cursor: 'default',
              }}
            >
              <div style={{ color: c.icon, flexShrink: 0, marginTop: '1px' }}>
                {icons[t.type as ToastType]}
              </div>
              <p style={{ flex: 1, fontSize: '0.875rem', lineHeight: 1.5, color: 'var(--foreground)', margin: 0 }}>
                {t.message}
              </p>
              <button
                onClick={() => removeToast(t.id)}
                style={{
                  flexShrink: 0,
                  padding: '2px',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'color 0.15s ease',
                }}
                aria-label="Dismiss"
              >
                <X size={14} />
              </button>
            </div>
          )
        })}
      </div>

      {/* Toast Animations */}
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(12px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes toastOut {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to   { opacity: 0; transform: translateY(8px) scale(0.96); }
        }
      `}</style>
    </ToastContext.Provider>
  )
}
