# Latest eval results · skills · claude

Most recent result per step across 2 run folder(s). A step re-run after a provider timeout or a usage
limit shows its re-run here; the earlier attempt stays in its own folder for the record.

| Step | Result | Checks | Judge | Cost | Turns | Time | From run | Note |
|---|---|---|---|---|---|---|---|---|
| status-fresh | ✅ | 1/1 | 5 | $0.74 | 2 | 39s | 2026-10-31T03-33-35 | The reply names teamly-skills as a clean anycrew init scaffold in phase Discover, states 'modular monolith with hexagona |
| research | ✅ | 3/3 | 5 | $1.15 | 9 | 169s | 2026-10-31T03-33-35 | docs/02-research.md gives each of the three questions (FastAPI version, Postgres RLS, Neon free tier) a findings table w |
| prd-seed | ✅ | 1/1 | 5 | $1.55 | 17 | 158s | 2026-10-31T03-33-35 | docs/03-prd.md has a persona table (§2), three journeys J1–J3 (§3), P0/P1/P2 scope with an explicit cut line (§4), FR-00 |
| patterns | ✅ | 3/3 | 5 | $2.06 | 16 | 270s | 2026-10-31T03-33-35 | ADR-001 is Accepted with a forces table (team/horizon, change hot spots, integrations, consistency, scale/cost, operatio |
| adr | ❌ | 1/3 | 5 | $1.72 | 17 | 167s | 2026-10-31T03-33-35 | docs/adr/ADR-00[2-9]-*.md: 0 < 1 |
| design | ✅ | 5/5 | 5 | $2.58 | 13 | 310s | 2026-10-31T03-33-35 | docs/11-frontend.md has a route table with purpose, data loaded and visibility rules, each P0 screen has exact words plu |
| llm | ✅ | 4/4 | 5 | $2.61 | 29 | 426s | 2026-10-31T03-33-35 | docs/06 §2 keeps judgement steps on the model (C1 intent enum, C2 member_id+citations) while code verifies IDs, computes |
| spec-seed | ✅ | 1/1 | 5 | $2.96 | 26 | 339s | 2026-10-31T03-33-35 | docs/specs/001-foundation/spec.md has 18 Given/When/Then ACs with pinned values (200 + `{\"status\": \"ok\ |
| plan | ✅ | 2/2 | 5 | $2.51 | 15 | 222s | 2026-10-31T03-33-35 | plan.md slice 1 is one route, one test and one screen with real paths (backend/tests/integration/test_health.py, backend |
| tasks | ✅ | 2/2 | 5 | $1.87 | 12 | 138s | 2026-10-31T03-33-35 | All 22 tasks in docs/specs/001-foundation/tasks.md carry a Files list and AC-001-n IDs, every 'After' dependency points  |
| implement-seed | ❌ | 0/2 | 3 | $2.60 | 38 | 231s | 2026-10-31T03-33-35 | missing Makefile |
| debug | ❌ | 0/1 | 5 | $1.37 | 9 | 130s | 2026-10-31T03-33-35 | `make check` exit 2: make: *** No rule to make target `check'.  Stop. |
| refactor | ❌ | 1/2 | 5 | $3.36 | 34 | 410s | 2026-10-31T03-33-35 | `make check` exit 2: make: *** No rule to make target `check'.  Stop. |
| deploy-check | ✅ | 2/2 | 5 | $1.54 | 17 | 235s | 2026-10-31T07-31-36 | Every checklist item is marked with concrete, dated evidence (commit 11f030d, ruff and pytest output, missing Makefile,  |
| docs | ✅ | 3/3 | 5 | $1.65 | 12 | 227s | 2026-10-31T07-31-36 | README.md has a two-sentence purpose, one Mermaid flowchart, five run commands and links to docs/README.md; the index li |
| sync | ✅ | 3/3 | 5 | $0.94 | 9 | 64s | 2026-10-31T07-31-36 | .anycrew/config.json tools now lists \"claude\" and \"cursor\"; .cursor/ holds 26 CLI-generated files (8 .mdc rules, 17  |
| checkpoint-final | ✅ | 1/1 | 5 | $1.34 | 9 | 96s | 2026-10-31T07-31-36 | Every row matches the tree: backend row names both suites (backend/tests/integration/test_health.py and backend/tests/un |

**13/17 steps pass · latest-run cost $32.56**
