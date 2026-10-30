# 08 — Roadmap

## 0.1 (now)

- 17 agents, 24 skills, 6 rules, 4 presets, docs skeleton, lint hook, CLI with six targets.
- Manifests for Claude Code and Agent Plugins.

## 0.2

- Exercise the generated files in Codex, Cursor, OpenCode and Copilot and move them from
  *documented* to *verified* in the tool matrix; fix the hook payload keys where they differ.
- `anycrew eval`: a small eval suite per agent (`evals/<agent>/case.yaml`) runnable with
  `claude plugin eval` and as plain scripts, so claims about agent quality have evidence.
- MCP server list in the config, rendered to every assistant's MCP file.
- Gemini CLI extension output (`gemini-extension.json`, `.gemini/agents`).

## 0.3

- Windsurf/Devin, Cline, Kiro, Amp and Augment targets.
- `anycrew upgrade`: show what changed in the pack since the project's version and re-sync.
- Example project built with the crew end to end, with its docs and status page, as a reference.
- Presets contributed by the community; a `presets/README.md` catalogue.

## Deliberately out

- A runtime, daemon or swarm orchestration.
- Memory databases and learning loops beyond what the assistant provides.
- Non-engineering agents (marketing, sales). Other packs cover those.
