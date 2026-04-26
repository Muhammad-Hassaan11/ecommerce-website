import type { Review } from '@/types'

/**
 * Compute the average rating for a list of reviews.
 * - Input ratings are clamped to [1, 5] before averaging.
 * - Returns 0 for an empty array.
 */
export function computeAverageRating(reviews: Review[]): number {
  if (reviews.length === 0) return 0

  const sum = reviews.reduce((acc, review) => {
    const clamped = Math.min(5, Math.max(1, review.rating))
    return acc + clamped
  }, 0)

  const avg = sum / reviews.length
  // Round to 1 decimal place
  return Math.round(avg * 10) / 10
}
