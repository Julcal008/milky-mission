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
- **Store action:** `useMissionStore.simulate()` returns `SimulationResult`; config changes
  clear the previous run.
- **93 tests passing**, including validity tests.
- Reference mission simulates to **861 points (grade A), verdict success**.

## Next (in order)

1. Replace placeholder CME/flare dates with the DONKI cache (Track C).
2. UI wiring: design screen reads `useMissionStore`; simulation screen uses `simulate()`.
3. Report screen: causal chain and "what if" using decision re-runs.
4. Balance pass: naive mission should land 500-650.

## Blockers

- The store test lives in `src/store/`, which the `core` agent cannot edit; it needs the
  `build` agent or Track B to add it.

## Editing now (lock)

- `src/engine/{score,simulator}.ts` (polish while PR #4 is reviewed).

## Notes

- `docs/CONTRACT.md` and `src/engine/types.ts` move together.
- `src/store/mission.ts` is the only UI entry point to the engine.
- The temporary catalog in `__fixtures__` is replaced when Track C lands `src/data`.
