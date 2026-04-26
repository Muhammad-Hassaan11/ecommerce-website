import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getProductBySlug, getAllProducts } from '@/lib/data/products'
import { getVendorBySlug } from '@/lib/data/vendors'
import { getSeedReviewsByProductSlug } from '@/lib/data/reviews'
import { computeAverageRating } from '@/lib/utils/ratings'
import StarRating from '@/components/ui/StarRating'
import WishlistButton from '@/components/wishlist/WishlistButton'
import ReviewList from '@/components/review/ReviewList'
import VendorBadge from '@/components/vendor/VendorBadge'
import AddToCartButton from '@/components/cart/AddToCartButton'
import styles from './page.module.css'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = getProductBySlug(slug)
  
  if (!product) {
    return { title: 'Product Not Found | MarketHub' }
  }

  return {
    title: `${product.name} | MarketHub`,
    description: product.description.substring(0, 160) + (product.description.length > 160 ? '...' : '')
  }
}

export async function generateStaticParams() {
  const products = getAllProducts()
  return products.map((product) => ({
    slug: product.slug,
  }))
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  
  const product = getProductBySlug(slug)
  if (!product) {
    notFound()
  }

  const vendor = getVendorBySlug(product.vendorSlug)
  const reviews = getSeedReviewsByProductSlug(product.slug)
  const avgRating = computeAverageRating(reviews)

  return (
    <div className="container">
      <div className={styles.layout}>
        {/* Gallery Image */}
        <div className={styles.gallery}>
          <Image
            src={product.images[0] || '/placeholder.png'}
            alt={product.name}
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
            className={styles.image}
            priority
          />
        </div>

        {/* Product Details */}
        <div className={styles.details}>
          <div className={styles.vendorRow}>
            <VendorBadge vendorSlug={product.vendorSlug} vendorName={vendor?.name} />
            <span className={`${styles.stockBadge} ${product.inStock ? styles.inStock : styles.outOfStock}`}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          <h1 className={styles.title}>{product.name}</h1>
          
          {reviews.length > 0 && (
            <div className="flex" title={`${avgRating} out of 5 stars`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <StarRating rating={avgRating} size={18} />
              <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                {avgRating} ({reviews.length} reviews)
              </span>
            </div>
          )}

          <div className={styles.price}>${product.price.toFixed(2)}</div>

          <div className={styles.actions}>
            <AddToCartButton productSlug={product.slug} inStock={product.inStock} />
            <div className="surface" style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-md)' }}>
              <WishlistButton productSlug={product.slug} size={24} />
            </div>
          </div>

          <div className={`divider`} />

          <div>
            <h3>About this product</h3>
            <p className={styles.prose}>{product.description}</p>
          </div>

          {product.tags.length > 0 && (
            <div className={styles.tags}>
              {product.tags.map(tag => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <section className={styles.reviewsSection} style={{ marginTop: 'var(--space-12)' }}>
        <h2>Customer Reviews</h2>
        <ReviewList productSlug={product.slug} seedReviews={reviews} />
      </section>
    </div>
  )
}
