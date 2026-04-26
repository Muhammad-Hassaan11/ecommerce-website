'use client'

import { ShoppingCart } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getCartItemCount } from '@/lib/utils/cart'
import CartDrawer from './CartDrawer'
import styles from './CartButton.module.css'

export default function CartButton() {
  const [itemCount, setItemCount] = useState(0)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setItemCount(getCartItemCount())

    const handleCartUpdate = () => {
      setItemCount(getCartItemCount())
    }

    window.addEventListener('cart-updated', handleCartUpdate)
    return () => window.removeEventListener('cart-updated', handleCartUpdate)
  }, [])

  // To prevent hydration mismatch, only render interactive parts after mount
  if (!mounted) {
    return (
      <button className={`btn btn-icon ${styles.cartBtn}`} aria-label="Cart loading">
        <ShoppingCart size={20} strokeWidth={2} />
      </button>
    )
  }

  return (
    <>
      <button 
        className={`btn btn-icon ${styles.cartBtn}`} 
        onClick={() => setIsDrawerOpen(true)}
        aria-label="Open cart"
        aria-expanded={isDrawerOpen}
      >
        <ShoppingCart size={20} strokeWidth={2} />
        {itemCount > 0 && (
          <span className={styles.badge}>{itemCount > 99 ? '99+' : itemCount}</span>
        )}
      </button>

      <CartDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
      />
    </>
  )
}
