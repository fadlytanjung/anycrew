(timed out)
Architecture set is complete and validated. Everything is in the working tree, uncommitted, because the ADRs need the decision owner's approval before they count as accepted.

**What I found.** An earlier pass had already written `docs/05-architecture.md`, `docs/09-data-model.md` and `docs/10-api-contract.md`, but they referenced three ADRs that did not exist, the contract YAML held only the health endpoint, and the conventions doc stopped at layout and layers.

**What I wrote or extended**

- `docs/adr/ADR-001-render-single-container.md`: one cloud (Render), one container serving `/api` and the built React app, Render Postgres, auto-deploy from `main`. Prices marked assumed pending docs/02.
- `docs/adr/ADR-002-postgres-sqlalchemy-alembic.md`: Postgres as the only store, SQLAlchemy 2 async on asyncpg behind repository and UnitOfWork ports, Alembic with tested downgrades.
- `docs/adr/ADR-003-sessions-and-password-hashing.md`: opaque session token in an HttpOnly cookie, hashed at rest in Postgres, argon2id for passwords, Origin check for CSRF.
- `docs/adr/README.md`: index of the three, plus the pending decisions.
- `contracts/openapi.yaml`: every P0 endpoint from docs/10 §3, one operation per row, with field limits from docs/03 §6, the cookie security scheme and the closed list of problem codes. It passes openapi-spec-validator, all refs resolve, and the existing backend suite still passes.
- `docs/13-conventions.md`: added the patterns table (principal, scoping, roles, unit of work, audit, limits, errors, injected time), the "adding an endpoint" order, coding conventions and git conventions.
- `docs/20-implementation-status.md` gap line and `docs/specs/README.md` build order updated to point at the architecture.

| Check | Result |
|---|---|
| OpenAPI paths / operations | 17 / 23 |
| Validator | OK |
| Backend tests | 21 passed |

**Constitution check** is the table in docs/05 §7, one line per principle. Two items still need the decision owner: the proposal to delete P2 and the P6 text, both raised in docs/03 §8.

**Specs to write, in build order**

1. 002 Persistence and audit (NFR-007, ADR-002)
2. 003 Deployment (NFR-002, NFR-012, ADR-001)
3. 004 Accounts and sessions (FR-001 to FR-003, NFR-004 to NFR-006, ADR-003)
4. 005 Workspaces and membership (FR-004 to FR-006, FR-009, NFR-003)
5. 006 Invites (FR-007, FR-008)
6. 007 Lists (FR-010 to FR-012)
7. 008 Tasks (FR-013 to FR-015, FR-017)
8. 009 Assignment and completion (FR-016, FR-018, FR-019)
9. 010 Views and counts (FR-020 to FR-022)
10. 011 Demo readiness (NFR-008 to NFR-011)
11. P1, only after 011 records a green deployed rehearsal: 012 owner controls, 013 task hygiene, 014 activity and digest, 015 account deletion, 016 hardening and observability

**Left out and why.** No commit, since you did not ask for one and the ADRs are at the approval gate. The designer docs 11 and 12 and the research doc 02 are still missing and are flagged in docs/20. Next step is `/crew-spec 002` once the ADRs are approved.