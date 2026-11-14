# Track C — Data & Content · status

**Owner:** @Metsus-S
**Updated:** 2026-11-14 15:05 (America/Bogota)

## Now

- DONKI cache landed: `src/data/nasa/donki_2024_05.json` (raw FLR/CME/GST for
  2024-05-01..15) with the provenance wrapper.
- Derived timeline in `src/data/nasa/donki.ts`: `spaceWeatherDaysFor(durationDays)`.
  Selection: top-3 GST by max Kp + strongest X-class flare (X8.7), scaled linearly.
  Storm Watch (365 d) → CME 40/235/289, flare 333. Andes (548 d) → 60/352/434, flare 501.
- 11 unit tests in `src/data/nasa/donki.test.ts`; typecheck green.
- NASA migrated DONKI to `ccmc.gsfc.nasa.gov/DONKI-API/get/*` on 2026-09-30. The legacy
  `api.nasa.gov/DONKI/FLR` returned 404 during the run; the new endpoint needs no key.
- POWER cache landed for Neiva and Magdalena: `src/data/nasa/power_neiva.json` and
  `power_magdalena.json` (surface, TOA and cloud with wrapper). `src/data/nasa/power.ts`
  exposes `POWER_SITES`, `kwhPerM2DayToWPerM2` and `cloudUsableFraction`; 7 tests.

## Next (in order)

1. Handoff to Track A: replace `SCRIPTED_CME_DAYS` / `SCRIPTED_FLARE_DAYS` in
   `src/engine/simulator.ts` with `spaceWeatherDaysFor(scenario.durationDays)` and drop
   the placeholder assumption. A owns that file.
2. Handoff to Track A: use `cloudUsableFraction` for optical instruments and keep
   `irradianceFactor` near 1 (daily insolation must not feed the array model).
3. Catalogs v1 in `src/data/catalogs/` as typed `.ts`, every entry with `source` and
   `confidence`, plus a validity test.
4. Scenario content in `src/content/scenarios/` (EN + ES).
5. Provenance rows for every cached value.

## Blockers

- None for Track C. Track A still needs to wire the derived days and the cloud fraction.
- `src/engine/types.ts` stays read-only; catalog shapes must match it.

## Editing now (lock)

- None.

## Notes

- No runtime network calls: everything is cached in the repository.
- Label every value `official`, `derived`, `estimate` or `game`.
- The test reads the cache with `?raw`, so the app does not bundle the raw JSON.
- `format:check` would expand the 287 KB raw cache. CI does not run it; the integrator
  may add `src/data/nasa/*.json` to `.prettierignore` if that changes.
