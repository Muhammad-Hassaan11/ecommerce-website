'use client'

import { useState, useEffect } from 'react'
import { X, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import styles from './CartDrawer.module.css'
import { getCart, getCartItemCount, type CartItem as CartItemType } from '@/lib/utils/cart'
import CartItem from './CartItem'
import type { EnrichedProduct } from '@/types'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const [cart, setCart] = useState<CartItemType[]>([])
  const [products, setProducts] = useState<EnrichedProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products')
        const data = await res.json()
        setProducts(data)
      } catch (err) {
        console.error('Failed to load products for cart', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    if (isOpen) {
      setCart(getCart())
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    const handleUpdate = () => setCart(getCart())
    window.addEventListener('cart-updated', handleUpdate)
    
    return () => {
      window.removeEventListener('cart-updated', handleUpdate)
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  const subtotal = cart.reduce((total, item) => {
    const product = products.find(p => p.slug === item.slug)
    return total + (product ? product.price * item.quantity : 0)
  }, 0)

  if (!isOpen) return null

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />
      <div 
        className={`${styles.drawer} ${isOpen ? styles.open : ''}`} 
        role="dialog" 
        aria-modal="true" 
        aria-label="Shopping Cart"
      >
        <div className={styles.header}>
          <h2>Your Cart ({getCartItemCount()})</h2>
          <button className="btn btn-icon" onClick={onClose} aria-label="Close cart">
            <X size={24} />
          </button>
        </div>

        <div className={styles.content}>
          {isLoading ? (
            <div className={styles.loader}>
              <div className="spinner" />
              <p>Loading items...</p>
            </div>
          ) : cart.length === 0 ? (
            <div className={styles.empty}>
              <ShoppingBag size={48} className={styles.emptyIcon} />
              <h3>Your cart is empty</h3>
              <p>Looks like you haven't added anything yet.</p>
              <button className="btn btn-primary" onClick={onClose}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className={styles.items}>
              {cart.map(item => {
                const product = products.find(p => p.slug === item.slug)
                // If product is not found, fallback skip
                if (!product) return null
                return (
                  <CartItem 
                    key={item.slug} 
                    item={item} 
                    product={product} 
                  />
                )
              })}
            </div>
          )}
        </div>

        {cart.length > 0 && !isLoading && (
          <div className={styles.footer}>
            <div className={styles.subtotal}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <p className={styles.taxNote}>Shipping & taxes calculated at checkout.</p>
            <Link href="/cart" className={`btn btn-primary btn-full ${styles.checkoutBtn}`} onClick={onClose}>
              Proceed to Cart
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
