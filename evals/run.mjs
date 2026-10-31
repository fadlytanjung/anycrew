#!/usr/bin/env node
// anycrew end-to-end eval harness. See evals/README.md.
//   node evals/run.mjs --suite lifecycle --runner claude|agy [--judge claude|agy|gemini|none] [--dir <path>] [--until <stepId>] [--from <stepId>] [--keep] [--budget 5] [--step-timeout 45] [--use-api-key]
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = parse(process.argv.slice(2));
const suiteId = args.suite ?? 'lifecycle';
const runner = args.runner ?? 'claude';           // claude | agy
const judgeWith = args.judge ?? (runner === 'agy' ? 'agy' : 'claude');   // claude | agy | gemini | none
const suite = JSON.parse(fs.readFileSync(path.join(ROOT, 'evals', 'cases', `${suiteId}.json`), 'utf8'));
const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const reportDir = path.join(ROOT, 'evals', 'reports', `${stamp}-${suiteId}-${runner}`);
fs.mkdirSync(reportDir, { recursive: true });
const projectDir = path.resolve(args.dir ?? fs.mkdtempSync(path.join(os.tmpdir(), `anycrew-eval-${suiteId}-`)));
const budgetPerStep = Number(args.budget ?? 6);
const stepTimeoutMs = Number(args.stepTimeout ?? 45) * 60 * 1000;   // minutes; a hung API call must not block the suite
const log = (...a) => { const line = a.join(' '); console.log(line); fs.appendFileSync(path.join(reportDir, 'run.log'), line + '\n'); };

log(`anycrew eval · suite ${suiteId} · runner ${runner}\nproject: ${projectDir}\nreport:  ${reportDir}`);

// Claude Code prefers ANTHROPIC_API_KEY over the claude.ai login when both exist. The eval uses the
// login (your subscription) unless --use-api-key is passed, so a stray key with no credit cannot
// silently break every step.
const ENV = { ...process.env, CLAUDE_PROJECT_DIR: projectDir };
if (!args.useApiKey) { delete ENV.ANTHROPIC_API_KEY; delete ENV.ANTHROPIC_AUTH_TOKEN; }
delete ENV.CLAUDECODE; delete ENV.CLAUDE_CODE_ENTRYPOINT;

// 0. Preflight: one cheap call per engine in use must succeed before any step runs.
for (const engine of new Set([runner, judgeWith].filter((e) => e !== 'none'))) {
  if (engine === 'gemini') {
    const g = geminiAsk('Reply with the single word OK.');
    if (!/OK/i.test(g.text)) { log(`preflight failed for gemini: ${g.error ?? g.text.slice(0, 200)}`); fs.rmSync(reportDir, { recursive: true, force: true }); process.exit(2); }
    log(`preflight ok: gemini (${GEMINI_MODEL})`); continue;
  }
  const r = engine === 'agy'
    ? spawnSync('agy', ['-p', 'Reply with the single word OK.', '--output-format', 'json'], { encoding: 'utf8', env: ENV, cwd: os.tmpdir() })
    : spawnSync('claude', ['-p', 'Reply with the single word OK.', '--output-format', 'json', '--max-turns', '1', '--no-session-persistence'], { encoding: 'utf8', env: ENV, cwd: os.tmpdir() });
  let j = null; try { j = JSON.parse(r.stdout); } catch {}
  const text = j?.result ?? j?.response ?? '';
  if (r.status !== 0 || j?.is_error || j?.status === 'FAILED' || !/OK/i.test(text)) {
    log(`preflight failed for ${engine}: ${(text || r.stderr || r.stdout || '').toString().slice(0, 300)}`);
    fs.rmSync(reportDir, { recursive: true, force: true });
    process.exit(2);
  }
  log(`preflight ok: ${engine}`);
}

// 1. Initialise the project with the local anycrew (the same files users get).
if (!fs.existsSync(path.join(projectDir, '.anycrew', 'config.json'))) {
  fs.mkdirSync(projectDir, { recursive: true });
  sh('git', ['init', '-q'], projectDir);
  sh('git', ['config', 'user.email', 'eval@anycrew.local'], projectDir);
  sh('git', ['config', 'user.name', 'anycrew eval'], projectDir);
  const p = suite.project;
  log(sh('node', [path.join(ROOT, 'bin', 'anycrew.mjs'), 'init', '--preset', p.preset, '--tools', runner === 'agy' ? 'antigravity' : 'claude', '--name', p.name, '--purpose', p.purpose, ...(p.architecture ? ['--architecture', p.architecture] : [])], projectDir).split('\n').slice(-2).join('\n'));
  sh('git', ['add', '-A'], projectDir);
  sh('git', ['commit', '-q', '-m', 'chore: anycrew init'], projectDir);
}

