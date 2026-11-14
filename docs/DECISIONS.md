# Decisions

Lightweight ADR log. New decisions go on top. Format: date · decision · why · consequence.

---

## 2026-11-14 · Three tracks + integrator

**Decision:** Split the work into A — Core & Simulation (@Julcal008), B — Experience &
Visual (@AngelicaHueje707-glitch) and C — Data & Content (@Metsus-S). A fourth
"integrator" role, held by A with the AI agent, owns repo plumbing, CI, merges and shared
documents. Introduce `src/content/` for domain copy so C does not edit `src/i18n/`.

**Why:** A layer split (engine vs UI) would leave the third person without a coherent
slice. Data and content is independent, verifiable and unblocks the other two tracks.

**Consequence:** One live state file per track; merge order core → data → experience;
CODEOWNERS per path; `package.json` and `.github/` owned by the integrator.

## 2026-11-14 · Simulation pacing

**Decision:** 365 daily steps computed instantly, played back as a ~75-second timeline
with 1×/2×/4× speeds and a "skip to next event" button.

**Why:** Players who want to think can pause; players watching a demo get a narrative.
Real-time simulation would introduce timing bugs and make the demo fragile.

**Consequence:** The engine must expose the full `DayState[]` up front; the UI is a
player, not a driver.

## 2026-11-14 · Data honesty labels

**Decision:** Every catalog value carries `source` + `confidence`
(`official | derived | estimate | game`) and is shown in "Show the math".

**Why:** Judges evaluate validity. Presenting invented numbers as official would be both
dishonest and easy to catch.

**Consequence:** Slightly more metadata to maintain; stronger submission narrative.

## 2026-11-14 · Scope: two scenarios

**Decision:** Storm Watch (space weather) and Andes Flood Watch (Colombia). Planetary
defense is out of scope.

**Why:** Planetary defense is real science (DART, NEO Surveyor) but adds a third data
pipeline and a different physics model. Two scenarios already demonstrate that the
engine generalizes.

**Consequence:** CNEOS stays in the provenance file as reserved.

## 2026-11-14 · Maximum four instruments

**Decision:** Four payload slots.

**Why:** Enough variety to create trade-offs, few enough to keep the design screen
readable and the balance testable.

**Consequence:** `MAX_INSTRUMENTS = 4` is an engine invariant.

## 2026-11-14 · Full translation, English default

**Decision:** UI and scenario copy exist in English and Spanish; English is the default
and the only language used in the submission.

**Why:** The event requires English for the project page and demo. Local judges and
participants benefit from Spanish.

**Consequence:** Every UI key must exist in both dictionaries; TypeScript enforces parity.

## 2026-11-14 · Single-screen cooperative play

**Decision:** 1–4 players share one screen and claim roles; turns pass explicitly with a
handoff button. No networking, no split screen.

**Why:** Reliable in a live demo, forces negotiation, and satisfies the collaboration
requirement without a backend.

**Consequence:** The role dock and handoff are core UI, not an afterthought.

## 2026-11-14 · No backend

**Decision:** Static site on GitHub Pages. State in `localStorage`; missions shared via
URL-encoded config.

**Why:** Zero infrastructure risk during the event; works offline; simpler privacy story.

**Consequence:** No global leaderboard; sharing is link-based.

## 2026-11-14 · Offline-first NASA data

**Decision:** Cache DONKI, POWER and imagery at build time; no runtime API calls.

**Why:** Event WiFi is unreliable and a live API failure during judging would be fatal.

**Consequence:** Data files are committed with provenance metadata and a consultation date.

## 2026-11-14 · Deterministic engine, pure TypeScript

**Decision:** `simulateMission(config, scenario, catalogs)` is pure, seeded and
React-free.

**Why:** Testability, reproducible shared missions, and parallel work between tracks.

**Consequence:** No `Math.random`, no clock, no I/O inside `src/engine`.

## 2026-11-14 · Contract-first parallel work

**Decision:** Freeze `src/engine/types.ts`, catalog shapes and the public engine API
before UI work; provide fixtures so the UI can be built against realistic data.

**Why:** Two contributors and two agents cannot wait for each other; conflicts are
prevented by boundaries, not by comments.

**Consequence:** Contract changes require a dedicated PR and a fixture update.

## 2026-11-14 · Track ownership

**Decision:** A owns `src/engine` + `src/data`; B owns `src/app`, `src/ui`, `src/styles`,
`src/store`, `src/i18n`. Shared files have a single owner.

**Why:** Directory ownership is the only reliable way to avoid overwrites.

**Consequence:** Cross-track changes go through `docs/STATE.md` and a review.

## 2026-11-14 · Visual identity

**Decision:** One dark theme, "Mission Control Dark", with a warm milk accent and ion
blue for data.

**Why:** Mission-control feel, strong contrast, readable on projectors, and distinct from
generic sci-fi neon.

**Consequence:** No light theme; presentation density mode instead.

## 2026-11-14 · Stack

**Decision:** Vite 8 + React 19 + TypeScript 7 + Tailwind v4 + Zustand + Vitest.

**Why:** Fast iteration, no backend, small bundle, familiar to both contributors.

**Consequence:** Node 24 required; lockfile owned by Track B.

## 2026-11-14 · Name and credit

**Decision:** Project name **MILKY MISSION**; team Kessler Syndrome; credit "with Laura".

**Why:** Team decision.

**Consequence:** Used consistently in UI, README, repo name and submission.
