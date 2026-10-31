---
name: crew-status
description: "Reports where the project is: which docs exist, the current spec and its next unchecked task, what the implementation status says, open findings, and the recommended next crew skill. Use at the start of a session or when asked 'where are we' or 'what's next'."
license: MIT
metadata:
  anycrew-agent: scout
  anycrew-phase: all
---
<!-- anycrew:generated from anycrew/skills/crew-status — edit the source and run `npm run build:claude` -->

# Where are we

Delegate to the **scout** (fast tier). Read only; change nothing.

1. Check for `AGENTS.md`, `docs/00-constitution.md`, `docs/20-implementation-status.md`,
   `docs/specs/README.md`, `.anycrew/config.json`. Missing → recommend `crew-init`.
2. Phase detection: no `docs/01` → Discover; no `docs/03` → Define; no `docs/05` → Design;
   no spec folders → Specify; unchecked tasks → Build; all ticked, no review report → Verify.
3. Current spec: the lowest-numbered spec with unchecked tasks whose dependencies are done;
   its next task ID and the ACs it serves.
4. Recent activity: last five commits by spec prefix; uncommitted changes.
5. Open items: Critical or High findings in the latest review or security report, if any.

Report:

```
Project: <name> — phase: <phase>
Current spec: NNN <title> — next task: TNNN-nn (AC-NNN-n)
Status doc: last updated <date>; <n> Built, <n> In progress, <n> Specified
Open findings: <n critical, n high> (or none)
Next: /crew-<skill> because <reason>
```
