"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  ShoppingBag, MapPin, ClipboardCheck, ArrowLeft, ArrowRight,
  Check, Package
} from "lucide-react";
import { getCart, clearCart } from "@/lib/utils/cart";
import { createOrder } from "@/lib/utils/orders";
import { fetchAllProducts } from "@/lib/utils/productsClient";
import type { EnrichedProduct, ShippingAddress, OrderItem } from "@/types";
import styles from "./page.module.css";

type Step = 1 | 2 | 3;

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);

  // Cart data
  const [cartProducts, setCartProducts] = useState<
    (EnrichedProduct & { quantity: number })[]
  >([]);
  const [cartLoading, setCartLoading] = useState(true);

  // Shipping form
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: session?.user?.name || "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    zipCode: "",
    country: "United States",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load cart products
  const loadCart = useCallback(async () => {
    setCartLoading(true);
    const cartItems = getCart();
    if (cartItems.length === 0) {
      setCartProducts([]);
      setCartLoading(false);
      return;
    }

    try {
      const allProducts = await fetchAllProducts();
      const enriched = cartItems
        .map((ci) => {
          const product = allProducts.find((p) => p.slug === ci.slug);
          if (!product) return null;
          return { ...product, quantity: ci.quantity };
        })
        .filter(Boolean) as (EnrichedProduct & { quantity: number })[];
      setCartProducts(enriched);
    } catch {
      setCartProducts([]);
    }
    setCartLoading(false);
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // Pre-fill name from session
  useEffect(() => {
    if (session?.user?.name && !address.fullName) {
      setAddress((prev) => ({ ...prev, fullName: session.user!.name! }));
    }
  }, [session, address.fullName]);

  const subtotal = cartProducts.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0
  );
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const validateShipping = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!address.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!address.addressLine1.trim())
      newErrors.addressLine1 = "Address is required";
    if (!address.city.trim()) newErrors.city = "City is required";
    if (!address.zipCode.trim()) newErrors.zipCode = "ZIP code is required";
    if (!address.country.trim()) newErrors.country = "Country is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1) {
      if (validateShipping()) setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    // Simulate processing delay
    await new Promise((r) => setTimeout(r, 1500));

    const items: OrderItem[] = cartProducts.map((p) => ({
      slug: p.slug,
      name: p.name,
      price: p.price,
      quantity: p.quantity,
      image: p.images[0] || "",
    }));

    const order = createOrder(
      session?.user?.id || "guest",
      items,
      total,
      address
    );

    clearCart();
    router.push(`/checkout/success?orderId=${order.id}`);
  };

  if (cartLoading) {
    return (
      <div className={styles.checkoutPage}>
        <div className="container">
          <div className={styles.pageHeader}>
            <div
              className="skeleton"
              style={{ width: 200, height: 36, borderRadius: 8 }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  if (cartProducts.length === 0) {
    return (
      <div className={styles.checkoutPage}>
        <div className="container">
          <div className={styles.emptyState}>
            <ShoppingBag size={64} className={styles.emptyIcon} />
            <h2 className={styles.emptyTitle}>Your cart is empty</h2>
            <p className={styles.emptyText}>
              Add some products before checking out.
            </p>
            <Link href="/" className={styles.emptyBtn}>
              Browse Products
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.checkoutPage}>
      <div className="container">
        {/* Header */}
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Checkout</h1>
          <p className={styles.pageSubtitle}>
            Complete your order in a few easy steps
          </p>
        </div>

        {/* Step indicator */}
        <div className={styles.steps}>
          <div
            className={`${styles.step} ${step >= 1 ? styles.active : ""} ${step > 1 ? styles.completed : ""}`}
          >
            <span className={styles.stepNumber}>
              {step > 1 ? <Check size={14} /> : "1"}
            </span>
            <span>Shipping</span>
          </div>
          <div
            className={`${styles.stepDivider} ${step >= 2 ? styles.active : ""}`}
          ></div>
          <div
            className={`${styles.step} ${step >= 2 ? styles.active : ""} ${step > 2 ? styles.completed : ""}`}
          >
            <span className={styles.stepNumber}>
              {step > 2 ? <Check size={14} /> : "2"}
            </span>
            <span>Review</span>
          </div>
          <div
            className={`${styles.stepDivider} ${step >= 3 ? styles.active : ""}`}
          ></div>
          <div
            className={`${styles.step} ${step >= 3 ? styles.active : ""}`}
          >
            <span className={styles.stepNumber}>3</span>
            <span>Confirm</span>
          </div>
        </div>

        {/* Layout */}
        <div className={styles.checkoutLayout}>
          {/* Main form area */}
          <div className={styles.formSection}>
            {step === 1 && (
              <>
                <h2 className={styles.sectionTitle}>
                  <MapPin size={22} />
                  Shipping Address
                </h2>
                <div className={styles.formGrid}>
                  <div className={`${styles.formField} ${styles.fullWidth}`}>
                    <label className={styles.formLabel}>Full Name</label>
                    <input
                      className={`${styles.formInput} ${errors.fullName ? styles.error : ""}`}
                      value={address.fullName}
                      onChange={(e) =>
                        setAddress({ ...address, fullName: e.target.value })
                      }
                      placeholder="John Doe"
                    />
                    {errors.fullName && (
                      <span className={styles.fieldError}>
                        {errors.fullName}
                      </span>
                    )}
                  </div>

                  <div className={`${styles.formField} ${styles.fullWidth}`}>
                    <label className={styles.formLabel}>Address Line 1</label>
                    <input
                      className={`${styles.formInput} ${errors.addressLine1 ? styles.error : ""}`}
                      value={address.addressLine1}
                      onChange={(e) =>
                        setAddress({
                          ...address,
                          addressLine1: e.target.value,
                        })
                      }
                      placeholder="123 Main Street"
                    />
                    {errors.addressLine1 && (
                      <span className={styles.fieldError}>
                        {errors.addressLine1}
                      </span>
                    )}
                  </div>

                  <div className={`${styles.formField} ${styles.fullWidth}`}>
                    <label className={styles.formLabel}>
                      Address Line 2{" "}
                      <span style={{ color: "var(--color-text-muted)" }}>
                        (optional)
                      </span>
                    </label>
                    <input
                      className={styles.formInput}
                      value={address.addressLine2}
                      onChange={(e) =>
                        setAddress({
                          ...address,
                          addressLine2: e.target.value,
                        })
                      }
                      placeholder="Apt 4B"
                    />
                  </div>

                  <div className={styles.formField}>
                    <label className={styles.formLabel}>City</label>
                    <input
                      className={`${styles.formInput} ${errors.city ? styles.error : ""}`}
                      value={address.city}
                      onChange={(e) =>
                        setAddress({ ...address, city: e.target.value })
                      }
                      placeholder="New York"
                    />
                    {errors.city && (
                      <span className={styles.fieldError}>{errors.city}</span>
                    )}
                  </div>

                  <div className={styles.formField}>
                    <label className={styles.formLabel}>ZIP Code</label>
                    <input
                      className={`${styles.formInput} ${errors.zipCode ? styles.error : ""}`}
                      value={address.zipCode}
                      onChange={(e) =>
                        setAddress({ ...address, zipCode: e.target.value })
                      }
                      placeholder="10001"
                    />
                    {errors.zipCode && (
                      <span className={styles.fieldError}>
                        {errors.zipCode}
                      </span>
                    )}
                  </div>

                  <div className={`${styles.formField} ${styles.fullWidth}`}>
                    <label className={styles.formLabel}>Country</label>
                    <select
                      className={styles.formSelect}
                      value={address.country}
                      onChange={(e) =>
                        setAddress({ ...address, country: e.target.value })
                      }
                    >
                      <option>United States</option>
                      <option>Canada</option>
                      <option>United Kingdom</option>
                      <option>Australia</option>
                      <option>Germany</option>
                      <option>France</option>
                      <option>Japan</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className={styles.sectionTitle}>
                  <ClipboardCheck size={22} />
                  Review Your Order
                </h2>

                <div className={styles.reviewItems}>
                  {cartProducts.map((product) => (
                    <div key={product.slug} className={styles.reviewItem}>
                      <div className={styles.reviewItemImage}>
                        <img
                          src={product.images[0]}
                          alt={product.name}
                        />
                      </div>
                      <div className={styles.reviewItemInfo}>
                        <p className={styles.reviewItemName}>{product.name}</p>
                        <div className={styles.reviewItemMeta}>
                          <span>Qty: {product.quantity}</span>
                          <span className={styles.reviewItemPrice}>
                            ${(product.price * product.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles.shippingSummary}>
                  <p className={styles.shippingLabel}>Shipping to</p>
                  <p className={styles.shippingValue}>
                    {address.fullName}
                    <br />
                    {address.addressLine1}
                    {address.addressLine2 && (
                      <>
                        <br />
                        {address.addressLine2}
                      </>
                    )}
                    <br />
                    {address.city}, {address.zipCode}
                    <br />
                    {address.country}
                  </p>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h2 className={styles.sectionTitle}>
                  <Package size={22} />
                  Confirm &amp; Place Order
                </h2>
                <p
                  style={{
                    color: "var(--color-text-secondary)",
                    fontSize: "var(--text-sm)",
                    lineHeight: 1.7,
                    margin: "0 0 var(--space-6) 0",
                  }}
                >
                  Please confirm the details of your order below. By clicking
                  &ldquo;Place Order&rdquo;, you agree to our Terms of Service
                  and Privacy Policy. This is a simulated checkout — no real
                  charges will be made.
                </p>

                <div className={styles.shippingSummary}>
                  <p className={styles.shippingLabel}>Delivery Address</p>
                  <p className={styles.shippingValue}>
                    {address.fullName}
                    <br />
                    {address.addressLine1}
                    {address.addressLine2 && (
                      <>
                        <br />
                        {address.addressLine2}
                      </>
                    )}
                    <br />
                    {address.city}, {address.zipCode}, {address.country}
                  </p>
                </div>

                <div className={styles.reviewItems}>
                  {cartProducts.map((product) => (
                    <div key={product.slug} className={styles.reviewItem}>
                      <div className={styles.reviewItemImage}>
                        <img
                          src={product.images[0]}
                          alt={product.name}
                        />
                      </div>
                      <div className={styles.reviewItemInfo}>
                        <p className={styles.reviewItemName}>{product.name}</p>
                        <div className={styles.reviewItemMeta}>
                          <span>Qty: {product.quantity}</span>
                          <span className={styles.reviewItemPrice}>
                            ${(product.price * product.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Navigation buttons */}
            <div className={styles.btnRow}>
              {step > 1 && (
                <button
                  className={styles.backBtn}
                  onClick={() => setStep((step - 1) as Step)}
                >
                  <ArrowLeft size={18} />
                  Back
                </button>
              )}

              {step < 3 ? (
                <button className={styles.nextBtn} onClick={handleNext}>
                  Continue
                  <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  className={styles.nextBtn}
                  onClick={handlePlaceOrder}
                  disabled={loading}
                >
                  {loading ? (
                    <div className={styles.spinner}></div>
                  ) : (
                    <>
                      Place Order
                      <Check size={18} />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Sidebar order summary */}
          <div className={styles.sidebar}>
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryTitle}>Order Summary</h3>

              <div className={styles.summaryItems}>
                {cartProducts.map((p) => (
                  <div key={p.slug} className={styles.summaryItem}>
                    <span className={styles.summaryItemName}>{p.name}</span>
                    <span className={styles.summaryItemQty}>×{p.quantity}</span>
                    <span className={styles.summaryItemPrice}>
                      ${(p.price * p.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className={styles.summaryRow}>
                <span className={styles.summaryRowLabel}>Subtotal</span>
                <span className={styles.summaryRowValue}>
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryRowLabel}>Shipping</span>
                <span className={styles.summaryRowValue}>
                  {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryRowLabel}>Tax (8%)</span>
                <span className={styles.summaryRowValue}>
                  ${tax.toFixed(2)}
                </span>
              </div>
              <div className={styles.summaryDivider}></div>
              <div className={styles.summaryTotal}>
                <span className={styles.totalLabel}>Total</span>
                <span className={styles.totalValue}>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
