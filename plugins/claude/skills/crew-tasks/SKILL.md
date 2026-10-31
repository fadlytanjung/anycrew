---
name: crew-tasks
description: "Breaks a spec's plan into tasks.md: ordered, small, each naming its files and acceptance criteria, marked TDD when logic is involved, ending with the status update task. Use when a plan exists but tasks are missing or too coarse."
license: MIT
metadata:
  anycrew-agent: spec-writer
  anycrew-phase: specify
---
<!-- anycrew:generated from anycrew/skills/crew-tasks — edit the source and run `npm run build:claude` -->

# Tasks from a plan

Delegate to the **spec-writer** (strong tier). Template:
`templates/docs/specs/NNN-template/tasks.md`.

1. One task per plan step, `TNNN-nn`, in dependency order, grouped by slice.
2. A task fits one implementer run: one or two files, one behaviour, its ACs listed.
3. Logic → **TDD** marker; UI → the states to check; data → the migration steps.
4. The last task of every spec: update `docs/20-implementation-status.md`.
5. If the assistant has a task tracker, create the tasks there too with the dependencies.

Done when every task has files and ACs, and no task depends on a later one.
