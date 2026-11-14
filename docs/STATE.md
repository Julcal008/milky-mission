# Project state

> Live status. Update on every merge. Keep it short: five lines per section.
> Owner: Track B. Read this first, every session.

**Last update:** 2026-11-14 11:20 (America/Bogota)
**Phase:** 0 — Foundation complete · 1 — Engine contract next
**Repository:** https://github.com/Julcal008/milky-mission
**Prototype:** https://julcal008.github.io/milky-mission/ (`#/styleguide` for the design system)
**Submission deadline:** Sunday 15 Nov 2026, 23:59
**Feature freeze:** Sunday 15 Nov 2026, 10:45

---

## Done

- Repository scaffold: Vite 8 + React 19 + TypeScript 7 + Tailwind v4 + Zustand + Vitest.
- Build, typecheck, test and lint scripts; Prettier config; EditorConfig.
- Design tokens and global styles; component primitives (Button, Badge, Panel,
  ResourceBar, LogoMark); internal styleguide at `#/styleguide`.
- i18n scaffold (English default, Spanish toggle); presentation density toggle.
- Engine contract types (`src/engine/types.ts`) and unit helpers with tests.
- Collaboration docs: AGENTS, CONTRIBUTING, ARCHITECTURE, CONTRACT, GAME_DESIGN,
  GAME_DATA, DESIGN_SYSTEM, NASA_DATA, DATA_PROVENANCE, DECISIONS, SUBMISSION_EN.
- CODEOWNERS, PR template, issue templates, CI and Pages workflows.
- GitHub repository created and pushed; CI green; Pages deploy live.

## In progress

| Owner | Task | Branch |
|---|---|---|
| A | Engine implementation: mass, orbit, power, link, data, cost, reliability | `a/engine-core` |
| B | Mission design screen against fixtures | `b/design-board` |

## Next

1. A: PRNG + `simulateMission` skeleton returning fixtures; three fixture missions.
2. B: Design-screen layout with live budgets fed by fixtures.
3. A: validation codes and budgets (`validateMission`).
4. B: requirements contract screen and review panel.

## Blockers

- Second contributor GitHub handle missing → CODEOWNERS invitation cannot be sent.
- Decide whether to protect `main` with required CI (recommended once both push).

## Checkpoints

| When | Goal |
|---|---|
| Sat 11:00 | Contract frozen, UI shell running |
| Sat 12:30 | Engine integrated in the design screen |
| Sat 15:30 | Simulation + review working end to end |
| Sat 16:40 | Scope frozen |
| Sun 10:45 | Feature freeze, fixes only |
| Sun 14:00 | Project submitted |

## Conventions reminder

- Track A: `src/engine`, `src/data`. Track B: `src/app`, `src/ui`, `src/styles`, `src/store`.
- Units in names. No physics in the UI. No React in the engine.
- Update this file with every merge.
