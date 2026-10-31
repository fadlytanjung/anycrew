---
name: crew-deploy-check
description: "Runs the pre-deployment checklist: gates green on the commit, migrations reviewed and reversible, configuration and secrets present per environment, feature flags set, rollback command and owner named, monitoring in place; then deploys with the documented command if asked and verifies the health endpoint. Use before any release."
license: MIT
metadata:
  anycrew-agent: release-engineer
  anycrew-phase: ship
---
<!-- anycrew:generated from anycrew/skills/crew-deploy-check — edit the source and run `npm run build:claude` -->

# Pre-deploy checklist and deploy

Delegate to the **release-engineer** (balanced tier). Templates:
`templates/docs/16-infrastructure.md`, `templates/docs/17-observability.md`.

Report each item as ✅ or ❌ with evidence (a command and its output, a file path):

1. Check command green on the exact commit; the commit references its spec.
2. Migrations: forward-only, dry-run output attached, contract step scheduled separately.
3. Configuration: every variable in `docs/16` present in the target environment; no secret in
   a file, image or pipeline log.
4. Feature flags and limits set for the release.
5. Rollback: the command, the previous version, and who runs it.
6. Monitoring: dashboards and alerts cover the change; cost budget alert exists.
7. Deploy (only when asked): run the documented command, then verify the version at the health
   endpoint and one smoke action.

Done when every item is ✅ or has a named owner and date, and the person has approved a
production deploy explicitly.
