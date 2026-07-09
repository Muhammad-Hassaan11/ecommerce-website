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
  Smartphone,
  Monitor
} from "lucide-react";
import Link from "next/link";
import { notifyToast } from "@/components/ui/Toast";
import styles from "../page.module.css";

const PREFS_KEY = "mh_notification_prefs";
const TWO_FA_KEY = "mh_two_factor_enabled";

const NOTIFICATION_OPTIONS = [
  { key: "orderUpdates", title: "Order Updates", desc: "Get notified when your order status changes." },
  { key: "promotions", title: "Promotions & Offers", desc: "Receive updates about deals and sales." },
  { key: "accountActivity", title: "Account Activity", desc: "Notifications for logins and password changes." },
] as const;

type PrefKey = typeof NOTIFICATION_OPTIONS[number]["key"];

const DEFAULT_PREFS: Record<PrefKey, boolean> = {
  orderUpdates: true,
  promotions: false,
  accountActivity: true,
};

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [prefs, setPrefs] = useState<Record<PrefKey, boolean>>(DEFAULT_PREFS);
  const [twoFactor, setTwoFactor] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: "", next: "", confirm: "" });
  const [passwordSaving, setPasswordSaving] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/account/settings");
    }
  }, [status, router]);

  // Load persisted preferences
  useEffect(() => {
    try {
      const raw = localStorage.getItem(PREFS_KEY);
      if (raw) setPrefs({ ...DEFAULT_PREFS, ...JSON.parse(raw) });
      setTwoFactor(localStorage.getItem(TWO_FA_KEY) === "true");
    } catch { /* keep defaults */ }
  }, []);

  const togglePref = (key: PrefKey) => {
    setPrefs((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem(PREFS_KEY, JSON.stringify(next));
      return next;
    });
  };

  const toggleTwoFactor = () => {
    const next = !twoFactor;
    setTwoFactor(next);
    localStorage.setItem(TWO_FA_KEY, String(next));
    notifyToast(next ? "Two-factor authentication enabled." : "Two-factor authentication disabled.", "success");
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.next !== passwordForm.confirm) {
      notifyToast("New passwords do not match.", "error");
      return;
    }
    setPasswordSaving(true);
    try {
      const res = await fetch("/api/account/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.current,
          newPassword: passwordForm.next,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        notifyToast(data.error || "Failed to update password.", "error");
      } else {
        notifyToast("Password updated successfully! 🔒", "success");
        setPasswordForm({ current: "", next: "", confirm: "" });
        setShowPasswordForm(false);
      }
    } catch {
      notifyToast("Something went wrong. Please try again.", "error");
    }
    setPasswordSaving(false);
  };

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

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "var(--radius-md)",
    border: "1px solid var(--color-border)",
    background: "var(--color-bg-elevated)",
    color: "var(--color-text-primary)",
    fontSize: "var(--text-sm)",
  };

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
                <div style={{ padding: 'var(--space-4)', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ color: 'var(--color-text-primary)' }}>Password</h4>
                      <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>Change your account password regularly.</p>
                    </div>
                    <button
                      className="btn btn-secondary"
                      style={{ fontSize: 'var(--text-xs)' }}
                      onClick={() => setShowPasswordForm(!showPasswordForm)}
                    >
                      {showPasswordForm ? "Cancel" : "Update"}
                    </button>
                  </div>

                  {showPasswordForm && (
                    <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
                      <input
                        type="password"
                        placeholder="Current password"
                        style={inputStyle}
                        value={passwordForm.current}
                        onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                        required
                        autoComplete="current-password"
                      />
                      <input
                        type="password"
                        placeholder="New password (8+ chars, 1 uppercase, 1 number)"
                        style={inputStyle}
                        value={passwordForm.next}
                        onChange={(e) => setPasswordForm({ ...passwordForm, next: e.target.value })}
                        required
                        autoComplete="new-password"
                      />
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        style={inputStyle}
                        value={passwordForm.confirm}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                        required
                        autoComplete="new-password"
                      />
                      <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', fontSize: 'var(--text-xs)' }} disabled={passwordSaving}>
                        {passwordSaving ? "Saving..." : "Save New Password"}
                      </button>
                    </form>
                  )}
                </div>

                <div style={{ padding: 'var(--space-4)', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ color: 'var(--color-text-primary)' }}>Two-Factor Authentication</h4>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
                      {twoFactor ? "Two-factor authentication is active on your account." : "Add an extra layer of security to your account."}
                    </p>
                  </div>
                  <button className="btn btn-secondary" style={{ fontSize: 'var(--text-xs)' }} onClick={toggleTwoFactor}>
                    {twoFactor ? "Disable" : "Enable"}
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.settingsCard} style={{ marginTop: 'var(--space-8)' }}>
              <h2 className={styles.sectionTitle}>
                <Bell size={20} style={{ marginRight: '8px' }} />
                Notifications
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {NOTIFICATION_OPTIONS.map(({ key, title, desc }) => {
                  const on = prefs[key];
                  return (
                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ color: 'var(--color-text-primary)', fontSize: 'var(--text-base)' }}>{title}</h4>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>{desc}</p>
                      </div>
                      <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                        <input
                          type="checkbox"
                          checked={on}
                          onChange={() => togglePref(key)}
                          style={{ opacity: 0, width: 0, height: 0 }}
                        />
                        <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: on ? 'var(--color-accent)' : 'var(--color-border)', transition: '.3s', borderRadius: '34px' }}>
                          <span style={{ position: 'absolute', height: '18px', width: '18px', left: on ? '22px' : '3px', bottom: '3px', backgroundColor: 'white', transition: '.3s', borderRadius: '50%' }}></span>
                        </span>
                      </label>
                    </div>
                  );
                })}
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
                    <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>Current session</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', background: 'var(--color-bg-elevated)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-secondary)' }}>
                    <Smartphone size={20} />
                  </div>
                  <div>
                    <h4 style={{ color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)' }}>Mobile · Safari</h4>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>2 hours ago</p>
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
