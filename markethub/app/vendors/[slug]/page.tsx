import { notFound } from 'next/navigation'
import Image from 'next/image'
import { MapPin, Calendar, Star } from 'lucide-react'
import { getAllVendors, getVendorBySlug, getProductsByVendorSlug } from '@/lib/data/vendors'
import { getSeedReviewsByProductSlug } from '@/lib/data/reviews'
import { computeAverageRating } from '@/lib/utils/ratings'
import ProductGrid from '@/components/product/ProductGrid'
import type { EnrichedProduct } from '@/types'
import styles from './page.module.css'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const vendor = getVendorBySlug(slug)
  
  if (!vendor) {
    return { title: 'Vendor Not Found | MarketHub' }
  }

  return {
    title: `${vendor.name} on MarketHub`,
    description: vendor.description.substring(0, 160) + (vendor.description.length > 160 ? '...' : '')
  }
}

export async function generateStaticParams() {
  const vendors = getAllVendors()
  return vendors.map((vendor) => ({
    slug: vendor.slug,
  }))
}

export default async function VendorPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  
  const vendor = getVendorBySlug(slug)
  if (!vendor) {
    notFound()
  }

  const products = getProductsByVendorSlug(slug)

  const enrichedProducts: EnrichedProduct[] = products.map(p => {
    const reviews = getSeedReviewsByProductSlug(p.slug)
    
    return {
      ...p,
      vendorName: vendor.name,
      reviewCount: reviews.length,
      avgRating: computeAverageRating(reviews)
    }
  })

  return (
    <div className="container">
      {/* Vendor Banner & Bio */}
      <div className={`surface-elevated ${styles.vendorHeader}`}>
        <div className={styles.bannerWrapper}>
          <Image
            src={vendor.bannerImage || '/placeholder-banner.jpg'}
            alt={`${vendor.name} banner`}
            fill
            className={styles.bannerImage}
            priority
          />
        </div>
        
        <div className={styles.vendorInfo}>
          <div className={styles.logoWrapper}>
            <Image
              src={vendor.logoImage || '/placeholder.png'}
              alt={`${vendor.name} logo`}
              width={80}
              height={80}
              className={styles.logo}
            />
          </div>
          
          <div className={styles.details}>
            <h1 className={styles.title}>{vendor.name}</h1>
            
            <div className={styles.meta}>
              <div className={styles.metaItem}>
                <MapPin size={16} />
                <span>{vendor.location}</span>
              </div>
              <div className={styles.metaItem}>
                <Calendar size={16} />
                <span>Joined {new Date(vendor.joinedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}</span>
              </div>
              <div className={styles.metaItem}>
                <Star size={16} fill="var(--color-star-filled)" color="var(--color-star-filled)" />
                <span className={styles.rating}>{vendor.rating.toFixed(1)} Rating</span>
              </div>
            </div>

            <p className={styles.description}>{vendor.description}</p>
          </div>
        </div>
      </div>

      {/* Vendor Products Grid */}
      <section className={styles.productsSection}>
        <div className={styles.sectionHeader}>
          <h2>Products from {vendor.name}</h2>
          <span className={styles.countBadge}>{products.length} Products</span>
        </div>
        
        <ProductGrid products={enrichedProducts} />
      </section>
    </div>
  )
}
