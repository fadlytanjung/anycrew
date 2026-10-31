The first three tasks of spec 001 are done, each in its own commit with the tree clean afterwards.

**Commits on `master`**

- `9db7507` docs: committed the pending crew output (spec 001, PRD, research, ADR-002, design docs) so the task list exists in history before the first feature commit.
- `8b99512` feat(001) T001-01: `backend/pyproject.toml` with fastapi pinned to 0.162.0, `uv.lock`, and a root `.gitignore` for the venv and caches. Resolved versions are in the commit body.
- `4805478` feat(001) T001-02: the health test and the `client` fixture, seen failing first with `ModuleNotFoundError` for the missing `app` package. Async tests run on the anyio pytest plugin that httpx already brings in, so no extra dependency.
- `b56f505` feat(001) T001-03: `Settings`, `create_app(settings)`, `build()` for the uvicorn factory, and the constant health route with a Pydantic response model.

**Gate results on the last commit**

```
uv run pytest -q             1 passed in 0.01s
uv run ruff check .          All checks passed!
uv run ruff format --check . 13 files already formatted
```

Importing `app.main` with an empty environment succeeds, and the factory starts with the documented defaults when only `APP_ENV` is set. `docs/20-implementation-status.md` now shows the backend skeleton as In progress with the test suite named, and the three tasks are ticked in `tasks.md`.

**One deviation from the request.** `make check` does not exist yet. The Makefile is task T001-15 and depends on T001-10 and T001-14, and the process rules forbid writing code no task covers or taking tasks out of order. The equivalent backend gates were run directly and are green, as shown above. If you want a `make check` earlier, the clean fix is a task change: either move T001-15 forward with a backend-only `check` target, or add a small task after T001-03 for a provisional Makefile. Say which and I will do it. Otherwise the next task is T001-04, the OpenAPI contract for the health route.