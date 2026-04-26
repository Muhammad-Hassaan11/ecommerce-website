const WISHLIST_KEY = 'mh_wishlist'

/**
 * Read all wishlisted product slugs from localStorage.
 * Returns [] silently if localStorage is unavailable.
 */
export function getWishlist(): string[] {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((s): s is string => typeof s === 'string')
  } catch {
    return []
  }
}

/**
 * Add a product slug to the wishlist if not already present.
 * Silently no-ops if localStorage is unavailable.
 */
export function addToWishlist(slug: string): void {
  try {
    const current = getWishlist()
    if (current.includes(slug)) return
    localStorage.setItem(WISHLIST_KEY, JSON.stringify([...current, slug]))
  } catch {
    // localStorage unavailable — caller should surface toast
  }
}

/**
 * Remove a product slug from the wishlist.
 * Silently no-ops if localStorage is unavailable.
 */
export function removeFromWishlist(slug: string): void {
  try {
    const current = getWishlist()
    localStorage.setItem(
      WISHLIST_KEY,
      JSON.stringify(current.filter((s) => s !== slug))
    )
  } catch {
    // localStorage unavailable — caller should surface toast
  }
}

/**
 * Check if a product slug is currently wishlisted.
 * Returns false silently if localStorage is unavailable.
 */
export function isWishlisted(slug: string): boolean {
  try {
    return getWishlist().includes(slug)
  } catch {
    return false
  }
}
