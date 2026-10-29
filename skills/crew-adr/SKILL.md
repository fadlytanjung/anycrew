---
name: crew-adr
description: "Writes one architecture decision record in docs/adr/: context, options with trade-offs, the decision, consequences and how to revisit it; links it from the docs index. Use when a choice is expensive to reverse (a service, a database, a protocol, a scope change)."
license: MIT
metadata:
  anycrew-agent: architect
  anycrew-phase: design
---

# One decision, recorded

Delegate to the **architect** (strong tier). Template: `templates/docs/adr/ADR-template.md`.

1. Number: next free `ADR-NNN` in `docs/adr/`. File `docs/adr/ADR-NNN-short-title.md`.
2. Sections: Status (Proposed / Accepted / Superseded by), Context, Options considered (at least
   two, each with what it costs), Decision, Consequences (good and bad), How to revisit.
3. If it supersedes an earlier ADR or amends a constitution principle, say so in both files.
4. Add the row to `docs/README.md` (or `docs/adr/README.md`) and reference the ADR from the
   spec or doc that depends on it.

Done when the ADR is Accepted by a person, or left Proposed with the open question named.
