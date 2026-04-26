import { Order, ShippingAddress, OrderItem } from '@/types'

const ORDERS_KEY = 'mh_orders'

export function getOrders(): Order[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(ORDERS_KEY)
  return stored ? JSON.parse(stored) : []
}

export function createOrder(userId: string, items: OrderItem[], total: number, address: ShippingAddress): Order {
  const orders = getOrders()
  const newOrder: Order = {
    id: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    userId,
    items,
    total,
    shippingAddress: address,
    status: 'pending',
    createdAt: new Date().toISOString()
  }
  
  localStorage.setItem(ORDERS_KEY, JSON.stringify([newOrder, ...orders]))
  return newOrder
}

export function getOrderById(id: string): Order | undefined {
  const orders = getOrders()
  return orders.find(o => o.id === id)
}
