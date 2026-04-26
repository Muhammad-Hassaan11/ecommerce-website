'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState, useEffect } from 'react'
import { Search } from 'lucide-react'

interface CategoryFilterProps {
  categories: string[]
}

export default function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('category') || 'All'
  const currentQuery = searchParams.get('q') || ''
  
  // Local state for search input
  const [searchValue, setSearchValue] = useState(currentQuery)

  // Sync state if URL changes
  useEffect(() => {
    setSearchValue(currentQuery)
  }, [currentQuery])

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value === 'All' || value === '') {
        params.delete(name)
      } else {
        params.set(name, value)
      }
      return params.toString()
    },
    [searchParams]
  )

  const handleCategoryClick = (category: string) => {
    router.push(`/?${createQueryString('category', category)}`)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/?${createQueryString('q', searchValue)}`)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
      
      {/* Search Bar */}
      <form 
        onSubmit={handleSearchSubmit}
        style={{ display: 'flex', gap: 'var(--space-2)', maxWidth: '500px' }}
      >
        <div style={{ position: 'relative', flex: 1 }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}>
            <Search size={18} />
          </span>
          <input
            type="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search products..."
            className="input"
            style={{ paddingLeft: '40px' }}
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ padding: '0 var(--space-4)' }}>
          Search
        </button>
      </form>

      {/* Category Pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <button
          onClick={() => handleCategoryClick('All')}
          className={`btn ${currentCategory === 'All' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ borderRadius: 'var(--radius-full)' }}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className={`btn ${currentCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            {cat}
          </button>
        ))}
      </div>
      
    </div>
  )
}
