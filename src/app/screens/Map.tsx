/**
 * Coverage map — visual, read-only.
 * Owner: Track B (Experience). It reads the current config and catalog values;
 * it never changes the mission.
 */
import { MissionMap } from '@/app/visuals/generated/MissionMap'
import { MaskIcon } from '@/app/visuals/MaskIcon'
import { ReportFrame } from '@/app/visuals/ReportFrame'
import { StatBlock } from '@/app/visuals/generated/StatBlock'
import { visualUrl } from '@/app/visuals/assets'
import { useReducedMotion } from '@/app/visuals/useReducedMotion'
import { catalogs } from '@/data/catalogs'
import { useMissionStore } from '@/store/mission'
import { useI18n } from '@/store/ui'
import { Button } from '@/ui/Button'
import { Panel } from '@/ui/Panel'

export function MapScreen() {
  const { t } = useI18n()
  const reducedMotion = useReducedMotion()
  const config = useMissionStore((state) => state.config)

  if (!config) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <h1 className="font-display text-3xl font-semibold text-ink">{t.ops.map.title}</h1>
        <Panel className="space-y-4 p-6">
          <p className="text-[13px] text-ink-2">{t.ops.simulate.completeDesign}</p>
          <Button variant="primary" onClick={() => (window.location.hash = '#/design')}>
            {t.game.design.title}
          </Button>
        </Panel>
      </div>
    )
  }

  const scenarioKey = config.scenarioId === 'storm-watch' ? 'storm' : 'andes'
  const targetKey = scenarioKey === 'storm' ? 'targetStorm' : 'targetAndes'
  const orbit = catalogs.orbits.find((item) => item.id === config.orbitId)

  return (
    <ReportFrame>
      <div className="space-y-5">
        <header className="space-y-2">
          <p className="label-caps text-ink-3">{t.ops.map.title}</p>
          <h1 className="font-display text-3xl font-semibold text-ink">{t.ops.map.title}</h1>
          <p className="text-[13px] text-ink-2">{t.ops.map.lead}</p>
        </header>

        <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
          <MissionMap
            basinSrc={visualUrl('map/colombia-basin.svg')}
            swathSrc={visualUrl(reducedMotion ? 'map/swath-static.svg' : 'map/swath.svg')}
            trackSrc={visualUrl(
              reducedMotion ? 'map/ground-track-static.svg' : 'map/ground-track.svg',
            )}
            stationSrc={visualUrl(
              reducedMotion ? 'map/station-marker-static.svg' : 'map/station-marker.svg',
            )}
            ariaLabel={t.ops.map.aria}
            labels={{
              swath: t.ops.map.swath,
              track: t.ops.map.track,
              station: t.ops.map.stationShort,
            }}
            stationPosition={{ x: 41.5, y: 60.9 }}
            aspect="aspect-[8/9]"
          />

          <div className="space-y-4">
            <Panel className="space-y-3 p-5">
              <p className="label-caps text-ink-2">{t.ops.map.target}</p>
              <p className="font-display text-xl font-semibold text-ink">{t.ops.map[targetKey]}</p>
              <p className="text-[12px] text-ink-3">{t.ops.map.station}</p>
              <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
                <p className="label-caps text-ink-2">{t.ops.map.orbit}</p>
                <span className="font-mono text-[11px] text-ink-2">
                  {orbit?.name ?? config.orbitId}
                </span>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <StatBlock
                  label={t.ops.map.altitude}
                  value={orbit ? `${orbit.altitudeKm} km` : '—'}
                  tone="ion"
                />
                <StatBlock
                  label={t.ops.map.inclination}
                  value={orbit ? `${orbit.inclinationDeg}°` : '—'}
                  tone="milk"
                />
              </div>
            </Panel>

            <Panel className="p-5">
              <p className="label-caps text-ink-2">{t.ops.map.legend}</p>
              <ul className="mt-3 space-y-2 text-[13px] text-ink-2">
                <li className="flex items-center gap-2">
                  <MaskIcon file="icons/map/target.svg" className="size-4 text-milk-strong" />
                  {t.ops.map.target}
                </li>
                <li className="flex items-center gap-2">
                  <MaskIcon file="icons/map/station.svg" className="size-4 text-comms" />
                  {t.ops.map.station}
                </li>
                <li className="flex items-center gap-2">
                  <MaskIcon file="icons/map/legend.svg" className="size-4 text-ion" />
                  {t.ops.map.layers}
                </li>
              </ul>
            </Panel>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary" onClick={() => (window.location.hash = '#/report')}>
            {t.ops.map.back}
          </Button>
          <Button variant="secondary" onClick={() => (window.location.hash = '#/simulate')}>
            {t.ops.simulate.title}
          </Button>
        </div>
      </div>
    </ReportFrame>
  )
}
