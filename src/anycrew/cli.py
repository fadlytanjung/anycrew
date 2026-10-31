"""anycrew command line: init, sync, doctor, list, presets. A port of lib/cli.mjs."""
from __future__ import annotations

import json
import shutil
import sys
from pathlib import Path

from .fsx import Report
from .generate import generate, scaffold_docs
from .pack import TIERS, TOOLS, load_pack, load_preset, model_for

CONFIG_REL = Path(".anycrew") / "config.json"
HELP = f"""anycrew — one crew of specialist agents for any coding assistant

Usage:
  anycrew init   [--preset <id|file>] [--tools a,b|all] [--architecture <style>] [--name <project>]
                 [--purpose "<text>"] [--dir <path>] [--all-docs] [--force] [--yes]
                 (in a terminal without --tools/--preset it asks; --yes takes the detected defaults)
  anycrew sync   [--tools a,b|all] [--dir <path>] [--force]
  anycrew doctor [--dir <path>]
  anycrew list   [--dir <path>]
  anycrew presets
  anycrew --version | --help

Tools: {', '.join(TOOLS)}   (default: the assistants detected on this machine or in the repo)
Presets: see `anycrew presets`.   Architecture styles: see `anycrew styles`.
"""


def main(argv: list[str] | None = None) -> int:
    argv = sys.argv[1:] if argv is None else argv
    cmd, opts = _parse_args(argv)
    try:
        if opts.get("version"):
            print(load_pack().version)
            return 0
        if not cmd or opts.get("help") or cmd == "help":
            print(HELP)
            return 0
        project_dir = Path(opts.get("dir") or Path.cwd()).resolve()
        if cmd == "init":
            return _init(project_dir, opts)
        if cmd == "sync":
            return _sync(project_dir, opts)
        if cmd == "doctor":
            return _doctor(project_dir)
        if cmd == "list":
            return _list(project_dir)
        if cmd == "presets":
            return _presets()
        if cmd == "styles":
            return _styles()
        print(f'unknown command "{cmd}"\n{HELP}', file=sys.stderr)
        return 2
    except SystemExit as e:
        if isinstance(e.code, str):
            print(e.code, file=sys.stderr)
            return 1
        raise


def _parse_args(argv):
    opts, cmd = {}, None
    i = 0
    while i < len(argv):
        a = argv[i]
        if a.startswith("--"):
            k = "".join(p.capitalize() if j else p for j, p in enumerate(a[2:].split("-")))
            nxt = argv[i + 1] if i + 1 < len(argv) else None
            if nxt is not None and not nxt.startswith("--"):
                opts[k] = nxt
                i += 1
            else:
                opts[k] = True
        elif cmd is None:
            cmd = a
        i += 1
    return cmd, opts


def _valid_style(pack, sid: str) -> str:
    if sid not in pack.architectures["styles"]:
        raise SystemExit(f'anycrew: unknown architecture style "{sid}" (known: {", ".join(pack.architectures["styles"])})')
    return sid


def _read_config(project_dir: Path):
    p = project_dir / CONFIG_REL
    return json.loads(p.read_text(encoding="utf-8")) if p.exists() else None


def _detect(project_dir: Path):
    has = lambda b: shutil.which(b) is not None  # noqa: E731
    d = lambda p: (project_dir / p).exists()  # noqa: E731
    return {
        "claude": {"cli": has("claude"), "dir": d(".claude") or d("CLAUDE.md"), "reads": "AGENTS.md/CLAUDE.md, .claude/{agents,skills,rules}, .claude/settings.json hooks"},
        "codex": {"cli": has("codex"), "dir": d(".codex"), "reads": "AGENTS.md, .agents/skills, .codex/agents/*.toml"},
        "antigravity": {"cli": has("agy"), "dir": d(".agents/agents") or d(".agents/rules"), "reads": "AGENTS.md, .agents/{rules,skills,agents}, .agents/hooks.json"},
        "cursor": {"cli": has("cursor") or has("cursor-agent"), "dir": d(".cursor"), "reads": "AGENTS.md, .cursor/{rules,agents}, .agents/skills, .cursor/hooks.json"},
        "opencode": {"cli": has("opencode"), "dir": d(".opencode"), "reads": "AGENTS.md, .agents/skills, .opencode/agents"},
        "copilot": {"cli": has("copilot"), "dir": d(".github/copilot-instructions.md") or d(".github/agents"), "reads": ".github/copilot-instructions.md, .github/{instructions,agents,hooks}, .agents/skills"},
    }


