# Design patterns

The classic catalogue (creational, structural, behavioural), plus the enterprise and domain patterns a
product team meets first. For each: the problem it solves, when to reach for it, and the smell it
cures. Use a pattern when the problem is present, not before; name it in code and in `docs/13`.

## Creational

| Pattern | Problem | Reach for it when | Avoid when |
|---|---|---|---|
| **Factory method** | creating objects without naming concrete classes | the concrete type depends on configuration or input (which reader for this file type) | there is one concrete type |
| **Abstract factory** | families of related objects must match | swapping a whole provider family (one cloud's storage + queue + auth) | one family |
| **Builder** | constructing an object with many optional parts step by step | request builders, test data builders, complex config | a constructor with three arguments does it |
| **Prototype** | copying configured objects | cloning templates, defaults | immutable values make copying trivial |
| **Singleton** | exactly one instance | almost never; prefer a composition root that creates one instance and injects it | tests need isolation (they always do) |

## Structural

| Pattern | Problem | Reach for it when | Avoid when |
|---|---|---|---|
| **Adapter** | incompatible interfaces | wrapping an SDK or external API behind your port; translating their types to yours | the interfaces already match |
| **Facade** | a complex subsystem needs a simple entry | one call that hides several steps (upload = validate + store + enqueue) | it only forwards one call |
| **Decorator** | add behaviour without subclassing | caching, retries, tracing, authorisation around a port | behaviour changes the core contract |
| **Proxy** | control access to an object | lazy loading, remote objects, access checks | a decorator says it better |
| **Composite** | tree structures treated uniformly | menus, document trees, rules that contain rules | flat data |
| **Bridge** | separate abstraction from implementation | two dimensions vary independently (shape × renderer) | one dimension |
| **Flyweight** | many small objects sharing state | rendering, tokens, large in-memory grids | memory is not the problem |

## Behavioural

| Pattern | Problem | Reach for it when | Avoid when |
|---|---|---|---|
| **Strategy** | interchangeable algorithms | matching rules, pricing rules, parsers chosen at runtime; register them in a table | one algorithm |
| **Chain of responsibility** | a request passes through handlers until one handles it | middleware, validation pipelines, check catalogues | order and short-circuiting are unclear |
| **Command** | encapsulate an action as an object | undo, queues, audit logs, review actions with allowed-action tables | a plain function call suffices |
| **Observer / pub-sub** | notify many on change | domain events, UI state, integrations | the sequence of reactions matters (use an explicit pipeline) |
| **State** | behaviour depends on state with explicit transitions | lifecycles (document: uploaded → read → verified), review items, orders; write the transition table | two states and an if |
| **Template method** | a skeleton with overridable steps | frameworks, base test cases | composition (strategy) is simpler |
| **Iterator** | traverse without exposing structure | custom collections, paginated APIs | the language's iterators cover it |
| **Mediator** | many-to-many communication centralised | complex UI forms, orchestration of agents | two participants |
| **Memento** | snapshot and restore state | undo, drafts, checkpoints | immutable history (event sourcing) fits better |
| **Visitor** | operations over a fixed object structure | compilers, document trees with many operations | the structure changes often |
| **Interpreter** | a small language | rule DSLs, policy files | a config table suffices |
| **Specification** | combinable business rules that answer yes/no with a reason | entitlement checks (`Allowed` / `Denied(code, limit, used)`), filters, validation | rules never combine |

## Enterprise and domain patterns

| Pattern | Problem | Reach for it when |
|---|---|---|
| **Repository** | persistence hidden behind a collection-like interface | any database; one place that knows paths, batching and units |
| **Unit of work / transaction script** | group writes atomically | state change plus audit event in one transaction |
| **Value object** | make invalid states unrepresentable | money (decimal + currency), dates, IDs, bounding boxes |
| **Entity and aggregate** | identity and consistency boundary | a workspace, a document with its pages, an order with lines |
| **Domain event** | record that something happened | audit trails, triggering workflows, integrations |
| **Ports and adapters** | isolate the domain from I/O | always, at the boundary of every external system |
| **Composition root + dependency injection** | wire implementations once | `create_app(settings, deps)`; tests build with fakes; no globals |
| **Anti-corruption layer** | keep a foreign model out | mapping an external API's or OCR engine's shapes to your own at the adapter |
| **Policy as configuration** | reviewable rules | thresholds, plans, categories in versioned YAML/JSON loaded by code |
| **Suggest, then accept** | AI output must not write truth | a model proposes, a person's decision writes |
| **Idempotent handler** | retries must not duplicate | every job, webhook and workflow node: deterministic IDs, check-before-write |
| **Pure recomputation** | same inputs, same result, any order | monthly reconciliation, reports, projections |
| **Upcaster on read** | old records read as the latest shape | versioned persistence with forward-only migrations |
| **Circuit breaker / retry with backoff** | failing dependencies | every network call to a third party; bounded, jittered, logged |
| **Outbox** | reliable event publishing | writing a record and emitting an event without dual-write loss |
| **Saga** | long transactions across services | multi-step workflows with compensations; prefer a workflow engine or pipeline when single-process |

## Choosing

1. Name the problem in one sentence ("the type of reader depends on the file", "writes must be
   atomic with their audit event").
2. Find the row whose problem matches. If none, you do not need a pattern yet.
3. Check the "avoid when" column honestly.
4. Record it in `docs/13` section 3 (pattern, where, why) so every implementer uses the same one.
