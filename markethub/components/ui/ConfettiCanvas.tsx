'use client'

import { useEffect, useRef } from 'react'

/* ── Pastel palette tuned for visibility on dark backgrounds ── */
const COLORS = [
  'hsla(330, 80%, 75%,',   // pink
  'hsla(50,  85%, 72%,',   // yellow
  'hsla(155, 60%, 68%,',   // mint
  'hsla(270, 65%, 75%,',   // lavender
  'hsla(200, 70%, 72%,',   // sky blue
  'hsla(15,  80%, 74%,',   // peach
]

type ShapeKind = 'circle' | 'square' | 'star'

interface Particle {
  x: number
  y: number
  size: number
  speedY: number
  speedX: number
  opacity: number
  color: string
  shape: ShapeKind
  rotation: number
  rotationSpeed: number
}

/* ── Draw a 5-pointed star path ── */
function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
) {
  const spikes = 5
  let rot = (Math.PI / 2) * 3
  const step = Math.PI / spikes

  ctx.beginPath()
  ctx.moveTo(cx, cy - outerR)

  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(
      cx + Math.cos(rot) * outerR,
      cy + Math.sin(rot) * outerR,
    )
    rot += step
    ctx.lineTo(
      cx + Math.cos(rot) * innerR,
      cy + Math.sin(rot) * innerR,
    )
    rot += step
  }

  ctx.lineTo(cx, cy - outerR)
  ctx.closePath()
}

/* ── Create a single particle ── */
function createParticle(w: number, h: number, startRandom = true): Particle {
  const shapes: ShapeKind[] = ['circle', 'square', 'star']
  return {
    x: Math.random() * w,
    y: startRandom ? Math.random() * h : -20,
    size: 3 + Math.random() * 5,                        // 3 – 8 px
    speedY: 0.15 + Math.random() * 0.35,                // very slow fall
    speedX: (Math.random() - 0.5) * 0.3,                // gentle sway
    opacity: 0.15 + Math.random() * 0.1,                // 0.15 – 0.25
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    shape: shapes[Math.floor(Math.random() * shapes.length)],
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.01,
  }
}

export default function ConfettiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let particles: Particle[] = []

    /* ── Resize handler ── */
    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener('resize', resize)

    /* ── Seed particles (60-70) ── */
    const count = 60 + Math.floor(Math.random() * 11)
    for (let i = 0; i < count; i++) {
      particles.push(createParticle(window.innerWidth, window.innerHeight, true))
    }

    /* ── Render loop ── */
    const render = () => {
      const w = window.innerWidth
      const h = window.innerHeight

      ctx.clearRect(0, 0, w, h)

      for (const p of particles) {
        /* update position */
        p.y += p.speedY
        p.x += p.speedX
        p.rotation += p.rotationSpeed

        /* wrap around when off-screen */
        if (p.y > h + 20) {
          Object.assign(p, createParticle(w, h, false))
        }
        if (p.x < -20) p.x = w + 10
        if (p.x > w + 20) p.x = -10

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.fillStyle = `${p.color}${p.opacity})`

        switch (p.shape) {
          case 'circle':
            ctx.beginPath()
            ctx.arc(0, 0, p.size, 0, Math.PI * 2)
            ctx.fill()
            break

          case 'square':
            ctx.fillRect(-p.size, -p.size, p.size * 2, p.size * 2)
            break

          case 'star':
            drawStar(ctx, 0, 0, p.size, p.size * 0.45)
            ctx.fill()
            break
        }

        ctx.restore()
      }

      animId = requestAnimationFrame(render)
    }

    animId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}