def _resolve_tools(opt, project_dir: Path) -> list[str]:
    if opt == "all":
        return list(TOOLS)
    if isinstance(opt, str):
        lst = [s.strip() for s in opt.split(",") if s.strip()]
        bad = [t for t in lst if t not in TOOLS]
        if bad:
            raise SystemExit(f"anycrew: unknown tool(s): {', '.join(bad)} (known: {', '.join(TOOLS)})")
        return lst
    d = _detect(project_dir)
    found = [t for t in TOOLS if d[t]["cli"] or d[t]["dir"]]
    return found or ["claude", "codex", "antigravity"]


def _ask_init(project_dir: Path, opts: dict, pack) -> dict:
    """Ask the few questions init needs when run without flags in a terminal. Developers usually use
    one or two assistants, so the default is what is detected, never everything."""
    if opts.get("yes") or opts.get("tools") or opts.get("preset") or not sys.stdin.isatty():
        return opts
    d = _detect(project_dir)
    detected = [t for t in TOOLS if d[t]["cli"] or d[t]["dir"]]

    def ask(q: str, default: str) -> str:
        a = input(f"{q}{f' [{default}]' if default else ''}: ").strip()
        return a or default

    print(f"Assistants: {', '.join(TOOLS)}  (detected: {', '.join(detected) or 'none'})")
    tools = ask("Which assistants should anycrew generate files for (comma-separated, or all)", ",".join(detected) or "claude")
    print(f"Presets: {', '.join(pack.presets)}")
    preset = ask("Stack preset", "generic")
    print("Choose an architecture style. It is recorded as a Proposed ADR-001 and /crew-patterns confirms it later.")
    for sid, st in pack.architectures["styles"].items():
        print(f"  {sid:<18} {st['name']}: {st['choose_when']}")
    architecture = ask("Architecture style", opts.get("architecture") or pack.architectures["default"])
    name = ask("Project name", opts.get("name") or project_dir.name)
    purpose = ask("One-sentence purpose", opts.get("purpose") or "")
    return {**opts, "tools": tools, "preset": preset, "name": name, "purpose": purpose, "architecture": architecture}


