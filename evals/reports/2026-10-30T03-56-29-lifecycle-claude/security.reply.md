The threat model is written to `docs/14-security.md` and the audit is complete. No Critical or High finding is open. The file is uncommitted, since no spec task covers it and you did not ask for a commit.

**What the doc contains.** Assets and actors for both what exists today and the planned product from docs/01. Seven trust boundaries with a Mermaid diagram. Eighteen controls, each marked built with its test name or planned with the task or spec that must add it. Data protection rules, the dependency audit, the dated audit record, and five residual risks with owners and revisit dates.

**Audit results, most severe first:**

- **F-1 Medium.** `make check` runs only pytest. Lint, types, layer rules and `pip-audit` are not gates yet, though AGENTS.md and docs/15 say they are. Already tracked by T001-10 to T001-12, so no new task.
- **F-2 Low.** Swagger UI, ReDoc and the generated schema are served unauthenticated in every environment. Probe confirmed `/docs` and `/openapi.json` return 200. Fix: disable them unless the environment is `local`, with a parametrised test. Needs a task.
- **F-3 Low.** An unhandled exception leaves the API as a plain-text 500, not problem+json, which contradicts the contract's `default` response. Probe confirmed with a route raising `RuntimeError`. Fix: a generic `Exception` handler returning a 500 problem with no exception text, plus a test. Needs a one-line extension of AC-001-4.
- **F-4 Low.** `.gitignore` covers `.env` only. `git check-ignore` shows `.env.local`, `.env.production` and `backend/.env.local` are not ignored, while docs/16 tells developers to keep secrets in an ignored env file. Fix: ignore `.env.*` with an `.env.example` exception, checked by the repo script in T001-12. Amend T001-09.
- **Clean.** No secrets in tracked files or in the full commit history. `pip-audit` on the exported lockfile found no known vulnerabilities as of today. Lockfile is committed.

**Caveats.** The secrets scan was pattern-based because `gitleaks` is not installed on this machine. That is recorded as residual risk R-2 with a recommendation to add a scan step to CI in T001-13. Owners in the residual table are taken from docs/01 §7 and carry its `[assumed]` marks.

**What is next.** Add the three code fixes as spec tasks so they go through the normal test-first flow, and have the security reviewer revisit the doc when spec 002 brings authentication and tenant isolation, which is where the critical risk lives. The test suite still passes at 21 tests.