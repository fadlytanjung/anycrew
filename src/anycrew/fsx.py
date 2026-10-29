"""File helpers: generated-file marker, protected writes, reports."""
from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path

MARKER = "anycrew:generated"


@dataclass
class Report:
    written: list[str] = field(default_factory=list)
    unchanged: list[str] = field(default_factory=list)
    skipped: list[tuple[str, str]] = field(default_factory=list)
    notes: list[str] = field(default_factory=list)


def read_if(p: Path) -> str | None:
    try:
        return p.read_text(encoding="utf-8")
    except (FileNotFoundError, NotADirectoryError):
        return None


def write_generated(p: Path, content: str, report: Report, force: bool = False) -> bool:
    """Write a generated file. Refuses to overwrite a file that lacks the marker unless force."""
    current = read_if(p)
    if current is not None and MARKER not in current and not force:
        report.skipped.append((str(p), "exists and is not anycrew-generated (use --force)"))
        return False
    if current == content:
        report.unchanged.append(str(p))
        return True
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(content, encoding="utf-8")
    report.written.append(str(p))
    return True


def write_if_missing(p: Path, content: str, report: Report) -> bool:
    """Write a file only when it does not exist yet (hand-maintained docs)."""
    if p.exists():
        report.unchanged.append(str(p))
        return False
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(content, encoding="utf-8")
    report.written.append(str(p))
    return True


def chmod_x(p: Path) -> None:
    os.chmod(p, 0o755)
