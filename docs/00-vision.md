# 00 — Vision

## The problem

A developer or a small startup that builds with a coding assistant repeats the same setup on every
project: an agent guide, rules, slash commands, a constitution, a docs skeleton, a spec loop, quality
gates, a status page. Each assistant (Claude Code, Codex, Antigravity, Cursor, OpenCode, Copilot)
wants those in its own folder with its own front matter. And the assistant uses the same expensive
model for everything, from "list the files that mention X" to "design the data model".

## What anycrew is

A **crew**: sixteen specialist agents with one method, installed into any assistant from one source.
The method is spec-driven development as practised on real products: a decision document, a PRD with
requirement IDs, an architecture with ADRs, feature specs with acceptance criteria, test-first tasks,
reviews with evidence, a security pass, a deploy checklist, and a status page that is true.

Each agent declares a **model tier** (fast, balanced, strong). anycrew maps the tier to the right
model in each assistant, so the scout runs on the cheap model and the architect on the strong one.

## Who it is for

- A founder or a two-to-four person team building an MVP with an assistant and wanting the output
  to be reviewable by humans and investors, not just runnable.
- A developer starting a service, a full-stack app or a multi-agent system who wants good practice
  without re-deriving it.
- A team that uses more than one assistant and wants one source of truth for its agents.

## Principles

1. **Tool-agnostic.** One canonical source; native output for each assistant; standards
   (AGENTS.md, Agent Skills, Agent Plugins) wherever they exist.
2. **Method over magic.** Spec → plan → tasks → test-first → gates → status. Agents propose, people
   decide at gates.
3. **Right-sized models.** Every agent declares a tier. The cheapest model that does the job wins.
4. **Docs are the product.** The method lives in documents people can read and review, not only in
   prompts.
5. **Boilerplate-agnostic.** A preset describes the stack; anycrew never forces a framework or a
   cloud.
6. **Security, tests and docs are roles, not afterthoughts.**
7. **Light footprint.** No daemon, no dependencies, small always-on context; everything else is
   loaded on demand.

## What anycrew is not

- Not a runtime or an orchestration engine; it uses the assistant's own subagents and skills.
- Not a code generator for a particular stack; presets carry conventions and commands, not code.
- Not a replacement for judgement: it makes the person's decisions explicit and recorded.
