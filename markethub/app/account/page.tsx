"use client";

import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  User,
  ShoppingBag,
  Heart, 
  Camera, 
  ShieldCheck, 
  Bell, 
  LogOut,
  CheckCircle2,
  Package,
  Trash2,
  DollarSign,
  Tag
} from "lucide-react";
import Link from "next/link";
import { getOrders } from "@/lib/utils/orders";
import { getUserAvatar, saveUserAvatar, avatarFileToDataUrl } from "@/lib/utils/userProfile";
import { getUserProducts, deleteUserProduct, type UserProduct } from "@/lib/utils/userProducts";
import { notifyToast } from "@/components/ui/Toast";
import styles from "./page.module.css";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({ orders: 0, wishlist: 0 });
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);
  const [myProducts, setMyProducts] = useState<UserProduct[]>([]);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: ""
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/account");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      // Load saved profile details, falling back to session values
      let saved: { name?: string; phone?: string; bio?: string } = {};
      try {
        saved = JSON.parse(localStorage.getItem("mh_profile") || "{}");
      } catch { /* ignore corrupt data */ }

      setFormData({
        name: saved.name || session.user.name || "",
        email: session.user.email || "",
        phone: saved.phone || "",
        bio: saved.bio || ""
      });

      // Load stats
      const orders = getOrders();
      const userOrders = orders.filter(o => o.userId === session.user?.id || o.userId === "guest");
      
      // For wishlist, we'd normally get it from localStorage or API
      // Mirroring the logic from other pages
      const wishlistJson = typeof window !== 'undefined' ? localStorage.getItem('mh_wishlist') : null;
      const wishlistCount = wishlistJson ? JSON.parse(wishlistJson).length : 0;

      setStats({
        orders: userOrders.length,
        wishlist: wishlistCount
      });
    }
  }, [session]);

  // Load custom avatar
  useEffect(() => {
    setCustomAvatar(getUserAvatar());
    const handler = () => setCustomAvatar(getUserAvatar());
    window.addEventListener('mh_avatar_changed', handler);
    return () => window.removeEventListener('mh_avatar_changed', handler);
  }, []);

  // Load user products
  useEffect(() => {
    setMyProducts(getUserProducts());
    const handler = () => setMyProducts(getUserProducts());
    window.addEventListener('mh_products_changed', handler);
    return () => window.removeEventListener('mh_products_changed', handler);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    localStorage.setItem("mh_profile", JSON.stringify({
      name: formData.name,
      phone: formData.phone,
      bio: formData.bio,
    }));
    setIsSaving(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleAvatarClick = () => {
    avatarInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      notifyToast('Please select an image file.', 'error');
      return;
    }

    try {
      const dataUrl = await avatarFileToDataUrl(file);
      saveUserAvatar(dataUrl);
      setCustomAvatar(dataUrl);
      notifyToast('Avatar updated! 🎉', 'success');
    } catch {
      notifyToast('Failed to process avatar image.', 'error');
    }

    // Reset the input so the same file can be selected again
    if (avatarInputRef.current) avatarInputRef.current.value = '';
  };

  const handleDeleteProduct = (slug: string, name: string) => {
    deleteUserProduct(slug);
    setMyProducts(getUserProducts());
    notifyToast(`"${name}" removed from your listings.`, 'success');
  };

  const displayAvatar = customAvatar || session?.user?.image;

  if (status === "loading" || !session) {
    return (
      <div className={styles.accountPage}>
        <div className="container">
          <div className="skeleton" style={{ width: 200, height: 40, marginBottom: 40 }}></div>
          <div className={styles.accountGrid}>
            <div className="skeleton" style={{ height: 400, borderRadius: 16 }}></div>
            <div className="skeleton" style={{ height: 500, borderRadius: 16 }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.accountPage}>
      <div className="container">
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>My Account</h1>
          <p className={styles.pageSubtitle}>Manage your profile and account settings</p>
        </div>

        <div className={styles.accountGrid}>
          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.profileCard}>
              <div className={styles.avatarWrapper}>
                {displayAvatar ? (
                  <img src={displayAvatar} alt={session?.user?.name || "User"} className={styles.avatar} />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    <User size={48} />
                  </div>
                )}
                <button 
                  className={styles.editAvatarBtn} 
                  title="Change Avatar"
                  onClick={handleAvatarClick}
                >
                  <Camera size={16} />
                </button>
                <input 
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleAvatarChange}
                />
              </div>
              <h2 className={styles.userName}>{session?.user?.name}</h2>
              <p className={styles.userEmail}>{session?.user?.email}</p>

              <div className={styles.profileStats}>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>{stats.orders}</span>
                  <span className={styles.statLabel}>Orders</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>{stats.wishlist}</span>
                  <span className={styles.statLabel}>Wishlist</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>{myProducts.length}</span>
                  <span className={styles.statLabel}>Listings</span>
                </div>
              </div>

              <div className={styles.accountNav}>
                <Link href="/account" className={`${styles.navItem} ${styles.active}`}>
                  <User size={18} />
                  <span>Profile Information</span>
                </Link>
                <Link href="/orders" className={styles.navItem}>
                  <ShoppingBag size={18} />
                  <span>Order History</span>
                </Link>
                <Link href="/wishlist" className={styles.navItem}>
                  <Heart size={18} />
                  <span>My Wishlist</span>
                </Link>
                <Link href="/account/settings" className={styles.navItem}>
                  <ShieldCheck size={18} />
                  <span>Security</span>
                </Link>
                <Link href="/account/settings" className={styles.navItem}>
                  <Bell size={18} />
                  <span>Notifications</span>
                </Link>
                <button 
                  className={styles.navItem} 
                  style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer' }}
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className={styles.content}>
            <div className={styles.settingsCard}>
              <h2 className={styles.sectionTitle}>Profile Information</h2>
              <form onSubmit={handleSave} className={styles.settingsForm}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Full Name</label>
                    <input 
                      type="text" 
                      className={styles.input}
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Email Address</label>
                    <input 
                      type="email" 
                      className={styles.input}
                      value={formData.email}
                      disabled
                    />
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                      Email cannot be changed.
                    </span>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Phone Number</label>
                    <input 
                      type="text" 
                      className={styles.input}
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label className={styles.label}>About You</label>
                    <textarea 
                      className={styles.input}
                      style={{ height: '120px', padding: '12px' }}
                      value={formData.bio}
                      onChange={e => setFormData({...formData, bio: e.target.value})}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <button type="submit" className={styles.saveBtn} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                  {showSuccess && (
                    <div className={styles.successMsg}>
                      <CheckCircle2 size={16} />
                      <span>Profile updated successfully!</span>
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* My Products Dashboard */}
            <div className={styles.settingsCard} style={{ marginTop: 'var(--space-8)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                <h2 className={styles.sectionTitle} style={{ margin: 0 }}>
                  <Package size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                  My Products
                </h2>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                  {myProducts.length} {myProducts.length === 1 ? 'listing' : 'listings'}
                </span>
              </div>

              {myProducts.length === 0 ? (
                <div className={styles.emptyProducts}>
                  <Tag size={48} strokeWidth={1} style={{ color: 'var(--color-border)', marginBottom: 'var(--space-4)' }} />
                  <h3 style={{ color: 'var(--color-text-primary)', fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-2)' }}>
                    No listings yet
                  </h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', maxWidth: '360px', margin: '0 auto' }}>
                    Click the <strong>Sell</strong> button in the navigation bar to list your first product.
                  </p>
                </div>
              ) : (
                <div className={styles.productsList}>
                  {myProducts.map((product) => (
                    <div key={product.slug} className={styles.productItem}>
                      <div className={styles.productImage}>
                        {product.imageDataUrl ? (
                          <img src={product.imageDataUrl} alt={product.name} />
                        ) : (
                          <div className={styles.productImagePlaceholder}>
                            <Package size={24} />
                          </div>
                        )}
                      </div>
                      <div className={styles.productInfo}>
                        <h4 className={styles.productName}>{product.name}</h4>
                        <div className={styles.productMeta}>
                          <span className={styles.productCategory}>
                            <Tag size={12} />
                            {product.category}
                          </span>
                          <span className={styles.productPrice}>
                            <DollarSign size={12} />
                            {product.price.toFixed(2)}
                          </span>
                          <span className={styles.productDate}>
                            Listed {product.createdAt}
                          </span>
                        </div>
                        {product.description && (
                          <p className={styles.productDesc}>{product.description}</p>
                        )}
                      </div>
                      <button 
                        className={styles.deleteBtn}
                        onClick={() => handleDeleteProduct(product.slug, product.name)}
                        title="Remove listing"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.settingsCard} style={{ marginTop: 'var(--space-8)' }}>
              <h2 className={styles.sectionTitle}>Account Overview</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)' }}>
                Your account is currently in good standing. You joined MarketHub in April 2026.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
                <div style={{ background: 'var(--color-bg-elevated)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                  <h4 style={{ color: 'var(--color-text-primary)', marginBottom: '4px' }}>Membership</h4>
                  <p style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>Standard</p>
                </div>
                <div style={{ background: 'var(--color-bg-elevated)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                  <h4 style={{ color: 'var(--color-text-primary)', marginBottom: '4px' }}>MarketHub Points</h4>
                  <p style={{ color: 'var(--color-secondary)', fontWeight: 'bold' }}>1,250 PTS</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
