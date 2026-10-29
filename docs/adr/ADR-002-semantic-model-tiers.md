# ADR-002 — Agents declare semantic model tiers, mapped per assistant

**Status:** Accepted · **Date:** 2026-10-29

## Context
Assistants express model choice differently: Claude aliases and effort, Antigravity tiers
(`flash|pro`), Codex reasoning effort, OpenCode `provider/model`, Cursor and Copilot model IDs that
change monthly. Writing model names into agents would tie the crew to one assistant and one month.

## Options considered
| Option | Costs | Gives |
|---|---|---|
| Model names in agents (as most catalogues do) | tool-specific, ages fast | precision |
| No model selection (as most methods do) | every role on the default model; cost and latency | simplicity |
| Semantic tiers + a per-tool mapping with overrides | one mapping file to keep current | portable, explainable, cheap by default |

## Decision
Three tiers, `fast`, `balanced`, `strong`, with a purpose statement each. `models.json` maps each
tier to each assistant's own vocabulary; projects override per tool in `.anycrew/config.json`.
Where an assistant cannot express a tier safely, the mapping is `inherit`.

## Consequences
- Good: the roster reads the same everywhere; the cost story is explicit.
- Bad: the mapping needs maintenance as vendors rename models; aliases are preferred to slow it down.

## How to revisit
Add a fourth tier only if two agents need materially different models within one tier in practice.
