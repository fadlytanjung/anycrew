# Hooks

**Definition.** A hook is a command the assistant runs at a lifecycle event: a session starts, a
tool is about to run, a file was edited, the agent stops. Hooks are how a team enforces things an
agent might forget, because the harness runs them, not the model.

## anycrew's hook

One script, `.anycrew/hooks/lint-after-edit.sh`, wired into each assistant's hook file. After an
agent edits a file it runs the linter for that language (`ruff` for Python, `eslint` for
TypeScript, `gofmt` and `go vet` for Go) and reports problems back to the agent. It ignores
unused-import diagnostics on purpose, so an import added one edit before its first use is not
stripped.

| Assistant | File | Event |
|---|---|---|
| Claude Code | `.claude/settings.json` | `PostToolUse` on `Write|Edit|MultiEdit` |
| Antigravity | `.agents/hooks.json` | `PostToolUse` on its file-writing tools |
| Cursor | `.cursor/hooks.json` | `afterFileEdit` |
| Copilot | `.github/hooks/anycrew.json` | `postToolUse` |

Codex and OpenCode have their own hook mechanisms; they are on the roadmap.

## Writing your own

Hooks read a JSON payload on stdin and signal with the exit code. Keep them fast (under a second
for edit hooks), deterministic and silent on success. Good candidates: a secrets scan before a
commit, a schema-drift check after editing a model, blocking a destructive command. Turn anycrew's
hook off with `"hooks": { "lint_after_edit": false }` in `.anycrew/config.json`.

## Related

[Agents, Skills and Rules](Agents-Skills-Rules.md) · [Standards](Standards.md)
