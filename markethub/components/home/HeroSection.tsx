'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import styles from './HeroSection.module.css'

const DOTS = [
  { top: '18%', left: '58%', delay: '0s' },
  { top: '64%', left: '70%', delay: '0.9s' },
  { top: '30%', left: '84%', delay: '1.7s' },
  { top: '72%', left: '48%', delay: '2.4s' },
  { top: '14%', left: '38%', delay: '3.1s' },
]

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null)
  const spotlightRef = useRef<HTMLDivElement>(null)
  const orbARef = useRef<HTMLDivElement>(null)
  const orbBRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    if (reducedMotion.matches || !finePointer.matches) return

    // Animation state lives outside React — direct transform writes on
    // composited layers avoid re-renders and layout work entirely.
    let rafId = 0
    let running = false
    const target = { x: 0, y: 0 }
    const current = { x: 0, y: 0 }

    const tick = () => {
      current.x += (target.x - current.x) * 0.12
      current.y += (target.y - current.y) * 0.12

      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`
      }
      // Parallax: orbs shift a few px opposite the cursor, at different depths
      const rect = hero.getBoundingClientRect()
      const nx = current.x / rect.width - 0.5
      const ny = current.y / rect.height - 0.5
      if (orbARef.current) {
        orbARef.current.style.translate = `${nx * -36}px ${ny * -24}px`
      }
      if (orbBRef.current) {
        orbBRef.current.style.translate = `${nx * 22}px ${ny * 16}px`
      }

      // Stop the loop once we've settled on the target (saves CPU when idle)
      if (Math.abs(target.x - current.x) > 0.5 || Math.abs(target.y - current.y) > 0.5) {
        rafId = requestAnimationFrame(tick)
      } else {
        running = false
      }
    }

    const onPointerMove = (e: PointerEvent) => {
      const rect = hero.getBoundingClientRect()
      target.x = e.clientX - rect.left
      target.y = e.clientY - rect.top
      if (!running) {
        running = true
        rafId = requestAnimationFrame(tick)
      }
    }

    hero.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => {
      hero.removeEventListener('pointermove', onPointerMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <header ref={heroRef} className={styles.hero}>
      <div ref={orbARef} className={`${styles.orb} ${styles.orbA}`} aria-hidden="true" />
      <div ref={orbBRef} className={`${styles.orb} ${styles.orbB}`} aria-hidden="true" />
      <div className={`${styles.orb} ${styles.orbC}`} aria-hidden="true" />
      <div ref={spotlightRef} className={styles.spotlight} aria-hidden="true" />
      {DOTS.map((dot, i) => (
        <span
          key={i}
          className={styles.dot}
          style={{ top: dot.top, left: dot.left, animationDelay: dot.delay }}
          aria-hidden="true"
        />
      ))}

      <div className={styles.heroInner}>
        <h1 className={styles.title}>
          Discover Products <span className={styles.accent}>You&#39;ll Love</span>
        </h1>
        <p className={styles.subtitle}>
          Curated collections from the world&#39;s best independent creators.
        </p>
        <div className={styles.ctaRow}>
          <Link href="/best-sellers" className="btn btn-primary">
            Shop Best Sellers
          </Link>
          <Link href="/vendors" className="btn btn-secondary">
            Meet the Vendors
          </Link>
        </div>
      </div>
    </header>
  )
}
