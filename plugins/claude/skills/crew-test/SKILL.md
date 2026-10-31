---
name: crew-test
description: "Designs or extends tests for a spec or acceptance criterion: maps ACs to tests, writes failing tests at the right layer, builds fixtures and synthetic data, adds boundary and property tests, sets coverage floors, and evals for model-backed features. Use when coverage, flakiness or an untested AC is the problem."
license: MIT
metadata:
  anycrew-agent: tester
  anycrew-phase: build
---
<!-- anycrew:generated from anycrew/skills/crew-test — edit the source and run `npm run build:claude` -->

# Tests for a spec

Delegate to the **tester** (balanced tier). Template: `templates/docs/15-testing.md` on first
use.

1. Input: a spec number, an AC, or a failing or flaky test.
2. Output: the AC → test map, new tests named after behaviour and AC, fixtures from generated
   ground truth, and `docs/15` updated when a layer or gate changes.
3. Evals for model-backed behaviour run on demand and are reported in docs, never gated.

Done when every AC in scope has a named test, the check command is green, and no test was
loosened.
