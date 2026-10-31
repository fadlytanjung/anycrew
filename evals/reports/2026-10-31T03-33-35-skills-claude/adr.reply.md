Done. The decision is recorded as ADR-002 and wired into the index and the docs that depend on it.

**What was written**

- `docs/adr/ADR-002-workspace-isolation-rls.md` records the decision as "both, in order": application-level scoping stays the primary control, and Postgres row-level security is added as a restrictive second barrier. It considers four options: application filtering only, RLS only, both, and schema-per-workspace. It rejects RLS-only because the constitution and security rule put the first line of defence in code that tests with fakes, and because the facts that would make RLS trustworthy alone are still unverified.
- The decision section specifies the mechanics: a restrictive policy per tenant table keyed on a `SET LOCAL` setting that fails closed when absent, a second policy on memberships so the principal can be resolved, a separate runtime role with no owner, superuser or bypass rights, and a repo check that every table with a workspace column has RLS enabled and forced.
- Consequences name the costs honestly: a policy, migration and test per table, harder debugging because a missing setting shows as "no rows", a Postgres container in the check command, and the unverified pooler behaviour.

**Status is Proposed, not Accepted.** The skill requires a person to accept, and the ADR itself depends on two open spikes already listed in the research doc: the `SET LOCAL` policy pattern through a transaction pooler, and whether the hosting provider allows a non-bypassing runtime role. The ADR names those as the open question and says what happens if they fail: ship application scoping alone for P0 and retry RLS before the first P1 spec that adds joins or filters. Three assumptions are marked A-1 to A-3 for the spikes to confirm.

**Cross-references added**

- `docs/adr/README.md` gains the ADR-002 row with its Proposed status.
- The conventions doc's "Repository, scoped by principal" pattern row now points to ADR-002.
- The research doc's design-stance row and ADR-001's isolation force now cite ADR-002.

Nothing was committed. The working tree already had uncommitted changes from earlier work, so I left committing to you.