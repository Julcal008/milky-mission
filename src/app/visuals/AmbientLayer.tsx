import { useEffect, useRef } from 'react'
import { visualUrl } from './assets'
import { useMediaQuery } from './useMediaQuery'
import { useReducedMotion } from './useReducedMotion'

/**
 * Ambient backdrop for the report screens only.
 * Animated on desktop; static on mobile and with reduced motion.
 * The cursor parallax writes CSS variables through a ref, so it never
 * re-renders the report on pointer movement.
 * Owner: Track B.
 */
export function AmbientLayer() {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const compact = useMediaQuery('(max-width: 640px)')
  const parallaxEnabled = !reduced && !compact

  useEffect(() => {
    const element = ref.current
    if (!element) {
      return
    }

    if (!parallaxEnabled) {
      element.style.setProperty('--px', '0')
      element.style.setProperty('--py', '0')
      return
    }

    let frame = 0
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        const x = (event.clientX / window.innerWidth - 0.5) * 2
        const y = (event.clientY / window.innerHeight - 0.5) * 2
        element.style.setProperty('--px', x.toFixed(3))
        element.style.setProperty('--py', y.toFixed(3))
      })
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
    }
  }, [parallaxEnabled])

  const aurora = reduced || compact ? 'shared/aurora.webp' : 'shared/aurora.svg'
  const starfield = reduced || compact ? 'shared/starfield.webp' : 'shared/starfield.svg'

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <img
        src={visualUrl(starfield)}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-70 transition-transform duration-300 ease-out motion-reduce:transition-none"
        style={{
          transform:
            'translate3d(calc(var(--px, 0) * -14px), calc(var(--py, 0) * -14px), 0) scale(1.04)',
        }}
        decoding="async"
      />
      <img
        src={visualUrl(aurora)}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-60 mix-blend-screen transition-transform duration-500 ease-out motion-reduce:transition-none"
        style={{
          transform:
            'translate3d(calc(var(--px, 0) * -26px), calc(var(--py, 0) * -26px), 0) scale(1.06)',
        }}
        decoding="async"
      />
      <div
        className="absolute inset-0 flex items-center justify-center opacity-25 transition-transform duration-300 ease-out motion-reduce:transition-none"
        style={{
          transform: 'translate3d(calc(var(--px, 0) * 18px), calc(var(--py, 0) * 18px), 0)',
        }}
      >
        <div className="h-96 w-96 rounded-full border border-border/50" />
        <div className="absolute h-64 w-64 rounded-full border border-dashed border-ion/30" />
      </div>
      <div
        className="absolute inset-0 opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage: `url(${visualUrl('shared/grain.png')})`,
          backgroundRepeat: 'repeat',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-bg/20 via-transparent to-bg" />
    </div>
  )
}
