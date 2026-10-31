---
name: crew-brainstorm
description: "Runs a structured brainstorm from an idea, theme or problem to a documented decision in docs/01: inputs and criteria, problem scan, scored options, the decision, out of scope, risks and name candidates. Use at the start of a product, hackathon entry or pivot."
license: MIT
metadata:
  anycrew-agent: brainstormer
  anycrew-phase: discover
---
<!-- anycrew:generated from anycrew/skills/crew-brainstorm — edit the source and run `npm run build:claude` -->

# Brainstorm to a decision

Delegate to the **brainstormer** (strong tier) with the person's idea or theme and any
constraints they stated. Template: `templates/docs/01-brainstorm-and-decision.md`.

1. The brainstormer asks at most five questions, then writes `docs/01-brainstorm-and-decision.md`
   through steps 2–7 of its procedure: problem scan, 5–8 options, scoring table, decision,
   boundaries and risks, names.
2. Hand facts marked **[assumed]** to the **researcher** (`crew-research`) if the decision
   depends on them.
3. Present the decision paragraph and the scoring table to the person and ask for approval.
   This is a gate: nothing downstream starts before a person says yes.

Done when `docs/01` exists, the decision is approved, and `docs/20-implementation-status.md`
has a "Decision" row.
