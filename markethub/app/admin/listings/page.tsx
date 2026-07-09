'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Package, Trash2 } from 'lucide-react'
import { fetchAllProducts } from '@/lib/utils/productsClient'
import { getUserProducts, deleteUserProduct } from '@/lib/utils/userProducts'
import { notifyToast } from '@/components/ui/Toast'
import type { EnrichedProduct } from '@/types'
import styles from '../admin.module.css'

export default function AdminListingsPage() {
  const [products, setProducts] = useState<EnrichedProduct[]>([])
  const [userSlugs, setUserSlugs] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const all = await fetchAllProducts()
    setProducts(all)
    setUserSlugs(new Set(getUserProducts().map((p) => p.slug)))
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
    const handler = () => refresh()
    window.addEventListener('mh_products_changed', handler)
    return () => window.removeEventListener('mh_products_changed', handler)
  }, [refresh])

  const handleDelete = (slug: string, name: string) => {
    deleteUserProduct(slug)
    notifyToast(`Listing "${name}" removed.`, 'success')
  }

  return (
    <>
      <h1 className={styles.pageTitle}>Listings</h1>
      <p className={styles.pageSubtitle}>
        All catalog products and user-submitted listings
      </p>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>
          <Package size={18} />
          All Listings ({products.length})
        </h2>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th></th>
                <th>Product</th>
                <th>Category</th>
                <th>Vendor</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Source</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className={styles.emptyRow}>Loading listings…</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={8} className={styles.emptyRow}>No listings found.</td>
                </tr>
              ) : (
                products.map((p) => {
                  const isUserListing = userSlugs.has(p.slug)
                  return (
                    <tr key={p.slug}>
                      <td>
                        {/* data: URLs and remote images both render fine in a plain img */}
                        <img src={p.images[0]} alt={p.name} className={styles.thumb} loading="lazy" />
                      </td>
                      <td className={styles.cellStrong}>
                        <Link href={`/products/${p.slug}`}>{p.name}</Link>
                      </td>
                      <td>{p.category}</td>
                      <td>{p.vendorName}</td>
                      <td className={styles.cellStrong}>${p.price.toFixed(2)}</td>
                      <td>{p.inStock ? 'In stock' : 'Out of stock'}</td>
                      <td>
                        <span className={`${styles.sourceBadge} ${isUserListing ? styles.user : styles.catalog}`}>
                          {isUserListing ? 'User listing' : 'Catalog'}
                        </span>
                      </td>
                      <td>
                        {isUserListing && (
                          <button
                            className={styles.deleteBtn}
                            onClick={() => handleDelete(p.slug, p.name)}
                            title="Remove listing"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
