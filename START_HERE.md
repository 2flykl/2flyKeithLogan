# START HERE — 2flyKeithLogan.com in Google Antigravity

This pack is designed for a completely fresh Antigravity setup.

## Correct project folder

Create ONE Antigravity Project named:

`2flyKeithLogan.com`

Add this local folder as the Project folder:

`C:\Users\<YOUR-WINDOWS-USER>\Documents\GitHub\2flyKeithLogan`

Do NOT start inside `games\`.

The Antigravity Project root should contain the website AND the `games` folder so agents can understand the whole system.

Expected shape:

2flyKeithLogan/
├─ games/
│  ├─ africa/
│  ├─ ebony_eyes_game/
│  ├─ guns-and-butter/
│  ├─ i-was-away/
│  ├─ return-of-the-aviator/
│  ├─ streams/
│  ├─ thru-the-fire/
│  └─ TigerCall_StillStanding_PLX/
├─ ...website files...
├─ AGENTS.md
├─ .agents/
├─ docs/
└─ game-specs/

## First session — exact order

1. Open Antigravity 2.0.
2. Click the folder + icon beside Projects.
3. Choose New Project.
4. Name it `2flyKeithLogan.com`.
5. Click Add Folder.
6. Select the local `...\Documents\GitHub\2flyKeithLogan` folder.
7. Create the Project.
8. Copy this starter pack's CONTENTS into the root of that folder.
9. In Antigravity Settings > Customizations > Installed MCP Servers:
   - Add GitHub.
   - Add Chrome DevTools.
   - Authenticate GitHub.
10. Leave Google Docs, Google Drive, Adobe, Suno, and Unreal disconnected for the FIRST audit.
11. Start the main agent with the prompt in `setup/FIRST_PROMPT.txt`.
12. Use Local Mode for the initial read-only audit if no code will be edited.
13. Do not ask agents to "polish everything" yet.
14. Wait for `docs/PROJECT_MAP.md`, `docs/GAME_CATALOG.md`, and `docs/ISSUE_LEDGER.md`.

## Why GitHub + Chrome first?

GitHub gives repository context and source-control awareness.
Chrome/Browser testing gives real evidence that pages and games work.

The first milestone is not redesign.
The first milestone is: KNOW THE CURRENT TRUTH.

## Permissions for Day 1

Recommended:
- Project files: allowed inside this project.
- Git read operations: allowed.
- Browser testing: ask/allow for the site and localhost.
- Git push/deploy: ask.
- Destructive commands: ask.
- External account writes: keep ask/disabled.

Do not use "Unrestricted" on Day 1.
