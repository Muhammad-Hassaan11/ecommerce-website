"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ShoppingBag, FileText } from "lucide-react";
import { getOrderById } from "@/lib/utils/orders";
import type { Order } from "@/types";
import styles from "./page.module.css";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<Order | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (orderId) {
      const found = getOrderById(orderId);
      if (found) setOrder(found);
    }
  }, [orderId]);

  // Confetti animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = [
      "#a78bfa", "#818cf8", "#34d399", "#fbbf24",
      "#f87171", "#60a5fa", "#f472b6", "#c084fc",
    ];

    interface Particle {
      x: number;
      y: number;
      w: number;
      h: number;
      color: string;
      vx: number;
      vy: number;
      rotation: number;
      rotationSpeed: number;
      opacity: number;
    }

    const particles: Particle[] = [];
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        w: Math.random() * 10 + 4,
        h: Math.random() * 6 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        opacity: 1,
      });
    }

    let frameId: number;
    let elapsed = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      elapsed++;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.vy += 0.03;
        if (elapsed > 120) p.opacity -= 0.008;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });

      if (elapsed < 300) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={styles.successPage}>
      <canvas ref={canvasRef} className={styles.confettiCanvas} />

      <div className={styles.successCard}>
        <div className={styles.checkCircle}>
          <CheckCircle size={40} className={styles.checkIcon} />
        </div>

        <h1 className={styles.successTitle}>Order Placed Successfully!</h1>
        <p className={styles.successText}>
          Thank you for your purchase. Your order has been received and is being
          processed.
        </p>

        {order && (
          <>
            <div className={styles.orderIdBox}>
              <span className={styles.orderIdLabel}>Order ID:</span>
              <span className={styles.orderId}>{order.id}</span>
            </div>

            <div className={styles.summaryBox}>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Items</span>
                <span className={styles.summaryValue}>
                  {order.items.reduce((s, i) => s + i.quantity, 0)}
                </span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Shipping</span>
                <span className={styles.summaryValue}>
                  {order.total > 50 ? "Free" : "$9.99"}
                </span>
              </div>
              <div className={styles.summaryDivider}></div>
              <div className={styles.summaryTotal}>
                <span className={styles.totalLabel}>Total</span>
                <span className={styles.totalValue}>
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </div>
          </>
        )}

        <div className={styles.actions}>
          <Link href="/" className={styles.primaryBtn}>
            <ShoppingBag size={18} />
            Continue Shopping
          </Link>
          <Link href="/orders" className={styles.secondaryBtn}>
            <FileText size={18} />
            View Orders
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className={styles.successPage}>
          <div
            className="skeleton"
            style={{ width: 400, height: 500, borderRadius: 16 }}
          ></div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
