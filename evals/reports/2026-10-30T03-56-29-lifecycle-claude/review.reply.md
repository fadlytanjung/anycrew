Confirmed. The High finding holds: the factory takes a required argument, nothing in the source builds settings from the environment, and the plan's `--factory` launch command cannot work with that signature.

# Review: spec 001 (Foundation), commits 0bf9aba..6f32ad1

**Gates run.** `make check` exits 0 but only runs pytest. Result below.

| Gate | Result |
|---|---|
| `make check` (pytest only) | 21 passed, 1 deprecation warning (httpx TestClient) |
| ruff check / format | clean (not wired into the gate) |
| pyright (default mode) | 0 errors (not wired in; no strict config) |
| lint-imports | "Could not read any configuration" (no `.importlinter`) |
| pip-audit, `uv lock --check` | clean |
| `make dev` | no such target |

Nothing was fixed. The working tree is unchanged.

## Findings

### Correctness

- **High** `backend/src/teamly/main.py:8`. The app cannot start from the environment. `create_app` requires a `settings` argument and nothing in `src/` ever calls `Settings()`. The plan's launch command `uvicorn teamly.main:create_app --factory` fails with a missing-argument TypeError. Violates AC-001-5 and plan.md line 20 ("constructed once in the composition root"). T001-04 is ticked and docs/15 and docs/20 mark AC-001-5 green anyway. Fix: a person resolves the plan's contradiction, then add a zero-argument factory that calls `create_app(Settings())` with tests for unset and invalid `TEAMLY_ENV`.
- **Medium** `backend/src/teamly/api/errors.py:69`. Unhandled exceptions and non-standard status codes return `500 text/plain`, not problem+json. Violates the contract's `default` Problem response and plan.md line 23. Fix: register an `Exception` handler returning a generic `internal_error` Problem with no exception text.
- **Medium** `backend/src/teamly/api/errors.py:42`. The HTTPException handler drops `exc.headers`. Verified: `POST /api/health` returns 405 without `Allow`, and a 401 loses `WWW-Authenticate`. Regression from Starlette's default. Fix: pass `headers=exc.headers` into the response.
- **Medium** `backend/src/teamly/api/errors.py:56`. Body validation errors name no field. Missing body gives `field: ""`, malformed JSON gives `field: "9"` (a character offset). Violates AC-001-4, which covers body validation. Only the query path is tested. Fix: map empty remainder and JSON decode errors to `body`, add a body test.
- **Low** `backend/src/teamly/api/errors.py:45`. Every 404 has its `detail` rewritten to the request path, including route-raised ones with a message. Undocumented. Fix: document as deliberate or apply only when no route matched.

### Security

- **Low** `backend/src/teamly/main.py:9`. `/docs`, `/redoc` and `/openapi.json` are served in production. The generated document disagrees with the authoritative contract (operationId, no `default` response). Fix: disable outside `local` and `test`.
- No secrets found in code, tests, Makefile or docs. Error messages do not echo input values.

### Data

- **Low** `Makefile:4`. `uv run` without `--locked` re-locks silently, so lockfile drift never fails the gate. Violates rule 40. Fix: use `uv run --locked`.

### Tests

- **Medium** `backend/tests/conftest.py:10`. The env stripper only removes upper-case `TEAMLY_*`, but pydantic-settings matches case-insensitively. Verified: `teamly_version=leaked uv run pytest` fails 2 tests. Three docs (docs/13 line 81, docs/16 line 12, config.py lines 3-4) falsely claim tests never read the process environment. Fix: strip case-insensitively, correct the three sentences.
- **Medium** `backend/tests/integration/test_health.py:10`. Health reporting a configured `TEAMLY_VERSION` is untested. The only test that sets a version asserts on the settings object, never the response. A hard-coded version string would pass the suite. Violates AC-001-3. Fix: add a test with `version="abc1234"` asserting on the body.
- **Low** `backend/tests/integration/test_health.py:30`. One assertion checks the YAML file's `additionalProperties`, not the app. No type check on `version`.
- **Low** `backend/pyproject.toml:15`. Starlette 1.10 deprecates the httpx TestClient. plan.md line 89 still names `httpx`. Fix: plan the `httpx2` move, add `filterwarnings = error`.
- **Unverified.** TDD order for T001-01, -03, -04, -05 cannot be confirmed. Each commit adds test and implementation together.

### Conventions

