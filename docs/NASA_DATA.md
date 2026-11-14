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
| Base URL | `https://api.nasa.gov/DONKI/` |
| Endpoints | `FLR` (flares), `CME` (coronal mass ejections), `GST` (geomagnetic storms) |
| Auth | `api_key=DEMO_KEY` for development; rate-limited but sufficient for a one-time cache |
| Drives | Scenario brief, event timeline (`cme_hit`, `flare_x`), radiation risk, science value of XRS/SUVI/magnetometer |
| Cache | `src/data/nasa/donki_2024_05.json` |
| Confidence | **O** (official event dates and classes) |

Reference window: **1–15 May 2024**, which includes the G5 storm (the strongest in two
decades). The game replays this sequence as the "historical" difficulty.

Fields used: `flrID`, `beginTime`, `peakTime`, `endTime`, `classType`, `note`;
`activityID`, `startTime`, `sourceLocation`, `type`, `speed`, `halfAngle`;
`gstID`, `startTime`, `allKpIndex[].kpIndex`.

### 1.2 NASA POWER — solar and cloud climatology

| | |
|---|---|
| Source | NASA LaRC POWER Project |
| Base URL | `https://power.larc.nasa.gov/api/temporal/climatology/point` |
| Parameters | `ALLSKY_SFC_SW_DWN` (irradiance), `CLOUD_AMT` (cloud amount) |
| Drives | Solar array output; optical vs. SAR trade-off in Andes Flood Watch |
| Cache | `src/data/nasa/power_neiva.json`, `src/data/nasa/power_magdalena.json` |
| Confidence | **O** (monthly climatology, 20+ year baseline) |

Points: Neiva (2.93°N, −75.28°W) and Magdalena basin centroid (7.0°N, −74.0°W).

The engine multiplies the catalog array power by `irradiance / 1361` and applies the
cloud penalty to optical instruments (fraction of usable days).

### 1.3 NASA GIBS / Blue Marble — imagery

| | |
|---|---|
| Source | NASA EOSDIS GIBS, NASA Visible Earth |
| Usage | Bundled base map and scenario cards |
| Cache | `public/maps/earth-blue-marble.jpg` (target ≤ 1.5 MB) |
| Confidence | **O** (public-domain NASA imagery) |

No live tile requests: the demo must work without network. GIBS is credited as the source
of the imagery used, and the specific product/date is recorded in the provenance file.

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
  "source": "NASA DONKI",
  "endpoint": "https://api.nasa.gov/DONKI/CME?startDate=2024-05-01&endDate=2024-05-15",
  "consultedAt": "2026-11-14T15:20:00Z",
  "license": "NASA public domain",
  "fields": ["activityID", "startTime", "type", "speed", "halfAngle"],
  "data": []
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
| POWER | Power generation and the optical/SAR trade-off would be invented constants |
| GIBS | The map loses its real Earth context; ground tracks would float on a blank grid |

This is the test for "significant use": the mechanics depend on the data, not the other
way around.

## 6. Adding a dataset

1. Justify the mechanic it drives.
2. Cache it and add the provenance row.
3. Add a test that the engine reads the field correctly.
4. Update this document and `docs/GAME_DATA.md`.
