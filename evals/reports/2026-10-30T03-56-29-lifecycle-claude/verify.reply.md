Verified the reviewer's main claims myself: the uvicorn factory failure reproduces, the error module registers only two handlers, and the field name drops the first `loc` element. Nothing was changed in the repo.

## Spec 001 conformance audit

**Verdict:** the five ticked tasks (T001-01 to T001-05) mostly conform and all installed gates pass. Spec 001 is **not** ready for Built. Three drift rows need a decision, nine tasks are still unticked, and some docs lag the code.

### Gate output

```
$ cd backend && uv run pytest -q     → 21 passed, 1 warning (StarletteDeprecationWarning: install httpx2)
$ make check                         → runs only pytest; 21 passed
$ uv run ruff check .                → All checks passed!   (tool defaults, no [tool.ruff] yet)
$ uv run ruff format --check .       → 19 files already formatted
$ uv run pyright                     → 0 errors              (standard mode, not strict; no [tool.pyright] yet)
$ uv run lint-imports                → "Could not read any configuration." exit 1 (no .importlinter)
```

### Conformance table

| ID | Spec statement | Code | Test | Status |
|---|---|---|---|---|
| AC-001-3 | 200, `application/json` | `api/routes/health.py:14` | `test_health.py::test_ac001_3_health_returns_ok_and_version` | Conformant |
| AC-001-3 | body `{"status":"ok","version":"<TEAMLY_VERSION>"}` | `health.py:16` | same test, default value only | **Untested** for a non-default version |
| AC-001-3 | default `0.0.0-dev` | `config.py:53` | `test_config.py::test_ac001_5_defaults_applied` | Conformant |
| AC-001-3 | body validates against `HealthResponse` | `contracts/openapi.yaml:25` | `test_health.py::test_ac001_3_health_matches_contract` | Conformant |
| AC-001-4 | unknown `/api/*` → 404 problem+json, exact body, `detail` = path | `api/errors.py:42` | `test_errors.py::test_ac001_4_unknown_api_path_is_problem_404` | Conformant |
| AC-001-4 | 422, `code: validation_error` | `errors.py:51` | `test_errors.py::test_ac001_4_validation_error_is_problem_422` | Conformant |
| AC-001-4 | `errors` array "naming each invalid field" for body **or** query | `errors.py:56` | query only | **Drift** (D3) |
| AC-001-4 | Problem bodies match contract | `errors.py:22` | `test_errors.py::test_ac001_4_problem_bodies_match_contract` | Conformant |
| AC-001-5 | unset or invalid `TEAMLY_ENV` fails naming the variable | `config.py:32` | `test_config.py::test_ac001_5_missing_env_fails_naming_variable`, `..._invalid_env_value_fails` | Conformant |
| AC-001-5 | all valid → creation succeeds | `main.py:8` | `test_config.py::test_ac001_5_every_allowed_env_creates_the_app` | Conformant |
| AC-001-5 | "no server starts" | no start-up path builds `Settings` | none | **Drift** (D1) |
| plan | `create_app(settings)`; uvicorn starts it with `--factory` | `main.py:8` | none | **Drift** (D1) |
| plan | errors leave the API as RFC 9457 with a stable `code` | `errors.py:69` | none for 500 | **Drift** (D2) |
| plan | tests construct `Settings(...)`, never read process env | `tests/conftest.py:6` | all tests | Conformant |
| contract | title, version 0.1.0, `operationId: getHealth`, `Problem` default response | `openapi.yaml:3-22` | none | Untested (static; T001-12 adds parse check) |
| AC-001-8 | layer rules | no violations by reading; not enforced | none | Conformant by reading, unenforced |
| T001-02 | docs/13 Layout and Layers | `docs/13-conventions.md:9-103` | n/a | Conformant, stale lines (D4, D5) |
| T001-04 | docs/16 table with exactly three variables | `docs/16-infrastructure.md:14-18` | n/a | Conformant |
| rule 60 | test names carry the AC id | all 11 tests | n/a | Conformant |
| docs/20 | Foundation row | status In progress, `_Last updated:` present | n/a | Conformant |
| AC-001-1, 2, 6, 7, 9, 10, 11 | setup/dev targets, frontend, gates, check-repo, CI, README | none | none | **Missing** (T001-06 to T001-14 unticked, as expected) |

### Drift rows needing a decision

- **D1 (High) `make dev` cannot start the app.** `backend/src/teamly/main.py:8` requires a `settings` argument, but plan.md line 18 and T001-09 say uvicorn runs it with `--factory`. Reproduced: uvicorn exits with status 3 and "create_app() missing 1 required positional argument". Proposal: change the doc. Plan.md, docs/13 and T001-09 should name a zero-argument entry point that builds `Settings()` from the environment and calls `create_app`. Keep `create_app(settings)` as the test seam.
- **D2 (Medium) unhandled exceptions are not problem+json.** `errors.py:69` registers only `HTTPException` and `RequestValidationError`. A `RuntimeError` in a route returns a `text/plain` 500, which contradicts plan.md line 23 and the contract's default Problem response. Proposal: change code, and extend AC-001-4 with one line for 500.
- **D3 (Medium) body-level 422 errors have an empty field name.** `errors.py:56` drops the first `loc` element. A missing body yields `field: ""` and malformed JSON yields `field: "1"`. AC-001-4 says "naming each invalid field". Proposal: change code and add a body-validation test. The spec wording is right.
- **D4 (Low) stale docs.** docs/13 lines 47 to 50 still say `api/errors.py` and `contracts/` arrive later. docs/20 line 21 says docs/13 does not exist. Proposal: change the docs.
- **D5 (Low) domain purity rule is weaker in docs/13 and T001-10 than in AC-001-8.** They allow the whole standard library, which would admit `os`, `socket` and `time`. Proposal: change the doc to forbid named stdlib I/O modules.

### Undocumented behaviour

- `/docs` and `/openapi.json` are served in every environment, and the generated schema uses a different `operationId` from the authoritative contract.
- 405 responses lose the `Allow` header because the handler drops `exc.headers`.
- `code` derives from `HTTPStatus.phrase`, which Python 3.13 renames for 422. Safe only while pyproject pins `<3.13`.
- `.gitignore` and the Makefile were created in T001-01 though T001-09 owns them, and docs/20 does not note the deviation.
- `docs/14-security.md` is untracked, claims an audit at a commit it is not part of, and its C2 row claims a 405 test that does not exist.

### Forward evidence for T001-10

With the planned ruff rules there is one error, `B905` at `config.py:38`. Pyright strict finds 39 errors in tests on untyped `TestClient` responses and none in `src/`.

Next step is yours: decide each drift row, then `/crew-implement 001` continues at T001-06.