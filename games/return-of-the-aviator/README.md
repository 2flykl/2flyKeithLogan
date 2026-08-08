# Return of the Aviator — Too Fast Music-Synced Build

This build uses **Too Fast** as the live music clock.

Music source:
`https://static.wixstatic.com/mp3/85e419_62dfb4b5acfc4747a02ad9eaeb643f29.mp3`

## What changed
- The Wix MP3 starts from the user gesture on the START button.
- Once browser metadata exposes the real song duration, scene cues are generated as percentages of the track.
- Opening attack → skydive → runway → vehicle chase → Algorithm Air Boss are synchronized to that cue map.
- Freefall altitude is derived from song progress instead of a separate timer.
- The final boss escalates toward the musical ending and has a climax assist so the experience cannot stall after the song peaks.
- P pauses/resumes both the game and music.

## Upload to your GitHub repository
Keep this folder intact. Recommended repository layout:

```
YOUR-WEBSITE-REPO/
  playable/
    return-of-the-aviator/
      index.html
      game.js
      styles.css
      assets/
      tests/
      README.md
      DESIGN_NOTES.md
```

### GitHub Desktop
1. Extract the ZIP.
2. Open your website repository in GitHub Desktop.
3. In Windows File Explorer, open the repository's local folder.
4. Create `playable` if it does not already exist.
5. Copy the included `return-of-the-aviator` folder into `playable/`.
6. Return to GitHub Desktop. You should see the added files in **Changes**.
7. Summary: `Add Return of the Aviator Too Fast build`
8. Click **Commit to main** (or your working branch).
9. Click **Push origin**.
10. On GitHub.com, verify that `playable/return-of-the-aviator/index.html` exists.

## Test before connecting it to the main website

### Option A — easiest local test
Double-click `index.html`.

If your browser restricts any local asset behavior, use Option B.

### Option B — recommended local server
From inside the `return-of-the-aviator` folder:

**Windows PowerShell / Command Prompt**
```
python -m http.server 8080
```

Then open:
```
http://localhost:8080
```

Press **START EXPERIENCE**. You should hear **Too Fast** and see `♫ TOO FAST • SYNCED` in the upper HUD.

### Test checklist
- Start button launches music and gameplay together.
- Opening attack transitions into freefall.
- Left/right movement remains responsive during the dive.
- Musical-note firing works with Space.
- 808 Boomer unlocks near the final section of the dive.
- Dive transitions smoothly into the runway.
- Runway hazards provide readable left/right reaction windows.
- Vehicle scene begins without a page reload.
- P pauses both music and action; P resumes both.
- Boss fight occurs late in the song and resolves at the musical climax/end.
- Replay restarts from the beginning.
- Resize the browser and confirm 16:9 scaling still fits.

## GitHub Pages direct test
If the repository is published through GitHub Pages, the path normally becomes:

`https://YOUR-USERNAME.github.io/YOUR-REPO/playable/return-of-the-aviator/`

If your existing website deploys from Render/Wix/GitHub in another way, use that deployment's equivalent path.

## Wix integration
Once the GitHub-hosted version is live, use the public game URL as the source for the embed/link on the 2fly website. Keep the playable game files in GitHub rather than individually uploading its sprites to Wix.

## Important
The MP3 is streamed from Wix; it is **not duplicated inside this ZIP**. This keeps the repository smaller and lets the game use the existing audio asset. The player must have internet access for the song stream.
