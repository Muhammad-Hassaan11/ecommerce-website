"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, Mail, Lock, Eye, EyeOff, User, AlertCircle, ArrowRight, Check } from "lucide-react";
import styles from "../login/page.module.css";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const allValid = Object.values(passwordChecks).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!allValid) {
      setError("Please meet all password requirements.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    // Simulate registration — in a real app, this would POST to an API
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // After successful registration, redirect to login
    router.push("/login?registered=true");
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logoArea}>
          <Link href="/" className={styles.logoLink}>
            <span className={styles.logoIcon}>
              <ShoppingBag size={22} strokeWidth={2.2} />
            </span>
            <span className={styles.logoText}>
              Market<span className={styles.logoAccent}>Hub</span>
            </span>
          </Link>
          <h1 className={styles.heading}>Create your account</h1>
          <p className={styles.subtitle}>Join MarketHub and start shopping</p>
        </div>

        {/* Error */}
        {error && (
          <div className={styles.errorBox}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.fieldGroup}>
            <label htmlFor="reg-name" className={styles.label}>Full name</label>
            <div className={styles.inputWrapper}>
              <input
                id="reg-name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.fieldInput}
                required
                autoComplete="name"
              />
              <User size={18} className={styles.inputIcon} />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="reg-email" className={styles.label}>Email address</label>
            <div className={styles.inputWrapper}>
              <input
                id="reg-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.fieldInput}
                required
                autoComplete="email"
              />
              <Mail size={18} className={styles.inputIcon} />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="reg-password" className={styles.label}>Password</label>
            <div className={styles.inputWrapper}>
              <input
                id="reg-password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.fieldInput}
                required
                autoComplete="new-password"
              />
              <Lock size={18} className={styles.inputIcon} />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Password strength indicators */}
            {password.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px' }}>
                {[
                  { key: 'length', label: 'At least 8 characters' },
                  { key: 'uppercase', label: 'One uppercase letter' },
                  { key: 'number', label: 'One number' },
                ].map(({ key, label }) => (
                  <div key={key} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: 'var(--text-xs)',
                    color: passwordChecks[key as keyof typeof passwordChecks]
                      ? 'var(--color-success)'
                      : 'var(--color-text-muted)',
                    transition: 'color 0.2s ease'
                  }}>
                    <Check size={14} />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="reg-confirm" className={styles.label}>Confirm password</label>
            <div className={styles.inputWrapper}>
              <input
                id="reg-confirm"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={styles.fieldInput}
                required
                autoComplete="new-password"
              />
              <Lock size={18} className={styles.inputIcon} />
            </div>
            {confirmPassword && password !== confirmPassword && (
              <span className={styles.fieldError}>Passwords do not match</span>
            )}
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? (
              <div className={styles.spinner}></div>
            ) : (
              <>
                Create Account
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <p className={styles.footer}>
          Already have an account?{" "}
          <Link href="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
