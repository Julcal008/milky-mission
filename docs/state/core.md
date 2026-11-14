# Track A — Core & Simulation · status

**Owner:** @Julcal008
**Updated:** 2026-11-14 12:45 (America/Bogota)

## Now

- Contract v0.1 frozen (`src/engine/types.ts`).
- Fixtures: temporary catalog, scenarios, baseline/naive/over-budget missions, baseline budget.
- Engine landed: PRNG, mass, orbit.
- Second layer landed: power, link, data, cost, reliability, validation and mission store.
- **Simulation landed:** deterministic 365-day loop, scripted CME/flare events, component
  failures, requirement evaluation, score, verdict and assumptions.
- **Interactive decisions landed:** `decisions.ts` options per event, two-pass simulation
  (discover, choose, re-run), decision costs and anomaly handling.
- **Report model landed:** `report.ts` builds the causal chain, highlights, suggestions
  from validation issues and the weakest score component.
- **Store action:** `useMissionStore.simulate()` returns `SimulationResult` and stores
  `report`; config changes clear both.
- **99 tests passing**, including validity tests.
- **Share codec** (`share.ts`): URL-safe base64 of the full config with seed; store
  exposes `shareCode()` and `loadShareCode()`.
- **Partial science credit:** an instrument still contributes science when its
  requirement is only partially met (35 % floor), so failure reports are informative.
- **104 tests passing**, including validity tests.
- **UI fixtures:** `result-baseline.json` (365 day states) and `report-baseline.json`
  for Track B to build the simulation and report screens without waiting.
- Balance: reference **825 A** without decisions; naive **317 D** (power deficit, fails
  R1); over-budget design is a blocking error and simulates as **failure**.

## Next (in order)

1. Replace placeholder CME/flare dates with the DONKI cache (Track C).
2. UI wiring: design screen reads `useMissionStore`; simulation screen uses `simulate()`;
   report screen uses `buildMissionReport`.
3. Balance a middle-tier mission (expected 500-650) to tighten the grade curve.
4. Add the store test from the `build` agent (the `core` agent cannot write `src/store/`).

## Editing now (lock)

- `src/engine/{score,simulator}.ts` (polish while PR #4 is reviewed).

## Notes

- `docs/CONTRACT.md` and `src/engine/types.ts` move together.
- `src/store/mission.ts` is the only UI entry point to the engine.
- The temporary catalog in `__fixtures__` is replaced when Track C lands `src/data`.
