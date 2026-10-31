Pre-deploy checklist for Teamly at commit `11f030d`: **0 of 7 items are green.** Teamly is not deployable today. It has a health endpoint and 13 passing tests, but no build artifact, pipeline, host, deploy command, rollback or monitoring. Nothing was deployed and nothing was committed.

**Files created** (untracked in the working tree, from the anycrew 0.2.0 templates):

- `docs/16-infrastructure.md` fills the config table from `backend/app/config.py` (APP_ENV required, LOG_LEVEL and API_PORT with defaults), the local run command, the gates that run today and a short runbook. Environments, artifact, pipeline, deploy, rollback and cost guardrails are marked "not yet decided" with an owner placeholder.
- `docs/17-observability.md` records that no logging, tracing or metrics code exists. It states the target for each and lists five proposed alerts with TBD owners and thresholds.

**Checklist**

| # | Item | Result | Evidence |
|---|---|---|---|
| 1 | Check green on the commit; commit references its spec | ❌ | `make check` cannot run: no `Makefile` exists. The nearest gates pass (output below). HEAD is a refactor commit that cites spec 001 T001-16 in prose but has no `Tasks:` trailer and implements no task. |
| 2 | Migrations forward-only, dry-run attached | ❌ | No database code, no migration tool, no migration files in the tree. ADR-002 on Postgres is still Proposed. |
| 3 | Config present in target env; no secrets leaked | ❌ | No target environment exists to check. Secret grep found no hits. `.env` is ignored at `.gitignore:12` and no `.env` file exists. `backend/.env.example` is missing (T001-10). |
| 4 | Feature flags and limits set | ❌ | No flags in code. Settings holds no limits. The triage limits exist only in `docs/06-agent-design.md`. |
| 5 | Rollback command, previous version, owner | ❌ | Zero git tags, no release history, no artifact. Section 6 of docs/16 is TBD. |
| 6 | Dashboards, alerts, cost budget alert | ❌ | None exist. docs/17 holds proposals only. |
| 7 | Deploy | ❌ skipped | No deploy requested. No deploy command, Dockerfile, workflow or host is documented. |

**Gate output**, run in `backend/` on 2026-10-31 at `11f030d`, re-run by me after the agent:

```
uv run ruff check .          -> All checks passed!
uv run ruff format --check . -> 18 files already formatted
uv run pytest -q             -> 13 passed in 0.01s
```

**Risks found, by file**

- `backend/app/api/health.py` returns no version. A deploy cannot be traced to a commit through the health endpoint. Changing this needs a spec change because AC-001-6 fixes the body.
- `backend/app/config.py` declares LOG_LEVEL and API_PORT but nothing reads them, and LOG_LEVEL is not validated as a real level.
- `contracts/openapi.yaml` does not exist although AGENTS.md calls it authoritative. T001-04 is open.
- The working branch is `master` while the main branch is `main`. Reconcile before wiring CI.
- The planned `ConfigurationError` wrapper (T001-07) is not built. A missing APP_ENV raises a raw pydantic error.

**What turns the list green**, in order: finish spec 001 tasks T001-15 to T001-22 (Makefile, check gates, CI workflow), then decide host and artifact through an ADR, tag a first release, write the deploy and rollback commands into docs/16 section 5 and 6, and configure one health alert plus a budget alert with named owners in docs/17. Items 1 and 7 are owned by the implementer and release engineer; items 2 and the hosting decision by the architect; the budget by the product owner.

The two new docs are ready to review and commit. `docs/20-implementation-status.md` was left unchanged because no component changed status.