import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Star, ArrowRight } from 'lucide-react'
import { getAllVendors, getProductsByVendorSlug } from '@/lib/data/vendors'
import styles from './page.module.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Meet the Vendors | MarketHub',
  description: 'Browse all independent vendors selling on MarketHub and discover their stores.',
}

export default function VendorsPage() {
  const vendors = getAllVendors()

  return (
    <div className="container">
      <header className={styles.pageHeader}>
        <h1 className="animate-slide-up">Meet the Vendors</h1>
        <p className="animate-slide-up delay-100">
          The independent creators and brands behind every product on MarketHub.
        </p>
      </header>

      <div className={styles.grid}>
        {vendors.map((vendor, i) => {
          const productCount = getProductsByVendorSlug(vendor.slug).length

          return (
            <Link
              key={vendor.slug}
              href={`/vendors/${vendor.slug}`}
              className={`surface-elevated animate-slide-up ${styles.card}`}
              style={{ animationDelay: `${Math.min(i, 5) * 60}ms` }}
            >
              <div className={styles.bannerWrapper}>
                <Image
                  src={vendor.bannerImage || '/placeholder-banner.jpg'}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, 360px"
                  className={styles.bannerImage}
                />
              </div>

              <div className={styles.cardBody}>
                <div className={styles.logoWrapper}>
                  <Image
                    src={vendor.logoImage || '/placeholder.png'}
                    alt={`${vendor.name} logo`}
                    width={64}
                    height={64}
                    className={styles.logo}
                  />
                </div>

                <h2 className={styles.name}>{vendor.name}</h2>

                <div className={styles.meta}>
                  <span className={styles.metaItem}>
                    <MapPin size={14} />
                    {vendor.location}
                  </span>
                  <span className={styles.metaItem}>
                    <Star size={14} fill="var(--color-star-filled)" color="var(--color-star-filled)" />
                    {vendor.rating.toFixed(1)}
                  </span>
                </div>

                <p className={styles.description}>{vendor.description}</p>

                <div className={styles.cardFooter}>
                  <span className={styles.productCount}>
                    {productCount} {productCount === 1 ? 'product' : 'products'}
                  </span>
                  <span className={styles.visitLink}>
                    Visit store <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
