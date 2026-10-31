Verification is complete. The two docs already present match the template sections exactly, and every claim in them checked out against the tree today, so I left them as written rather than regenerating them.

## Pre-deploy checklist for Teamly at commit `11f030d` (2026-10-31)

**Result: not deployable. One item passes vacuously, six fail. No deploy was run and none is approved.**

**1. Check command green on the exact commit; commit references its spec. ❌**
There is no check command yet. `make check` fails with "No rule to make target" because no Makefile exists (spec 001 task T001-15, status "Specified" in docs/20). The individual gates that do exist are green on HEAD:

```
$ git rev-parse --short HEAD      -> 11f030d
$ uv run ruff check .             -> All checks passed!
$ uv run ruff format --check .    -> 18 files already formatted
$ uv run pytest -q                -> 13 passed in 0.01s
```

The HEAD commit is `refactor(legacy): enforce the complexity limit and the wall-clock ban`. Its body carries no `Tasks:` trailer and the legacy module has no owning spec (docs/20 row "Legacy amount report").

**2. Migrations forward-only, dry-run attached, contract step separate. ✅ (vacuous)**
No migrations, migration tool or database adapter exist. Directories `backend/alembic` and `backend/migrations` are absent and pyproject lists no SQLAlchemy or Alembic. There is nothing to dry-run. The rule is recorded for later in docs/16 §6.

**3. Configuration present in the target environment; no secret in a file, image or log. ❌**
The secrets half passes. A regex scan for key, token, password and secret literals across py, md, json, toml and yaml found nothing. No `.env` exists in the tree and `git check-ignore -v .env` matches `.gitignore:12`. There is no image or pipeline log to inspect. The presence half fails: docs/16 §4 lists the three variables (`APP_ENV`, `LOG_LEVEL`, `API_PORT` from `backend/app/config.py`), but no staging or production environment exists to check them against. Also, nothing reads `LOG_LEVEL` and `API_PORT` is not wired to uvicorn.

**4. Feature flags and limits set for the release. ❌**
No flag mechanism exists. The limits named in docs/06 for triage are not in `Settings` and triage has no spec. Nothing to set.

**5. Rollback: command, previous version, who runs it. ❌**
No deploy command, no artifact, no host. `git tag | wc -l` returns 0, so there is no previous version to roll back to. No owner is named. Recorded as TBD in docs/16 §6.

**6. Monitoring covers the change; cost budget alert exists. ❌**
A grep of `backend/app` for `logging`, `structlog`, `opentelemetry` and `os.environ` returns no match. No dashboard, no alert and no cost budget exist. docs/17 §4 lists five proposed alerts, all with role placeholders and no accepted owner.

**7. Deploy. Skipped.** Not requested and not possible: there is no artifact, pipeline or environment.

## Files

- `docs/16-infrastructure.md` and `docs/17-observability.md` exist, untracked, and follow the anycrew templates section for section. Each section states what exists today with a dated check, and marks the rest "not yet decided" with a role owner. Both already carried the identical gate output I reproduced above, so no edits were needed. Both rows in `docs/README.md` now resolve.
- Nothing is committed. `docs/20-implementation-status.md` was not changed because no component changed status.

## What unblocks the ❌ items

- Items 1 and 3 partly: finish spec 001 slices 4 to 6 (Makefile T001-15, gate config T001-16, repo check T001-17, CI T001-20).
- Items 3, 5, 6 and 7: a hosting and deploy decision does not exist in any spec or ADR. It needs an ADR for the compute host and managed Postgres (PRD Q6, ADR-002 assumes Neon) and then a spec covering build, deploy, rollback, logging and alerts.
- No dates can be set from the repository. The owners in docs/16 and docs/17 are roles, not people, until the person assigns them.