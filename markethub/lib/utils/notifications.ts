'use client'

const NOTIFICATIONS_KEY = 'mh_notifications'
const MAX_NOTIFICATIONS = 50

export interface AppNotification {
  id: string
  type: 'order' | 'listing' | 'system'
  title: string
  message: string
  href?: string
  read: boolean
  createdAt: string
}

export function getNotifications(): AppNotification[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function getUnreadCount(): number {
  return getNotifications().filter((n) => !n.read).length
}

function persist(notifications: AppNotification[]): void {
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications))
  window.dispatchEvent(new CustomEvent('mh_notifications_changed'))
}

export function addNotification(data: {
  type: AppNotification['type']
  title: string
  message: string
  href?: string
}): AppNotification {
  const notification: AppNotification = {
    id: `ntf_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    ...data,
    read: false,
    createdAt: new Date().toISOString(),
  }
  const list = [notification, ...getNotifications()].slice(0, MAX_NOTIFICATIONS)
  persist(list)
  return notification
}

export function markAllRead(): void {
  persist(getNotifications().map((n) => ({ ...n, read: true })))
}

export function markRead(id: string): void {
  persist(
    getNotifications().map((n) => (n.id === id ? { ...n, read: true } : n))
  )
}

export function clearNotifications(): void {
  persist([])
}
