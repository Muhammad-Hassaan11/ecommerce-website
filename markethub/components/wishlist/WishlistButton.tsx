'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { isWishlisted, addToWishlist, removeFromWishlist } from '@/lib/utils/wishlist'

interface WishlistButtonProps {
  productSlug: string
  className?: string
  size?: number
}

export default function WishlistButton({ 
  productSlug, 
  className = '',
  size = 18 
}: WishlistButtonProps) {
  const [active, setActive] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Only run on client to avoid hydration mismatch
  useEffect(() => {
    setActive(isWishlisted(productSlug))
    setMounted(true)
  }, [productSlug])

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault() // prevent navigating if inside a link
    e.stopPropagation() 
    
    if (active) {
      removeFromWishlist(productSlug)
      setActive(false)
    } else {
      addToWishlist(productSlug)
      setActive(true)
    }
  }

  // Don't render until client-side hydration is complete
  if (!mounted) {
    return (
      <button className={`btn-icon ${className}`} aria-label="Loading wishlist status" disabled>
        <Heart size={size} color="var(--color-text-muted)" />
      </button>
    )
  }

  return (
    <button
      onClick={toggleWishlist}
      className={`btn-icon ${className}`}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      title={active ? "Remove from wishlist" : "Add to wishlist"}
      style={{
        animation: active ? 'heartPop 0.3s ease' : 'none'
      }}
    >
      <Heart 
        size={size} 
        fill={active ? "var(--color-danger)" : "transparent"} 
        color={active ? "var(--color-danger)" : "var(--color-text-secondary)"}
        style={{ transition: 'all var(--transition-fast)' }}
      />
    </button>
  )
}
