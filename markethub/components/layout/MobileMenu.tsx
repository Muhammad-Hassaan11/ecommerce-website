'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { X, Home, Flame, Heart, HelpCircle, ShoppingCart, Tag } from 'lucide-react'
import styles from './MobileMenu.module.css'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  onOpenSellModal?: () => void
}

const NAV_LINKS = [
  { href: '/', label: 'Browse', icon: Home },
  { href: '/best-sellers', label: 'Best Sellers', icon: Flame },
  { href: '/wishlist', label: 'Wishlist', icon: Heart },
  { href: '/cart', label: 'Cart', icon: ShoppingCart },
  { href: '/support', label: 'Support', icon: HelpCircle },
]

export default function MobileMenu({ isOpen, onClose, onOpenSellModal }: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Close on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  const handleSellClick = () => {
    onClose()
    onOpenSellModal?.()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`${styles.backdrop} ${isOpen ? styles.visible : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu panel */}
      <div
        ref={menuRef}
        className={`${styles.menu} ${isOpen ? styles.open : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className={styles.header}>
          <span className={styles.menuTitle}>Menu</span>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close menu">
            <X size={24} />
          </button>
        </div>

        <nav className={styles.nav}>
          <ul className={styles.linkList}>
            {NAV_LINKS.map((link, idx) => {
              const Icon = link.icon
              return (
                <li key={link.href} style={{ animationDelay: `${idx * 60}ms` }} className={styles.linkItem}>
                  <Link href={link.href} className={styles.link} onClick={onClose}>
                    <Icon size={20} strokeWidth={1.8} />
                    <span>{link.label}</span>
                  </Link>
                </li>
              )
            })}

            {/* Sell button */}
            <li style={{ animationDelay: `${NAV_LINKS.length * 60}ms` }} className={styles.linkItem}>
              <button className={styles.sellLink} onClick={handleSellClick}>
                <Tag size={20} strokeWidth={1.8} />
                <span>Sell</span>
              </button>
            </li>
          </ul>
        </nav>

        <div className={styles.footer}>
          <p>© 2026 MarketHub</p>
        </div>
      </div>
    </>
  )
}

