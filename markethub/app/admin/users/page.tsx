'use client'

import { useState, useEffect } from 'react'
import { Users } from 'lucide-react'
import type { PublicUser } from '@/lib/data/users'
import styles from '../admin.module.css'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<PublicUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/users')
      .then(async (r) => {
        if (!r.ok) throw new Error('Failed to load users.')
        setUsers(await r.json())
      })
      .catch(() => setError('Could not load registered users.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <h1 className={styles.pageTitle}>Customers</h1>
      <p className={styles.pageSubtitle}>
        All registered accounts on MarketHub
      </p>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>
          <Users size={18} />
          Registered Users ({users.length})
        </h2>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className={styles.emptyRow}>Loading users…</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className={styles.emptyRow}>{error}</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className={styles.emptyRow}>No registered users yet.</td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id}>
                    <td className={styles.cellStrong}>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`${styles.roleBadge} ${styles[u.role]}`}>{u.role}</span>
                    </td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
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
