# Contributing

Thanks for helping. anycrew is small on purpose; the bar for a change is "a startup team would use
this on day one".

## Layout

| Path | What | Rule |
|---|---|---|
| `agents/*.md` | canonical agents | front matter `name`, `description`, `tier`, `model` (Claude alias, must match `models.json`), optional `tools`; body under ~12k chars |
| `skills/<name>/SKILL.md` | canonical skills | Agent Skills spec fields only; `metadata.anycrew-agent` names the agent; under 8 KB |
| `rules/*.md` | canonical rules | `trigger: always_on|model_decision|glob`; keep always-on rules short |
| `presets/*.json` | stack presets | commands, layout, globs, conventions |
| `models.json` | tier → model per tool | aliases over dated IDs |
| `templates/` | AGENTS.md and the docs skeleton | `{{placeholders}}` filled by the CLI |
| `lib/`, `bin/` | the CLI | zero dependencies, Node ≥ 18 |
| `docs/` | the wiki | one question per page |

## Workflow

1. Open an issue or a draft PR describing the change in one paragraph.
2. `npm test` must pass (`scripts/validate.mjs` + `scripts/smoke.mjs`).
3. For a new assistant target: add it to `TOOLS`, `models.json`, `lib/generate.mjs`, the smoke test
   and `docs/04-tool-matrix.md` with its verification status.
4. For a new agent: add the file, reference it from at least one skill, add it to `docs/02-agents.md`.
5. Keep prose plain. No marketing language in agents, skills or docs.

## Versioning

`package.json`, `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json` and `plugin.json`
carry the same version; `npm run validate` checks it.
