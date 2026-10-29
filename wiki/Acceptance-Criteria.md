# Acceptance Criteria

**Definition.** An acceptance criterion (AC) is one testable statement that defines when a user
story is done. anycrew writes them as **Given / When / Then** and numbers them `AC-NNN-n` inside
spec `NNN`.

```
AC-009-5  Given a review item of kind MATCH,
          when the user posts an action that is not in its allowed list,
          then the API answers 422 ACTION_NOT_ALLOWED with the allowed actions in the body.
```

## What makes an AC good

| Good | Bad |
|---|---|
| Observable: a response code, a file, a screen state | "works well", "is fast" |
| Pinned values: `422`, `ACTION_NOT_ALLOWED`, `300 rows` | "an error", "many rows" |
| One behaviour per AC | three behaviours joined with "and" |
| Testable by a machine, or by a documented manual check | "the user is happy" |

## Where ACs show up

- `spec.md` under its user story.
- `tasks.md`: every task lists the ACs it serves.
- Test names: `test_ac009_5_disallowed_action_is_422`.
- Commit trailers: `AC: AC-009-5`.
- `/crew-verify`: each AC lands in one bucket: conformant, untested, drift, missing, undocumented.

## Changing an AC

An AC with a passing test is a contract. Changing it needs a line in the spec's change log and the
test changes in the same commit. Never change the test's expectation to match a bug.

## Related

[Spec, Plan and Tasks](Spec-Plan-Tasks.md) · [PRD](Product-Requirements-Document.md)
