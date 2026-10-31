# Patterns and Quality

**Definition.** An *architecture style* is the shape of the whole system; a *design pattern* is a named
solution to one recurring design problem; a *code smell* is a symptom that code will be expensive to
change. anycrew ships catalogues of all three and two skills that apply them, so a developer can
choose one style and a few patterns with the trade-offs in view, and have every agent follow that
choice.

## The catalogues

| Catalogue | Where | What it answers |
|---|---|---|
| Architecture styles | `skills/crew-patterns/references/architecture-styles.md` | which shape fits these forces, and what each costs |
| Design patterns | `skills/crew-patterns/references/design-patterns.md` | which pattern solves this problem, and when not to use it |
| Code smells | `skills/crew-refactor/references/code-smells.md` | what is wrong here, and which refactoring cures it |

## Choosing an architecture style

`anycrew init` asks for it first (default: modular monolith with hexagonal modules; `undecided` is
allowed) and records it as a Proposed ADR-001, so no spec starts without a shape.

Name the forces first: team size and horizon, which parts change weekly, the external systems, where
reads must reflect the last write, the real load, who is on call. Then pick the simplest style that
handles them. Most MVPs are a **modular monolith with hexagonal modules**; document and agent products
add a **pipeline** edge; microservices wait until several teams need independent releases. The choice
is an [ADR](Architecture-Decision-Record.md) with the forces and the rejected alternatives named.

## Choosing patterns

State the problem in one sentence, find the row whose problem matches, read the "avoid when" column
honestly, and record the pattern in `docs/13` section 3 (pattern, where, why). No pattern without a
present problem; speculative generality is itself a smell.

## Finding and fixing smells

`/crew-refactor` audits by smell, ranks findings by how often the code changes, and plans
refactorings as single commits with tests green before and after. Behaviour never changes in a
refactoring commit. A convention that the refactor establishes goes into `docs/13`, ideally with a
lint rule so the smell cannot return.

## Related

[Architecture Decision Record](Architecture-Decision-Record.md) · [Agents, Skills and Rules](Agents-Skills-Rules.md)
