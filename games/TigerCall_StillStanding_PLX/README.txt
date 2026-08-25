TIGER CALL // STILL STANDING
GLOSS + POLISH ASSET BUILD

This build preserves the solved synchronization engine:
- performanceVideo.currentTime remains the single runtime master clock
- NewHeart reference MIDI supplies tempo + authored Start/End markers
- NewHeart HumanPerformance MIDI supplies the 357 gameplay cues only
- no separate audio transport was added

NEW GENERATED ASSETS
1. Four falling tiger paw note icons (SVG)
   - assets/generated/notes/paw_note_left.svg
   - assets/generated/notes/paw_note_down.svg
   - assets/generated/notes/paw_note_right.svg
   - assets/generated/notes/paw_note_up.svg

2. Four upgraded landing / receptor paw assets (SVG)
   - assets/generated/receptors/paw_receptor_left.svg
   - assets/generated/receptors/paw_receptor_down.svg
   - assets/generated/receptors/paw_receptor_right.svg
   - assets/generated/receptors/paw_receptor_up.svg

3. Lane surface overlay art (SVG)
   - assets/generated/lanes/lane_overlay.svg

4. Confetti shape assets (SVG)
   - assets/generated/confetti/square.svg
   - assets/generated/confetti/strip.svg
   - assets/generated/confetti/streamer.svg

VISUAL UPGRADES
- tiger paw arrows replace placeholder circle notes
- upgraded glowing receptor paws
- richer lane surfaces and marching-field overlays
- stronger side LED / drone-style light activity
- orange / black / white confetti
- progressive visual intensity based on song progress + combo + hype

FILES MODIFIED
- styles.css
- src/game.js
- README.txt
- MANIFEST.json
- assets/generated/*