- **Medium** `Makefile:1`. No gate beyond pytest runs. No `.importlinter`, no `[tool.ruff]`, no `[tool.pyright]`. A domain module importing fastapi passes `make check`. Pending T001-10 to T001-12, which docs/15 states honestly. Fix: land T001-10 before any product spec.
- **Low** commit 6f32ad1. Adds docs/15 with no covering task and reuses closed IDs T001-04 and T001-05. Violates rule 00. Fix: add a task or record a deviation in docs/20.
- **Low** commit ccbc901. Added Makefile and .gitignore (T001-09 files) ahead of order. Disclosed in the commit and tasks.md, not in docs/20. Fix: deviation note in docs/20.
- **Low** `backend/src/teamly/config.py:52`. `TEAMLY_LOG_LEVEL` is validated but nothing configures logging. docs/16 line 17 claims it sets the log level. Fix: wire it in the composition root or mark it reserved.
- Conformant: routes are thin, domain/ports/services are empty and pure, every test name carries its AC ID, no real external calls, lockfile committed and consistent.

### Docs

- **Medium** `AGENTS.md:39`. The command table is false today. "Install everything" and "Tests only" cd into a `frontend/` that does not exist, `make dev` has no target, and `make check` runs pytest only. Fix: add a dated note scoped to T001-09 through T001-12, or list only existing targets.
- **Low** `docs/20-implementation-status.md:21`. Gaps line says docs/13 does not exist. It was created in b4a2da4.
- **Low** `docs/13-conventions.md:47`. Status paragraph says `api/errors.py` and `contracts/` are still to come. Both exist.
- **Low** `docs/specs/001-foundation/plan.md:79`. Dependency version column still reads "lockfile" although the plan says T001-01 fills it; T001-99 also claims the work.
- **Low** No test compares the served `/openapi.json` with `contracts/openapi.yaml`, so they drift silently.

## Drift table

| Statement / AC | Bucket | Evidence |
|---|---|---|
| AC-001-1 `make setup` | Missing (T001-09 pending) | no target |
| AC-001-2 `make dev` | Missing (T001-09 pending) | no target |
| AC-001-3 health 200 with default version | Conformant | `test_ac001_3_health_returns_ok_and_version` |
| AC-001-3 version equals `TEAMLY_VERSION` | Untested | only default asserted |
| AC-001-3 body matches `HealthResponse` | Conformant (weak) | keys and enum only |
| AC-001-4 unknown `/api/*` path 404 problem | Conformant | `test_ac001_4_unknown_api_path_is_problem_404` |
| AC-001-4 query validation 422 | Conformant | `test_ac001_4_validation_error_is_problem_422` |
| AC-001-4 body validation names fields | Drift (code wrong) | `errors.py:56`, no test |
| AC-001-5 rejects missing/invalid `TEAMLY_ENV` | Conformant | `test_ac001_5_missing_env_fails_naming_variable`, `test_ac001_5_invalid_env_value_fails` |
| AC-001-5 start-up path reads the environment | Missing | no `Settings()` in `src/` |
| AC-001-5 valid vars create the app | Conformant | `test_ac001_5_every_allowed_env_creates_the_app` |
| AC-001-6, -7, -8, -9, -10, -11 | Missing (tasks pending) | no frontend, no gates, no CI |
| Any error is problem+json | Drift (code wrong) | `errors.py:69` |
| `create_app(settings)` started with `--factory` | Drift (plan contradicts itself) | `main.py:8` |
| Tests never read the process env | Drift (doc wrong) | docs/13, docs/16, config.py |
| `TEAMLY_LOG_LEVEL` sets log level | Drift | validated, unused |
| Layers enforced by a tool | Missing | no `.importlinter` |
| Lockfile enforced by gate | Untested | no `--locked` |
| Dropped HTTPException headers | Undocumented regression | `errors.py:42` |
| Docs UI served in production | Undocumented | `main.py:9` |
| docs/15 "no testable AC unproven" | Drift (doc wrong) | two AC halves unproven |
| T001-01..05 one task, one commit, docs/20 updated | Conformant | commits ccbc901 through 5062136 |
| docs/15 commit bookkeeping | Drift | 6f32ad1 has no task |

## Verdict

**Merge-blocking.** One High finding: the app has no start-up path from the environment and the plan's launch command fails. Because plan.md contradicts itself, a person must amend plan.md and tasks.md before T001-09 proceeds.

The Medium findings (unhandled errors as text/plain, dropped headers, body-validation field names, env leak in tests, untested configured version, no gates beyond pytest, false AGENTS.md command table) should be fixed before the next product spec but do not block this merge on their own.