// 2. Run the steps.
const results = [];
let started = !args.from;
for (const step of suite.steps) {
  if (!started) { if (step.id === args.from) started = true; else continue; }
  log(`\n=== ${step.id} ===`);
  if (step.setup) {
    const su = spawnSync('sh', ['-c', step.setup], { cwd: projectDir, encoding: 'utf8', timeout: 600000, env: ENV });
    if (su.status !== 0) log(`  setup failed (exit ${su.status}): ${(su.stdout + su.stderr).trim().slice(-300)}`);
  }
  const t0 = Date.now();
  const run = runStep(step);
  const seconds = Math.round((Date.now() - t0) / 1000);
  fs.writeFileSync(path.join(reportDir, `${step.id}.reply.md`), run.reply);
  const checks = step.checks.map((c) => ({ ...c, ...check(c) }));
  const judge = step.judge ? judgeStep(step, run.reply) : null;
  const checksOk = checks.filter((c) => c.ok).length;
  const pass = checksOk === checks.length && (judge ? judge.score >= 3 : true);
  const r = { id: step.id, pass, checks: `${checksOk}/${checks.length}`, judge: judge?.score ?? null, judgeWhy: judge?.reason ?? null, costUsd: run.cost, turns: run.turns, seconds, error: run.error, failing: checks.filter((c) => !c.ok).map((c) => c.detail) };
  results.push(r);
  fs.writeFileSync(path.join(reportDir, `${step.id}.json`), JSON.stringify({ step, run: { ...run, reply: undefined }, checks, judge }, null, 2));
  log(`${pass ? 'PASS' : 'FAIL'}  checks ${r.checks}  judge ${r.judge ?? '-'}  $${run.cost?.toFixed(2) ?? '?'}  ${run.turns ?? '?'} turns  ${seconds}s${run.error ? '\n  error: ' + run.error : ''}${r.failing.length ? '\n  ' + r.failing.join('\n  ') : ''}${judge ? '\n  judge: ' + judge.reason : ''}`);
  writeSummary(results);
  if (args.until === step.id) break;
}

// 3. Snapshot the project tree for inspection.
try { fs.cpSync(projectDir, path.join(reportDir, 'project'), { recursive: true, filter: (s) => !/node_modules|\.venv|\.git$|__pycache__|\.pytest_cache|\.ruff_cache|dist/.test(s) }); } catch {}
if (!args.keep && !args.dir) { log(`\n(project kept at ${projectDir}; delete it when done)`); }
log(`\nreport: ${reportDir}/summary.md`);
try { execFileSync('node', [path.join(ROOT, 'scripts', 'eval-latest.mjs'), suiteId, runner], { stdio: 'ignore' }); log(`latest per step: ${path.join(ROOT, 'evals', 'reports', `LATEST-${suiteId}-${runner}.md`)}`); } catch {}
process.exit(results.every((r) => r.pass) ? 0 : 1);

// ---------------------------------------------------------------------------
function runStep(step) {
  if (runner === 'agy') return runAgy(step.prompt, { cwd: projectDir });
  const cmd = ['claude', '-p', step.prompt, '--output-format', 'json', '--permission-mode', 'acceptEdits',
    '--allowedTools', 'Read,Write,Edit,MultiEdit,Glob,Grep,Bash,Agent,TodoWrite,WebSearch,WebFetch',
    '--max-turns', String(step.maxTurns ?? 60), '--max-budget-usd', String(budgetPerStep), '--no-session-persistence'];
  const res = spawnSync(cmd[0], cmd.slice(1), { cwd: projectDir, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, env: ENV, timeout: stepTimeoutMs, killSignal: 'SIGKILL' });
  let json = null;
  try { json = JSON.parse(res.stdout); } catch { /* text fallback */ }
  const timedOut = res.error?.code === 'ETIMEDOUT' || res.signal === 'SIGKILL';
  const reply = json?.result ?? res.stdout ?? '';
  const error = timedOut ? `step timed out after ${stepTimeoutMs / 60000} min (killed)` : res.status ? `exit ${res.status}: ${(res.stderr || json?.result || '').toString().slice(0, 400)}` : (json?.is_error ? String(json.result).slice(0, 400) : null);
  return { reply: timedOut ? `(timed out)\n${reply}` : reply, cost: json?.total_cost_usd ?? null, turns: json?.num_turns ?? null, error };
}

function runAgy(prompt, { cwd }) {
  const res = spawnSync('agy', ['-p', prompt, '--output-format', 'json'], { cwd, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, env: ENV, timeout: stepTimeoutMs, killSignal: 'SIGKILL' });
  let json = null; try { json = JSON.parse(res.stdout); } catch {}
  const reply = json?.response ?? res.stdout ?? '';
  return { reply, cost: null, turns: json?.num_turns ?? null, tokens: json?.usage?.total_tokens ?? null, error: res.status || json?.status === 'FAILED' ? `exit ${res.status}: ${(json?.response ?? res.stderr ?? '').toString().slice(0, 400)}` : null };
}

