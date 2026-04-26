"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { User, LogOut, FileText, Settings, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import styles from "./UserMenu.module.css";

export default function UserMenu() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (status === "loading") {
    return <div className={styles.skeleton}></div>;
  }

  if (!session?.user) {
    return (
      <Link href="/login" className={styles.loginBtn}>
        Sign In
      </Link>
    );
  }

  return (
    <div className={styles.userMenu} ref={menuRef}>
      <button 
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className={styles.avatar}>
          {session.user.image ? (
            <img src={session.user.image} alt={session.user.name || "User"} />
          ) : (
            <User size={18} />
          )}
        </div>
        <span className={styles.name}>{session.user.name?.split(' ')[0] || "User"}</span>
        <ChevronDown size={14} className={`${styles.chevron} ${isOpen ? styles.open : ""}`} />
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.userInfo}>
            <p className={styles.fullName}>{session.user.name}</p>
            <p className={styles.email}>{session.user.email}</p>
          </div>
          <div className={styles.divider}></div>
          <Link href="/account" className={styles.dropdownItem} onClick={() => setIsOpen(false)}>
            <User size={16} />
            <span>My Account</span>
          </Link>
          <Link href="/orders" className={styles.dropdownItem} onClick={() => setIsOpen(false)}>
            <FileText size={16} />
            <span>Order History</span>
          </Link>
          <Link href="/account/settings" className={styles.dropdownItem} onClick={() => setIsOpen(false)}>
            <Settings size={16} />
            <span>Settings</span>
          </Link>
          <div className={styles.divider}></div>
          <button 
            className={`${styles.dropdownItem} ${styles.logoutBtn}`}
            onClick={() => {
              setIsOpen(false);
              signOut({ callbackUrl: '/' });
            }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
}
