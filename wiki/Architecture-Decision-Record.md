# Architecture Decision Record

**Definition.** An ADR is a short document that records **one** decision that is expensive to
reverse: the context that forced it, the options considered with their costs, the decision, its
consequences (good and bad), and how to revisit it. ADRs are numbered (`ADR-NNN`), never edited
after acceptance except to mark them superseded, and kept in `docs/adr/`.

The format comes from Michael Nygard's 2011 note "Documenting Architecture Decisions"; anycrew adds
an explicit options table and a "how to revisit" section.

## When to write one

- Choosing a database, a cloud, a protocol, a framework, an orchestration model.
- Changing scope in a way that invalidates earlier documents.
- Amending a [constitution](Constitution.md) principle.
- Any time a reviewer asks "why did we do it this way?" and the answer is not in a document.

## When not to

- Reversible choices (a library for date formatting): a line in the spec's plan is enough.
- Conventions (naming, layout): `docs/13`.

## Template

```
# ADR-007 — Firestore as the system of record
Status: Accepted · Date: · Deciders:
## Context
## Options considered   | Option | What it costs | What it gives |
## Decision
## Consequences         Good: … Bad: …
## How to revisit
```

## How anycrew applies it

`/crew-adr` writes one; `/crew-architecture` writes several. The architect links each ADR from
the spec that depends on it and adds it to `docs/adr/README.md`. anycrew's own design decisions are
ADRs too, in the repository's `docs/adr/`.

## Related

[Constitution](Constitution.md) · [Spec, Plan and Tasks](Spec-Plan-Tasks.md)
