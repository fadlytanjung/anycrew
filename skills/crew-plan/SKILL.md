---
name: crew-plan
description: "Writes or revises plan.md for an existing spec: the thinnest vertical slice first, files to create or change with real paths, contract and data-model changes, dependencies with versions, constitution check and risks. Use when a spec exists but its plan is missing, outdated or vague."
license: MIT
metadata:
  anycrew-agent: spec-writer
  anycrew-phase: specify
---

# Plan an approved spec

Delegate to the **spec-writer** (strong tier). Template:
`templates/docs/specs/NNN-template/plan.md`.

1. Refuse to plan a spec whose status is not Ready; say which one blocks and stop.
2. Inventory what exists (ask the **scout**). Reuse before building.
3. Slice 1 proves the design end to end; later slices add breadth. Every slice leaves the repo
   green.
4. Every step names its files. Flag ambiguity in the spec now; it is cheaper than at
   implementation time. Call out steps that need real credentials or paid services.
5. No estimates in hours; order by dependency.

Done when `plan.md` lists files per step, contract changes, dependencies, the constitution
check and risks, and the person has read it.
