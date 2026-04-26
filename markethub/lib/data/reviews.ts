import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { Review } from '@/types'

const REVIEWS_DIR = path.join(process.cwd(), 'data', 'reviews')

// In-memory cache keyed by productSlug
const reviewsCache = new Map<string, Review[]>()
// Flag to track if we've done a bulk read
let bulkLoaded = false

interface RawReview {
  reviewerName?: unknown
  rating?: unknown
  comment?: unknown
  createdAt?: unknown
}

function parseRawReview(raw: RawReview, productSlug: string, index: number): Review {
  const today = new Date().toISOString().split('T')[0]

  let reviewerName = 'Anonymous'
  if (!raw.reviewerName || typeof raw.reviewerName !== 'string' || raw.reviewerName.trim() === '') {
    console.warn(`[reviews] Invalid "reviewerName" at index ${index} for "${productSlug}" — defaulting to "Anonymous"`)
  } else {
    reviewerName = raw.reviewerName.trim()
  }

  let rating = 3
  if (typeof raw.rating !== 'number') {
    console.warn(`[reviews] Invalid "rating" at index ${index} for "${productSlug}" — defaulting to 3`)
  } else {
    rating = Math.min(5, Math.max(1, Math.round(raw.rating)))
  }

  let comment = '(no comment)'
  if (!raw.comment || typeof raw.comment !== 'string' || raw.comment.trim() === '') {
    console.warn(`[reviews] Invalid "comment" at index ${index} for "${productSlug}" — defaulting to "(no comment)"`)
  } else {
    comment = raw.comment.trim()
  }

  let createdAt = today
  if (!raw.createdAt || isNaN(Date.parse(String(raw.createdAt)))) {
    console.warn(`[reviews] Invalid "createdAt" at index ${index} for "${productSlug}" — defaulting to today`)
  } else {
    createdAt = String(raw.createdAt)
  }

  return { productSlug, reviewerName, rating, comment, createdAt, source: 'seed' }
}

function parseReviewFile(filePath: string, productSlug: string): Review[] {
  let raw: string
  try {
    raw = fs.readFileSync(filePath, 'utf-8')
  } catch {
    console.warn(`[reviews] Could not read file: ${filePath}`)
    return []
  }

  const { data } = matter(raw)

  if (!Array.isArray(data.reviews)) {
    console.warn(`[reviews] "reviews" key is not an array in ${filePath} — returning []`)
    return []
  }

  return (data.reviews as RawReview[]).map((r, i) =>
    parseRawReview(r, productSlug, i)
  )
}

/**
 * Bulk-load ALL review files at once into the cache.
 * Called once on first access — avoids N+1 file reads on the home page.
 */
function ensureBulkLoaded(): void {
  if (bulkLoaded) return
  bulkLoaded = true

  if (!fs.existsSync(REVIEWS_DIR)) return

  const files = fs.readdirSync(REVIEWS_DIR).filter((f) => f.endsWith('.md'))
  for (const file of files) {
    const productSlug = path.basename(file, '.md')
    if (!reviewsCache.has(productSlug)) {
      const reviews = parseReviewFile(path.join(REVIEWS_DIR, file), productSlug)
      reviewsCache.set(productSlug, reviews)
    }
  }
}

export function getSeedReviewsByProductSlug(productSlug: string): Review[] {
  // Bulk-load on first call so all subsequent calls are cache hits
  ensureBulkLoaded()

  if (reviewsCache.has(productSlug)) {
    return reviewsCache.get(productSlug)!
  }

  // No review file exists for this product
  reviewsCache.set(productSlug, [])
  return []
}
