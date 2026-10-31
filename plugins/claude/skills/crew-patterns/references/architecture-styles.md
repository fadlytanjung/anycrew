# Architecture styles

How to choose: start from the forces (team size, change rate, scaling needs, deployment constraints,
consistency needs), pick the simplest style that handles them, and record the choice as an ADR with
the forces named. Styles compose: a modular monolith with hexagonal modules and one event-driven
edge is a common, good answer for an MVP.

| Style | Shape | Choose it when | Avoid it when | Watch for |
|---|---|---|---|---|
| **Layered (n-tier)** | presentation → application → domain → data, each calling the layer below | small team, CRUD-heavy product, few integrations | business rules keep leaking into controllers or SQL | anaemic domain; "utils" layers; every change touching every layer |
| **Hexagonal (ports and adapters)** | pure domain in the middle; ports (interfaces) define what it needs; adapters implement them for databases, APIs, UIs | you want tests without infrastructure, swappable providers (model vendors, payment, storage), long-lived domain logic | throwaway prototypes with no logic worth protecting | port explosion; adapters leaking SDK types into the domain |
| **Clean / onion** | hexagonal with explicit rings: entities, use cases, interface adapters, frameworks; dependencies point inward | several entry points (API, CLI, jobs) share use cases | a single thin API over a database | ceremony: use-case classes that only forward calls |
| **Modular monolith** | one deployable, strict module boundaries (own schema or tables, public API per module, no cross-module imports) | startup to mid-size team wanting microservice discipline without the ops cost | modules need independent scaling or release today | shared tables across modules; "common" modules that become everything |
| **Microservices** | independently deployed services, each owning its data, communicating over APIs or events | many teams, independent release cadence, proven need to scale parts differently | fewer than ~3 teams; the domain boundaries are still moving | distributed monolith; chatty synchronous calls; no observability |
| **Event-driven** | producers emit facts; consumers react; a broker or log in between | workflows span steps that may fail independently, fan-out, audit trails, integrations | strict read-your-writes expectations everywhere | invisible coupling through event schemas; missing idempotency; no replay story |
| **CQRS (+ event sourcing)** | separate write model (commands) and read models (queries); optionally store events as the truth and project read models | complex write rules with many read shapes, audit requirements, temporal queries | simple CRUD; team unfamiliar with projections | eventual-consistency surprises in the UI; projection rebuild cost |
| **Pipeline / workflow** | ordered stages (nodes) with explicit state, idempotency and retries; the shape of document processing and agent systems | long-running, multi-step jobs, LLM pipelines, ETL | request/response features | stages that mutate shared state; non-idempotent retries; large payloads in state |
| **Serverless / functions** | functions triggered by HTTP or events, managed scaling | spiky load, glue between managed services, low ops capacity | long-running processes, heavy local state, latency-sensitive paths | cold starts; vendor lock-in; sprawl without a map |
| **Backend-for-frontend** | one API tailored per client (web, mobile) in front of shared services | clients need different shapes and auth flows | one client | duplicated business logic across BFFs |
| **Plugin / micro-kernel** | small core with extension points; features are plugins | product is a platform (editors, assistants, integrations) | a fixed feature set | unstable extension API; plugins reaching into the core |

## Decision checklist

1. **Team and horizon**: how many people, how long must this live, how often will the shape change?
2. **Change hot spots**: which parts change weekly? Put boundaries around them.
3. **Integrations**: list external systems; each becomes a port with a fake (hexagonal applies here
   whatever the outer style).
4. **Consistency**: where must a read reflect the last write immediately? Keep those in one
   transaction boundary; everything else may be eventual.
5. **Scale and cost**: which path has real load? Scale only that; prefer one deployable until a
   measured need says otherwise.
6. **Operations**: who is on call? Fewer moving parts win.
7. **Write the ADR**: style, the forces above, the alternatives rejected and why, how to revisit.

## Frontend architecture

| Style | Choose it when |
|---|---|
| **Feature-sliced** (`app → pages → widgets → features → entities → shared`, imports only downward) | SPA or app-router frontends with several developers; enforced with a lint rule |
| **Component library + screens** | small apps; one person; design tokens drive everything |
| **Server-driven (server components, HTMX)** | content-heavy or form-heavy products where interactivity is local |
| **Micro-frontends** | several teams own distinct parts of one product; otherwise avoid |

## Agent and LLM systems

Treat them as **pipelines**: judgement steps are model calls with strict output schemas, correctness
steps are code; orchestration is a graph in code, not a conversation; every node is idempotent with
a small return value; large data lives in storage; evals measure the fuzzy parts.
