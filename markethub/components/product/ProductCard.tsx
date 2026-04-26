import Link from 'next/link'
import Image from 'next/image'
import type { EnrichedProduct } from '@/types'
import StarRating from '@/components/ui/StarRating'
import WishlistButton from '@/components/wishlist/WishlistButton'
import BestSellerBadge from '@/components/ui/BestSellerBadge'
import styles from './ProductCard.module.css'

interface ProductCardProps {
  product: EnrichedProduct
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className={`surface ${styles.card}`}>
      <div className={styles.imageWrapper}>
        {product.isBestSeller && (
          <div className={styles.bestSellerWrapper}>
            <BestSellerBadge />
          </div>
        )}
        {product.images[0]?.startsWith('data:') ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className={styles.image}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          />
        ) : (
          <Image
            src={product.images[0] || '/placeholder.png'}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={styles.image}
          />
        )}
        <div className={styles.wishlistBtn}>
          <WishlistButton productSlug={product.slug} />
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.vendorRow}>
          {product.vendorName && product.vendorSlug ? (
            <Link 
              href={`/vendors/${product.vendorSlug}`} 
              className={styles.vendorName}
              style={{ position: 'relative', zIndex: 6 }}
            >
              {product.vendorName}
            </Link>
          ) : (
            <span className={styles.vendorName}>Unknown Vendor</span>
          )}
          
          {product.reviewCount > 0 && (
            <div className="flex" title={`${product.avgRating} out of 5 stars from ${product.reviewCount} reviews`}>
              <StarRating rating={product.avgRating} />
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginLeft: '4px' }}>
                ({product.reviewCount})
              </span>
            </div>
          )}
        </div>

        <h3 className={styles.title}>
          <Link href={`/products/${product.slug}`} className={styles.titleLink}>
            {product.name}
          </Link>
        </h3>

        <div className={styles.footer}>
          <span className={styles.price}>${product.price.toFixed(2)}</span>
          {!product.inStock && (
            <span className={styles.outOfStock}>Out of Stock</span>
          )}
        </div>
      </div>
    </article>
  )
}
