import { Order, ShippingAddress, OrderItem } from '@/types'
import { addNotification } from './notifications'

const ORDERS_KEY = 'mh_orders'

export function getOrders(): Order[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(ORDERS_KEY)
  return stored ? JSON.parse(stored) : []
}

function persistOrders(orders: Order[]): void {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
  window.dispatchEvent(new CustomEvent('mh_orders_changed'))
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

  persistOrders([newOrder, ...orders])

  addNotification({
    type: 'order',
    title: 'Order placed 🎉',
    message: `Order ${newOrder.id} for $${total.toFixed(2)} (${items.length} item${items.length === 1 ? '' : 's'}) was placed successfully.`,
    href: `/orders/${newOrder.id}`,
  })

  return newOrder
}

export function getOrderById(id: string): Order | undefined {
  const orders = getOrders()
  return orders.find(o => o.id === id)
}

export function updateOrderStatus(id: string, status: Order['status']): Order | undefined {
  const orders = getOrders()
  const order = orders.find(o => o.id === id)
  if (!order) return undefined

  order.status = status
  persistOrders(orders)

  addNotification({
    type: 'order',
    title: 'Order update',
    message: `Order ${order.id} is now ${status}.`,
    href: `/orders/${order.id}`,
  })

  return order
}
