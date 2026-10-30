Done. Every AC of spec 001 is mapped in the new `docs/15-testing.md`, the two ACs that were testable at an existing layer now have tests, and `make check` is green on all three commits.

**AC → test map (summary)**

| AC | State | Where |
|---|---|---|
| AC-001-3 health ok + contract | green (pre-existing) | `backend/tests/integration/test_health.py` |
| AC-001-4 problem+json 404/422 | green (new) | `backend/tests/integration/test_errors.py` |
| AC-001-5 settings validated | green (new) | `backend/tests/unit/test_config.py` |
| AC-001-6, 7 frontend states, generated types | pending | no `frontend/` yet (T001-06 to T001-08, T001-12) |
| AC-001-8, 9, 10 gates | pending | T001-10 to T001-12; 8 and 9 are manual checks by spec wording |
| AC-001-1, 2 setup/dev | pending | manual checks, T001-09 |
| AC-001-11 CI | pending | T001-13, URL recorded in docs/20 |

**What I changed, in three commits**

- **T001-04** `Settings` gains `log_level`, and a wrap validator raises `ConfigurationError` whose message names the `TEAMLY_*` variable, as AC-001-5 requires. Tests cover missing, five invalid values, bad log level, defaults, and app creation for all four envs. An autouse fixture in `conftest.py` strips `TEAMLY_*` from the process environment so CI's `TEAMLY_ENV=ci` cannot leak in. `docs/16-infrastructure.md` created with the three-variable table.
- **T001-05** New `backend/src/teamly/api/errors.py` renders Starlette `HTTPException` and `RequestValidationError` as `application/problem+json`, registered in `create_app`. Tests cover three unknown paths, a 422 with two invalid fields, a passing request on the same route, and both bodies against the `Problem` schema in the contract.
- **docs/15** Layers, gate order, ground-truth rules and the full AC map.

**Two things worth knowing**

- Writing failing tests for the frontend and gate ACs would have made `make check` red with no layer to make them pass, so those rows are marked pending against their tasks rather than added. They are the right next work: T001-06 onward.
- The 422 title is taken from `HTTPStatus(422).phrase`, which Python 3.12 reports as "Unprocessable Entity". The spec does not pin the title, so no doc change was needed. I also switched `test_health.py` to `Settings(env=Env.TEST)` because pyright strict rejected the string literal; this will matter when T001-10 adds pyright to `make check`.