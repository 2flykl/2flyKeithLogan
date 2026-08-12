---
name: game-regression
description: Smoke-tests browser games before and after changes so fixes to one experience do not silently break controls, scrolling, audio, assets, scoring, or restart flows.
---

# Game Regression

For each game under test:
1. Open launch route/file.
2. Start game.
3. Exercise primary controls.
4. Verify active environment movement/scrolling where intended.
5. Verify scoring/state changes.
6. Verify audio starts and does not duplicate.
7. Verify critical image/sprite assets.
8. Verify fail/win path when feasible.
9. Verify restart/replay.
10. Verify no blocking console error.

Record PASS/FAIL and evidence.
