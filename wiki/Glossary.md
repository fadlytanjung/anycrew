# Glossary

One line per term. Each links to its page when there is one.

| Term | Meaning |
|---|---|
| **AC** (acceptance criterion) | A testable statement, written Given/When/Then, that defines when a user story is done. ID `AC-NNN-n`. [More](Acceptance-Criteria.md) |
| **ADR** (architecture decision record) | A short document recording one decision that is expensive to reverse: context, options, decision, consequences. ID `ADR-NNN`. [More](Architecture-Decision-Record.md) |
| **Agent** (subagent) | A specialist with its own system prompt, tools and model, that the assistant delegates a task to. anycrew ships sixteen. [More](Agents-Skills-Rules.md) |
| **Agent Plugins** | An open packaging spec (`plugin.json` + `skills/` + `mcp.json`) read by Codex, Cursor and Copilot. [More](Standards.md) |
| **Agent Skills** | The open `SKILL.md` format for skills, read by nearly every assistant. [More](Standards.md) |
| **AGENTS.md** | The plain-Markdown agent guide at a repository root, read by every assistant. [More](Standards.md) |
| **Assistant** (harness, tool) | The coding agent product you type into: Claude Code, Codex, Antigravity, Cursor, OpenCode, Copilot. |
| **Balanced** | The middle model tier: implement, test, research, routine review. [More](Model-Tiers.md) |
| **Check command** | The one command that runs every merge gate: lint, types, layer rules, tests. Comes from the preset, e.g. `make check`. |
| **Constitution** | The short list of principles every change is checked against; changing one needs an ADR. [More](Constitution.md) |
| **Crew** | anycrew's set of agents working under one method. The **crew lead** routes work between them. |
| **Cut line** | The sentence in the PRD that says what the demo shows if only P0 ships. |
| **Fast** | The cheapest model tier: read, search, summarise, status updates. [More](Model-Tiers.md) |
| **FR / NFR** | Functional / non-functional requirement, `FR-NNN` / `NFR-NNN`, defined in the PRD. [More](Product-Requirements-Document.md) |
| **Gate** | A point where a person decides before the next phase starts: the decision, P0 scope, ADRs, spec Ready, production deploy. [More](Gates-and-Human-in-the-Loop.md) |
| **Generated file** | A file anycrew writes into a project, marked `anycrew:generated`, safe to regenerate with `sync`. |
| **Hook** | A command the assistant runs at a lifecycle event (after a file edit, before a shell command). anycrew ships a lint-after-edit hook. [More](Hooks.md) |
| **Implementation status** | `docs/20`, the only document that says what is actually built, with the test suite that proves it. [More](Implementation-Status.md) |
| **MCP** (Model Context Protocol) | The protocol assistants use to connect to external tools and data; configured per assistant. [More](Standards.md) |
| **P0 / P1 / P2** | Priority bands: proves the decision end to end / usable daily / sellable. |
| **Phase** | One step of the lifecycle: setup, discover, define, design, specify, build, verify, ship, record. [More](Lifecycle-and-Phases.md) |
| **Plan** (`plan.md`) | How a spec will be built: slices, files, contract changes, constitution check. [More](Spec-Plan-Tasks.md) |
| **Preset** | A JSON description of a stack: commands, layout, globs, conventions. [More](Presets.md) |
| **PRD** (product requirements document) | Users, journeys, scope by priority, requirements with IDs, metrics. [More](Product-Requirements-Document.md) |
| **Rule** | Always-on or path-scoped guidance the assistant loads as context. [More](Agents-Skills-Rules.md) |
| **SDD** (spec-driven development) | Writing the spec first and implementing from it; code and spec change together. [More](Spec-Driven-Development.md) |
| **Skill** | A reusable procedure the assistant loads on demand, usually invoked as `/name`. anycrew's are `/crew-*`. [More](Agents-Skills-Rules.md) |
| **Slice** | The thinnest vertical path through a plan that proves the design end to end. |
| **Spec** (`spec.md`) | What and why: user stories and acceptance criteria for one feature, `docs/specs/NNN-name/`. [More](Spec-Plan-Tasks.md) |
| **Strong** | The strongest model tier: decisions and judgement. [More](Model-Tiers.md) |
| **Task** (`TNNN-nn`) | One unit of implementer work, naming its files and ACs; one task, one commit. [More](Spec-Plan-Tasks.md) |
| **TDD** | Test-driven development: write the failing test, see it fail for the right reason, make the smallest change that passes. |
| **Tier** | The portable label (`fast`, `balanced`, `strong`) an agent declares for how much model it needs. [More](Model-Tiers.md) |
| **Traceability** | `docs/04`: requirement → spec → test → evidence, one row per requirement. |
| **Trigger** | How a rule loads: `always_on`, `glob` (by path), `model_decision` (when relevant), `manual`. |
| **Universal layer** | `AGENTS.md` and `.agents/{rules,skills,agents}`: the files most assistants read without conversion. |
| **User story** (`US-NNN-n`) | A need stated from the user's side, which the ACs make testable. |
| **Verify** | Auditing an implementation against its spec: conformant, untested, drift, missing, undocumented. |
