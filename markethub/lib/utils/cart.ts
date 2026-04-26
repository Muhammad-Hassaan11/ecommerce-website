export interface CartItem {
  slug: string
  quantity: number
}

const CART_KEY = 'mh_cart'

// Helper to check if window is defined (for SSR context)
const isBrowser = typeof window !== 'undefined'

export function getCart(): CartItem[] {
  if (!isBrowser) return []
  try {
    const cart = localStorage.getItem(CART_KEY)
    return cart ? JSON.parse(cart) : []
  } catch (err) {
    return []
  }
}

export function saveCart(cart: CartItem[]) {
  if (!isBrowser) return
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
  // Dispatch a custom event so other components (like Navbar) can trigger re-renders
  window.dispatchEvent(new Event('cart-updated'))
}

export function addToCart(slug: string, quantity: number = 1) {
  const cart = getCart()
  const existing = cart.find(item => item.slug === slug)
  
  if (existing) {
    existing.quantity += quantity
  } else {
    cart.push({ slug, quantity })
  }
  
  saveCart(cart)
}

export function removeFromCart(slug: string) {
  const cart = getCart()
  const updated = cart.filter(item => item.slug !== slug)
  saveCart(updated)
}

export function updateQuantity(slug: string, quantity: number) {
  if (quantity < 1) return removeFromCart(slug)
  
  const cart = getCart()
  const item = cart.find(item => item.slug === slug)
  if (item) {
    item.quantity = quantity
    saveCart(cart)
  }
}

export function clearCart() {
  saveCart([])
}

export function getCartItemCount(): number {
  return getCart().reduce((total, item) => total + item.quantity, 0)
}
