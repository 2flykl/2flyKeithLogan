# BLACK & GIFTED — RC23 Implementation Brief

## Purpose
This brief translates the latest direction into a clean, executable set of fixes for the BLACK & GIFTED demo. It is intended to remove ambiguity and keep the build aligned with the approved visual and gameplay direction.

---

## Core Interpretation
The user’s drawn boxes, arrows, and X marks are **editorial notes**, not literal UI or frame elements to render.

### Treat markup as follows
- **Green boxes / green highlighted areas** = placement zones / target regions
- **Blue arrows** = directional movement or position correction
- **Red X** = remove / do not use
- **Hand-drawn shapes** = rough compositional guidance, not literal graphics

### Most important correction
**Do not place videos inside visible boxes or framed panels.**
Videos must be integrated into the **environment itself**, especially the sky / background, with soft blending and no hard edges.

---

## Global Art / Video Direction
The videos should feel like:
- projected memory
- living atmosphere
- old-school projector light across the sky
- artistic, immersive, and environmental
- sometimes subtle, sometimes boldly visible

### Required video behavior
1. **No hard-edged boxes** around the videos
2. **Feathered / soft edges**
3. Videos should often extend **down toward the horizon / ground line**, not float too high
4. There must be moments where the video becomes a true highlight:
   - opacity rises significantly, including occasional near-full visibility
   - slow scaling in/out
   - sliding / drifting laterally
   - soft fade back into the sky
5. Use tasteful treatment where helpful:
   - projector flicker
   - grunge / afro-grunge texture
   - inversion flashes
   - exposure pulses
   - lightning-sync contrast changes in storm scenes

### Suggested visibility system
- Base blend: **20–35% opacity**
- Feature pulses: **75–100% opacity**
- Fade back down after each pulse
- Keep motion alive with gentle scale drift and sliding/parallax

---

## Scene-by-Scene Implementation

# 1. Scene 1 — Defeat the Message

## Start-of-scene behavior
After the crowned version of the character appears at the beginning of Scene 1:
- show the hint:
  **“Tap arrow to break wall”**
- make it readable and noticeable, but not obnoxious
- allow it to fade or disappear once movement starts / the player engages

## Video treatment — Intro 1
- eliminate visible hard video edges
- bring the video lower so it occupies the sky more fully and reaches toward the ground/horizon area
- the video should feel screened across the atmosphere, not placed in a box
- occasionally allow the video to become the temporary visual focus before fading back into the environment

## Video treatment — Intro 2 / wall reveal
- shift the video farther toward the remaining walls
- the walls should act as the reveal layer: when broken, they reveal the video presence behind them
- do **not** place video over the wall area as a framed insert
- the red-X-marked treatment is rejected and should not be used

---

# 2. Scene 2 — The Mountain

## Layout / object corrections
- remove the weird black shape beneath / attached to the boulder
- the pushing state must be adjusted or scaled so the character sits closer to the ground and feels properly braced
- the boulder should remain visually closer to the mountain surface as it nears the top

## Text corrections
- increase the size of the words on / associated with the mountain and boulder
- the words should be placed **on the mountain**, not floating above it
- as the boulder rolls over the cliff, the words should also fall / leave frame with satisfying motion

## Video treatment
- use the green-indicated placement region, but as a **full environmental projection**, not a box
- no hard-edged frame
- allow periods of near-full video visibility
- during lightning / thunder moments, use brief inversion / high-contrast flashes so the storm enhances both atmosphere and video presence

## Terrain / slope stabilization
There are still slope-related problems:
- the descending / knee-suspended glitch still appears
- the slope is causing some unstable-looking motion
- panthers can appear to float

### Optimal fix path
1. Reduce slope severity slightly **or** segment the floor more cleanly
2. Anchor character feet and panther feet more tightly to terrain height
3. Lower the push state and stabilize downhill recovery frames
4. If the slope continues to introduce artifacts, flatten it somewhat rather than preserving a dramatic slope that breaks visual credibility

---

# 3. Scene 3 — Leap of Faith

## Video treatment
For each leap platform:
- lower the video placement so it is actually visible
- use the user markup as a placement diagram only
- keep the videos as large atmospheric projections, not framed inserts
- these scenes may show the videos more boldly than other scenes
- keep soft feathering and artistic blending

## Experience goal
The leap sequence should feel like the sky opening and the media becoming part of the revelation.

---

# 4. Scene 4 — Run Free

## Video treatment
This scene should be one of the strongest video showcases.

Requirements:
- bring the video down toward the ground line / horizon
- remove the stagnant hard-edge look
- make the video larger and more immersive
- let the sky “embrace” the footage
- include moments of stronger visibility and artistic treatment

