# Changelog

## 0.1.0 — 2026-10-29

- Wiki: 17 concept pages (`wiki/`) published to the GitHub wiki; logo and plugin icon; README in
  open-source form with a concepts primer and FAQ.

- First release: 16 agents, 22 `/crew-*` skills, 6 rules, 4 presets, docs skeleton, lint hook.
- CLI in Python (`uvx anycrew`, PyPI) and Node (`npx anycrew`, npm), byte-identical output, parity-tested.
- CLI: `init`, `sync`, `doctor`, `list`, `presets`; generators for Claude Code, Codex, Antigravity,
  Cursor, OpenCode and GitHub Copilot.
- Manifests for Claude Code plugins/marketplace and the Agent Plugins spec.
- Release pipeline: one tag publishes to npm and PyPI (trusted publishing) and creates the GitHub Release.
