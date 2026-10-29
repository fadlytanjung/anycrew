import path from 'node:path';
import fs from 'node:fs';
import { stringify } from './frontmatter.mjs';
import { MARKER, writeGenerated, writeIfMissing, readIf, mkdirp, exists } from './fsx.mjs';
import { modelFor } from './pack.mjs';

const HEAD = (src) => `<!-- ${MARKER} from ${src} — edit the source and run \`npx anycrew sync\` -->\n`;
const HOOK_REL = '.anycrew/hooks/lint-after-edit.sh';

export function fill(text, vars) {
  return text.replace(/\{\{([a-z_]+)\}\}/g, (_, k) => (vars[k] ?? `{{${k}}}`));
}

/** Variables shared by every template, derived from the project config and preset. */
export function templateVars(config, preset) {
  const c = { ...preset.commands, ...(config.commands ?? {}) };
  const l = preset.layout ?? {};
  const sketch = [
    `${config.project}/`,
    '├── AGENTS.md                  agent guide (read first)',
    '├── docs/                      specs, ADRs, status',
    l.contracts ? `├── ${l.contracts}/                 machine-readable contracts` : null,
    l.backend && l.backend !== '.' ? `├── ${l.backend}/` : null,
    l.frontend ? `├── ${l.frontend}/` : null,
    '└── .agents/                   rules, skills, agents (anycrew)',
  ].filter(Boolean).join('\n');
  const bullets = (arr) => (arr && arr.length ? arr.map((s) => `- ${s}`).join('\n') : '');
  return {
    project: config.project,
    purpose: config.purpose || '',
    preset: preset.id,
    setup_cmd: c.setup, dev_cmd: c.dev, check_cmd: c.check, test_cmd: c.test, lint_cmd: c.lint,
    deploy_cmd: c.deploy ?? 'TODO: deploy command',
    contracts_dir: l.contracts || 'contracts',
    prompts_dir: l.backend && l.backend !== '.' ? `${l.backend}/app/prompts/` : 'prompts/',
    layout_sketch: sketch,
    backend_conventions: preset.backend_conventions?.length ? `### Backend\n${bullets(preset.backend_conventions)}` : '',
    frontend_conventions: preset.frontend_conventions?.length ? `### Frontend\n${bullets(preset.frontend_conventions)}` : '',
    date: new Date().toISOString().slice(0, 10),
  };
}

/** The effective rule set: canonical rules plus preset-derived stack rules. */
export function effectiveRules(pack, preset) {
  const rules = pack.rules.map((r) => ({ ...r, globs: [] }));
  const pr = preset.rules ?? {};
  const llm = rules.find((r) => r.id.startsWith('50-'));
  if (llm) llm.globs = pr.llm_globs ?? [];
  const add = (id, title, items, globs) => {
    if (!items?.length || !globs?.length) return;
    rules.push({
      id, globs, data: { trigger: 'glob', globs: globs.join(', '), description: `${title} conventions for ${preset.name}.` },
      body: `# ${title} conventions\n\n${items.map((s) => `- ${s}`).join('\n')}\n`,
    });
  };
  add('20-backend', 'Backend', preset.backend_conventions, pr.backend_globs);
  add('30-frontend', 'Frontend', preset.frontend_conventions, pr.frontend_globs);
  return rules.sort((a, b) => a.id.localeCompare(b.id));
}

function selected(list, excludes = []) { return list.filter((x) => !excludes.includes(x.id)); }

