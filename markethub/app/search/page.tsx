'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search as SearchIcon } from 'lucide-react'
import ProductGrid from '@/components/product/ProductGrid'
import Pagination from '@/components/ui/Pagination'
import type { EnrichedProduct } from '@/types'
import styles from './page.module.css'

const ITEMS_PER_PAGE = 12

function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const categoryParam = searchParams.get('category') || ''
  const sortParam = searchParams.get('sort') || 'default'

  const [products, setProducts] = useState<EnrichedProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products')
        const data = await res.json()
        setProducts(data)
      } catch (err) {
        console.error('Failed to fetch products', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // Reset page when query changes
  useEffect(() => {
    setCurrentPage(1)
  }, [query, categoryParam, sortParam])

  const results = useMemo(() => {
    if (!query && !categoryParam) return products

    let matches = products.filter(p => {
      if (query) {
        const q = query.toLowerCase()
        if (
          !p.name.toLowerCase().includes(q) &&
          !p.description?.toLowerCase().includes(q) &&
          !p.tags.some(t => t.toLowerCase().includes(q)) &&
          !p.category.toLowerCase().includes(q) &&
          !p.vendorName.toLowerCase().includes(q)
        ) {
          return false
        }
      }

      if (categoryParam && p.category !== categoryParam) return false

      return true
    })

    // Sort
    switch (sortParam) {
      case 'price-asc':
        matches.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        matches.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        matches.sort((a, b) => b.avgRating - a.avgRating)
        break
      case 'name-asc':
        matches.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    return matches
  }, [products, query, categoryParam, sortParam])

  const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE)
  const paginatedResults = results.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <div className={`container ${styles.container}`}>
      <header className={styles.header}>
        <div className={styles.headerIcon}>
          <SearchIcon size={28} />
        </div>
        <div>
          <h1 className={styles.title}>
            {query ? (
              <>Search results for <span className={styles.queryHighlight}>"{query}"</span></>
            ) : (
              'All Products'
            )}
          </h1>
          <p className={styles.subtitle}>
            {isLoading ? 'Searching...' : `${results.length} ${results.length === 1 ? 'result' : 'results'} found`}
          </p>
        </div>
      </header>

      {isLoading ? (
        <div className={styles.loader}>
          <div className={styles.grid}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={`skeleton ${styles.skeleton}`} />
            ))}
          </div>
        </div>
      ) : (
        <>
          <ProductGrid products={paginatedResults} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className={`container ${styles.container}`}>
        <div className={styles.loader}>
          <p>Loading search...</p>
        </div>
      </div>
    }>
      <SearchResults />
    </Suspense>
  )
}
