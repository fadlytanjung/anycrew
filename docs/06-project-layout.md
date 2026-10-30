# 06 — Project layout

What a project looks like after `anycrew init`, and how the documents relate.

## Files anycrew creates once and never overwrites

| File | Purpose |
|---|---|
| `AGENTS.md` | the agent guide: where the truth lives, how to work, commands, non-negotiables, definition of done |
| `docs/README.md` | index and reading order |
| `docs/00-constitution.md` | principles every change is checked against; generic P1–P8, add your own |
| `docs/20-implementation-status.md` | what is actually built; updated in the same commit as the change |
| `docs/glossary.md` | terms and ID schemes |
| `docs/adr/README.md`, `docs/adr/ADR-template.md` | decisions |
| `docs/specs/README.md`, `docs/specs/NNN-template/` | the spec loop |

With `--all-docs`, every numbered template is created too (01–19). Otherwise each phase's agent
creates its document from `templates/docs/` when the phase runs.

## The numbered documents

| # | Document | Written by | Read by |
|---|---|---|---|
| 00 | Constitution | you (+ crew-init) | everyone |
| 01 | Brainstorm & decision | brainstormer | product-manager |
| 02 | Research | researcher | everyone who cites a fact |
| 03 | PRD | product-manager | architect, spec-writer |
| 04 | Requirements traceability | product-manager, spec-writer, tester | reviewer |
| 05 | Architecture | architect | spec-writer, implementer, release-engineer |
| 06 | Agent design | ai-engineer | implementer, tester |
| 09 | Data model | architect | implementer |
| 10 | API contract (+ `contracts/`) | architect | implementer, designer |
| 11 | Frontend | designer | implementer |
| 12 | Design system | designer | implementer, tester |
| 13 | Conventions | architect (from preset) | implementer, reviewer |
| 14 | Security | security-reviewer | everyone touching auth, data, input |
| 15 | Testing | tester | implementer |
| 16 | Infrastructure & deployment | release-engineer | everyone deploying |
| 17 | Observability | release-engineer | debugger |
| 19 | Delivery plan | you | crew-lead |
| 20 | Implementation status | doc-writer | everyone, first |

Numbers 07, 08 and 18 are free for domain documents (a product often needs one or two: a risk
engine, a document pipeline, a pricing model).

## A spec folder

```
docs/specs/007-review-queue/
├── spec.md    status, priority, depends on, requirements, summary, user stories, AC-007-n, out of scope, edge cases
├── plan.md    slices, files per step, contract and data changes, dependencies, constitution check, risks
└── tasks.md   - [ ] T007-01 TDD … (AC-007-1) … - [ ] T007-99 update docs/20
```

## Generated files (safe to regenerate)

Everything under `.agents/`, `.claude/`, `.codex/`, `.cursor/`, `.opencode/`, `.github/agents`,
`.github/instructions`, `.github/hooks`, `CLAUDE.md` and `.anycrew/hooks/` carries the
`anycrew:generated` marker. `anycrew sync` rewrites only those. Remove the marker from a file
to take it over; `sync` will report it as skipped.

Commit the generated files: teammates and CI should see the same crew without running anycrew.
