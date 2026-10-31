Fixed and verified. The backend suite is green with the regression test in place, and nothing is committed.

**Root cause.** The uncommitted edit to `backend/app/api/health.py` changed the response model's `status` field from `Literal["ok"]` to `Literal["okay"]` while the handler kept returning the constant `"ok"`. Pydantic validates at construction, so the handler raised a validation error before FastAPI could respond. The spec is unambiguous that the body is `{"status": "ok"}` (AC-001-6 in `docs/specs/001-foundation/spec.md`, and plan step 4 and task T001-04 define the schema as `enum [ok]`). The code drifted, not the docs, so the fix went in the code.

**Changes in the working tree:**
- `backend/app/api/health.py` restored to `Literal["ok"]`. The file is now identical to HEAD.
- `backend/tests/unit/test_health_model.py` added with two tests. One asserts the model's JSON schema pins `status` to exactly `"ok"`. The other calls the handler directly and asserts its status. Both were run against the broken file first and failed with the expected errors, then passed after the fix.
- `backend/tests/unit/__init__.py` added to mirror the integration package.

**Gate results:**

| Gate | Result |
|---|---|
| `uv run pytest -q` | 3 passed |
| `uv run ruff check .` | clean |
| `uv run ruff format --check .` | clean |
| `make check` | cannot run, no Makefile exists yet |

The Makefile is task T001-15 and is still unticked, so `make check` could never have passed on this branch. AGENTS.md advertises the command ahead of the spec delivering it. Pyright, import-linter and repo checks are also not set up yet (T001-16), so I could not run them.

**Ruled out, each with evidence:**
- Test client fixture: `conftest.py` unchanged from HEAD, and the error originates inside the handler.
- Router wiring or prefix: `main.py` unchanged and still mounts under `/api`. A wiring fault gives 404, not a validation error.
- Settings or APP_ENV: `config.py` unchanged, and the handler never reads settings.
- Dependency or lockfile drift: `git diff --stat` showed only `health.py`. `uv lock --check` and `uv sync --locked --dry-run` report no changes.
- Pytest or anyio configuration: unchanged, test was collected and ran normally.
- Stale virtualenv: dry-run sync would make no changes.

**Two things for you to decide:**
- No task in `tasks.md` covers the new unit test. Attach it to T001-03 in the commit body or add a small task before committing.
- Consider noting in AGENTS.md or the status doc that `make check` is unavailable until T001-15 lands, since the command table currently promises it.