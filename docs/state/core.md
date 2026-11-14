# Track A — Core & Simulation · status

**Owner:** @Julcal008
**Updated:** 2026-11-14 12:10 (America/Bogota)

## Now

- Contract v0.1 frozen (`src/engine/types.ts`).
- Physical constants and unit helpers with tests.
- **Fixtures landed:** temporary catalog, baseline/naive/over-budget missions, baseline budget.
- **PRNG, mass and orbit models landed with 36 passing tests.**

## Next (in order)

1. `power.ts` + `energy.ts` (array output, eclipse, battery state).
2. `link.ts` and `data.ts` (downlink capacity and delivery fraction).
3. `cost.ts` and `reliability.ts`.
4. `validate.ts` producing `ValidationIssue[]` and `BudgetSnapshot`.
5. `store/mission.ts` selectors for the UI.

## Blockers

- None.

## Editing now (lock)

- `src/engine/{power,link,data,cost,reliability,validate}.ts` (creating).

## Notes

- `docs/CONTRACT.md` and `src/engine/types.ts` move together.
- Fixtures are the UI's only dependency on Core. They are live on `core/engine-core`.
