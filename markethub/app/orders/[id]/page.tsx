"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { format } from "date-fns";
import {
  ArrowLeft, Package, MapPin, Receipt, CheckCircle, Clock
} from "lucide-react";
import { getOrderById } from "@/lib/utils/orders";
import type { Order } from "@/types";
import styles from "./page.module.css";

export default function OrderDetailPage() {
  const { id } = useParams() as { id: string };
  const { data: session, status } = useSession();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/login?callbackUrl=/orders/${id}`);
      return;
    }

    if (status === "authenticated" && id) {
      const found = getOrderById(id);
      
      // Ensure the user owns this order (or guest if testing)
      if (found && (found.userId === session.user?.id || found.userId === "guest")) {
        setOrder(found);
      }
      setLoading(false);
    }
  }, [id, status, session, router]);

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "delivered":
        return <CheckCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  if (loading || status === "loading") {
    return (
      <div className={styles.orderDetailPage}>
        <div className="container">
          <div className="skeleton" style={{ width: 100, height: 20, marginBottom: 24, borderRadius: 4 }}></div>
          <div className="skeleton" style={{ width: "100%", height: 100, marginBottom: 32, borderRadius: 12 }}></div>
          <div className={styles.detailGrid}>
            <div className="skeleton" style={{ height: 400, borderRadius: 16 }}></div>
            <div className="skeleton" style={{ height: 250, borderRadius: 16 }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className={styles.orderDetailPage}>
        <div className="container" style={{ textAlign: "center", padding: "4rem 0" }}>
          <h2>Order not found</h2>
          <p style={{ color: "var(--color-text-muted)", marginBottom: "2rem" }}>
            The order you are looking for does not exist or you do not have permission to view it.
          </p>
          <Link href="/orders" className="btn btn-primary">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = order.total > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% simulated tax matching checkout

  return (
    <div className={styles.orderDetailPage}>
      <div className="container">
        <Link href="/orders" className={styles.backLink}>
          <ArrowLeft size={16} />
          Back to Orders
        </Link>

        {/* Header */}
        <div className={styles.pageHeader}>
          <div className={styles.titleArea}>
            <h1>
              Order <span className={styles.orderId}>#{order.id}</span>
            </h1>
            <p className={styles.orderDate}>
              Placed on {format(new Date(order.createdAt), "MMMM d, yyyy 'at' h:mm a")}
            </p>
          </div>
          <div className={`${styles.statusBadge} ${styles[`status-${order.status}`]}`}>
            {getStatusIcon(order.status)}
            {order.status}
          </div>
        </div>

        <div className={styles.detailGrid}>
          {/* Main Column */}
          <div className={styles.mainCol}>
            <div className={styles.sectionCard}>
              <h2 className={styles.sectionTitle}>
                <Package size={20} />
                Order Items ({order.items.reduce((sum, i) => sum + i.quantity, 0)})
              </h2>
              
              <div className={styles.itemList}>
                {order.items.map((item) => (
                  <div key={item.slug} className={styles.itemRow}>
                    <div className={styles.itemImage}>
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className={styles.itemInfo}>
                      <Link href={`/products/${item.slug}`} className={styles.itemName}>
                        {item.name}
                      </Link>
                      <span className={styles.itemMeta}>Qty: {item.quantity}</span>
                    </div>
                    <div className={styles.itemPriceQty}>
                      <span className={styles.itemTotal}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                      <span className={styles.itemUnit}>
                        ${item.price.toFixed(2)} each
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.sectionCard}>
              <h2 className={styles.sectionTitle}>
                <MapPin size={20} />
                Fulfillment Details
              </h2>
              
              <div className={styles.infoGrid}>
                <div className={styles.infoBlock}>
                  <p className={styles.infoLabel}>Shipping Address</p>
                  <p className={styles.infoValue}>
                    {order.shippingAddress.fullName}<br />
                    {order.shippingAddress.addressLine1}<br />
                    {order.shippingAddress.addressLine2 && (
                      <>{order.shippingAddress.addressLine2}<br /></>
                    )}
                    {order.shippingAddress.city}, {order.shippingAddress.zipCode}<br />
                    {order.shippingAddress.country}
                  </p>
                </div>
                
                <div className={styles.infoBlock}>
                  <p className={styles.infoLabel}>Shipping Method</p>
                  <p className={styles.infoValue}>
                    Standard Shipping (3-5 Business Days)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className={styles.sidebar}>
            <div className={styles.sectionCard}>
              <h2 className={styles.sectionTitle}>
                <Receipt size={20} />
                Payment Summary
              </h2>
              
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Subtotal</span>
                <span className={styles.summaryValue}>${subtotal.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Shipping</span>
                <span className={styles.summaryValue}>
                  {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Tax</span>
                <span className={styles.summaryValue}>${tax.toFixed(2)}</span>
              </div>
              
              <div className={styles.summaryDivider}></div>
              
              <div className={styles.summaryTotal}>
                <span className={styles.totalLabel}>Total</span>
                <span className={styles.totalValue}>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
