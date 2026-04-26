import Link from 'next/link'

interface VendorBadgeProps {
  vendorSlug: string
  vendorName?: string
}

export default function VendorBadge({ vendorSlug, vendorName }: VendorBadgeProps) {
  const display = vendorName || 'Unknown Vendor'

  if (!vendorSlug) {
    return (
      <span style={{
        fontSize: 'var(--text-xs)',
        color: 'var(--color-text-muted)',
        fontWeight: 'var(--weight-medium)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}>
        {display}
      </span>
    )
  }

  return (
    <Link
      href={`/vendors/${vendorSlug}`}
      style={{
        fontSize: 'var(--text-xs)',
        color: 'var(--color-secondary)',
        fontWeight: 'var(--weight-medium)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        transition: 'color var(--transition-fast)',
      }}
    >
      {display}
    </Link>
  )
}
