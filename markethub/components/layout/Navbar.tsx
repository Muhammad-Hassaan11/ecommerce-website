'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingBag, Heart, Search, Menu, Tag } from 'lucide-react'
import CartButton from '@/components/cart/CartButton'
import UserMenu from '@/components/auth/UserMenu'
import SellModal from '@/components/ui/SellModal'
import MobileMenu from './MobileMenu'
import ThemeToggle from './ThemeToggle'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [sellModalOpen, setSellModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = searchQuery.trim()
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`)
      setSearchQuery('')
      setSearchOpen(false)
    }
  }

  const handleOpenSellModal = () => {
    setSellModalOpen(true)
  }

  return (
    <>
      <header className={styles.header} role="banner">
        <nav className={styles.nav} aria-label="Main navigation">
          <div className={`container ${styles.inner}`}>

            {/* Hamburger (mobile) */}
            <button
              className={`btn btn-icon ${styles.hamburger}`}
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} strokeWidth={2} />
            </button>

            {/* Logo */}
            <Link href="/" className={styles.logo} aria-label="MarketHub home">
              <span className={styles.logoIcon}>
                <ShoppingBag size={22} strokeWidth={2.2} />
              </span>
              <span className={styles.logoText}>
                Market<span className={styles.logoAccent}>Hub</span>
              </span>
            </Link>

            {/* Nav Links (desktop) */}
            <ul className={styles.links} role="list">
              <li>
                <Link href="/" className={styles.link}>
                  Browse
                </Link>
              </li>
              <li>
                <Link href="/best-sellers" className={styles.link}>
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className={styles.link}>
                  <Heart size={16} strokeWidth={2} aria-hidden="true" />
                  Wishlist
                </Link>
              </li>
              <li>
                <Link href="/support" className={styles.link}>
                  Support
                </Link>
              </li>
              <li>
                <button
                  className={`btn btn-primary ${styles.sellBtn}`}
                  onClick={handleOpenSellModal}
                >
                  <Tag size={16} strokeWidth={2} />
                  Sell
                </button>
              </li>
            </ul>

            {/* Right actions */}
            <div className={styles.actions}>
              {/* Search toggle */}
              <button
                className={`btn btn-icon ${styles.searchToggle}`}
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label={searchOpen ? 'Close search' : 'Open search'}
                aria-expanded={searchOpen}
              >
                <Search size={20} strokeWidth={2} />
              </button>

              <ThemeToggle />

              <UserMenu />
              <CartButton />
            </div>


          </div>
        </nav>

        {/* Expandable search bar */}
        <div className={`${styles.searchBar} ${searchOpen ? styles.searchBarOpen : ''}`}>
          <form onSubmit={handleSearch} className={`container ${styles.searchForm}`}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search products, categories, vendors..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={styles.searchInput}
              autoFocus={searchOpen}
            />
            <button type="submit" className={`btn btn-primary ${styles.searchSubmit}`}>
              Search
            </button>
          </form>
        </div>
      </header>

      {/* Mobile menu */}
      <MobileMenu
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onOpenSellModal={handleOpenSellModal}
      />

      {/* Sell product modal */}
      <SellModal isOpen={sellModalOpen} onClose={() => setSellModalOpen(false)} />
    </>
  )
}
