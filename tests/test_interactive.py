"""Drives `anycrew init` through a pseudo-terminal for both CLIs and checks that the answers (assistants,
preset, name, purpose, architecture style) are honoured: only the chosen assistants are generated and
ADR-001 carries the chosen style. Run: python3 tests/test_interactive.py"""
from __future__ import annotations

import json
import os
import pty
import select
import sys
import tempfile
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ANSWERS = ["claude,antigravity", "go-service", "event-driven", "itest", "A pseudo-terminal test."]


def drive(cmd: list[str], cwd: str) -> str:
    pid, fd = pty.fork()
    if pid == 0:
        os.chdir(cwd)
        os.environ["PYTHONPATH"] = str(ROOT / "src")
        os.execvp(cmd[0], cmd)
    out, i, last = b"", 0, time.time()
    while True:
        r, _, _ = select.select([fd], [], [], 0.5)
        if r:
            try:
                chunk = os.read(fd, 4096)
            except OSError:
                break
            if not chunk:
                break
            out += chunk
            last = time.time()
            if chunk.rstrip().endswith(b":") and i < len(ANSWERS):
                time.sleep(0.2)
                os.write(fd, (ANSWERS[i] + "\n").encode())
                i += 1
        elif time.time() - last > 30:
            break
    os.waitpid(pid, 0)
    return out.decode(errors="replace")


def main() -> int:
    failures = 0
    for label, cmd in (("node", ["node", str(ROOT / "bin" / "anycrew.mjs"), "init"]),
                       ("python", [sys.executable, "-m", "anycrew", "init"])):
        with tempfile.TemporaryDirectory() as d:
            out = drive(cmd, d)
            cfg = Path(d) / ".anycrew" / "config.json"
            ok = cfg.exists()
            if ok:
                c = json.loads(cfg.read_text())
                checks = {
                    "tools": c["tools"] == ["claude", "antigravity"],
                    "preset": c["preset"] == "go-service",
                    "name": c["project"] == "itest",
                    "style": c["architecture"]["style"] == "event-driven",
                    "only chosen dirs": sorted(p.name for p in Path(d).iterdir() if p.name.startswith(".")) == [".agents", ".anycrew", ".claude"],
                    "adr-001": "Event-driven" in (Path(d) / "docs/adr/ADR-001-architecture-style.md").read_text(),
                    "asked architecture": "Architecture style" in out,
                }
                bad = [k for k, v in checks.items() if not v]
                ok = not bad
            if ok:
                print(f"ok  {label}")
            else:
                failures += 1
                print(f"FAIL {label}: {bad if cfg.exists() else 'no config written'}\n{out[-800:]}")
    print("interactive: all good" if not failures else f"{failures} failure(s)")
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
