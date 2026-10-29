# Spec, Plan and Tasks

**Definition.** A feature is one folder `docs/specs/NNN-short-name/` with three files that answer
three questions in order:

| File | Question | Written by | Contains |
|---|---|---|---|
| `spec.md` | What and why? | spec-writer | status, priority, dependencies, requirement IDs, summary, user stories `US-NNN-n`, acceptance criteria `AC-NNN-n`, out of scope, edge cases, change log |
| `plan.md` | How? | spec-writer (with the architect) | slices, files per step with real paths, contract and data changes, dependencies with versions, constitution check, risks |
| `tasks.md` | In what steps? | spec-writer | ordered checklist `TNNN-nn`, each naming files and ACs, **TDD** markers, a final status-update task |

The layout follows spec-kit's conventions; the folder lives under `docs/` so all documents sit
together.

## Slices

A plan starts with the **thinnest vertical slice** that proves the design end to end (one route,
one table, one screen state), then adds breadth. Every slice leaves the repository green. This is
how a demo exists on day two instead of day ten.

## Tasks

A task fits one implementer run: one or two files, one behaviour, its ACs listed. Tasks are ordered
by dependency and never depend on a later task. Logic gets a **TDD** marker; UI gets the states to
check; data gets the migration steps. The last task of every spec updates
[implementation status](Implementation-Status.md).

```
- [ ] **T009-03** **TDD** every (kind, action) pair: allowed succeed, others `422`. (AC-009-5)
```

## The loop

1. `/crew-spec` creates the folder and wires it into `docs/specs/README.md`, `docs/04`, `docs/20`.
2. A person marks the spec **Ready**.
3. `/crew-implement` takes the first unchecked task, writes the failing test, makes the smallest
   change, runs the check command, ticks the task, commits `feat(NNN): …` with `Tasks:` and `AC:`.
4. `/crew-verify` audits the spec when its tasks are done; `/crew-checkpoint` marks it Built.

## Related

[Acceptance Criteria](Acceptance-Criteria.md) · [Spec-Driven Development](Spec-Driven-Development.md)