### Recommended visual treatment
- projector wash across the sky
- grunge / afro-grunge overlays
- subtle strobing / blinking
- inversion or exposure pulses at moments
- soft drifting and scale changes

## Panthers / terrain polish
- ensure panthers look grounded and not airborne
- if needed, slightly revise their vertical placement or the terrain contour they run across
- smooth animation timing and pathing so they read as part of the pack, not floating silhouettes

---

# 5. Running Animation / Character Motion

## Problem
Current run motion reads like only one side of the body is advancing properly, creating a **limping / hopping** feel.

## Required correction
Replace or repair the run cycle so it becomes a true alternating run.

### The run must include both stride phases
- left leg forward / right arm forward
- right leg forward / left arm forward

### Best implementation options
1. Re-sequence existing run frames if both phases already exist
2. Add / restore missing opposite-phase frames if needed
3. Create corrected in-between frames if the current cycle is incomplete
4. If the cycle still feels unstable, temporarily prefer a more grounded stride over an overly aggressive run

## Goal
The run should read as confident, continuous forward motion — not a limp, hop, or one-sided gallop.

---

# 6. Scene 6 — Tunnel of Blackness

## Critical character rule
The currently used tunnel state is wrong and must be removed.

Do **not** use the incorrect tunnel overlay / old tunnel character treatment.

## Approved tunnel direction
Use the proper darkness tunnel character states collectively:
- **Darkness Tunnel 1**
- **Darkness Tunnel 2**
- **Darkness Tunnel 3**

## Visual requirements for tunnel character
- crown glow / gradient visible
- accessories visible
- body outline dim and appropriate for darkness
- **no extra overlay placed on top of the character**
- use the correct darkness-specific state progression, not the old overlay method

---

# 7. Scene 7 — Past • Present • Future

## Correction
Do **not** use the currently incorrect mural/panel set.

Use the approved artwork provided for:
- **Past**
- **Present**
- **Future**

## Artistic direction
Return to the artistic silhouette / framed artwork treatment that faces the character correctly and matches the intended museum display logic.

## Reference intent
The look should align with the approved museum-art presentation shown in the correct reference set, not the rejected substitute images.

---

# 8. Mirror Scene

## Visibility/layout
- ensure both the **mirror** and the **throne** are visible in the same composition
- restore a balanced composition so neither feels cropped out or visually lost

## Hint behavior
Do not keep the hint blatantly present the whole time.
Instead:
- make the hint larger and readable
- let it appear only after the player struggles for a bit
- present it subtly via fade-in / fade-out / blink / strobe rhythm
- keep it atmospheric rather than intrusive

---

# 9. Interaction / Guidance Notes

## Scene 1 hint
Display after crown version appears:
- **Tap arrow to break wall**

## Hint behavior recommendations
- fade in after a short delay
- pulse softly
- fade out once the user acts

## Video reveal rhythm
For all video-enhanced scenes:
- do not keep the footage permanently weak and hidden
- alternate between:
  - environmental low-opacity blend
  - feature reveal / stronger opacity
  - return to softer background state

This keeps the footage visible enough to matter while preserving the gameplay aesthetic.

---

## Technical / Production Suggestions

### Video compositing approach
Use projection-style masks rather than framed panels.
Suggested components:
- oversized masked video layer
- feathered alpha edges
- animated opacity curve
- slight scale drift
- slight horizontal motion / pan
- grunge film texture overlay
- occasional inversion / exposure flash layers

### Gameplay safety
Keep gameplay readable:
- never let full-opacity video hide the player silhouette or critical interactive elements
- use feature pulses during calmer visual beats or moments of emphasis
- ensure wall prompts, climb states, leap prompts, and hazards remain legible

### Slope fallback plan
If terrain interaction continues to break animation or grounding:
- soften the slope profile
- reduce extremes
- favor clean readable motion over dramatic but glitch-prone geometry

---

## Final Summary
The build should now move toward this principle:

> The videos are not inserts. They are part of the living museum.

That means:
- no hard-edged video boxes
- no literal rendering of markup boxes
- no rejected tunnel overlay state
- use correct darkness tunnel states
- use correct past/present/future artwork
- stabilize slope motion
- repair the run cycle
- give the videos real atmospheric presence with tasteful visibility peaks

---

## RC23 Priority Order
1. Fix Scene 1 hint and wall/video reveal behavior
2. Replace boxed video treatment with full environmental projector treatment
3. Correct Mountain pushing pose, boulder grounding, and word placement
4. Lower / strengthen Leap of Faith video visibility
5. Rebuild Run Free video projection and correct run cycle
6. Replace incorrect Tunnel of Blackness character states
7. Restore correct Past / Present / Future art set
8. Rebalance Mirror scene visibility and delayed hint behavior
9. Final pass on panther polish, slope stability, and visibility timing

