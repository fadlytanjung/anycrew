---
name: crew-debug
description: "Structured debugging: capture the error and the spec statement it violates, reproduce deterministically, isolate by layer, explain the root cause, fix with a regression test, record the lesson. Use for errors, failing tests and environment-specific behaviour whose cause is not obvious."
license: MIT
metadata:
  anycrew-agent: debugger
  anycrew-phase: build
---
<!-- anycrew:generated from anycrew/skills/crew-debug — edit the source and run `npm run build:claude` -->

# Debug to the root cause

Delegate to the **debugger** (strong tier) with the error text, the command, the environment
and the expected behaviour.

1. No fix before a reproduction and a one-paragraph root cause.
2. The fix is the smallest change at the cause, with the regression test and the check
   command green.
3. If the cause was a missing rule or a wrong doc, update it in the same change.
4. Auth, tenancy or money involved → `crew-security` before merge.

Done when the regression test passes, the suite is green, and the report lists what was ruled
out.
