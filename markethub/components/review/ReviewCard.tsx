import StarRating from '@/components/ui/StarRating'
import type { Review } from '@/types'
import styles from './ReviewCard.module.css'

interface ReviewCardProps {
  review: Review
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const isLocal = review.source === 'local'

  return (
    <article className={`surface-elevated ${styles.card}`}>
      <div className={styles.header}>
        <div className={styles.avatar}>
          {review.reviewerName[0].toUpperCase()}
        </div>
        <div className={styles.meta}>
          <div className={styles.nameRow}>
            <span className={styles.name}>{review.reviewerName}</span>
            <span className={`${styles.sourceBadge} ${isLocal ? styles.localBadge : styles.seedBadge}`}>
              {isLocal ? 'Community' : 'Verified Seed'}
            </span>
          </div>
          <StarRating rating={review.rating} size={13} />
        </div>
        <time className={styles.date} dateTime={review.createdAt}>
          {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
        </time>
      </div>
      <p className={styles.comment}>{review.comment}</p>
    </article>
  )
}
