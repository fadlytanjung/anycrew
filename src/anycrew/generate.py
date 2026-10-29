"""Per-tool generators: a port of lib/generate.mjs. Outputs must stay byte-identical to the Node CLI
(tests/test_parity.py checks it)."""
from __future__ import annotations

import datetime as _dt
import json
import re
from pathlib import Path
from typing import Any

from .frontmatter import stringify
from .fsx import MARKER, Report, chmod_x, read_if, write_generated, write_if_missing
from .pack import Pack, model_for

HOOK_REL = ".anycrew/hooks/lint-after-edit.sh"


def head(src: str) -> str:
    return f"<!-- {MARKER} from {src} — edit the source and run `npx anycrew sync` -->\n"


def fill(text: str, vars: dict[str, str]) -> str:
    return re.sub(r"\{\{([a-z_]+)\}\}", lambda m: vars.get(m.group(1), "{{" + m.group(1) + "}}"), text)


def template_vars(config: dict, preset: dict) -> dict[str, str]:
    c = {**preset.get("commands", {}), **config.get("commands", {})}
    l = preset.get("layout", {})
    backend = l.get("backend")
    sketch = [
        f"{config['project']}/",
        "├── AGENTS.md                  agent guide (read first)",
        "├── docs/                      specs, ADRs, status",
        f"├── {l['contracts']}/                 machine-readable contracts" if l.get("contracts") else None,
        f"├── {backend}/" if backend and backend != "." else None,
        f"├── {l['frontend']}/" if l.get("frontend") else None,
        "└── .agents/                   rules, skills, agents (anycrew)",
    ]

    def bullets(arr):
        return "\n".join(f"- {s}" for s in arr) if arr else ""

    bc, fc = preset.get("backend_conventions"), preset.get("frontend_conventions")
    return {
        "project": config["project"],
        "purpose": config.get("purpose") or "",
        "preset": preset["id"],
        "setup_cmd": c.get("setup"), "dev_cmd": c.get("dev"), "check_cmd": c.get("check"),
        "test_cmd": c.get("test"), "lint_cmd": c.get("lint"),
        "deploy_cmd": c.get("deploy", "TODO: deploy command"),
        "contracts_dir": l.get("contracts") or "contracts",
        "prompts_dir": f"{backend}/app/prompts/" if backend and backend != "." else "prompts/",
        "layout_sketch": "\n".join(s for s in sketch if s),
        "backend_conventions": f"### Backend\n{bullets(bc)}" if bc else "",
        "frontend_conventions": f"### Frontend\n{bullets(fc)}" if fc else "",
        "date": _dt.datetime.now(_dt.timezone.utc).strftime("%Y-%m-%d"),
    }


class Rule:
    def __init__(self, id: str, data: dict, body: str, globs: list[str]):
        self.id, self.data, self.body, self.globs = id, data, body, globs


def effective_rules(pack: Pack, preset: dict) -> list[Rule]:
    rules = [Rule(r.id, dict(r.data), r.body, []) for r in pack.rules]
    pr = preset.get("rules", {})
    for r in rules:
        if r.id.startswith("50-"):
            r.globs = list(pr.get("llm_globs", []))

    def add(id: str, title: str, items, globs):
        if not items or not globs:
            return
        rules.append(Rule(id, {"trigger": "glob", "globs": ", ".join(globs), "description": f"{title} conventions for {preset['name']}."},
                          f"# {title} conventions\n\n" + "\n".join(f"- {s}" for s in items) + "\n", list(globs)))

    add("20-backend", "Backend", preset.get("backend_conventions"), pr.get("backend_globs"))
    add("30-frontend", "Frontend", preset.get("frontend_conventions"), pr.get("frontend_globs"))
    return sorted(rules, key=lambda r: r.id)


def _selected(items, excludes):
    ex = set(excludes or [])
    return [x for x in items if x.id not in ex]


def _json(obj: Any) -> str:
    return json.dumps(obj, indent=2, ensure_ascii=False) + "\n"


