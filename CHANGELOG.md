# Changelog

## 0.3.0 — unreleased

- `anycrew init` asks for the architecture style (`--architecture`, `anycrew styles`) and seeds a Proposed `docs/adr/ADR-001`; `docs/13-conventions.md` is created at init; `/crew-patterns` confirms or supersedes the ADR and records patterns in the config.
- Evals: `skills` suite covering every remaining skill, interactive-init test, plugin manifest validation in CI.

## 0.2.1 — 2026-10-31

- Claude Code plugin loads its 17 tiered agents again: the plugin is now a generated root at `plugins/claude/` that the marketplace points to (Claude reads agents only from a plugin's own `agents/` folder; the repository root stays canonical for Antigravity and Codex).
- GitHub Release assets are the wheel and sdist only.

## 0.2.0 — 2026-10-31

- `/crew-patterns` and `/crew-refactor` with catalogues of architecture styles, design patterns and code smells; a new `quality-engineer` agent (balanced) owns smell audits, refactoring and the rules that make them stick; architect, implementer and reviewer consult the catalogues.
- Interactive `anycrew init`: asks which assistants (default: the ones detected) and which preset.
- Agents load in Antigravity plugins (no `model`/`tools` fields in canonical agents); the Claude Code plugin is a generated root at `plugins/claude/` with tiered agents.
- Evals: Antigravity runner and judge, Gemini API judge, per-step timeout, CI workflow with Anthropic workload identity federation.

## 0.1.1 — 2026-10-30

- PyPI shows a Python-specific description (`README.pypi.md`) and npm a Node-specific one (`README.npm.md`) instead of the repository README.

## 0.1.0 — 2026-10-29

- Wiki: 17 concept pages (`wiki/`) published to the GitHub wiki; logo and plugin icon; README in
  open-source form with a concepts primer and FAQ.

- First release: 16 agents, 22 `/crew-*` skills, 6 rules, 4 presets, docs skeleton, lint hook.
- CLI in Python (`uvx anycrew`, PyPI) and Node (`npx anycrew`, npm), byte-identical output, parity-tested.
- CLI: `init`, `sync`, `doctor`, `list`, `presets`; generators for Claude Code, Codex, Antigravity,
  Cursor, OpenCode and GitHub Copilot.
- Manifests for Claude Code plugins/marketplace and the Agent Plugins spec.
- Release pipeline: one tag publishes to npm and PyPI (trusted publishing) and creates the GitHub Release.
