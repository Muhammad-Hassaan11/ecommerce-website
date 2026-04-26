import type { EnrichedProduct } from '@/types'
import ProductCard from './ProductCard'
import styles from './ProductGrid.module.css'
import { PackageX } from 'lucide-react'

interface ProductGridProps {
  products: EnrichedProduct[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className={`surface ${styles.emptyState}`}>
        <PackageX size={64} color="var(--color-border)" strokeWidth={1} />
        <h3 className={styles.emptyMessage}>No products found</h3>
        <p>Try adjusting your search or category filters.</p>
      </div>
    )
  }

  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  )
}
