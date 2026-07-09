import { NextResponse } from 'next/server'
import { getAllProducts } from '@/lib/data/products'
import { getAllVendors } from '@/lib/data/vendors'
import { getSeedReviewsByProductSlug } from '@/lib/data/reviews'
import { computeAverageRating } from '@/lib/utils/ratings'
import type { EnrichedProduct } from '@/types'

// The catalog comes from markdown files that only change at deploy time,
// so enrich once per server instance instead of on every request.
let cachedPayload: EnrichedProduct[] | null = null

export async function GET() {
  try {
    if (!cachedPayload) {
      const products = getAllProducts()
      const vendors = getAllVendors()

      cachedPayload = products.map(p => {
        const vendor = vendors.find(v => v.slug === p.vendorSlug)
        const reviews = getSeedReviewsByProductSlug(p.slug)

        return {
          ...p,
          vendorName: vendor ? vendor.name : 'Unknown Vendor',
          reviewCount: reviews.length,
          avgRating: computeAverageRating(reviews)
        }
      })
    }

    return NextResponse.json(cachedPayload, {
      headers: {
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
      },
    })
  } catch (error) {
    console.error('Failed to fetch products API:', error)
    return NextResponse.json({ error: 'Failed to load products' }, { status: 500 })
  }
}
