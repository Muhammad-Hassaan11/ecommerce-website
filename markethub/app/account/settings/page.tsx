"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  User, 
  ShoppingBag, 
  Heart, 
  ShieldCheck, 
  Bell, 
  LogOut,
  Lock,
  Globe,
  Smartphone,
  Monitor
} from "lucide-react";
import Link from "next/link";
import styles from "../page.module.css";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/account/settings");
    }
  }, [status, router]);

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
          <h1 className={styles.pageTitle}>Account Settings</h1>
          <p className={styles.pageSubtitle}>Security, notifications, and preferences</p>
        </div>

        <div className={styles.accountGrid}>
          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.profileCard}>
              <h2 className={styles.userName} style={{ marginTop: 0 }}>{session.user.name}</h2>
              <p className={styles.userEmail}>{session.user.email}</p>

              <div className={styles.accountNav}>
                <Link href="/account" className={styles.navItem}>
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
                <Link href="/account/settings" className={`${styles.navItem} ${styles.active}`}>
                  <ShieldCheck size={18} />
                  <span>Security & Settings</span>
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
              <h2 className={styles.sectionTitle}>
                <Lock size={20} style={{ marginRight: '8px' }} />
                Security
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                <div style={{ padding: 'var(--space-4)', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ color: 'var(--color-text-primary)' }}>Password</h4>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>Change your account password regularly.</p>
                  </div>
                  <button className="btn btn-secondary" style={{ fontSize: 'var(--text-xs)' }}>Update</button>
                </div>

                <div style={{ padding: 'var(--space-4)', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ color: 'var(--color-text-primary)' }}>Two-Factor Authentication</h4>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>Add an extra layer of security to your account.</p>
                  </div>
                  <button className="btn btn-secondary" style={{ fontSize: 'var(--text-xs)' }}>Enable</button>
                </div>
              </div>
            </div>

            <div className={styles.settingsCard} style={{ marginTop: 'var(--space-8)' }}>
              <h2 className={styles.sectionTitle}>
                <Bell size={20} style={{ marginRight: '8px' }} />
                Notifications
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {[
                  { title: "Order Updates", desc: "Get notified when your order status changes." },
                  { title: "Promotions & Offers", desc: "Receive updates about deals and sales." },
                  { title: "Account Activity", desc: "Notifications for logins and password changes." }
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ color: 'var(--color-text-primary)', fontSize: 'var(--text-base)' }}>{item.title}</h4>
                      <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>{item.desc}</p>
                    </div>
                    <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                      <input type="checkbox" defaultChecked={idx !== 1} style={{ opacity: 0, width: 0, height: 0 }} />
                      <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: idx !== 1 ? 'var(--color-accent)' : 'var(--color-border)', transition: '.4s', borderRadius: '34px' }}>
                        <span style={{ position: 'absolute', height: '18px', width: '18px', left: idx !== 1 ? '22px' : '3px', bottom: '3px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%' }}></span>
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.settingsCard} style={{ marginTop: 'var(--space-8)' }}>
              <h2 className={styles.sectionTitle}>Login History</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', background: 'var(--color-bg-elevated)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent)' }}>
                    <Monitor size={20} />
                  </div>
                  <div>
                    <h4 style={{ color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)' }}>Windows · Chrome</h4>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>New York, USA · Current session</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', background: 'var(--color-bg-elevated)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-secondary)' }}>
                    <Smartphone size={20} />
                  </div>
                  <div>
                    <h4 style={{ color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)' }}>iPhone 15 · Safari</h4>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>New York, USA · 2 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
