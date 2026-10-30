T001-01 is done, verified and committed. `make check` is green on the committed tree.

**What was built**
- Backend scaffold under `backend/` with a src-layout package `teamly`, the `create_app(settings)` factory, a thin `GET /api/health` route returning `{"status": "ok", "version": ...}`, and the empty layer packages `services`, `domain`, `ports`, `adapters`.
- A minimal `Settings` model with the `TEAMLY_` prefix, a required `env` enum and `version` defaulting to `0.0.0-dev`. T001-04 adds `log_level` and the tests.
- The integration test `test_ac001_3_health_returns_ok_and_version` was run first and failed with `ModuleNotFoundError: No module named 'teamly'`, then passed after the package existed.
- The check command did not exist, so a minimal root `Makefile` with `test` and `check` targets plus a `.gitignore` were created. T001-09 extends both as planned.

**Commits on master**
- `0bf9aba` docs(001): the previously uncommitted spec, brainstorm and traceability docs, committed separately so the feature commit holds only the task.
- `ccbc901` feat(001): health endpoint returns ok and version, with `Tasks: T001-01` and `AC: AC-001-3` trailers, `uv.lock`, the task ticked in `tasks.md`, and the Foundation row in the status doc moved to In progress with today's date.

**Check output**
```
cd backend && uv run pytest -q
1 passed, 1 warning in 0.15s
```

**One thing to note.** Starlette now warns that using `httpx` with its test client is deprecated in favour of `httpx2`. The plan names `httpx`, so the implementer kept it. Before Slice 2 turns on strict gates, decide whether to amend the plan's dependency table and switch.

Next task is T001-02, recording the layout and layers in `docs/13-conventions.md`.