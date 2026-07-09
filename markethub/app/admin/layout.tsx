'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  ShieldCheck,
  ArrowLeft,
  ShieldAlert,
} from 'lucide-react'
import styles from './admin.module.css'

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/listings', label: 'Listings', icon: Package },
  { href: '/admin/users', label: 'Customers', icon: Users },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/admin')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="container">
        <div className={styles.adminShell}>
          <div className="skeleton" style={{ height: 300, borderRadius: 14 }}></div>
          <div className="skeleton" style={{ height: 500, borderRadius: 14 }}></div>
        </div>
      </div>
    )
  }

  if (!session?.user) return null

  if (session.user.role !== 'admin') {
    return (
      <div className="container">
        <div className={styles.deniedWrap}>
          <ShieldAlert size={48} strokeWidth={1.5} />
          <h2>Admin access required</h2>
          <p>
            This portal is only available to store managers.
            <br />
            Sign in with the admin account (admin@markethub.com) to continue.
          </p>
          <Link href="/" className="btn btn-primary">
            <ArrowLeft size={16} />
            Back to Store
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className={styles.adminShell}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarTitle}>
            <ShieldCheck size={18} />
            Manager Portal
            <span className={styles.sidebarBadge}>Admin</span>
          </div>
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`${styles.navItem} ${pathname === href ? styles.navItemActive : ''}`}
            >
              <Icon size={17} />
              {label}
            </Link>
          ))}
          <Link href="/" className={styles.navItem}>
            <ArrowLeft size={17} />
            Back to Store
          </Link>
        </aside>
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  )
}
