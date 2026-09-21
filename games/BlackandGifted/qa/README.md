# Browser regression

Requirements: Node.js, the `playwright` package, and Microsoft Edge. Serve the game directory at `http://127.0.0.1:8765/` (or set `BG_GAME_URL` to an alternative URL ending in `/`).

From the game directory, run:

```
node qa/regression.cjs
node qa/extended-regression.cjs
```

Results and screenshots are written to `outputs/` in the current working directory. The extended suite also verifies the alternate HTML via a file URL; override `BG_GAME_FILE` if required. Tests exercise real browser rendering, input, media, and deterministic scene progression through the opt-in `?qa` interface. They do not replace physical-device or subjective audio checks.
