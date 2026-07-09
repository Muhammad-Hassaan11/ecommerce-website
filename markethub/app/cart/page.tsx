'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react'
import { getCart, updateQuantity, removeFromCart, type CartItem as CartItemType } from '@/lib/utils/cart'
import { fetchAllProducts } from '@/lib/utils/productsClient'
import type { EnrichedProduct } from '@/types'
import styles from './page.module.css'

export default function CartPage() {
  const [cart, setCart] = useState<CartItemType[]>([])
  const [products, setProducts] = useState<EnrichedProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setCart(getCart())

    const fetchProducts = async () => {
      try {
        setProducts(await fetchAllProducts())
      } catch (err) {
        console.error('Failed to load products', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProducts()

    const handleUpdate = () => setCart(getCart())
    window.addEventListener('cart-updated', handleUpdate)
    return () => window.removeEventListener('cart-updated', handleUpdate)
  }, [])

  const subtotal = cart.reduce((total, item) => {
    const product = products.find(p => p.slug === item.slug)
    return total + (product ? product.price * item.quantity : 0)
  }, 0)

  if (isLoading) {
    return (
      <div className={`container ${styles.containerLoader}`}>
        <div className="spinner" />
        <p>Loading your cart...</p>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className={`container ${styles.emptyContainer}`}>
        <div className={styles.emptyState}>
          <ShoppingBag size={64} className={styles.emptyIcon} />
          <h1>Your cart is empty</h1>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <Link href="/" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={`container ${styles.container}`}>
      <h1 className={styles.title}>Shopping Cart</h1>
      
      <div className={styles.grid}>
        <div className={styles.itemsColumn}>
          <div className={styles.tableHeader}>
            <div className={styles.headerProducts}>Product</div>
            <div className={styles.headerQty}>Quantity</div>
            <div className={styles.headerTotal}>Total</div>
          </div>
          
          <ul className={styles.itemList}>
            {cart.map(item => {
              const product = products.find(p => p.slug === item.slug)
              if (!product) return null
              
              return (
                <li key={item.slug} className={styles.itemRow}>
                  <div className={styles.productCell}>
                    <Link href={`/products/${product.slug}`} className={styles.imageWrap}>
                      <Image 
                        src={product.images[0] || '/images/placeholder.jpg'} 
                        alt={product.name} 
                        width={80} 
                        height={80} 
                        className={styles.image}
                      />
                    </Link>
                    <div className={styles.productDetails}>
                      <Link href={`/products/${product.slug}`} className={styles.productName}>
                        {product.name}
                      </Link>
                      <span className={styles.vendorName}>by {product.vendorName}</span>
                      <button 
                        className={styles.removeBtnItem} 
                        onClick={() => removeFromCart(item.slug)}
                      >
                        <Trash2 size={14} />
                        Remove
                      </button>
                    </div>
                  </div>
                  
                  <div className={styles.qtyCell}>
                    <div className={styles.qtyControls}>
                      <button 
                        className={styles.qtyBtn}
                        onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                        aria-label="Decrease"
                      >
                        <Minus size={14} />
                      </button>
                      <span className={styles.qtyText}>{item.quantity}</span>
                      <button 
                        className={styles.qtyBtn}
                        onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                        aria-label="Increase"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  
                  <div className={styles.totalCell}>
                    <span className={styles.itemTotal}>${(product.price * item.quantity).toFixed(2)}</span>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
        
        <div className={styles.summaryColumn}>
          <div className={styles.summaryCard}>
            <h2>Order Summary</h2>
            
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            
            <div className={styles.summaryRowTotal}>
              <span>Estimated Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            
            <Link href="/checkout" className={`btn btn-primary btn-full ${styles.checkoutBtn}`}>
              Proceed to Checkout
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
