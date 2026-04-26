'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { HeartOff } from 'lucide-react'
import ProductGrid from '@/components/product/ProductGrid'
import { getWishlist } from '@/lib/utils/wishlist'
import type { EnrichedProduct } from '@/types'
import styles from './page.module.css'

export default function WishlistClient() {
  const [wishlistProducts, setWishlistProducts] = useState<EnrichedProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    async function loadWishlist() {
      try {
        const slugs = getWishlist()
        
        if (slugs.length === 0) {
          setWishlistProducts([])
          setLoading(false)
          return
        }

        const response = await fetch('/api/products')
        if (!response.ok) throw new Error('Failed to fetch products')
        
        const allProducts: EnrichedProduct[] = await response.json()
        const selected = allProducts.filter(p => slugs.includes(p.slug))
        setWishlistProducts(selected)
      } catch (error) {
        console.error('Error loading wishlist:', error)
      } finally {
        setLoading(false)
      }
    }

    loadWishlist()
  }, [])

  if (!mounted || loading) {
    return (
      <div className={styles.loader}>
        <div className={styles.spinner} />
      </div>
    )
  }

  return (
    <div className="container" style={{ paddingBlock: 'var(--space-8)' }}>
      <h1 className="animate-slide-up" style={{ marginBottom: 'var(--space-8)' }}>
        Your Wishlist
      </h1>

      {wishlistProducts.length === 0 ? (
        <div className={`surface animate-slide-up delay-100 ${styles.emptyState}`}>
          <div className={styles.emptyIcon}>
            <HeartOff size={40} />
          </div>
          <h2 className={styles.emptyMessage}>Your wishlist is empty</h2>
          <p className={styles.emptySubtext}>
            Save items you love to your wishlist. Review them anytime and easily move them to your cart when you're ready to buy.
          </p>
          <Link href="/" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="animate-slide-up delay-100">
          <ProductGrid products={wishlistProducts} />
        </div>
      )}
    </div>
  )
}
