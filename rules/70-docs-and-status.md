---
trigger: model_decision
description: Documentation conventions and the implementation-status discipline. Read when editing anything under docs/ or README.
---

# Docs and status

- `docs/20-implementation-status.md` is the only document that says what is built. Statuses:
  Specified → In progress → Built (tests green, suite named) → Deployed; Cut with a reason.
  Built without a named test is Partial. Update it in the same commit as the change.
- Numbered docs answer one question each; `docs/README.md` lists them with that question and the
  reading order. Cross-links are relative paths.
- Specs live in `docs/specs/NNN-name/` as `spec.md`, `plan.md`, `tasks.md`; ADRs in
  `docs/adr/ADR-NNN-title.md`; both are indexed.
- Mermaid renders on GitHub: in `sequenceDiagram` messages avoid `;`, `{}`, `|` and a second `:`;
  quote flowchart labels containing `/`. Editable diagram files (`.drawio.svg`) are edited with the
  tool, never by hand.
- Numbers in README or docs come from recorded evidence with a date, never from memory.
- Write plainly: short sentences, no marketing language, no claims without evidence.