export function generate({ pack, config, preset, projectDir, tools, force = false, report }) {
  const vars = templateVars(config, preset);
  const rules = effectiveRules(pack, preset);
  const agents = selected(pack.agents, config.agents?.exclude);
  const skills = selected(pack.skills, config.skills?.exclude);
  const over = config.models ?? {};
  const P = (...p) => path.join(projectDir, ...p);
  const w = (rel, content) => writeGenerated(P(rel), content, report, { force });

  // ---- Universal layer: AGENTS.md, .agents/{rules,skills,agents}, hook script ----
  const agentsMd = fill(pack.templates.read('AGENTS.md'), vars);
  if (!exists(P('AGENTS.md'))) writeIfMissing(P('AGENTS.md'), agentsMd, report);
  else report.notes.push('AGENTS.md exists; left untouched (it is yours to edit).');

  for (const r of rules) {
    const fm = { trigger: r.data.trigger, description: r.data.description };
    if (r.data.trigger === 'glob' || (r.globs.length && r.data.trigger === 'model_decision')) {
      if (r.globs.length) { fm.trigger = 'glob'; fm.globs = r.globs.join(', '); }
    }
    w(`.agents/rules/${r.id}.md`, stringify(fm, HEAD('anycrew/rules') + '\n' + r.body));
  }
  for (const s of skills) {
    w(`.agents/skills/${s.id}/SKILL.md`, stringify(s.data, HEAD(`anycrew/skills/${s.id}`) + '\n' + s.body));
    copyExtras(s.dir, P('.agents', 'skills', s.id), report, force);
  }
  if (tools.includes('antigravity')) {
    for (const a of agents) {
      const fm = { name: a.data.name, description: a.data.description, model: modelFor(pack.models, over, 'antigravity', a.data.tier) ?? 'inherit' };
      w(`.agents/agents/${a.id}.md`, stringify(fm, HEAD(`anycrew/agents/${a.id}`) + '\n' + a.body));
    }
  }
  const hookOn = config.hooks?.lint_after_edit !== false;
  if (hookOn) {
    const hp = P(HOOK_REL);
    const [shebang, ...rest] = pack.hookScript.split('\n');
    const script = `${shebang}\n# ${MARKER}\n${rest.join('\n')}`;
    if (writeGenerated(hp, script, report, { force: true })) fs.chmodSync(hp, 0o755);
  }

  // ---- Claude Code ----
  if (tools.includes('claude')) {
    w('CLAUDE.md', `${HEAD('anycrew/templates/CLAUDE.md')}@AGENTS.md\n`);
    for (const a of agents) {
      const m = modelFor(pack.models, over, 'claude', a.data.tier);
      const fm = { name: a.data.name, description: a.data.description };
      if (m && typeof m === 'object') { fm.model = m.model; if (m.effort) fm.effort = m.effort; } else if (m) fm.model = m;
      if (a.data.tools) fm.tools = a.data.tools;
      w(`.claude/agents/${a.id}.md`, stringify(fm, HEAD(`anycrew/agents/${a.id}`) + '\n' + a.body));
    }
    for (const s of skills) {
      w(`.claude/skills/${s.id}/SKILL.md`, stringify(s.data, HEAD(`anycrew/skills/${s.id}`) + '\n' + s.body));
      copyExtras(s.dir, P('.claude', 'skills', s.id), report, force);
    }
    for (const r of rules) {
      const fm = {};
      if (r.globs.length) fm.paths = r.globs;
      w(`.claude/rules/${r.id}.md`, (r.globs.length ? stringify(fm, '') : '') + HEAD('anycrew/rules') + '\n' + r.body);
    }
    if (hookOn) mergeClaudeSettings(P('.claude', 'settings.json'), report);
  }

  // ---- Codex ----
  if (tools.includes('codex')) {
    for (const a of agents) {
      const m = modelFor(pack.models, over, 'codex', a.data.tier) ?? {};
      const lines = [`# ${MARKER} from anycrew/agents/${a.id} — edit the source and run \`npx anycrew sync\``,
        `name = ${JSON.stringify(a.data.name)}`, `description = ${JSON.stringify(a.data.description)}`];
      if (m.model) lines.push(`model = ${JSON.stringify(m.model)}`);
      if (m.model_reasoning_effort) lines.push(`model_reasoning_effort = ${JSON.stringify(m.model_reasoning_effort)}`);
      lines.push('', `developer_instructions = '''`, a.body.replace(/'''/g, "''\\'"), `'''`, '');
      w(`.codex/agents/${a.id}.toml`, lines.join('\n'));
    }
    report.notes.push('Codex reads AGENTS.md and .agents/skills natively; custom agents are in .codex/agents/*.toml.');
  }

  // ---- Antigravity hooks ----
  if (tools.includes('antigravity') && hookOn) {
    const hooks = { $comment: MARKER, 'anycrew-lint': { PostToolUse: [{ matcher: 'write_to_file|replace_file_content|multi_replace_file_content', hooks: [{ type: 'command', command: `./${HOOK_REL}`, timeout: 60 }] }] } };
    mergeJsonNamed(P('.agents', 'hooks.json'), 'anycrew-lint', hooks['anycrew-lint'], report);
  }

  // ---- Cursor ----
  if (tools.includes('cursor')) {
    for (const r of rules) {
      const always = r.data.trigger === 'always_on';
      const fm = { description: r.data.description };
      if (r.globs.length) fm.globs = r.globs.join(',');
      fm.alwaysApply = always;
      w(`.cursor/rules/${r.id}.mdc`, stringify(fm, HEAD('anycrew/rules') + '\n' + r.body));
    }
    for (const a of agents) {
      const fm = { name: a.data.name, description: a.data.description, model: modelFor(pack.models, over, 'cursor', a.data.tier) ?? 'inherit' };
      w(`.cursor/agents/${a.id}.md`, stringify(fm, HEAD(`anycrew/agents/${a.id}`) + '\n' + a.body));
    }
    if (hookOn) mergeCursorHooks(P('.cursor', 'hooks.json'), report);
    report.notes.push('Cursor reads .agents/skills natively; no skill copies were made under .cursor/.');
  }

  // ---- OpenCode ----
  if (tools.includes('opencode')) {
    for (const a of agents) {
      const fm = { description: a.data.description, mode: 'subagent' };
      const m = modelFor(pack.models, over, 'opencode', a.data.tier);
      if (m) fm.model = m;
      w(`.opencode/agents/${a.id}.md`, stringify(fm, HEAD(`anycrew/agents/${a.id}`) + '\n' + a.body));
    }
    report.notes.push('OpenCode reads AGENTS.md and .agents/skills natively; agents are in .opencode/agents/.');
  }

  // ---- GitHub Copilot ----
  if (tools.includes('copilot')) {
    const alwaysOn = rules.filter((r) => r.data.trigger === 'always_on').map((r) => r.body).join('\n');
    w('.github/copilot-instructions.md', fill(pack.templates.read('copilot-instructions.md'), { always_on_rules: alwaysOn }));
    for (const r of rules.filter((r) => r.globs.length)) {
      w(`.github/instructions/${r.id}.instructions.md`, stringify({ applyTo: r.globs.join(',') }, HEAD('anycrew/rules') + '\n' + r.body));
    }
    for (const a of agents) {
      const fm = { name: a.data.name, description: a.data.description };
      const m = modelFor(pack.models, over, 'copilot', a.data.tier);
      if (m) fm.model = m;
      w(`.github/agents/${a.id}.agent.md`, stringify(fm, HEAD(`anycrew/agents/${a.id}`) + '\n' + a.body));
    }
    if (hookOn) {
      const hooks = { $comment: MARKER, version: 1, hooks: { postToolUse: [{ type: 'command', bash: `./${HOOK_REL}`, timeoutSec: 60 }] } };
      w('.github/hooks/anycrew.json', JSON.stringify(hooks, null, 2) + '\n');
    }
    report.notes.push('Copilot reads AGENTS.md and .agents/skills natively; agents are in .github/agents/.');
  }
  return report;
}

function copyExtras(srcDir, dstDir, report, force) {
  for (const d of fs.readdirSync(srcDir, { withFileTypes: true })) {
    if (d.name === 'SKILL.md') continue;
    const s = path.join(srcDir, d.name); const t = path.join(dstDir, d.name);
    if (d.isDirectory()) { mkdirp(t); copyExtras(s, t, report, force); }
    else writeGenerated(t, fs.readFileSync(s, 'utf8'), report, { force: true });
  }
}

function mergeClaudeSettings(file, report) {
  let json = {};
  const cur = readIf(file);
  if (cur) { try { json = JSON.parse(cur); } catch { report.skipped.push({ path: file, reason: 'not valid JSON; add the PostToolUse hook by hand' }); return; } }
  json.hooks ??= {};
  json.hooks.PostToolUse ??= [];
  const entry = { matcher: 'Write|Edit|MultiEdit', hooks: [{ type: 'command', command: `"$CLAUDE_PROJECT_DIR"/${HOOK_REL}`, timeout: 60, statusMessage: 'anycrew: linting edited file…' }] };
  const idx = json.hooks.PostToolUse.findIndex((e) => JSON.stringify(e).includes(HOOK_REL));
  if (idx >= 0) json.hooks.PostToolUse[idx] = entry; else json.hooks.PostToolUse.push(entry);
  const out = JSON.stringify(json, null, 2) + '\n';
  if (out !== cur) { mkdirp(path.dirname(file)); fs.writeFileSync(file, out); report.written.push(file); } else report.unchanged.push(file);
}

function mergeJsonNamed(file, key, value, report) {
  let json = {};
  const cur = readIf(file);
  if (cur) { try { json = JSON.parse(cur); } catch { report.skipped.push({ path: file, reason: 'not valid JSON' }); return; } }
  json[key] = value;
  const out = JSON.stringify(json, null, 2) + '\n';
  if (out !== cur) { mkdirp(path.dirname(file)); fs.writeFileSync(file, out); report.written.push(file); } else report.unchanged.push(file);
}

function mergeCursorHooks(file, report) {
  let json = { version: 1, hooks: {} };
  const cur = readIf(file);
  if (cur) { try { json = JSON.parse(cur); } catch { report.skipped.push({ path: file, reason: 'not valid JSON' }); return; } }
  json.version ??= 1; json.hooks ??= {}; json.hooks.afterFileEdit ??= [];
  const entry = { command: `./${HOOK_REL}` };
  if (!json.hooks.afterFileEdit.some((e) => JSON.stringify(e).includes(HOOK_REL))) json.hooks.afterFileEdit.push(entry);
  const out = JSON.stringify(json, null, 2) + '\n';
  if (out !== cur) { mkdirp(path.dirname(file)); fs.writeFileSync(file, out); report.written.push(file); } else report.unchanged.push(file);
}

/** Create the docs skeleton; never overwrites an existing doc. */
export function scaffoldDocs({ pack, config, preset, projectDir, report, all = false }) {
  const vars = templateVars(config, preset);
  const essential = new Set(['README.md', '00-constitution.md', '20-implementation-status.md', 'glossary.md', path.join('adr', 'README.md'), path.join('adr', 'ADR-template.md'), path.join('specs', 'README.md'), path.join('specs', 'NNN-template', 'spec.md'), path.join('specs', 'NNN-template', 'plan.md'), path.join('specs', 'NNN-template', 'tasks.md')]);
  for (const t of pack.templates.docs) {
    if (!all && !essential.has(t.rel)) continue;
    writeIfMissing(path.join(projectDir, 'docs', t.rel), fill(t.text, vars), report);
  }
}
