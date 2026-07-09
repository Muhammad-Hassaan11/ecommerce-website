'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { getOrders, updateOrderStatus } from '@/lib/utils/orders'
import { notifyToast } from '@/components/ui/Toast'
import type { Order } from '@/types'
import styles from '../admin.module.css'

const STATUSES: Order['status'][] = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
]

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])

  const refresh = useCallback(() => setOrders(getOrders()), [])

  useEffect(() => {
    refresh()
    window.addEventListener('mh_orders_changed', refresh)
    return () => window.removeEventListener('mh_orders_changed', refresh)
  }, [refresh])

  const handleStatusChange = (id: string, status: Order['status']) => {
    updateOrderStatus(id, status)
    notifyToast(`Order ${id} marked as ${status}.`, 'success')
  }

  return (
    <>
      <h1 className={styles.pageTitle}>Orders</h1>
      <p className={styles.pageSubtitle}>
        Track and manage every order — updating a status notifies the customer
      </p>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>
          <ShoppingCart size={18} />
          All Orders ({orders.length})
        </h2>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Ship To</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className={styles.emptyRow}>
                    No orders yet. Orders placed at checkout will appear here.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td className={styles.cellStrong}>
                      <Link href={`/orders/${order.id}`}>{order.id}</Link>
                    </td>
                    <td>
                      {new Date(order.createdAt).toLocaleDateString()}{' '}
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td>{order.shippingAddress.fullName}</td>
                    <td>
                      {order.shippingAddress.city}, {order.shippingAddress.country}
                    </td>
                    <td>
                      {order.items.reduce((n, i) => n + i.quantity, 0)} (
                      {order.items.map((i) => i.name).join(', ').slice(0, 40)}
                      {order.items.map((i) => i.name).join(', ').length > 40 ? '…' : ''})
                    </td>
                    <td className={styles.cellStrong}>${order.total.toFixed(2)}</td>
                    <td>
                      <select
                        className={styles.statusSelect}
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value as Order['status'])
                        }
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
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
