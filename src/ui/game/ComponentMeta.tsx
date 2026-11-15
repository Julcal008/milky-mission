/**
 * Component metadata card — Owner: Track A (UI sprint).
 * Turns a catalog entry into a short engineering briefing: stats, trade-off tags,
 * and its provenance. Pure presentation: values come from the catalogs.
 */
import type {
  ArraySpec,
  BatterySpec,
  BusSpec,
  CommsSpec,
  GroundNetworkSpec,
  InstrumentSpec,
  LauncherSpec,
  OrbitSpec,
  PropulsionSpec,
  StorageSpec,
} from '@/engine/types'
import { useI18n } from '@/store/ui'
import { Badge } from '@/ui/Badge'
import { format } from './format'

export type MetaKind =
  | 'orbit'
  | 'launcher'
  | 'bus'
  | 'propulsion'
  | 'array'
  | 'battery'
  | 'comms'
  | 'network'
  | 'storage'
  | 'instrument'

type MetaItem =
  | OrbitSpec
  | LauncherSpec
  | BusSpec
  | PropulsionSpec
  | ArraySpec
  | BatterySpec
  | CommsSpec
  | GroundNetworkSpec
  | StorageSpec
  | InstrumentSpec

export function ComponentMeta({ kind, item }: { kind: MetaKind; item: MetaItem }) {
  const { t } = useI18n()
  const meta = t.game.meta
  const tags: string[] = []

  if ('massKg' in item && item.massKg >= 30) tags.push(meta.tags.heavy)
  if ('powerW' in item && item.powerW >= 50) tags.push(meta.tags.powerHungry)
  if ('dataGbPerDay' in item && item.dataGbPerDay >= 5) tags.push(meta.tags.dataHeavy)
  if ('costUsdM' in item && item.costUsdM >= 10) tags.push(meta.tags.expensive)

  let line = ''
  let source = ''
  let confidence = ''

  switch (kind) {
    case 'orbit': {
      const orbit = item as OrbitSpec
      if (orbit.altitudeKm >= 600) tags.push(meta.tags.longLife)
      if (orbit.dragMSYear >= 20) tags.push(meta.tags.shortLife)
      line = format(meta.orbit, {
        altitude: orbit.altitudeKm,
        inclination: orbit.inclinationDeg,
        drag: orbit.dragMSYear,
        dose: orbit.radiationKradYear,
      })
      source = orbit.source
      confidence = orbit.confidence
      break
    }
    case 'launcher': {
      const launcher = item as LauncherSpec
      if (launcher.capacityKg.sso500 >= 3000) tags.push(meta.tags.oversized)
      line = format(meta.launcher, {
        capacity: launcher.capacityKg.sso500,
        cost: launcher.costUsdM,
        fixed: launcher.fixedOrbit ? meta.fixedYes : meta.fixedNo,
      })
      source = launcher.source
      confidence = launcher.confidence
      break
    }
    case 'bus': {
      const bus = item as BusSpec
      line = format(meta.bus, {
        mass: bus.dryMassKg,
        payload: bus.payloadCapacityKg,
        power: bus.busPowerW,
        reliability: Math.round(bus.reliabilityPerYear * 100),
      })
      source = bus.source
      confidence = bus.confidence
      break
    }
    case 'propulsion': {
      const propulsion = item as PropulsionSpec
      line = format(meta.propulsion, {
        mass: propulsion.dryMassKg,
        propellant: propulsion.propellantMaxKg,
        isp: propulsion.ispS,
      })
      source = propulsion.source
      confidence = propulsion.confidence
      break
    }
    case 'array': {
      const array = item as ArraySpec
      if (array.id === 'gaas') tags.push(meta.tags.efficient)
      line = format(meta.array, {
        power: array.powerWPerM2,
        degradation: Math.round(array.degradationPerYear * 100),
      })
      source = array.source
      confidence = array.confidence
      break
    }
    case 'battery': {
      const battery = item as BatterySpec
      line = format(meta.battery, {
        capacity: battery.capacityWh,
        mass: battery.massKg,
        dod: Math.round(battery.maxDoD * 100),
      })
      source = battery.source
      confidence = battery.confidence
      break
    }
    case 'comms': {
      const comms = item as CommsSpec
      if (comms.maxRateMbps >= 50) tags.push(meta.tags.highBandwidth)
      if (comms.id === 'uhf') tags.push(meta.tags.ttac)
      line = format(meta.comms, {
        rate: comms.maxRateMbps,
        power: comms.txPowerW,
        gain: comms.antennaGainDbi,
      })
      source = comms.source
      confidence = comms.confidence
      break
    }
    case 'network': {
      const network = item as GroundNetworkSpec
      line = format(meta.network, {
        stations: network.stations,
        multiplier: network.passesMultiplier,
      })
      source = network.source
      confidence = network.confidence
      break
    }
    case 'storage': {
      const storage = item as StorageSpec
      line = format(meta.storage, { capacity: storage.capacityGb, mass: storage.massKg })
      source = storage.source
      confidence = storage.confidence
      break
    }
    case 'instrument': {
      const instrument = item as InstrumentSpec
      if (instrument.scienceValue >= 30) tags.push(meta.tags.highScience)
      if (instrument.trl <= 7) tags.push(meta.tags.flightRisk)
      line = format(meta.instrument, {
        mass: instrument.massKg,
        power: instrument.powerW,
        data: instrument.dataGbPerDay,
        science: instrument.scienceValue,
        trl: instrument.trl,
      })
      source = instrument.source
      confidence = instrument.confidence
      break
    }
  }

  return (
    <div className="rounded-md border border-border/70 bg-surface-2/30 p-3">
      {tags.length > 0 ? (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <Badge key={tag} tone="neutral">
              {tag}
            </Badge>
          ))}
        </div>
      ) : null}
      <p className="text-[11px] leading-relaxed text-ink-2">{line}</p>
      <p className="mt-1 text-[10px] text-ink-3">{format(meta.source, { source, confidence })}</p>
    </div>
  )
}
