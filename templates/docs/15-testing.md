# 15 — Testing

> Tests prove the code does what the spec says. Evals measure how well models do their part. Tests
> gate merges; evals inform decisions.

## 1. Layers
| Layer | What | Runs | Gate? | Location |
|---|---|---|---|---|
| Unit | | every `{{check_cmd}}` | ✔ | |
| Integration | | every `{{check_cmd}}` | ✔ | |
| Scenario / E2E | | | | |
| Contract | | | ✔ | |
| Visual / a11y | | | | |
| Evals | real models, on demand | | ✘ | |
Coverage floors: domain ≥ 90 %, services ≥ 80 % (floors, not goals).
## 2. Gates per change
## 3. Ground truth and fixtures
## 4. Evals
