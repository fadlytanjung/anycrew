---
name: crew-llm
description: "Designs or reviews a model-backed feature or a multi-agent system (docs/06): the model/code boundary, each call's schema, tier, cost and fallback, prompts as versioned files, untrusted-content framing, grounding and citations, evals and tracing. Use when a feature calls an LLM, when building agents as the product, or when output quality or cost is in question."
license: MIT
metadata:
  anycrew-agent: ai-engineer
  anycrew-phase: design
---

# Model-backed features and agent systems

Delegate to the **ai-engineer** (strong tier). Template: `templates/docs/06-agent-design.md`.
Rule: `rules/50-llm-features.md`.

1. Boundary table: which steps are judgement (model) and which are correctness (code).
2. Per call: purpose, inputs with untrusted parts marked, strict output schema, tier
   (fast for classify/extract, strong for reasoning/prose), temperature, timeout, fallback,
   cost per call and per user action.
3. Prompts in `prompts/<id>.md` with `id`, `version`, `model`, `output_schema`; no prompt
   strings in code.
4. Evals: dataset, scorers, report in docs; the cheapest model that passes wins.
5. Tracing: one trace per run, a span per call, token and cost accounting; content capture off
   unless the data is synthetic.
6. For agent systems: one job per agent, a result schema, idempotency keys, small return
   values, orchestration in code.

Done when `docs/06` has the boundary table and a row per call, and the eval report exists for
each call that affects users.
