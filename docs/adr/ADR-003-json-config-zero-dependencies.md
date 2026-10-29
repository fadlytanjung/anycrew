# ADR-003 — JSON configuration and a zero-dependency Node CLI

**Status:** Accepted · **Date:** 2026-10-29

## Context
The CLI must run with `npx` on any developer machine and inside CI without an install step. YAML is
friendlier to write but needs a parser; front matter needs only a small subset.

## Decision
`models.json`, `presets/*.json` and `.anycrew/config.json` are JSON. The CLI has no dependencies and
targets Node ≥ 18. Front matter is parsed by a deliberately small reader that supports the subset
anycrew's own files use.

## Consequences
- Good: `npx anycrew init` works offline after the first fetch; nothing to audit in `node_modules`.
- Bad: the front matter reader is not general YAML; the validator keeps canonical files inside the
  supported subset.
