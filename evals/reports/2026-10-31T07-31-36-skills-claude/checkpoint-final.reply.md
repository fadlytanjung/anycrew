`docs/20-implementation-status.md` now matches the working tree. Every link resolves, the backend suite is green, and the change is left uncommitted alongside the other pending edits.

**What I checked against the tree**

- Backend tests: ran offline from the existing venv, 13 passed on 2026-10-31.
- Present: backend app with health route, legacy report module, two health test suites, triage prompt files and schemas, `contracts/design/tokens.json`, drafted `README.md`, `docs/16`, `docs/17` and `CHANGELOG.md` (all four untracked).
- Absent: `frontend/`, `Makefile`, `scripts/`, `.github/`, `contracts/openapi.yaml`, `docs/15-testing.md`. There is no status checker script to run.

**What changed in the doc**

- Backend row now names both health suites, the unit one was missing, and lists what T001-04 and T001-07 to T001-10 still lack.
- Frontend and gates rows now say plainly that the directories and the Makefile do not exist, so the check command in AGENTS.md does not run yet.
- New row for the infrastructure doc as In progress: drafted but T001-19 stays unticked because its prerequisite tasks are open.
- CI and README split into two rows. CI stays Specified. README is In progress: drafted, untracked, T001-21 unticked because it depends on the Makefile task.
- Gaps gained the triage prompt files that exist with no spec, no caller and no test, the untracked changelog, and a note that "tests green" means the raw pytest command until the Makefile exists.
- Last-updated line refreshed with today's date and the reason.

**Not done, by design**

- No commit. The working tree holds unrelated uncommitted edits to skills, the docs index and the glossary, and nobody asked for a commit.
- No tasks ticked. README and `docs/16` are written, but their tasks list prerequisites that are still open, so ticking them would be a spec conflict for the implementer to resolve.