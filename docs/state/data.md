# Track C — Data & Content · status

**Owner:** @Metsus-S
**Updated:** 2026-11-14 11:30 (America/Bogota)

## Now

- Repository invitation sent; waiting for acceptance.
- Catalog tables specified in `docs/GAME_DATA.md` (v0.1).
- No data files cached yet.

## Next (in order)

1. Cache NASA DONKI (1–15 May 2024) into `src/data/nasa/donki_2024_05.json` with wrapper
   metadata (source, endpoint, consultedAt, fields).
2. Cache NASA POWER climatology for Neiva and the Magdalena basin.
3. Catalogs v1 in `src/data/catalogs/`: orbits, launchers, buses, propulsion, arrays,
   batteries, comms, ground networks, storage, instruments.
4. Storm Watch scenario in `src/content/scenarios/` (EN + ES).
5. Provenance rows for every cached value.

## Blockers

- Waiting for GitHub invitation acceptance.
- Catalog TypeScript types are frozen by Track A; read `src/engine/types.ts` before writing
  JSON. Do not edit that file.

## Editing now (lock)

- None.

## Notes

- No runtime network calls: everything is cached in the repository.
- Label every value `official`, `derived`, `estimate` or `game`.
