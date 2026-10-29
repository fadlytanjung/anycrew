---
trigger: always_on
description: Spec-driven development process. Applies to every change in the repository.
---

# Spec-driven development

- Every change implements a task from `docs/specs/NNN-*/tasks.md`. If no task covers the change,
  propose a spec or task update first; do not write untracked code.
- Read the spec's `spec.md` and `plan.md` and the docs they link before writing code.
- Respect task order inside a spec. Tasks marked **TDD** start with a failing test that is run and
  seen to fail for the expected reason.
- Acceptance criteria IDs (`AC-NNN-n`) appear in test names or docstrings so they can be traced.
- When the spec is wrong, ambiguous or contradicts another doc: stop, explain the conflict, and
  propose the doc change. Never silently diverge. If code and docs disagree, fix the doc first.
- After finishing a task: tick it (`- [x]`), run the project's check command, and commit with
  `feat(NNN): <what changed>` and `Tasks: TNNN-nn` in the body. One task, one commit.
- Update `docs/20-implementation-status.md` in the same commit when a component's status
  changes; record deliberate deviations in its notes.
- Never work on two specs in one change. Never start P1 work before the P0 path runs end to end.
- If a change alters what a diagram shows, update the diagram in the same commit.
