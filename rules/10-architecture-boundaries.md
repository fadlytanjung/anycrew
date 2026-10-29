---
trigger: always_on
description: Architecture boundaries that keep the domain testable and the adapters replaceable. Applies to all application code.
---

# Architecture boundaries

- Layers and allowed imports: `api/routes → services → domain + ports`; `adapters` implement
  `ports`; `main` is the composition root that wires adapters in. The exact names follow
  `docs/13-conventions.md`.
- `domain` is pure: no I/O, no SDKs, no framework, no network, no file system, no wall clock.
  Time comes from an injected clock; randomness from an injected source.
- Every external system (database, queue, storage, model provider, third-party API) sits behind
  a port (an interface) with an in-memory fake used by tests. No test calls a real external
  service.
- Routes and controllers are thin: parse, call a service, map errors. No business logic there.
- Every number that matters to the business is computed by deterministic code with a unit test;
  a model may read, classify, propose and explain, never decide or compute.
- State changes and their audit record are written together (same transaction or equivalent);
  re-runs are idempotent and never duplicate data.
- Configuration is environment variables validated at start-up; model IDs, regions and limits are
  configuration, never literals in code.
- A new dependency, managed service or paid API needs an ADR (or a note in the spec's plan) before
  it enters the code.
- Enforce the layer rules with a tool where the stack allows it (import-linter, eslint
  boundaries, go vet rules, dependency-cruiser) and run it in the check command.
