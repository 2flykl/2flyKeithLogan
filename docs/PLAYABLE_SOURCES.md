# Playable source folders

The live Playables stage at `pages/site-overhaul.html#playables` reads
`data/playables-overhaul.json`. Its game routes point to these canonical
folders in this repository:

| Playable | Canonical folder |
| --- | --- |
| Black & Gifted | `games/BlackandGifted/` |
| 2Fly Universe | `games/2fly-universe/` |
| I Was Away | `games/i-was-away/` |
| Return of the Aviator | `games/return-of-the-aviator/` |
| Streams | `games/streams/` |
| TigerCall: Still Standing | `games/TigerCall_StillStanding_PLX/` |
| Thru the Fire | `games/thru-the-fire/` |
| Ebony Eyes | `games/ebony_eyes_game/` |
| Infinite Bars | `games/InfiniteBars/` |

Edit these folders for future website updates. Commit the changes to the
published `main` branch; pushing another branch does not update GitHub Pages.

The local `games/streams/index.html` supplied for the September 2026 update
contained a copy of Thru the Fire. The Streams Current Break build from
`games/STREAMS_CURRENT_BREAK_RC/` was installed at the canonical Streams route.
Keep the Streams and Thru the Fire entry pages separate.

Check runtime media before each publish. The repository's `.gitignore` excludes
`audio/`, `video/`, `*.wav`, and `*.mp4`, so media inside a game folder may need
an explicit `git add -f` to appear on the live site.
