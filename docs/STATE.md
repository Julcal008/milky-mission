# Project state — checkpoint snapshot

> Updated by the integrator at each checkpoint. For live status, read the track file:
> [`core`](state/core.md) · [`experience`](state/experience.md) · [`data`](state/data.md).

**Last update:** 2026-11-14 11:30 (America/Bogota)
**Phase:** 0 — Foundation complete · 1 — Three tracks starting
**Repository:** https://github.com/Julcal008/milky-mission
**Prototype:** https://julcal008.github.io/milky-mission/ (`#/styleguide`)
**Submission deadline:** Sunday 15 Nov 2026, 23:59
**Feature freeze:** Sunday 15 Nov 2026, 10:45

---

## Completed (Phase 0)

- Repository, CI and GitHub Pages live.
- Build, typecheck, test, lint and format scripts.
- Design tokens, primitives and styleguide.
- i18n scaffold (EN default, ES toggle) and presentation density.
- Engine contract v0.1 and unit helpers with tests.
- Documentation, CODEOWNERS for three tracks, PR/issue templates.
- Collaborators invited: @AngelicaHueje707-glitch (Experience),
  @Metsus-S (Data & Content).

## Active tracks

| Track | Owner | Next milestone |
|---|---|---|
| A — Core | @Julcal008 | PRNG, mass, orbit, validation, fixtures |
| B — Experience | @AngelicaHueje707-glitch | App shell and design board against fixtures |
| C — Data | @Metsus-S | DONKI/POWER cache and catalogs v1 |

## Blockers

- Both collaborators must accept the GitHub invitation before pushing.

## Checkpoints

| When | Goal |
|---|---|
| Sat 11:00 | Contract + base catalogs frozen |
| Sat 12:30 | Engine integrated into the design screen |
| Sat 15:30 | Full flow working end to end |
| Sat 16:40 | Scope frozen |
| Sun 10:45 | Feature freeze, fixes only |
| Sun 14:00 | Project submitted |

## Merge order

**core → data → experience.** The UI always builds against the freshest contract and
catalogs.

## Reminders

- One owner per file. Do not edit outside your track.
- Units in names. No physics in the UI. No React in the engine.
- Update your `docs/state/<track>.md` when you start, block or finish something.
