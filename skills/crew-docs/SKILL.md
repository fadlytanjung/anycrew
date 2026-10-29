---
name: crew-docs
description: "Maintains the entry points and the record: README (what, how it works, how to run, where the docs are), docs index and reading order, glossary, changelog, link and Mermaid hygiene. Use when docs drift from code, before sharing the repo, or at the end of a spec."
license: MIT
metadata:
  anycrew-agent: doc-writer
  anycrew-phase: record
---

# Keep the docs true

Delegate to the **doc-writer** (fast tier).

1. README: two-sentence purpose, one diagram, five commands to run, link to `docs/README.md`.
   Numbers only from recorded evidence with a date.
2. `docs/README.md`: one row per doc with the question it answers; reading orders for a new
   teammate and for a coding agent.
3. Glossary and changelog updated from the commit log in plain words.
4. Hygiene: relative links resolve, numbering sequential, Mermaid renders on GitHub.
5. Substance defects in specs or ADRs are reported to their owner, not rewritten here.

Done when links resolve, the README matches the status doc, and the changelog has this
release's lines.
