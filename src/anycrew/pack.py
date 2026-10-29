"""Loads the canonical pack (agents, skills, rules, presets, models, templates)."""
from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from .frontmatter import parse

TOOLS = ["claude", "codex", "antigravity", "cursor", "opencode", "copilot"]
TIERS = ["fast", "balanced", "strong"]


def pack_root() -> Path:
    """The installed wheel carries the pack under anycrew/pack/; a checkout uses the repo root."""
    here = Path(__file__).resolve().parent
    if (here / "pack" / "models.json").exists():
        return here / "pack"
    return here.parent.parent


@dataclass
class Item:
    id: str
    data: dict[str, Any]
    body: str
    dir: Path | None = None
    raw: str = ""


@dataclass
class Pack:
    root: Path
    version: str
    models: dict[str, Any]
    agents: list[Item]
    skills: list[Item]
    rules: list[Item]
    presets: dict[str, dict[str, Any]]
    docs_templates: list[tuple[str, str]]
    hook_script: str

    def template(self, rel: str) -> str:
        return (self.root / "templates" / rel).read_text(encoding="utf-8")


def _md_items(d: Path) -> list[Item]:
    items = []
    for f in sorted(d.glob("*.md")):
        data, body = parse(f.read_text(encoding="utf-8"))
        items.append(Item(id=f.stem, data=data, body=body.strip() + "\n"))
    return items


def load_pack() -> Pack:
    root = pack_root()
    pkg = json.loads((root / "package.json").read_text(encoding="utf-8"))
    models = json.loads((root / "models.json").read_text(encoding="utf-8"))
    skills = []
    for d in sorted(p for p in (root / "skills").iterdir() if p.is_dir()):
        raw = (d / "SKILL.md").read_text(encoding="utf-8") if (d / "SKILL.md").exists() else ""
        data, body = parse(raw)
        skills.append(Item(id=d.name, data=data, body=body.strip() + "\n", dir=d, raw=raw))
    presets = {}
    for f in sorted((root / "presets").glob("*.json")):
        p = json.loads(f.read_text(encoding="utf-8"))
        presets[p["id"]] = p
    docs_root = root / "templates" / "docs"
    docs = [(str(f.relative_to(docs_root)), f.read_text(encoding="utf-8")) for f in sorted(docs_root.rglob("*")) if f.is_file()]
    hook = (root / "hooks" / "scripts" / "lint-after-edit.sh").read_text(encoding="utf-8")
    return Pack(root, pkg["version"], models, _md_items(root / "agents"), skills, _md_items(root / "rules"), presets, docs, hook)


def model_for(models: dict, overrides: dict | None, tool: str, tier: str) -> Any:
    over = (overrides or {}).get(tool, {}).get(tier)
    if over is not None:
        return over
    return models.get("tools", {}).get(tool, {}).get(tier)


def load_preset(pack: Pack, id_or_path: str | None) -> dict[str, Any]:
    if not id_or_path:
        return pack.presets["generic"]
    if id_or_path in pack.presets:
        return pack.presets[id_or_path]
    if Path(id_or_path).exists():
        return json.loads(Path(id_or_path).read_text(encoding="utf-8"))
    raise SystemExit(f'anycrew: unknown preset "{id_or_path}" (available: {", ".join(pack.presets)})')
