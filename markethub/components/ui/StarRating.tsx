'use client'

import { useState } from 'react'
import { Star, StarHalf } from 'lucide-react'

interface StarRatingProps {
  rating: number
  maxStars?: number
  size?: number
  interactive?: boolean
  onChange?: (rating: number) => void
}

export default function StarRating({ 
  rating, 
  maxStars = 5,
  size = 14,
  interactive = false,
  onChange
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0)

  const currentVal = interactive && hoverRating > 0 ? hoverRating : rating
  const fullStars = Math.floor(currentVal)
  const hasHalfStar = currentVal % 1 >= 0.5
  const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0)

  // Handle keyboard interaction
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (!interactive || !onChange) return
    const value = index + 1
    
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onChange(value)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      if (value < maxStars) onChange(value + 1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      if (value > 1) onChange(value - 1)
    }
  }

  const wrapperProps = interactive ? {
    role: 'radiogroup',
    'aria-label': 'Rate this product',
    'aria-required': true
  } : {
    'aria-label': `${rating} out of ${maxStars} stars`
  }

  return (
    <div 
      className="flex items-center gap-1" 
      style={{ display: 'flex', gap: '2px', alignItems: 'center' }}
      onMouseLeave={() => interactive && setHoverRating(0)}
      {...wrapperProps}
    >
      {[...Array(maxStars)].map((_, i) => {
        const starValue = i + 1
        let isFilled = false
        let isHalf = false

        if (starValue <= fullStars) {
          isFilled = true
        } else if (starValue === fullStars + 1 && hasHalfStar) {
          isHalf = true
        }

        const iconProps = {
          size,
          color: isFilled || isHalf ? "var(--color-star-filled)" : "var(--color-star-empty)",
          ...(isFilled && { fill: "var(--color-star-filled)" }),
          ...(isHalf && { fill: "var(--color-star-filled)" }) // StarHalf fills automatically where appropriate
        }

        const interactiveProps = interactive ? {
          role: 'radio',
          'aria-checked': rating === starValue,
          tabIndex: rating === starValue || (rating === 0 && i === 0) ? 0 : -1,
          onMouseEnter: () => setHoverRating(starValue),
          onClick: () => onChange && onChange(starValue),
          onKeyDown: (e: React.KeyboardEvent) => handleKeyDown(e, i),
          style: { cursor: 'pointer', transition: 'transform 0.1s ease' }
        } : {}

        return (
          <div 
            key={`star-${i}`} 
            {...interactiveProps}
            aria-label={`${starValue} Stars`}
          >
            {isHalf ? <StarHalf {...iconProps} /> : <Star {...iconProps} />}
          </div>
        )
      })}
    </div>
  )
}
