# Game Refinement Queue — 2flyKeithLogan.com

This document establishes the ranked execution order for refining individual games during Phase 2C. Each game will be refined **one at a time** on a dedicated bounded feature branch or worktree.

---

## Ranked Execution Queue

| Queue Position | Game Title | Refinement Priority | User Impact | Regression Risk | Primary Refinement Focus | Target Branch |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | **I Was Away** | **P1 (High)** | High | Low | Streamline mobile controls, add visual throw-arc guide, improve tutorial pacing. | `feature/refine-i-was-away` |
| **2** | **TigerCall: Still Standing** | **P1 (High)** | High | Low | Add touch lane hit feedback, polish stadium hype animations, optimize video loading. | `feature/refine-tigercall` |
| **3** | **Streams** | **P1 (High)** | High | Low | Mobile joystick UI layout polish, remove legacy root `game.js`, refine platform drift. | `feature/refine-streams` |
| **4** | **Ebony Eyes** | **P2 (Medium)** | High | Medium | Add visual match highlights, interactive rule tutorial, mobile touch pad polish. | `feature/refine-ebony-eyes` |
| **5** | **Return of the Aviator** | **P2 (Medium)** | Medium | Medium | Implement dedicated mobile touch overlay, clean up legacy revision scripts (rev5–rev8). | `feature/refine-aviator` |
| **6** | **I Woke Up in Africa** | **P2 (Medium)** | Medium | Low | Integrate rich multi-step panel UI (`script.js`), add ambient soundtrack & sound SFX. | `feature/refine-africa` |
| **7** | **Guns & Butter** | **P3 (Polish)** | Medium | Low | Mobile responsive key scaling for 61/88 key modes, add beat-lab visualizer. | `feature/refine-guns-and-butter` |
| **8** | **Thru the Fire** | **P3 (Polish)** | Low (Already 8.6/10) | Low | Touch gesture swipe for 45° room rotation, intro text layout tuning on mobile. | `feature/refine-thru-the-fire` |

---

## Game-by-Game Bounded Refinement Scope

### 1. Queue Position #1 — I Was Away
- **Concept Gap**: Breathtaking 3D painted landscape concept, but mobile control cluster is crowded and throw timing is difficult for new players.
- **Refinement Scope**:
  - Add visual flight trajectory preview arc on throw.
  - Simplify mobile touch cluster (larger primary THROW/CATCH button).
  - Smooth tutorial transition into free-throw field mode.
- **Regression Isolation**: All changes bounded within `/games/i-was-away/`.

---

### 2. Queue Position #2 — TigerCall: Still Standing
- **Concept Gap**: High stadium energy, but touch lane presses lack immediate visual hit-feedback on mobile screens.
- **Refinement Scope**:
  - Add visual drum/hit burst feedback when tapping 4 rhythm lanes on mobile.
  - Add video load fallback indicator.
  - Polish end-game grade recap card.
- **Regression Isolation**: All changes bounded within `/games/TigerCall_StillStanding_PLX/`.

---

### 3. Queue Position #3 — Streams
- **Concept Gap**: Primary homepage experience, but mobile joystick knob overlaps lower media platforms on 360px screens.
- **Refinement Scope**:
  - Relocate mobile touch jump/move pads to clear screen corners.
  - Delete unused legacy `/games/streams/game.js` (8KB) while preserving active `/games/streams/js/game.js` (39KB).
  - Fine-tune double-tap momentum response.
- **Regression Isolation**: Bounded within `/games/streams/`.

---

### 4. Queue Position #4 — Ebony Eyes
- **Concept Gap**: Deep Lock & Flow puzzle mechanics, but first-time players struggle to anticipate match-3 setups.
- **Refinement Scope**:
  - Add subtle glow highlights when 2 matching tiles are locked side-by-side.
  - Add quick interactive "How to Play" rule overlay.
  - Polish mobile D-pad button spacing.
- **Regression Isolation**: Bounded within `/games/ebony_eyes_game/`.

---

### 5. Queue Position #5 — Return of the Aviator
- **Concept Gap**: Excellent 2D arcade shooter, but mobile players cannot easily execute complex key combos.
- **Refinement Scope**:
  - Build responsive touch controls (`JOYSTICK` + `FIRE` + `BURST` buttons) for mobile viewports.
  - Clean up unused legacy revision files (`game-rev5.js`, `game-rev6.js`, `game-rev7.js`, `game-rev8.js`).
- **Regression Isolation**: Bounded within `/games/return-of-the-aviator/`.

---

### 6. Queue Position #6 — I Woke Up in Africa
- **Concept Gap**: Currently uses basic 1-page form while an elaborate 387-line multi-step guided ritual (`script.js`) sits unused.
- **Refinement Scope**:
  - Connect full multi-step panel UI (`script.js`) for a guided intention experience.
  - Add ambient audio toggle and tone feedback.
- **Regression Isolation**: Bounded within `/games/africa/`.

---

### 7. Queue Position #7 — Guns & Butter
- **Concept Gap**: Excellent procedural AudioContext synth, but 61/88 key options overflow mobile viewports horizontally.
- **Refinement Scope**:
  - Add touch scroll indicators and key scale presets for mobile devices.
  - Add visual beat-pulse display.
- **Regression Isolation**: Bounded within `/games/guns-and-butter/`.

---

### 8. Queue Position #8 — Thru the Fire
- **Concept Gap**: Highest scoring game (8.6/10), but touch buttons can be augmented with swipe gestures.
- **Refinement Scope**:
  - Add touch swipe left/right gesture support for 45° room turning.
  - Tune intro card font scaling on 360x800 screens.
- **Regression Isolation**: Bounded within `/games/thru-the-fire/`.
