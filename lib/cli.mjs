import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { loadPack, loadPreset, TOOLS, TIERS, modelFor } from './pack.mjs';
import { generate, scaffoldDocs } from './generate.mjs';
import { newReport, readIf, exists } from './fsx.mjs';

const CONFIG_REL = path.join('.anycrew', 'config.json');

const HELP = `anycrew — one crew of specialist agents for any coding assistant

Usage:
  anycrew init   [--preset <id|file>] [--tools a,b|all] [--name <project>] [--purpose "<text>"]
                 [--dir <path>] [--all-docs] [--force]
  anycrew sync   [--tools a,b|all] [--dir <path>] [--force]
  anycrew doctor [--dir <path>]
  anycrew list   [--dir <path>]
  anycrew presets
  anycrew --version | --help

Tools: ${TOOLS.join(', ')}   (default: the assistants detected on this machine or in the repo)
Presets: see \`anycrew presets\`.
`;

export async function main(argv) {
  const { cmd, opts } = parseArgs(argv);
  if (opts.version) { console.log(loadPack().version); return 0; }
  if (!cmd || opts.help || cmd === 'help') { console.log(HELP); return 0; }
  const projectDir = path.resolve(opts.dir ?? process.cwd());
  switch (cmd) {
    case 'init': return init(projectDir, opts);
    case 'sync': return sync(projectDir, opts);
    case 'doctor': return doctor(projectDir);
    case 'list': return list(projectDir);
    case 'presets': return presets();
    default: console.error(`unknown command "${cmd}"\n${HELP}`); return 2;
  }
}

function parseArgs(argv) {
  const opts = {}; let cmd = null;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const k = a.slice(2).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      const next = argv[i + 1];
      if (next !== undefined && !next.startsWith('--')) { opts[k] = next; i++; } else opts[k] = true;
    } else if (!cmd) cmd = a;
  }
  return { cmd, opts };
}

function readConfig(projectDir) {
  const txt = readIf(path.join(projectDir, CONFIG_REL));
  if (!txt) return null;
  return JSON.parse(txt);
}

function resolveTools(opt, projectDir) {
  if (opt === 'all') return [...TOOLS];
  if (typeof opt === 'string') {
    const list = opt.split(',').map((s) => s.trim()).filter(Boolean);
    const bad = list.filter((t) => !TOOLS.includes(t));
    if (bad.length) throw new Error(`unknown tool(s): ${bad.join(', ')} (known: ${TOOLS.join(', ')})`);
    return list;
  }
  const d = detect(projectDir);
  const found = TOOLS.filter((t) => d[t].cli || d[t].dir);
  return found.length ? found : ['claude', 'codex', 'antigravity'];
}

function detect(projectDir) {
  const has = (bin) => { try { execSync(`command -v ${bin}`, { stdio: 'ignore', shell: '/bin/sh' }); return true; } catch { return false; } };
  const dir = (p) => exists(path.join(projectDir, p));
  return {
    claude: { cli: has('claude'), dir: dir('.claude') || dir('CLAUDE.md'), reads: 'AGENTS.md/CLAUDE.md, .claude/{agents,skills,rules}, .claude/settings.json hooks' },
    codex: { cli: has('codex'), dir: dir('.codex'), reads: 'AGENTS.md, .agents/skills, .codex/agents/*.toml' },
    antigravity: { cli: has('agy'), dir: dir('.agents/agents') || dir('.agents/rules'), reads: 'AGENTS.md, .agents/{rules,skills,agents}, .agents/hooks.json' },
    cursor: { cli: has('cursor') || has('cursor-agent'), dir: dir('.cursor'), reads: 'AGENTS.md, .cursor/{rules,agents}, .agents/skills, .cursor/hooks.json' },
    opencode: { cli: has('opencode'), dir: dir('.opencode'), reads: 'AGENTS.md, .agents/skills, .opencode/agents' },
    copilot: { cli: has('copilot'), dir: dir('.github/copilot-instructions.md') || dir('.github/agents'), reads: '.github/copilot-instructions.md, .github/{instructions,agents,hooks}, .agents/skills' },
  };
}

async function init(projectDir, opts) {
  const pack = loadPack();
  const preset = loadPreset(pack, opts.preset);
  const existing = readConfig(projectDir);
  const tools = resolveTools(opts.tools, projectDir);
  const config = {
    $schema: 'https://raw.githubusercontent.com/fadlytanjung/anycrew/main/schemas/config.schema.json',
    version: 1,
    anycrew: pack.version,
    project: opts.name ?? existing?.project ?? path.basename(projectDir),
    purpose: opts.purpose ?? existing?.purpose ?? '',
    preset: preset.id,
    tools,
    commands: existing?.commands ?? { ...preset.commands },
    models: existing?.models ?? {},
    agents: existing?.agents ?? { exclude: [] },
    skills: existing?.skills ?? { exclude: [] },
    hooks: existing?.hooks ?? { lint_after_edit: preset.hooks?.lint_after_edit !== false },
  };
  fs.mkdirSync(path.join(projectDir, '.anycrew'), { recursive: true });
  fs.writeFileSync(path.join(projectDir, CONFIG_REL), JSON.stringify(config, null, 2) + '\n');
  const report = newReport();
  report.written.push(path.join(projectDir, CONFIG_REL));
  scaffoldDocs({ pack, config, preset, projectDir, report, all: !!opts.allDocs });
  generate({ pack, config, preset, projectDir, tools, force: !!opts.force, report });
  print(report, projectDir);
  console.log(`\nInitialised ${config.project} with preset "${preset.id}" for: ${tools.join(', ')}.`);
  console.log('Next: open your assistant in this folder and run /crew-status (or /crew-brainstorm for a new idea).');
  return 0;
}

