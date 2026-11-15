/**
 * Design screen — Owner: Track A (@Julcal008).
 * The player starts from an empty draft: every selection is explicit. The engine
 * only validates once the draft is complete.
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
  OrbitId,
  PropulsionId,
  StorageId,
} from '@/engine/types'
import { MAX_INSTRUMENTS } from '@/engine/types'
import { MaskIcon } from '@/app/visuals/MaskIcon'
import { useMissionStore } from '@/store/mission'
import { useI18n } from '@/store/ui'
import { Badge } from '@/ui/Badge'
import { Button } from '@/ui/Button'
import { ComponentMeta } from '@/ui/game/ComponentMeta'
import { Select } from '@/ui/game/Select'
import { SpacecraftSchematic } from '@/ui/game/SpacecraftSchematic'
import { Panel } from '@/ui/Panel'
import { ResourceBar } from '@/ui/ResourceBar'

const ARRAY_AREAS = [0.6, 1.2, 2.0, 3.5]

function EmptyGauge({ label }: { label: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="label-caps text-ink-2">{label}</span>
        <span className="num text-[12px] text-ink-3">—</span>
      </div>
      <div className="h-1.5 w-full rounded-sm bg-surface-2" />
    </div>
  )
}

export function DesignScreen() {
  const { t, lang } = useI18n()
  const draft = useMissionStore((state) => state.draft)
  const validation = useMissionStore((state) => state.validation)
  const missing = useMissionStore((state) => state.missing)
  const setDraft = useMissionStore((state) => state.setDraft)
  const reset = useMissionStore((state) => state.reset)

  const scenario = draft.scenarioId ? scenarioFixtures[draft.scenarioId] : null
  const copy = draft.scenarioId ? scenarioContent[lang][draft.scenarioId] : null
  const complete = missing.length === 0
  const budgets = validation?.budgets

  const orbit = catalogs.orbits.find((item) => item.id === draft.orbitId)
  const launcher = catalogs.launchers.find((item) => item.id === draft.launcherId)
  const bus = catalogs.buses.find((item) => item.id === draft.busId)
  const propulsion = catalogs.propulsion.find((item) => item.id === draft.propulsionId)
  const array = catalogs.arrays.find((item) => item.id === draft.arrayId)
  const battery = catalogs.batteries.find((item) => item.id === draft.batteryId)
  const comms = catalogs.comms.find((item) => item.id === draft.commsId)
  const network = catalogs.groundNetworks.find((item) => item.id === draft.groundNetworkId)
  const storage = catalogs.storage.find((item) => item.id === draft.storageId)

  const availableInstruments = catalogs.instruments.filter(
    (instrument) => !draft.instrumentIds.includes(instrument.id),
  )

  const update = (patch: Parameters<typeof setDraft>[0]) => setDraft(patch)

  const addInstrument = (id: string) => {
    if (!id || draft.instrumentIds.length >= MAX_INSTRUMENTS) {
      return
    }
    update({ instrumentIds: [...draft.instrumentIds, id as InstrumentId] })
  }

  const removeInstrument = (id: InstrumentId) => {
    update({ instrumentIds: draft.instrumentIds.filter((item) => item !== id) })
  }

  const toggleRequirement = (id: string) => {
    if (draft.requirements.includes(id)) {
      update({ requirements: draft.requirements.filter((item) => item !== id) })
      return
    }
    if (draft.requirements.length >= 3) {
      return
    }
    update({ requirements: [...draft.requirements, id] })
  }

  const massMarginPct =
    budgets && budgets.massCapacityKg > 0
      ? ((budgets.massCapacityKg - budgets.massKg) / budgets.massCapacityKg) * 100
      : 0
  const deliveredPct =
    budgets && budgets.dataGbPerDay > 0
      ? Math.min(100, (budgets.downlinkGbPerDay / budgets.dataGbPerDay) * 100)
      : 100
  const validationCopy = t.game.validation as Record<string, string>

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="label-caps text-ink-3">{copy?.title ?? t.brief.eyebrow}</p>
          <h1 className="font-display text-3xl font-semibold text-ink">{t.game.design.title}</h1>
          <p className="max-w-3xl text-[13px] leading-relaxed text-ink-2">
            {copy?.summary ?? t.game.design.lead}
          </p>
        </div>
        <Badge tone={complete ? 'success' : 'warning'}>
          {complete ? t.game.design.complete : t.game.design.incomplete}
        </Badge>
      </header>

      <Panel className="overflow-hidden p-2 sm:p-4">
        <SpacecraftSchematic draft={draft} />
      </Panel>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-6">
          <div className="grid gap-5 md:grid-cols-2">
            <Panel className="space-y-4 border-l-2 border-l-ion/50 p-5">
              <h2 className="flex items-center gap-2 label-caps text-ink-2">
                <MaskIcon file="icons/subsystems/orbit.svg" className="size-3.5 text-ion" />
                {t.game.design.orbit}
              </h2>
              <Select
                label={t.game.design.orbit}
                value={draft.orbitId ?? ''}
                onChange={(event) =>
                  event.target.value && update({ orbitId: event.target.value as OrbitId })
                }
              >
                <option value="" disabled>
                  {t.game.design.select}
                </option>
                {catalogs.orbits.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} · {item.altitudeKm} km · {item.inclinationDeg}°
                  </option>
                ))}
              </Select>
              <Select
                label={t.game.design.launcher}
                value={draft.launcherId ?? ''}
                onChange={(event) =>
                  event.target.value && update({ launcherId: event.target.value as LauncherId })
                }
              >
                <option value="" disabled>
                  {t.game.design.select}
                </option>
                {catalogs.launchers.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} · ${item.costUsdM}M
                  </option>
                ))}
              </Select>
              {orbit ? <ComponentMeta kind="orbit" item={orbit} /> : null}
              {launcher ? <ComponentMeta kind="launcher" item={launcher} /> : null}
            </Panel>

            <Panel className="space-y-4 border-l-2 border-l-cream/50 p-5">
              <h2 className="flex items-center gap-2 label-caps text-ink-2">
                <MaskIcon file="icons/subsystems/bus.svg" className="size-3.5 text-cream" />
                {t.game.design.bus}
              </h2>
              <Select
                label={t.game.design.bus}
                value={draft.busId ?? ''}
                onChange={(event) =>
                  event.target.value && update({ busId: event.target.value as BusId })
                }
              >
                <option value="" disabled>
                  {t.game.design.select}
                </option>
                {catalogs.buses.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} · {item.dryMassKg} kg · ${item.costUsdM}M
                  </option>
                ))}
              </Select>
              <Select
                label={t.game.design.propulsion}
                value={draft.propulsionId ?? ''}
                onChange={(event) =>
                  event.target.value && update({ propulsionId: event.target.value as PropulsionId })
                }
              >
                <option value="" disabled>
                  {t.game.design.select}
                </option>
                {catalogs.propulsion.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} · {item.ispS} s
                  </option>
                ))}
              </Select>
              {bus ? <ComponentMeta kind="bus" item={bus} /> : null}
              {propulsion ? <ComponentMeta kind="propulsion" item={propulsion} /> : null}
            </Panel>

            <Panel className="space-y-4 border-l-2 border-l-res-power/50 p-5">
              <h2 className="flex items-center gap-2 label-caps text-ink-2">
                <MaskIcon file="icons/subsystems/array.svg" className="size-3.5 text-res-power" />
                {t.game.design.power}
              </h2>
              <Select
                label={t.game.design.array}
                value={draft.arrayId ?? ''}
                onChange={(event) =>
                  event.target.value && update({ arrayId: event.target.value as ArrayId })
                }
              >
                <option value="" disabled>
                  {t.game.design.select}
                </option>
                {catalogs.arrays.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} · {item.powerWPerM2} W/m²
                  </option>
                ))}
              </Select>
              <Select
                label={t.game.design.area}
                value={draft.arrayAreaM2 ? String(draft.arrayAreaM2) : ''}
                onChange={(event) =>
                  event.target.value && update({ arrayAreaM2: Number(event.target.value) })
                }
              >
                <option value="" disabled>
                  {t.game.design.select}
                </option>
                {ARRAY_AREAS.map((area) => (
                  <option key={area} value={area}>
                    {area} m²
                  </option>
                ))}
              </Select>
              <Select
                label={t.game.design.battery}
                value={draft.batteryId ?? ''}
                onChange={(event) =>
                  event.target.value && update({ batteryId: event.target.value as BatteryId })
                }
              >
                <option value="" disabled>
                  {t.game.design.select}
                </option>
                {catalogs.batteries.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} · {item.massKg} kg
                  </option>
                ))}
              </Select>
              {array ? <ComponentMeta kind="array" item={array} /> : null}
              {battery ? <ComponentMeta kind="battery" item={battery} /> : null}
            </Panel>

            <Panel className="space-y-4 border-l-2 border-l-role-comms/50 p-5">
              <h2 className="flex items-center gap-2 label-caps text-ink-2">
                <MaskIcon file="icons/subsystems/comms.svg" className="size-3.5 text-role-comms" />
                {t.game.design.comms}
              </h2>
              <Select
                label={t.game.design.band}
                value={draft.commsId ?? ''}
                onChange={(event) =>
                  event.target.value && update({ commsId: event.target.value as CommsId })
                }
              >
                <option value="" disabled>
                  {t.game.design.select}
                </option>
                {catalogs.comms.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} · {item.maxRateMbps} Mbps
                  </option>
                ))}
              </Select>
              <Select
                label={t.game.design.groundNetwork}
                value={draft.groundNetworkId ?? ''}
                onChange={(event) =>
                  event.target.value &&
                  update({ groundNetworkId: event.target.value as GroundNetworkId })
                }
              >
                <option value="" disabled>
                  {t.game.design.select}
                </option>
                {catalogs.groundNetworks.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} · ×{item.passesMultiplier}
                  </option>
                ))}
              </Select>
              <Select
                label={t.game.design.storage}
                value={draft.storageId ?? ''}
                onChange={(event) =>
                  event.target.value && update({ storageId: event.target.value as StorageId })
                }
              >
                <option value="" disabled>
                  {t.game.design.select}
                </option>
                {catalogs.storage.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} · {item.capacityGb} GB
                  </option>
                ))}
              </Select>
              {comms ? <ComponentMeta kind="comms" item={comms} /> : null}
              {network ? <ComponentMeta kind="network" item={network} /> : null}
              {storage ? <ComponentMeta kind="storage" item={storage} /> : null}
            </Panel>
          </div>

          <Panel className="space-y-4 border-l-2 border-l-role-science/50 p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="flex items-center gap-2 label-caps text-ink-2">
                <MaskIcon
                  file="icons/subsystems/instrument.svg"
                  className="size-3.5 text-role-science"
                />
                {t.game.design.instruments}
              </h2>
              <span className="text-[11px] text-ink-3">
                {draft.instrumentIds.length}/{MAX_INSTRUMENTS} · {t.game.design.slots}
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: MAX_INSTRUMENTS }).map((_, index) => {
                const instrumentId = draft.instrumentIds[index]
                const instrument = catalogs.instruments.find((item) => item.id === instrumentId)
                if (!instrument) {
                  return (
                    <div
                      key={`empty-${index}`}
                      className="rounded-xl border border-dashed border-border/80 p-3"
                    >
                      <Select
                        label={t.game.design.emptySlot}
                        value=""
                        onChange={(event) => addInstrument(event.target.value)}
                        disabled={draft.instrumentIds.length >= MAX_INSTRUMENTS}
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
                    className="flex flex-col gap-2 rounded-xl border border-border bg-surface-2/50 p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[13px] font-medium text-ink">{instrument.name}</span>
                      <button
                        type="button"
                        onClick={() => removeInstrument(instrument.id)}
                        className="text-ink-3 transition-colors hover:text-danger"
                        aria-label={`Remove ${instrument.name}`}
                      >
                        ×
                      </button>
                    </div>
                    <ComponentMeta kind="instrument" item={instrument} />
                  </div>
                )
              })}
            </div>
          </Panel>

          <Panel className="space-y-4 border-l-2 border-l-cream/50 p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="flex items-center gap-2 label-caps text-ink-2">
                <MaskIcon file="icons/requirements/storm.svg" className="size-3.5 text-milk" />
                {t.game.design.requirements}
              </h2>
              <span className="text-[11px] text-ink-3">
                {draft.requirements.length}/3 {t.game.design.selectedCount} ·{' '}
                {t.game.design.chooseThree}
              </span>
            </div>
            {scenario ? (
              <div className="grid gap-3 md:grid-cols-2">
                {scenario.requirements.map((requirement, index) => {
                  const key = `r${index + 1}` as 'r1' | 'r2' | 'r3' | 'r4' | 'r5' | 'r6'
                  const requirementCopy = copy?.[key]
                  const selected = draft.requirements.includes(requirement.id)
                  const disabled = !selected && draft.requirements.length >= 3
                  return (
                    <button
                      key={requirement.id}
                      type="button"
                      onClick={() => toggleRequirement(requirement.id)}
                      disabled={disabled}
                      aria-pressed={selected}
                      className={[
                        'rounded-xl border p-4 text-left transition-colors',
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
            ) : (
              <p className="text-[12px] text-ink-3">
                <a href="#/brief" className="text-ion underline-offset-2 hover:underline">
                  {t.brief.title}
                </a>
              </p>
            )}
          </Panel>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button
              variant="ghost"
              onClick={() => {
                reset()
                window.location.hash = '#/brief'
              }}
            >
              {t.game.design.reset}
            </Button>
            <Button
              variant="primary"
              disabled={!complete}
              onClick={() => (window.location.hash = '#/review')}
            >
              {t.game.design.review}
            </Button>
          </div>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-20 xl:self-start">
          <Panel className="space-y-4 p-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="label-caps text-ink-2">{t.game.review.budgets}</h2>
              <Badge tone={!validation ? 'warning' : validation.ok ? 'success' : 'danger'}>
                {!validation
                  ? t.game.design.incomplete
                  : validation.ok
                    ? t.game.review.ok
                    : t.game.review.issues}
              </Badge>
            </div>
            {budgets ? (
              <>
                <ResourceBar
                  label={t.game.design.gauges.mass}
                  value={budgets.massKg}
                  max={budgets.massCapacityKg || 1}
                  unit="kg"
                  tone="mass"
                  status={`${massMarginPct.toFixed(1)} % margin`}
                  statusTone={
                    massMarginPct < 0 ? 'danger' : massMarginPct < 20 ? 'warning' : 'success'
                  }
                />
                <ResourceBar
                  label={t.game.design.gauges.power}
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
                  label={t.game.design.gauges.budget}
                  value={budgets.costUsdM}
                  max={budgets.budgetUsdM}
                  unit="$M"
                  tone="budget"
                  status={`$${(budgets.budgetUsdM - budgets.costUsdM).toFixed(1)}M remaining`}
                  statusTone={budgets.costUsdM > budgets.budgetUsdM ? 'danger' : 'success'}
                />
                <ResourceBar
                  label={t.game.design.gauges.data}
                  value={budgets.downlinkGbPerDay}
                  max={Math.max(budgets.dataGbPerDay, 0.001)}
                  unit="Gb/day"
                  tone="data"
                  status={`${deliveredPct.toFixed(0)} % delivered`}
                  statusTone={deliveredPct < 70 ? 'warning' : 'success'}
                />
                <ResourceBar
                  label={t.game.design.gauges.time}
                  value={budgets.lifetimeDays}
                  max={scenario?.durationDays ?? 365}
                  unit="days"
                  tone="time"
                  status={`${budgets.lifetimeDays} / ${scenario?.durationDays ?? 365} days`}
                  statusTone={
                    budgets.lifetimeDays < (scenario?.durationDays ?? 365) ? 'warning' : 'success'
                  }
                />
              </>
            ) : (
              <>
                <EmptyGauge label={t.game.design.gauges.mass} />
                <EmptyGauge label={t.game.design.gauges.power} />
                <EmptyGauge label={t.game.design.gauges.budget} />
                <EmptyGauge label={t.game.design.gauges.data} />
                <EmptyGauge label={t.game.design.gauges.time} />
              </>
            )}
          </Panel>

          {missing.length > 0 ? (
            <Panel className="space-y-3 border-warning/30 p-5">
              <h2 className="label-caps text-warning">{t.game.design.missingTitle}</h2>
              <ul className="space-y-1.5">
                {missing.map((key) => (
                  <li key={key} className="flex items-start gap-2 text-[12px] text-ink-2">
                    <span aria-hidden="true" className="mt-1.5 size-1.5 rounded-full bg-warning" />
                    {t.game.design.missing[key]}
                  </li>
                ))}
              </ul>
            </Panel>
          ) : null}

          <Panel className="space-y-3 p-5">
            <h2 className="label-caps text-ink-2">{t.game.review.issues}</h2>
            {!validation ? (
              <p className="text-[12px] text-ink-3">{t.game.design.validateAfter}</p>
            ) : validation.issues.length === 0 ? (
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
                      {t.common.severity[issue.severity]}
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
    </div>
  )
}
