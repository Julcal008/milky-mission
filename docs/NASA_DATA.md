# NASA data — sources, usage and caching

The challenge requires **significant** use of NASA resources. This document defines
exactly which datasets drive which game mechanics, how they are cached, and how they are
credited. Decorative use is not acceptable.

Owner: Track C (Data & Content). Update with every dataset change.

---

## 1. Datasets in use

### 1.1 NASA DONKI — space weather

| | |
|---|---|
| Source | NASA CCMC / DONKI |
| Base URL | `https://ccmc.gsfc.nasa.gov/DONKI-API/` |
| Endpoints | `/get/FLR` (flares), `/get/CME` (coronal mass ejections), `/get/GST` (geomagnetic storms) |
| Auth | None. Public endpoint, no API key required. |
| Drives | Scenario brief, event timeline (`cme_hit`, `flare_x`), radiation risk, science value of XRS/SUVI/magnetometer |
| Cache | `src/data/nasa/donki_2024_05.json` |
| Confidence | **O** (official event dates and classes) |

> **Migration (2026-09-30).** DONKI moved from `api.nasa.gov/DONKI/*` to
> `ccmc.gsfc.nasa.gov/DONKI-API/get/*`. The legacy path still documents `FLR` but returned
> `404` during the cache run, while `CME` and `GST` were intermittently redirected. The
> cache uses the new CCMC endpoints exclusively and stores the raw responses unmodified.

Reference window: **1–15 May 2024**, which includes the G5 storm (the strongest in two
decades). The game replays this sequence as the "historical" difficulty.

Event selection and mapping (`src/data/nasa/donki.ts`):

- `cme_hit` days come from **GST onsets**, not from every CME: the catalogue contains
  69 CMEs, most of which never reach Earth. We take the three highest-Kp storms.
- `flare_x` day is the strongest **X-class** flare in the window (X8.7, 2024-05-14).
- The 15-day window is scaled linearly onto `[1, durationDays]`, clamped at the edges.
  Storm Watch (365 d) → CME days 40, 235, 289; flare day 333. Andes (548 d) → 60, 352,
  434; flare day 501. Dates are official (**O**); selection and scaling are derived (**D**).

Fields used: `flrID`, `beginTime`, `peakTime`, `endTime`, `classType`, `note`;
`activityID`, `startTime`, `sourceLocation`, `cmeAnalyses[].type`, `cmeAnalyses[].speed`,
`cmeAnalyses[].halfAngle`; `gstID`, `startTime`, `allKpIndex[].kpIndex`.

### 1.2 NASA POWER — solar and cloud climatology

| | |
|---|---|
| Source | NASA LaRC POWER Project |
| Base URL | `https://power.larc.nasa.gov/api/temporal/climatology/point` |
| Parameters | `ALLSKY_SFC_SW_DWN` (surface), `TOA_SW_DWN` (top of atmosphere), `CLOUD_AMT` (cloud amount) |
| Drives | Optical vs. SAR trade-off via cloud cover; monthly surface insolation as a seasonal generation factor normalized to the annual mean; TOA kept for validation only |
| Cache | `src/data/nasa/power_neiva.json`, `src/data/nasa/power_magdalena.json` |
| Confidence | **O** (monthly climatology, 20+ year baseline) |

Points: Neiva (2.93°N, −75.28°W) and Magdalena basin centroid (7.0°N, −74.0°W).

POWER returns daily insolation in **kWh/m²/day** and cloud amount in **%**. Convert
insolation to a 24-hour mean flux with `× 1000 / 24` (`kwhPerM2DayToWPerM2` in
`src/data/nasa/power.ts`).

> **Model note.** The array is sized from cell W/m² at 1 AU and the engine already applies
> eclipse (`sunlightFraction`) and mean incidence. The simulator uses
> `surface / annual surface` (clamped to 0.9–1.15) as a **seasonal modulation**, never the
> absolute daily mean as an instantaneous flux. `cloudUsableFraction(...)` handles optical
> instruments; TOA is kept for validation.

### 1.3 NASA GIBS / Blue Marble — not used in v1.1

GIBS was evaluated for a map layer but is **not used** by the current build: the
interface draws its own vector/CSS scene and does not bundle NASA imagery. It is therefore
excluded from the submission's NASA-resources section. If a real map is added later, the
image and its product/date must be recorded here and in the provenance file.

### 1.4 NASA/JPL CNEOS — reserved

| | |
|---|---|
| Base URL | `https://ssd-api.jpl.nasa.gov/cad.api` |
| Status | **Not used in v0.1.** Kept in the provenance file because the planetary-defense scenario may return after the event. |

---

## 2. Caching procedure

1. Query the endpoint once with a date range or point locked in code.
2. Store the **raw response** plus a wrapper:

```json
{
  "source": "NASA CCMC DONKI",
  "endpoint": "https://ccmc.gsfc.nasa.gov/DONKI-API/get/{FLR,CME,GST}?startDate=2024-05-01&endDate=2024-05-15",
  "consultedAt": "2026-11-14T19:47:07Z",
  "license": "NASA public domain",
  "fields": {
    "flr": ["flrID", "beginTime", "peakTime", "endTime", "classType"],
    "cme": ["activityID", "startTime", "cmeAnalyses[].speed"],
    "gst": ["gstID", "startTime", "allKpIndex[].kpIndex"]
  },
  "data": {
    "flr": [],
    "cme": [],
    "gst": []
  }
}
```

3. Commit the file. Never fetch at runtime.
4. Record the row in `docs/DATA_PROVENANCE.md`.
5. If an endpoint changes, keep the old cache and document the change; do not silently
   reshape historical events.

## 3. Offline behaviour

- All datasets are static JSON or images in the repository.
- If a value is missing, the engine falls back to a documented nominal value and adds an
  entry to `SimulationResult.assumptions`.
- The demo must run with the network disabled.

## 4. Attribution

- In-app "Data Provenance" panel: dataset, what it drives, source URL, consultation date.
- README and submission page credit every dataset.
- No NASA logo, insignia or flag is used. Attribution is textual.
- NASA data is public domain, but the project is **not** affiliated with or endorsed by
  NASA.

## 5. What NASA data actually changes in the game

| If we removed the dataset | What would break |
|---|---|
| DONKI | The scenario loses its historical storm timeline; events would be arbitrary |
| POWER | The optical/SAR trade-off and the seasonal generation profile would be invented constants |

This is the test for "significant use": the mechanics depend on the data, not the other
way around.

## 6. Adding a dataset

1. Justify the mechanic it drives.
2. Cache it and add the provenance row.
3. Add a test that the engine reads the field correctly.
4. Update this document and `docs/GAME_DATA.md`.
