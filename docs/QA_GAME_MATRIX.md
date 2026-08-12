# Playable Experiences Release Certification Matrix

*Audited & Certified by Senior Release Certification Lead — August 11, 2026*

| Game Title | Version / Branch | Start Flow | Motion / Scroll | Controls | Touch | Audio | Pacing | Scoring | Replay | Console | Status | Release Certification |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Ebony Eyes** | Flow Director 2.0 | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | CLEAN | **PASS** | **RELEASE CANDIDATE (RC)** |
| **TigerCall** | PLX Still Standing | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | CLEAN | **PASS** | **RELEASE CANDIDATE (RC)** |
| **Return of the Aviator** | Revision IX | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | CLEAN | **PASS** | **RELEASE CANDIDATE (RC)** |
| **I Was Away** | Three.js WebGL V2.0 | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | CLEAN | **PASS** | **RELEASE CANDIDATE (RC)** |
| **Streams** | Upstream Engine V2.3 | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | CLEAN | **PASS** | **RELEASE CANDIDATE (RC)** |
| **I Woke Up in Africa** | Canonical (`/games/africa/`) | PASS | PASS | PASS | PASS | N/A | PASS | PASS | PASS | CLEAN | **PASS** | **RELEASE CANDIDATE (RC)** |
| **Africa (Nested Legacy)** | Duplicate (`/games/games/africa/`) | FAIL | FAIL | FAIL | FAIL | FAIL | FAIL | FAIL | FAIL | 404 ERR | **FAIL** | **NOT READY (DO NOT RELEASE)** |
| **Thru The Fire** | Burning House V4.0 | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | CLEAN | **PASS** | **RELEASE CANDIDATE (RC)** |
| **Guns & Butter** | Piano Memory V1.0 | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | CLEAN | **PASS** | **RELEASE CANDIDATE (RC)** |

---

## Game-by-Game Certification Details & Evaluation

### 1. Ebony Eyes — Lock & Flow (Flow Director 2.0)
- **Start & Onboarding**: Clear onboarding rules overlay. Empty starting board. Male / Female character selection.
- **Motion & Gravity**: Tiles descend 1 row per beat tick. Yellow cursor moves 360°. Locked icons freeze lane flow.
- **Flow Director 2.0**: Intelligently monitors player cursor proximity ($\le 3$ lanes) and open 2-pairs, feeding completion opportunities.
- **Red Balloon Fairness**: Descends through loose clutter. Colliding with a locked tile triggers screen shake, drops contestant trait score (-350), and logs warning. Safe exit clears without penalty.
- **Verdict**: **FUN AND READABLE**. Strategic depth and player agency earned **RELEASE CANDIDATE**.

### 2. TigerCall: Still Standing (PLX Build)
- **Start & Video**: High-energy MP4 stadium video (`tiger-call-still-standing.mp4`) preloads with buffering indicator (`BUFFERING STADIUM VIDEO...`).
- **Sync & Performance**: Millisecond timing engine syncs beat map to video playback.
- **Marching Band Evaluation**: Is it a marching band performance game or a 4-lane rhythm game placed over video?  
  **Evaluation**: It is a genuine Marching Band Performance Game. Section transitions (`COUNT-IN`, `DRUMLINE CADENCE`, `BRASS ATTACK`, `FIELD FORMATION`, `CALL & RESPONSE`, `SHOWTIME`, `TIGER CALL`) mirror authentic stadium field routines.
- **Verdict**: **RELEASE CANDIDATE (RC)**.

### 3. Return of the Aviator (Revision IX)
- **Start & Load**: HTML5 2D Canvas engine preloads all background layers, plane sprites, and sound cues.
- **Motion & Speed**: Parallax cloud layers, rain speedlines, and camera zoom changes communicate intense forward velocity.
- **Controls & Debug**: WASD / Arrows move, Space fires primary weapon (`TONEARM`), Shift triggers `SONIC BURST`, F2 toggles real-time debug overlay.
- **Verdict**: **COMMUNICATES HIGH SPEED**. **RELEASE CANDIDATE (RC)**.

### 4. I Was Away (PainterFly Field Demo)
- **Start & WebGL**: Three.js WebGL canvas initializes 3D painted landscape.
- **Physics & Flight**: Boomerang flight arc guide shows trajectory. Curve controls (`↶`, `↷`), release button (`R` / Space), and camera switching operate cleanly.
- **Verdict**: **RELEASE CANDIDATE (RC)**.

### 5. Streams (Upstream Engine V2.3)
- **Physics & Platformer**: Upstream vertical platformer with momentum jumping physics, floating river platforms, height counter, and replay loop (`PLAY AGAIN`).
- **Verdict**: **RELEASE CANDIDATE (RC)**.

### 6. I Woke Up in Africa
- **Canonical Route (`/games/africa/`)**: Affirmation selection, goal selection, person check input, and self-love choice generate intention certificate and canvas PNG export (`today-intention.png`). Certified **RELEASE CANDIDATE**.
- **Nested Duplicate Route (`/games/games/africa/`)**: Missing `styles.css` and `script.js` causing 404 HTTP errors. Refused certification (**NOT READY — DO NOT RELEASE**).

### 7. Thru The Fire (Burning House V4.0)
- **Story & Mechanics**: 6 burning rooms, 8 45° rotation views per room, 2-4 randomized savable objects. Halfway through time, exit route banner activates (`FIND EXIT`). End card summarizes items saved vs items left behind.
- **Verdict**: **RELEASE CANDIDATE (RC)**.

### 8. Guns & Butter (Piano Memory V1.0)
- **Memory Loop**: Instrument selection (16 MIDI, 32 Keyboard, 61 Nice Keyboard, 88 Grand Piano). Web Audio oscillator pitch synthesis plays watch-and-repeat sequence.
- **Verdict**: **RELEASE CANDIDATE (RC)**.
