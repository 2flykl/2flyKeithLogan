# Tiger Call — Heartbeat Timing Test Harness

## Status: DIAGNOSTIC BUILD — NOT FOR PRODUCTION

This folder is a **completely isolated** engineering diagnostic.
It does **not** modify, overwrite, or interfere with the production Tiger Call experience.

---

## Purpose

Answer one question:

> Can one known heartbeat event reliably produce one visual note that arrives at one target at exactly the correct musical time?

---

## Launch

Open in browser:
```
games/TigerCall_Heartbeat_Test/heartbeat-test.html
```

Requires a local HTTP server (not `file://`) because it fetches JSON and audio via `fetch()`.

---

## Data Sources (read-only, never modified)

| Asset | Path |
|---|---|
| Heartbeat events | `../TigerCall_StillStanding_PLX/assets/humanHeartbeatAnalysis.json` |
| Master audio | `../TigerCall_StillStanding_PLX/assets/TigerCall_RhythmSource_Clean/MASTER/TigerCall_MASTER.mp3` |
| Paw receptor images | `../TigerCall_StillStanding_PLX/assets/TigerCall_PerformanceStations_AssetPack/02_PAW_RECEPTORS/` |

These are opened **read-only**. No production files are written.

---

## Event Count

The `humanHeartbeatAnalysis.json` contains **134 heartbeat events**
spanning from **9.825 s** to **89.753 s**.

Every event must produce exactly one note. No extras. No missing.

---

## Timing Architecture

```
progress = 1 - (timeUntilHit / APPROACH_TIME)
noteY    = topY + progress * (receptorY - topY)
```

- **Authoritative clock**: `Web Audio API` — `audioCtx.currentTime - audioStartTime`
- **No pixel-per-frame accumulation** — position is always derived from remaining time
- **APPROACH_TIME**: 1.75 seconds
- **Hit windows**: PERFECT ±50ms / GREAT ±100ms / GOOD ±150ms / MISS >200ms

---

## Controls

| Key | Action |
|---|---|
| `ENTER` | Start test (manual mode) |
| `A` | Start test (auto-player mode) |
| `SPACE` | Register hit |
| `P` / `ESC` | Pause / resume |
| `Q` | Quit to results |

---

## Auto-Player Mode

Triggers input at the **exact `hitTime`** of each note.
Expected result: every note receives PERFECT judgment.
If auto-player receives inconsistent results, the timing engine has a problem.

---

## Pass Criteria

| Check | Threshold |
|---|---|
| Missing notes | 0 |
| Average timing error | ≤ 30 ms |
| Maximum clock drift | ≤ 50 ms |

---

## Files in this folder

```
heartbeat-test.html   ← sole entry point, self-contained
README.md             ← this file
```

---

## Production Safety

- This folder (`TigerCall_Heartbeat_Test/`) is entirely self-contained.
- It **reads** production assets but never writes to them.
- The production game at `TigerCall_StillStanding_PLX/` is **unchanged**.
- Do not deploy this folder as part of the main site navigation.
