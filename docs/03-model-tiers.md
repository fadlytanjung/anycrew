# 03 — Model tiers

## Why

Most of an engineering day is cheap work: finding files, updating a status table, formatting a
changelog, running a checklist. A smaller part is judgement: scoping, architecture, specs, security,
hard bugs. Using the strongest model for everything is slow and expensive; using a weak model for
judgement is worse. anycrew makes the choice explicit per role and portable across assistants.

## The three tiers

| Tier | Purpose | Agents |
|---|---|---|
| **fast** | read, search, summarise, format, status updates, mechanical edits; high volume, low stakes | scout, doc-writer |
| **balanced** | implement a task, write tests, routine review, research with sources, infra and deploy work | implementer, tester, researcher, designer, release-engineer |
| **strong** | decisions and judgement: brainstorm, product scope, architecture, specs, security, final review, hard debugging, LLM feature design | brainstormer, product-manager, architect, spec-writer, reviewer, security-reviewer, debugger, ai-engineer, crew-lead |

## Mapping per assistant (`models.json`)

| Tier | Claude Code (`model`/`effort`) | Antigravity (`model`) | Codex (`model_reasoning_effort`) | OpenCode (`model`) | Cursor | Copilot |
|---|---|---|---|---|---|---|
| fast | `haiku` / `low` | `flash` | `low` | `anthropic/claude-haiku-5-5` | `inherit` | inherit |
| balanced | `sonnet` / `medium` | `flash` | `medium` | `anthropic/claude-sonnet-5-5` | `inherit` | inherit |
| strong | `opus` / `high` | `pro` | `high` | `anthropic/claude-opus-5-5` | `inherit` | inherit |

Notes:

- Claude Code accepts aliases (`haiku`, `sonnet`, `opus`, `fable`, `inherit`) and an `effort`
  field; aliases age better than dated IDs.
- Antigravity subagents accept `inherit | flash | pro`; `flash_lite` exists only in its workflow
  scripts, so fast and balanced both map to `flash`.
- Codex keeps your default model and varies only reasoning effort; set `model` per tier in the
  override if you want a cheaper model for fast work.
- OpenCode takes `provider/model-id`; change the provider to yours.
- Cursor and Copilot accept model IDs but their catalogues change often; the default `inherit`
  keeps the chat's model until you set IDs.

## Overriding per project

`.anycrew/config.json`:

```json
{
  "models": {
    "codex": { "fast": { "model": "gpt-5-mini", "model_reasoning_effort": "low" } },
    "opencode": { "strong": "openai/gpt-5.5" },
    "cursor": { "strong": "claude-opus-5[effort=high]" }
  }
}
```

Then `anycrew sync`. `anycrew list` shows the effective mapping.

## Choosing a tier for a new agent

Ask: if this agent is wrong, what does it cost? A wrong file listing costs a minute (fast). A wrong
test costs an hour (balanced). A wrong architecture costs a week (strong). When unsure, start one
tier lower and promote when the evals or the reviews say so.
