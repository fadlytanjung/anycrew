<p align="center">
  <img src="https://raw.githubusercontent.com/fadlytanjung/anycrew/main/assets/logo.svg" alt="anycrew" width="560">
</p>

**One crew of specialist AI agents for any coding assistant.**
Spec-driven · test-first · security-reviewed · model-tiered

`anycrew` installs a ready-made engineering team into the coding assistant you already use:
Claude Code, OpenAI Codex, Google Antigravity, Cursor, OpenCode or GitHub Copilot. Sixteen agents
(brainstormer, product manager, architect, designer, spec writer, implementer, tester, reviewer,
security reviewer, debugger, AI engineer, release engineer, doc writer, scout, crew lead) follow one
spec-driven method from idea to a deployed MVP, and each declares how much model it needs so cheap
work runs on cheap models.

This package is the Node CLI. It has no dependencies and needs Node 18 or newer.

## Install and run

```bash
npx anycrew init                 # run without installing
npm install -g anycrew           # or install the `anycrew` command
```

## Quick start

```bash
cd your-project
anycrew init --preset python-fastapi-react --tools claude,codex,antigravity
# or just:  anycrew init     (detects the assistants on your machine)

anycrew doctor                   # what each assistant will read
anycrew list                     # agents, tiers and the model each assistant will use
anycrew sync                     # regenerate after editing .anycrew/config.json or upgrading
```

Then open your assistant in the folder and type `/crew-status`. For a new idea, `/crew-brainstorm`;
for an existing codebase, `/crew-spec`.

## What `init` writes

```
your-project/
├── AGENTS.md                   agent guide, read by every assistant (yours to edit)
├── docs/                       constitution, status, specs index, ADR and spec templates (yours)
├── .anycrew/config.json        preset, tools, model overrides
├── .agents/rules|skills|agents universal layer: Codex, Antigravity, Cursor, Copilot, OpenCode
├── .claude/ .codex/ .cursor/ .opencode/ .github/   native files per assistant
└── .anycrew/hooks/             lint-after-edit hook
```

Generated files carry an `anycrew:generated` marker; `sync` rewrites only those. `AGENTS.md` and
everything under `docs/` are created once and then belong to you.

## Presets

`python-fastapi-react`, `node-typescript-next`, `go-service`, `generic`, or your own JSON file:
`anycrew init --preset ./my-stack.json`. A preset carries commands and conventions, never code.

## Model tiers

| Tier | Claude Code | Antigravity | Codex | Used by |
|---|---|---|---|---|
| fast | haiku, low effort | flash | low effort | scout, doc-writer |
| balanced | sonnet, medium | flash | medium | implementer, tester, researcher, designer, release-engineer |
| strong | opus, high | pro | high | brainstormer, product-manager, architect, spec-writer, reviewer, security-reviewer, debugger, ai-engineer, crew-lead |

Override per project in `.anycrew/config.json` under `models`.

## Documentation

- Repository and full README: https://github.com/fadlytanjung/anycrew
- Wiki (every concept explained: SDD, ADR, PRD, acceptance criteria, gates, tiers): https://github.com/fadlytanjung/anycrew/wiki
- Changelog: https://github.com/fadlytanjung/anycrew/blob/main/CHANGELOG.md

A Python build of the same CLI exists on PyPI (`uvx anycrew`) for teams without Node; both generate byte-identical
projects.

## Licence

MIT.
