The PRD and traceability table are written. Nothing is committed, since you did not ask for a commit.

**Files written or changed** (all uncommitted in the working tree):
- `docs/03-prd.md` is new. Status is "Draft for review". It has three personas, three journeys, P0/P1/P2 scope with a cut order, 40 FRs, 16 NFRs, a role table, input limits, four success metrics, a constitution check and six open questions. Every unverified fact carries an [assumed] mark, since docs/02 does not exist yet.
- `docs/04-requirements-traceability.md` is rewritten with one row per requirement. The old "pending PRD" row is now NFR-001 with its spec and test cells unchanged.
- `docs/specs/001-foundation/spec.md` has its Requirements row keyed to NFR-001, with a change-log entry.
- `docs/20-implementation-status.md` replaces the "No PRD" gap with the draft's status. This file already had your earlier uncommitted checkpoint edit.

**P0 scope** is the 3-minute journey J1 plus what docs/01 commits to for weeks 1 to 3. Functional requirements: sign up, sign in, sign out, create and open a workspace, two roles, invite link create and accept, member list, list create, rename and delete, task create, edit and delete, assign, reassign and unassign with at most one assignee, assignee shown everywhere, complete with who and when, reopen, the "My tasks" view, the "Unassigned" view, and per-member counts. Non-functional: gates and CI, one-cloud deploy, tenant isolation tested per role cell, hashed passwords and server sessions, boundary validation, clean logs, an append-only audit record, a p95 target, accessibility, two layout widths, an idempotent synthetic seed, and cost within free tiers.

**Cut line:** if we only ship P0, the demo shows two people in two browsers going from sign-in to a new workspace, an accepted invite link, a list with three tasks that each have one assignee or none, a task completed with who and when, Ben's "My tasks", and Ana's view of who holds what and what nobody holds, in under three minutes with no external service. Per-member counts are cut first, then the "Unassigned" view becomes a filter.

**Decisions made as assumptions that you should confirm at review:**
- The task holder is called the "assignee", because docs/01 uses "owner" for both the task holder and the workspace role.
- Only the workspace owner deletes lists in P0. Invite revoke, member removal and workspace deletion are owner-only but P1.
- The audit record is P0 even though the activity log that reads it is P1, because constitution P5 and the architecture rule require it.
- The PRD recommends deleting constitution P2 and proposes text for the empty P6. It does not edit docs/00.

**Conflicts found outside the PRD:** docs/14 calls the elevated role "workspace admin" and does not match the PRD's role table. The security reviewer should align it before spec 002. Also, if the demo runs against production, seeding synthetic data there clashes with the data rule in the constitution. Both are listed in the PRD's open questions.

**Next step:** review and approve the P0 scope, then run the architecture skill for docs/05, 09 and 10 and the cloud ADR. Commit the four changed docs together when you are ready.