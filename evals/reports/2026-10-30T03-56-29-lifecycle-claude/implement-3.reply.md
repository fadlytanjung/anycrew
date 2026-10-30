The contract matches plan.md exactly. Task T001-03 is done.

**Result:** T001-03 (health response matches the OpenAPI contract) is implemented, ticked, and committed as `277b952` on `master`. The tree is clean and `make check` is green.

**What changed**
- `contracts/openapi.yaml` is new: OpenAPI 3.1.0, `GET /api/health` with `HealthResponse` (status enum `ok`, version, both required, no extra properties) and a shared `Problem` schema on the default response.
- `backend/tests/integration/test_health.py` gained the contract test, which loads the YAML and checks required keys, the status enum, and `additionalProperties: false`.
- `docs/specs/001-foundation/tasks.md` has T001-03 ticked.
- `docs/20-implementation-status.md` has a refreshed last-updated line and a note on the Foundation row. Its status stays In progress.

**Evidence**
- The TDD step failed first for the right reason: the contract file did not exist.
- `make check` currently only runs the backend pytest suite, since the gates arrive in Slice 2. Output tail:

```
2 passed, 1 warning in 0.20s
```

The warning is Starlette's deprecation notice about `httpx` in the test client. It is unrelated to this task.

**One judgment call to carry forward.** The `Problem.errors[]` item shape is `{field, message}`. AC-001-4 only says the array names each invalid field, so T001-05 must either produce that shape or change the contract first.

**Fix I applied after delegation.** The implementer's commit carried the wrong attribution trailer. I amended the unpushed commit so it ends with the required Fable 5.1 line.

**Next task:** T001-04, settings validated at start-up.