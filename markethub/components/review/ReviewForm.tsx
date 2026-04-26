'use client'

import { useState } from 'react'
import { MessageSquarePlus } from 'lucide-react'
import StarRating from '@/components/ui/StarRating'
import type { Review } from '@/types'
import styles from './ReviewForm.module.css'

interface ReviewFormProps {
  productSlug: string
  onReviewSubmitted?: (review: Review) => void
}

export default function ReviewForm({ productSlug, onReviewSubmitted }: ReviewFormProps) {
  const [name, setName] = useState('')
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!name.trim()) {
      setError('Please enter your name.')
      return
    }
    if (rating === 0) {
      setError('Please select a star rating.')
      return
    }
    if (!comment.trim()) {
      setError('Please write a comment.')
      return
    }

    setIsSubmitting(true)

    try {
      const newReview: Review = {
        productSlug,
        reviewerName: name.trim(),
        rating,
        comment: comment.trim(),
        createdAt: new Date().toISOString(),
        source: 'local'
      }

      // Read existing
      const key = `mh_reviews_${productSlug}`
      const existingStr = localStorage.getItem(key)
      const existing: Review[] = existingStr ? JSON.parse(existingStr) : []
      
      // Save new
      const updated = [newReview, ...existing]
      localStorage.setItem(key, JSON.stringify(updated))

      // Clear form
      setName('')
      setRating(0)
      setComment('')

      if (onReviewSubmitted) {
        onReviewSubmitted(newReview)
      }
    } catch (err) {
      console.error('Failed to save review', err)
      setError('Could not save review. Browser storage might be disabled.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className={`surface ${styles.form}`} onSubmit={handleSubmit}>
      <h3 className={styles.title}>
        <MessageSquarePlus size={20} className={styles.icon} />
        Write a Review
      </h3>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.field}>
        <label htmlFor="reviewerName" className={styles.label}>Name</label>
        <input
          type="text"
          id="reviewerName"
          className={styles.input}
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Alex Smith"
          disabled={isSubmitting}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Rating</label>
        <StarRating 
          rating={rating} 
          interactive 
          size={24} 
          onChange={setRating} 
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="reviewComment" className={styles.label}>Review</label>
        <textarea
          id="reviewComment"
          className={styles.textarea}
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="What did you like or dislike?"
          rows={4}
          disabled={isSubmitting}
        />
      </div>

      <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  )
}
