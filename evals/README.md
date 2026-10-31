# anycrew evals

End-to-end evaluation of the crew on a real project: a scratch full-stack repository is initialised
with `anycrew init`, then a coding assistant runs the lifecycle skills one after another
(`/crew-status` → `/crew-brainstorm` → `/crew-prd` → `/crew-architecture` → `/crew-spec` →
`/crew-implement` → `/crew-test` → `/crew-review` → `/crew-security` → `/crew-verify` →
`/crew-checkpoint`). After each step the harness grades the repository two ways:

- **Deterministic checks** (no model): files exist, IDs and formats are present, commands exit 0.
- **LLM judge**: a separate headless assistant run scores the artefact against a rubric (1–5) and
  explains the score; the judge sees only the files, never the producing agent's transcript.

Reports land in `evals/reports/<timestamp>/` with a Markdown summary, the per-step JSON (cost,
turns, duration, checks, judge) and the full project tree for inspection.

## Run

```bash
# Claude Code (logged in); runs in a scratch directory, ~30–60 minutes, uses your subscription
node evals/run.mjs --suite lifecycle --runner claude
node evals/run.mjs --suite lifecycle --runner claude --until spec     # stop after a step
node evals/run.mjs --suite lifecycle --runner claude --dir ./tmp/teamly --keep
```

```bash
# Antigravity (Gemini) as the producing assistant, Antigravity as the judge: no API key needed
node evals/run.mjs --suite lifecycle --runner agy
# Claude produces, Gemini judges (cross-vendor grading)
node evals/run.mjs --suite lifecycle --runner claude --judge agy
```

**Auth.** Runners and judges use the logins already on the machine: Claude Code's claude.ai login
and Antigravity's Google login. A stray `ANTHROPIC_API_KEY` / `ANTHROPIC_AUTH_TOKEN` is ignored unless
you pass `--use-api-key` (that is what CI does after the Anthropic workload-identity exchange, see
`.github/workflows/evals.yml`). A preflight call per engine runs first and aborts if auth is broken. Each step is killed after
`--step-timeout` minutes (default 45) and recorded as a failure, so a hung API call cannot stall the
suite; re-run just that step with `--from <id> --until <id>` against the same `--dir`.

Runners: `claude` (Claude Code, `claude -p`), `agy` (Antigravity CLI, `agy -p`). Judges: `claude`,
`agy`, `gemini` (Gemini API with `GEMINI_API_KEY`; the harness bundles the project files into the
prompt, for CI where no Google login exists; model via `GEMINI_JUDGE_MODEL`), `none`. Codex
(`codex exec`) is planned; the case files are runner-agnostic.

**In CI** (`.github/workflows/evals.yml`, run from the Actions tab): Claude Code produces, authenticated
through Anthropic workload identity federation (no stored key), and the judge is `gemini` by default
(secret `GEMINI_API_KEY`), `claude`, or `none`. The federation identifiers are in the workflow;
repository variables of the same names override them.

## Suites

| Suite | Scenario | Steps |
|---|---|---|
| `lifecycle` | **Teamly**: a small team to-do SaaS (auth, workspaces, lists, tasks, invites) on the `python-fastapi-react` preset | status, brainstorm, prd, architecture, spec, implement ×3, test, review, security, verify, checkpoint |

A case is a JSON object: `id`, `prompt` (sent to the assistant), `checks` (deterministic) and
`judge` (rubric). Check types: `exists`, `absent`, `grep` (regex in file), `count` (glob with
`min`), `cmd` (exit code 0 in the project dir).

## Reading a report

`evals/reports/LATEST-<suite>-<runner>.md` holds the most recent result per step across all run
folders of that suite (a re-run after a provider timeout replaces the earlier attempt there);
`evals/reports/LATEST.md` indexes those files. `npm run eval:latest -- <suite> <runner>` rebuilds them.

`PASS` means every deterministic check passed and the judge scored ≥ 3. The summary table shows,
per step: checks passed/total, judge score, cost and duration. Failures list the first failing
check or the judge's reason, so a regression in an agent or skill points at the file to fix.

