# Infinite Love · Pixel Sands

A standalone sand puzzle by 2fly, packaged from the current game without changing its mechanics. Three selectable skins: Original, Artificial Love (album artwork), and Starry Night with shooting stars. Includes the looping Infinite Love soundtrack.

## Run

Serve this directory over HTTP; no build, package installation, backend, or external CDN is required.

```sh
python3 -m http.server 8000
```

Open http://localhost:8000. Audio begins after pressing Start. The music and artwork are included in `assets/`; keep the folder beside `index.html`.

## Controls

- Arrow keys / on-screen arrows: steer the active item. Hold to continue moving.
- Space / Tilt: tilt a tray or ramp. Buckets remain upright.
- Enter / Place: fix the item in position and receive the next one.
- Shift / Skip: accelerate the item out of the board.
- P / Pause: pause or resume.

Sand contact never locks an item. Placed trays and ramps last eight seconds. Fill placed buckets above the brim to capture sand and add them to the moving bottom bucket fleet. Two bottom buckets start the run; they slowly drift and repel each other. Reach 12,000 captured sand before the floor pile crosses the loss line. Skin selection is remembered locally and does not reset a run.

## Playable Experience integration

Entry point relative to the website root: `/games/infinite-love/index.html`.

The page works as a standalone link or iframe. For an iframe, allow autoplay and provide enough height for the game and controls; audio still requires the initial Start gesture. Desktop keyboard and mobile on-screen controls are included. This package does not register a catalog card or modify the existing Playable Experiences listing. Add its title, cover, and entry-point URL when that integration is ready.

## Verify

Requires a current Node.js runtime, with no npm dependencies:

```sh
npm test
```

The five test files cover sand physics, placement, bucket fleet, skipping, UI input, and switching skins without changing gameplay state.

## Files and assets

- `engine.js`: simulation and rules.
- `game.js`: controls, audio, rendering, and UI.
- `skins.js`: visual themes and star animation.
- `assets/infinite-love.mp3`: Infinite Love soundtrack, identical to the repository's `assets/music/artificial-love/08-infinite-love.mp3`.
- `assets/artificial-love-skin.png`: creator-provided Artificial Love artwork.

This export does not change ownership or licensing of the music or artwork.
