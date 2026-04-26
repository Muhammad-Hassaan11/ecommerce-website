'use client'

import { useState, useMemo } from 'react'
import { Search, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react'
import ProductGrid from './ProductGrid'
import Pagination from '@/components/ui/Pagination'
import type { EnrichedProduct } from '@/types'
import styles from './ProductFilter.module.css'

const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'newest', label: 'Newest' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'name-asc', label: 'Name A → Z' },
]

const ITEMS_PER_PAGE = 12

interface ProductFilterProps {
  products: EnrichedProduct[]
  categories: string[]
  vendors: { slug: string; name: string }[]
}

export default function ProductFilter({ products, categories, vendors }: ProductFilterProps) {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedVendor, setSelectedVendor] = useState('')
  const [sortBy, setSortBy] = useState('default')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [inStockOnly, setInStockOnly] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const filteredAndSorted = useMemo(() => {
    let results = products.filter(p => {
      // Search
      if (search) {
        const q = search.toLowerCase()
        if (
          !p.name.toLowerCase().includes(q) &&
          !p.tags.some(t => t.toLowerCase().includes(q)) &&
          !p.category.toLowerCase().includes(q)
        ) {
          return false
        }
      }

      // Category
      if (selectedCategory && p.category !== selectedCategory) return false

      // Vendor
      if (selectedVendor && p.vendorSlug !== selectedVendor) return false

      // Price range
      if (minPrice && p.price < parseFloat(minPrice)) return false
      if (maxPrice && p.price > parseFloat(maxPrice)) return false

      // In-stock
      if (inStockOnly && !p.inStock) return false

      return true
    })

    // Sort
    switch (sortBy) {
      case 'price-asc':
        results.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        results.sort((a, b) => b.price - a.price)
        break
      case 'newest':
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'rating':
        results.sort((a, b) => b.avgRating - a.avgRating)
        break
      case 'name-asc':
        results.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    return results
  }, [products, search, selectedCategory, selectedVendor, sortBy, minPrice, maxPrice, inStockOnly])

  // Pagination
  const totalPages = Math.ceil(filteredAndSorted.length / ITEMS_PER_PAGE)
  const paginatedProducts = filteredAndSorted.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  // Reset page on filter change
  const handleFilterChange = (setter: Function, value: any) => {
    setter(value)
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setSearch('')
    setSelectedCategory('')
    setSelectedVendor('')
    setSortBy('default')
    setMinPrice('')
    setMaxPrice('')
    setInStockOnly(false)
    setCurrentPage(1)
  }

  const activeFiltersCount = [
    selectedCategory,
    selectedVendor,
    sortBy !== 'default',
    minPrice,
    maxPrice,
    inStockOnly,
  ].filter(Boolean).length

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        {/* Mobile toggle */}
        <button
          className={styles.mobileToggle}
          onClick={() => setFiltersOpen(!filtersOpen)}
        >
          <SlidersHorizontal size={18} />
          <span>Filters{activeFiltersCount > 0 ? ` (${activeFiltersCount})` : ''}</span>
          {filtersOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        <div className={`surface-elevated ${styles.filterPanel} ${filtersOpen ? styles.filterPanelOpen : ''}`}>
          <div className={styles.header}>
            <h2 className={styles.title}>
              <SlidersHorizontal size={20} />
              Filters
              {activeFiltersCount > 0 && <span className={styles.badge}>{activeFiltersCount}</span>}
            </h2>
            {activeFiltersCount > 0 && (
              <button className={styles.clearBtn} onClick={clearFilters}>
                Clear all
              </button>
            )}
          </div>
          
          {/* Search */}
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={search}
              onChange={e => handleFilterChange(setSearch, e.target.value)}
              className={styles.searchInput}
            />
          </div>

          {/* Sort */}
          <div className={styles.filterGroup}>
            <label className={styles.label}>Sort by</label>
            <select 
              value={sortBy} 
              onChange={e => handleFilterChange(setSortBy, e.target.value)}
              className={styles.select}
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          
          {/* Category */}
          <div className={styles.filterGroup}>
            <label className={styles.label}>Category</label>
            <select 
              value={selectedCategory} 
              onChange={e => handleFilterChange(setSelectedCategory, e.target.value)}
              className={styles.select}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          {/* Vendor */}
          <div className={styles.filterGroup}>
            <label className={styles.label}>Vendor</label>
            <select 
              value={selectedVendor} 
              onChange={e => handleFilterChange(setSelectedVendor, e.target.value)}
              className={styles.select}
            >
              <option value="">All Vendors</option>
              {vendors.map(v => (
                <option key={v.slug} value={v.slug}>{v.name}</option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className={styles.filterGroup}>
            <label className={styles.label}>Price Range</label>
            <div className={styles.priceRange}>
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={e => handleFilterChange(setMinPrice, e.target.value)}
                className={styles.priceInput}
                min="0"
              />
              <span className={styles.priceSep}>–</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={e => handleFilterChange(setMaxPrice, e.target.value)}
                className={styles.priceInput}
                min="0"
              />
            </div>
          </div>

          {/* In-stock toggle */}
          <div className={styles.filterGroup}>
            <label className={styles.toggleRow}>
              <span>In-stock only</span>
              <button
                type="button"
                role="switch"
                aria-checked={inStockOnly}
                className={`${styles.toggle} ${inStockOnly ? styles.toggleOn : ''}`}
                onClick={() => handleFilterChange(setInStockOnly, !inStockOnly)}
              >
                <span className={styles.toggleThumb} />
              </button>
            </label>
          </div>
          
        </div>
      </aside>
      
      <main className={styles.main}>
        <div className={styles.resultsHeader}>
          <h3>
            Showing {paginatedProducts.length} of {filteredAndSorted.length}{' '}
            {filteredAndSorted.length === 1 ? 'product' : 'products'}
          </h3>
        </div>
        <ProductGrid products={paginatedProducts} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </main>
    </div>
  )
}
