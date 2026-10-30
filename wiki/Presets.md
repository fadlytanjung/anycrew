# Presets

**Definition.** A preset is one JSON file describing a stack: the commands to set up, run, lint,
test and check; the layout (where backend, frontend, docs, contracts live); the path globs that
scope rules; and the conventions for each language. It carries **no code**. That is what makes
anycrew boilerplate-agnostic: your stack is a description, not a template you must adopt.

## Shipped

| id | Stack |
|---|---|
| `python-fastapi-react` | uv, FastAPI, Pydantic v2, pytest, ruff, pyright; React 19, Vite, TypeScript, Vitest, Playwright |
| `node-typescript-next` | pnpm workspace, Node 22 API (Hono or Nest, Zod, Vitest), Next.js App Router |
| `go-service` | Go 1.23+, chi or net/http, sqlc or pgx, golangci-lint |
| `generic` | placeholders to fill |

## What the preset becomes

| Field | Shows up in |
|---|---|
| `commands` | the command table in `AGENTS.md`, the constitution's quality bar, the spec loop |
| `layout` | the repository sketch in `AGENTS.md` and `docs/13` |
| `rules.*_globs` | the `paths` / `globs` / `applyTo` of generated rules |
| `*_conventions` | the `20-backend` and `30-frontend` rules and `docs/13` section 4 |

## Your own

Copy a shipped preset, change the fields, and run
`anycrew init --preset ./my-preset.json`. A good preset's conventions are the ten sentences a
senior engineer would tell a new hire on day one, not a style guide.

## Related

[Agents, Skills and Rules](Agents-Skills-Rules.md)
