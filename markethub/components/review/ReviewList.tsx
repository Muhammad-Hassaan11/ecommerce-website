'use client'

import { useEffect, useState, useMemo } from 'react'
import ReviewCard from './ReviewCard'
import ReviewForm from './ReviewForm'
import StarRating from '@/components/ui/StarRating'
import EmptyState from '@/components/ui/EmptyState'
import { computeAverageRating } from '@/lib/utils/ratings'
import { MessageSquareOff } from 'lucide-react'
import type { Review } from '@/types'
import styles from './ReviewList.module.css'

interface ReviewListProps {
  productSlug: string
  seedReviews: Review[]
}

export default function ReviewList({ productSlug, seedReviews }: ReviewListProps) {
  const [localReviews, setLocalReviews] = useState<Review[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const stored = localStorage.getItem(`mh_reviews_${productSlug}`)
      if (stored) {
        setLocalReviews(JSON.parse(stored))
      }
    } catch (error) {
      console.warn('Failed to read local reviews', error)
    }
  }, [productSlug])

  const allReviews = useMemo(
    () => [...localReviews, ...seedReviews],
    [localReviews, seedReviews]
  )

  const averageRating = useMemo(
    () => computeAverageRating(allReviews),
    [allReviews]
  )

  const handleReviewSubmitted = (newReview: Review) => {
    setLocalReviews(prev => [newReview, ...prev])
  }

  return (
    <div className={styles.container}>
      <div className={styles.statsPanel}>
        <div className={styles.statsSummary}>
          <div className={styles.largeRating}>{averageRating.toFixed(1)}</div>
          <div className={styles.starsWrapper}>
            <StarRating rating={averageRating} size={20} />
            <span className={styles.count}>
              Based on {allReviews.length} {allReviews.length === 1 ? 'review' : 'reviews'}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.list}>
          {allReviews.length === 0 ? (
            <EmptyState
              title="No Reviews Yet"
              description="Be the first to review this product!"
              icon={<MessageSquareOff size={32} />}
            />
          ) : (
            <div className={styles.cards}>
              {allReviews.map((review, i) => (
                <div key={`${review.reviewerName}-${i}`} className="animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.formSidebar}>
          {mounted && <ReviewForm productSlug={productSlug} onReviewSubmitted={handleReviewSubmitted} />}
        </div>
      </div>
    </div>
  )
}
