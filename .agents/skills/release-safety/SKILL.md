---
name: release-safety
description: Protects Git branches, secrets, staging, deployment, and rollback during agent-authored changes.
---

# Release Safety

Before changes:
- inspect branch and git status
- prefer isolated branch/worktree

Before commit:
- inspect diff
- ensure no secrets/tokens/cookies/client secrets are staged
- run relevant tests

Before production:
- require explicit creator approval
- verify exact deployment target
- prepare rollback
- smoke-test live site after deployment
