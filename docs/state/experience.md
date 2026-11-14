# Track B — Experience & Visual · status

**Owner:** @AngelicaHueje707-glitch
**Updated:** 2026-11-14 16:20 (America/Bogota)

## Now

- Start screen at `#/` with solarpunk treatment and the six-color palette.
- Palette tokens added additively (`jade`, `indigo`, `plum`, `mauve`, `coral`, `cream`);
  existing semantic tokens are unchanged.
- Static mission menu at `public/menuprincipal/` (HTML/CSS/JS), bilingual EN/ES,
  Fredoka bundled locally and the same six-color palette.
- “Start” / “Iniciar” opens `./menuprincipal/index.html`; “Launch” / “Despegar” stores
  `milky-mission-selection` and opens `../index.html#/design`.
- Language choice syncs with the `milky-ui` key used by the React shell.

## Next (in order)

1. App shell navigation: Brief · Design · Review · Simulate · Report (empty states).
2. Design board: orbit, bus, power, comms, science panels with live gauges.
3. Build against `src/engine/__fixtures__/` only; do not import physics.
4. Requirements contract screen (choose 3 of 6).
5. Map component with a static ground track and swath.

## Blockers

- The real "Gray Sun" typeface is not bundled; the wordmark approximates it with Space
  Grotesk and a cream → mauve → coral gradient.
- The static menu embeds mission, role and cost data inside `public/`. That content has
  no provenance and duplicates the engine fixtures; it must move to Track C catalogs.
- The static menu budget uses `Math.random()` (menu-only, not deterministic).
- The PR adds a large static asset folder; split it if the integrator enforces <300 lines.

## Editing now (lock)

- `src/app/Home.tsx`, `public/menuprincipal/`, `docs/DESIGN_SYSTEM.md`.

## Notes

- One primary action per screen. Status never color-only.
- Domain copy lives in `src/content` (Track C); interface strings live in `src/i18n`.
- Static menu assets are served unbuilt from `public/`; keep them offline-capable.
