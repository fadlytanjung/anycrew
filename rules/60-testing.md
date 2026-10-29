---
trigger: model_decision
description: Testing rules. Read when writing or changing tests, fixtures, recordings or evals.
---

# Testing

- The check command runs lint, types, layer rules, repo checks and every gated test layer; it
  never calls a real external service.
- A test proves one behaviour and is named after it and its AC (`test_ac007_3_…`).
- Fakes for every port; recorded outputs for model and OCR calls replayed from fixtures; a missing
  recording fails loudly.
- Expected values come from generated ground truth, never hand-typed numbers.
- Every limit is tested at, below and above the boundary with an injected clock.
- Invariants get property tests: idempotency, order independence, round-trips, arithmetic.
- Flaky tests are bugs: remove the shared state, the real clock or the network; never add retries.
- Never loosen, skip or delete a test to get green; report the conflict with the spec.
- Visual baselines change only in a reviewed change with screenshots at the agreed widths.
- Coverage floors per layer are written in `docs/15-testing.md` and enforced by the check command.
