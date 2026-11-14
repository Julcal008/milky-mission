/**
 * VALIDATION — budgets and issues for a mission design.
 * Owner: Track A.
 *
 * Returns every computed budget even when the design is invalid, so the UI can keep
 * its gauges alive. Errors block nothing in the game: the player may launch at risk.
 * Source of issue codes: docs/CONTRACT.md.
 */
import { getBus, getInstruments, getLauncher, getOrbit, getPropulsion } from './catalog'
import { computeCostBreakdown } from './cost'
import { computeDataBreakdown } from './data'
import { computeLinkBreakdown } from './link'
import { computeMassBreakdown, deltaVMps, launchCapacityKg, massMarginFraction } from './mass'
import { computePowerBreakdown } from './power'
import { computeReliability } from './reliability'
import { deltaVExtensionDays, naturalLifetimeDays } from './orbit'
import { DAYS_PER_YEAR } from './units'
import type {
  BudgetSnapshot,
  Catalogs,
  MissionConfig,
  ScenarioId,
  ScenarioSpec,
  ValidationIssue,
  ValidationResult,
} from './types'
import { MAX_INSTRUMENTS } from './types'

/** Requirement id -> instrument support tags that can satisfy it. */
export const REQUIREMENT_TAGS: Record<ScenarioId, Record<string, string[]>> = {
  'storm-watch': {
    R1: ['flare'],
    R2: ['aurora'],
    R3: ['ionosphere'],
    R4: ['storm'],
    R5: [],
    R6: [],
  },
  'andes-flood-watch': {
    R1: [],
    R2: ['allweather'],
    R3: ['highres'],
    R4: [],
    R5: [],
  },
}

export const REQUIRED_REQUIREMENTS = 3
export const LOW_MASS_MARGIN = 0.2
export const LOW_POWER_MARGIN = 0.15
export const LOW_DATA_DELIVERY = 0.7
export const RADIATION_LIMIT_KRAD = 20

function emptyBudgets(scenario: ScenarioSpec): BudgetSnapshot {
  return {
    massKg: 0,
    massCapacityKg: 0,
    powerMarginW: 0,
    energyMarginWh: 0,
    dataGbPerDay: 0,
    downlinkGbPerDay: 0,
    costUsdM: 0,
    budgetUsdM: scenario.budgetUsdM,
    lifetimeDays: 0,
    reliability: 0,
  }
}

