# Implementation Status

**Definition.** `docs/20-implementation-status.md` is the one document that says what is actually
built. Every other document reads the same whether or not code exists behind it; this one says
which. It is updated in the **same commit** as any change that adds, completes or removes a
component.

## Vocabulary

| Status | Meaning |
|---|---|
| **Specified** | a document describes it; no code exists |
| **In progress** | code exists; tasks remain |
| **Built** | implemented **and** covered by a named test suite |
| **Partial** | implemented, but nothing would fail if it broke; the limitation is stated |
| **Deployed** | running in the target environment, verified |
| **Cut** | deliberately not done, with the reason and where it is argued |

The rule that makes it useful: a row cannot be promoted to Built without naming the suite that
covers it. "I ran it and it worked" is Partial.

## Why a whole document for this

Teams, judges and investors ask "what works?" more than any other question. Specs answer "what was
intended"; commit logs answer "what was touched"; only this page answers "what works, proven how".
It also stops a common failure with coding agents: declaring a task done on a green-looking
session summary rather than a test.

## How anycrew applies it

- `/crew-init` creates it with one row.
- `/crew-checkpoint` (doc-writer, fast tier) updates rows, the gaps section and the date.
- `/crew-verify` is the evidence for promoting a row to Built.
- `/crew-status` reads it first.

## Related

[Spec, Plan and Tasks](Spec-Plan-Tasks.md) · [Gates](Gates-and-Human-in-the-Loop.md)
