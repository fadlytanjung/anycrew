---
name: crew-spec
description: Creates a new feature spec folder docs/specs/NNN-name/ with spec.md (user stories, Given/When/Then acceptance criteria), plan.md (approach, files, contract changes, constitution check) and tasks.md (ordered test-first tasks), wired into the specs index, traceability and status. Use when a feature needs to be specified before coding.
license: MIT
metadata:
  anycrew-agent: spec-writer
  anycrew-phase: specify
---
<!-- anycrew:generated from anycrew/skills/crew-spec — edit the source and run `npm run build:claude` -->

# New feature spec

Delegate to the **spec-writer** (strong tier). Templates:
`templates/docs/specs/NNN-template/{spec,plan,tasks}.md`.

1. Input: the feature in one paragraph, or the next item from the architect's spec list.
2. The spec-writer numbers it, reuses or adds `FR`/`NFR` IDs in `docs/03`, writes the three
   files, and wires the rows into `docs/specs/README.md`, `docs/04` and `docs/20`.
3. Ask the **scout** what already exists before planning files; never plan to build what the
   repo already has.
4. Gate: every AC is testable; every task names files and ACs; the first task is a vertical
   slice that proves the design end to end.

Done when the person approves `spec.md` (Status: Ready) and `tasks.md` has at least one
**TDD** task.
