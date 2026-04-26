'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { addToCart } from '@/lib/utils/cart'
import { notifyToast } from '@/components/ui/Toast'
import styles from './AddToCartButton.module.css'

interface AddToCartButtonProps {
  productSlug: string
  inStock: boolean
}

export default function AddToCartButton({ productSlug, inStock }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)

  const handleAdd = () => {
    addToCart(productSlug, quantity)
    notifyToast('Added to cart', 'success')
  }

  if (!inStock) {
    return (
      <button className="btn btn-primary" style={{ flex: 1, paddingBlock: 'var(--space-4)' }} disabled>
        Currently Unavailable
      </button>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.qtyControls}>
        <button 
          className={styles.qtyBtn} 
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          aria-label="Decrease quantity"
        >
          <Minus size={16} />
        </button>
        <span className={styles.qtyText}>{quantity}</span>
        <button 
          className={styles.qtyBtn} 
          onClick={() => setQuantity(quantity + 1)}
          aria-label="Increase quantity"
        >
          <Plus size={16} />
        </button>
      </div>
      <button 
        className={`btn btn-primary ${styles.addBtn}`}
        onClick={handleAdd}
      >
        Add to Cart
      </button>
    </div>
  )
}
