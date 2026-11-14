# Track C — Data & Content · status

**Owner:** @Metsus-S
**Updated:** 2026-11-14 15:20 (America/Bogota)

## Now

- Catalogs v1 landed in `src/data/catalogs/`: 10 typed tables, `index.ts` exporting
  `catalogs: Catalogs`, and `index.test.ts` with 48 validity tests.
- Every entry keeps its `source` and `confidence`; reference rows from
  `docs/GAME_DATA.md` are pinned by tests.
- NASA DONKI and POWER caches are in PR #11 (`data/nasa-cache`), independent of this branch.

## Next (in order)

1. Track A: import `catalogs` from `@/data/catalogs` in `src/store/mission.ts` and delete
   `src/engine/__fixtures__/catalog-fixture.ts`. A owns those files.
2. Scenario content in `src/content/scenarios/` (EN + ES), with keys matching
   `scenario.<id>.rN.title` and `.description`.
3. Rebase this branch on `main` after PR #11 merges; resolve the small docs overlap in
   `DATA_PROVENANCE.md` and this file.

## Blockers

- `docs/ARCHITECTURE.md` still says `data/catalogs/*.json`; the implementation is typed
  `.ts`. The integrator should update the file map (not a Track C file).

## Editing now (lock)

- None.

## Notes

- No runtime network calls.
- Catalog tables are the only source of values for engine and UI; no magic numbers.
- `src/engine/types.ts` remains read-only.