def generate(pack: Pack, config: dict, preset: dict, project_dir: Path, tools: list[str], force: bool, report: Report) -> Report:
    vars = template_vars(config, preset)
    rules = effective_rules(pack, preset)
    agents = _selected(pack.agents, config.get("agents", {}).get("exclude"))
    skills = _selected(pack.skills, config.get("skills", {}).get("exclude"))
    over = config.get("models", {})
    P = lambda *p: project_dir.joinpath(*p)  # noqa: E731

    def w(rel: str, content: str):
        return write_generated(P(rel), content, report, force=force)

    # ---- Universal layer ----
    if not P("AGENTS.md").exists():
        write_if_missing(P("AGENTS.md"), fill(pack.template("AGENTS.md"), vars), report)
    else:
        report.notes.append("AGENTS.md exists; left untouched (it is yours to edit).")

    for r in rules:
        fm: dict[str, Any] = {"trigger": r.data.get("trigger"), "description": r.data.get("description")}
        if r.data.get("trigger") == "glob" or (r.globs and r.data.get("trigger") == "model_decision"):
            if r.globs:
                fm["trigger"] = "glob"
                fm["globs"] = ", ".join(r.globs)
        w(f".agents/rules/{r.id}.md", stringify(fm, head("anycrew/rules") + "\n" + r.body))
    for s in skills:
        w(f".agents/skills/{s.id}/SKILL.md", stringify(s.data, head(f"anycrew/skills/{s.id}") + "\n" + s.body))
        _copy_extras(s.dir, P(".agents", "skills", s.id), report)
    if "antigravity" in tools:
        for a in agents:
            fm = {"name": a.data["name"], "description": a.data["description"],
                  "model": model_for(pack.models, over, "antigravity", a.data["tier"]) or "inherit"}
            w(f".agents/agents/{a.id}.md", stringify(fm, head(f"anycrew/agents/{a.id}") + "\n" + a.body))
    hook_on = config.get("hooks", {}).get("lint_after_edit", True) is not False
    if hook_on:
        hp = P(HOOK_REL)
        shebang, _, rest = pack.hook_script.partition("\n")
        script = f"{shebang}\n# {MARKER}\n{rest}"
        if write_generated(hp, script, report, force=True):
            chmod_x(hp)

    # ---- Claude Code ----
    if "claude" in tools:
        w("CLAUDE.md", f"{head('anycrew/templates/CLAUDE.md')}@AGENTS.md\n")
        for a in agents:
            m = model_for(pack.models, over, "claude", a.data["tier"])
            fm = {"name": a.data["name"], "description": a.data["description"]}
            if isinstance(m, dict):
                fm["model"] = m.get("model")
                if m.get("effort"):
                    fm["effort"] = m["effort"]
            elif m:
                fm["model"] = m
            if a.data.get("tools"):
                fm["tools"] = a.data["tools"]
            w(f".claude/agents/{a.id}.md", stringify(fm, head(f"anycrew/agents/{a.id}") + "\n" + a.body))
        for s in skills:
            w(f".claude/skills/{s.id}/SKILL.md", stringify(s.data, head(f"anycrew/skills/{s.id}") + "\n" + s.body))
            _copy_extras(s.dir, P(".claude", "skills", s.id), report)
        for r in rules:
            prefix = stringify({"paths": r.globs}, "") if r.globs else ""
            w(f".claude/rules/{r.id}.md", prefix + head("anycrew/rules") + "\n" + r.body)
        if hook_on:
            _merge_claude_settings(P(".claude", "settings.json"), report)

    # ---- Codex ----
    if "codex" in tools:
        for a in agents:
            m = model_for(pack.models, over, "codex", a.data["tier"]) or {}
            lines = [f"# {MARKER} from anycrew/agents/{a.id} — edit the source and run `npx anycrew sync`",
                     f"name = {json.dumps(a.data['name'], ensure_ascii=False)}",
                     f"description = {json.dumps(a.data['description'], ensure_ascii=False)}"]
            if m.get("model"):
                lines.append(f"model = {json.dumps(m['model'], ensure_ascii=False)}")
            if m.get("model_reasoning_effort"):
                lines.append(f"model_reasoning_effort = {json.dumps(m['model_reasoning_effort'], ensure_ascii=False)}")
            lines += ["", "developer_instructions = '''", a.body.replace("'''", "''\\'"), "'''", ""]
            w(f".codex/agents/{a.id}.toml", "\n".join(lines))
        report.notes.append("Codex reads AGENTS.md and .agents/skills natively; custom agents are in .codex/agents/*.toml.")

    # ---- Antigravity hooks ----
    if "antigravity" in tools and hook_on:
        value = {"PostToolUse": [{"matcher": "write_to_file|replace_file_content|multi_replace_file_content",
                                  "hooks": [{"type": "command", "command": f"./{HOOK_REL}", "timeout": 60}]}]}
        _merge_json_named(P(".agents", "hooks.json"), "anycrew-lint", value, report)

    # ---- Cursor ----
    if "cursor" in tools:
        for r in rules:
            fm = {"description": r.data.get("description")}
            if r.globs:
                fm["globs"] = ",".join(r.globs)
            fm["alwaysApply"] = r.data.get("trigger") == "always_on"
            w(f".cursor/rules/{r.id}.mdc", stringify(fm, head("anycrew/rules") + "\n" + r.body))
        for a in agents:
            fm = {"name": a.data["name"], "description": a.data["description"],
                  "model": model_for(pack.models, over, "cursor", a.data["tier"]) or "inherit"}
            w(f".cursor/agents/{a.id}.md", stringify(fm, head(f"anycrew/agents/{a.id}") + "\n" + a.body))
        if hook_on:
            _merge_cursor_hooks(P(".cursor", "hooks.json"), report)
        report.notes.append("Cursor reads .agents/skills natively; no skill copies were made under .cursor/.")

    # ---- OpenCode ----
    if "opencode" in tools:
        for a in agents:
            fm: dict[str, Any] = {"description": a.data["description"], "mode": "subagent"}
            m = model_for(pack.models, over, "opencode", a.data["tier"])
            if m:
                fm["model"] = m
            w(f".opencode/agents/{a.id}.md", stringify(fm, head(f"anycrew/agents/{a.id}") + "\n" + a.body))
        report.notes.append("OpenCode reads AGENTS.md and .agents/skills natively; agents are in .opencode/agents/.")

    # ---- GitHub Copilot ----
    if "copilot" in tools:
        always_on = "\n".join(r.body for r in rules if r.data.get("trigger") == "always_on")
        w(".github/copilot-instructions.md", fill(pack.template("copilot-instructions.md"), {"always_on_rules": always_on}))
        for r in rules:
            if r.globs:
                w(f".github/instructions/{r.id}.instructions.md", stringify({"applyTo": ",".join(r.globs)}, head("anycrew/rules") + "\n" + r.body))
        for a in agents:
            fm = {"name": a.data["name"], "description": a.data["description"]}
            m = model_for(pack.models, over, "copilot", a.data["tier"])
            if m:
                fm["model"] = m
            w(f".github/agents/{a.id}.agent.md", stringify(fm, head(f"anycrew/agents/{a.id}") + "\n" + a.body))
        if hook_on:
            hooks = {"$comment": MARKER, "version": 1, "hooks": {"postToolUse": [{"type": "command", "bash": f"./{HOOK_REL}", "timeoutSec": 60}]}}
            w(".github/hooks/anycrew.json", _json(hooks))
        report.notes.append("Copilot reads AGENTS.md and .agents/skills natively; agents are in .github/agents/.")
    return report


