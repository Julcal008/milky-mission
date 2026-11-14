/**
 * SIMULATOR — deterministic day-by-day mission simulation.
 * Owner: Track A.
 *
 * Inputs:  mission configuration, scenario, catalogs
 * Outputs: day states, events, requirement results, budgets, score and verdict
 * Invariants: same config + seed -> identical result; days.length === scenario.durationDays
 * Assumptions: daily resolution; event dates are placeholders until the DONKI cache
 *              lands; battery and data are integrated at day granularity.
 */
import { getInstruments, getOrbit, getStorage } from './catalog'
import { computeCostBreakdown } from './cost'
import { computeLinkBreakdown } from './link'
import { computePowerBreakdown } from './power'
import { trlFailureProbability } from './reliability'
import { revisitHours } from './orbit'
import { createRng } from './prng'
import { scoreMission } from './score'
import { REQUIREMENT_TAGS, validateMission } from './validate'
import type {
  Catalogs,
  DayState,
  GameEvent,
  InstrumentId,
  MissionConfig,
  RequirementResult,
  ScenarioId,
  ScenarioSpec,
  SimulationResult,
} from './types'
import { DAYS_PER_YEAR } from './units'

/** Placeholder event dates until Track C lands the DONKI cache. */
const SCRIPTED_CME_DAYS: Record<ScenarioId, number[]> = {
  'storm-watch': [95, 200, 300],
  'andes-flood-watch': [120, 300, 450],
}

const SCRIPTED_FLARE_DAYS: Record<ScenarioId, number[]> = {
  'storm-watch': [150],
  'andes-flood-watch': [],
}

/** Game values for the instrument footprint used by the revisit model. */
const INSTRUMENT_SWATH_KM: Partial<Record<InstrumentId, number>> = {
  msi: 100,
  hri: 25,
  sar: 50,
}

const AGILE_INSTRUMENTS: InstrumentId[] = ['hri', 'sar']

const GROUND_OUTAGE_ANNUAL = 0.24 // ~2 % per month

function dailyProbability(annualProbability: number): number {
  return 1 - (1 - annualProbability) ** (1 / DAYS_PER_YEAR)
}

