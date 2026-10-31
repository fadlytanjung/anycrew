Done. `cursor` is now in the tools list and `anycrew sync` (run via `uvx anycrew`, version 0.2.1) regenerated the assistant files. Nothing is committed.

**Written (32 files)**

- `.cursor/` is new, with 26 files: 8 rules as `.mdc` with `alwaysApply: true`, 16 agents with `model: inherit`, and `hooks.json` wiring the lint-after-edit script to Cursor's `afterFileEdit` event.
- Six existing skill files were rewritten: `crew-init`, `crew-patterns` and `crew-status` under both `.claude/skills/` and `.agents/skills/`. See the caveat below.

**Skipped**

- 84 files were unchanged.
- `AGENTS.md` was left untouched because it is the project's own file.
- No skill copies were made under `.cursor/` because Cursor reads `.agents/skills/` natively.

**Caveat worth a look.** The published anycrew 0.2.1 on PyPI ships older skill templates than the ones this repo was initialised with. The regenerated `crew-init`, `crew-patterns` and `crew-status` skills lost every reference to the architecture-style step and to `docs/adr/ADR-001-architecture-style.md`. That ADR exists in this repo and `AGENTS.md` points at it. If you want to keep the richer versions, restore those six files with:

```
git checkout -- .claude/skills/crew-init .claude/skills/crew-patterns .claude/skills/crew-status .agents/skills/crew-init .agents/skills/crew-patterns .agents/skills/crew-status
```

The `.cursor/` output is unaffected by that drift. The pre-existing uncommitted changes in `docs/` and the new `README.md` and `CHANGELOG.md` were not touched.