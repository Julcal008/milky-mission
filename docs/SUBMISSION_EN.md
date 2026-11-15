# Submission (English) — NASA Space Apps Challenge 2026

Everything the platform asks for, drafted in English, plus the demo plan.
Owner: Track B. Keep this file in sync with the final project page.

---

## 1. Eligibility checklist

- [ ] All team members registered on the official platform and accepted.
- [ ] Team associated with the local Neiva event.
- [ ] Challenge selected: **Space Mission Design Game**.
- [ ] Project name, summary and technical details written in **English**.
- [ ] One public demo link (7 slides or 30-second video), no password required.
- [ ] AI use declared.
- [ ] NASA resources section completed with sources and significance.
- [ ] No NASA logos/insignia; no recognizable minors; no inappropriate content.
- [ ] **Submit for Judging** (saving progress is not submitting).
- [ ] Re-submit after any edit.
- [ ] Submitted before **Sunday 15 Nov 2026, 23:59**.

## 2. Project fields (draft)

**Project name:** Milky Mission

**Tagline:** Design the mission. Live with the consequences.

**Challenge:** Space Mission Design Game

**Short summary (≈60 words):**
> Milky Mission is a cooperative mission-design simulator. Players set an objective,
> build a spacecraft from real NASA data, choose an orbit and launch vehicle, and run a
> full year of operations. Every kilogram, watt and dollar changes what the mission can
> do — and the simulation shows exactly how.

**Problem:**
> Students learn orbital mechanics, spacecraft subsystems and mission operations as
> separate topics. They rarely experience how those decisions interact: a better
> instrument adds mass, power and data, which forces a bigger launcher, a larger budget
> and a different orbit. That gap between concepts and integrated engineering is where
> mission design actually happens.

**Solution:**
> Milky Mission compresses a complete mission into a 10–15 minute game for one to four
> players. A team picks three success requirements, designs the spacecraft within a fixed
> budget, validates mass, power, data, link and lifetime, and then simulates 365 days of
> operations. Events come from real NASA space-weather data; the final report explains
> the causal chain behind success or failure.

**Why it matters:**
> The game makes trade-offs visible and reversible: players can redesign and re-fly in
> minutes. It needs no prior space knowledge, runs offline in a browser, and uses real
> NASA data for the physics and the scenario. It is usable in classrooms, science clubs
> and outreach events.

**How it works (technical details):**
> React + TypeScript single-page app. A pure TypeScript engine computes mass
> (Tsiolkovsky), orbit (Kepler, eclipse geometry), power (irradiance, degradation,
> battery state), link budget (FSPL, C/N₀, Eb/N₀), data delivery, cost and reliability.
> The simulation is deterministic: a seed plus the mission configuration always produces
> the same result, so missions can be shared by URL. NASA DONKI events drive the
> timeline; NASA POWER cloud climatology drives the optical/SAR trade-off and its monthly
> insolation modulates seasonal generation. Role-specific challenge variants and
> decision effects are game content; the NASA DONKI anchor dates remain real. Difficulty
> (Cadet / Engineer / Flight Director) changes the number and severity of challenges.
> No backend, no accounts, works offline.

**Tools and languages:** TypeScript, React, Vite, Tailwind CSS, Zustand, Vitest,
GitHub Actions, GitHub Pages.

**AI use declaration:**
> We used AI coding assistants (OpenCode agents) to draft code, documentation and UI
> copy under human review. We also used **Gemini** to generate decorative background
> illustrations for the game screens (space and operations ambience). Every AI-generated
> image is marked in the interface with a visible **“AI-generated illustration”**
> watermark. These images are decorative only: they do not represent NASA data, hardware,
> mission results or endorsement, and contain no NASA logos, insignia or mission
> identifiers. All scientific data claims were reviewed by the team and are labelled in
> the app as official, derived, estimate or game.

**NASA resources:**
> - **NASA DONKI (CCMC):** real flare, CME and geomagnetic-storm events (May 2024)
>   generate the mission timeline and in-game anomalies.
> - **NASA POWER:** monthly cloud amount drives the optical-vs-SAR decision; monthly
>   surface insolation modulates seasonal array generation, normalized to the annual mean.
> - **NASA/NOAA GOES-R Series Data Book, Rev A (2019):** reference values for the
>   space-weather instrument classes (EXIS 30 kg / 40 W; SUVI 72 kg / 225 W peak). The
>   game uses representative smallsat-scale instruments, not these full assemblies.
> - **NASA small-spacecraft references:** used to calibrate representative subsystem
>   values.
>
> Each value in the game is tagged with its source and confidence level in the in-app
> "Model, data and assumptions" and "Why it failed" panels, and in
> `docs/DATA_PROVENANCE.md`. Spacecraft, launch-vehicle and instrument values are
> representative engineering estimates unless explicitly marked official; NASA DONKI and
> NASA POWER are official datasets.

## 3. Demo — option A (7 slides)

1. **Title** — Milky Mission, Kessler Syndrome, tagline.
2. **The problem** — concepts are taught separately; trade-offs stay abstract.
3. **The game** — one screen, four roles, three requirement choices.
4. **Live design** — add an instrument; mass, power, data and cost react.
5. **Simulation** — the May 2024 storm arrives; a role must decide.
6. **The report** — score, causal chain, what to change next time.
7. **NASA data and impact** — DONKI and POWER; classroom and local relevance.

Every slide must be readable in a screenshot; no embedded video that requires network.

## 4. Pitch script (5 minutes)

| Time | Content |
|---|---|
| 0:00–0:30 | Hook: a G5 storm, flights rerouted, and no satellite watching in time. |
| 0:30–1:15 | Problem: students learn pieces, not systems. Trade-offs stay abstract. |
| 1:15–2:00 | Solution: one screen, four roles, three requirements, one budget. |
| 2:00–3:30 | Live demo: add UV imager → mass warning → switch launcher → simulate → storm event → decision. |
| 3:30–4:15 | NASA data: DONKI timeline, POWER cloud and seasonal generation; every number labelled. |
| 4:15–4:45 | Validity: formulas, tests, reference mission, deterministic results. |
| 4:45–5:00 | Impact and next steps: classrooms, Neiva flood scenario, open source. |

## 5. Demo environment

- Run locally from `dist/` with the network disabled to prove offline behaviour.
- Second tab open with the mission link to show reproducibility.
- No live coding during the pitch; use a prepared mission and a prepared failure case.