async function sync(projectDir, opts) {
  const pack = loadPack();
  const config = readConfig(projectDir);
  if (!config) throw new Error(`no ${CONFIG_REL} here; run \`anycrew init\` first`);
  const preset = loadPreset(pack, config.preset);
  const tools = opts.tools ? resolveTools(opts.tools, projectDir) : config.tools;
  const report = newReport();
  generate({ pack, config, preset, projectDir, tools, force: !!opts.force, report });
  print(report, projectDir);
  return 0;
}

function print(report, projectDir) {
  const rel = (p) => path.relative(projectDir, p) || p;
  if (report.written.length) { console.log(`Written (${report.written.length}):`); for (const p of report.written) console.log(`  + ${rel(p)}`); }
  if (report.unchanged.length) console.log(`Unchanged: ${report.unchanged.length} file(s)`);
  if (report.skipped.length) { console.log('Skipped:'); for (const s of report.skipped) console.log(`  ! ${rel(s.path)} — ${s.reason}`); }
  for (const n of report.notes) console.log(`  · ${n}`);
}

async function doctor(projectDir) {
  const pack = loadPack();
  const config = readConfig(projectDir);
  const d = detect(projectDir);
  console.log(`anycrew ${pack.version} · project: ${projectDir}`);
  console.log(config ? `config: ${CONFIG_REL} (preset ${config.preset}; tools ${config.tools.join(', ')})` : `config: none — run \`anycrew init\``);
  console.log('\nAssistant      CLI    Files in repo   Reads');
  for (const t of TOOLS) {
    console.log(`${t.padEnd(14)} ${(d[t].cli ? 'yes' : 'no').padEnd(6)} ${(d[t].dir ? 'yes' : 'no').padEnd(15)} ${d[t].reads}`);
  }
  const checks = [
    ['AGENTS.md', exists(path.join(projectDir, 'AGENTS.md'))],
    ['docs/00-constitution.md', exists(path.join(projectDir, 'docs', '00-constitution.md'))],
    ['docs/20-implementation-status.md', exists(path.join(projectDir, 'docs', '20-implementation-status.md'))],
    ['.agents/skills', exists(path.join(projectDir, '.agents', 'skills'))],
    ['.anycrew/hooks/lint-after-edit.sh', exists(path.join(projectDir, '.anycrew', 'hooks', 'lint-after-edit.sh'))],
  ];
  console.log('\nProject files');
  for (const [name, ok] of checks) console.log(`  ${ok ? '✔' : '✘'} ${name}`);
  if (config?.commands?.check) console.log(`\nCheck command: ${config.commands.check}`);
  return 0;
}

async function list(projectDir) {
  const pack = loadPack();
  const config = readConfig(projectDir) ?? {};
  const over = config.models ?? {};
  const cell = (tool, tier) => {
    const m = modelFor(pack.models, over, tool, tier);
    if (m === undefined || m === null || m === '') return 'inherit';
    if (typeof m === 'object') return [m.model, m.effort ?? m.model_reasoning_effort].filter(Boolean).join('/') || 'inherit';
    return String(m);
  };
  const head = ['agent', 'tier', ...TOOLS];
  const rows = pack.agents.map((a) => [a.id, a.data.tier, ...TOOLS.map((t) => cell(t, a.data.tier))]);
  const widths = head.map((h, i) => Math.max(h.length, ...rows.map((r) => String(r[i]).length)));
  const line = (r) => r.map((c, i) => String(c).padEnd(widths[i])).join('  ');
  console.log(line(head)); console.log(widths.map((w) => '-'.repeat(w)).join('  '));
  for (const r of rows) console.log(line(r));
  console.log(`\nTiers: ${TIERS.map((t) => `${t} = ${pack.models.tiers[t].purpose}`).join('\n       ')}`);
  console.log(`Skills (${pack.skills.length}): ${pack.skills.map((s) => '/' + s.id).join(' ')}`);
  return 0;
}

async function presets() {
  const pack = loadPack();
  for (const p of Object.values(pack.presets)) console.log(`${p.id.padEnd(24)} ${p.name}\n${' '.repeat(24)} ${p.description}`);
  return 0;
}
