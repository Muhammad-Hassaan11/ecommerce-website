'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  Clock,
  TrendingUp,
} from 'lucide-react'
import { getOrders } from '@/lib/utils/orders'
import { getUserProducts } from '@/lib/utils/userProducts'
import { fetchAllProducts } from '@/lib/utils/productsClient'
import type { Order } from '@/types'
import styles from './admin.module.css'

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [productCount, setProductCount] = useState(0)
  const [userListingCount, setUserListingCount] = useState(0)
  const [customerCount, setCustomerCount] = useState<number | null>(null)

  const refresh = useCallback(() => {
    setOrders(getOrders())
    setUserListingCount(getUserProducts().length)
  }, [])

  useEffect(() => {
    refresh()
    window.addEventListener('mh_orders_changed', refresh)
    window.addEventListener('mh_products_changed', refresh)

    fetchAllProducts().then((all) => setProductCount(all.length))
    fetch('/api/admin/users')
      .then((r) => (r.ok ? r.json() : []))
      .then((users) => setCustomerCount(Array.isArray(users) ? users.length : 0))
      .catch(() => setCustomerCount(0))

    return () => {
      window.removeEventListener('mh_orders_changed', refresh)
      window.removeEventListener('mh_products_changed', refresh)
    }
  }, [refresh])

  const revenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0)
  const pendingCount = orders.filter((o) => o.status === 'pending').length
  const recentOrders = orders.slice(0, 6)

  const stats = [
    { label: 'Total Revenue', value: `$${revenue.toFixed(2)}`, icon: DollarSign },
    { label: 'Total Orders', value: orders.length, icon: ShoppingCart },
    { label: 'Pending Orders', value: pendingCount, icon: Clock },
    { label: 'Active Listings', value: productCount, icon: Package },
    { label: 'User Listings', value: userListingCount, icon: TrendingUp },
    { label: 'Registered Users', value: customerCount ?? '—', icon: Users },
  ]

  return (
    <>
      <h1 className={styles.pageTitle}>Dashboard</h1>
      <p className={styles.pageSubtitle}>
        Overview of store activity, sales, and listings
      </p>

      <div className={styles.statsGrid}>
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className={styles.statCard}>
            <span className={styles.statIcon}>
              <Icon size={18} />
            </span>
            <span className={styles.statValue}>{value}</span>
            <span className={styles.statLabel}>{label}</span>
          </div>
        ))}
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>
          <ShoppingCart size={18} />
          Recent Orders
        </h2>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className={styles.emptyRow}>
                    No orders yet. Orders placed at checkout will appear here.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className={styles.cellStrong}>
                      <Link href={`/orders/${order.id}`}>{order.id}</Link>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>{order.items.reduce((n, i) => n + i.quantity, 0)}</td>
                    <td className={styles.cellStrong}>${order.total.toFixed(2)}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
