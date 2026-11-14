# Track A — Core & Simulation · status

**Owner:** @Julcal008
**Updated:** 2026-11-14 15:36 (America/Bogota)

## Now

- Contract v0.1 frozen (`src/engine/types.ts`).
- Engine complete: PRNG, mass, orbit, power, link, data, cost, reliability, validation.
- Simulation: 365-day loop with DONKI-derived CME/flare days, component failures,
  requirement evaluation, score, verdict and assumptions.
- Decisions: per-event options, two-pass simulation (discover, choose, re-run), costs and
  anomaly handling.
- Report: causal chain, highlights, suggestions and weakest component.
- Share codec: URL-safe mission code with seed; store exposes `shareCode`/`loadShareCode`.
- **Real data wired:** store and all tests use `src/data/catalogs`; the temporary catalog
  fixture is deleted. Space-weather days come from `spaceWeatherDaysFor()`.
- **171 tests passing** (engine + data + content), including validity tests.
- Balance: reference **825 A**, naive **317 D** (fails R1), over-budget design **failure**.

## Next (in order)

1. UI wiring (Track B): design screen reads `useMissionStore`; simulate screen uses
   `simulate()`; report screen uses `buildMissionReport`.
2. Merge PR #10 (share codec) after this integration lands.
3. Use `cloudUsableFraction` for optical instruments in the Andes scenario.
4. Add the store test from the `build` agent (the `core` agent cannot write `src/store/`).

## Editing now (lock)

- None.

## Notes

- `docs/CONTRACT.md` and `src/engine/types.ts` move together.
- `src/store/mission.ts` is the only UI entry point to the engine.
- Catalog values now live only in `src/data/catalogs`; do not recreate fixtures.