## Latest results

Lifecycle suite, Claude Code runner and judge, Teamly on `python-fastapi-react`, 30–31 Oct 2026
(reports in `evals/reports/2026-10-30T*-lifecycle-claude/`):

| Step | Checks | Judge | Note |
|---|---|---|---|
| status | – | 5 | phase and next skill correct |
| brainstorm | 4/4 | 5 | weighted criteria, 8 options, scoring table, decision, risks, names |
| prd | 6/6 | 5 | 40 FR + 16 NFR as testable sentences, cut line, traceability rows (re-run after an API timeout) |
| architecture | 8/8 | 5 | containers and sequences, layer table, ER and state tables, OpenAPI 3.1 with 17 paths and 13 error codes, 3 ADRs (re-run after an API timeout and a usage limit) |
| spec | 8/8 | 5 | 11 Given/When/Then ACs, vertical first slice, 15 ordered tasks |
| implement ×3 | 6/6 | 4, 5, 3 | one task per commit with trailers; the check target first covered only pytest (prompt tightened since) |
| test | 2/2 | 3 | 21 tests, make check green; several ACs left "pending" (prompt tightened since) |
| review | – | 5 | real gate output, severity-ranked findings with path:line and scenarios |
| security | 3/3 | 5 | threat model with 7 boundaries and 18 controls mapped to tests; evidence-backed audit |
| verify | – | 5 | all 11 ACs bucketed with evidence; drift rows handed to a person |
| checkpoint | 2/2 | 5 | status matches the tree; suites named |

13/13 steps pass; two steps needed a re-run because of provider-side timeouts and a usage limit,
which the harness now bounds with `--step-timeout`. Total accounting across runs: about $33.

Skills suite (the 17 steps covering every remaining skill), Claude Code runner and judge, fresh
Teamly init, 31 Oct 2026 (reports in `evals/reports/2026-10-31T*-skills-claude/`):

| Step | Checks | Judge | Note |
|---|---|---|---|
| status-fresh | 1/1 | 5 | names the ADR-001 style and recommends `/crew-patterns` after the PRD |
| research | 3/3 | 5 | dated, labelled findings; single-source facts flagged; time-boxed spikes |
| prd-seed | 1/1 | 5 | personas, journeys, cut line, FR/NFR tables, constitution check |
| patterns | 3/3 | 5 | ADR-001 accepted with forces and five styles compared; pattern table in docs/13; config updated |
| adr | 1/3 | 5 | correct ADR-002 with options table; the check regex was too strict (fixed since) |
| design | 5/5 | 5 | route table, state tables per screen, tokens.json with 21 contrast pairs, UI gates |
| llm | 4/4 | 5 | model/code boundary, prompts as files with schemas, eval dataset and scorers |
| spec-seed, plan, tasks | 5/5 | 5, 5, 5 | 18 ACs, vertical first slice, 22 tasks with TDD and dependencies |
| implement-seed | 0/2 | 3 | three tasks, one commit each, but no Makefile because the gate task sat later in the order (implementer rule added since) |
| debug | 0/1 | 5 | root cause, smallest fix, regression test, ruled-out list; `make check` absent for the same reason |
| refactor | 1/2 | 5 | characterisation tests first, four refactor commits, complexity and wall-clock rules added; same `make check` gap |
| deploy-check | 2/2 | 5 | every item evidenced or owned; docs/16 and docs/17 started (re-run after a usage limit) |
| docs | 3/3 | 5 | README, index, glossary and changelog with every number sourced (re-run) |
| sync | 3/3 | 5 | cursor added through the CLI; written vs skipped reported; AGENTS.md untouched (re-run) |
| checkpoint-final | 1/1 | 5 | rows match the tree, suites named, nothing promoted (re-run) |

13/17 steps pass on the first run; the judge scored every agent 5 except the implementer (3). The
four failures share one cause: the implementer left the `make check` gate for a later task, so
three later checks that run `make check` could not pass, and one check regex rejected a valid ADR
heading. Both are fixed; the suite re-runs from `implement-seed` on the next release. Cost: about $35.
