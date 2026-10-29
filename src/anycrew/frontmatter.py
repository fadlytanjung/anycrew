"""Minimal YAML front matter reader/writer, a line-for-line port of lib/frontmatter.mjs.

Supports scalars, quoted strings, inline arrays ([a, b]), block lists (- item) and one level of
nested maps. That is all anycrew's own files use; it is not a general YAML parser.
"""
from __future__ import annotations

import json
import re
from typing import Any

_FM = re.compile(r"^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$")
_KV = re.compile(r"^([A-Za-z0-9_-]+):\s*(.*)$")
_SUB = re.compile(r"^\s*([A-Za-z0-9_-]+):\s*(.*)$")


def parse(text: str) -> tuple[dict[str, Any], str]:
    m = _FM.match(text)
    if not m:
        return {}, text
    data: dict[str, Any] = {}
    lines = m.group(1).split("\n")
    lines = [l.rstrip("\r") for l in lines]
    i = 0
    while i < len(lines):
        line = lines[i]
        if not line.strip() or line.strip().startswith("#"):
            i += 1
            continue
        kv = _KV.match(line)
        if not kv:
            i += 1
            continue
        key, raw = kv.group(1), kv.group(2).strip()
        if raw in ("", "|", ">-", ">", "|-"):
            block: list[str] = []
            i += 1
            while i < len(lines) and (re.match(r"^\s+\S", lines[i]) or lines[i].strip() == ""):
                block.append(lines[i])
                i += 1
            non_empty = [l for l in block if l.strip()]
            if raw == "" and all(re.match(r"^\s*-\s", l) for l in non_empty):
                data[key] = [scalar(re.sub(r"^\s*-\s*", "", l)) for l in non_empty]
            elif raw == "" and all(_SUB.match(l) for l in non_empty):
                obj: dict[str, Any] = {}
                for l in non_empty:
                    s = _SUB.match(l)
                    obj[s.group(1)] = scalar(s.group(2))
                data[key] = obj
            else:
                joined = [l.strip() for l in non_empty]
                data[key] = "\n".join(joined) if raw.startswith("|") else " ".join(joined)
            continue
        data[key] = scalar(raw)
        i += 1
    return data, m.group(2)


def scalar(raw: str) -> Any:
    raw = raw.strip()
    if re.match(r"^\[.*\]$", raw):
        inner = raw[1:-1].strip()
        return [scalar(s) for s in inner.split(",")] if inner else []
    if re.match(r'^"(.*)"$', raw):
        return raw[1:-1].replace('\\"', '"')
    if re.match(r"^'(.*)'$", raw):
        return raw[1:-1].replace("''", "'")
    if raw == "true":
        return True
    if raw == "false":
        return False
    if raw in ("null", "~"):
        return None
    return raw


def stringify(data: dict[str, Any], body: str = "") -> str:
    out = ["---"]
    for k, v in data.items():
        if v is None or v == "":
            continue
        if isinstance(v, list):
            if not v:
                continue
            out.append(f"{k}:")
            for item in v:
                out.append(f"  - {_q(item)}")
        elif isinstance(v, dict):
            out.append(f"{k}:")
            for sk, sv in v.items():
                out.append(f"  {sk}: {_q(sv)}")
        else:
            out.append(f"{k}: {_q(v)}")
    out.append("---")
    body = body[1:] if body.startswith("\n") else body
    return "\n".join(out) + "\n" + body


def _q(v: Any) -> str:
    if isinstance(v, bool):
        return "true" if v else "false"
    if isinstance(v, (int, float)):
        return str(v)
    s = str(v)
    if (
        re.match(r"^[A-Za-z0-9_./*-][^:#\"'\n]*$", s)
        and not re.search(r"\s{2,}", s)
        and s not in ("true", "false", "null", "~")
    ):
        return s
    return json.dumps(s, ensure_ascii=False)
