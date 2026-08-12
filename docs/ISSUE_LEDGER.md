# Master Issue Ledger — 2flyKeithLogan.com

This document indexes all defects, missing assets, mobile layout gaps, and production deployment issues, verified by QA and ranked by priority (**P0 Blocking**, **P1 Major**, **P2 Polish**, **P3 Future**).

---

## Issue Summary Matrix & Production Status

| ID | Priority | Category | Location / Subsystem | Issue Description | Production Status | Impact | Resolution |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **ISSUE-01** | **P0** | Git / Deployment | `games/ebony_eyes_game/` | Game directory was untracked locally and missing from `origin/main`. | **RESOLVED (Live)** | Live URL returns 200 OK & game launches on production. | Committed & deployed to `origin/main` in Phase 2A (`00939a2`). |
| **ISSUE-02** | **P0** | Git / Deployment | `games/TigerCall_StillStanding_PLX/` | Game directory was untracked locally and missing from `origin/main`. | **RESOLVED (Live)** | Live URL returns 200 OK & game launches on production. | Committed & deployed to `origin/main` in Phase 2A (`00939a2`). |
| **ISSUE-03** | **P0** | Asset Missing | `games/i-was-away/audio/i-was-away.mp3` | Local 4.4MB audio file was not committed to remote repository. | **RESOLVED (Live)** | Live site returns HTTP 206 OK on background music request. Audio plays. | Committed & deployed to `origin/main` in Phase 2A (`00939a2`). |
| **ISSUE-04** | **P1** | Asset Missing | Site Root (`/favicon.ico`) | No `favicon.ico` exists at repository root and no `<link rel="icon">` in HTML head. | **OPEN** | Browser issues GET request for `/favicon.ico`, returning 404 error in browser console. | Scheduled for Phase 2B polish. |
| **ISSUE-05** | **P1** | Configuration | `js/app.js` (Line 62) | `WIX_PAY_WHAT_ITS_WORTH_URL` is set to placeholder string `'PASTE_YOUR_WIX_PAYMENT_PAGE_URL_HERE'`. | **OPEN** | Custom Wix payment prefill feature is non-functional if triggered. | Scheduled for Phase 2B config update. |
| **ISSUE-06** | **P2** | Local Testing | `index.html` (CORS) | Fetching `data/projects.json` fails when opening `index.html` via `file://` protocol directly. | **RESOLVED (Docs)** | Local file preview without HTTP server shows CORS error in browser console. | Documented local testing requirement to run static HTTP server (`node server.js`). |
| **ISSUE-07** | **P2** | Accessibility | `index.html` & Form Modals | Missing `autocomplete` attributes on 5 form inputs and missing `id`/`name` on 11 elements. | **OPEN** | Triggers browser DevTools accessibility warnings on form fields. | Scheduled for Phase 2B accessibility pass. |
| **ISSUE-08** | **P3** | Asset Optimization | `games/TigerCall_StillStanding_PLX/` | MP4 video asset is 27.7MB inside the repository. | **OPEN** | Heavy git clone size and bandwidth usage on slower mobile connections. | Scheduled for Phase 3 optimization. |

---

## Post-Deployment Production Smoke Test Matrix (All 8 Playable Experiences)

QA post-deployment verification executed directly on live GitHub Pages (`https://2flykl.github.io/2flyKeithLogan/`):

| Game Title | Launch Path | Production HTTP Status | Visual Render | Audio / Video Playback | Controls | Production Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Thru the Fire** | `games/thru-the-fire/index.html` | 200 OK | PASS | PASS (Wix CDN) | PASS | **PASS (100% Live)** |
| **Streams** | `games/streams/index.html` | 200 OK | PASS | PASS (Wix CDN) | PASS | **PASS (100% Live)** |
| **I Woke Up in Africa** | `games/africa/index.html` | 200 OK | PASS | N/A (DOM/Canvas) | PASS | **PASS (100% Live)** |
| **I Was Away** | `games/i-was-away/index.html` | 200 OK | PASS (Three.js) | **PASS (206 MP3)** | PASS | **PASS (100% Live)** |
| **Guns & Butter** | `games/guns-and-butter/index.html` | 200 OK | PASS | PASS (Web Audio Synth) | PASS | **PASS (100% Live)** |
| **Ebony Eyes** | `games/ebony_eyes_game/index.html` | 200 OK | PASS | PASS (206 MP3) | PASS | **PASS (100% Live)** |
| **Return of the Aviator** | `games/return-of-the-aviator/index.html` | 200 OK | PASS | PASS (Local Audio) | PASS | **PASS (100% Live)** |
| **TigerCall: Still Standing** | `games/TigerCall_StillStanding_PLX/index.html` | 200 OK | PASS | PASS (206 MP4 Video) | PASS | **PASS (100% Live)** |
