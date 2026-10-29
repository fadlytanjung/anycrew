---
name: crew-verify
description: "Audits a spec's implementation against its normative statements and reports drift in five buckets (conformant, untested, drift, missing, undocumented) with evidence; runs the real test suite. Use after a spec's tasks are ticked, before marking it Built, or when docs and code may have diverged."
license: MIT
metadata:
  anycrew-agent: reviewer
  anycrew-phase: verify
---

# Verify a spec against the code

Delegate to the **reviewer** (strong tier) with the spec folder.

1. For each normative statement (must, shall, pinned value, signature, AC), find the code and
   the test. Search; do not assume file names.
2. Run the gates; show real output.
3. Report the conformance table and, for each non-conformant row, `path:line`, the quoted spec
   line and the concrete failure.
4. Drift is resolved by a person: propose which side changes and why, then stop.
5. Only after every row is Conformant may `docs/20` mark the component **Built**, naming the
   suite.

Done when the table exists and the person has decided every Drift row.
