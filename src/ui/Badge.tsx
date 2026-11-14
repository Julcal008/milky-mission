/**
 * Badge primitive — status is never communicated by color alone:
 * every badge has a text label (and, in the app, an icon).
 */
import type { ReactNode } from 'react'
import { cx } from './cx'

type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info'

const tones: Record<Tone, string> = {
  neutral: 'border-border text-ink-2 bg-surface-2/60',
  success: 'border-success/40 text-success bg-success/10',
  warning: 'border-warning/40 text-warning bg-warning/10',
  danger: 'border-danger/40 text-danger bg-danger/10',
  info: 'border-ion/40 text-ion bg-ion/10',
}

export function Badge({
  children,
  tone = 'neutral',
  className,
}: {
  children: ReactNode
  tone?: Tone
  className?: string
}) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 text-[11px] font-medium tracking-wide',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
