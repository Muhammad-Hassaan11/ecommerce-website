import { getAllProducts, getAllCategories } from '@/lib/data/products'
import { getAllVendors } from '@/lib/data/vendors'
import { getSeedReviewsByProductSlug } from '@/lib/data/reviews'
import { computeAverageRating } from '@/lib/utils/ratings'
import BrowsePageClient from '@/components/product/BrowsePageClient'
import type { EnrichedProduct } from '@/types'
import styles from './page.module.css'

export const metadata = {
  title: 'MarketHub — Browse Products',
  description: 'Discover products from the best independent vendors on MarketHub.',
}

export default async function HomePage() {
  const allProducts = getAllProducts()
  const allCategories = getAllCategories()
  const allVendors = getAllVendors()

  const vendorOptions = allVendors.map(v => ({
    slug: v.slug,
    name: v.name
  }))

  const enrichedProducts: EnrichedProduct[] = allProducts.map(p => {
    const vendor = allVendors.find(v => v.slug === p.vendorSlug)
    const reviews = getSeedReviewsByProductSlug(p.slug)
    
    return {
      ...p,
      vendorName: vendor ? vendor.name : 'Unknown Vendor',
      reviewCount: reviews.length,
      avgRating: computeAverageRating(reviews)
    }
  })

  return (
    <div className="container" style={{ paddingBlock: 'var(--space-8)' }}>
      <header className={styles.hero} style={{ minHeight: 'auto', paddingBlock: 'var(--space-8)' }}>
        <div className={styles.heroInner} style={{ textAlign: 'left', alignItems: 'flex-start' }}>
          <h1 className="animate-slide-up">
            Discover Products <span className={styles.accent}>You&#39;ll Love</span>
          </h1>
          <p className="animate-slide-up delay-100" style={{ maxWidth: '600px' }}>
            Curated collections from the world&#39;s best independent creators.
          </p>
        </div>
      </header>

      <section className="animate-slide-up delay-200" style={{ marginTop: 'var(--space-8)' }}>
        <BrowsePageClient 
          serverProducts={enrichedProducts} 
          categories={allCategories} 
          vendors={vendorOptions} 
        />
      </section>
    </div>
  )
}

