'use client'

import type { EnrichedProduct } from '@/types'
import { addNotification } from './notifications'

const STORAGE_KEY = 'mh_user_products'

export interface UserProduct {
  slug: string
  name: string
  price: number
  category: string
  description: string
  imageDataUrl: string | null // base64 data URL for local images
  createdAt: string
}

/**
 * Retrieve all user-added products from localStorage.
 */
export function getUserProducts(): UserProduct[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

/**
 * Save a new user-listed product to localStorage.
 * Returns the created product.
 */
export function saveUserProduct(data: {
  name: string
  price: number
  category: string
  description: string
  imageDataUrl: string | null
}): UserProduct {
  const products = getUserProducts()

  // Generate a slug from the name + timestamp for uniqueness
  const baseSlug = data.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  const slug = `${baseSlug}-${Date.now()}`

  const product: UserProduct = {
    slug,
    name: data.name,
    price: data.price,
    category: data.category,
    description: data.description,
    imageDataUrl: data.imageDataUrl,
    createdAt: new Date().toISOString().split('T')[0],
  }

  products.push(product)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products))

  // Dispatch a custom event so other components can react to the change
  window.dispatchEvent(new CustomEvent('mh_products_changed'))

  addNotification({
    type: 'listing',
    title: 'Listing published',
    message: `"${product.name}" is now live for $${product.price.toFixed(2)}.`,
    href: `/account`,
  })

  return product
}

/**
 * Delete a user-listed product by slug.
 */
export function deleteUserProduct(slug: string): void {
  const products = getUserProducts().filter((p) => p.slug !== slug)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
  window.dispatchEvent(new CustomEvent('mh_products_changed'))
}

/**
 * Convert a UserProduct to the EnrichedProduct shape used by the product grid.
 */
export function toEnrichedProduct(up: UserProduct): EnrichedProduct {
  const fallbackImage =
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'

  return {
    slug: up.slug,
    name: up.name,
    price: up.price,
    category: up.category,
    images: up.imageDataUrl ? [up.imageDataUrl] : [fallbackImage],
    vendorSlug: '',
    vendorName: 'Your Listing',
    tags: [up.category.toLowerCase()],
    inStock: true,
    createdAt: up.createdAt,
    isBestSeller: false,
    description: up.description,
    reviewCount: 0,
    avgRating: 0,
  }
}

/**
 * Convert a File to a base64 data URL string, with a max 800px dimension resize.
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      // Resize large images to avoid localStorage size limits
      const img = new window.Image()
      img.onload = () => {
        const MAX = 800
        let { width, height } = img
        if (width > MAX || height > MAX) {
          if (width > height) {
            height = Math.round((height * MAX) / width)
            width = MAX
          } else {
            width = Math.round((width * MAX) / height)
            height = MAX
          }
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', 0.7))
      }
      img.onerror = reject
      img.src = reader.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
