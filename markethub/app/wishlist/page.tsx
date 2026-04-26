import WishlistClient from './WishlistClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Your Wishlist | MarketHub',
  description: 'View and manage your saved products on MarketHub.',
}

export default function WishlistPage() {
  return <WishlistClient />
}
