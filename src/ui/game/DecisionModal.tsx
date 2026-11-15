/**
 * Decision modal for the simulation playback.
 * Owner: Track A (UI sprint).
 *
 * The modal lives inside the simulation flow (portal to body so it is never
 * clipped) and is deliberately not dismissible: the clock only resumes after a
 * choice or an explicit acknowledgement.
 */
import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AiArtBadge } from '@/app/visuals/AiArtBadge'
import { visualUrl } from '@/app/visuals/assets'
import { Badge } from '@/ui/Badge'
import { Button } from '@/ui/Button'

export interface DecisionModalOption {
  id: string
  label: string
  description: string
  costUsdM?: number
}

export interface DecisionModalProps {
  dayLabel: string
  eventTitle: string
  roleLabel: string
  severityLabel: string
  tone: 'danger' | 'warning' | 'info'
  options: DecisionModalOption[]
  appliedOptionId?: string
  labels: {
    title: string
    paused: string
    continueLabel: string
    applied: string
  }
  onChoose: (optionId: string) => void
  onContinue: () => void
}

export function DecisionModal({
  dayLabel,
  eventTitle,
  roleLabel,
  severityLabel,
  tone,
  options,
  appliedOptionId,
  labels,
  onChoose,
  onContinue,
}: DecisionModalProps) {
  const titleId = useId()
  const pausedId = useId()
  const cardRef = useRef<HTMLDivElement>(null)
  const isAlert = options.length === 0

  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const bodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const focusables = () =>
      Array.from(
        cardRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      )

    focusables()[0]?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') {
        return
      }
      const items = focusables()
      if (items.length === 0) {
        event.preventDefault()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = bodyOverflow
      previous?.focus()
    }
  }, [])

  return createPortal(
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-bg/80 p-4 backdrop-blur-sm">
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={pausedId}
        tabIndex={-1}
        className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
      >
        <img
          src={visualUrl('simulate/decision-modal-bg.webp')}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg/30 via-bg/70 to-bg" />

        <div className="relative z-10 max-h-[min(88vh,44rem)] space-y-4 overflow-y-auto p-5 sm:p-6">
          <div className="flex justify-end">
            <AiArtBadge />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={tone}>{severityLabel}</Badge>
            <span className="label-caps text-ink-3">{dayLabel}</span>
            <span className="label-caps text-ink-3">{roleLabel}</span>
          </div>

          <div className="space-y-1">
            <h2 id={titleId} className="font-display text-2xl font-semibold text-ink">
              {labels.title}
            </h2>
            <p id={pausedId} className="text-[12px] leading-relaxed text-ink-2">
              {labels.paused}
            </p>
          </div>

          <p className="text-[15px] font-medium leading-snug text-ink">{eventTitle}</p>

          {isAlert ? (
            <Button variant="primary" onClick={onContinue} className="w-full">
              {labels.continueLabel}
            </Button>
          ) : (
            <div className="space-y-2">
              {options.map((option) => {
                const applied = appliedOptionId === option.id
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => onChoose(option.id)}
                    className={[
                      'w-full rounded-lg border p-3 text-left transition-colors',
                      applied
                        ? 'border-jade/60 bg-jade/10'
                        : 'border-border bg-surface-2/70 hover:border-border-strong hover:bg-surface-2',
                    ].join(' ')}
                  >
                    <span className="flex items-start justify-between gap-2">
                      <span className="text-[13px] font-medium text-ink">{option.label}</span>
                      <span className="flex shrink-0 items-center gap-1">
                        {option.costUsdM ? <Badge tone="warning">${option.costUsdM}M</Badge> : null}
                        {applied ? <Badge tone="success">{labels.applied}</Badge> : null}
                      </span>
                    </span>
                    <span className="mt-1 block text-[11px] leading-relaxed text-ink-2">
                      {option.description}
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
