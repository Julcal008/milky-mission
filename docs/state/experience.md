# Track B — Experience & Visual · status

**Owner:** @AngelicaHueje707-glitch
**Updated:** 2026-11-14 17:05 (America/Bogota)

## Now

- Start screen at `#/` with solarpunk treatment and the six-color palette.
- Palette tokens added additively (`jade`, `indigo`, `plum`, `mauve`, `coral`, `cream`);
  existing semantic tokens are unchanged.
- **Brief screen at `#/brief`** with the two real scenarios (Storm Watch, Andes Flood
  Watch), real budget/duration/requirement counts and a 1–4 player selector.
- “Start” / “Inicio” opens the Brief; “Start mission” writes `scenarioId` and the player
  count to `useMissionStore`, then opens `#/design`.
- The fictional static menu (`public/menuprincipal/`) was removed. There is one React flow.
- Scenario copy comes from `src/content/scenarios`; scenario specs still come from
  `src/engine/__fixtures__/scenario-fixture.ts`.

## Next (in order)

1. Contract screen: choose exactly 3 requirements from the selected scenario.
2. Design board: orbit, bus, power, comms, science panels with live gauges.
3. Build against `useMissionStore` and `src/data/catalogs`; never compute physics.
4. Review · Simulate · Report.
5. Map component with a static ground track and swath.

## Blockers

- The real "Gray Sun" typeface is not bundled; the wordmark approximates it with Space
  Grotesk and a cream → mauve → coral gradient.
- Scenario specs (budget, duration, requirements) still live in Track A fixtures; the
  Brief reads them read-only until they move to `src/data` or the store.

## Editing now (lock)

- `src/app/{Brief,Home,App}.tsx`, `src/i18n/`, `docs/DESIGN_SYSTEM.md`.

## Notes

- One primary action per screen. Status never color-only.
- Domain copy lives in `src/content` (Track C); interface strings live in `src/i18n`.
- No parallel static game: the menu and the design board share the same store.
