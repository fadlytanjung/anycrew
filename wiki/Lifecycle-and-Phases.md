# Lifecycle and Phases

**Definition.** The lifecycle is the ordered set of phases a product moves through from idea to a
running, documented release. Each phase has an owner agent, an artefact it produces, and a gate a
person passes before the next phase starts.

| Phase | Question it answers | Skill | Artefact | Gate |
|---|---|---|---|---|
| Setup | Is the repo ready for the crew? | `/crew-init` | `AGENTS.md`, `docs/00`, `docs/20`, rules, hooks | check command runs |
| Discover | What are we building and why? | `/crew-brainstorm`, `/crew-research` | `docs/01`, `docs/02` | decision approved |
| Define | For whom, what, in what order? | `/crew-prd` | `docs/03`, `docs/04` | P0 fits the deadline |
| Design | How, and what did we decide? | `/crew-architecture`, `/crew-adr`, `/crew-design`, `/crew-llm` | `docs/05`, `09`, `10`, `11`, `12`, `06`, ADRs | constitution check, ADRs accepted |
| Specify | What exactly does this feature do? | `/crew-spec`, `/crew-plan`, `/crew-tasks` | `docs/specs/NNN-*/` | spec Ready, tasks small |
| Build | Does the code do it? | `/crew-implement`, `/crew-test`, `/crew-debug` | code, tests, ticked tasks | check green, one commit per task |
| Verify | Is it right and safe? | `/crew-review`, `/crew-security`, `/crew-verify` | findings, conformance table | no Critical open |
| Ship | Can we release and undo it? | `/crew-deploy-check` | checklist, runbook | person approves production |
| Record | Is the record true? | `/crew-checkpoint`, `/crew-docs` | `docs/20`, README, changelog | status matches the tree |

`/crew-status` tells you the current phase and the next task at any time.

## Phases are not waterfall

Build, Verify and Record repeat per feature. Design is revisited whenever a change crosses a
boundary (a new service, a schema change), which produces a new ADR. Discover is revisited on a
pivot. The order protects one thing: no code before a spec, no spec before a decision.

## Related

[Spec-Driven Development](Spec-Driven-Development.md) · [Gates](Gates-and-Human-in-the-Loop.md)
