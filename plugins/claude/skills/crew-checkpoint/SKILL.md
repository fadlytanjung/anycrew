---
name: crew-checkpoint
description: "Updates docs/20-implementation-status.md so it matches the tree: moves component rows between Specified, In progress, Built (with the test suite named), Deployed and Cut; refreshes the last-updated line. Use as part of any change that adds, completes or removes a component, and before a demo or release."
license: MIT
metadata:
  anycrew-agent: doc-writer
  anycrew-phase: record
---
<!-- anycrew:generated from anycrew/skills/crew-checkpoint — edit the source and run `npm run build:claude` -->

# Checkpoint the implementation status

Delegate to the **doc-writer** (fast tier). The status doc is the only document that says what
is actually built; keep it true.

1. Read `docs/20-implementation-status.md` and the specs' `tasks.md`.
2. Move the rows the change affected. **Built** requires a named test suite; code without a
   test that would fail if it broke is **Partial**.
3. Record deliberate deviations in the row's notes and gaps in the Gaps section.
4. Refresh the "last updated" line with the date and the one-line reason.
5. If the project has a status checker script, run it and fix the rows, not the checker.

Done when every row's status matches the code and tests, and the date is today.
