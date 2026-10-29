"""Proves the Python and Node CLIs generate byte-identical projects, and that the Python CLI is
idempotent and protects hand-written files. Run: python3 tests/test_parity.py"""
from __future__ import annotations

import filecmp
import os
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PY = [sys.executable, "-m", "anycrew"]
NODE = ["node", str(ROOT / "bin" / "anycrew.mjs")]
ENV = {**os.environ, "PYTHONPATH": str(ROOT / "src")}


def run(cmd, *args, cwd=None):
    return subprocess.run([*cmd, *args], check=True, capture_output=True, text=True, env=ENV, cwd=cwd).stdout


def tree(d: Path):
    return sorted(str(p.relative_to(d)) for p in d.rglob("*") if p.is_file())


def diff_dirs(a: Path, b: Path) -> list[str]:
    ta, tb = tree(a), tree(b)
    out = [f"only in python: {p}" for p in ta if p not in tb] + [f"only in node: {p}" for p in tb if p not in ta]
    for p in ta:
        if p in tb and not filecmp.cmp(a / p, b / p, shallow=False):
            out.append(f"differs: {p}")
    return out


def main() -> int:
    failures = 0
    presets = [p.stem for p in (ROOT / "presets").glob("*.json")]
    for preset in presets:
        with tempfile.TemporaryDirectory() as tmp:
            a, b = Path(tmp) / "py", Path(tmp) / "node"
            a.mkdir(); b.mkdir()
            args = ["init", "--preset", preset, "--tools", "all", "--name", "smoke", "--purpose", "Parity check."]
            run(PY, *args, "--dir", str(a))
            run(NODE, *args, "--dir", str(b))
            d = diff_dirs(a, b)
            if d:
                failures += 1
                print(f"FAIL parity {preset}:\n  " + "\n  ".join(d))
            # idempotent sync
            out = run(PY, "sync", "--dir", str(a))
            if "Written (" in out:
                failures += 1
                print(f"FAIL {preset}: second python sync wrote files\n{out}")
            # protection
            custom = a / ".claude" / "agents" / "scout.md"
            custom.write_text("---\nname: scout\ndescription: mine\n---\nmine\n")
            out = run(PY, "sync", "--dir", str(a))
            if "Skipped:" not in out or "mine" not in custom.read_text():
                failures += 1
                print(f"FAIL {preset}: hand-written file not preserved")
            print(f"ok  {preset}")
    for cmd in (["list"], ["presets"], ["--version"]):
        if run(PY, *cmd) != run(NODE, *cmd):
            failures += 1
            print(f"FAIL output differs for {cmd}")
    print("parity: all good" if not failures else f"{failures} failure(s)")
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
