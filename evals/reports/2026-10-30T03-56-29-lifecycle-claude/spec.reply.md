Verification done. The only unresolved links point to docs/13 and docs/16, which tasks T001-02 and T001-04 create by design. Nothing is committed, as you did not ask for a commit.

Spec 001 Foundation is written and marked Ready.

**Files written**
- `docs/specs/001-foundation/spec.md`: 5 user stories, 11 acceptance criteria. Health endpoint body, problem+json shape, the three `TEAMLY_*` variables, the `make check` order and the CI trigger are pinned.
- `docs/specs/001-foundation/plan.md`: three slices. Slice 1 is the vertical slice (contract → FastAPI health → generated types → React page → tests). Slice 2 adds the gates. Slice 3 adds CI and the root README. Layout and layer decisions, dependency table, constitution check and risks are included.
- `docs/specs/001-foundation/tasks.md`: 15 tasks, 5 marked TDD, each naming files and ACs. T001-01 is the TDD health slice. T001-99 closes with the status update.

**Wiring**
- `docs/specs/README.md`: 001 row added, Ready. A note explains later specs wait for the architect's build order in docs/05.
- `docs/04-requirements-traceability.md`: created, with the 001 row marked *pending PRD*.
- `docs/20-implementation-status.md`: Foundation row added as Specified, with the suites to be named and two gaps recorded.

**Deviations you should know about**
- There is no architect build order on disk. No docs/03, 04, 05 or 13 existed. I took the order from the specs index placeholder and the week-1 line of docs/01 §6.
- The spec has no FR/NFR ID because the PRD does not exist. It traces to the constitution and docs/01 instead. The product manager should add an NFR and re-key docs/04 when writing docs/03.
- Dependency versions are not typed from memory. The plan directs the implementer to pin them in the lockfiles and fill the table in at T001-01 and T001-06.
- Spec and plan link to docs/13 and docs/16, which do not exist yet. Tasks T001-02 and T001-04 create them.

**Next step** is `/crew-implement` on T001-01. The uncommitted brainstorm doc and status edit from the previous session are still in the working tree alongside these changes.