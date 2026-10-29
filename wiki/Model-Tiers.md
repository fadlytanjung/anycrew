# Model Tiers

**Definition.** A tier is the portable label an agent declares for how much model it needs:
`fast`, `balanced` or `strong`. anycrew maps the tier to each assistant's own model vocabulary, so
the agent files stay the same everywhere and the cheap work goes to cheap models.

| Tier | Purpose | Cost of being wrong | Agents |
|---|---|---|---|
| **fast** | read, search, summarise, format, status updates | a minute | scout, doc-writer |
| **balanced** | implement a task, write tests, research, infra | an hour | implementer, tester, researcher, designer, release-engineer |
| **strong** | decisions and judgement: scope, architecture, specs, security, review, hard bugs | a week | brainstormer, product-manager, architect, spec-writer, reviewer, security-reviewer, debugger, ai-engineer, crew-lead |

## Mapping

`models.json` in the repository maps each tier per assistant: Claude Code aliases plus effort
(`haiku/low`, `sonnet/medium`, `opus/high`), Antigravity tiers (`flash`, `flash`, `pro`), Codex
reasoning effort (`low`, `medium`, `high`), OpenCode `provider/model`, and `inherit` for Cursor and
Copilot until you set model IDs. Projects override per tool in `.anycrew/config.json` under
`models`; `npx anycrew list` shows the effective table.

## Why not model names in the agents

Model names are tool-specific and change monthly. A tier is a statement about the *job*, which does
not change. The mapping is one small file to maintain instead of sixteen agents times six tools.

## Choosing a tier

Start one tier lower than instinct says and promote when reviews or evals show the agent falling
short. The cheapest model that passes is the right one.

## Related

[Agents, Skills and Rules](Agents-Skills-Rules.md)
