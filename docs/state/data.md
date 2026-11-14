# Track C — Data & Content · status

**Owner:** @Metsus-S
**Updated:** 2026-11-14 15:25 (America/Bogota)

## Now

- Scenario domain copy in `src/content/scenarios/`: Storm Watch (r1–r6) and Andes Flood
  Watch (r1–r5), each with title, summary and brief in EN and ES.
- `scenarioContent` is keyed by locale and `ScenarioId`; keys mirror
  `scenario.<id>.rN.title` and `.description`.
- 6 tests; full suite on this branch: 99 tests.
- Catalogs v1 are in PR #12 (`data/catalogs`); DONKI/POWER are in PR #11
  (`data/nasa-cache`).

## Next (in order)

1. Track B: merge `scenarioContent[lang]` into `src/i18n` under `scenario` and render the
   Brief and Requirements screens.
2. Track A: after PR #12 merges, import `catalogs` from `@/data/catalogs` in
   `src/store/mission.ts` and delete `src/engine/__fixtures__/catalog-fixture.ts`.
3. Merge order #11 → #12 → #13; rebase #13 on `main` after #12 to resolve the small
   `docs/state/data.md` overlap.

## Blockers

- None for Track C. Wiring these strings into the UI is Track B's file (`src/i18n`).

## Editing now (lock)

- None.

## Notes

- English in `*.en.ts`; Spanish only in `*.es.ts`.
- No runtime network calls.
- Scenario copy is domain copy, not engine logic.
