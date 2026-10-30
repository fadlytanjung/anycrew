---
name: crew-sync
description: "Regenerates the assistant-native files (.claude, .codex, .agents, .cursor, .opencode, .github) from the canonical anycrew agents, skills, rules and the project's preset and model overrides. Use after editing .anycrew/config.json, after upgrading anycrew, or when an assistant does not see a crew agent or skill."
license: MIT
metadata:
  anycrew-agent: crew-lead
  anycrew-phase: setup
---

# Sync the generated files

```bash
# run with `uvx anycrew …` (Python) or `npx anycrew …` (Node); both are the same tool
anycrew sync            # regenerate for the tools in .anycrew/config.json
anycrew sync --tools claude,cursor
anycrew doctor          # which assistants are installed and which files they will read
anycrew list            # agents with their tier and the model each tool will use
```

Only files that carry the `anycrew:generated` marker are rewritten; hand-written files are
left alone and reported. Commit the generated files so teammates and CI see the same crew.

Without Node: copy `rules/`, `skills/` and `agents/` into `.agents/` and reproduce the
per-tool mapping described in `docs/04-tool-matrix.md` of the anycrew repository.
