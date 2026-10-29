---
name: crew-architecture
description: "Designs the system from the PRD: architecture with containers and flows (docs/05), data model (docs/09), API contract (docs/10 + contracts/), layer rules (docs/13) and an ADR per significant decision; selects the stack preset. Use before the first spec and whenever a change crosses a boundary."
license: MIT
metadata:
  anycrew-agent: architect
  anycrew-phase: design
---

# Architecture, data model and contracts

Delegate to the **architect** (strong tier). Templates in `templates/docs/` (05, 09, 10, 13,
`adr/ADR-template.md`).

1. Inputs: `docs/03`, `docs/00`, `docs/02`, the preset in `.anycrew/config.json`.
2. Outputs: `docs/05-architecture.md`, `docs/09-data-model.md`, `docs/10-api-contract.md`,
   `contracts/openapi.yaml` (or equivalent), `docs/13-conventions.md`, and ADRs for every
   decision that is expensive to reverse (`crew-adr` for one at a time).
3. For model-backed features, pull in the **ai-engineer** (`crew-llm`) for `docs/06`.
4. For UI, pull in the **designer** (`crew-design`) for `docs/11` and `docs/12`.
5. Gate: the constitution check table has a line per principle; the person approves the ADRs.
6. The architect ends with the list of specs to write, in build order, for `crew-spec`.

Done when the docs above exist, `contracts/` validates, and the ADRs are approved.
