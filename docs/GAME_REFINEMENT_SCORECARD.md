# Game Refinement Scorecard — 2flyKeithLogan.com

This document records the independent evaluation of all **8 live playable experiences** in the repository. Each game is scored across 11 core quality dimensions (scale 1–10) to identify refinement potential and prioritize development.

---

## Master Evaluation Matrix

| Game Title | First Impression | Visual Quality | Responsiveness | Gameplay Clarity | Controls | Pacing | Difficulty Progression | Audio Integration | Replayability | Mobile Usability | Performance | Overall Score |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Thru the Fire** | 9/10 | 9/10 | 9/10 | 8/10 | 9/10 | 8/10 | 8/10 | 9/10 | 8/10 | 9/10 | 9/10 | **8.6 / 10** |
| **Streams** | 8/10 | 8/10 | 8/10 | 8/10 | 8/10 | 8/10 | 7/10 | 8/10 | 8/10 | 7/10 | 9/10 | **7.9 / 10** |
| **I Woke Up in Africa** | 7/10 | 7/10 | 9/10 | 9/10 | 9/10 | 7/10 | N/A | 6/10 | 6/10 | 8/10 | 10/10 | **7.1 / 10** |
| **I Was Away** | 8/10 | 9/10 | 8/10 | 6/10 | 7/10 | 6/10 | 6/10 | 8/10 | 7/10 | 7/10 | 8/10 | **7.3 / 10** |
| **Guns & Butter** | 7/10 | 7/10 | 9/10 | 9/10 | 8/10 | 8/10 | 8/10 | 8/10 | 7/10 | 7/10 | 10/10 | **7.8 / 10** |
| **Ebony Eyes** | 8/10 | 8/10 | 8/10 | 7/10 | 7/10 | 7/10 | 7/10 | 8/10 | 8/10 | 8/10 | 8/10 | **7.6 / 10** |
| **Return of the Aviator** | 8/10 | 8/10 | 8/10 | 7/10 | 8/10 | 8/10 | 8/10 | 8/10 | 8/10 | 6/10 | 8/10 | **7.7 / 10** |
| **TigerCall: Still Standing** | 9/10 | 8/10 | 8/10 | 8/10 | 7/10 | 9/10 | 7/10 | 9/10 | 8/10 | 8/10 | 7/10 | **8.2 / 10** |

---

## Detailed Game-by-Game Scorecard

### 1. Thru the Fire
- **First Impression**: 9/10 — High-atmosphere dark cinematic intro, ember field particle effects, burning house theme.
- **Visual Quality**: 9/10 — 360° multi-view room backdrop rendering with dynamic light flickering and rising smoke layers.
- **Responsiveness**: 9/10 — 45° step rotations respond instantaneously to arrow keys and touch buttons.
- **Gameplay Clarity**: 8/10 — Clear objective HUD ("ROOM 1/6", "VIEW 1/8", "TIME 15s"), exit route banner halfway.
- **Controls**: 9/10 — `←`/`→` rotate, `↑` grab/exit; touch controls mirrored cleanly for mobile.
- **Pacing**: 8/10 — Timed countdown creates tension without feeling unfair.
- **Difficulty Progression**: 8/10 — Progressive room count with randomized 2–4 savable objects per room.
- **Audio Integration**: 9/10 — High-bitrate Wix MP3 soundtrack seamlessly synced with room tension.
- **Replayability**: 8/10 — Randomized object spawn engine encourages multiple runs.
- **Mobile Usability**: 9/10 — Dedicated `.mobile-controls` bottom bar with touch buttons.
- **Performance**: 9/10 — Zero lag, 60fps CSS transitions and canvas FX.
- **Bugs / Technical Debt**: Minimal. Subsystem is stabilized.
- **Strongest Feature**: High emotional tension & atmospheric visual presentation.
- **Weakest Feature**: Intro tutorial text is dense on smaller mobile screens.
- **Refinement Potential**: High polish potential (touch gesture swipe for 45° turns).

---

