'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Info } from 'lucide-react'
import styles from './Toast.module.css'

export type ToastType = 'success' | 'error' | 'info'

interface ToastMessage {
  id: number
  message: string
  type: ToastType
}

export function notifyToast(message: string, type: ToastType = 'success') {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('mh-toast', { detail: { message, type } }))
  }
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  useEffect(() => {
    const handleToast = (e: any) => {
      const { message, type } = e.detail
      const id = Date.now()
      setToasts(prev => [...prev, { id, message, type }])

      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, 3000)
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('mh-toast', handleToast)
      return () => window.removeEventListener('mh-toast', handleToast)
    }
  }, [])

  if (toasts.length === 0) return null

  return (
    <div className={styles.container} role="alert" aria-live="polite">
      {toasts.map(toast => (
        <div key={toast.id} className={`${styles.toast} ${styles[toast.type]}`}>
          {toast.type === 'success' && <CheckCircle size={18} />}
          {toast.type === 'error' && <XCircle size={18} />}
          {toast.type === 'info' && <Info size={18} />}
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  )
}
