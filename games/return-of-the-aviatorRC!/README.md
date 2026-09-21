# Return of the Aviator — Revision 8

## Install / test
Replace the previous `return-of-the-aviator` folder with this one.

From PowerShell inside the folder:

    npx serve . -l 8080

Open:

    http://localhost:8080

After replacing an older build, use Ctrl+Shift+R once.

## Controls
- WASD / Arrow Keys — movement
- Up / W — resistance in freefall; jump on ground
- Down / S — power dive; route positioning
- Space — fire
- Shift — sonic burst
- F2 — debug HUD

## Experience structure
Two complete plays of `Too Fast`, one continuous mission:
1. Swarmed plane intro / interactive escape
2. Freefall combat
3. 808 landing transition
4. Runway pursuit
5. The Grand entrance transition
6. Algorithm Route
7. Storm jump transition
8. Algorithm Storm boss
9. Extreme-wide final strike

The game clock is not dependent on successful music playback. If the Wix stream is delayed or blocked, gameplay continues and any subsequent click/key attempts playback again.
