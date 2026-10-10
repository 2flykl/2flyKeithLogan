# Global player QA — 2026-10-10

The shared player adds a labeled theme-aware heart, persistent browser favorites,
play-all/shuffle, and song/album/hearted-song downloads. Desktop download controls
sit inside the black panel; mobile uses a Downloads disclosure. The placeholder
pop-out button becomes the hearted-song list.

Files are prepared before presenting a visible Save link, preserving a user gesture
for browser delivery. Audio validation checks HTTP status, nonempty audio signatures
and transfer length. Preparation supports timeout, automatic retry, cancellation,
and explicit retry without refetching completed files. Incomplete ZIPs are not
offered. Limits: 100 MB per file and 256 MB per selection. No runtime ZIP CDN or
external download service is required.

## Evidence

- 11 Node tests passed, including the existing Africa and Drive In suites.
- Actual Edge downloads: hosted MP3, eight-track Artificial Love ZIP (35,796,514
  uncompressed bytes), and a two-song hearted ZIP.
- Independent Python zipfile extraction passed CRC checks; hosted MP3 bytes match
  the corresponding ZIP entry exactly.
- All 36 available catalog entries fetched and validated in a browser, including
  the hosted cross-origin audio. No failed tracks.
- Save/remove, persistence after reload, queue playback/next, and removing the
  playing favorite without stopping audio passed.
- Injected HTML in place of audio was rejected; retry recovered. Cancel appeared
  immediately during a delayed response and successfully aborted preparation.
- Visual/overflow checks at 1920, 1366, 430, 390 and 360 pixels passed. Mobile
  Downloads disclosure controls remain accessible.
- Home, Featured, Playables, Videos and Music passed route smoke tests with no
  JavaScript exceptions after fixing a pre-existing missing video-programs.js
  dependency in seven page shells. The original exception was separately reproduced
  with unchanged main-branch scripts.

## Reproduce

Run `node tests/player-downloads.test.cjs`,
`node tests/africa-cinema-notes.test.cjs`, and
`node tests/drive-in-atmosphere.test.cjs`.

Serve the full checkout over HTTP. With Playwright available and Edge installed,
run `node tests/player-browser.cjs`. Set PLAYER_QA_URL when the server is not
http://127.0.0.1:8765. Artifacts go to a unique OS temporary directory. Browser QA
needs network access and disk space for real music downloads.

## Limits and release

Favorites belong to this browser; there is no account synchronization. Actual
Safari/iPhone and Firefox testing has not been performed: phone viewport checks
used Edge. Network or storage failures are surfaced to the user, not eliminated.
Production is unchanged; deployment requires creator approval under AGENTS.md.
Rollback is a revert of this feature commit.
