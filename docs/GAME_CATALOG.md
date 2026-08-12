# Game Catalog — 2flyKeithLogan.com Playable Experiences

This document details all **8 playable experiences** within the `/games` directory.

---

## Master Game Matrix

| Game Title | Launch Path | Engine / Runtime | Audio / Visual Assets | Desktop Status | Mobile Status | Git State | Stabilization Priority |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Thru the Fire** | `games/thru-the-fire/index.html` | Vanilla HTML5/CSS3/JS | Wix MP3, JSON item sprites | PASS | PASS | Tracked | P1 (Stabilized) |
| **Streams** | `games/streams/index.html` | HTML5 Canvas Engine | Wix MP3, local canvas rendering | PASS | PASS | Tracked | P1 (Stabilized) |
| **I Woke Up in Africa** | `games/africa/index.html` | Vanilla DOM + Canvas | Dynamic PNG generator | PASS | PASS | Tracked | P2 (Polish) |
| **I Was Away** | `games/i-was-away/index.html` | Three.js (3D WebGL) | MP3 missing on remote (404) | PASS (Visual) | PASS (Touch Stick) | Tracked (Missing MP3) | P0 (Audio Fix) |
| **Guns & Butter** | `games/guns-and-butter/index.html` | Web Audio API Synth | Procedural AudioContext synth | PASS | PASS | Tracked | P2 (Polish) |
| **Ebony Eyes** | `games/ebony_eyes_game/index.html` | Vanilla DOM / State Machine | Web Audio + local assets | PASS (Local) | PASS (Touch Pads) | Untracked | P0 (Push to Git) |
| **Return of the Aviator** | `games/return-of-the-aviator/index.html` | Canvas 2D Side-scroller | Local sprite sheets & backgrounds | PASS | PASS | Tracked | P1 (Major) |
| **TigerCall: Still Standing** | `games/TigerCall_StillStanding_PLX/index.html` | Canvas + Sync MP4 | Local 27.7MB MP4 video | PASS (Local) | PASS (Touch Lanes) | Untracked | P0 (Push to Git) |

---

## Detailed Game Breakdown

