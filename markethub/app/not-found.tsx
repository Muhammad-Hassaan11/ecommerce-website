import Link from 'next/link'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="container" style={{ paddingBlock: 'var(--space-12)', textAlign: 'center' }}>
      <div style={{ display: 'inline-flex', padding: 'var(--space-8)', borderRadius: 'var(--radius-full)', background: 'var(--color-bg-elevated)', marginBottom: 'var(--space-6)' }}>
        <FileQuestion size={64} color="var(--color-border)" />
      </div>
      <h1 className="animate-slide-up" style={{ marginBottom: 'var(--space-4)' }}>Page Not Found</h1>
      <p className="animate-slide-up delay-100" style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-8)', maxWidth: '400px', marginInline: 'auto' }}>
        We couldn't find the page you were looking for. The link may be broken, or the page may have been removed.
      </p>
      <Link href="/" className="btn btn-primary animate-slide-up delay-200">
        Return to Home
      </Link>
    </div>
  )
}
