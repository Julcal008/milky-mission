/**
 * MILKY MISSION — core types (v0.1 contract).
 * Owner: Track A (Simulation). Changes to this file require a PR and an update
 * to docs/CONTRACT.md in the same commit.
 *
 * Rule: this file contains NO logic. Only types and literal unions.
 * Every physical quantity carries its unit in the name.
 */

/** How much we trust a catalog value. Shown in the "Show the math" panel. */
export type Confidence = 'official' | 'derived' | 'estimate' | 'game'

export interface Provenance {
  /** Human-readable source, e.g. "NASA/NOAA GOES-R Series Data Book". */
  source: string
  confidence: Confidence
  /** Optional clarifying note, e.g. "range 80-100 kg depending on vendor". */
  note?: string
}

/* ------------------------------------------------------------------ */
/* Identifiers                                                         */
/* ------------------------------------------------------------------ */

export type ScenarioId = 'storm-watch' | 'andes-flood-watch'
export type RoleId = 'director' | 'systems' | 'science' | 'comms'

export type OrbitId = 'sso500' | 'sso700' | 'leo400' | 'leo550eq'
export type LauncherId = 'rideshare' | 'electron' | 'firefly' | 'vegac' | 'f9'
export type BusId = 'cubesat12u' | 'micro' | 'small'
export type PropulsionId = 'none' | 'coldgas' | 'mono' | 'green'
export type ArrayId = 'si' | 'gaas'
export type BatteryId = 'b300' | 'b800' | 'b1600'
export type CommsId = 'uhf' | 'sband' | 'xband' | 'ka'
export type GroundNetworkId = 'neiva' | 'regional' | 'dsn'
export type StorageId = 's4' | 's16' | 's64'

export type InstrumentId =
  'xrs' | 'suvi' | 'mag' | 'proton' | 'gnssro' | 'msi' | 'hri' | 'sar' | 'ais' | 'lidar'

/** Hard limit agreed with design: four payload slots. */
export const MAX_INSTRUMENTS = 4

/* ------------------------------------------------------------------ */
/* Draft (player input before the design is complete)                  */
/* ------------------------------------------------------------------ */

/**
 * The UI edits a draft: every choice starts empty and the engine only runs
 * once the draft can be turned into a complete MissionConfig.
 */
export interface MissionDraft {
  scenarioId?: ScenarioId
  seed: number
  orbitId?: OrbitId
  launcherId?: LauncherId
  busId?: BusId
  propulsionId?: PropulsionId
  arrayId?: ArrayId
  arrayAreaM2?: number
  batteryId?: BatteryId
  commsId?: CommsId
  groundNetworkId?: GroundNetworkId
  storageId?: StorageId
  instrumentIds: InstrumentId[]
  requirements: string[]
}

/* ------------------------------------------------------------------ */
/* Mission configuration (player input)                                */
/* ------------------------------------------------------------------ */

export interface MissionConfig {
  scenarioId: ScenarioId
  /** Deterministic simulation seed. Shared missions reproduce exactly. */
  seed: number

  orbitId: OrbitId
  launcherId: LauncherId
  busId: BusId
  propulsionId: PropulsionId
  arrayId: ArrayId
  /** 0.6 | 1.2 | 2.0 | 3.5 — validated by the engine. */
  arrayAreaM2: number
  batteryId: BatteryId
  commsId: CommsId
  groundNetworkId: GroundNetworkId
  storageId: StorageId

  instrumentIds: InstrumentId[]
  /** Exactly three requirement ids from the scenario. */
  requirements: string[]
}

/* ------------------------------------------------------------------ */
/* Catalog specifications                                              */
/* ------------------------------------------------------------------ */

export interface LauncherSpec extends Provenance {
  id: LauncherId
  name: string
  capacityKg: { leo400: number; sso500: number; sso700: number }
  fairingM3: number
  costUsdM: number
  /** Fixed orbit: rideshare cannot be re-targeted. */
  fixedOrbit?: boolean
  scheduleRisk?: number
}

export interface OrbitSpec extends Provenance {
  id: OrbitId
  name: string
  altitudeKm: number
  inclinationDeg: number
  /** Atmospheric drag budget, m/s per year at nominal solar activity. */
  dragMSYear: number
  /** Total ionizing dose behind 3 mm aluminium, krad per year. */
  radiationKradYear: number
}

export interface BusSpec extends Provenance {
  id: BusId
  name: string
  dryMassKg: number
  payloadCapacityKg: number
  payloadVolumeM3: number
  /** Orbit-average power available to the whole spacecraft, W. */
  busPowerW: number
  costUsdM: number
  reliabilityPerYear: number
}

export interface PropulsionSpec extends Provenance {
  id: PropulsionId
  name: string
  dryMassKg: number
  propellantMaxKg: number
  ispS: number
  costUsdM: number
}

export interface ArraySpec extends Provenance {
  id: ArrayId
  name: string
  /** Specific power at beginning of life, W per m² at normal incidence. */
  powerWPerM2: number
  degradationPerYear: number
  massKgPerM2: number
  costUsdMPerM2: number
}

