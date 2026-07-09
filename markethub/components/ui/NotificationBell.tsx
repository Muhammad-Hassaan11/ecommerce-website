'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { Bell, Package, Tag, Info, CheckCheck, Trash2 } from 'lucide-react'
import {
  getNotifications,
  markAllRead,
  markRead,
  clearNotifications,
  type AppNotification,
} from '@/lib/utils/notifications'
import styles from './NotificationBell.module.css'

function timeAgo(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

const ICONS = {
  order: Package,
  listing: Tag,
  system: Info,
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const refresh = useCallback(() => setNotifications(getNotifications()), [])

  useEffect(() => {
    refresh()
    window.addEventListener('mh_notifications_changed', refresh)
    return () => window.removeEventListener('mh_notifications_changed', refresh)
  }, [refresh])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const unread = notifications.filter((n) => !n.read).length

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <button
        className={`btn btn-icon ${styles.bellBtn}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Notifications${unread > 0 ? ` (${unread} unread)` : ''}`}
        aria-expanded={isOpen}
      >
        <Bell size={20} strokeWidth={2} />
        {unread > 0 && (
          <span className={styles.badge}>{unread > 9 ? '9+' : unread}</span>
        )}
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.header}>
            <span className={styles.headerTitle}>Notifications</span>
            {notifications.length > 0 && (
              <div className={styles.headerActions}>
                <button
                  className={styles.headerBtn}
                  onClick={markAllRead}
                  title="Mark all as read"
                >
                  <CheckCheck size={15} />
                </button>
                <button
                  className={styles.headerBtn}
                  onClick={clearNotifications}
                  title="Clear all"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className={styles.empty}>
              <Bell size={28} strokeWidth={1.5} />
              <p>No notifications yet</p>
              <span>Order updates will appear here.</span>
            </div>
          ) : (
            <ul className={styles.list}>
              {notifications.map((n) => {
                const Icon = ICONS[n.type] || Info
                const content = (
                  <>
                    <span className={`${styles.itemIcon} ${styles[n.type]}`}>
                      <Icon size={16} />
                    </span>
                    <span className={styles.itemBody}>
                      <span className={styles.itemTitle}>{n.title}</span>
                      <span className={styles.itemMessage}>{n.message}</span>
                      <span className={styles.itemTime}>{timeAgo(n.createdAt)}</span>
                    </span>
                    {!n.read && <span className={styles.unreadDot} />}
                  </>
                )
                return (
                  <li key={n.id}>
                    {n.href ? (
                      <Link
                        href={n.href}
                        className={`${styles.item} ${!n.read ? styles.itemUnread : ''}`}
                        onClick={() => {
                          markRead(n.id)
                          setIsOpen(false)
                        }}
                      >
                        {content}
                      </Link>
                    ) : (
                      <button
                        className={`${styles.item} ${!n.read ? styles.itemUnread : ''}`}
                        onClick={() => markRead(n.id)}
                      >
                        {content}
                      </button>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
