/**
 * Animated menu backdrop ported from the solarpunk prototype.
 * Owner: Track B (Experience).
 *
 * Decorative only: aria-hidden, pointer-events-none, reduced-motion aware.
 * Positions are percentages so the scene scales with the hero.
 */
import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import './menu-background.css'

interface Orb {
  id: string
  x: string
  y: string
  size: string
  depth: number
  duration: string
  dx: string
  dy: string
  color: string
  ring?: boolean
}

const ORBS: Orb[] = [
  {
    id: 'indigo',
    x: '84%',
    y: '6%',
    size: '78px',
    depth: 0.5,
    duration: '16s',
    dx: '-18px',
    dy: '14px',
    color: 'var(--color-indigo)',
    ring: true,
  },
  {
    id: 'jade',
    x: '5%',
    y: '24%',
    size: '64px',
    depth: 0.8,
    duration: '13s',
    dx: '14px',
    dy: '-18px',
    color: 'var(--color-jade)',
  },
  {
    id: 'plum',
    x: '88%',
    y: '44%',
    size: '70px',
    depth: 0.6,
    duration: '18s',
    dx: '-12px',
    dy: '-16px',
    color: 'var(--color-plum)',
    ring: true,
  },
  {
    id: 'cream',
    x: '26%',
    y: '58%',
    size: '52px',
    depth: 1,
    duration: '11s',
    dx: '18px',
    dy: '12px',
    color: 'var(--color-cream)',
  },
  {
    id: 'mauve',
    x: '70%',
    y: '68%',
    size: '40px',
    depth: 1.2,
    duration: '12s',
    dx: '-14px',
    dy: '10px',
    color: 'var(--color-mauve)',
  },
  {
    id: 'coral',
    x: '44%',
    y: '36%',
    size: '44px',
    depth: 0.4,
    duration: '20s',
    dx: '16px',
    dy: '-10px',
    color: 'var(--color-coral)',
    ring: true,
  },
]

/** Deterministic starfield: the scene is decorative but should not flicker on re-render. */
function createStars(count: number) {
  let seed = 20261114
  const random = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296
    return seed / 4294967296
  }

  return Array.from({ length: count }, (_, id) => ({
    id,
    x: random() * 100,
    y: random() * 100,
    size: random() * 2.2 + 0.8,
    duration: random() * 4 + 2,
    delay: -random() * 6,
  }))
}

const STARS = createStars(140)

export function MenuBackground() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const onMove = (event: PointerEvent) => {
      node.style.setProperty('--px', ((event.clientX / window.innerWidth - 0.5) * 40).toFixed(1))
      node.style.setProperty('--py', ((event.clientY / window.innerHeight - 0.5) * 40).toFixed(1))
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <div ref={ref} className="menu-bg" aria-hidden="true">
      {STARS.map((star) => (
        <span
          key={star.id}
          className="menu-bg__star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}

      <div className="menu-bg__moon" />

      {ORBS.map((orb) => (
        <div
          key={orb.id}
          className={orb.ring ? 'menu-bg__orb menu-bg__orb--ring' : 'menu-bg__orb'}
          style={
            {
              '--x': orb.x,
              '--y': orb.y,
              '--s': orb.size,
              '--d': orb.depth,
              '--dur': orb.duration,
              '--dx': orb.dx,
              '--dy': orb.dy,
              '--orb': orb.color,
            } as CSSProperties
          }
        >
          <span />
        </div>
      ))}

      <svg
        className="menu-bg__sat"
        viewBox="0 0 120 80"
        style={
          { '--x': '2%', '--y': '76%', '--s': '130px', '--d': 1.1, '--dur': '15s' } as CSSProperties
        }
      >
        <use href="#menu-bg-sat" />
      </svg>

      <div className="menu-bg__earth">
        <span />
      </div>

      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <symbol id="menu-bg-sat" viewBox="0 0 120 80">
          <rect
            x="3"
            y="28"
            width="36"
            height="24"
            rx="3"
            fill="var(--color-indigo)"
            stroke="var(--color-cream)"
            strokeWidth="2"
          />
          <rect
            x="81"
            y="28"
            width="36"
            height="24"
            rx="3"
            fill="var(--color-indigo)"
            stroke="var(--color-cream)"
            strokeWidth="2"
          />
          <rect x="39" y="38" width="42" height="4" fill="var(--color-mauve)" />
          <rect
            x="40"
            y="24"
            width="40"
            height="32"
            rx="12"
            fill="var(--color-cream)"
            stroke="var(--color-coral)"
            strokeWidth="2"
          />
          <circle
            cx="60"
            cy="40"
            r="7"
            fill="var(--color-jade)"
            stroke="var(--color-cream)"
            strokeWidth="2"
          />
          <path
            d="M60 24C48 6 70 -2 84 4 84 18 74 24 60 24Z"
            fill="var(--color-jade)"
            stroke="var(--color-indigo)"
            strokeWidth="2"
          />
        </symbol>
      </svg>
    </div>
  )
}
