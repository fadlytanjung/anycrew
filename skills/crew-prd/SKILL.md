---
name: crew-prd
description: "Writes or revises the PRD (docs/03) and the requirements traceability table (docs/04) from the approved decision: personas, journeys, P0/P1/P2 scope with a cut line, FR/NFR IDs, success metrics and a constitution check. Use after a decision and before architecture or specs."
license: MIT
metadata:
  anycrew-agent: product-manager
  anycrew-phase: define
---

# Product requirements

Delegate to the **product-manager** (strong tier). Templates: `templates/docs/03-prd.md`,
`templates/docs/04-requirements-traceability.md`.

1. Inputs: `docs/01`, `docs/02`, `docs/00-constitution.md` and the deadline.
2. Output: `docs/03-prd.md` with personas, journeys, P0/P1/P2, `FR-NNN`/`NFR-NNN`, metrics;
   `docs/04-requirements-traceability.md` with one row per requirement.
3. Gate: present the P0 list and the cut-line sentence to the person. P0 must be demoable
   within the deadline; if not, cut scope, not quality.

Done when both docs exist, every requirement has an ID and a priority, and the person approved
the P0 scope.
