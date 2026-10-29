# ADR-004 — Skills are named `crew-*` and use Agent Skills spec fields only

**Status:** Accepted · **Date:** 2026-10-29

## Context
Skills land in a project's `.agents/skills/` next to the team's own skills and other packs'. Names
like `review`, `plan` or `docs` collide. Some assistants refuse to package skills with non-spec front
matter fields.

## Decision
Every anycrew skill is `crew-<verb>` (`/crew-spec`, `/crew-implement`). Front matter uses only
`name`, `description`, `license` and `metadata` (the agent and phase live under `metadata`).
Assistant-specific extras (argument hints, tool allow-lists, hooks) are not used in canonical skills.

## Consequences
- Good: tab completion on `/crew-` lists the whole method; skills package anywhere.
- Bad: no per-skill argument hints in assistants that support them; the body states the inputs.
