# FAQ

**Is anycrew a framework like CrewAI or LangGraph?**
No. Those are runtimes for building agent systems inside your product. anycrew is a crew of agents
that help you *build* your product inside the coding assistant you already use. The ai-engineer
agent and `/crew-llm` help you design a product that uses such a runtime.

**Do I have to use the whole method?**
No. Each skill works alone: `/crew-review` on a diff, `/crew-security` on a repo, `/crew-adr` for one
decision. The gates and IDs pay off most when the whole loop is used.

**Will it fight my existing CLAUDE.md, rules or agents?**
`init` never overwrites `AGENTS.md`, anything under `docs/`, or any file without the
`anycrew:generated` marker. If a `CLAUDE.md` exists it is left alone and reported; add `@AGENTS.md`
to it by hand. Your own agents coexist with the crew.

**Why Markdown and JSON, no YAML config?**
So that `npx anycrew` runs with zero dependencies on any machine and in CI. See ADR-003.

**Why are skills prefixed `crew-`?**
They land in `.agents/skills` next to your own and other packs'. `review` or `plan` would collide.

**Which assistant works best?**
Claude Code and Antigravity are verified end to end. Codex, Cursor, OpenCode and Copilot outputs
follow their documentation and are being exercised next.

**Can I use a cheaper model everywhere?**
Yes: override the tier mapping in `.anycrew/config.json` under `models`. The tiers only say what
the role needs; the mapping says what you are willing to pay.

**How do I update the crew in a project?**
Upgrade the package and run `npx anycrew sync`. Generated files are rewritten; your edits to
unmarked files are kept and reported.

**Does it send any data anywhere?**
No. anycrew is files and a local CLI. The assistants you run it in have their own policies.
