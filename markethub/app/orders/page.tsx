"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { format } from "date-fns";
import { PackageOpen, ArrowRight, Clock, CheckCircle } from "lucide-react";
import { getOrders } from "@/lib/utils/orders";
import type { Order } from "@/types";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/orders");
      return;
    }

    if (status === "authenticated") {
      // In a real app, you would fetch from an API filtering by userId
      // For MVP with localStorage, we fetch all and filter client-side
      const allOrders = getOrders();
      const userOrders = allOrders.filter(
        (o) => o.userId === session.user?.id || o.userId === "guest"
      );
      setOrders(userOrders);
      setLoading(false);
    }
  }, [status, session, router]);

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "delivered":
        return <CheckCircle size={14} />;
      default:
        return <Clock size={14} />;
    }
  };

  if (loading || status === "loading") {
    return (
      <div className={styles.ordersPage}>
        <div className="container">
          <div className={styles.pageHeader}>
            <div className="skeleton" style={{ width: 200, height: 36, borderRadius: 8 }}></div>
          </div>
          <div className={styles.orderList}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton" style={{ height: 200, borderRadius: 12 }}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.ordersPage}>
      <div className="container">
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Order History</h1>
          <p className={styles.pageSubtitle}>View and track your past orders</p>
        </div>

        {orders.length === 0 ? (
          <div className={styles.emptyState}>
            <PackageOpen size={64} className={styles.emptyIcon} />
            <h2 className={styles.emptyTitle}>You have no orders yet</h2>
            <p className={styles.emptyText}>
              When you place orders, they will appear here.
            </p>
            <Link href="/" className={styles.emptyBtn}>
              Start Shopping
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className={styles.orderList}>
            {orders.map((order) => (
              <div key={order.id} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <div className={styles.orderHeaderInfo}>
                    <div className={styles.headerItem}>
                      <span className={styles.headerLabel}>Order Placed</span>
                      <span className={styles.headerValue}>
                        {format(new Date(order.createdAt), "MMM d, yyyy")}
                      </span>
                    </div>
                    <div className={styles.headerItem}>
                      <span className={styles.headerLabel}>Total</span>
                      <span className={styles.headerValue}>
                        ${order.total.toFixed(2)}
                      </span>
                    </div>
                    <div className={styles.headerItem}>
                      <span className={styles.headerLabel}>Order ID</span>
                      <span className={`${styles.headerValue} ${styles.orderId}`}>
                        {order.id}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/orders/${order.id}`}
                    className={styles.orderAction}
                  >
                    View Details
                  </Link>
                </div>

                <div className={styles.orderBody}>
                  <div
                    className={`${styles.statusBadge} ${styles[`status-${order.status}`]}`}
                  >
                    {getStatusIcon(order.status)}
                    {order.status}
                  </div>

                  <div className={styles.itemPreview}>
                    {order.items.length === 1 ? (
                      <span>{order.items[0].name}</span>
                    ) : (
                      <span>
                        {order.items[0].name} and {order.items.length - 1}{" "}
                        other item{order.items.length > 2 ? "s" : ""}
                      </span>
                    )}

                    <div className={styles.itemImages}>
                      {order.items.slice(0, 4).map((item, idx) => (
                        <img
                          key={idx}
                          src={item.image}
                          alt={item.name}
                          className={styles.previewImg}
                        />
                      ))}
                      {order.items.length > 4 && (
                        <div
                          className={styles.previewImg}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "var(--text-xs)",
                            color: "var(--color-text-muted)",
                          }}
                        >
                          +{order.items.length - 4}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
