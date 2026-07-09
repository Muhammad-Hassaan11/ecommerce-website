'use client'

import type { EnrichedProduct } from '@/types'
import { getUserProducts, toEnrichedProduct } from './userProducts'

/**
 * Fetch the full product list the way the UI sees it:
 * catalog products from the API merged with the user's local listings.
 * Used by cart, checkout, and admin so user-listed products resolve everywhere.
 */
export async function fetchAllProducts(): Promise<EnrichedProduct[]> {
  let catalog: EnrichedProduct[] = []
  try {
    const res = await fetch('/api/products')
    if (res.ok) catalog = await res.json()
  } catch {
    // fall through — still return local listings
  }
  const userListings = getUserProducts().map(toEnrichedProduct)
  return [...catalog, ...userListings]
}