export interface BatterySpec extends Provenance {
  id: BatteryId
  name: string
  capacityWh: number
  massKg: number
  costUsdM: number
  /** Maximum depth of discharge, 0..1. */
  maxDoD: number
}

export interface CommsSpec extends Provenance {
  id: CommsId
  name: string
  band: string
  txPowerW: number
  antennaGainDbi: number
  maxRateMbps: number
  massKg: number
  costUsdM: number
}

export interface GroundNetworkSpec extends Provenance {
  id: GroundNetworkId
  name: string
  stations: number
  /** Multiplier applied to the nominal passes per day. */
  passesMultiplier: number
  costUsdM: number
}

export interface StorageSpec extends Provenance {
  id: StorageId
  name: string
  capacityGb: number
  massKg: number
  costUsdM: number
}

export interface InstrumentSpec extends Provenance {
  id: InstrumentId
  name: string
  massKg: number
  powerW: number
  costUsdM: number
  dataGbPerDay: number
  /** Science value used by the scoring model, 0..40. */
  scienceValue: number
  /** Technology readiness level: drives failure probability. */
  trl: 5 | 6 | 7 | 8 | 9
  /** Requirement ids this instrument can satisfy. */
  supports: string[]
}

/* ------------------------------------------------------------------ */
/* Scenarios and catalogs                                              */
/* ------------------------------------------------------------------ */

/** Version of the public contract. Bump when a signature or invariant changes. */
export const CONTRACT_VERSION = '0.1'

export type Difficulty = 'cadet' | 'engineer' | 'flight-director'

export interface RequirementSpec {
  id: string
  /** Points awarded when the requirement is fully met (0..120). */
  weight: number
  /** i18n keys; the engine never contains user-facing copy. */
  titleKey: string
  descriptionKey: string
}

export interface ScenarioSpec {
  id: ScenarioId
  budgetUsdM: number
  durationDays: number
  launchWindowDays: number
  instrumentSlots: number
  /** Denominator used to normalize the science component. */
  scienceNormalization: number
  requirements: RequirementSpec[]
}

export interface Catalogs {
  orbits: OrbitSpec[]
  launchers: LauncherSpec[]
  buses: BusSpec[]
  propulsion: PropulsionSpec[]
  arrays: ArraySpec[]
  batteries: BatterySpec[]
  comms: CommsSpec[]
  groundNetworks: GroundNetworkSpec[]
  storage: StorageSpec[]
  instruments: InstrumentSpec[]
}

/* ------------------------------------------------------------------ */
/* Validation                                                          */
/* ------------------------------------------------------------------ */

export interface BudgetSnapshot {
  massKg: number
  massCapacityKg: number
  powerMarginW: number
  energyMarginWh: number
  dataGbPerDay: number
  downlinkGbPerDay: number
  costUsdM: number
  budgetUsdM: number
  lifetimeDays: number
  /** 0..1 series reliability over the mission life. */
  reliability: number
}

export interface ValidationIssue {
  /** Stable machine code, e.g. "MASS_OVER_CAPACITY". */
  code: string
  severity: 'error' | 'warning' | 'info'
  field: keyof MissionConfig | string
  /** i18n key resolved by the UI. */
  messageKey: string
  detail?: Record<string, number | string>
}

export interface ValidationResult {
  /** False if any issue has severity 'error'. */
  ok: boolean
  issues: ValidationIssue[]
  /** Computed even when invalid, so the UI can keep its gauges alive. */
  budgets: BudgetSnapshot
}

/* ------------------------------------------------------------------ */
/* Simulation output (engine result)                                   */
/* ------------------------------------------------------------------ */

export interface DayState {
  day: number
  powerGeneratedW: number
  loadW: number
  batterySocWh: number
  dataGeneratedGb: number
  dataDownlinkedGb: number
  bufferGb: number
  costSpentUsdM: number
}

export interface GameEvent {
  id: string
  day: number
  type: string
  /** Role that must make the decision. */
  role: RoleId
  severity: 'info' | 'warning' | 'critical'
  /** i18n key; UI resolves it to English/Spanish copy. */
  titleKey: string
}

export interface DecisionLog {
  eventId: string
  day: number
  role: RoleId
  optionId: string
  costUsdM: number
}

export interface RequirementResult {
  id: string
  met: boolean
  /** 0..1, allows partial credit. */
  fraction: number
  detail: string
}

export interface ScoreBreakdown {
  missionSuccess: number
  science: number
  efficiency: number
  robustness: number
  teamwork: number
  total: number
  grade: 'S' | 'A' | 'B' | 'C' | 'D'
}

export interface SimulationResult {
  config: MissionConfig
  days: DayState[]
  events: GameEvent[]
  decisions: DecisionLog[]
  requirements: RequirementResult[]
  budgets: BudgetSnapshot
  score: ScoreBreakdown
  verdict: 'success' | 'partial' | 'failure'
  /** Non-fatal notes, e.g. simplifications applied at run time. */
  assumptions: string[]
}
