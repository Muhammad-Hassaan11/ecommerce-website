import Link from 'next/link'
import { ShoppingBag, ExternalLink, MessageCircle } from 'lucide-react'
import styles from './Footer.module.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={`container ${styles.inner}`}>

        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>
              <ShoppingBag size={18} strokeWidth={2.2} />
            </span>
            <span className={styles.logoText}>
              Market<span className={styles.logoAccent}>Hub</span>
            </span>
          </div>
          <p className={styles.tagline}>
            Discover products from the best independent vendors.
          </p>
        </div>

        {/* Links */}
        <nav className={styles.links} aria-label="Footer navigation">
          <div className={styles.linkGroup}>
            <h3 className={styles.groupTitle}>Shop</h3>
            <ul role="list">
              <li><Link href="/" className={styles.link}>All Products</Link></li>
              <li><Link href="/wishlist" className={styles.link}>My Wishlist</Link></li>
            </ul>
          </div>
          <div className={styles.linkGroup}>
            <h3 className={styles.groupTitle}>Vendors</h3>
            <ul role="list">
              <li><Link href="/vendors/techwave" className={styles.link}>TechWave</Link></li>
              <li><Link href="/vendors/sportsgear" className={styles.link}>SportsGear</Link></li>
              <li><Link href="/vendors/fitlife" className={styles.link}>FitLife</Link></li>
            </ul>
          </div>
        </nav>

        {/* Social */}
        <div className={styles.social}>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialBtn}
            aria-label="GitHub"
          >
            <ExternalLink size={18} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialBtn}
            aria-label="Twitter"
          >
            <MessageCircle size={18} />
          </a>
        </div>

      </div>

      {/* Bottom bar */}
      <div className={styles.bottom}>
        <div className="container">
          <p className={styles.copyright}>
            &copy; {year} MarketHub. All products sourced from trusted vendors.
          </p>
        </div>
      </div>
    </footer>
  )
}
