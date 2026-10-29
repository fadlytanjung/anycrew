# 13 — Conventions

> How code is organised and written so that every feature looks like it was written by one person.
> Coding agents follow this page through `.agents/rules/`.

## 1. Repository layout
```
{{layout_sketch}}
```
## 2. Layers and allowed imports
| Layer | May import | Must not |
|---|---|---|
Enforced by: <tool> in `{{check_cmd}}`.
## 3. Patterns we use, and where
| Pattern | Where | Why |
|---|---|---|
| Ports & adapters | | swap external systems for fakes |
| Composition root | | no globals |
| Policy as configuration | | reviewable rules |
## 4. Language conventions
<!-- Filled from the preset; edit freely. -->
{{backend_conventions}}

{{frontend_conventions}}
## 5. Git conventions
- Branch per spec; commit `feat(NNN): …` with `Tasks:` and `AC:` trailers; one task per commit.
