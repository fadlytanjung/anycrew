# Product Requirements Document

**Definition.** A PRD (`docs/03-prd.md`) says who the product is for, what they need to do, what
is in and out of scope by priority, and which measurable requirements the product must meet. It
names capabilities, never technologies.

## Structure anycrew uses

| Section | Content |
|---|---|
| Problem and outcome | one paragraph each |
| Users | 2–4 personas: job, trigger, success moment |
| Journeys | numbered steps per persona the product must support |
| Scope | **P0** proves the decision end to end; **P1** usable daily; **P2** sellable; a one-sentence **cut line** |
| Functional requirements | `FR-NNN`, one testable sentence, priority, journey |
| Non-functional requirements | `NFR-NNN`: performance, security, accessibility, cost, observability, with how it is measured |
| Success metrics | 3–5 with targets |
| Constitution check | one line per principle |

## Why IDs

`FR-012` appears in the spec header, the traceability table (`docs/04`), the test name and the
commit. When a reviewer asks "where is FR-012 proven?", the answer is a search, not a meeting.

## Rules of thumb

- A requirement without a user or a metric is an idea; move it to P2 or drop it.
- "Should" is not a requirement; write "must" or delete it.
- P0 must be small enough that the architect can plan it in one sitting.

## Related

[Acceptance Criteria](Acceptance-Criteria.md) · [Spec, Plan and Tasks](Spec-Plan-Tasks.md)
