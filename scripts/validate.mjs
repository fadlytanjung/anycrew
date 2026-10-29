// Validates the canonical pack: agents, skills, rules, presets and the model mapping.
// Run with `npm run validate`. Exit code 1 on any error.
import fs from 'node:fs';
import path from 'node:path';
import { loadPack, PACK_ROOT, TOOLS, TIERS } from '../lib/pack.mjs';

const errors = [];
const warn = [];
const E = (m) => errors.push(m);
const pack = loadPack();

const SKILL_FIELDS = new Set(['name', 'description', 'license', 'compatibility', 'metadata', 'allowed-tools']);
const AGENT_FIELDS = new Set(['name', 'description', 'tier', 'model', 'phase', 'reads', 'writes', 'tools']);

for (const a of pack.agents) {
  const d = a.data;
  if (d.name !== a.id) E(`agents/${a.id}.md: name "${d.name}" must equal file name`);
  if (!d.description || d.description.length < 40) E(`agents/${a.id}.md: description missing or too short`);
  if (d.description && d.description.length > 1024) E(`agents/${a.id}.md: description over 1024 chars`);
  if (!TIERS.includes(d.tier)) E(`agents/${a.id}.md: tier must be one of ${TIERS.join('|')}`);
  const claude = pack.models.tools.claude[d.tier];
  if (claude && d.model !== claude.model) E(`agents/${a.id}.md: model "${d.model}" must equal models.json claude.${d.tier}.model ("${claude.model}")`);
  for (const k of Object.keys(d)) if (!AGENT_FIELDS.has(k)) warn.push(`agents/${a.id}.md: unknown front matter field "${k}"`);
  if (a.body.length > 12000) warn.push(`agents/${a.id}.md: body is ${a.body.length} chars; keep agents under ~12k for context cost`);
  if (!/^# /m.test(a.body)) E(`agents/${a.id}.md: body needs a top-level heading`);
}

const names = new Set();
for (const s of pack.skills) {
  const d = s.data;
  if (d.name !== s.id) E(`skills/${s.id}: name "${d.name}" must equal directory name`);
  if (!/^[a-z0-9-]{1,64}$/.test(s.id)) E(`skills/${s.id}: name must be lowercase a-z0-9- and <= 64 chars`);
  if (!d.description || d.description.length < 40) E(`skills/${s.id}: description missing or too short`);
  if (d.description && d.description.length > 1024) E(`skills/${s.id}: description over 1024 chars`);
  for (const k of Object.keys(d)) if (!SKILL_FIELDS.has(k)) E(`skills/${s.id}: non-spec front matter field "${k}" (Agent Skills spec allows ${[...SKILL_FIELDS].join(', ')})`);
  if (d.metadata && typeof d.metadata === 'object') {
    const agent = d.metadata['anycrew-agent'];
    if (agent && !pack.agents.some((a) => a.id === agent)) E(`skills/${s.id}: metadata anycrew-agent "${agent}" is not an agent`);
  }
  if (s.raw.length > 8000) warn.push(`skills/${s.id}: SKILL.md is ${s.raw.length} bytes; Codex budgets ~8 KB per skill body`);
  if (names.has(s.id)) E(`duplicate skill ${s.id}`); names.add(s.id);
}

for (const r of pack.rules) {
  if (!['always_on', 'model_decision', 'glob', 'manual'].includes(r.data.trigger)) E(`rules/${r.id}.md: trigger must be always_on|model_decision|glob|manual`);
  if (!r.data.description) E(`rules/${r.id}.md: description missing`);
  if (Buffer.byteLength(r.body) > 24000) E(`rules/${r.id}.md: over Antigravity's 24 KB rule limit`);
}
const always = pack.rules.filter((r) => r.data.trigger === 'always_on').reduce((n, r) => n + r.body.length, 0);
if (always > 20000) warn.push(`always-on rules total ${always} chars; keep well under the ~20k-token rules budget`);

for (const [id, p] of Object.entries(pack.presets)) {
  for (const k of ['id', 'name', 'description', 'commands', 'layout', 'rules']) if (!(k in p)) E(`presets/${id}.json: missing "${k}"`);
  for (const k of ['setup', 'dev', 'check', 'test', 'lint']) if (!p.commands?.[k]) E(`presets/${id}.json: commands.${k} missing`);
  if (p.id !== id) E(`presets/${id}.json: id mismatch`);
}

for (const t of TOOLS) {
  if (!pack.models.tools[t]) { E(`models.json: tools.${t} missing`); continue; }
  for (const tier of TIERS) if (!(tier in pack.models.tools[t])) E(`models.json: tools.${t}.${tier} missing`);
}
for (const tier of TIERS) if (!pack.models.tiers[tier]?.purpose) E(`models.json: tiers.${tier}.purpose missing`);

const pkg = JSON.parse(fs.readFileSync(path.join(PACK_ROOT, 'package.json'), 'utf8'));
for (const f of ['.claude-plugin/plugin.json', 'plugin.json']) {
  const j = JSON.parse(fs.readFileSync(path.join(PACK_ROOT, f), 'utf8'));
  if (j.version !== pkg.version) E(`${f}: version ${j.version} != package.json ${pkg.version}`);
  if (j.name !== 'anycrew') E(`${f}: name must be anycrew`);
}
const mk = JSON.parse(fs.readFileSync(path.join(PACK_ROOT, '.claude-plugin/marketplace.json'), 'utf8'));
if (mk.plugins?.[0]?.version !== pkg.version) E(`.claude-plugin/marketplace.json: plugin version != package.json`);

for (const a of pack.agents) {
  const used = pack.skills.some((s) => s.data.metadata?.['anycrew-agent'] === a.id);
  if (!used) warn.push(`agent ${a.id} is not referenced by any skill's metadata`);
}

for (const w of warn) console.log(`warn: ${w}`);
for (const e of errors) console.error(`error: ${e}`);
console.log(`\n${pack.agents.length} agents, ${pack.skills.length} skills, ${pack.rules.length} rules, ${Object.keys(pack.presets).length} presets - ${errors.length} error(s), ${warn.length} warning(s)`);
process.exit(errors.length ? 1 : 0);
