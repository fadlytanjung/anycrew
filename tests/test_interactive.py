"""Drives `anycrew init` through a pseudo-terminal for both CLIs and checks that the answers (assistants,
preset, name, purpose, architecture style) are honoured: only the chosen assistants are generated and
ADR-001 carries the chosen style. Run: python3 tests/test_interactive.py

An answer is sent only when the last line of output is one of init's real questions (a pty may deliver a
heading that ends with ":" as its own chunk; Node's readline drops input that arrives before a question is
asked, so answering a heading would leave the last question unanswered and the child waiting forever).
The child is killed after an idle or overall deadline so a regression fails instead of hanging CI."""
from __future__ import annotations

import json
import os
import pty
import re
import select
import signal
import sys
import tempfile
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ANSWERS = ["claude,antigravity", "go-service", "event-driven", "itest", "A pseudo-terminal test."]
PROMPT = re.compile(r"(Which assistants|Stack preset|Architecture style|Project name|One-sentence purpose)[^\n]*: ?$")
ANSI = re.compile(r"\x1b\[[0-9;?]*[A-Za-z]")  # readline moves the cursor after the prompt text
IDLE_SECONDS, TOTAL_SECONDS = 30, 120


def drive(cmd: list[str], cwd: str) -> str:
    pid, fd = pty.fork()
    if pid == 0:
        os.chdir(cwd)
        os.environ["PYTHONPATH"] = str(ROOT / "src")
        os.execvp(cmd[0], cmd)
    out, i, start = b"", 0, time.time()
    last = start
    killed = False
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
            tail = ANSI.sub("", out.decode(errors="replace")).replace("\r", "").rstrip(" ")
            if i < len(ANSWERS) and PROMPT.search(tail.split("\n")[-1]):
                time.sleep(0.2)
                os.write(fd, (ANSWERS[i] + "\n").encode())
                out += b"\n"  # so the answered prompt is no longer the last line
                i += 1
        elif time.time() - last > IDLE_SECONDS or time.time() - start > TOTAL_SECONDS:
            killed = True
            os.kill(pid, signal.SIGKILL)
            break
    os.waitpid(pid, 0)
    text = out.decode(errors="replace")
    return text + ("\n[test killed the child: no prompt answered for %ss]" % IDLE_SECONDS if killed else "")


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
                    "not killed": "[test killed" not in out,
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
