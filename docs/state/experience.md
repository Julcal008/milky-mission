# Track B — Experience & Visual · status

**Owner:** @AngelicaHueje707-glitch
**Updated:** 2026-11-15 11:55 (America/Bogota)

## Now

- Start screen at `#/` with the solarpunk treatment and the six-color palette.
- **Wordmark:** Fredoka 700 bundled locally (`src/styles/fonts/fredoka-latin.woff2`,
  OFL), moving pink → yellow → cyan → violet gradient, soft blue glow, reduced-motion
  aware. The gradient is intentionally outside the six-color palette (user request).
- **Ported backdrop:** deterministic starfield, moon, six planets, two satellites and
  Earth in `src/ui/menu/MenuBackground.tsx` (palette-only, aria-hidden, reduced-motion
  aware, pointer parallax).
- **Rounding pass:** scenario cards and bottom panel `rounded-3xl`, pill “Selected”
  badge, and a 40 px circular player selector (`MenuPanel` in `src/ui/menu/`).
- Palette tokens added additively (`jade`, `indigo`, `plum`, `mauve`, `coral`, `cream`);
  existing semantic tokens are unchanged.
- **Field guide:** global drawer opened from the header “?” and the Brief card. Tabs:
  Basics, Components, Risks, Glossary, Model. Search, focus trap, Esc, scroll lock.
  Component cards use `ComponentMeta`; risk cards map validation codes to what/fix.
  Copy lives in `src/i18n/menu.*`; stats/provenance from `src/data/catalogs`.
- **Brief screen at `#/brief`** with the two real scenarios (Storm Watch, Andes Flood
  Watch), real budget/duration/requirement counts and a 1–4 player selector.
- “Start” / “Inicio” opens the Brief; “Start mission” writes `scenarioId` and the player
  count to `useMissionStore`, then opens `#/design`.
- The fictional static menu (`public/menuprincipal/`) was removed. There is one React flow.
- Scenario copy comes from `src/content/scenarios`; scenario specs still come from
  `src/engine/__fixtures__/scenario-fixture.ts`.

## Next (in order)

1. Contextual “Learn more” links in Design/Review/Simulate (owners add them; the guide
   exposes `openGuide(tab)`).
2. Guided tour with spotlight in Design if time allows.
3. Move per-item component prose to `src/content` (Track C) if there is time before freeze.
4. Final QA at 1024/1440 and feature freeze.

## Blockers

- `docs/UI_TASKS.md` froze the scope without a glossary; the Field Guide extends it. The
  integrator must accept this in the PR.
- Scenario specs (budget, duration, requirements) still live in Track A fixtures; the
  Brief reads them read-only until they move to `src/data` or the store.

## Editing now (lock)

- `src/ui/menu/{FieldGuide,GuideButton}.tsx`, `src/store/ui.ts`,
  `src/app/{App,Brief}.tsx`, `src/i18n/menu.*`, `docs/DESIGN_SYSTEM.md`.

## Notes

- One primary action per screen. Status never color-only.
- Domain copy lives in `src/content` (Track C); interface strings live in `src/i18n`.
- No parallel static game: the menu and the design board share the same store.
- Field-guide copy is UI copy for now; per-item prose can move to Track C later.
