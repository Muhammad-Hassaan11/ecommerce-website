'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import styles from './Pagination.module.css'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  // Build page numbers with ellipsis
  const getPages = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = []
    const delta = 1 // pages around current

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i)
      } else if (pages[pages.length - 1] !== 'ellipsis') {
        pages.push('ellipsis')
      }
    }

    return pages
  }

  return (
    <nav className={styles.pagination} aria-label="Page navigation">
      <button
        className={`${styles.pageBtn} ${styles.navBtn}`}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
        <span className={styles.navLabel}>Prev</span>
      </button>

      <div className={styles.pages}>
        {getPages().map((page, index) => {
          if (page === 'ellipsis') {
            return (
              <span key={`ellipsis-${index}`} className={styles.ellipsis}>
                …
              </span>
            )
          }
          return (
            <button
              key={page}
              className={`${styles.pageBtn} ${page === currentPage ? styles.active : ''}`}
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? 'page' : undefined}
              aria-label={`Page ${page}`}
            >
              {page}
            </button>
          )
        })}
      </div>

      <button
        className={`${styles.pageBtn} ${styles.navBtn}`}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <span className={styles.navLabel}>Next</span>
        <ChevronRight size={18} />
      </button>
    </nav>
  )
}
