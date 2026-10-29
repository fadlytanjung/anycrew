# 05 — Landscape

Checked on 2026-10-29 (stars and activity from the GitHub API that day). This page exists so that
we are honest about what already exists and what anycrew adds.

## The field

| Project | Shape | Tools | Model tiering | Lifecycle coverage |
|---|---|---|---|---|
| **obra/superpowers** (~308k★) | skills only (brainstorm, plans, TDD, debugging, review) | 16 harnesses; in the Anthropic and OpenAI marketplaces | none | plan → code → review; no security, docs, deploy roles |
| **github/spec-kit** (~144k★) | SDD commands (`constitution/specify/plan/tasks/implement`) via a Python CLI | 43 integrations | none | specify → implement; extensions for the rest |
| **BMAD-METHOD** (~55k★) | heavy agile methodology with role agents and modules | skills via `npx skills`, Claude/Codex marketplaces | none found | broad; Node + Python + uv; v7 in alpha |
| **wshobson/agents** (~42k★) | catalogue: 94 plugins, 202 agents, 185 skills; adapters per harness | 7 harnesses | **yes**: `model: opus|sonnet|haiku` mapped per harness | catalogue, not a workflow |
| **oh-my-claudecode** (~40k★) | agents with tier variants, model × agent matrix | Claude Code (Codex via sibling) | **yes**, Claude-centric | autopilot modes |
| **ruflo** (~80k★) | maximalist harness: swarms, memory, 314 MCP tools, daemon | Claude Code, Codex | task routing, opaque | everything, at a cost |
| **VoltAgent subagents** (~26k★), **contains-studio/agents** (stale) | agent catalogues | Claude Code only | static `model:` / none | none |
| **Compound Engineering** (~26k★) | 36 skills incl. capture-learnings | 14 hosts | none | brainstorm → ship → learn |
| **OpenSpec** (~73k★) | vendor-neutral spec format | 30+ tools | none | specify only |
| **ruler**, **rulesync** | distribution layers for rules, skills, subagents, MCP across 28+ tools | — | pass-through | not methods |
| **Kiro** (AWS) | proprietary IDE with specs, steering, hooks, agents | Kiro only | per-agent model ID | locked in |

## What anycrew takes from them

- From superpowers and Compound Engineering: skills as the portable unit, brainstorming before
  planning, a learning/record step at the end.
- From spec-kit and Kiro: the constitution and the spec → plan → tasks artefacts.
- From wshobson/agents and oh-my-claudecode: per-agent model selection, generated per harness.
- From ruler and rulesync: the idea of one source and native outputs (anycrew ships its own small
  generator because its inputs are narrower: one crew, one method).

## What anycrew adds

1. **Semantic, portable model tiers** (`fast | balanced | strong`) mapped to every assistant, with
   project overrides. No methodology framework declares tiers today.
2. **A whole-lifecycle roster** where security, testing, docs, release and the status page are
   roles with gates, not add-ons.
3. **An MVP track**: brainstorm with scoring and a cut line, P0-first, deploy checklist with
   rollback, a status page investors and teammates can read.
4. **Multi-agent systems as a target product**: the AI engineer, the LLM rule and `docs/06` are
   about building agent systems correctly (model/code boundary, schemas, grounding, evals).
5. **Light footprint**: Markdown plus a zero-dependency Node CLI; small always-on context.

## What anycrew does not try to do

Swarms, memory databases, autopilot loops, 300 MCP tools. If you need those, ruflo or
oh-my-claudecode are the places to look. anycrew is the team and the method; the assistant is the
runtime.