### 1. Thru the Fire
- **Launch Path**: [`games/thru-the-fire/index.html`](file:///c:/Users/2flyk/Documents/GitHub/2flyKeithLogan/games/thru-the-fire/index.html)
- **Concept & Objective**: A timed 360° room pressure test about memory, value, and survival. Rotate through 8 directions per room, inspect 2–4 randomized items, and escape before the fire closes in.
- **Control Scheme**:
  - Desktop: `Left Arrow` / `Right Arrow` (rotate 45°), `Up Arrow` (grab item / exit room).
  - Mobile: Touch buttons (`←`, `↑`, `→`).
- **Audio & Assets**: External Wix MP3 soundtrack (`thru-the-fire.mp3`), `thru-fire-v4-data.js` room JSON & sprites.
- **Exit & Restart Behavior**:
  - Exit: `#exitBtn` triggers `window.parent.postMessage('closeExperience', '*')`.
  - Restart: `#replayBtn` resets timer, inventory, and generates new room randomization.
- **Console & Network Health**: Clean (0 console errors, 0 network failures on live site).

---

### 2. Streams
- **Launch Path**: [`games/streams/index.html`](file:///c:/Users/2flyk/Documents/GitHub/2flyKeithLogan/games/streams/index.html)
- **Concept & Objective**: An upstream platformer exploring value versus attention. Jump across drifting digital media objects, collect pennies (+1 value), and avoid blue X balls (+attention).
- **Control Scheme**:
  - Desktop: `Left Arrow` / `Right Arrow` (move), `Up Arrow` (jump). Double-tap left/right for momentum run.
  - Mobile: On-screen joystick knob + touch `↑` jump pad.
- **Audio & Assets**: Wix MP3 soundtrack (`streams.mp3`), Canvas-rendered sprites.
- **Exit & Restart Behavior**:
  - Exit: `#exitButton` triggers `window.parent.postMessage('closeExperience', '*')`.
  - Restart: `#endingOverlay` "PLAY AGAIN" button reloads stream state (`location.reload()`).
- **Console & Network Health**: Clean (0 console errors on live site).

---

### 3. I Woke Up in Africa
- **Launch Path**: [`games/africa/index.html`](file:///c:/Users/2flyk/Documents/GitHub/2flyKeithLogan/games/africa/index.html)
- **Concept & Objective**: A guided daily intention generator. Choose an affirmation, daily goal, person to check on, and an act of self-love to generate and download a custom intention certificate.
- **Control Scheme**: Mouse clicks / touch button selection + text input.
- **Audio & Assets**: Dynamic HTML5 Canvas rendering for downloadable high-res PNG certificate.
- **Exit & Restart Behavior**:
  - Exit: Top bar EXIT button sends `postMessage('closeExperience', '*')`.
  - Restart: Interactive re-selection of intention fields.
- **Console & Network Health**: Clean (0 console errors).

---

### 4. I Was Away (PainterFly Field Demo)
- **Launch Path**: [`games/i-was-away/index.html`](file:///c:/Users/2flyk/Documents/GitHub/2flyKeithLogan/games/i-was-away/index.html)
- **Concept & Objective**: A living painted 3D boomerang flight experience built in Three.js. Watch the instructor, shape the throw, move into the return circle, and complete 3 controlled catches.
- **Control Scheme**:
  - Desktop: `Left` / `Right` (move/aim), `Down` (hold power), `Up` (throw/catch), `V` (toggle camera), `Q`/`E` (orbit), `R` (reset), `M` (music).
  - Mobile: Touch joystick + 4-button mini-grid (`↶`, `VIEW`, `R`, `↷`) and context action button.
- **Audio & Assets**: Three.js WebGL canvas, `audio/i-was-away.mp3` background soundtrack.
- **Console & Network Health**:
  - **CRITICAL ISSUE (P0)**: `audio/i-was-away.mp3` returns a **404 Not Found** on production live site because the local 4.4MB file was never committed to `origin/main`.

---

### 5. Guns & Butter
- **Launch Path**: [`games/guns-and-butter/index.html`](file:///c:/Users/2flyk/Documents/GitHub/2flyKeithLogan/games/guns-and-butter/index.html)
- **Concept & Objective**: A musical memory game that turns rhythm, repetition, and focus into a beat lab. Select keyboard size (16, 32, 61, 88 keys), listen to the sequence, and repeat the pattern.
- **Control Scheme**: Mouse click / touch key press.
- **Audio & Assets**: Web Audio API `AudioContext` triangle oscillator synthesizer (procedural audio, zero external file dependencies).
- **Exit & Restart Behavior**:
  - Exit: Top bar EXIT button sends `postMessage('closeExperience', '*')`.
  - Restart: "CHANGE INSTRUMENT" button reloads page.
- **Console & Network Health**: Clean (0 console errors).

---

### 6. Ebony Eyes (Lock & Flow)
- **Launch Path**: [`games/ebony_eyes_game/index.html`](file:///c:/Users/2flyk/Documents/GitHub/2flyKeithLogan/games/ebony_eyes_game/index.html)
- **Concept & Objective**: A match-3 puzzle game built around connection and relationship qualities. Lock loose descending icons, form matching 3-chains, avoid red balloons, and manage board pressure.
- **Control Scheme**:
  - Desktop: Arrow keys (move yellow cursor), `Spacebar` (lock/unlock tile under cursor).
  - Mobile: Touch direction pad + `LOCK` button.
- **Audio & Assets**: Web Audio API sound synthesis + local background music.
- **Git & Production Status**:
  - **CRITICAL ISSUE (P0)**: Entire directory is **UNTRACKED** locally and missing from remote `origin/main`. Accessing the live route returns a 404 error.

---

### 7. Return of the Aviator (Revision IX)
- **Launch Path**: [`games/return-of-the-aviator/index.html`](file:///c:/Users/2flyk/Documents/GitHub/2flyKeithLogan/games/return-of-the-aviator/index.html)
- **Concept & Objective**: A 2D side-scrolling arcade fly-and-shoot platformer. Navigate four acts, fight algorithm boss bots, and execute aerial maneuvers across two plays of "Too Fast".
- **Control Scheme**:
  - Desktop: `WASD` / `Arrow Keys` (movement, jump/resist, power dive), `Spacebar` (fire), `Shift` (sonic burst), `F2` (debug overlay).
- **Audio & Assets**: Local canvas sprites (`assets/sprites/`), production artwork (`assets/production/`), background tracks.
- **Console & Network Health**: Clean (0 console errors on live site).

---

### 8. TigerCall: Still Standing
- **Launch Path**: [`games/TigerCall_StillStanding_PLX/index.html`](file:///c:/Users/2flyk/Documents/GitHub/2flyKeithLogan/games/TigerCall_StillStanding_PLX/index.html)
- **Concept & Objective**: A Rayen tribute marching band 4-lane rhythm game synced to video. Lock into cadence, survive camera switches, and trigger the Tiger Call slam.
- **Control Scheme**:
  - Desktop: `←` `↑` `→` `↓` or `A` `W` `D` `S`.
  - Mobile: 4-lane touch buttons.
- **Audio & Assets**: Local 27.7MB video asset `assets/video/tiger-call-still-standing.mp4`.
- **Git & Production Status**:
  - **CRITICAL ISSUE (P0)**: Entire directory is **UNTRACKED** locally and missing from remote `origin/main`. Accessing the live route returns a 404 error.
