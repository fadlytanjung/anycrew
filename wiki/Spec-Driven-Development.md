# Spec-Driven Development

**Definition.** Spec-driven development (SDD) means the specification is written and approved
*before* the code, the code is implemented *from* it, and the two change *together*. The spec is
the source of truth; when code and spec disagree, the spec is fixed first (or the disagreement is
decided by a person), then the code follows.

## Why

Coding assistants are fast and literal. Given a vague prompt they produce plausible code for a
problem nobody defined. Given a spec with acceptance criteria they produce code that can be
checked, tested and reviewed. SDD moves the thinking to where it is cheap (a document a person can
read in minutes) and leaves the typing to the agent.

For a startup the side effect matters as much: the documents SDD produces (decision, PRD, ADRs,
specs, status) are exactly what a co-founder, an investor or a new hire needs to understand the
product.

## How anycrew applies it

| Principle | In practice |
|---|---|
| Spec before code | `rules/00-sdd-process.md` forbids untracked code; `/crew-spec` runs before `/crew-implement` |
| IDs tie everything | `FR-NNN` → `AC-NNN-n` → `TNNN-nn` → test names → commit trailers |
| Small, ordered tasks | `tasks.md` is a checklist; the implementer takes the first unchecked task and makes one commit |
| Test first | tasks with logic are marked **TDD**; the failing test is written and run before the change |
| Docs and code change together | the status doc is updated in the same commit; drift is caught by `/crew-verify` |
| A person approves | the spec is `Ready` only when a person says so (see [Gates](Gates-and-Human-in-the-Loop.md)) |

## The artefacts, in order

1. [Constitution](Constitution.md): what every change must respect.
2. Decision (`docs/01`): what we are building and why.
3. [PRD](Product-Requirements-Document.md): for whom, what, in what priority.
4. Architecture, data model, API contract and [ADRs](Architecture-Decision-Record.md): how.
5. [Spec, plan, tasks](Spec-Plan-Tasks.md) per feature: the unit of work.
6. [Implementation status](Implementation-Status.md): what is actually built.

## Example

A request "add CSV export" becomes spec `012-csv-export` with `AC-012-1 Given a month with 300
transactions, when the user exports, then the file has 300 rows plus a header and the amounts use
the workspace currency`. Task `T012-01 TDD` writes `test_ac012_1_export_has_all_rows` first. The
commit is `feat(012): export a month as CSV` with `Tasks: T012-01` and `AC: AC-012-1`.

## Related

[Lifecycle and Phases](Lifecycle-and-Phases.md) · [Acceptance Criteria](Acceptance-Criteria.md) ·
[Gates](Gates-and-Human-in-the-Loop.md)
