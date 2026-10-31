The glossary matches the PRD. The work is done; nothing was committed, per the brief.

**Four files are now in line with the repository at commit `11f030d`.** All relative links in them resolve, verified by a script over every link target.

- **`README.md`** (new). Two-sentence purpose, one Mermaid flowchart of the current request path, the five backend commands that actually work today, and a clear note that the `make` targets do not exist yet. The only number is the test count, cited with date and commit.
- **`docs/README.md`**. Reading orders now chain only documents that exist. Docs 01, 05, 09, 10, 14, 15 and 19 keep their rows but are plain text marked "not yet written", with 15 pointing at task T001-18. Rows added for 16, 17, the triage eval report, the root README and the changelog.
- **`docs/glossary.md`**. Grew from four rows to three tables (process, product, architecture), each term with the doc that defines it. Product terms were checked against the PRD wording.
- **`CHANGELOG.md`** (new). One Unreleased section covering all twelve commits, grouped Added and Changed, dated 2026-10-31, each line naming its commit.

Evidence used:

| Measure | Value | Source |
|---|---|---|
| Backend tests | 13 passed | `uv run pytest -q`, 2026-10-31, commit `11f030d` |

**Two things to be aware of.** The index links to `docs/16-infrastructure.md` and `docs/17-observability.md`, which are still untracked. Those links break on a clean clone until the two files are committed. And the Mermaid diagram was checked against the GitHub rules by reading, not by rendering.

**Substance defects the doc-writer found, reported here and not rewritten.** Each needs its owner.

1. `docs/adr/README.md` lists ADR-001 as Accepted with deciders unsigned. Owner: architect.
2. The constitution is still "Ratified: pending team review" and P6 is the blank template placeholder, while ADR-001 treats it as binding. Owner: crew-lead.
3. The PRD is "Draft, awaiting approval" while spec 001 is Ready and code is built. Owner: product-manager.
4. `docs/13-conventions.md` describes import-linter, pyright strict, eslint boundaries and `make check` in the present tense. None is wired. Owner: quality-engineer.
5. `docs/06-agent-design.md` is "Proposed" yet states numbers and a model choice with no recorded eval run. Owner: ai-engineer.
6. The status doc names only `test_health.py` for the skeleton row and omits `backend/tests/unit/test_health_model.py`. Owner: whoever runs `/crew-checkpoint` next.
7. Spec 001 AC-001-9 asks for a `ConfigurationError` naming `APP_ENV`. The code raises pydantic's own error until T001-07. The status row should say so. Owner: spec-writer.

Next step for a person: review the four files, commit them together with the two untracked docs, and route the seven defects above.