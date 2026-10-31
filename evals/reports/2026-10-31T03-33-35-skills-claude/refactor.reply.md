Done. Six commits on `master`, tree clean, gates green after each one.

**One caveat first.** `make check` does not exist yet, because spec 001 task T001-15 (the Makefile) is unticked. I ran the gates it is specified to wrap: `ruff check`, `ruff format --check` and `pytest`. Before this work those first two were already red on this file.

## Audit of `backend/app/legacy/report.py` (commit 5dc5c0d)

Measured: 24 lines, one function, cyclomatic complexity 10, 9 branches, 3 returns, 3 wall-clock reads, 12 lint hits. Churn is flat (one commit), so ranking is by change cost.

| # | Smell (catalogue) | Where | Why it costs | Effort |
|---|---|---|---|---|
| 1 | Switch on type + duplicated code | lines 8-19 | Adding a kind means copy-pasting a 4-line block; a fix must be applied three times | S |
| 2 | Impure domain / flaky by clock | lines 11, 15, 19 | `datetime.now()` per row makes the output untestable without monkeypatching, and breaks the project's Clock convention | S |
| 3 | Long function / switch on format | lines 20-24 | Rendering and computing in one body; a second format grows the same function | S |
| 4 | Primitive obsession, untyped signature | line 4 | `kind`, `fmt`, rows and the return type are all guesses for a caller | S |
| 5 | Float money | lines 6, 10, 14, 18 | Totals accumulate in float and print as float | M (behaviour change) |
| 6 | Hand-built JSON | line 23 | A quote in an id produces invalid JSON | M (behaviour change) |
| 7 | Inconsistent return | line 24 | Unknown format returns a list, known formats return a string | M (behaviour change) |

## What was done, one commit each

1. **f1097a7** Characterisation suite `backend/tests/unit/test_legacy_report_characterisation.py`, 13 tests pinning every kind and format, the fall-throughs, the per-row clock read and the unescaped-JSON defect.
2. **eee03d3** Kind ladder replaced by a multiplier table. Complexity 10 to 6.
3. **7371a1e** Clock injected as a keyword-only `now` callable with the wall clock as default, so callers are unchanged. Tests dropped their monkeypatch.
4. **560523b** Line and csv/json formatters extracted, format ladder became a table lookup. Complexity 5.
5. **9fd67fe** Public signature typed, `Row` and `Clock` aliases, module docstring stating the output shape is a compatibility contract.
6. **11f030d** Enforcement and docs, see below.

## The rule that stops the worst smell returning

`backend/pyproject.toml` now has a `[tool.ruff]` section with complexity capped at 8 (C901) and the wall clock banned (TID251 on `datetime.now`, `utcnow`, `date.today`, `time.time`). Run against the original file these rules report C901 at 10 over 8, SIM102 and three TID251 hits, so the ladder and the hidden clock cannot come back unnoticed. The convention is recorded in `docs/13-conventions.md` §4, T001-16 in spec 001 is told to extend the section rather than replace it, and `docs/20-implementation-status.md` gained a row for the legacy module.

## Deliberately left

- **Float totals, hand-built JSON, list fall-through** (smells 5 to 7). Each changes the output string and so needs a task, not a refactor. The characterisation tests pin them until then.
- **One `noqa: TID251`** on the compatibility default in the legacy module. It disappears once a composition root passes a Clock.
- **Pyright** is not installed yet (T001-16), so the new annotations are unchecked by a type checker.