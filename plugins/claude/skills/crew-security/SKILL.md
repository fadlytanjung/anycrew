---
name: crew-security
description: "Security review of a change or the whole repository: threat model (docs/14), auth and tenant isolation, untrusted input and prompt injection, secrets, dependencies, data protection, headers and operations; findings with evidence and a test per fix. Use before a release, after changes to auth, data access or model input, and when adding dependencies."
license: MIT
metadata:
  anycrew-agent: security-reviewer
  anycrew-phase: verify
---
<!-- anycrew:generated from anycrew/skills/crew-security — edit the source and run `npm run build:claude` -->

# Security review

Delegate to the **security-reviewer** (strong tier). Template: `templates/docs/14-security.md`.

1. First run: write the threat model with trust boundaries and the control per boundary.
2. Audit the scope against the checklist in the agent's procedure; run the dependency audit
   tool for the stack (`npm audit`, `pip-audit`, `govulncheck`) and a secrets scan.
3. Every finding has evidence and a severity; every accepted fix gets a test that fails before
   and passes after.
4. Residual risks are listed with an owner and a date.

Done when no Critical finding is open and `docs/14` reflects the current boundaries.
