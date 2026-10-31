All 22 tasks carry a Files list and ACs, and every listed dependency points backward. Done.

**What changed**

- `docs/specs/001-foundation/tasks.md` was rewritten from the current plan. Task `T001-nn` is plan step `nn`, grouped into the plan's six slices. Each task names its files, its acceptance criteria and the earlier tasks it needs.
- TDD markers sit on the nine tasks that add logic: the health test, config validation, problem+json, the contract test, the `ApiStatus` widget, the tokens check, the FSD boundaries test and the repo checks. UI tasks list the states to check. Manual checks from the plan stay in the task that owns them with the instruction to paste evidence into the commit body.
- The status-update task is last as `T001-22`. It names all eight test suites plus the CI run, and the traceability columns for NFR-004, NFR-007 and NFR-010.
- `docs/20-implementation-status.md` task ranges now match the new numbering. The gates row also covers the coverage floors, and the CI row covers the README and close tasks.
- The plan's risk bullet that said tasks.md was cut against the old plan now records the re-cut and the one-to-one step mapping.

**Two judgment calls**

- The 404 task gained a second named test for the trailing-slash case, which the plan lists but the old tasks did not name.
- The repo-check task owns the plan's "clean checkout, network off" evidence, since it is the last task of slice 4.

Nothing is committed. Next step is `/crew-implement 001`, starting at T001-01.