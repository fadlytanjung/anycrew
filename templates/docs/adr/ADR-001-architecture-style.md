# ADR-001 — Architecture style: {{style_name}}

**Status:** Proposed (chosen at `anycrew init`; confirm or change with `/crew-patterns`) · **Date:** {{date}} · **Deciders:**

## Context
{{project}}: {{purpose}}

The forces that decide an architecture style (team size and horizon, change hot spots, integrations,
consistency needs, scale and cost, operations capacity) were not all known at init. This record
holds the initial choice so that specs do not start without one; `/crew-patterns` fills in the
forces and confirms or replaces it.

## Options considered
| Option | What it costs | What it gives |
|---|---|---|
| **{{style_name}}** (chosen) | Watch for: {{style_watch}} | {{style_choose}} |
| Alternatives | see `skills/crew-patterns/references/architecture-styles.md` | compared by `/crew-patterns` against the forces |

## Decision
{{style_shape}}

Avoid this style when: {{style_avoid}}

## Consequences
- Good: every spec's plan has a shape to follow; the layer rules in `docs/13-conventions.md` and
  `.agents/rules/10-architecture-boundaries.md` apply to it.
- Bad: chosen before the PRD; revisit when the forces are written down.

## How to revisit
Run `/crew-patterns` after `/crew-prd`. If the style changes, supersede this ADR with a new one.
