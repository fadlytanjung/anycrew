Both documents are written. The PRD status is Draft because the skill's gate requires a person to approve the P0 scope, and this run was told not to ask.

**Files written**
- `docs/03-prd.md`: personas, three journeys, P0/P1/P2 scope with a cut line, 24 functional and 13 non-functional requirements, metrics, constitution check, and the open questions table.
- `docs/04-requirements-traceability.md`: one row per requirement with spec, test and evidence columns left for the spec-writer and tester.

**P0 scope for your approval**
- Sign up, sign in, sign out with email and password.
- One workspace per user, created automatically on first sign-in.
- Lists: create and view.
- Tasks: create, view, set or clear assignee, mark done or not done.
- Cross-workspace data returns not-found.

Cut line: if only P0 ships, the demo shows one person signing in, landing in their own workspace, creating a list, adding a task, assigning it to themselves and marking it done, while a second person cannot see any of it.

**Assumptions to confirm or overturn** (marked A0 to A7 in the PRD)
- No deadline was given, so P0 is held to the smallest end-to-end path.
- "One workspace per user" means one owned workspace each, not one member each. In P0 the only assignee is the owner, since invites are P1.
- Email and password is the P0 sign-in method; identity providers are P2.
- Length limits and the 300 ms read target are starting values.
- The audit trail waits for P1 because P0 has no irreversible action.
- Constitution P6 is still blank; the PRD assumes synthetic data only and a managed Postgres chosen by ADR.

**Deviations from the skill text**
- I wrote the docs directly instead of delegating to the product-manager agent, since every input was already read and the brief would have been the whole deliverable.
- No `docs/01` decision document exists. The PRD takes the product line in `AGENTS.md` as the decision and says so in its header.

Next step is `/crew-architecture` once the P0 list above is approved. Nothing was committed.