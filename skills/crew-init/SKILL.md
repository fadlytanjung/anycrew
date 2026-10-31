---
name: crew-init
description: "Bootstraps anycrew in the current repository: picks a stack preset, writes AGENTS.md, the docs skeleton (constitution, PRD, architecture, specs index, implementation status), the always-on rules and the lint hook, and generates the native files for every coding assistant the person uses. Use on a new or existing project before any other crew skill."
license: MIT
metadata:
  anycrew-agent: crew-lead
  anycrew-phase: setup
---

# Initialise the crew in this repository

Prefer the CLI (`uvx anycrew …` with Python, or `npx anycrew …` with Node); it is idempotent and
only writes generated files:

```bash
anycrew init --preset <python-fastapi-react|node-typescript-next|go-service|generic> \
  --tools <claude,codex,antigravity,cursor,opencode,copilot> --name "<project>"
```

Without either runtime, do the same by hand:

1. **Ask four things** if not given: the project name and one-sentence purpose, the stack
   preset (or "generic"), which assistants the team uses (usually one or two), and the
   architecture style from `anycrew styles` (default: modular monolith with hexagonal modules;
   `undecided` is allowed and `/crew-patterns` decides later). The style becomes a Proposed
   `docs/adr/ADR-001-architecture-style.md`.
2. **Write `AGENTS.md`** from `templates/AGENTS.md`, filling the name, purpose, the preset's
   commands and layout. Keep it under 32 KB; it is read by every assistant.
3. **Create `docs/`** from `templates/docs/`: `00-constitution.md` (keep the generic principles,
   add project ones later), `README.md` (index), `20-implementation-status.md` (empty table),
   `specs/README.md`, `adr/README.md`. Create the other numbered docs only when a phase needs them.
4. **Rules**: copy `rules/*.md` to `.agents/rules/`; write `20-backend.md` and `30-frontend.md`
   from the preset's conventions with its globs.
5. **Hooks**: install the lint-after-edit hook for each assistant from `hooks/`.
6. **Config**: write `.anycrew/config.json` with the preset, tools and any model overrides.
7. **Verify**: the check command from the preset runs (even if it only prints TODO); every
   assistant sees the skills (`/crew-status` answers).

Done when `/crew-status` reports the project as initialised, names the architecture style and the
first phase (usually `crew-brainstorm` for a new idea, or `crew-spec` for an existing codebase).
