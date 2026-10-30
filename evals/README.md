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

The Claude runner uses your claude.ai login; a stray `ANTHROPIC_API_KEY` is ignored unless you
pass `--use-api-key`. A preflight call runs first and aborts the run if auth is broken.

Runners: `claude` (Claude Code, `claude -p`). Antigravity (`agy -p`) and Codex (`codex exec`) are
planned; the case files are runner-agnostic.

## Suites

| Suite | Scenario | Steps |
|---|---|---|
| `lifecycle` | **Teamly**: a small team to-do SaaS (auth, workspaces, lists, tasks, invites) on the `python-fastapi-react` preset | status, brainstorm, prd, architecture, spec, implement ×3, test, review, security, verify, checkpoint |

A case is a JSON object: `id`, `prompt` (sent to the assistant), `checks` (deterministic) and
`judge` (rubric). Check types: `exists`, `absent`, `grep` (regex in file), `count` (glob with
`min`), `cmd` (exit code 0 in the project dir).

## Reading a report

`PASS` means every deterministic check passed and the judge scored ≥ 3. The summary table shows,
per step: checks passed/total, judge score, cost and duration. Failures list the first failing
check or the judge's reason, so a regression in an agent or skill points at the file to fix.
