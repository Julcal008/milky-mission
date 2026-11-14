# Track A — Core & Simulation · status

**Owner:** @Julcal008
**Updated:** 2026-11-14 11:30 (America/Bogota)

## Now

- Contract v0.1 frozen (`src/engine/types.ts`).
- Physical constants and unit helpers with tests.
- Engine implementation not started.

## Next (in order)

1. `prng.ts` (mulberry32) + determinism test.
2. `mass.ts` and `orbit.ts` + unit and validity tests.
3. `validateMission` + `BudgetSnapshot` from catalogs.
4. Three fixtures: baseline, naive, over-budget.
5. `store/mission.ts` selectors for the UI.

## Blockers

- None.

## Editing now (lock)

- None.

## Notes

- `docs/CONTRACT.md` and `src/engine/types.ts` move together.
- Fixtures are the UI's only dependency on Core. Land them early.
