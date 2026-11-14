# Engine contract (v0.1)

Source of truth for types: [`src/engine/types.ts`](../src/engine/types.ts).
This document explains **how to use** them. If code and this document disagree, the
document wins until the PR that changes both is merged.

Owner: Track A. Every change here requires a PR and a matching update to
`src/engine/types.ts` and the fixtures.

---

## 1. Units

| Quantity | Type suffix | Unit |
|---|---|---|
| Mass | `...Kg` | kilograms |
| Power | `...W` | watts |
| Energy | `...Wh` | watt-hours |
| Data volume | `...Gb` | gigabits |
| Data rate | `...Mbps` | megabits per second |
| Cost | `...UsdM` | millions of US dollars |
| Distance / altitude | `...Km` | kilometers |
| Velocity budget | `...MS` | meters per second |
| Angle | `...Deg` | degrees |
| Time | `...Days`, `...S` | days or seconds |
| Fraction | `0..1` | explicit in the docstring |

No bare `number` for a physical quantity unless it is an index or a count.

## 2. Public API

The engine exposes three pure functions. Everything else is internal.

```ts
/** Blocking errors and non-blocking warnings for a mission design. */
export function validateMission(
  config: MissionConfig,
  scenario: ScenarioSpec,
  catalogs: Catalogs,
): ValidationResult

/** Full deterministic simulation. Pure: no I/O, no clock, no randomness beyond seed. */
export function simulateMission(
  config: MissionConfig,
  scenario: ScenarioSpec,
  catalogs: Catalogs,
  players?: number, // 1 = solo, 2..4 = team; defaults to 1
  decisions?: DecisionChoice[], // eventId -> optionId; empty for a first pass
): SimulationResult

/** Pure scoring pass. Called by simulateMission; exported for tests and reports. */
export function scoreMission(
  scenario: ScenarioSpec,
  inputs: ScoreInputs,
): ScoreBreakdown
```

`ScoreInputs` carries the requirement results, raw science value, budget snapshot,
mass and power margins, anomaly handling and player count. `SimulationResult` includes
`budgets: BudgetSnapshot` so the report does not re-run validation.

## 2.1 UI integration (Track B)

The UI never imports engine formulas. It uses the mission store:

```ts
import { useMissionStore } from '@/store/mission'
import { decisionOptionsFor } from '@/engine/decisions'

// Design screen
const config = useMissionStore((state) => state.config)
const validation = useMissionStore((state) => state.validation)
const setConfig = useMissionStore((state) => state.setConfig)
setConfig({ orbitId: 'sso700' }) // validation recomputes synchronously

// Review screen
validation.ok          // false if any blocking error
validation.issues      // { code, severity, messageKey, detail }
validation.budgets     // gauges read from here

// Simulation screen
const simulate = useMissionStore((state) => state.simulate)
const simulation = simulate() // SimulationResult
simulation.events.forEach((event) => decisionOptionsFor(event.type))

// Player chooses an option for an event, then re-runs deterministically:
useMissionStore.getState().setDecision(event.id, optionId)
const updated = useMissionStore.getState().simulate()

// Team mode
useMissionStore.getState().setPlayers(4)
```

Rules:

- `setConfig` clears the previous simulation and decisions. Run the simulation again.
- The first simulation pass discovers events; the second applies the chosen options.
- Never compute mass, power, link or score in a component.
- Every `messageKey` and decision `labelKey` must exist in `src/i18n/{en,es}.ts`.

Supporting types (already declared in `src/engine/types.ts`):

```ts
export interface ValidationIssue {
  code: string                 // stable machine code, e.g. "MASS_OVER_CAPACITY"
  severity: 'error' | 'warning' | 'info'
  field: keyof MissionConfig | string
  messageKey: string           // i18n key; UI resolves EN/ES
  detail?: Record<string, number | string>
}

export interface ValidationResult {
  ok: boolean                  // false if any severity === 'error'
  issues: ValidationIssue[]
  budgets: BudgetSnapshot      // computed even when invalid, for live UI gauges
}

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
  reliability: number          // 0..1
}
```