def _init(project_dir: Path, opts) -> int:
    pack = load_pack()
    opts = _ask_init(project_dir, opts, pack)
    preset = load_preset(pack, opts.get("preset"))
    existing = _read_config(project_dir) or {}
    tools = _resolve_tools(opts.get("tools"), project_dir)
    config = {
        "$schema": "https://raw.githubusercontent.com/fadlytanjung/anycrew/main/schemas/config.schema.json",
        "version": 1,
        "anycrew": pack.version,
        "project": opts.get("name") or existing.get("project") or project_dir.name,
        "purpose": opts.get("purpose") if opts.get("purpose") is not None else existing.get("purpose", ""),
        "preset": preset["id"],
        "tools": tools,
        "commands": existing.get("commands") or dict(preset["commands"]),
        "models": existing.get("models", {}),
        "agents": existing.get("agents", {"exclude": []}),
        "skills": existing.get("skills", {"exclude": []}),
        "hooks": existing.get("hooks", {"lint_after_edit": preset.get("hooks", {}).get("lint_after_edit", True) is not False}),
        "architecture": {"style": _valid_style(pack, opts.get("architecture") or (existing.get("architecture") or {}).get("style") or "undecided"),
                         "patterns": (existing.get("architecture") or {}).get("patterns", [])},
    }
    (project_dir / ".anycrew").mkdir(parents=True, exist_ok=True)
    (project_dir / CONFIG_REL).write_text(json.dumps(config, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    report = Report()
    report.written.append(str(project_dir / CONFIG_REL))
    scaffold_docs(pack, config, preset, project_dir, report, all_docs=bool(opts.get("allDocs")))
    generate(pack, config, preset, project_dir, tools, bool(opts.get("force")), report)
    _print(report, project_dir)
    print(f'\nInitialised {config["project"]} with preset "{preset["id"]}" for: {", ".join(tools)}.')
    print("Next: open your assistant in this folder and run /crew-status (or /crew-brainstorm for a new idea).")
    return 0


def _sync(project_dir: Path, opts) -> int:
    pack = load_pack()
    config = _read_config(project_dir)
    if not config:
        raise SystemExit(f"anycrew: no {CONFIG_REL} here; run `anycrew init` first")
    preset = load_preset(pack, config["preset"])
    tools = _resolve_tools(opts["tools"], project_dir) if opts.get("tools") else config["tools"]
    report = Report()
    generate(pack, config, preset, project_dir, tools, bool(opts.get("force")), report)
    _print(report, project_dir)
    return 0


def _print(report: Report, project_dir: Path) -> None:
    def rel(p: str) -> str:
        try:
            return str(Path(p).relative_to(project_dir)) or p
        except ValueError:
            return p

    if report.written:
        print(f"Written ({len(report.written)}):")
        for p in report.written:
            print(f"  + {rel(p)}")
    if report.unchanged:
        print(f"Unchanged: {len(report.unchanged)} file(s)")
    if report.skipped:
        print("Skipped:")
        for p, why in report.skipped:
            print(f"  ! {rel(p)} — {why}")
    for n in report.notes:
        print(f"  · {n}")


def _doctor(project_dir: Path) -> int:
    pack = load_pack()
    config = _read_config(project_dir)
    d = _detect(project_dir)
    print(f"anycrew {pack.version} · project: {project_dir}")
    print(f"config: {CONFIG_REL} (preset {config['preset']}; tools {', '.join(config['tools'])})" if config else "config: none — run `anycrew init`")
    print("\nAssistant      CLI    Files in repo   Reads")
    for t in TOOLS:
        print(f"{t:<14} {('yes' if d[t]['cli'] else 'no'):<6} {('yes' if d[t]['dir'] else 'no'):<15} {d[t]['reads']}")
    checks = [("AGENTS.md", "AGENTS.md"), ("docs/00-constitution.md", "docs/00-constitution.md"),
              ("docs/20-implementation-status.md", "docs/20-implementation-status.md"),
              (".agents/skills", ".agents/skills"), (".anycrew/hooks/lint-after-edit.sh", ".anycrew/hooks/lint-after-edit.sh")]
    print("\nProject files")
    for name, p in checks:
        print(f"  {'✔' if (project_dir / p).exists() else '✘'} {name}")
    if config and config.get("commands", {}).get("check"):
        print(f"\nCheck command: {config['commands']['check']}")
    return 0


def _list(project_dir: Path) -> int:
    pack = load_pack()
    config = _read_config(project_dir) or {}
    over = config.get("models", {})

    def cell(tool, tier):
        m = model_for(pack.models, over, tool, tier)
        if m is None or m == "":
            return "inherit"
        if isinstance(m, dict):
            return "/".join(x for x in [m.get("model"), m.get("effort") or m.get("model_reasoning_effort")] if x) or "inherit"
        return str(m)

    head = ["agent", "tier", *TOOLS]
    rows = [[a.id, a.data["tier"], *[cell(t, a.data["tier"]) for t in TOOLS]] for a in pack.agents]
    widths = [max(len(h), *(len(str(r[i])) for r in rows)) for i, h in enumerate(head)]
    line = lambda r: "  ".join(str(c).ljust(widths[i]) for i, c in enumerate(r))  # noqa: E731
    print(line(head))
    print("  ".join("-" * w for w in widths))
    for r in rows:
        print(line(r))
    print("\nTiers: " + "\n       ".join(f"{t} = {pack.models['tiers'][t]['purpose']}" for t in TIERS))
    print(f"Skills ({len(pack.skills)}): " + " ".join("/" + s.id for s in pack.skills))
    return 0


def _styles() -> int:
    pack = load_pack()
    for sid, st in pack.architectures["styles"].items():
        print(f"{sid:<18} {st['name']}\n{'':<18} choose when: {st['choose_when']}\n{'':<18} avoid when:  {st['avoid_when']}")
    print(f"\ndefault: {pack.architectures['default']}")
    return 0


def _presets() -> int:
    pack = load_pack()
    for p in pack.presets.values():
        print(f"{p['id']:<24} {p['name']}\n{'':<24} {p['description']}")
    return 0
