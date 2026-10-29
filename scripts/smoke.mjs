// End-to-end smoke test: init a temp project for every preset with every tool, sync twice
// (second run must be a no-op), and assert the expected files and protections.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { PACK_ROOT, loadPack } from '../lib/pack.mjs';

const bin = path.join(PACK_ROOT, 'bin', 'anycrew.mjs');
const pack = loadPack();
let failures = 0;
const must = (cond, msg) => { if (!cond) { failures++; console.error(`FAIL ${msg}`); } };

for (const preset of Object.keys(pack.presets)) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `anycrew-smoke-${preset}-`));
  const run = (args) => execFileSync('node', [bin, ...args, '--dir', dir], { encoding: 'utf8' });
  const out = run(['init', '--preset', preset, '--tools', 'all', '--name', 'smoke']);
  must(/Initialised smoke/.test(out), `${preset}: init output`);
  const expect = [
    'AGENTS.md', 'CLAUDE.md', '.anycrew/config.json', '.anycrew/hooks/lint-after-edit.sh',
    'docs/00-constitution.md', 'docs/20-implementation-status.md', 'docs/specs/README.md',
    '.agents/rules/00-sdd-process.md', '.agents/skills/crew-status/SKILL.md', '.agents/agents/scout.md', '.agents/hooks.json',
    '.claude/agents/scout.md', '.claude/skills/crew-status/SKILL.md', '.claude/rules/00-sdd-process.md', '.claude/settings.json',
    '.codex/agents/scout.toml', '.cursor/rules/00-sdd-process.mdc', '.cursor/agents/scout.md', '.cursor/hooks.json',
    '.opencode/agents/scout.md', '.github/copilot-instructions.md', '.github/agents/scout.agent.md', '.github/hooks/anycrew.json',
  ];
  for (const f of expect) must(fs.existsSync(path.join(dir, f)), `${preset}: missing ${f}`);
  const p = pack.presets[preset];
  if (p.backend_conventions?.length && p.rules.backend_globs?.length) {
    must(fs.existsSync(path.join(dir, '.agents/rules/20-backend.md')), `${preset}: backend rule`);
    must(fs.existsSync(path.join(dir, '.github/instructions/20-backend.instructions.md')), `${preset}: copilot backend instructions`);
  }
  const claudeScout = fs.readFileSync(path.join(dir, '.claude/agents/scout.md'), 'utf8');
  must(/^model: haiku$/m.test(claudeScout), `${preset}: claude scout model haiku`);
  must(/^effort: low$/m.test(claudeScout), `${preset}: claude scout effort low`);
  const agyLead = fs.readFileSync(path.join(dir, '.agents/agents/crew-lead.md'), 'utf8');
  must(/^model: pro$/m.test(agyLead), `${preset}: antigravity crew-lead model pro`);
  const codexLead = fs.readFileSync(path.join(dir, '.codex/agents/crew-lead.toml'), 'utf8');
  must(/model_reasoning_effort = "high"/.test(codexLead), `${preset}: codex crew-lead effort high`);
  const settings = JSON.parse(fs.readFileSync(path.join(dir, '.claude/settings.json'), 'utf8'));
  must(settings.hooks?.PostToolUse?.length === 1, `${preset}: claude hook merged once`);
  const second = run(['sync']);
  must(!/Written \(/.test(second), `${preset}: second sync wrote files:\n${second}`);
  const custom = path.join(dir, '.claude/agents/scout.md');
  fs.writeFileSync(custom, '---\nname: scout\ndescription: mine\n---\nmine\n');
  const third = run(['sync']);
  must(/Skipped:/.test(third) && fs.readFileSync(custom, 'utf8').includes('mine'), `${preset}: hand-written file preserved`);
  fs.writeFileSync(path.join(dir, 'AGENTS.md'), '# mine\n');
  run(['sync']);
  must(fs.readFileSync(path.join(dir, 'AGENTS.md'), 'utf8') === '# mine\n', `${preset}: AGENTS.md preserved`);
  fs.rmSync(dir, { recursive: true, force: true });
  console.log(`ok  ${preset}`);
}
console.log(failures ? `${failures} failure(s)` : 'smoke: all good');
process.exit(failures ? 1 : 0);
