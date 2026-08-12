# 2flyKeithLogan.com — Agent Operating Contract

## Mission

Maintain, stabilize, refine, and extend 2flyKeithLogan.com and its complete playable-experience library without regressions.

## Scope

This project includes:
- the primary website
- all folders under `/games`
- shared CSS, JS, data, images, audio, video, and runtime files
- deployment/configuration files located inside this repository

The `/games` directory is a first-class product subsystem.

## Product rules

1. Preserve the creator's established artistic direction unless a redesign is explicitly approved.
2. Mobile and desktop are equal release targets.
3. No dead links.
4. No placeholder black squares.
5. No missing critical assets.
6. No broken Start/Replay flows.
7. A visually impressive change that breaks gameplay, audio, navigation, or responsiveness is a failed change.
8. Existing working behavior must be protected.
9. Prefer reusable systems over one-off patches.
10. Never claim something works without actually testing it.

## Source control rules

- Repository files are the executable source of truth.
- Inspect `git status` before edits.
- Use feature branches/worktrees for implementation tasks.
- Never force-push.
- Never push directly to production unless explicitly instructed.
- Never commit credentials, OAuth client secrets, API keys, browser cookies, tokens, or `.env` secrets.

## Mandatory workflow

AUDIT -> PLAN -> ISOLATE CHANGE -> IMPLEMENT -> LOCAL TEST -> BROWSER QA -> REGRESSION -> REPORT -> COMMIT

Do not reverse this order for large changes.

## Definition of done

A material change is not complete until:
- affected page/game launches
- no new blocking console error
- no new critical network/404 failure
- desktop checked
- mobile checked
- required controls checked
- audio checked when affected
- start/restart/replay checked when relevant
- relevant neighboring routes/games smoke-tested
- changed files summarized
- QA evidence summarized

## Game-library protection

Before deleting, renaming, merging, or relocating any folder under `/games`:
1. trace all links/imports/references
2. determine whether it is active, legacy, shared, or prototype
3. document findings
4. obtain Site Director approval

Never assume a nested folder named `games` is redundant merely because of its name.

## Deployment safety

Production deployment always requires explicit creator approval until this rule is intentionally changed.

## External services

Day-1 required integrations:
- GitHub
- Chrome DevTools / Antigravity Browser

Later:
- Google Drive
- Google Docs
- Adobe/Photoshop automation
- Unreal MCP in a separate game-production workspace
- browser-driven subscription workflows only after reliability and terms are reviewed

## Escalate when

Ask the creator before:
- fundamental game-mechanic reinterpretation
- broad visual redesign
- destructive migration
- paid API usage
- production deployment
- using new third-party services
- changing rights/licensing assumptions
