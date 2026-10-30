// Writes the Claude Code plugin's agents (.claude-plugin/agents/*.md) from the canonical agents with
// the default tier mapping, and lists them in .claude-plugin/plugin.json. Run after editing agents/.
import fs from 'node:fs';
import path from 'node:path';
import { loadPack, PACK_ROOT } from '../lib/pack.mjs';
import { claudePluginAgents } from '../lib/generate.mjs';

const pack = loadPack();
const built = claudePluginAgents(pack);
fs.mkdirSync(path.join(PACK_ROOT, '.claude-plugin', 'agents'), { recursive: true });
for (const [file, content] of Object.entries(built)) fs.writeFileSync(path.join(PACK_ROOT, file), content);
const mp = path.join(PACK_ROOT, '.claude-plugin', 'plugin.json');
const manifest = JSON.parse(fs.readFileSync(mp, 'utf8'));
manifest.agents = Object.keys(built).map((f) => `./${f}`);
fs.writeFileSync(mp, JSON.stringify(manifest, null, 2) + '\n');
console.log(`${Object.keys(built).length} plugin agents written; manifest updated`);
