# 02 — Agents

Each agent is one Markdown file in `agents/` with front matter and a body that is the agent's system
prompt: role, inputs, outputs, procedure, rules, stop-and-ask conditions.

| Agent | Tier | Phase | Reads | Writes | Job in one line |
|---|---|---|---|---|---|
| crew-lead | strong | all | AGENTS.md, 00, 20, specs index | — | routes and sequences; never codes |
| scout | fast | all | the maps | — | finds what exists; read-only |
| brainstormer | strong | discover | 00, 02 | 01 | idea → scored options → decision |
| researcher | balanced | discover | 01, 00 | 02 | facts with sources and confidence |
| product-manager | strong | define | 01, 02, 00 | 03, 04 | personas, journeys, P0/P1/P2, FR/NFR |
| architect | strong | design | 03, 00, 02, 13 | 05, 09, 10, ADRs, contracts | containers, boundaries, data, contract |
| designer | balanced | design | 03, 05, 10 | 11, 12, tokens, mocks | screens, states, tokens, gates |
| ai-engineer | strong | design | 05, 06, 00 | 06, prompts, schemas, evals | model/code boundary, calls, evals |
| spec-writer | strong | specify | 03, 05, 09, 10, 13, specs | specs, 04, 20 | spec, plan, tasks with ACs |
| implementer | balanced | build | AGENTS.md, 00, 13, spec | code, tests, tasks.md | one task, TDD, one commit |
| tester | balanced | build | 15, spec, 13 | tests, fixtures, 15 | AC → test map, fixtures, evals |
| debugger | strong | build | spec, 17, 13 | code, tests | root cause with regression test |
| reviewer | strong | verify | 00, 13, spec, rules | — | findings with evidence; drift table |
| security-reviewer | strong | verify | 14, 05, 09, 10 | 14, tests | threat model, audit, test per fix |
| release-engineer | balanced | ship | 05, 16, 17, 14 | 16, 17, Dockerfile, CI | build, pipeline, deploy, rollback, observability |
| quality-engineer | balanced | build | 13, 15, 00 | code, lint/layer rules, 13 | smell audit, refactor one commit at a time, rules that make it stick |
| doc-writer | fast | record | docs, README | README, 20, glossary, changelog | the record stays true |

Numbers refer to `docs/NN-*.md` in the project ([06 Project layout](06-project-layout.md)).

## Front matter

```yaml
---
name: implementer                 # equals the file name
description: "…when to use…"      # ≤ 1024 chars; this is what the assistant reads to delegate
tier: balanced                    # fast | balanced | strong  (portable)
phase: build
reads: [AGENTS.md, docs/00-constitution.md]
writes: [source code, tests]
tools_claude: Read, Grep, Glob, Write, Edit, Bash   # Claude tool allow-list; other tools ignore it
---
```

`tier` is the portable field; no canonical agent carries a `model` (Antigravity rejects anything but
its own tier names, and Claude aliases would age). Per-tool models are generated: `anycrew init`
writes them into a project, and `npm run build:claude` writes the Claude Code plugin to
`plugins/claude/` (tiered agents, skills, hooks), which the marketplace points at, so a plugin install
gets tiers too. The root `agents/` folder is what Antigravity loads from
the plugin, with `model: inherit`.

## Customising

- **Exclude an agent** in a project: `.anycrew/config.json` → `agents.exclude: ["designer"]`, then
  `anycrew sync`.
- **Change an agent's model** in a project: edit the generated file and remove the
  `anycrew:generated` marker; `sync` will leave it alone and report it. Or override the tier
  mapping for the whole project under `models`.
- **Add a project agent**: write it in the assistant's native folder (`.claude/agents/`,
  `.agents/agents/`, …) without the marker. It coexists with the crew.
- **Change the crew itself**: edit `agents/*.md` in a fork, run `npm test`, and install your fork.

## Writing a good agent

- The description says *when* to use it, in the third person, with the trigger words a person
  would type.
- The body states inputs, outputs, a numbered procedure, rules, and when to stop and ask.
- Under ~12k characters; put long reference material in a skill's `references/` folder instead.
- No stack-specific commands in a canonical agent; those come from the preset and `AGENTS.md`.
