import type { Metadata } from 'next';
import { Flame } from 'lucide-react';
import { getBestSellingProducts } from '@/lib/data/products';
import { getAllVendors } from '@/lib/data/vendors';
import { getSeedReviewsByProductSlug } from '@/lib/data/reviews';
import { computeAverageRating } from '@/lib/utils/ratings';
import type { EnrichedProduct } from '@/types';
import ProductGrid from '@/components/product/ProductGrid';
import styles from './BestSellersPage.module.css';

export const metadata: Metadata = {
  title: 'Best Sellers | MarketHub',
  description: 'Shop our top-rated, best-selling products on MarketHub.',
};

export default function BestSellersPage() {
  const bestSellers = getBestSellingProducts();
  const allVendors = getAllVendors();

  const enrichedProducts: EnrichedProduct[] = bestSellers.map(p => {
    const vendor = allVendors.find(v => v.slug === p.vendorSlug);
    const reviews = getSeedReviewsByProductSlug(p.slug);
    
    return {
      ...p,
      vendorName: vendor ? vendor.name : 'Unknown Vendor',
      reviewCount: reviews.length,
      avgRating: computeAverageRating(reviews)
    };
  });

  return (
    <div className={`container animate-fade-in ${styles.pageWrapper}`}>
      {/* Page Header */}
      <header className={styles.header}>
        <div className={styles.iconCircle}>
          <Flame size={36} strokeWidth={2} />
        </div>
        <h1 className={styles.title}>All-Time Best Sellers</h1>
        <p className={styles.subtitle}>
          Discover our most loved and highest-rated community favorites.
        </p>
      </header>

      {/* Grid */}
      <section className="animate-slide-up delay-100">
        <ProductGrid products={enrichedProducts} />
      </section>
    </div>
  );
}
