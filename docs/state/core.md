# Track A — Core & Simulation · status

**Owner:** @Julcal008
**Updated:** 2026-11-14 12:45 (America/Bogota)

## Now

- Contract v0.1 frozen (`src/engine/types.ts`).
- Fixtures: temporary catalog, scenarios, baseline/naive/over-budget missions, baseline budget.
- Engine landed: PRNG, mass, orbit.
- Second layer landed: power, link, data, cost, reliability, validation and mission store.
- **79 tests passing**, including validity tests.

## Next (in order)

1. `score.ts` and `simulator.ts` (day loop, events, requirement evaluation).
2. Report data (causal chain) and `SimulationResult` fixtures for the UI.
3. Wire the design screen to the real engine through `src/store/mission.ts`.
4. Balance pass against the reference mission (expected 800-860).

## Blockers

- None.

## Editing now (lock)

- `src/engine/{score,simulator}.ts` (creating).

## Notes

- `docs/CONTRACT.md` and `src/engine/types.ts` move together.
- `src/store/mission.ts` is the only UI entry point to the engine.
- The temporary catalog in `__fixtures__` is replaced when Track C lands `src/data`.
