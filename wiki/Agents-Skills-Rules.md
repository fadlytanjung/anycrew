# Agents, Skills and Rules

Coding assistants accept three kinds of customisation. They look similar (all Markdown) and are
easy to confuse. anycrew uses all three, each for one job.

| | Agent | Skill | Rule |
|---|---|---|---|
| **What it is** | a specialist with its own system prompt, tools and model, run in its own context | a procedure loaded on demand, usually typed as `/name` | guidance loaded as context, always or by path |
| **Answers** | *who* does the work | *how* a task is done, step by step | *what* must always hold |
| **Lifetime** | one delegated task | one invocation | the whole session (or while matching files are open) |
| **anycrew ships** | 16 (`agents/`) | 22 `/crew-*` (`skills/`) | 6 + stack rules (`rules/`) |
| **Where assistants read it** | `.claude/agents`, `.agents/agents`, `.codex/agents`, `.cursor/agents`, `.opencode/agents`, `.github/agents` | `.agents/skills` (most), `.claude/skills` | `.agents/rules`, `.claude/rules`, `.cursor/rules`, `.github/instructions` |

## Agent

Front matter: `name`, `description` (what triggers delegation), `tier`, optional `tools`. Body: role,
inputs, outputs, numbered procedure, rules, stop-and-ask conditions. The assistant picks an agent
from its description, so the description says *when* to use it in the third person.

## Skill

anycrew's skills are thin: each names the agent and tier it delegates to, the inputs, the
template and the "done when". The method lives in the agents and templates, so a skill stays under
8 KB and packages anywhere (Agent Skills spec fields only).

## Rule

Front matter: `trigger` (`always_on`, `glob` with `globs`, `model_decision`, `manual`) and
`description`. Always-on rules are the process, the architecture boundaries and security; path
rules carry stack conventions from the [preset](Presets.md); `model_decision` rules load when the
assistant judges them relevant (LLM features, testing, docs).

## How they combine

A person types `/crew-implement 007`. The skill delegates to the **implementer** agent at the
balanced tier. The agent reads `AGENTS.md` and the spec, and works under the always-on **rules**
plus the backend rule for the files it edits. A **hook** lints the file it just changed.

## Related

[Model Tiers](Model-Tiers.md) · [Hooks](Hooks.md) · [Standards](Standards.md)
