---
name: site-audit
description: Audits a web repository and playable-experience library without making broad changes. Use for architecture mapping, route discovery, game cataloging, dependency tracing, and issue inventory.
---

# Site Audit

1. Read AGENTS.md.
2. Inspect repository root and git status.
3. Identify framework/build/deployment files.
4. Inventory routes/pages.
5. Inventory `/games` and shared dependencies.
6. Identify launch files and likely live paths.
7. Run locally if safe and feasible.
8. Use browser validation for observable behavior.
9. Record facts separately from hypotheses.
10. Do not delete/rename/consolidate during audit.

Outputs:
- `docs/PROJECT_MAP.md`
- `docs/GAME_CATALOG.md`
- `docs/ISSUE_LEDGER.md`
