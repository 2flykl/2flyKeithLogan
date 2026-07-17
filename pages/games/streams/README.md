# Streams Upstream Engine V2.3

## Core objective

The player moves upstream toward the top of the frame and must reach the stage.
Digital-media objects enter from above and float downstream toward the waterfall.

## Controls

- Left Arrow: move left
- Right Arrow: move right
- Up Arrow: jump
- Double-press Left or Right and hold the second press: short momentum dash
- Spacebar is intentionally not assigned

## Major rebuilds

- Re-coded the route generator around a guaranteed reachable upstream path
- Platforms use five horizontal zones rather than one stacked center lane
- Added side-route clusters without allowing full-board blockades
- Platforms enter from above and move toward the bottom at varied speeds
- Some platforms remain anchored temporarily
- Large objects move more slowly and create strategic landing opportunities
- Character receives idle, run, jump, and landing animation states
- Landings rock the object and create a water-splash response
- Only pennies and blue X balls are collectibles
- Integrated the existing Streams song as the looping background soundtrack
- Added explicit objective language, stage direction, progress guide, and current state
- Added jump buffering and coyote time for fairer platforming

## Character frames detected

{
  "idle": 9,
  "run": 10,
  "jump": 12,
  "land": 7
}

## Installation

Replace the contents of:

`games/streams/`

with this package.

Suggested GitHub Desktop commit:

`Rebuild Streams as an upstream moving-platform experience`


## V2.5 physics refinement
- Streams MP3 plays as the gameplay soundtrack after the start click.
- Media objects have no names or white bounding boxes.
- Jumping off a platform gives the object a downstream recoil acceleration.
- Blue X attention balls appear slightly more often after the tutorial while the opening remains safe.