export function simulateMission(
  config: MissionConfig,
  scenario: ScenarioSpec,
  catalogs: Catalogs,
  players = 1,
): SimulationResult {
  const validation = validateMission(config, scenario, catalogs)
  const orbit = getOrbit(catalogs, config.orbitId)
  const instruments = getInstruments(catalogs, config.instrumentIds)
  const storage = getStorage(catalogs, config.storageId)
  const power = computePowerBreakdown(config, catalogs, scenario.durationDays)
  const link = computeLinkBreakdown(config, catalogs)
  const cost = computeCostBreakdown(config, catalogs, scenario.durationDays)

  const rng = createRng(config.seed)
  const cmeDays = SCRIPTED_CME_DAYS[scenario.id] ?? []
  const flareDays = SCRIPTED_FLARE_DAYS[scenario.id] ?? []
  const groundOutageChance = dailyProbability(GROUND_OUTAGE_ANNUAL)

  const failedOn = new Map<InstrumentId, number>()
  const aliveFraction = new Map<InstrumentId, number>()
  for (const instrument of instruments) {
    aliveFraction.set(instrument.id, 1)
  }

  const events: GameEvent[] = []
  const days: DayState[] = []

  const usableBatteryWh = power.usableBatteryWh
  let batterySocWh = usableBatteryWh
  let bufferGb = 0
  let totalGeneratedGb = 0
  let totalDeliveredGb = 0
  let lastDeficitDay = -999
  let bufferFullLogged = false

  const fixedCostUsdM = cost.hardwareUsdM + cost.marginUsdM + cost.launchUsdM
  const opsPerDayUsdM = cost.operationsUsdM / scenario.durationDays

  for (let day = 1; day <= scenario.durationDays; day += 1) {
    const cmeActive = cmeDays.some((start) => day >= start && day <= start + 2)
    const flareActive = flareDays.some((start) => day >= start && day <= start + 1)

    // Component failures (instrument-level, TRL-driven).
    for (const instrument of instruments) {
      if (failedOn.has(instrument.id)) {
        continue
      }
      if (rng.chance(dailyProbability(trlFailureProbability(instrument.trl)))) {
        failedOn.set(instrument.id, day)
        aliveFraction.set(instrument.id, (day - 1) / scenario.durationDays)
        events.push({
          id: `inst_fail-${instrument.id}-${day}`,
          day,
          type: 'inst_fail',
          role: 'science',
          severity: 'critical',
          titleKey: `event.instFail.${instrument.id}`,
        })
      }
    }

    const groundOutage = rng.chance(groundOutageChance)
    if (groundOutage) {
      events.push({
        id: `gs_outage-${day}`,
        day,
        type: 'gs_outage',
        role: 'comms',
        severity: 'warning',
        titleKey: 'event.gsOutage',
      })
    }

    // Power: seasonal variation, noise, CME degradation, battery integration.
    const seasonal = 1 + 0.05 * Math.sin((2 * Math.PI * (day - 80)) / DAYS_PER_YEAR)
    const noise = rng.range(0.95, 1.05)
    const cmeFactor = cmeActive ? 0.85 : 1
    const powerGeneratedW = power.orbitAverageGenerationW * seasonal * noise * cmeFactor
    const loadW = power.totalLoadW

    const netWh = (powerGeneratedW - loadW) * 24
    batterySocWh = Math.min(usableBatteryWh, Math.max(0, batterySocWh + netWh * 0.9))

    let deficit = false
    if (batterySocWh <= 0) {
      deficit = true
      if (day - lastDeficitDay > 30) {
        lastDeficitDay = day
        events.push({
          id: `power_deficit-${day}`,
          day,
          type: 'power_deficit',
          role: 'systems',
          severity: 'critical',
          titleKey: 'event.powerDeficit',
        })
      }
    }

    // Data generation and delivery.
    const aliveInstruments = instruments.filter((instrument) => !failedOn.has(instrument.id))
    const baseGenerated = aliveInstruments.reduce(
      (sum, instrument) => sum + instrument.dataGbPerDay,
      0,
    )
    const dutyFactor = (flareActive ? 0.5 : 1) * (deficit ? 0.5 : 1)
    const generatedGb = baseGenerated * dutyFactor
    const downlinkGb = groundOutage ? 0 : link.downlinkGbPerDay
    const deliveredGb = Math.min(downlinkGb, generatedGb + bufferGb)

    bufferGb = Math.min(storage.capacityGb, bufferGb + generatedGb - deliveredGb)
    totalGeneratedGb += generatedGb
    totalDeliveredGb += deliveredGb

    if (!bufferFullLogged && bufferGb >= storage.capacityGb * 0.95) {
      bufferFullLogged = true
      events.push({
        id: `buffer_full-${day}`,
        day,
        type: 'buffer_full',
        role: 'comms',
        severity: 'warning',
        titleKey: 'event.bufferFull',
      })
    }

    days.push({
      day,
      powerGeneratedW: Math.round(powerGeneratedW * 10) / 10,
      loadW,
      batterySocWh: Math.round(batterySocWh * 10) / 10,
      dataGeneratedGb: Math.round(generatedGb * 1000) / 1000,
      dataDownlinkedGb: Math.round(deliveredGb * 1000) / 1000,
      bufferGb: Math.round(bufferGb * 1000) / 1000,
      costSpentUsdM: Math.round((fixedCostUsdM + opsPerDayUsdM * day) * 100) / 100,
    })
  }

  // Scripted space-weather events (logged after the loop so days are stable).
  for (const day of cmeDays) {
    events.push({
      id: `cme_hit-${day}`,
      day,
      type: 'cme_hit',
      role: 'systems',
      severity: 'critical',
      titleKey: 'event.cmeHit',
    })
  }
  for (const day of flareDays) {
    events.push({
      id: `flare_x-${day}`,
      day,
      type: 'flare_x',
      role: 'science',
      severity: 'warning',
      titleKey: 'event.flareX',
    })
  }

  events.sort((a, b) => a.day - b.day || a.id.localeCompare(b.id))

  const deliveredFraction =
    totalGeneratedGb > 0 ? Math.min(1, totalDeliveredGb / totalGeneratedGb) : 1
  const outageDays = events.filter((event) => event.type === 'gs_outage').length
  const duty = Math.max(0.5, 1 - outageDays / scenario.durationDays)
  const doseKrad = orbit.radiationKradYear * (scenario.durationDays / DAYS_PER_YEAR)
  const hasStormSensor = instruments.some((instrument) => instrument.supports.includes('storm'))

  const requirements = evaluateRequirements({
    scenario,
    instruments,
    aliveFraction,
    deliveredFraction,
    duty,
    doseKrad,
    powerMarginFraction: power.marginFraction,
    lifetimeDays: validation.budgets.lifetimeDays,
    passesPerDay: link.passesPerDay,
    inclinationDeg: orbit.inclinationDeg,
  })

  const requirementFraction = new Map(requirements.map((item) => [item.id, item.fraction]))
  const scienceValue = instruments.reduce((sum, instrument) => {
    const supported = instrument.supports
      .map((tag) => {
        const requirementsWithTag = scenario.requirements.filter((requirement) =>
          (REQUIREMENT_TAGS[scenario.id]?.[requirement.id] ?? []).includes(tag),
        )
        return requirementsWithTag.length > 0
          ? Math.max(
              ...requirementsWithTag.map(
                (requirement) => requirementFraction.get(requirement.id) ?? 0,
              ),
            )
          : -1
      })
      .filter((value) => value >= 0)

    const coverage =
      supported.length > 0
        ? supported.reduce((sum, value) => sum + value, 0) / supported.length
        : 0.6
    const alive = aliveFraction.get(instrument.id) ?? 1
    return sum + instrument.scienceValue * deliveredFraction * coverage * alive
  }, 0)

  const criticalEvents = events.filter((event) => event.severity === 'critical').length
  const anomalyHandling = criticalEvents > 0 ? 0.6 : 1
  const massMargin = validation.budgets.massCapacityKg
    ? (validation.budgets.massCapacityKg - validation.budgets.massKg) /
      validation.budgets.massCapacityKg
    : 0

  const score = scoreMission(scenario, {
    requirements: requirements.filter((requirement) =>
      config.requirements.includes(requirement.id),
    ),
    scienceValue,
    budgets: validation.budgets,
    massMarginFraction: massMargin,
    powerMarginFraction: power.marginFraction,
    anomalyHandling,
    players,
  })

  const chosen = requirements.filter((requirement) => config.requirements.includes(requirement.id))
  const verdict: SimulationResult['verdict'] =
    chosen.length > 0 && chosen.every((requirement) => requirement.fraction >= 0.99)
      ? 'success'
      : chosen.some((requirement) => requirement.fraction >= 0.5)
        ? 'partial'
        : 'failure'

  return {
    config,
    days,
    events,
    decisions: [],
    requirements,
    budgets: validation.budgets,
    score,
    verdict,
    assumptions: [
      'Event dates are placeholders until the NASA DONKI cache lands.',
      'Battery, data and cost are integrated at daily resolution.',
      'Link capacity assumes a 10 deg elevation pass at maximum slant range.',
      'Instruments generate data at their nominal rate while alive.',
      hasStormSensor
        ? 'Storm sensor present.'
        : 'No storm sensor: radiation requirement is weaker.',
    ],
  }
}

