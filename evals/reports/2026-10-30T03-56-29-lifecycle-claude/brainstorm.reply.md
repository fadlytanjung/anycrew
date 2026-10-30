The brainstorm is written to `docs/01-brainstorm-and-decision.md` and the status doc has a Decision row. I wrote it directly rather than spawning the strong-tier brainstormer agent, to stay inside the session budget; it follows the brainstormer's procedure and the template section by section.

**Decision (draft, awaiting your approval)**

Teamly is a shared to-do workspace for teams of about five people, built around one rule: every task has exactly one owner or is visibly unassigned. A member signs in, creates a workspace, invites teammates with a link, makes lists, adds tasks, assigns each one, and marks it complete. Every member has a "My tasks" view and the workspace shows who holds what and what nobody holds. It wins because the whole story fits a 3-minute demo with two browsers and no external service, leaves room to do isolation, tests and a real deploy well, and gives a 5-person team a view it would use daily. It is not Kanban, not real-time, not chat-integrated, not model-assisted.

**Scoring** (weights assumed: demo 4, quality 3, usefulness 3; max 50)

| Option | Demo ×4 | Quality ×3 | Useful ×3 | Total | Days to demoable |
|---|---|---|---|---|---|
| A Plain shared lists | 16 | 12 | 9 | 37 | 10 |
| **B Owned tasks** | 20 | 12 | 15 | **47** | 14 |
| C Async stand-up | 12 | 9 | 12 | 33 | 20 |
| D Live lists (WebSockets) | 20 | 9 | 9 | 38 | 22 |
| E Chat-first capture | 8 | 9 | 12 | 29 | 24 |
| F Tiny Kanban | 16 | 9 | 9 | 34 | 18 |
| G Model-assisted breakdown | 16 | 6 | 9 | 31 | 22 |
| H Recurring checklists | 12 | 12 | 6 | 30 | 16 |

**Key assumptions marked [assumed] in the doc**

- Criterion weights 4 / 3 / 3 with a tilt to the demo.
- Demo date 2026-11-27, four weeks from today.
- Invites are links shown in the app; no email provider in the first version.
- Email and password sign-in only, server-side sessions, no OAuth.
- The name Teamly probably collides with an existing product; kept as the codename, researcher to check.

**What is left for you**

- Approve or amend the decision. This is the gate before the PRD; the status row stays at Specified until you say yes.
- Answer the open questions in section 9 when convenient, above all the cloud provider and whether an in-app invite link is acceptable for the demo.

Nothing is committed yet. Next skill after approval is `/crew-prd`, with `/crew-research` on the assumed facts in section 10 if you want them checked first.