`docs/06-agent-design.md` exists, along with the prompt files, schemas and eval plan. The design is complete and ready for the product-manager and architect to act on.

**What was written**

- `docs/06-agent-design.md`: a 15-step model/code boundary table, two call specifications with schema, tier, temperature, timeout, retry, fallback and post-checks, a cost table priced from the Claude pricing page dated today, the eval plan with eight dataset slices and eleven scorers, tracing rules, the backend module layout, and the proposed PRD rows FR-205 and NFR-205.
- `backend/app/prompts/triage-extract-date.md` and `triage-propose-assignee.md`: versioned prompts with front matter, untrusted-content tags, and no model ID. Their strict JSON schemas sit in `backend/app/prompts/schemas/` and parse cleanly.
- `docs/evals/triage/REPORT.md` and `backend/evals/triage/README.md`: the report template and dataset format. No eval has been run, and the report says so plainly.
- `docs/20-implementation-status.md`: a gap entry recording that triage is designed but not yet a component.

**Design decisions worth knowing**

- The model only classifies and maps. Code parses explicit dates with an injected clock, resolves intents to dates from configured offsets, ranks history, and verifies every member ID and cited task ID before anything is shown.
- Both calls target the fast tier at temperature 0. The eval compares a code-only baseline, Haiku 5.5 and Sonnet 5.5 per call, and the cheapest one that passes ships. If the baseline passes for the assignee call, that call is dropped.
- A proposal never writes anything. The member accepts or edits on the existing task form, and the acceptance is audited with the proposal ID.

**Conflicts I flagged rather than resolved**

- The PRD states there is no model-backed feature in any phase. Section 9 of the design proposes FR-205 and NFR-205 for the product-manager to accept before any spec is written.
- Due dates arrive with FR-106 in P1, so triage is P2 at the earliest and must wait for the P1 path to run end to end.
- The model provider is a new paid API and needs an ADR before the adapter enters the code.

**Deviations from the skill**

- The skill says to delegate to the ai-engineer agent. I did the work directly to stay inside the session budget. The content follows that agent's procedure.
- The `templates/docs/06-agent-design.md` template named by the skill is not present in this checkout, so the structure follows the skill's checklist instead.
- Token counts in the cost table are estimates from the prompt drafts and are marked as such. Recorded usage replaces them on the first eval run.

Nothing was committed. Next steps are a PRD update for FR-205, ADR-003 for the provider, and then `/crew-spec` for the triage module.