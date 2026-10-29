---
name: crew-review
description: "Reviews a diff, branch or PR against the spec, constitution and conventions; runs the gates; reports verified findings ranked by severity with file:line and a failure scenario. Use before merge or when asked 'is this right?'."
license: MIT
metadata:
  anycrew-agent: reviewer
  anycrew-phase: verify
---

# Review a change

Delegate to the **reviewer** (strong tier) with the diff range or PR and the spec it implements.

1. The reviewer runs the check command and the spec's tests and captures real output.
2. Findings in order: correctness, security, data, tests, conventions, docs. Each with
   `path:line`, the scenario, the AC or principle, and a one-line fix.
3. Critical or High findings block merge; the implementer fixes them task by task.
4. Style belongs to the linter; the reviewer does not nitpick formatting.

Done when the report exists and every Critical and High finding is fixed or explicitly
accepted by a person with a reason.
