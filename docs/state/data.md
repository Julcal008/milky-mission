# Track C — Data & Content · status

**Owner:** @Metsus-S
**Updated:** 2026-11-14 15:45 (America/Bogota)

## Now

- Scenario domain copy in `src/content/scenarios/`: Storm Watch (r1–r6) and Andes Flood
  Watch (r1–r5), each with title, summary and brief in EN and ES.
- `scenarioContent` is keyed by locale and `ScenarioId`; keys mirror
  `scenario.<id>.rN.title` and `.description`.
- Catalogs v1 are merged into `main` (#14): 10 typed tables, 48 validity tests.
- DONKI/POWER caches are merged (#11), and scenario copy is merged (#15).
- Track A wired all three: catalogs in the store, DONKI event days in the simulator and
  POWER cloud climatology for optical instruments.

## Next (in order)

1. Track B: merge `scenarioContent[lang]` into `src/i18n` under `scenario` and render the
   Brief and Requirements screens.
2. Track B: show the NASA data provenance panel using `docs/DATA_PROVENANCE.md`.
3. Track C: real-mission analogues for the report (GOES-R, SDO, ICON).

## Blockers

- None for Track C. Rendering the strings is Track B's file (`src/i18n`).

## Editing now (lock)

- None.

## Notes

- English in `*.en.ts`; Spanish only in `*.es.ts`.
- No runtime network calls.
- Scenario copy is domain copy, not engine logic.
