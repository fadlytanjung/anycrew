# 09 — Patterns and code quality

Developers should be able to decide *which* architecture style and *which* design patterns a product
uses, with the trade-offs in front of them, and have every agent then follow that decision. anycrew
ships the catalogues and the two skills that apply them.

## Catalogues (in `skills/`)

| File | Content |
|---|---|
| `crew-patterns/references/architecture-styles.md` | layered, hexagonal, clean, modular monolith, microservices, event-driven, CQRS, pipeline, serverless, BFF, plugin; frontend styles; agent systems; a decision checklist |
| `crew-patterns/references/design-patterns.md` | creational, structural, behavioural (the classic catalogue), plus enterprise and domain patterns (repository, value object, ports and adapters, composition root, policy as configuration, suggest-then-accept, idempotent handler, outbox, saga, …), each with the problem, when to reach for it and when to avoid it |
| `crew-refactor/references/code-smells.md` | bloaters, OO abusers, change preventers, dispensables, couplers, and backend/LLM-specific smells (impure domain, float money, non-idempotent handler, prompt in code, model decides truth), each with the refactoring that cures it, and the safe-refactor loop |

The catalogues are written in anycrew's own words from well-known sources (the Gang of Four
catalogue, Fowler's refactoring and enterprise patterns, hexagonal and clean architecture, the
refactoring.guru taxonomy of smells); they are summaries for choosing, not tutorials.

## How the crew uses them

- **`/crew-patterns`** (architect, strong): names the forces, shortlists two styles, recommends one,
  picks patterns per concrete problem, records an ADR and the pattern table in `docs/13` section 3,
  draws the shape. A person accepts the ADR.
- **`/crew-architecture`** reads the same catalogues in its "choose the shape" step.
- **`/crew-implement`** follows the pattern table in `docs/13` and adds a row when a new problem
  needs a pattern.
- **`/crew-review`** reports a smell only when it makes a likely change expensive, and names the
  refactoring.
- **`/crew-refactor`** (quality-engineer, balanced): audit by smell, measure complexity and coverage,
  rank by change frequency, plan five refactorings as single commits with tests green before and
  after, then add the lint or layer rule that stops the smell returning.

## Choosing one or two, not all

A product should land on one architecture style and the handful of patterns its problems need. The
"avoid when" columns exist so that the agents, and the people reading the ADR, can say no to a
pattern as easily as yes.
