// Builds the Claude Code plugin at plugins/claude/ from the canonical pack: tiered agents (Claude's
// loader reads only the plugin's default agents/ folder, so they must live in their own plugin root),
// a copy of the skills, the hooks and the manifest. The marketplace (.claude-plugin/marketplace.json)
// points at this folder. Run after editing agents/, skills/, hooks/ or the version; validation checks
// that the folder is fresh.
import fs from 'node:fs';
import path from 'node:path';
import { loadPack, PACK_ROOT } from '../lib/pack.mjs';
import { claudePluginFiles } from '../lib/generate.mjs';

const pack = loadPack();
const out = path.join(PACK_ROOT, 'plugins', 'claude');
fs.rmSync(out, { recursive: true, force: true });
const files = claudePluginFiles(pack);
for (const [rel, content] of Object.entries(files)) {
  const p = path.join(out, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  if (Buffer.isBuffer(content)) fs.writeFileSync(p, content); else fs.writeFileSync(p, content);
  if (rel.endsWith('.sh')) fs.chmodSync(p, 0o755);
}
console.log(`plugins/claude: ${Object.keys(files).length} files written (${pack.agents.length} agents, ${pack.skills.length} skills)`);