export function validateMission(
  config: MissionConfig,
  scenario: ScenarioSpec,
  catalogs: Catalogs,
): ValidationResult {
  const issues: ValidationIssue[] = []

  const unknown: string[] = []
  if (!catalogs.orbits.some((item) => item.id === config.orbitId)) {
    unknown.push(`orbit:${config.orbitId}`)
  }
  if (!catalogs.launchers.some((item) => item.id === config.launcherId)) {
    unknown.push(`launcher:${config.launcherId}`)
  }
  if (!catalogs.buses.some((item) => item.id === config.busId)) {
    unknown.push(`bus:${config.busId}`)
  }
  if (!catalogs.propulsion.some((item) => item.id === config.propulsionId)) {
    unknown.push(`propulsion:${config.propulsionId}`)
  }
  if (!catalogs.arrays.some((item) => item.id === config.arrayId)) {
    unknown.push(`array:${config.arrayId}`)
  }
  if (!catalogs.batteries.some((item) => item.id === config.batteryId)) {
    unknown.push(`battery:${config.batteryId}`)
  }
  if (!catalogs.comms.some((item) => item.id === config.commsId)) {
    unknown.push(`comms:${config.commsId}`)
  }
  if (!catalogs.groundNetworks.some((item) => item.id === config.groundNetworkId)) {
    unknown.push(`groundNetwork:${config.groundNetworkId}`)
  }
  if (!catalogs.storage.some((item) => item.id === config.storageId)) {
    unknown.push(`storage:${config.storageId}`)
  }
  for (const instrumentId of config.instrumentIds) {
    if (!catalogs.instruments.some((item) => item.id === instrumentId)) {
      unknown.push(`instrument:${instrumentId}`)
    }
  }

  if (unknown.length > 0) {
    return {
      ok: false,
      issues: unknown.map((entry) => ({
        code: 'UNKNOWN_CATALOG_ID',
        severity: 'error',
        field: entry.split(':')[0],
        messageKey: 'validation.unknownCatalogId',
        detail: { id: entry },
      })),
      budgets: emptyBudgets(scenario),
    }
  }

  const orbit = getOrbit(catalogs, config.orbitId)
  const launcher = getLauncher(catalogs, config.launcherId)
  const bus = getBus(catalogs, config.busId)
  const propulsion = getPropulsion(catalogs, config.propulsionId)
  const instruments = getInstruments(catalogs, config.instrumentIds)

  const mass = computeMassBreakdown(config, catalogs)
  const capacityKg = launchCapacityKg(launcher, orbit)
  const power = computePowerBreakdown(config, catalogs, scenario.durationDays)
  const link = computeLinkBreakdown(config, catalogs)
  const data = computeDataBreakdown(config, catalogs, link.downlinkGbPerDay)
  const cost = computeCostBreakdown(config, catalogs, scenario.durationDays)
  const reliability = computeReliability(config, catalogs, scenario.durationDays)

  const availableDeltaVMps = deltaVMps(propulsion.ispS, mass.totalKg, propulsion.propellantMaxKg)
  const lifetimeDays = Math.min(
    scenario.durationDays,
    naturalLifetimeDays(orbit.altitudeKm) +
      deltaVExtensionDays(orbit.dragMSYear, availableDeltaVMps),
  )

  const budgets: BudgetSnapshot = {
    massKg: mass.totalKg,
    massCapacityKg: capacityKg,
    powerMarginW: power.marginW,
    energyMarginWh: power.energyMarginWh,
    dataGbPerDay: data.generatedGbPerDay,
    downlinkGbPerDay: data.downlinkGbPerDay,
    costUsdM: cost.totalUsdM,
    budgetUsdM: scenario.budgetUsdM,
    lifetimeDays,
    reliability: reliability.overall,
  }

  // Structural rules
  if (config.instrumentIds.length > MAX_INSTRUMENTS) {
    issues.push({
      code: 'TOO_MANY_INSTRUMENTS',
      severity: 'error',
      field: 'instrumentIds',
      messageKey: 'validation.tooManyInstruments',
      detail: { max: MAX_INSTRUMENTS },
    })
  }

  if (config.requirements.length !== REQUIRED_REQUIREMENTS) {
    issues.push({
      code: 'WRONG_REQUIREMENT_COUNT',
      severity: 'error',
      field: 'requirements',
      messageKey: 'validation.wrongRequirementCount',
      detail: { required: REQUIRED_REQUIREMENTS, got: config.requirements.length },
    })
  }

  const scenarioRequirementIds = new Set(scenario.requirements.map((item) => item.id))
  for (const requirementId of config.requirements) {
    if (!scenarioRequirementIds.has(requirementId)) {
      issues.push({
        code: 'UNKNOWN_REQUIREMENT',
        severity: 'error',
        field: 'requirements',
        messageKey: 'validation.unknownRequirement',
        detail: { id: requirementId },
      })
    }
  }

  if (config.requirements.length !== new Set(config.requirements).size) {
    issues.push({
      code: 'DUPLICATE_REQUIREMENT',
      severity: 'error',
      field: 'requirements',
      messageKey: 'validation.duplicateRequirement',
    })
  }

  // Launch compatibility
  if (launcher.fixedOrbit && config.orbitId !== 'sso500') {
    issues.push({
      code: 'FIXED_ORBIT_MISMATCH',
      severity: 'error',
      field: 'launcherId',
      messageKey: 'validation.fixedOrbitMismatch',
      detail: { launcher: launcher.id },
    })
  }

  if (capacityKg <= 0) {
    issues.push({
      code: 'ORBIT_UNAVAILABLE',
      severity: 'error',
      field: 'launcherId',
      messageKey: 'validation.orbitUnavailable',
      detail: { launcher: launcher.id, orbit: orbit.id },
    })
  } else if (mass.totalKg > capacityKg) {
    issues.push({
      code: 'MASS_OVER_CAPACITY',
      severity: 'error',
      field: 'massKg',
      messageKey: 'validation.massOverCapacity',
      detail: { massKg: Math.round(mass.totalKg), capacityKg },
    })
  }

  const payloadMassKg = mass.instrumentsKg
  if (payloadMassKg > bus.payloadCapacityKg) {
    issues.push({
      code: 'PAYLOAD_OVER_CAPACITY',
      severity: 'error',
      field: 'instrumentIds',
      messageKey: 'validation.payloadOverCapacity',
      detail: { payloadMassKg, capacityKg: bus.payloadCapacityKg },
    })
  }

  if (cost.totalUsdM > scenario.budgetUsdM) {
    issues.push({
      code: 'BUDGET_EXCEEDED',
      severity: 'error',
      field: 'costUsdM',
      messageKey: 'validation.budgetExceeded',
      detail: {
        costUsdM: Math.round(cost.totalUsdM * 10) / 10,
        budgetUsdM: scenario.budgetUsdM,
      },
    })
  }

  // Warnings: the player may launch at risk.
  if (capacityKg > 0 && massMarginFraction(mass.totalKg, capacityKg) < LOW_MASS_MARGIN) {
    issues.push({
      code: 'MASS_MARGIN_LOW',
      severity: 'warning',
      field: 'massKg',
      messageKey: 'validation.massMarginLow',
      detail: {
        margin: Math.round(massMarginFraction(mass.totalKg, capacityKg) * 1000) / 10,
      },
    })
  }

  if (power.marginFraction < LOW_POWER_MARGIN) {
    issues.push({
      code: 'POWER_MARGIN_LOW',
      severity: 'warning',
      field: 'powerW',
      messageKey: 'validation.powerMarginLow',
      detail: { margin: Math.round(power.marginFraction * 1000) / 10 },
    })
  }

  if (power.energyMarginWh < 0) {
    issues.push({
      code: 'ENERGY_DEFICIT',
      severity: 'warning',
      field: 'energyWh',
      messageKey: 'validation.energyDeficit',
      detail: { deficitWh: Math.round(-power.energyMarginWh) },
    })
  }

  if (data.deliveredFraction < LOW_DATA_DELIVERY) {
    issues.push({
      code: 'DATA_BACKLOG',
      severity: 'warning',
      field: 'dataGbPerDay',
      messageKey: 'validation.dataBacklog',
      detail: {
        delivered: Math.round(data.deliveredFraction * 1000) / 10,
        generatedGbPerDay: Math.round(data.generatedGbPerDay * 100) / 100,
        downlinkGbPerDay: Math.round(data.downlinkGbPerDay * 100) / 100,
      },
    })
  }

  if (lifetimeDays < scenario.durationDays) {
    issues.push({
      code: 'LIFETIME_SHORT',
      severity: 'warning',
      field: 'lifetimeDays',
      messageKey: 'validation.lifetimeShort',
      detail: { lifetimeDays: Math.round(lifetimeDays), requiredDays: scenario.durationDays },
    })
  }

  const doseKrad = orbit.radiationKradYear * (scenario.durationDays / DAYS_PER_YEAR)
  if (doseKrad > RADIATION_LIMIT_KRAD) {
    issues.push({
      code: 'RADIATION_RISK',
      severity: 'warning',
      field: 'orbitId',
      messageKey: 'validation.radiationRisk',
      detail: { doseKrad: Math.round(doseKrad * 10) / 10 },
    })
  }

  if (capacityKg > 0 && capacityKg > mass.totalKg * 3) {
    issues.push({
      code: 'HEAVY_LAUNCHER',
      severity: 'info',
      field: 'launcherId',
      messageKey: 'validation.heavyLauncher',
      detail: { capacityKg, massKg: Math.round(mass.totalKg) },
    })
  }

  if (config.commsId === 'uhf' && data.generatedGbPerDay > 0.1) {
    issues.push({
      code: 'LINK_TOO_SLOW',
      severity: 'warning',
      field: 'commsId',
      messageKey: 'validation.linkTooSlow',
      detail: { generatedGbPerDay: Math.round(data.generatedGbPerDay * 100) / 100 },
    })
  }

  // Requirement support: a chosen requirement with no capable instrument is a warning.
  const supportTags = new Set(instruments.flatMap((instrument) => instrument.supports))
  const tagsByRequirement = REQUIREMENT_TAGS[scenario.id] ?? {}
  for (const requirementId of config.requirements) {
    const tags = tagsByRequirement[requirementId] ?? []
    if (tags.length > 0 && !tags.some((tag) => supportTags.has(tag))) {
      issues.push({
        code: 'REQUIREMENT_UNSUPPORTED',
        severity: 'warning',
        field: 'requirements',
        messageKey: 'validation.requirementUnsupported',
        detail: { id: requirementId },
      })
    }
  }

  return {
    ok: issues.every((issue) => issue.severity !== 'error'),
    issues,
    budgets,
  }
}
