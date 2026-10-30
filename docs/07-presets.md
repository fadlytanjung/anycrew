# 07 — Presets

A preset is one JSON file in `presets/` that describes a stack: commands, layout, rule globs and
conventions. anycrew is boilerplate-agnostic: the preset carries no code, only what the agents need to
work in your stack the way your team does.

## Shipped presets

| id | Stack | Check command |
|---|---|---|
| `python-fastapi-react` | uv + FastAPI + Pydantic v2 + pytest + ruff + pyright; React 19 + Vite + TS + Vitest + Playwright | `make check` |
| `node-typescript-next` | pnpm workspace; Node 22 API (Hono/Nest, Zod, Vitest); Next.js App Router | `pnpm lint && pnpm typecheck && pnpm test` |
| `go-service` | Go 1.23+, chi/net/http, sqlc/pgx, golangci-lint | `gofmt -l . && go vet ./... && golangci-lint run && go test ./...` |
| `generic` | none | `echo TODO` placeholders to fill in `.anycrew/config.json` |

## Writing your own

```json
{
  "id": "rails-hotwire",
  "name": "Ruby on Rails + Hotwire",
  "description": "Rails 8, Hotwire, Minitest, RuboCop, Brakeman.",
  "languages": ["ruby"],
  "commands": {
    "setup": "bundle install && bin/rails db:prepare",
    "dev": "bin/dev",
    "check": "bundle exec rubocop && bundle exec brakeman -q && bin/rails test",
    "test": "bin/rails test",
    "lint": "bundle exec rubocop"
  },
  "layout": { "backend": "app", "frontend": "app/javascript", "docs": "docs", "specs": "docs/specs", "contracts": "contracts" },
  "rules": { "backend_globs": ["app/**/*.rb", "lib/**/*.rb"], "frontend_globs": ["app/javascript/**"], "llm_globs": ["app/prompts/**"] },
  "backend_conventions": ["Service objects for business logic; controllers stay thin.", "..."],
  "frontend_conventions": ["Stimulus controllers are small and named after behaviour.", "..."],
  "hooks": { "lint_after_edit": true }
}
```

Use it with `anycrew init --preset ./presets/rails-hotwire.json`. The conventions become
`20-backend` and `30-frontend` rules scoped to the globs, and `docs/13-conventions.md` section 4.
Send a PR if the preset would help others.

## Where the preset shows up

| Field | Appears in |
|---|---|
| `commands.*` | `AGENTS.md` command table, `docs/00` quality bar, `docs/15`, `docs/specs/README.md` |
| `layout.*` | `AGENTS.md` layout sketch, `docs/13` |
| `rules.*_globs` | the `paths`/`globs`/`applyTo` of generated rules |
| `*_conventions` | `20-backend` / `30-frontend` rules and `docs/13` §4 |
