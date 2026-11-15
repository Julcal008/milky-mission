import { useState } from 'react'

export interface MissionMapLabels {
  swath?: string
  track?: string
  station?: string
}

export interface MissionMapProps {
  basinSrc?: string
  trackSrc?: string
  swathSrc?: string
  stationSrc?: string
  ariaLabel: string
  labels?: MissionMapLabels
  stationPosition?: { x: number; y: number }
  aspect?: string
  className?: string
}

export function MissionMap({
  basinSrc,
  trackSrc,
  swathSrc,
  stationSrc,
  ariaLabel,
  labels,
  stationPosition = { x: 50, y: 50 },
  aspect = 'aspect-[4/3]',
  className = '',
}: MissionMapProps) {
  const [showSwath, setShowSwath] = useState<boolean>(true)
  const [showTrack, setShowTrack] = useState<boolean>(true)
  const [showStation, setShowStation] = useState<boolean>(true)

  return (
    <figure
      aria-label={ariaLabel}
      className={`relative flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-surface/95 shadow-lg ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/80 bg-surface-2/80 px-4 py-2.5">
        <figcaption className="font-mono text-xs font-semibold uppercase tracking-wider text-ink">
          {ariaLabel}
        </figcaption>

        <div role="group" aria-label={ariaLabel} className="flex flex-wrap items-center gap-1.5">
          {swathSrc ? (
            <button
              type="button"
              onClick={() => setShowSwath((prev) => !prev)}
              aria-pressed={showSwath}
              className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-xs transition-colors duration-150 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ion ${
                showSwath
                  ? 'border-comms/60 bg-comms/15 text-comms'
                  : 'border-border bg-bg/60 text-ink-2'
              }`}
            >
              <span aria-hidden="true">{showSwath ? '■' : '□'}</span>
              <span>{labels?.swath ?? 'SWATH'}</span>
            </button>
          ) : null}

          {trackSrc ? (
            <button
              type="button"
              onClick={() => setShowTrack((prev) => !prev)}
              aria-pressed={showTrack}
              className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-xs transition-colors duration-150 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ion ${
                showTrack
                  ? 'border-milk-strong/60 bg-milk/15 text-milk-strong'
                  : 'border-border bg-bg/60 text-ink-2'
              }`}
            >
              <span aria-hidden="true">{showTrack ? '●' : '○'}</span>
              <span>{labels?.track ?? 'TRACK'}</span>
            </button>
          ) : null}

          {stationSrc ? (
            <button
              type="button"
              onClick={() => setShowStation((prev) => !prev)}
              aria-pressed={showStation}
              className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-xs transition-colors duration-150 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ion ${
                showStation
                  ? 'border-ion/60 bg-ion/15 text-ion'
                  : 'border-border bg-bg/60 text-ink-2'
              }`}
            >
              <span aria-hidden="true">{showStation ? '▲' : '△'}</span>
              <span>{labels?.station ?? 'GS'}</span>
            </button>
          ) : null}
        </div>
      </div>

      <div
        role="img"
        aria-label={ariaLabel}
        className={`relative w-full overflow-hidden bg-bg ${aspect}`}
      >
        {basinSrc ? (
          <img
            src={basinSrc}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-contain"
          />
        ) : null}

        {swathSrc && showSwath ? (
          <img
            src={swathSrc}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-contain transition-opacity duration-200 motion-reduce:transition-none"
          />
        ) : null}

        {trackSrc && showTrack ? (
          <img
            src={trackSrc}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-contain transition-opacity duration-200 motion-reduce:transition-none"
          />
        ) : null}

        {stationSrc && showStation ? (
          <div
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${stationPosition.x}%`, top: `${stationPosition.y}%` }}
          >
            <img src={stationSrc} alt="" aria-hidden="true" className="h-12 w-12 object-contain" />
          </div>
        ) : null}
      </div>
    </figure>
  )
}
