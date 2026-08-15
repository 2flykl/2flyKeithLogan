# Deployment Guardrails
- Inspect existing repository deployment before changing workflows.
- Work on a branch unless the repository's established workflow explicitly says otherwise.
- Never commit secrets.
- Use Node 22+.
- If Supabase is used, enable RLS and least privilege before public writes.
- Deep links must work under the site's actual hosting/base path.
- Test refresh on nested Universe routes.
- Do not push production automatically unless the project's established staging/live workflow clearly authorizes it.
