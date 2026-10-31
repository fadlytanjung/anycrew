Spec 001 (Foundation) is written, marked Ready, and wired in. Nothing was committed, since the task did not ask for a commit.

**Files created** under `docs/specs/001-foundation/`:
- `spec.md`: 5 user stories, 18 Given/When/Then acceptance criteria covering `make setup/dev/check/test`, `GET /api/health`, problem+json 404s, start-up validation of `APP_ENV`, the React/Vite shell with an API status widget, the FSD lint rule, CI and the offline repo checks (secrets, synthetic email domains). Target layout, out of scope and edge cases included.
- `plan.md`: 5 slices in build order (backend health first as the vertical slice, then frontend, Makefile and gates, CI, docs 15/16), 22 numbered changes with real file paths, the `contracts/openapi.yaml` contract, a dependency table and a constitution check.
- `tasks.md`: 17 tasks plus the close task, 8 of them TDD with test paths and names. Every one of the 18 ACs is referenced by at least one task (verified by grep).

**Wiring edits:**
- `docs/03-prd.md`: added NFR-010 (liveness endpoint) because the PRD had no requirement for health while the deploy check verifies one, and added a foundation bullet to the P0 scope.
- `docs/04-requirements-traceability.md`: spec column filled for NFR-003 (scan only), NFR-004, NFR-007, NFR-009 (repo check only) and the new NFR-010.
- `docs/specs/README.md`: index row for 001 (the Mermaid node already existed).
- `docs/20-implementation-status.md`: four components added as Specified, last-updated line refreshed.

**Two decisions worth knowing about:**
- The plan keeps `make audit` (pip-audit, npm audit) outside `make check` because the testing rule says check never touches the network while the security rule asks for an audit in check. It runs as a separate CI job instead. This conflict is recorded in the plan's constitution check.
- Versions other than FastAPI 0.162.0 (from the research doc) are left to the lockfiles rather than invented. Node LTS and the coverage floors are marked as assumptions.

**Next:** `/crew-implement` starts at T001-01. The architect's `/crew-architecture` output (docs 05, 09, 10) is still missing but 001 does not depend on it.