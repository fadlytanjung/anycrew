---
name: crew-refactor
description: "Reviews code quality against a catalogue of code smells (bloaters, OO abusers, change preventers, dispensables, couplers, plus backend and LLM-specific smells) and applies the matching refactorings one at a time with tests green before and after. Use when code is hard to change, before adding a feature to a messy area, or when asked 'how do we clean this up?'."
license: MIT
metadata:
  anycrew-agent: reviewer
  anycrew-phase: build
---

# Find smells, refactor safely

Delegate to the **reviewer** (strong tier) for the audit and to the **implementer** (balanced
tier) for the refactorings. The catalogue is `references/code-smells.md` in this skill.

## Procedure

1. **Scope**: a file, a module, a spec's code or the whole repository.
2. **Audit**: for each smell in the catalogue, search for the signs; report findings as
   `path:line`, smell, why it costs (what change it makes expensive), the refactoring, and an
   effort estimate (S/M/L). Rank by how often that code changes (see `git log --stat`), not by
   count.
3. **Plan**: the top five refactorings as tasks, each small enough for one commit, each with the
   tests that protect it. Where there are no tests, the first task is a characterisation test.
4. **Refactor** one at a time: tests green, one refactoring, check command green, commit
   `refactor(NNN): <what>`, never mixed with a behaviour change.
5. **Record** a new convention in `docs/13-conventions.md` when the refactor establishes one, and
   consider a lint rule so the smell cannot return.

Done when the planned refactorings are committed with the check command green after each, and
the report lists what was deliberately left.
