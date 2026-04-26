import styles from './Badge.module.css'

interface BadgeProps {
  label: string
  variant?: 'category' | 'tag' | 'vendor'
}

export default function Badge({ label, variant = 'category' }: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[variant]}`}>
      {label}
    </span>
  )
}
