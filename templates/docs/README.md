# {{project}} documentation

Specifications are the source of truth: code implements them, and both change together.

## Reading order

**For a new teammate:** 00 → 01 → 03 → 05 → 13 → 20.
**For a coding agent starting a spec:** `AGENTS.md` → 00 → the spec folder → the docs it links.

| # | Document | Answers |
|---|---|---|
| 00 | [Constitution](00-constitution.md) | The principles every change is checked against |
| 01 | [Brainstorm & decision](01-brainstorm-and-decision.md) | Which idea, why, what is out of scope, the name |
| 02 | [Research](02-research.md) | Verified facts with sources; spikes |
| 03 | [PRD](03-prd.md) | Users, journeys, P0/P1/P2 scope, FR/NFR |
| 04 | [Requirements traceability](04-requirements-traceability.md) | FR → spec → test → evidence |
| 05 | [Architecture](05-architecture.md) | Containers, flows, boundaries, limits |
| 06 | [Agent design](06-agent-design.md) | Model-backed steps, prompts, guardrails, evals (if any) |
| 09 | [Data model](09-data-model.md) | Entities, IDs, states, indexes, migrations |
| 10 | [API contract](10-api-contract.md) | Endpoints, errors, auth, limits (YAML in `contracts/`) |
| 11 | [Frontend](11-frontend.md) | Routes, screens, states, flows, responsive rules |
| 12 | [Design system](12-design-system.md) | Tokens, type, layout, components, content style, gates |
| 13 | [Conventions](13-conventions.md) | Layout, layers, patterns, coding and git conventions |
| 14 | [Security](14-security.md) | Threat model, controls, data protection |
| 15 | [Testing](15-testing.md) | Test layers, gates, ground truth, evals |
| 16 | [Infrastructure & deployment](16-infrastructure.md) | Environments, config, pipeline, runbook |
| 17 | [Observability](17-observability.md) | Logs, traces, metrics, alerts, cost |
| 19 | [Delivery plan](19-delivery-plan.md) | Roles, milestones, cut line, definition of done |
| 20 | [Implementation status](20-implementation-status.md) | What is actually built |
| — | [Glossary](glossary.md) | Terms |
| — | [ADRs](adr/README.md) | Decisions and their trade-offs |
| — | [Specs](specs/README.md) | Feature specs: spec → plan → tasks, build order |

Documents are created when a phase needs them; a missing number means the phase has not run.