### 2. Streams
- **First Impression**: 8/10 — Upstream platformer visual concept with media floating downstream toward a waterfall.
- **Visual Quality**: 8/10 — Canvas-rendered character animation states (idle, run, jump, land) and floating media tiles.
- **Responsiveness**: 8/10 — Jump physics and platform momentum feel crisp.
- **Gameplay Clarity**: 8/10 — Objective strip ("STAGE ↑", "PENNIES +1", "AVOID X ATTENTION") clearly displayed.
- **Controls**: 8/10 — `Left`/`Right` move, `Up` jump, double-tap run momentum. Touch joystick + jump pad.
- **Pacing**: 8/10 — Platform drift speed accelerates as player climbs higher.
- **Difficulty Progression**: 7/10 — Current speed scales smoothly; blue X attention hazards become denser.
- **Audio Integration**: 8/10 — Wix MP3 soundtrack loops cleanly with mute toggle.
- **Replayability**: 8/10 — Score tracking (Value vs Attention) encourages high-score attempts.
- **Mobile Usability**: 7/10 — Touch controls work well, but joystick knob can cover lower platforms on 360px screens.
- **Performance**: 9/10 — Smooth canvas rendering engine (`js/game.js`).
- **Bugs / Technical Debt**: Duplicate `game.js` file in root of `/streams` vs `/streams/js/game.js`.
- **Strongest Feature**: Philosophical theme (Value vs Attention) integrated directly into platform mechanics.
- **Weakest Feature**: Mobile joystick UI layout on smaller viewports.
- **Refinement Potential**: High (improve mobile touch pad overlay & clean up legacy root script).

---

### 3. I Woke Up in Africa
- **First Impression**: 7/10 — Warm color gradient, purpose-centered reflection interface.
- **Visual Quality**: 7/10 — Clean card layout, double-bordered canvas intention certificate output.
- **Responsiveness**: 9/10 — Instant choice selection feedback.
- **Gameplay Clarity**: 9/10 — Numbered 4-step selection process (Affirmation, Goal, Connection, Self-love).
- **Controls**: 9/10 — Simple tap selection and text input.
- **Pacing**: 7/10 — Self-paced reflection tool.
- **Difficulty Progression**: N/A (Utility/reflection tool).
- **Audio Integration**: 6/10 — Basic click sounds; lacks background ambient soundtrack.
- **Replayability**: 6/10 — Used daily or periodically for personal intention generation.
- **Mobile Usability**: 8/10 — Responsive grid collapses to 1 column on mobile.
- **Performance**: 10/10 — Zero external dependencies, instant canvas export.
- **Bugs / Technical Debt**: Unused elaborate `script.js` (387 lines) present in folder while `index.html` uses fast inline script.
- **Strongest Feature**: Direct downloadable PNG certificate export for social sharing or personal use.
- **Weakest Feature**: Visual presentation is plain compared to cinematic games.
- **Refinement Potential**: High (integrate rich step-panel UI from `script.js` and ambient soundscape).

---

### 4. I Was Away (PainterFly Field Demo)
- **First Impression**: 8/10 — 3D WebGL painted landscape with boomerang flight path.
- **Visual Quality**: 9/10 — Three.js painted terrain, dynamic camera angles, painted sky wash.
- **Responsiveness**: 8/10 — Smooth camera orbiting and flight path physics.
- **Gameplay Clarity**: 6/10 — Power meter timing and catch zone positioning require practice.
- **Controls**: 7/10 — Complex control layout (WASD/Arrows, V camera, Q/E orbit, power meter timing).
- **Pacing**: 6/10 — Tutorial phase can feel slow before free throw mode unlocks.
- **Difficulty Progression**: 6/10 — Guided tutorial to 3 catches.
- **Audio Integration**: 8/10 — Local MP3 soundtrack (`audio/i-was-away.mp3`) enhances painted atmosphere.
- **Replayability**: 7/10 — Flight shaping and trick catch hunting.
- **Mobile Usability**: 7/10 — Dual touch cluster (joystick + mini grid) requires high screen real estate.
- **Performance**: 8/10 — 60fps WebGL rendering on modern devices.
- **Bugs / Technical Debt**: Stale `.gitignore` rule previously blocked MP3 tracking.
- **Strongest Feature**: Breathtaking painted 3D art direction and unique boomerang mechanics.
- **Weakest Feature**: Control complexity and tutorial pacing for first-time mobile players.
- **Refinement Potential**: Very High (streamline mobile HUD, add visual throw arc indicator).

---

### 5. Guns & Butter
- **First Impression**: 7/10 — Sleek dark studio atmosphere with instrument selection.
- **Visual Quality**: 7/10 — Clean key highlight animations (white/black piano keys with orange flash).
- **Responsiveness**: 9/10 — Zero latency Web Audio API tone synthesis.
- **Gameplay Clarity**: 9/10 — Clear Simon-style pattern memory ("Watch", "Your turn").
- **Controls**: 8/10 — Direct key tap/click input.
- **Pacing**: 8/10 — Progressive pattern length per round.
- **Difficulty Progression**: 8/10 — Sequence length increases by 1 note each successful round.
- **Audio Integration**: 8/10 — Pure procedural `AudioContext` synth oscillators (zero audio file loads).
- **Replayability**: 7/10 — High score memory progression.
- **Mobile Usability**: 7/10 — 61/88 key options require horizontal scroll on mobile screens.
- **Performance**: 10/10 — Lightweight DOM & Web Audio API execution.
- **Bugs / Technical Debt**: Minor. Clean codebase.
- **Strongest Feature**: Pure audio-synthesis memory game with zero external asset dependencies.
- **Weakest Feature**: Visual key layout on small mobile screens for 61/88 key modes.
- **Refinement Potential**: Medium (add touch-friendly key scrolling indicator & beat-lab visualizer).

