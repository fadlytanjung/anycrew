Rewrote `docs/specs/001-foundation/plan.md`. Spec 001 is Ready, so planning was allowed.

**What changed in the plan**

- **Slice 1 is now one vertical path.** One route (`GET /api/health`), one test (`test_ac001_6_health_returns_ok` in `backend/tests/integration/test_health.py`), one screen (`frontend/src/app/App.tsx` showing **Teamly** and **API: ok** through the Vite proxy). Six steps, each naming its files. Done-when is a one-test pytest run, a clean `tsc`, and a browser check with both servers up.
- **Everything else moved behind it**, ordered by dependency: slice 2 backend hardening (config validation, problem+json, contract test), slice 3 screen states, tokens and the FSD lint rule, slice 4 Makefile and gates, slice 5 the two docs the gates cite with coverage floors wired, slice 6 CI, README and close. The old forward dependency from the coverage step to a later docs step is gone.
- **ADR-001 style kept explicitly.** A "Fit with ADR-001" paragraph records that `create_app(settings)` is the only composition root, `shared` holds only the error base, `modules/` is created empty, and the `deps` argument of rule 6 arrives with spec 002. That narrowing is also a row in the constitution check so it is not read as drift.
- **Constitution check and risks retained**, including the rule 60 vs rule 40 conflict about `make audit` needing the network. A dependencies table now says which slice each package enters.

**Two things to know**

- Slice 1 pulls in `openapi-typescript` because the conventions forbid hand-written API types. The plan flags this as the one place slice 1 could be made thinner if the team accepts a one-commit exception.
- `tasks.md` is still cut against the old plan. Its slice 1 is backend-only. It needs re-cutting with `/crew-tasks` before `/crew-implement` runs, and the task ranges in `docs/20-implementation-status.md` will shift with it. I left both untouched since the request covered plan.md only.