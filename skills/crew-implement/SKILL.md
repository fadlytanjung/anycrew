---
name: crew-implement
description: "Implements the next unchecked task of a spec (or a named task like T007-03) test-first: failing test, smallest change, the project's check command green, task ticked, commit with the task ID. Use for 'implement', 'continue', 'build the next task' or a task ID."
license: MIT
metadata:
  anycrew-agent: implementer
  anycrew-phase: build
---

# Implement one task

Delegate to the **implementer** (balanced tier) with the spec number or task ID. It follows its
own procedure: load context → pick task → preconditions → failing test → smallest change →
check command → tick → docs → commit.

Escalate instead of pushing through:

- A failing test with a non-obvious cause → **debugger** (`crew-debug`).
- The task touches auth, tenancy, money or model input → **security-reviewer** sees the diff
  before merge (`crew-security`).
- The spec is wrong → **spec-writer** fixes the doc first; no untracked code.

Done when the task is ticked, the commit exists with `Tasks:` and `AC:` trailers, and the check
command output is green in the report.