def _copy_extras(src: Path | None, dst: Path, report: Report) -> None:
    if not src:
        return
    for d in sorted(src.iterdir()):
        if d.name == "SKILL.md":
            continue
        t = dst / d.name
        if d.is_dir():
            t.mkdir(parents=True, exist_ok=True)
            _copy_extras(d, t, report)
        else:
            write_generated(t, d.read_text(encoding="utf-8"), report, force=True)


def _load_json(file: Path, report: Report, default: dict) -> tuple[dict | None, str | None]:
    cur = read_if(file)
    if cur is None:
        return default, None
    try:
        return json.loads(cur), cur
    except json.JSONDecodeError:
        report.skipped.append((str(file), "not valid JSON; add the PostToolUse hook by hand"))
        return None, cur


def _save_json(file: Path, data: dict, cur: str | None, report: Report) -> None:
    out = _json(data)
    if out != cur:
        file.parent.mkdir(parents=True, exist_ok=True)
        file.write_text(out, encoding="utf-8")
        report.written.append(str(file))
    else:
        report.unchanged.append(str(file))


def _merge_claude_settings(file: Path, report: Report) -> None:
    data, cur = _load_json(file, report, {})
    if data is None:
        return
    hooks = data.setdefault("hooks", {})
    post = hooks.setdefault("PostToolUse", [])
    entry = {"matcher": "Write|Edit|MultiEdit", "hooks": [{"type": "command", "command": f'"$CLAUDE_PROJECT_DIR"/{HOOK_REL}', "timeout": 60, "statusMessage": "anycrew: linting edited file…"}]}
    idx = next((i for i, e in enumerate(post) if HOOK_REL in json.dumps(e)), -1)
    if idx >= 0:
        post[idx] = entry
    else:
        post.append(entry)
    _save_json(file, data, cur, report)


def _merge_json_named(file: Path, key: str, value: Any, report: Report) -> None:
    data, cur = _load_json(file, report, {})
    if data is None:
        return
    data[key] = value
    _save_json(file, data, cur, report)


def _merge_cursor_hooks(file: Path, report: Report) -> None:
    data, cur = _load_json(file, report, {"version": 1, "hooks": {}})
    if data is None:
        return
    data.setdefault("version", 1)
    after = data.setdefault("hooks", {}).setdefault("afterFileEdit", [])
    if not any(HOOK_REL in json.dumps(e) for e in after):
        after.append({"command": f"./{HOOK_REL}"})
    _save_json(file, data, cur, report)


ESSENTIAL_DOCS = {
    "README.md", "00-constitution.md", "20-implementation-status.md", "glossary.md",
    "adr/README.md", "adr/ADR-template.md", "specs/README.md",
    "specs/NNN-template/spec.md", "specs/NNN-template/plan.md", "specs/NNN-template/tasks.md",
}


def scaffold_docs(pack: Pack, config: dict, preset: dict, project_dir: Path, report: Report, all_docs: bool = False) -> None:
    vars = template_vars(config, preset)
    for rel, text in pack.docs_templates:
        if not all_docs and rel not in ESSENTIAL_DOCS:
            continue
        write_if_missing(project_dir / "docs" / rel, fill(text, vars), report)
