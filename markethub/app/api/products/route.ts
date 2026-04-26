import { NextResponse } from 'next/server'
import { getAllProducts } from '@/lib/data/products'
import { getAllVendors } from '@/lib/data/vendors'
import { getSeedReviewsByProductSlug } from '@/lib/data/reviews'
import { computeAverageRating } from '@/lib/utils/ratings'

export async function GET() {
  try {
    const products = getAllProducts()
    const vendors = getAllVendors()

    const enriched = products.map(p => {
      const vendor = vendors.find(v => v.slug === p.vendorSlug)
      const reviews = getSeedReviewsByProductSlug(p.slug)
      
      return {
        ...p,
        vendorName: vendor ? vendor.name : 'Unknown Vendor',
        reviewCount: reviews.length,
        avgRating: computeAverageRating(reviews)
      }
    })

    return NextResponse.json(enriched)
  } catch (error) {
    console.error('Failed to fetch products API:', error)
    return NextResponse.json({ error: 'Failed to load products' }, { status: 500 })
  }
}
