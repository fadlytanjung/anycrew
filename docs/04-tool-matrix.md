# 04 — Tool matrix

What each assistant reads, what `anycrew init` / `sync` writes for it, and how far it has been
verified. Formats were checked against each vendor's documentation on 2026-10-29; **verified** means
exercised in that assistant with the generated files, **documented** means the format matches the
vendor docs but has not been exercised yet.

## Universal layer (written for every project)

| File | Read by | Status |
|---|---|---|
| `AGENTS.md` | Claude Code (when no CLAUDE.md, or via `@AGENTS.md`), Codex, Antigravity, Cursor, OpenCode, Copilot, Windsurf, Cline, Kiro, Amp | verified (Claude, Antigravity) |
| `.agents/skills/<name>/SKILL.md` | Codex, Antigravity, Cursor, Copilot, OpenCode, Windsurf/Devin, Amp, Augment, Roo | verified (Antigravity); documented (others) |
| `.agents/rules/*.md` (`trigger`, `globs`) | Antigravity, Windsurf/Devin | verified (Antigravity) |
| `.agents/agents/*.md` (`model: inherit|flash|pro`) | Antigravity | documented |
| `.agents/hooks.json` | Antigravity | documented (tool-name matcher is best effort) |
| `.anycrew/hooks/lint-after-edit.sh` | all hook configs | verified (Claude) |

## Per assistant

| Assistant | Files written | Model field | Install the pack globally | Status |
|---|---|---|---|---|
| **Claude Code** | `CLAUDE.md` (`@AGENTS.md`), `.claude/agents/*.md`, `.claude/skills/*`, `.claude/rules/*.md` (`paths`), `.claude/settings.json` hooks (merged) | `model` alias + `effort` | `claude plugin marketplace add fadlytanjung/anycrew && claude plugin install anycrew@anycrew` | verified |
| **Codex** | `.codex/agents/*.toml` (`developer_instructions`, `model_reasoning_effort`) + universal | `model`, `model_reasoning_effort` | `codex plugin marketplace add fadlytanjung/anycrew` (Agent Plugins `plugin.json`) | documented |
| **Antigravity** (IDE, app, `agy`) | universal layer + `.agents/hooks.json` | `model: inherit|flash|pro` | `agy plugin install https://github.com/fadlytanjung/anycrew` | rules and skills verified; agents documented |
| **Cursor** | `.cursor/rules/*.mdc` (`globs`, `alwaysApply`), `.cursor/agents/*.md`, `.cursor/hooks.json` + universal skills | `model: inherit|<id>` | Customize → Install (project or user scope) | documented |
| **OpenCode** | `.opencode/agents/*.md` (`mode: subagent`, `model`) + universal | `model: provider/id` | copy `skills/` to `~/.config/opencode/skills` | documented |
| **GitHub Copilot** (CLI, VS Code) | `.github/copilot-instructions.md`, `.github/instructions/*.instructions.md` (`applyTo`), `.github/agents/*.agent.md`, `.github/hooks/anycrew.json` + universal skills | `model` (string or list) | `copilot plugin install fadlytanjung/anycrew` | documented |

Not generated yet (see the roadmap): Gemini CLI extension (`gemini-extension.json`), Windsurf/Devin,
Cline, Kiro, Amp, Augment, Roo. Several of them already read `AGENTS.md` and `.agents/skills`, so the
universal layer gives them the method and the skills today.

## Hooks

One script, four dialects:

| Assistant | File | Event | Payload key used |
|---|---|---|---|
| Claude Code | `.claude/settings.json` | `PostToolUse` matcher `Write|Edit|MultiEdit` | `tool_input.file_path` |
| Antigravity | `.agents/hooks.json` | `PostToolUse` matcher `write_to_file|replace_file_content|multi_replace_file_content` | best effort |
| Cursor | `.cursor/hooks.json` v1 | `afterFileEdit` | `file_path` |
| Copilot | `.github/hooks/anycrew.json` v1 | `postToolUse` (`bash`) | `toolArgs.file_path` (best effort) |

The script exits 2 with the linter output on problems (Claude Code shows it to the agent; other
assistants log it) and 0 otherwise. It ignores unused-import diagnostics on purpose.

## Standards used

- **AGENTS.md** (agents.md): the agent guide.
- **Agent Skills** (agentskills.io): `SKILL.md` with spec fields only, so skills package anywhere.
- **Agent Plugins** (agent-plugins.org): root `plugin.json`; read by Codex, Cursor and Copilot.
  The same file carries the fields Antigravity's `plugin.json` reads; extra fields are ignored.
- **Claude Code plugin**: `.claude-plugin/plugin.json` + `marketplace.json`; also read by Codex and
  Copilot for compatibility.
