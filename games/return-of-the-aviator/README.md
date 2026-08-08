# Return of the Aviator — Revision 5

## Test
1. Replace the entire old `return-of-the-aviator` folder with this one.
2. In PowerShell inside the folder: `npx serve . -l 8080`
3. Open `http://localhost:8080`.
4. The button first says **LOADING FLIGHT SYSTEMS…**. Do not click until it becomes **ENTER THE SIGNAL**.
5. Hard refresh once with `Ctrl+Shift+R` if needed.

## Controls
- WASD / Arrow Keys: movement
- W / Up: jump / opening action
- Space: fire
- Shift: sonic burst
- P: pause
- F2: debug HUD

## Important
The game is no longer allowed to freeze just because the external music stream does not start. If audio is unavailable, gameplay continues on its own master clock. Pressing any gameplay key retries the music and attempts to resync it.
