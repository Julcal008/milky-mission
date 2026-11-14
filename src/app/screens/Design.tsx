/**
 * Design screen — Owner: Track A (@Julcal008).
 * Mission board: orbit, bus, power, comms, science and requirements, with live
 * budgets from the mission store. This screen never computes physics.
 */
import { scenarioContent } from '@/content/scenarios'
import { catalogs } from '@/data/catalogs'
import { scenarioFixtures } from '@/engine/__fixtures__/scenario-fixture'
import type {
  ArrayId,
  BatteryId,
  BusId,
  CommsId,
  GroundNetworkId,
  InstrumentId,
  LauncherId,
  MissionConfig,
  OrbitId,
  PropulsionId,
  StorageId,
} from '@/engine/types'
import { MAX_INSTRUMENTS } from '@/engine/types'
import { useMissionStore } from '@/store/mission'
import { useI18n } from '@/store/ui'
import { Badge } from '@/ui/Badge'
import { Button } from '@/ui/Button'
import { Select } from '@/ui/game/Select'
import { Panel } from '@/ui/Panel'
import { ResourceBar } from '@/ui/ResourceBar'

const ARRAY_AREAS = [0.6, 1.2, 2.0, 3.5]

export function DesignScreen() {
  const { t, lang } = useI18n()
  const config = useMissionStore((state) => state.config)
  const validation = useMissionStore((state) => state.validation)
  const setConfig = useMissionStore((state) => state.setConfig)

  const scenario = scenarioFixtures[config.scenarioId]
  const copy = scenarioContent[lang][config.scenarioId]
  const budgets = validation.budgets

  const update = (patch: Partial<MissionConfig>) => setConfig(patch)

  const setInstrumentAt = (index: number, id: string) => {
    const current = config.instrumentIds
    if (!id) {
      update({ instrumentIds: current.filter((_, itemIndex) => itemIndex !== index) })
      return
    }
    if (index < current.length) {
      const next = [...current]
      next[index] = id as InstrumentId
      update({ instrumentIds: next })
      return
    }
    update({ instrumentIds: [...current, id as InstrumentId] })
  }

  const availableInstruments = catalogs.instruments.filter(
    (instrument) => !config.instrumentIds.includes(instrument.id),
  )

  const toggleRequirement = (id: string) => {
    const selected = config.requirements.includes(id)
    if (selected) {
      update({ requirements: config.requirements.filter((item) => item !== id) })
      return
    }
    if (config.requirements.length >= 3) {
      return
    }
    update({ requirements: [...config.requirements, id] })
  }

  const massMarginPct =
    budgets.massCapacityKg > 0
      ? ((budgets.massCapacityKg - budgets.massKg) / budgets.massCapacityKg) * 100
      : 0
  const deliveredPct =
    budgets.dataGbPerDay > 0
      ? Math.min(100, (budgets.downlinkGbPerDay / budgets.dataGbPerDay) * 100)
      : 100
  const validationCopy = t.game.validation as Record<string, string>

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="space-y-6">
        <header className="space-y-2">
          <p className="label-caps text-ink-3">{copy.title}</p>
          <h1 className="font-display text-3xl font-semibold text-ink">{t.game.design.title}</h1>
          <p className="max-w-3xl text-[13px] leading-relaxed text-ink-2">{copy.summary}</p>
        </header>

        <div className="grid gap-5 md:grid-cols-2">
          <Panel className="space-y-4 p-5">
            <h2 className="label-caps text-ink-2">{t.game.design.orbit}</h2>
            <Select
              label={t.game.design.orbit}
              value={config.orbitId}
              onChange={(event) => update({ orbitId: event.target.value as OrbitId })}
            >
              {catalogs.orbits.map((orbit) => (
                <option key={orbit.id} value={orbit.id}>
                  {orbit.name} · {orbit.altitudeKm} km · {orbit.inclinationDeg}°
                </option>
              ))}
            </Select>
            <Select
              label={t.game.design.launcher}
              value={config.launcherId}
              onChange={(event) => update({ launcherId: event.target.value as LauncherId })}
            >
              {catalogs.launchers.map((launcher) => (
                <option key={launcher.id} value={launcher.id}>
                  {launcher.name} · ${launcher.costUsdM}M
                </option>
              ))}
            </Select>
          </Panel>

          <Panel className="space-y-4 p-5">
            <h2 className="label-caps text-ink-2">{t.game.design.bus}</h2>
            <Select
              label={t.game.design.bus}
              value={config.busId}
              onChange={(event) => update({ busId: event.target.value as BusId })}
            >
              {catalogs.buses.map((bus) => (
                <option key={bus.id} value={bus.id}>
                  {bus.name} · {bus.dryMassKg} kg · ${bus.costUsdM}M
                </option>
              ))}
            </Select>
            <Select
              label={t.game.design.propulsion}
              value={config.propulsionId}
              onChange={(event) => update({ propulsionId: event.target.value as PropulsionId })}
            >
              {catalogs.propulsion.map((propulsion) => (
                <option key={propulsion.id} value={propulsion.id}>
                  {propulsion.name} · {propulsion.ispS} s
                </option>
              ))}
            </Select>
          </Panel>

          <Panel className="space-y-4 p-5">
            <h2 className="label-caps text-ink-2">{t.game.design.power}</h2>
            <Select
              label={t.game.design.array}
              value={config.arrayId}
              onChange={(event) => update({ arrayId: event.target.value as ArrayId })}
            >
              {catalogs.arrays.map((array) => (
                <option key={array.id} value={array.id}>
                  {array.name} · {array.powerWPerM2} W/m²
                </option>
              ))}
            </Select>
            <Select
              label={t.game.design.area}
              value={String(config.arrayAreaM2)}
              onChange={(event) => update({ arrayAreaM2: Number(event.target.value) })}
            >
              {ARRAY_AREAS.map((area) => (
                <option key={area} value={area}>
                  {area} m²
                </option>
              ))}
            </Select>
            <Select
              label={t.game.design.battery}
              value={config.batteryId}
              onChange={(event) => update({ batteryId: event.target.value as BatteryId })}
            >
              {catalogs.batteries.map((battery) => (
                <option key={battery.id} value={battery.id}>
                  {battery.name} · {battery.massKg} kg
                </option>
              ))}
            </Select>
          </Panel>

          <Panel className="space-y-4 p-5">
            <h2 className="label-caps text-ink-2">{t.game.design.comms}</h2>
            <Select
              label={t.game.design.band}
              value={config.commsId}
              onChange={(event) => update({ commsId: event.target.value as CommsId })}
            >
              {catalogs.comms.map((comms) => (
                <option key={comms.id} value={comms.id}>
                  {comms.name} · {comms.maxRateMbps} Mbps
                </option>
              ))}
            </Select>
            <Select
              label={t.game.design.groundNetwork}
              value={config.groundNetworkId}
              onChange={(event) =>
                update({ groundNetworkId: event.target.value as GroundNetworkId })
              }
            >
              {catalogs.groundNetworks.map((network) => (
                <option key={network.id} value={network.id}>
                  {network.name} · ×{network.passesMultiplier}
                </option>
              ))}
            </Select>
            <Select
              label={t.game.design.storage}
              value={config.storageId}
              onChange={(event) => update({ storageId: event.target.value as StorageId })}
            >
              {catalogs.storage.map((storage) => (
                <option key={storage.id} value={storage.id}>
                  {storage.name} · {storage.capacityGb} GB
                </option>
              ))}
            </Select>
          </Panel>
        </div>

        <Panel className="space-y-4 p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="label-caps text-ink-2">{t.game.design.instruments}</h2>
            <span className="text-[11px] text-ink-3">
              {config.instrumentIds.length}/{MAX_INSTRUMENTS}
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: MAX_INSTRUMENTS }).map((_, index) => {
              const instrumentId = config.instrumentIds[index]
              const instrument = catalogs.instruments.find((item) => item.id === instrumentId)
              if (!instrument) {
                return (
                  <div
                    key={`empty-${index}`}
                    className="rounded-md border border-dashed border-border/80 p-3"
                  >
                    <Select
                      label={t.game.design.emptySlot}
                      value=""
                      onChange={(event) => setInstrumentAt(index, event.target.value)}
                    >
                      <option value="">+ {t.game.design.emptySlot}</option>
                      {availableInstruments.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                )
              }
              return (
                <div
                  key={instrument.id}
                  className="flex flex-col gap-2 rounded-md border border-border bg-surface-2/50 p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[13px] font-medium text-ink">{instrument.name}</span>
                    <button
                      type="button"
                      onClick={() => setInstrumentAt(index, '')}
                      className="text-ink-3 transition-colors hover:text-danger"
                      aria-label={`Remove ${instrument.name}`}
                    >
                      ×
                    </button>
                  </div>
                  <span className="num text-[11px] text-ink-3">
                    {instrument.massKg} kg · {instrument.powerW} W · {instrument.dataGbPerDay} Gb/d
                    · TRL {instrument.trl}
                  </span>
                </div>
              )
            })}
          </div>
        </Panel>

        <Panel className="space-y-4 p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="label-caps text-ink-2">{t.game.design.requirements}</h2>
            <span className="text-[11px] text-ink-3">
              {config.requirements.length}/3 {t.game.design.selectedCount} ·{' '}
              {t.game.design.chooseThree}
            </span>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {scenario.requirements.map((requirement, index) => {
              const key = `r${index + 1}` as 'r1' | 'r2' | 'r3' | 'r4' | 'r5' | 'r6'
              const requirementCopy = copy[key]
              const selected = config.requirements.includes(requirement.id)
              const disabled = !selected && config.requirements.length >= 3
              return (
                <button
                  key={requirement.id}
                  type="button"
                  onClick={() => toggleRequirement(requirement.id)}
                  disabled={disabled}
                  aria-pressed={selected}
                  className={[
                    'rounded-md border p-4 text-left transition-colors',
                    selected
                      ? 'border-jade/60 bg-jade/10'
                      : 'border-border bg-surface-2/40 hover:border-border-strong',
                    disabled ? 'cursor-not-allowed opacity-40' : '',
                  ].join(' ')}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[13px] font-medium text-ink">
                      {requirementCopy?.title ?? requirement.id}
                    </span>
                    <Badge
                      tone={selected ? 'success' : 'neutral'}
                      className="shrink-0 whitespace-nowrap"
                    >
                      {requirement.weight} pts
                    </Badge>
                  </div>
                  <p className="mt-1 text-[12px] leading-relaxed text-ink-3">
                    {requirementCopy?.description ?? ''}
                  </p>
                </button>
              )
            })}
          </div>
        </Panel>

        <div className="flex justify-end">
          <Button variant="primary" onClick={() => (window.location.hash = '#/review')}>
            {t.game.design.review}
          </Button>
        </div>
      </div>

      <aside className="space-y-4 xl:sticky xl:top-20 xl:self-start">
        <Panel className="space-y-4 p-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="label-caps text-ink-2">{t.game.review.budgets}</h2>
            <Badge tone={validation.ok ? 'success' : 'danger'}>
              {validation.ok ? 'OK' : 'Issues'}
            </Badge>
          </div>
          <ResourceBar
            label="Mass"
            value={budgets.massKg}
            max={budgets.massCapacityKg || 1}
            unit="kg"
            tone="mass"
            status={`${massMarginPct.toFixed(1)} % margin`}
            statusTone={massMarginPct < 0 ? 'danger' : massMarginPct < 20 ? 'warning' : 'success'}
          />
          <ResourceBar
            label="Power"
            value={Math.max(0, budgets.powerMarginW)}
            max={100}
            unit="W"
            tone="power"
            status={`${budgets.powerMarginW.toFixed(1)} W margin`}
            statusTone={
              budgets.powerMarginW < 0
                ? 'danger'
                : budgets.powerMarginW < 20
                  ? 'warning'
                  : 'success'
            }
          />
          <ResourceBar
            label="Budget"
            value={budgets.costUsdM}
            max={budgets.budgetUsdM}
            unit="$M"
            tone="budget"
            status={`$${(budgets.budgetUsdM - budgets.costUsdM).toFixed(1)}M remaining`}
            statusTone={budgets.costUsdM > budgets.budgetUsdM ? 'danger' : 'success'}
          />
          <ResourceBar
            label="Data"
            value={budgets.downlinkGbPerDay}
            max={Math.max(budgets.dataGbPerDay, 0.001)}
            unit="Gb/day"
            tone="data"
            status={`${deliveredPct.toFixed(0)} % delivered`}
            statusTone={deliveredPct < 70 ? 'warning' : 'success'}
          />
          <ResourceBar
            label="Mission time"
            value={budgets.lifetimeDays}
            max={scenario.durationDays}
            unit="days"
            tone="time"
            status={`${budgets.lifetimeDays} / ${scenario.durationDays} days`}
            statusTone={budgets.lifetimeDays < scenario.durationDays ? 'warning' : 'success'}
          />
        </Panel>

        <Panel className="space-y-3 p-5">
          <h2 className="label-caps text-ink-2">{t.game.review.issues}</h2>
          {validation.issues.length === 0 ? (
            <p className="text-[12px] text-ink-3">{t.game.review.noIssues}</p>
          ) : (
            <ul className="space-y-2">
              {validation.issues.slice(0, 8).map((issue) => (
                <li key={`${issue.code}-${issue.field}`} className="flex items-start gap-2">
                  <Badge
                    tone={
                      issue.severity === 'error'
                        ? 'danger'
                        : issue.severity === 'warning'
                          ? 'warning'
                          : 'info'
                    }
                  >
                    {issue.severity}
                  </Badge>
                  <span className="text-[12px] leading-relaxed text-ink-2">
                    {validationCopy[issue.code] ?? issue.code}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </aside>
    </div>
  )
}
