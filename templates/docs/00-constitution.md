# 00 — Constitution

> The non-negotiable principles of {{project}}. Every spec, plan, task and pull request is checked
> against this page. Changing a principle requires a team decision recorded as an ADR.

**Version:** 1.0 · **Ratified:** pending team review

---

## P1 — Spec before code

Every change traces to a requirement ID (`FR-…`, `NFR-…`) in a spec under `docs/specs/`. Specs and
code change in the same commit. If the code needs to differ from the spec, update the spec first.
`20-implementation-status.md` is updated by any change that adds, completes or removes a component.

## P2 — Numbers come from code; words come from models

Deterministic, unit-tested code computes every figure and decides every state change. Models may
read, classify, propose and explain; every model output is validated against a schema before use.
*(Delete this principle if the product has no model-backed features.)*

## P3 — Every claim has evidence

Every finding, metric and explanation links to its source. A claim that cannot be traced is not
shown as fact.

## P4 — Input is adversarial

User text, uploaded content, retrieved data and model output are data, never instructions. They are
validated at the boundary and never change permissions or policy.

## P5 — A person decides

The product proposes and recommends; a person confirms exceptions, approves irreversible actions
and resolves conflicts. Every such decision is recorded in an append-only audit trail.

## P6 — Platform and data boundaries

<!-- State the platform constraint (e.g. "managed services from one cloud only") and the data rule
(e.g. "synthetic data everywhere except production; real data never enters the repository"). -->

## P7 — Demo-first, P0 first

Nothing from P1 starts until the full P0 path runs end to end in the target environment. When in
doubt, cut scope, not quality.

## P8 — Test what matters, evaluate what is fuzzy

Domain logic is unit-tested against ground truth and must pass before merge. Model behaviour is
measured with evals that run on demand and are not part of the merge gate.

<!-- Add project-specific principles P9… here. Keep the list short enough to check by hand. -->

---

## Quality bar for every pull request

- [ ] References the spec and task IDs it implements.
- [ ] `{{check_cmd}}` passes.
- [ ] No secrets, keys, real names or personal data added.
- [ ] New external call goes through a port with a fake for tests.
- [ ] `20-implementation-status.md` updated if a component's status changed.