// Gemini API judge (for CI, where no Google login exists): the harness bundles the project's docs,
// contracts, spec folders, git log and the reply into one prompt. Needs GEMINI_API_KEY.
const GEMINI_MODEL = process.env.GEMINI_JUDGE_MODEL ?? 'gemini-flash-latest';
function geminiAsk(prompt) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return { text: '', error: 'GEMINI_API_KEY is not set' };
  const body = JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { temperature: 0 } });
  const r = spawnSync('curl', ['-sS', '-X', 'POST', `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`, '-H', 'content-type: application/json', '-H', `x-goog-api-key: ${key}`, '--data-binary', '@-'], { input: body, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
  try { const j = JSON.parse(r.stdout); if (j.error) return { text: '', error: `${j.error.status}: ${j.error.message}` }; return { text: j.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') ?? '' }; }
  catch { return { text: '', error: (r.stderr || r.stdout || '').slice(0, 200) }; }
}
function bundleProject(reply) {
  const parts = [];
  let size = 0;
  const add = (label, text) => { if (size > 600_000) return; parts.push(`\n\n===== ${label} =====\n${text}`); size += text.length; };
  add('agent reply', reply);
  try { add('git log -5 --stat', execFileSync('git', ['log', '-5', '--stat'], { cwd: projectDir, encoding: 'utf8' })); } catch {}
  const walk = (rel) => { const abs = path.join(projectDir, rel); if (!fs.existsSync(abs)) return; for (const d of fs.readdirSync(abs, { withFileTypes: true })) { const r = path.join(rel, d.name); if (d.isDirectory()) { if (!/node_modules|\.venv|\.git$|assets/.test(d.name)) walk(r); } else if (/\.(md|ya?ml|json|toml|py|ts|tsx|txt|cfg|ini|Makefile)$|^Makefile$/.test(d.name) && fs.statSync(path.join(projectDir, r)).size < 60_000) add(r, fs.readFileSync(path.join(projectDir, r), 'utf8')); } };
  for (const top of ['docs', 'contracts', 'backend', 'frontend', 'Makefile', 'AGENTS.md', 'README.md']) { const abs = path.join(projectDir, top); if (fs.existsSync(abs)) (fs.statSync(abs).isDirectory() ? walk(top) : add(top, fs.readFileSync(abs, 'utf8'))); }
  return parts.join('');
}

function judgeStep(step, reply) {
  if (judgeWith === 'none') return null;
  if (judgeWith === 'gemini') {
    const g = geminiAsk(`You are grading the output of a coding agent step. The project's files, git log and the agent's final reply follow the rubric. Grade only from that material.\n\nRubric: ${step.judge}\n\nAnswer with exactly one line of JSON: {"score": <1-5>, "reason": "<one or two sentences naming the evidence>"}${bundleProject(reply)}`);
    const m = /\{\s*"score"\s*:\s*(\d)\s*,\s*"reason"\s*:\s*"([\s\S]*?)"\s*\}/.exec(g.text ?? '');
    return m ? { score: Number(m[1]), reason: m[2], by: 'gemini' } : { score: 0, reason: `judge gave no JSON: ${g.error ?? String(g.text).slice(0, 200)}`, by: 'gemini' };
  }
  const prompt = `You are grading the output of a coding agent step inside the project at the current directory. Read the files the rubric names (and the git log when it says so). The agent's final reply is in the file .anycrew-eval-reply.md. Do not change any file.\n\nRubric: ${step.judge}\n\nAnswer with exactly one line of JSON: {"score": <1-5>, "reason": "<one or two sentences naming the evidence>"}`;
  fs.writeFileSync(path.join(projectDir, '.anycrew-eval-reply.md'), reply);
  if (judgeWith === 'agy') {
    const r = runAgy(prompt + ' Read files only; do not edit, create or run anything that changes the project.', { cwd: projectDir });
    try { fs.unlinkSync(path.join(projectDir, '.anycrew-eval-reply.md')); } catch {}
    const m = /\{\s*"score"\s*:\s*(\d)\s*,\s*"reason"\s*:\s*"([\s\S]*?)"\s*\}/.exec(r.reply ?? '');
    return m ? { score: Number(m[1]), reason: m[2], by: 'agy' } : { score: 0, reason: `judge gave no JSON: ${String(r.reply).slice(0, 200)}`, by: 'agy' };
  }
  const res = spawnSync('claude', ['-p', prompt, '--output-format', 'json', '--permission-mode', 'plan', '--allowedTools', 'Read,Glob,Grep,Bash(git log:*),Bash(git show:*),Bash(git diff:*),Bash(make check:*)', '--max-turns', '30', '--max-budget-usd', '2', '--no-session-persistence'], { cwd: projectDir, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024, env: ENV });
  try { fs.unlinkSync(path.join(projectDir, '.anycrew-eval-reply.md')); } catch {}
  let text = res.stdout;
  try { text = JSON.parse(res.stdout).result ?? text; } catch {}
  const m = /\{\s*"score"\s*:\s*(\d)\s*,\s*"reason"\s*:\s*"([\s\S]*?)"\s*\}/.exec(text ?? '');
  return m ? { score: Number(m[1]), reason: m[2], by: 'claude' } : { score: 0, reason: `judge gave no JSON: ${String(text).slice(0, 200)}`, by: 'claude' };
}

function check(c) {
  const files = c.glob ? globSync(c.glob) : c.path ? [c.path] : [];
  try {
    if (c.type === 'exists') { const ok = fs.existsSync(path.join(projectDir, c.path)); return { ok, detail: ok ? '' : `missing ${c.path}` }; }
    if (c.type === 'absent') { const ok = !fs.existsSync(path.join(projectDir, c.path)); return { ok, detail: ok ? '' : `should not exist ${c.path}` }; }
    if (c.type === 'count') { const ok = files.length >= (c.min ?? 1); return { ok, detail: ok ? '' : `${c.glob}: ${files.length} < ${c.min}` }; }
    if (c.type === 'grep') {
      const re = new RegExp(c.pattern.replace(/^\(\?i\)/, ''), /^\(\?i\)/.test(c.pattern) ? 'i' : '');
      const ok = files.some((f) => fs.existsSync(path.join(projectDir, f)) && re.test(fs.readFileSync(path.join(projectDir, f), 'utf8')));
      return { ok, detail: ok ? '' : `${c.path ?? c.glob}: /${c.pattern}/ not found` };
    }
    if (c.type === 'cmd') {
      const r = spawnSync('sh', ['-c', c.run], { cwd: projectDir, encoding: 'utf8', timeout: 600000 });
      return { ok: r.status === 0, detail: r.status === 0 ? '' : `\`${c.run}\` exit ${r.status}: ${(r.stdout + r.stderr).trim().split('\n').slice(-3).join(' | ').slice(0, 300)}` };
    }
  } catch (e) { return { ok: false, detail: `${c.type}: ${e.message}` }; }
  return { ok: false, detail: `unknown check ${c.type}` };
}

function globSync(pattern) {
  const [dir, ...rest] = pattern.split('/');
  const walk = (base, parts) => {
    if (!parts.length) return [base];
    const [p, ...more] = parts;
    const re = new RegExp('^' + p.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$');
    let out = [];
    for (const d of fs.existsSync(path.join(projectDir, base)) ? fs.readdirSync(path.join(projectDir, base)) : []) if (re.test(d)) out = out.concat(walk(path.join(base, d), more));
    return out;
  };
  return walk('', [dir, ...rest]);
}

function writeSummary(results) {
  const rows = results.map((r) => `| ${r.id} | ${r.pass ? '✅' : '❌'} | ${r.checks} | ${r.judge ?? '-'} | ${r.costUsd != null ? '$' + r.costUsd.toFixed(2) : '-'} | ${r.turns ?? '-'} | ${r.seconds}s | ${(r.pass ? (r.judgeWhy ?? '') : (r.error ?? r.failing[0] ?? r.judgeWhy ?? '')).replace(/\|/g, '/').slice(0, 140)} |`);
  const total = results.reduce((n, r) => n + (r.costUsd ?? 0), 0);
  const md = `# anycrew eval · ${suiteId} · ${runner} · ${stamp}\n\nProject: \`${projectDir}\`\n\n| Step | Result | Checks | Judge | Cost | Turns | Time | Note |\n|---|---|---|---|---|---|---|---|\n${rows.join('\n')}\n\n**${results.filter((r) => r.pass).length}/${results.length} steps passed · total cost $${total.toFixed(2)}**\n`;
  fs.writeFileSync(path.join(reportDir, 'summary.md'), md);
  fs.writeFileSync(path.join(reportDir, 'summary.json'), JSON.stringify(results, null, 2));
}

function sh(cmd, a, cwd) { return execFileSync(cmd, a, { cwd, encoding: 'utf8' }); }
function parse(argv) { const o = {}; for (let i = 0; i < argv.length; i++) { const x = argv[i]; if (x.startsWith('--')) { const k = x.slice(2); const n = argv[i + 1]; if (n && !n.startsWith('--')) { o[k] = n; i++; } else o[k] = true; } } return o; }
