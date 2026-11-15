import { AiArtBadge } from '@/app/visuals/AiArtBadge'

export interface MissionCardProps {
  title: string
  subtitle: string
  score: number
  grade: string
  max?: number
  telemetryLabel?: string
  backgroundSrc?: string
  className?: string
}

export function MissionCard({
  title,
  subtitle,
  score,
  grade,
  max = 100,
  telemetryLabel,
  backgroundSrc,
  className = '',
}: MissionCardProps) {
  const safeMax = max > 0 ? max : 100
  const clampedScore = Math.min(safeMax, Math.max(0, Math.round(score)))
  const percentage = Math.round((clampedScore / safeMax) * 100)

  return (
    <article
      aria-label={title}
      className={`group relative flex aspect-video w-full max-w-xl flex-col justify-between overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-xl ${className}`}
    >
      {backgroundSrc ? (
        <img
          src={backgroundSrc}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-55 transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      ) : null}
      {backgroundSrc ? (
        <AiArtBadge className="absolute right-3 top-1/2 z-20 -translate-y-1/2" />
      ) : null}

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="font-sans text-2xl font-bold tracking-tight text-ink">{title}</h3>
          <p className="font-sans text-sm text-ink-2">{subtitle}</p>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-milk-strong/60 bg-surface-2/90 font-mono text-xl font-bold text-milk-strong shadow-sm">
          {grade}
        </div>
      </div>

      <div className="relative z-10 mt-6 flex flex-col gap-2 rounded-xl border border-border/80 bg-bg/75 p-3.5">
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-mono text-xs uppercase tracking-widest text-ion">
            {telemetryLabel ?? 'MISSION TELEMETRY INDEX'}
          </span>
          <span className="font-mono text-2xl font-bold text-milk-strong">
            {clampedScore}
            <span className="text-xs font-normal text-ink-2"> / {safeMax}</span>
          </span>
        </div>

        <div
          role="meter"
          aria-label={title}
          aria-valuenow={clampedScore}
          aria-valuemin={0}
          aria-valuemax={safeMax}
          className="h-2 w-full overflow-hidden rounded-full border border-border bg-surface"
        >
          <div
            style={{ width: `${percentage}%` }}
            className="h-full rounded-full bg-milk-strong transition-all duration-300 ease-out motion-reduce:transition-none"
          />
        </div>
      </div>
    </article>
  )
}
