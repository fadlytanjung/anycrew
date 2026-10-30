T001-02 is done and committed. The next unchecked task is T001-03.

**What changed**
- Created `docs/13-conventions.md` with a Layout section (the backend and frontend trees from plan 001, plus a note on what exists today) and a Layers section (allowed-import table, the `create_app(settings)` composition root, where tests and fakes live, the frontend import order).
- Ticked T001-02 in `docs/specs/001-foundation/tasks.md`.
- `docs/README.md` already listed doc 13 in its table, so no change was needed there. The status doc was untouched because no component changed status.

**Verification**
- `make check` currently runs the backend pytest suite only. Result: 1 passed, 1 warning. The warning is a Starlette deprecation about `httpx` in `TestClient`.
- Commit `b4a2da4` with trailers `Tasks: T001-02` and `AC: AC-001-8`. Working tree is clean. Not pushed.

**One spec issue to watch**
T001-09 plans to start the server with `uvicorn teamly.main:create_app --factory`. Uvicorn calls a factory with no arguments, but `create_app` requires a `settings` argument. T001-09 will need a zero-argument wrapper in `main.py` that builds `Settings` from the environment, or the task text should change. Nothing was altered yet. Raise this with the spec-writer before T001-09 starts.