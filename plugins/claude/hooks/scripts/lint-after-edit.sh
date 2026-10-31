#!/usr/bin/env bash
# anycrew lint-after-edit hook. Tool-agnostic: reads the hook payload (JSON) from stdin, finds the
# edited file in whichever key the assistant uses, and runs the linter for its language.
#   *.py            → ruff check --fix (project venv or PATH)
#   *.ts *.tsx *.js → eslint --fix when an eslint config exists
#   *.go            → gofmt -l + go vet on the package
# Exit 2 + stderr reports problems to the agent (Claude Code semantics); exit 0 is silent.
# Unused-import diagnostics are ignored: an import added one edit before its first use must not be
# stripped. The project's check command still catches them.
set -u

payload="$(cat 2>/dev/null || true)"
root="${CLAUDE_PROJECT_DIR:-${CURSOR_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}}"

extract_path() {
  # Try the keys used by Claude Code, Cursor, Copilot and Antigravity payloads.
  if command -v node >/dev/null 2>&1; then
    printf '%s' "$payload" | node -e '
      let s=""; process.stdin.on("data",d=>s+=d).on("end",()=>{
        let j={}; try{ j=JSON.parse(s||"{}") }catch(e){}
        const c=[j.tool_response?.filePath, j.tool_input?.file_path, j.tool_input?.filePath,
                 j.file_path, j.filePath, j.toolArgs?.file_path, j.toolArgs?.path,
                 j.toolInput?.file_path, j.input?.file_path, j.path];
        const p=c.find(x=>typeof x==="string"&&x.length); if(p) process.stdout.write(p);
      });'
  elif command -v jq >/dev/null 2>&1; then
    printf '%s' "$payload" | jq -r '.tool_response.filePath // .tool_input.file_path // .file_path // .filePath // .toolArgs.file_path // empty' 2>/dev/null
  fi
}

f="$(extract_path)"
[ -n "$f" ] || exit 0
case "$f" in /*) ;; *) f="$root/$f" ;; esac
[ -f "$f" ] || exit 0

case "$f" in
  *.py)
    ruff=""
    for cand in "$root/backend/.venv/bin/ruff" "$root/.venv/bin/ruff"; do [ -x "$cand" ] && ruff="$cand" && break; done
    [ -n "$ruff" ] || ruff="$(command -v ruff 2>/dev/null || true)"
    [ -n "$ruff" ] || exit 0
    if ! out="$("$ruff" check --fix --quiet --ignore F401 "$f" 2>&1)"; then
      printf 'ruff check %s:\n%s\n' "${f#"$root"/}" "$out" >&2; exit 2
    fi ;;
  *.ts|*.tsx|*.js|*.jsx|*.mjs)
    dir="$(dirname "$f")"; eslint=""
    while [ "$dir" != "/" ]; do
      if ls "$dir"/eslint.config.* "$dir"/.eslintrc* >/dev/null 2>&1; then
        [ -x "$dir/node_modules/.bin/eslint" ] && eslint="$dir/node_modules/.bin/eslint" && break
      fi
      dir="$(dirname "$dir")"
    done
    [ -n "$eslint" ] || exit 0
    if ! out="$(cd "$dir" && "$eslint" --fix "$f" 2>&1)"; then
      printf 'eslint %s:\n%s\n' "${f#"$root"/}" "$(printf '%s\n' "$out" | head -30)" >&2; exit 2
    fi ;;
  *.go)
    command -v gofmt >/dev/null 2>&1 || exit 0
    unformatted="$(gofmt -l "$f")"
    vet="$(cd "$(dirname "$f")" && go vet . 2>&1 || true)"
    if [ -n "$unformatted" ] || [ -n "$vet" ]; then
      printf 'go: %s\n%s\n%s\n' "${f#"$root"/}" "${unformatted:+gofmt: not formatted}" "$vet" >&2; exit 2
    fi ;;
esac
exit 0
