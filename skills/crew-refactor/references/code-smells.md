# Code smells and the refactorings that cure them

A smell is a symptom, not a bug: the code works but will cost more every time it is touched. Fix a
smell when you are already changing that code, in its own commit, with the tests green before and
after. Never refactor and change behaviour in one commit.

## Bloaters

| Smell | Signs | Refactor to |
|---|---|---|
| Long function | more than one screen; comments as section headers; many locals | extract function per section; replace temp with query; decompose conditional |
| Large class / module | many responsibilities, many fields, "manager" or "utils" names | extract class per responsibility; extract module; move method |
| Primitive obsession | strings and floats for money, IDs, dates, statuses | introduce value objects; replace type code with enum or class |
| Long parameter list | more than three parameters, flags | introduce parameter object; preserve whole object; builder |
| Data clumps | the same fields always travel together | extract class or value object |

## Abusers of object orientation

| Smell | Signs | Refactor to |
|---|---|---|
| Switch on type | the same `if kind == …` ladder in several places | strategy + registry; polymorphism; a state table |
| Refused bequest | subclass ignores or overrides most of the parent | composition over inheritance; extract interface |
| Temporary field | fields set only in some paths | extract class; null object |
| Alternative classes with different interfaces | two things that do the same with different names | unify interface; adapter |

## Change preventers

| Smell | Signs | Refactor to |
|---|---|---|
| Divergent change | one module changes for many unrelated reasons | split by reason for change (extract module) |
| Shotgun surgery | one change touches many files | move method and field until the change lives in one place; introduce facade |
| Parallel inheritance | adding a subclass forces another elsewhere | collapse hierarchies; composition |

## Dispensables

| Smell | Signs | Refactor to |
|---|---|---|
| Duplicated code | copy-pasted blocks with small differences | extract function; pull up; template method or strategy |
| Dead code | unreachable branches, unused parameters, feature flags that never flip | delete it (git remembers) |
| Speculative generality | abstractions with one implementation "for later" | inline; collapse hierarchy; delete |
| Comments explaining what | comments restating code | rename; extract function named after the intent; keep comments for *why* |
| Lazy class / data class | a class that only holds fields or forwards | inline; or give it the behaviour that uses its data |

## Couplers

| Smell | Signs | Refactor to |
|---|---|---|
| Feature envy | a function uses another object's data more than its own | move method |
| Inappropriate intimacy | modules reach into each other's internals | move method/field; introduce port; encapsulate |
| Message chains | `a.b().c().d()` | hide delegate; extract function |
| Middle man | a class that only delegates | remove middle man; inline |
| Leaky adapter | SDK types or exceptions escape a port | anti-corruption layer; map at the boundary |

## Smells specific to product backends and LLM features

| Smell | Signs | Refactor to |
|---|---|---|
| Business logic in the route or controller | validation, calculations or decisions next to HTTP parsing | extract service; thin controller |
| Impure domain | the domain imports an SDK, reads the clock or the network | inject a port and a clock; move I/O to adapters |
| Float money | `float` for amounts or ratios that are stored or compared | decimal value object; integer minor units at rest |
| Hidden global | module-level clients, settings read at import | composition root; pass dependencies |
| Non-idempotent handler | a retry duplicates a row or an email | deterministic IDs; check-before-write; outbox |
| Prompt in code | prompt strings longer than a sentence in source | prompt files with id, version, schema |
| Model decides truth | a model's output writes a status, total or match directly | suggest-then-accept; code computes, model proposes |
| Untested guard | an auth or isolation rule with no test | add the test before touching the rule |
| Test loosened to pass | assertions weakened, retries added, sleeps | fix the cause; property test the invariant |
| Flaky by clock | tests read `now()` | inject a clock |

## Doing a refactor safely

1. Tests green. If the code has none, write a characterisation test first (record what it does).
2. One refactoring at a time, each a commit (`refactor(NNN): extract …`), behaviour unchanged.
3. Run the check command after each step; stop when green turns red.
4. Record a new convention in `docs/13` when the refactor establishes one.
