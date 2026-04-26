'use client'

import { useState, useEffect, useCallback } from 'react'
import ProductFilter from '@/components/product/ProductFilter'
import { getUserProducts, toEnrichedProduct } from '@/lib/utils/userProducts'
import type { EnrichedProduct } from '@/types'

interface BrowsePageClientProps {
  serverProducts: EnrichedProduct[]
  categories: string[]
  vendors: { slug: string; name: string }[]
}

/**
 * Client wrapper that merges server-rendered products with
 * user-added products from localStorage.
 */
export default function BrowsePageClient({
  serverProducts,
  categories,
  vendors,
}: BrowsePageClientProps) {
  const [userProducts, setUserProducts] = useState<EnrichedProduct[]>([])

  const loadUserProducts = useCallback(() => {
    const stored = getUserProducts()
    setUserProducts(stored.map(toEnrichedProduct))
  }, [])

  useEffect(() => {
    loadUserProducts()

    // Listen for changes from the SellModal
    const handler = () => loadUserProducts()
    window.addEventListener('mh_products_changed', handler)
    return () => window.removeEventListener('mh_products_changed', handler)
  }, [loadUserProducts])

  // Merge: user products at the top, then server products
  const allProducts = [...userProducts, ...serverProducts]

  // Merge categories — include any new ones from user products
  const allCategories = Array.from(
    new Set([...categories, ...userProducts.map((p) => p.category)])
  ).sort()

  return (
    <ProductFilter
      products={allProducts}
      categories={allCategories}
      vendors={vendors}
    />
  )
}
