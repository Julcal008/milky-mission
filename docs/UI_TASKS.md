# UI tasks — three machines, one demo

Frozen scope: Home, Brief, Design, Review, Simulate, Report. Role handoff is implemented;
role tokens, analogues and leaderboards remain roadmap.

## Ownership

| Person | Files | Screen |
|---|---|---|
| **Angelica** | `src/app/App.tsx`, `Home.tsx`, `Brief.tsx`, `routes.ts`, `src/ui/menu/*`, `src/i18n/menu.*` | Home, Brief, shell |
| **You (@Julcal008)** | `src/app/screens/Design.tsx`, `Review.tsx`, `src/ui/game/*`, `src/i18n/game.*` | Design, Review |
| **Miguel (@Metsus-S)** | `src/app/screens/Simulate.tsx`, `Report.tsx`, `src/ui/ops/*`, `src/i18n/ops.*` | Simulate, Report |
| **Integrator** | `src/i18n/en.ts`, `es.ts`, `docs/UI_TASKS.md`, merges, QA | — |

Nobody edits another owner's file. `App.tsx` and `routes.ts` are Angelica's.
Shared primitives (`Button`, `Badge`, `Panel`, `ResourceBar`) are frozen; create
new components in your own folder.

## Setup per machine

```bash
git switch main && git pull
git config --local core.hooksPath .githooks
git config --local milky.track experience            # Angelica
git config --local milky.track all                   # you
git config --local milky.track data,experience       # Miguel
```

Select the `experience` agent in OpenCode while editing UI.

## Contracts

- Every screen reads state from `useMissionStore` and `useI18n`; no props.
- Navigation is `window.location.hash = '#/...'`.
- Design: `config`, `validation`, `setConfig`; catalogs from `@/data/catalogs`;
  requirement copy from `scenarioContent[lang][scenarioId]`; specs from
  `scenarioFixtures`.
- Review: `validation`, `simulate()`, then navigate to `#/simulate`.
- Simulate: `simulation`, `decisionOptionsFor(event.challengeId)`, `applyDecision`,
  then navigate to `#/report`. Role dock and handoff are Track A UI state.
- Report: `report`, `simulation`, `shareCode`.
- Units are explicit. No number without a unit. No physics in any screen.

## Acceptance criteria

### Design
- [ ] Orbit, launcher, bus, propulsion, array, area, battery, comms, network,
      storage can be changed.
- [ ] Up to 4 instruments can be added/removed.
- [ ] Exactly 3 requirements can be selected.
- [ ] Six gauges update on every change: mass, power, budget, data, link, time.
- [ ] Validation issues are visible with severity.
- [ ] "Review mission" navigates to `#/review`.

### Review
- [ ] Budgets, chosen requirements and all validation issues render.
- [ ] "Simulate mission" runs `simulate()` and navigates to `#/simulate`.
- [ ] "Back to design" returns to `#/design`.

### Simulate
- [ ] 365-day timeline or a readable summary from `simulation.days`.
- [ ] Events listed with day, role and severity.
- [ ] Selecting an event shows its options from `decisionOptionsFor`.
- [ ] A decision calls `setDecision` and re-runs `simulate()`.
- [ ] "View report" navigates to `#/report`.

### Report
- [ ] Total score and component breakdown.
- [ ] Requirement results with met/partial/failed.
- [ ] Causal chain from `report.steps`.
- [ ] Suggestions from `report.suggestions`.
- [ ] "Share mission" copies the URL built from `shareCode()`.

### Global
- [ ] EN and ES complete; no missing keys.
- [ ] No console errors in `npm run build` + preview.
- [ ] Works at 1024 px and 1440 px.
- [ ] Keyboard reachable, focus visible, status not color-only.
