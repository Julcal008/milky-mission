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
- **87 tests passing**, including validity tests.
- Reference mission simulates to **861 points (grade A), verdict success**.

## Next (in order)

1. Replace placeholder CME/flare dates with the DONKI cache (Track C).
2. Wire the design screen to `useMissionStore` (Track B) and expose the simulation screen.
3. Add interactive event decisions and teamwork scoring.
4. Balance pass: naive mission should land 500-650.

## Blockers

- None.

## Editing now (lock)

- `src/engine/{score,simulator}.ts` (polish while PR #4 is reviewed).

## Notes

- `docs/CONTRACT.md` and `src/engine/types.ts` move together.
- `src/store/mission.ts` is the only UI entry point to the engine.
- The temporary catalog in `__fixtures__` is replaced when Track C lands `src/data`.
