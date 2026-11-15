/**
 * Decorative AI-illustrated backdrop with a visible provenance badge.
 * Owner: Track B. Text and controls always sit above the image.
 */
import type { ReactNode } from 'react'
import { cx } from '@/ui/cx'
import { visualUrl } from './assets'
import { AiArtBadge } from './AiArtBadge'

export function AiBackdrop({
  file,
  children,
  className,
  opacity = 0.4,
}: {
  file: string
  children: ReactNode
  className?: string
  opacity?: number
}) {
  return (
    <div className={cx('relative isolate overflow-hidden', className)}>
      <img
        src={visualUrl(file)}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover mix-blend-screen"
        style={{ opacity }}
        loading="lazy"
        decoding="async"
      />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-bg/20 via-bg/50 to-bg/90" />
      {/* Faint diagonal watermark keeps the provenance visible over the full image. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center overflow-hidden"
      >
        <span className="rotate-[-24deg] text-5xl font-semibold uppercase tracking-[0.5em] text-ink/5">
          AI
        </span>
      </div>
      <div className="relative z-10">
        <div className="flex justify-end px-3 pt-3">
          <AiArtBadge />
        </div>
        {children}
      </div>
    </div>
  )
}
