# Standards

anycrew builds on open formats wherever one exists, and generates native files only where none does.

## AGENTS.md

A plain Markdown file at the repository root (nested ones allowed) that gives an agent the context a
new teammate would need. No schema. Stewarded by the Agentic AI Foundation under the Linux
Foundation; read by Codex, Antigravity, Cursor, OpenCode, Copilot, Windsurf, Cline, Kiro, Amp and,
since version 2.1.277, Claude Code. anycrew's `AGENTS.md` template adds the "where the truth lives"
table, the how-to-work loop, commands, non-negotiables and the definition of done.

## Agent Skills (`SKILL.md`)

A directory with a `SKILL.md` whose front matter has `name` (equal to the directory name) and
`description`, optionally `license`, `compatibility`, `metadata`, `allowed-tools`, plus optional
`scripts/`, `references/`, `assets/`. Originated at Anthropic, adopted by nearly every assistant.
anycrew's skills use spec fields only so they package anywhere; the agent and phase live under
`metadata`.

## Agent Plugins (`plugin.json`)

A packaging spec with a `plugin.json` at the root, `skills/` and an optional `mcp.json`; read by
Codex, Cursor and Copilot CLI. anycrew's root `plugin.json` follows it, and the same file carries the
fields Antigravity reads. Claude Code uses its own `.claude-plugin/plugin.json`, which anycrew also
ships; Codex and Copilot accept that layout too.

## Subagents

No cross-tool standard yet. The de-facto shape is Markdown with `name`, `description`, `model` and
`tools` in front matter, but the folders and the `model` values differ. anycrew keeps one canonical
file per agent and generates each assistant's version.

## MCP (Model Context Protocol)

The protocol assistants use to reach external tools and data (databases, issue trackers, browsers).
Each assistant has its own config file. anycrew does not configure MCP servers yet; a shared server
list rendered to every assistant is on the roadmap.

## Related

[Agents, Skills and Rules](Agents-Skills-Rules.md) · [Hooks](Hooks.md)
