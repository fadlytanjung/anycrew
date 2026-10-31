---
name: crew-patterns
description: "Helps a developer choose and record the architecture style and the design patterns for a product or a feature: lists the forces, compares the candidate styles (layered, hexagonal, clean, modular monolith, microservices, event-driven, CQRS, pipeline) and patterns (creational, structural, behavioural, enterprise), recommends one or two, and records the choice as an ADR and in the conventions doc. Use when starting a project, when a feature crosses a boundary, or when asked 'which pattern/architecture should we use?'."
license: MIT
metadata:
  anycrew-agent: architect
  anycrew-phase: design
---

# Choose patterns and architecture

Delegate to the **architect** (strong tier). It reads the two catalogues in this skill's
`references/` folder and applies the decision checklist there; it does not reinvent the lists.

- `references/architecture-styles.md`: styles with choose/avoid columns and the decision checklist.
- `references/design-patterns.md`: creational, structural, behavioural, enterprise and domain
  patterns with the problem each solves and when to avoid it.

## Procedure

0. **Start from ADR-001.** `docs/adr/ADR-001-architecture-style.md` holds the style chosen at
   `anycrew init` (Proposed) or `undecided`. This skill confirms it (status → Accepted, forces
   filled in) or supersedes it with a new ADR; `.anycrew/config.json` → `architecture.style` and
   `architecture.patterns` record the outcome so `anycrew sync` and the status skill see it.
1. **Name the forces** in a short table: team size and horizon, change hot spots, integrations,
   consistency needs, scale and cost, operations capacity. Ask at most three questions if they
   are unknown; otherwise mark assumptions.
2. **Shortlist** two architecture styles that fit the forces and say in one line each what it costs
   and what it gives. Recommend one. Most MVPs land on a modular monolith with hexagonal modules;
   agent and document products add a pipeline edge.
3. **Patterns per problem**: list the concrete problems the feature or product has (object
   creation that depends on input, interchangeable rules, lifecycles with transitions, atomic
   writes with audit, external SDKs) and the pattern for each from the catalogue, with the
   "avoid when" check answered honestly. Stop at the patterns the problems need; no speculative
   generality.
4. **Record**: one ADR for the architecture style (`crew-adr`), and the pattern table in
   `docs/13-conventions.md` section 3 (pattern, where, why) so every implementer uses the same
   one. If a layer rule changes, update `10-architecture-boundaries` in the project rules.
5. **Show the shape**: a Mermaid diagram of the chosen style applied to this product (containers
   or modules, the ports, the pipeline if any).

Done when the ADR is Accepted by a person and `docs/13` names the patterns and where they live.
