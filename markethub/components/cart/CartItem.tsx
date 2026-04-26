'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Trash2, Plus, Minus } from 'lucide-react'
import { updateQuantity, removeFromCart, type CartItem as CartItemType } from '@/lib/utils/cart'
import type { EnrichedProduct } from '@/types'
import styles from './CartItem.module.css'

interface CartItemProps {
  item: CartItemType
  product: EnrichedProduct
}

export default function CartItem({ item, product }: CartItemProps) {
  return (
    <div className={styles.item}>
      <Link href={`/products/${product.slug}`} className={styles.imageWrap}>
        <Image 
          src={product.images[0] || '/images/placeholder.jpg'} 
          alt={product.name} 
          width={80} 
          height={80} 
          className={styles.image}
        />
      </Link>
      
      <div className={styles.details}>
        <div className={styles.header}>
          <Link href={`/products/${product.slug}`} className={styles.name}>
            {product.name}
          </Link>
          <button 
            className={`btn btn-icon ${styles.removeBtn}`} 
            onClick={() => removeFromCart(item.slug)}
            aria-label="Remove item"
          >
            <Trash2 size={16} />
          </button>
        </div>
        
        <div className={styles.pricing}>
          <div className={styles.price}>${(product.price * item.quantity).toFixed(2)}</div>
          
          <div className={styles.qty}>
            <button 
              className={styles.qtyBtn} 
              onClick={() => updateQuantity(item.slug, item.quantity - 1)}
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <span className={styles.qtyText}>{item.quantity}</span>
            <button 
              className={styles.qtyBtn} 
              onClick={() => updateQuantity(item.slug, item.quantity + 1)}
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
