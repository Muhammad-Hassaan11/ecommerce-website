export interface Product {
  slug: string
  name: string
  description: string
  price: number
  category: string
  images: string[]
  vendorSlug: string
  tags: string[]
  inStock: boolean
  createdAt: string
  isBestSeller?: boolean
}

export interface EnrichedProduct extends Product {
  vendorName: string
  reviewCount: number
  avgRating: number
}

export interface Vendor {
  slug: string
  name: string
  description: string
  bannerImage: string
  logoImage: string
  location: string
  joinedAt: string
  rating: number
}

export interface Review {
  productSlug: string
  reviewerName: string
  rating: number
  comment: string
  createdAt: string
  source: 'seed' | 'local'
}

export interface FAQ {
  question: string
  answer: string
}

export interface ShippingAddress {
  fullName: string
  addressLine1: string
  addressLine2?: string
  city: string
  zipCode: string
  country: string
}

export interface OrderItem {
  slug: string
  name: string
  price: number
  quantity: number
  image: string
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  total: number
  shippingAddress: ShippingAddress
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
}

