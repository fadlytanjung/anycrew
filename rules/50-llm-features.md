---
trigger: model_decision
description: Rules for code that calls a language model or orchestrates agents: prompts, schemas, grounding, cost and tracing. Read when touching prompts, agent nodes, tool definitions or evals.
---

# Model-backed features

- Prompts live in files (`prompts/<id>.md` or the project's equivalent) with front matter `id`,
  `version`, `model`, `output_schema`. No prompt text over 200 characters inside code. Bump the
  version on any change and re-run the evals and recordings that depend on it.
- Every call has a strict output schema validated before use, a model setting from configuration,
  a timeout, a retry policy and a fallback. Temperature 0 for classification, extraction and
  mapping; low for prose.
- Choose the tier by the job: fast models for classification and extraction, strong models for
  reasoning and prose. Record the comparison that justified the choice.
- Content a prompt sees is framed as untrusted data and passed as a separate part. Tools exposed
  to a model are read-only and scoped unless an ADR says otherwise, and return values with IDs.
- Every number or claim a model writes for a user carries a citation the code can verify; the
  code decides whether the citation holds. A model never grades its own output.
- A model's result about a user's own data is a proposal until a person accepts it; nothing a
  model detects overwrites a value a person confirmed.
- Agent nodes: one job each, a result schema, an idempotency key checked before work, a small
  return value; large data stays in storage. Orchestration is code, not conversation.
- One trace per run with a span per call; token and cost accounting per call; prompt and
  response content captured only with synthetic data and an explicit flag.
- Evals run on demand with a dataset and scorers and are reported in docs; they are never part of
  the merge gate.
