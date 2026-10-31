import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from './frontmatter.mjs';
import { listDir, readIf } from './fsx.mjs';

export const PACK_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const TOOLS = ['claude', 'codex', 'antigravity', 'cursor', 'opencode', 'copilot'];
export const TIERS = ['fast', 'balanced', 'strong'];

export function loadPack() {
  const pkg = JSON.parse(fs.readFileSync(path.join(PACK_ROOT, 'package.json'), 'utf8'));
  const models = JSON.parse(fs.readFileSync(path.join(PACK_ROOT, 'models.json'), 'utf8'));
  const agents = listDir(path.join(PACK_ROOT, 'agents'))
    .filter((d) => d.isFile() && d.name.endsWith('.md'))
    .map((d) => {
      const file = path.join(PACK_ROOT, 'agents', d.name);
      const { data, body } = parse(fs.readFileSync(file, 'utf8'));
      return { id: d.name.replace(/\.md$/, ''), file, data, body: body.trim() + '\n' };
    })
    .sort((a, b) => a.id.localeCompare(b.id));
  const skills = listDir(path.join(PACK_ROOT, 'skills'))
    .filter((d) => d.isDirectory())
    .map((d) => {
      const dir = path.join(PACK_ROOT, 'skills', d.name);
      const text = readIf(path.join(dir, 'SKILL.md')) ?? '';
      const { data, body } = parse(text);
      return { id: d.name, dir, data, body: body.trim() + '\n', raw: text };
    })
    .sort((a, b) => a.id.localeCompare(b.id));
  const rules = listDir(path.join(PACK_ROOT, 'rules'))
    .filter((d) => d.isFile() && d.name.endsWith('.md'))
    .map((d) => {
      const file = path.join(PACK_ROOT, 'rules', d.name);
      const { data, body } = parse(fs.readFileSync(file, 'utf8'));
      return { id: d.name.replace(/\.md$/, ''), file, data, body: body.trim() + '\n' };
    })
    .sort((a, b) => a.id.localeCompare(b.id));
  const presets = Object.fromEntries(
    listDir(path.join(PACK_ROOT, 'presets'))
      .filter((d) => d.isFile() && d.name.endsWith('.json'))
      .map((d) => { const p = JSON.parse(fs.readFileSync(path.join(PACK_ROOT, 'presets', d.name), 'utf8')); return [p.id, p]; }),
  );
  const templates = {
    read: (rel) => fs.readFileSync(path.join(PACK_ROOT, 'templates', rel), 'utf8'),
    docs: walk(path.join(PACK_ROOT, 'templates', 'docs')),
  };
  const hookScript = fs.readFileSync(path.join(PACK_ROOT, 'hooks', 'scripts', 'lint-after-edit.sh'), 'utf8');
  const architectures = JSON.parse(fs.readFileSync(path.join(PACK_ROOT, 'catalog', 'architectures.json'), 'utf8'));
  return { version: pkg.version, models, agents, skills, rules, presets, templates, hookScript, architectures };
}

function walk(root, rel = '') {
  const out = [];
  for (const d of listDir(path.join(root, rel))) {
    const r = path.join(rel, d.name);
    if (d.isDirectory()) out.push(...walk(root, r));
    else out.push({ rel: r, text: fs.readFileSync(path.join(root, r), 'utf8') });
  }
  return out;
}

/** Resolve the model setting for a tool and tier, honouring project overrides. */
export function modelFor(models, overrides, tool, tier) {
  const base = models.tools?.[tool]?.[tier];
  const over = overrides?.[tool]?.[tier];
  if (over !== undefined) return over;
  return base;
}

export function loadPreset(pack, idOrPath) {
  if (!idOrPath) return pack.presets.generic;
  if (pack.presets[idOrPath]) return pack.presets[idOrPath];
  if (fs.existsSync(idOrPath)) return JSON.parse(fs.readFileSync(idOrPath, 'utf8'));
  throw new Error(`unknown preset "${idOrPath}" (available: ${Object.keys(pack.presets).join(', ')})`);
}