## 3. Invariants

These must always hold. Each one needs a test.

1. `0 <= score.total <= 1000`, and `score.total` equals the sum of its components.
2. `config.instrumentIds.length <= MAX_INSTRUMENTS` (4).
3. `config.requirements.length === 3` and ids belong to the scenario.
4. Catalog lookups never return `undefined`: unknown ids are a validation error.
5. Mass, power, cost and data budgets are additive: adding a component never decreases
   the total for that resource.
6. Adding an instrument never increases the power margin.
7. Raising altitude never increases atmospheric drag.
8. Increasing slant range never increases downlink rate.
9. Battery state of charge stays within `[0, capacityWh]`; deficits are reported.
10. Same `(config, scenario, catalogs)` → byte-identical `SimulationResult` JSON.
11. Every numeric catalog entry has a non-empty `source` and a `confidence`.
12. A mission with `ok: false` may still be simulated (risk is allowed), but the report
    marks it as a design violation.

## 4. Validation codes (initial set)

| Code | Severity | Meaning |
|---|---|---|
| `MASS_OVER_CAPACITY` | error | Spacecraft mass exceeds launcher capacity for the orbit |
| `VOLUME_OVER_FAIRING` | error | Payload volume exceeds fairing |
| `PAYLOAD_OVER_CAPACITY` | error | Instrument mass exceeds bus payload capacity |
| `BUDGET_EXCEEDED` | error | Cost above scenario budget |
| `TOO_MANY_INSTRUMENTS` | error | More than 4 instruments |
| `WRONG_REQUIREMENT_COUNT` | error | Not exactly 3 requirements |
| `FIXED_ORBIT_MISMATCH` | error | Rideshare selected with a non-fixed orbit |
| `MASS_MARGIN_LOW` | warning | Margin < 20 % |
| `POWER_MARGIN_LOW` | warning | Orbit-average margin < 15 % |
| `DATA_BACKLOG` | warning | Generated data > downlink capacity |
| `LIFETIME_SHORT` | warning | Δv does not cover the required mission life |
| `RADIATION_RISK` | warning | Dose above the scenario threshold |
| `HEAVY_LAUNCHER` | info | Launcher capacity > 3× spacecraft mass (overpaying) |

Codes are stable. Adding a code is additive; renaming is a breaking change.

## 5. Determinism and PRNG

- `src/engine/prng.ts` exports `createRng(seed: number)` returning `next(): number` in
  `[0, 1)` and `int(maxExclusive: number)`.
- Recommended algorithm: mulberry32. Do not change it after missions are shared.
- Simulation steps 1 day at a time, `day = 1..365` (or the scenario's `durationDays`).
- Random draws happen in a fixed order: environment → component failures → operator
  decisions. Any change to that order is a breaking change.

## 6. Fixtures

`src/engine/__fixtures__/` contains JSON snapshots used by UI development and tests:

| Fixture | Purpose |
|---|---|
| `mission-baseline.json` | The reference Storm Watch mission (expected score 800–860) |
| `mission-naive.json` | Cheap, under-designed mission (expected score 500–650) |
| `mission-overbudget.json` | Valid physics, over budget (validation error) |
| `result-baseline.json` | Expected simulation result for UI development |

Rules:

- The UI may import fixtures while the engine is being built. Never ship fixture data
  as if it were a real simulation.
- Fixtures are regenerated only by a PR that explains why the expected numbers changed.

## 7. Error handling

- The engine never throws for user input. Invalid input returns issues.
- Programming errors (unknown catalog id in a code path that skipped validation) may
  throw, with a message that names the id.
- The engine never logs. The UI decides what to show.

## 8. Versioning

`CONTRACT_VERSION = '0.1'` lives in `src/engine/types.ts`. Bump it when a public
signature or an invariant changes, and record the reason in `docs/DECISIONS.md`.