interface RequirementInputs {
  scenario: ScenarioSpec
  instruments: ReturnType<typeof getInstruments>
  aliveFraction: Map<InstrumentId, number>
  deliveredFraction: number
  duty: number
  doseKrad: number
  powerMarginFraction: number
  lifetimeDays: number
  passesPerDay: number
  inclinationDeg: number
}

function evaluateRequirements(inputs: RequirementInputs): RequirementResult[] {
  const has = (tag: string) =>
    inputs.instruments.some((instrument) => instrument.supports.includes(tag))
  const alive = (id: InstrumentId) => inputs.aliveFraction.get(id) ?? 0

  const results: RequirementResult[] = []

  if (inputs.scenario.id === 'storm-watch') {
    const xrs = alive('xrs')
    results.push({
      id: 'R1',
      fraction: has('flare') ? Math.min(xrs, inputs.duty, inputs.deliveredFraction / 0.7, 1) : 0,
      met: false,
      detail: 'X-ray flare detection',
    })
    const inclinationOk = inputs.inclinationDeg >= 80
    const suvi = alive('suvi')
    results.push({
      id: 'R2',
      fraction:
        has('aurora') && inclinationOk ? Math.min(suvi, inputs.deliveredFraction / 0.6, 1) : 0,
      met: false,
      detail: 'Auroral imaging',
    })
    const gnss = alive('gnssro')
    results.push({
      id: 'R3',
      fraction:
        has('ionosphere') && inputs.passesPerDay >= 4
          ? Math.min(gnss, inputs.deliveredFraction / 0.6, 1)
          : 0,
      met: false,
      detail: 'Ionosphere over Colombia',
    })
    const stormSensor = has('storm')
    const doseOk = inputs.doseKrad < 20
    const marginOk = inputs.powerMarginFraction >= 0.15
    const conditions = [stormSensor, doseOk, marginOk].filter(Boolean).length
    results.push({
      id: 'R4',
      fraction: conditions === 3 ? 1 : conditions === 2 ? 0.5 : 0,
      met: false,
      detail: 'Storm survival',
    })
    results.push({
      id: 'R5',
      fraction: Math.min(1, inputs.deliveredFraction / 0.7),
      met: false,
      detail: 'Data delivery',
    })
    results.push({
      id: 'R6',
      fraction: Math.min(1, inputs.lifetimeDays / inputs.scenario.durationDays),
      met: false,
      detail: 'Mission lifetime',
    })
  } else {
    const bestSwath = Math.max(
      0,
      ...inputs.instruments.map((instrument) => INSTRUMENT_SWATH_KM[instrument.id] ?? 0),
    )
    const agile = inputs.instruments.some((instrument) => AGILE_INSTRUMENTS.includes(instrument.id))
    const revisit = bestSwath > 0 ? revisitHours(bestSwath, inputs.passesPerDay, agile) : 999
    results.push({
      id: 'R1',
      fraction: Math.min(1, 24 / revisit),
      met: false,
      detail: 'Daily revisit',
    })
    results.push({
      id: 'R2',
      fraction: has('allweather') ? 1 : 0,
      met: false,
      detail: 'All-weather imaging',
    })
    results.push({
      id: 'R3',
      fraction: has('highres') ? 1 : 0,
      met: false,
      detail: 'Resolution <= 100 m',
    })
    results.push({
      id: 'R4',
      fraction: Math.min(1, inputs.deliveredFraction / 0.6),
      met: false,
      detail: 'Data delivery',
    })
    results.push({
      id: 'R5',
      fraction: Math.min(1, inputs.lifetimeDays / inputs.scenario.durationDays),
      met: false,
      detail: 'Mission lifetime',
    })
  }

  return results.map((requirement) => ({
    ...requirement,
    met: requirement.fraction >= 0.99,
  }))
}