---

### 6. Ebony Eyes (Lock & Flow)
- **First Impression**: 8/10 — Glamorous dark casino/romance UI theme with Black contestant character art.
- **Visual Quality**: 8/10 — Polished tile sprites, contestant portraits, and custom lock/balloon graphics.
- **Responsiveness**: 8/10 — Grid cursor movement and spacebar lock response are crisp.
- **Gameplay Clarity**: 7/10 — Match-3 mechanics + Lock system + Red balloon hazard require learning the rules.
- **Controls**: 7/10 — Cursor movement + lock key. On-screen D-pad + LOCK button for mobile.
- **Pacing**: 7/10 — Flow Director adapts descending speed to player performance.
- **Difficulty Progression**: 7/10 — Board pressure meter rises as loose tiles stack up.
- **Audio Integration**: 8/10 — Web Audio SFX + background soundtrack (`Ebony Eyes 5.mp3`).
- **Replayability**: 8/10 — Multiple male/female contestant profiles and trait unlockables.
- **Mobile Usability**: 8/10 — Touch controls mapped to D-pad cluster and prominent LOCK button.
- **Performance**: 8/10 — Smooth DOM grid animations.
- **Bugs / Technical Debt**: Newly tracked in Git (Phase 2A). Needs full mobile layout testing.
- **Strongest Feature**: High visual polish, character diversity, and unique Lock & Flow puzzle mechanic.
- **Weakest Feature**: Rule complexity for first-time players.
- **Refinement Potential**: Very High (add visual match preview highlights & interactive tutorial).

---

### 7. Return of the Aviator (Revision IX)
- **First Impression**: 8/10 — Retro arcade side-scroller lockup with 2Fly branding.
- **Visual Quality**: 8/10 — Detailed hero aircraft sprite, enemy algorithm bots, parallax backgrounds.
- **Responsiveness**: 8/10 — Smooth flight velocity and collision detection.
- **Gameplay Clarity**: 7/10 — 4-act progression across two plays of "Too Fast".
- **Controls**: 8/10 — WASD/Arrows (move/jump/dive), Space (fire), Shift (burst), F2 (debug).
- **Pacing**: 8/10 — Fast-paced aerial combat and obstacle navigation.
- **Difficulty Progression**: 8/10 — Enemy wave density scales per act.
- **Audio Integration**: 8/10 — Custom arcade soundtrack and SFX.
- **Replayability**: 8/10 — Act survival and high-score chasing.
- **Mobile Usability**: 6/10 — Complex multi-button keyboard scheme lacks dedicated touch controls on mobile.
- **Performance**: 8/10 — 60fps 2D Canvas engine (`game-rev9.js`).
- **Bugs / Technical Debt**: Multiple revision files (`game-rev5.js` through `game-rev9.js`) in root folder.
- **Strongest Feature**: High action arcade gameplay and boss encounter design.
- **Weakest Feature**: Mobile touch control mapping.
- **Refinement Potential**: High (implement custom mobile touch overlay & clean up legacy revision scripts).

---

### 8. TigerCall: Still Standing
- **First Impression**: 9/10 — High-energy Rayen tribute marching band lockup with performance video.
- **Visual Quality**: 8/10 — High-definition MP4 video backdrop synced with 4-lane rhythm track and stadium hype meter.
- **Responsiveness**: 8/10 — Precise note timing judgment (Perfect, Good, Miss).
- **Gameplay Clarity**: 8/10 — 4-lane downward rhythm target lanes (`←` `↑` `→` `↓`).
- **Controls**: 7/10 — Arrow keys / AWDS / 4-lane touch buttons.
- **Pacing**: 9/10 — High-energy stadium marching band cadence and section switches.
- **Difficulty Progression**: 7/10 — Count-in section transitions to full stadium show mode.
- **Audio Integration**: 9/10 — High-impact video soundtrack synced to rhythm engine.
- **Replayability**: 8/10 — Combo builder, grade evaluation (A, B, C), and hype meter.
- **Mobile Usability**: 8/10 — 4 touch buttons mapped directly to note lanes at bottom of screen.
- **Performance**: 7/10 — Heavy 27.7MB video asset requires fast network connection.
- **Bugs / Technical Debt**: 27.7MB video file stored directly in Git repo.
- **Strongest Feature**: Incredible energy, video sync, and tribute concept.
- **Weakest Feature**: Heavy video file size on mobile data connections.
- **Refinement Potential**: Very High (compress video or host on Wix CDN, add mobile hit-zone feedback).
