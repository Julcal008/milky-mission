import type { KeyboardEvent, MouseEvent } from 'react'

export type SatelliteSubsystemLayer = 'bus' | 'solar' | 'payload' | 'comms'

export interface SatelliteBusInteractiveProps {
  svgMarkup: string
  selectedLayer?: SatelliteSubsystemLayer
  onSelectLayer?: (layer: SatelliteSubsystemLayer) => void
  heading?: string
  groupLabel?: string
  layerLabels?: Partial<Record<SatelliteSubsystemLayer, string>>
  className?: string
}

const SUBSYSTEM_LAYERS: readonly SatelliteSubsystemLayer[] = ['bus', 'solar', 'payload', 'comms']

function isSubsystemLayer(val: string | null): val is SatelliteSubsystemLayer {
  return val === 'bus' || val === 'solar' || val === 'payload' || val === 'comms'
}

export function SatelliteBusInteractive({
  svgMarkup,
  selectedLayer,
  onSelectLayer,
  heading = 'SUBSYSTEM TELEMETRY BUS',
  groupLabel = 'Spacecraft subsystem layers',
  layerLabels,
  className = '',
}: SatelliteBusInteractiveProps) {
  const resolveLayerFromTarget = (target: EventTarget | null): SatelliteSubsystemLayer | null => {
    if (!(target instanceof Element)) return null
    const layerEl = target.closest('[data-layer], #bus, #solar, #payload, #comms')
    if (!layerEl) return null
    const attr = layerEl.getAttribute('data-layer') ?? layerEl.getAttribute('id')
    return isSubsystemLayer(attr) ? attr : null
  }

  const handleContainerClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!onSelectLayer) return
    const layer = resolveLayerFromTarget(event.target)
    if (layer) {
      onSelectLayer(layer)
    }
  }

  const handleContainerKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!onSelectLayer) return
    if (event.key === 'Enter' || event.key === ' ') {
      const layer = resolveLayerFromTarget(event.target)
      if (layer) {
        event.preventDefault()
        onSelectLayer(layer)
      }
    }
  }

  return (
    <div
      data-selected-layer={selectedLayer ?? 'none'}
      className={` relative flex w-full flex-col items-center justify-between overflow-hidden rounded-2xl border border-border bg-surface/90 p-4 sm:p-6 ${className}`}
    >
      <div className="flex w-full flex-wrap items-center justify-between gap-2 border-b border-border/70 pb-3">
        <span className="font-mono text-xs uppercase tracking-widest text-ink-2">{heading}</span>
        <div role="group" aria-label={groupLabel} className="flex flex-wrap items-center gap-1.5">
          {SUBSYSTEM_LAYERS.map((layer) => {
            const isSelected = selectedLayer === layer
            return (
              <button
                key={layer}
                type="button"
                onClick={() => onSelectLayer?.(layer)}
                aria-pressed={isSelected}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono text-xs uppercase transition-all duration-150 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ion ${
                  isSelected
                    ? 'border-ion bg-ion/20 text-ink font-semibold'
                    : 'border-border bg-bg/70 text-ink-2 hover:border-ion/60 hover:text-ink'
                }`}
              >
                <span aria-hidden="true">{isSelected ? '●' : '○'}</span>
                <span>{layerLabels?.[layer] ?? layer}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div
        onClick={handleContainerClick}
        onKeyDown={handleContainerKeyDown}
        className="relative my-2 flex aspect-[4/3] w-full max-w-2xl items-center justify-center [&_[data-layer]]:cursor-pointer [&_[data-layer]]:transition-opacity [&_[data-layer]]:duration-150 motion-reduce:[&_[data-layer]]:transition-none [&_[data-layer]:hover]:opacity-100 [&_[data-layer]:focus-visible]:outline-none [&_[data-layer]:focus-visible]:opacity-100 data-[selected-layer=bus]:[&_[data-layer]:not([data-layer=bus])]:opacity-40 data-[selected-layer=solar]:[&_[data-layer]:not([data-layer=solar])]:opacity-40 data-[selected-layer=payload]:[&_[data-layer]:not([data-layer=payload])]:opacity-40 data-[selected-layer=comms]:[&_[data-layer]:not([data-layer=comms])]:opacity-40"
        data-selected-layer={selectedLayer ?? 'none'}
        dangerouslySetInnerHTML={{ __html: svgMarkup }}
      />
    </div>
  )
}
