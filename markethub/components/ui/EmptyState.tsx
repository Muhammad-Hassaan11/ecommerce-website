import Link from 'next/link'
import styles from './EmptyState.module.css'

interface EmptyStateProps {
  title: string
  description: string
  ctaLabel?: string
  ctaHref?: string
  icon?: React.ReactNode
}

export default function EmptyState({ title, description, ctaLabel, ctaHref, icon }: EmptyStateProps) {
  return (
    <div className={`surface ${styles.wrapper}`} role="status">
      {icon && <div className={styles.icon}>{icon}</div>}
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      {ctaLabel && ctaHref && (
        <Link href={ctaHref} className="btn btn-primary">
          {ctaLabel}
        </Link>
      )}
    </div>
  )
}
